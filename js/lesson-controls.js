// =====================================================
// Lesson card controls
// - Kana ↔ Romaji direction switch
// - Separate back-card Romaji visibility switch
// - Keeps the current Lesson card structure intact, including Bangla.
// =====================================================

var showJapaneseFirst = true;

(function () {
    function getCardParts(card) {
        const front = card.querySelector(".front > div:last-child, .front > div");
        const back = card.querySelector(".vocabulary-back");
        if (!front || !back) return null;

        const romaji = back.querySelector(".romaji");
        const english = back.querySelector(".english");
        const bangla = back.querySelector(".bangla");
        const tag = back.querySelector(".lesson-tag");

        if (!romaji || !english || !bangla) return null;

        return {
            front,
            back,
            kana: front.textContent.trim(),
            romaji: romaji.textContent.trim(),
            english: english.textContent.trim(),
            bangla: bangla.textContent.trim(),
            tag: tag ? tag.outerHTML : ""
        };
    }

    function switchExistingCards() {
        document.querySelectorAll("#grid .card").forEach(card => {
            const back = card.querySelector(".vocabulary-back");
            if (!back) return;

            let data = card.__lessonDirectionData;

            if (!data) {
                data = getCardParts(card);
                if (!data) return;
                card.__lessonDirectionData = data;
            }

            if (showJapaneseFirst) {
                data.front.textContent = data.kana;
                data.back.innerHTML = `
                    ${data.tag}
                    <span class="romaji">${data.romaji}</span>
                    <span class="english">${data.english}</span>
                    <span class="bangla">${data.bangla}</span>
                `;
            } else {
                data.front.textContent = data.romaji;
                data.back.innerHTML = `
                    ${data.tag}
                    <span class="kana-back">${data.kana}</span>
                    <span class="english">${data.english}</span>
                    <span class="bangla">${data.bangla}</span>
                `;
            }
        });
    }

    function initLessonControls() {
        const direction = document.getElementById("direction");
        const leftLabel = document.getElementById("directionLeftLabel");
        const rightLabel = document.getElementById("directionRightLabel");
        const toolbar = document.querySelector(".toolbar");

        if (!direction || !toolbar) return;

        let romajiBtn = document.getElementById("romajiToggle");

        if (!romajiBtn) {
            const field = document.createElement("div");
            field.className = "field lesson-romaji-control";

            const label = document.createElement("label");
            label.textContent = "Back Romaji";

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

            document.querySelectorAll("#grid .vocabulary-back .romaji").forEach(el => {
                el.style.display = romajiVisible ? "" : "none";
            });
        }

        if (direction.__lessonDirectionHandler) {
            direction.removeEventListener("click", direction.__lessonDirectionHandler, true);
        }

        direction.__lessonDirectionHandler = function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            showJapaneseFirst = !showJapaneseFirst;
            updateDirectionUI();
            switchExistingCards();
            updateRomajiUI();
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
