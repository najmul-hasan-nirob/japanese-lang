// =====================================================
// Lessons page: show Front / Back on all cards
// =====================================================
// This control is intentionally NOT a Kana ↔ Romaji switch.
// It acts like clicking every lesson card at the same time.
//
// Front = every card shows its front side.
// Back  = every card shows its back side.
// =====================================================

(function () {
    let showBack = false;
    let observer = null;

    function getCards() {
        return Array.from(document.querySelectorAll("#grid .card"));
    }

    function updateSwitchUI() {
        const direction = document.getElementById("direction");
        const leftLabel = document.getElementById("directionLeftLabel");
        const rightLabel = document.getElementById("directionRightLabel");

        if (!direction) return;

        direction.classList.toggle("right", showBack);
        direction.setAttribute("aria-pressed", String(showBack));

        if (leftLabel) {
            leftLabel.textContent = "Front";
            leftLabel.classList.toggle("active", !showBack);
        }

        if (rightLabel) {
            rightLabel.textContent = "Back";
            rightLabel.classList.toggle("active", showBack);
        }
    }

    function applyCardState() {
        getCards().forEach(card => {
            card.classList.toggle("flipped", showBack);
        });
    }

    function toggleAllCards() {
        showBack = !showBack;
        updateSwitchUI();
        applyCardState();
    }

    function init() {
        const direction = document.getElementById("direction");
        const grid = document.getElementById("grid");

        if (!direction || !grid) return;

        // Repurpose the existing header abacus only on the Lessons page.
        direction.setAttribute("aria-label", "Show all lesson cards front or back");

        if (direction.__lessonCardsHandler) {
            direction.removeEventListener("click", direction.__lessonCardsHandler);
        }

        direction.__lessonCardsHandler = function (event) {
            event.preventDefault();
            toggleAllCards();
        };

        direction.addEventListener("click", direction.__lessonCardsHandler);

        if (direction.__lessonCardsKeyHandler) {
            direction.removeEventListener("keydown", direction.__lessonCardsKeyHandler);
        }

        direction.__lessonCardsKeyHandler = function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleAllCards();
            }
        };

        direction.addEventListener("keydown", direction.__lessonCardsKeyHandler);

        updateSwitchUI();
        applyCardState();

        // lesson-filter.js rebuilds #grid when filters/order change.
        // Keep the current Front/Back state for newly created cards.
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => {
            if (showBack) applyCardState();
        });
        observer.observe(grid, { childList: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
