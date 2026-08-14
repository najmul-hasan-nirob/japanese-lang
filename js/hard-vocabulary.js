// =====================================================
// Hard Vocabulary — Lessons page only
// =====================================================
// Saves starred vocabulary in localStorage so the list survives
// refreshes and can be practiced later.
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const typePanel = document.getElementById("typePanel");
    if (!grid || !typePanel) return;

    const STORAGE_KEY = "japanese-lang-hard-vocabulary";
    let hardMode = false;

    function loadHardWords() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return new Set(Array.isArray(saved) ? saved : []);
        } catch (_) {
            return new Set();
        }
    }

    function saveHardWords(set) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    }

    let hardWords = loadHardWords();

    if (!typePanel.querySelector('input[value="hard"]')) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = "hard";
        checkbox.id = "hardVocabularyFilter";
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" Hard vocabulary"));
        typePanel.appendChild(label);
    }

    const hardCheckbox = typePanel.querySelector('input[value="hard"]');

    function cardKey(card) {
        const front = card.querySelector(".front > div")?.textContent?.trim() || "";
        const back = card.querySelector(".romaji")?.textContent?.trim() || "";
        const english = card.querySelector(".english")?.textContent?.trim() || "";
        return [front, back, english].join("|");
    }

    function updateStar(star, active) {
        star.textContent = active ? "★" : "☆";
        star.classList.toggle("active", active);
        star.setAttribute("aria-pressed", String(active));
        star.setAttribute("aria-label", active ? "Remove from hard vocabulary" : "Mark as hard vocabulary");
        star.setAttribute("title", active ? "Remove from hard vocabulary" : "Hard vocabulary");
    }

    function addStars() {
        grid.querySelectorAll(":scope > .card").forEach(card => {
            const vocabBack = card.querySelector(".vocabulary-back");
            if (!vocabBack) return;

            const key = cardKey(card);
            if (!key) return;

            let star = card.querySelector(".hard-star");
            if (!star) {
                star = document.createElement("button");
                star.type = "button";
                star.className = "hard-star";
                star.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (hardWords.has(key)) {
                        hardWords.delete(key);
                    } else {
                        hardWords.add(key);
                    }
                    saveHardWords(hardWords);
                    updateStar(star, hardWords.has(key));

                    if (hardMode) applyHardFilter();
                });
                card.appendChild(star);
            }

            updateStar(star, hardWords.has(key));
        });
    }

    function applyHardFilter() {
        if (!hardMode) return;
        grid.querySelectorAll(":scope > .card").forEach(card => {
            const vocabBack = card.querySelector(".vocabulary-back");
            if (!vocabBack) {
                card.style.display = "none";
                return;
            }
            card.style.display = hardWords.has(cardKey(card)) ? "" : "none";
        });
    }

    const observer = new MutationObserver(() => {
        addStars();
        applyHardFilter();
    });
    observer.observe(grid, { childList: true });

    hardCheckbox.addEventListener("change", event => {
        event.stopImmediatePropagation();
        hardMode = hardCheckbox.checked;

        hardCheckbox.checked = false;

        const normalBox = typePanel.querySelector('input[type="checkbox"]:not([value="hard"])');
        if (normalBox) normalBox.dispatchEvent(new Event("change", { bubbles: true }));

        setTimeout(() => {
            hardCheckbox.checked = hardMode;
            addStars();
            applyHardFilter();
        }, 0);
    }, true);

    typePanel.addEventListener("change", event => {
        if (event.target === hardCheckbox || !hardMode) return;
        setTimeout(() => applyHardFilter(), 0);
    });

    addStars();
});
