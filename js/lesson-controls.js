// =====================================================
// Lesson Kana ↔ Romaji direction control
// =====================================================
// Kana mode:
//   Front = Japanese/Kana
//   Back  = Romaji → English → Bangla
//
// Romaji mode:
//   Front = Romaji
//   Back  = Japanese/Kana → English → Bangla
// =====================================================

var showJapaneseFirst = true;

(function () {
    function updateDirectionUI() {
        const direction = document.getElementById("direction");
        const leftLabel = document.getElementById("directionLeftLabel");
        const rightLabel = document.getElementById("directionRightLabel");
        if (!direction) return;

        direction.classList.toggle("right", !showJapaneseFirst);
        direction.setAttribute("aria-pressed", String(!showJapaneseFirst));

        if (leftLabel) {
            leftLabel.textContent = "Kana";
            leftLabel.classList.toggle("active", showJapaneseFirst);
        }

        if (rightLabel) {
            rightLabel.textContent = "Romaji";
            rightLabel.classList.toggle("active", !showJapaneseFirst);
        }
    }

    function getVocabularyItems() {
        const items = [];
        if (typeof lessonsData === "undefined") return items;

        Object.values(lessonsData).forEach(lesson => {
            if (!lesson || !Array.isArray(lesson.vocabulary)) return;
            lesson.vocabulary.forEach(item => items.push(item));
        });

        return items;
    }

    function syncVocabularyBackCards() {
        const cards = document.querySelectorAll("#grid .vocabulary-back");
        if (!cards.length) return;

        const vocabulary = getVocabularyItems();

        cards.forEach(back => {
            const card = back.closest(".card");
            const front = card?.querySelector(".front > div");
            const english = back.querySelector(".english");
            const firstLine = back.querySelector(".romaji");

            if (!front || !english || !firstLine) return;

            const frontText = front.textContent.trim();
            const englishText = english.textContent.trim();

            // Match by Romaji + English when Romaji is shown first.
            // Match by Japanese + English when Kana is shown first.
            const item = vocabulary.find(v => {
                const jp = String(v.jp || "").trim();
                const romaji = String(v.romaji || "").trim();
                const en = String(v.en || "").trim();

                if (en !== englishText) return false;
                return showJapaneseFirst ? jp === frontText : romaji === frontText;
            });

            if (!item) return;

            if (showJapaneseFirst) {
                // Kana front → Romaji back.
                firstLine.textContent = item.romaji || "";
                firstLine.style.display = "";
            } else {
                // Romaji front → Kana back.
                firstLine.textContent = item.jp || "";
                firstLine.style.display = "";
            }
        });
    }

    function refreshCardsAfterDirectionChange() {
        // lesson-filter.js owns rendering. Wait until its normal click listener
        // has rebuilt the cards, then update the vocabulary back side.
        setTimeout(syncVocabularyBackCards, 0);
    }

    function initLessonDirection() {
        const direction = document.getElementById("direction");
        if (!direction) return;

        if (direction.__lessonDirectionHandler) {
            direction.removeEventListener("click", direction.__lessonDirectionHandler, true);
        }

        direction.__lessonDirectionHandler = function (event) {
            event.preventDefault();
            showJapaneseFirst = !showJapaneseFirst;
            updateDirectionUI();
            refreshCardsAfterDirectionChange();
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

        updateDirectionUI();
        syncVocabularyBackCards();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLessonDirection);
    } else {
        initLessonDirection();
    }
})();
