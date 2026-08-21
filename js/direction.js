// =====================================================
// Shared Front / Back switch for Kana, Numbers & Lessons
// =====================================================
// The switch always controls the actual card face state.
// Front = all cards show their front.
// Back  = all cards show their back.
// Individual cards can still be clicked independently.
//
// Desktop: place the Front / Back switch in the page filter
// toolbar instead of the global header.
// Mobile: the header script moves it to the bottom controls.
// =====================================================

(function () {
    function moveToDesktopToolbar() {
        if (window.innerWidth <= 520) return;

        const direction = document.getElementById("direction");
        const toolbar = document.querySelector(".toolbar");
        if (!direction || !toolbar) return;

        // Already inside the filter area.
        if (direction.closest(".direction-filter-field")) return;

        let field = document.getElementById("directionFilterField");
        if (!field) {
            field = document.createElement("div");
            field.id = "directionFilterField";
            field.className = "field direction-filter-field";

            const label = document.createElement("label");
            label.textContent = "Cards";
            field.appendChild(label);
        }

        field.appendChild(direction);
        toolbar.appendChild(field);
    }

    function initDirectionSwitch() {
        const direction = document.getElementById("direction");
        const leftLabel = document.getElementById("directionLeftLabel");
        const rightLabel = document.getElementById("directionRightLabel");
        const grid = document.getElementById("grid");

        if (!direction || !grid) return;

        let showBack = false;

        function updateUI() {
            direction.classList.toggle("right", showBack);
            direction.setAttribute("aria-pressed", String(showBack));
            direction.setAttribute("aria-label", "Show all cards front or back");

            if (leftLabel) {
                leftLabel.textContent = "Front";
                leftLabel.classList.toggle("active", !showBack);
            }

            if (rightLabel) {
                rightLabel.textContent = "Back";
                rightLabel.classList.toggle("active", showBack);
            }
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

        // Capture phase prevents old page-specific handlers from running.
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

        // Filters/order changes rebuild the grid. If Back is active,
        // newly created cards must remain on their back as well.
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
