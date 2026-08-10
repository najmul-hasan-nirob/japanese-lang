// =====================================================
// Lessons page controls
// =====================================================
// 1. Front / Back switch: flips all lesson cards.
// 2. Back Romaji switch: hides/shows only the .romaji line
//    on vocabulary backs. It does not affect the card face.
// =====================================================

(function () {
    let showBack = false;
    let showBackRomaji = true;
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

    function updateRomajiUI() {
        const button = document.getElementById("backRomajiToggle");
        if (!button) return;

        button.textContent = showBackRomaji ? "Romaji: ON" : "Romaji: OFF";
        button.setAttribute("aria-pressed", String(showBackRomaji));
    }

    function applyCardState() {
        getCards().forEach(card => {
            card.classList.toggle("flipped", showBack);

            const romaji = card.querySelector(".vocabulary-back .romaji");
            if (romaji) {
                romaji.style.display = showBackRomaji ? "" : "none";
            }
        });
    }

    function toggleAllCards() {
        showBack = !showBack;
        updateSwitchUI();
        applyCardState();
    }

    function toggleBackRomaji() {
        showBackRomaji = !showBackRomaji;
        updateRomajiUI();
        applyCardState();
    }

    function init() {
        const direction = document.getElementById("direction");
        const grid = document.getElementById("grid");
        const romajiButton = document.getElementById("backRomajiToggle");

        if (!direction || !grid) return;

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

        if (romajiButton) {
            if (romajiButton.__handler) {
                romajiButton.removeEventListener("click", romajiButton.__handler);
            }
            romajiButton.__handler = function (event) {
                event.preventDefault();
                toggleBackRomaji();
            };
            romajiButton.addEventListener("click", romajiButton.__handler);
        }

        updateSwitchUI();
        updateRomajiUI();
        applyCardState();

        // lesson-filter.js rebuilds #grid when filters/order change.
        // Preserve both the Front/Back state and Romaji visibility.
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => {
            if (showBack || !showBackRomaji) applyCardState();
        });
        observer.observe(grid, { childList: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
