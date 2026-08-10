// =====================================================
// Lesson card controls
// - Kana ↔ Romaji direction switch
// - Separate back-card Romaji visibility switch
// - Keeps the current Lesson card structure intact, including Bangla.
// =====================================================

var showJapaneseFirst = true;

(function () {
    let romajiVisible = true;

    function updateDirectionUI() {
        const direction = document.getElementById("direction");
        const leftLabel = document.getElementById("directionLeftLabel");
        const rightLabel = document.getElementById("directionRightLabel");
        if (!direction) return;

        if (leftLabel) {
            leftLabel.textContent = "Kana";
            leftLabel.classList.toggle("active", showJapaneseFirst);
        }
        if (rightLabel) {
            rightLabel.textContent = "Romaji";
            rightLabel.classList.toggle("active", !showJapaneseFirst);
        }
        direction.setAttribute("aria-pressed", String(!showJapaneseFirst));
    }

    function updateRomajiUI() {
        const button = document.getElementById("romajiToggle");
        if (button) {
            button.textContent = romajiVisible ? "Romaji: ON" : "Romaji: OFF";
            button.setAttribute("aria-pressed", String(romajiVisible));
        }

        document.querySelectorAll("#grid .vocabulary-back .romaji").forEach(el => {
            el.style.display = romajiVisible ? "" : "none";
        });
    }

    function initLessonControls() {
        const direction = document.getElementById("direction");
        const romajiBtn = document.getElementById("romajiToggle");
        if (!direction || !romajiBtn) return;

        // The lesson-filter.js direction listener is intentionally allowed to run
        // after this capture listener. We change the state first, then its
        // renderer rebuilds the cards using the new direction.
        if (direction.__lessonDirectionHandler) {
            direction.removeEventListener("click", direction.__lessonDirectionHandler, true);
        }

        direction.__lessonDirectionHandler = function (event) {
            event.preventDefault();
            showJapaneseFirst = !showJapaneseFirst;
            updateDirectionUI();

            // lesson-filter.js renders the cards in its normal bubble listener.
            // Re-apply the Romaji visibility after that render completes.
            setTimeout(updateRomajiUI, 0);
        };
        direction.addEventListener("click", direction.__lessonDirectionHandler, true);

        if (direction.__lessonKeydownHandler) {
            direction.removeEventListener("keydown", direction.__lessonKeydownHandler);
        }
        direction.__lessonKeydownHandler = function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                direction.click();
            }
        };
        direction.addEventListener("keydown", direction.__lessonKeydownHandler);

        if (romajiBtn.__lessonRomajiHandler) {
            romajiBtn.removeEventListener("click", romajiBtn.__lessonRomajiHandler);
        }
        romajiBtn.__lessonRomajiHandler = function () {
            romajiVisible = !romajiVisible;
            updateRomajiUI();
        };
        romajiBtn.addEventListener("click", romajiBtn.__lessonRomajiHandler);

        updateDirectionUI();
        updateRomajiUI();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLessonControls);
    } else {
        initLessonControls();
    }
})();
