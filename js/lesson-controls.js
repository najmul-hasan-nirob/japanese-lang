// =====================================================
// Lesson card controls
// - Restores the Kana ↔ Romaji direction switch state.
// - Adds a separate Romaji visibility switch for back cards.
// =====================================================

// lesson-filter.js uses this variable when building cards.
// var is intentionally global so both scripts share the state.
var showJapaneseFirst = true;

(function () {
    function initLessonControls() {
        const direction = document.getElementById("direction");
        const leftLabel = document.getElementById("directionLeftLabel");
        const rightLabel = document.getElementById("directionRightLabel");
        const toolbar = document.querySelector(".toolbar");

        if (!direction || !toolbar) return;

        // The separate switch controls only the Romaji line on vocabulary back cards.
        let romajiBtn = document.getElementById("romajiToggle");

        if (!romajiBtn) {
            const field = document.createElement("div");
            field.className = "field lesson-romaji-control";

            const label = document.createElement("label");
            label.textContent = "Romaji";

            romajiBtn = document.createElement("button");
            romajiBtn.type = "button";
            romajiBtn.id = "romajiToggle";
            romajiBtn.className = "multiselect-btn";
            romajiBtn.setAttribute("aria-pressed", "true");

            field.appendChild(label);
            field.appendChild(romajiBtn);
            toolbar.appendChild(field);
        }

        let romajiVisible = true;

        function updateDirectionUI() {
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
            romajiBtn.textContent = romajiVisible ? "Romaji: ON" : "Romaji: OFF";
            romajiBtn.setAttribute("aria-pressed", String(romajiVisible));
            document.querySelectorAll(".vocabulary-back .romaji").forEach(el => {
                el.style.display = romajiVisible ? "" : "none";
            });
        }

        // Remove only our own previous listener if this script is accidentally initialized twice.
        if (direction.__lessonDirectionHandler) {
            direction.removeEventListener("click", direction.__lessonDirectionHandler);
        }

        direction.__lessonDirectionHandler = function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            showJapaneseFirst = !showJapaneseFirst;
            updateDirectionUI();

            if (typeof renderLessons === "function") {
                renderLessons();
                updateRomajiUI();
            }
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

        romajiBtn.addEventListener("click", function () {
            romajiVisible = !romajiVisible;
            updateRomajiUI();
        });

        updateDirectionUI();
        updateRomajiUI();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLessonControls);
    } else {
        initLessonControls();
    }
})();
