// =====================================================
// Shared Front / Back switch for Kana, Numbers & Lessons
// =====================================================
// The switch always controls the actual card face state.
// Front = all cards show their front.
// Back  = all cards show their back.
// Individual cards can still be clicked independently.
// =====================================================

(function () {
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

        // Capture phase prevents the old page-specific Kana/Romaji or
        // reading/number handlers from running.
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

        // Filters, order and lesson changes rebuild the grid. If Back is
        // active, newly created cards must remain on their back as well.
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
