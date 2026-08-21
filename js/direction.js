// =====================================================
// Shared Front / Back switch for Kana, Numbers & Lessons
// =====================================================
// The switch always controls the actual card face state.
// Front = all cards show their front.
// Back  = all cards show their back.
// =====================================================

(function () {
    function moveToDesktopToolbar() {
        if (window.innerWidth <= 520) return;

        const direction = document.getElementById("direction");
        const toolbar = document.querySelector(".toolbar");
        if (!direction || !toolbar) return;

        // Lessons already has the direction field. Reuse it instead of
        // creating a second field. This prevents the duplicate Cards field.
        let field = document.getElementById("directionFilterField");
        if (!field) field = toolbar.querySelector(".direction-field");

        if (!field) {
            field = document.createElement("div");
            field.id = "directionFilterField";
            field.className = "field direction-filter-field";
            toolbar.appendChild(field);
        } else {
            field.id = field.id || "directionFilterField";
            field.classList.add("direction-filter-field");
        }

        // Never show the old Cards label. The control itself carries
        // the visible Front / Back label and icon.
        const label = field.querySelector("label");
        if (label) label.remove();

        field.appendChild(direction);
    }

    function initDirectionSwitch() {
        const direction = document.getElementById("direction");
        const grid = document.getElementById("grid");
        if (!direction || !grid) return;

        let showBack = false;

        function updateUI() {
            direction.classList.toggle("right", showBack);
            direction.setAttribute("aria-pressed", String(showBack));
            direction.setAttribute("aria-label", showBack ? "Show all cards Front" : "Show all cards Back");
            direction.setAttribute("title", showBack ? "Show Front" : "Show Back");
        }

        function applyState() {
            grid.querySelectorAll(":scope > .card:not(.blank)").forEach(card => {
                card.classList.toggle("flipped", showBack);
            });
        }

        function toggle() {
            showBack = !showBack;
            updateUI();
            applyState();
        }

        direction.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            toggle();
        }, true);

        direction.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopImmediatePropagation();
                toggle();
            }
        }, true);

        updateUI();
        applyState();
        moveToDesktopToolbar();

        const observer = new MutationObserver(() => {
            if (showBack) applyState();
        });
        observer.observe(grid, { childList: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDirectionSwitch);
    } else {
        initDirectionSwitch();
    }
})();
