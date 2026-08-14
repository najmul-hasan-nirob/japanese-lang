// =====================================================
// Hard Vocabulary — Lessons page only
// =====================================================
// Saves starred vocabulary in localStorage so the list survives
// refreshes and can be practiced later.
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const typePanel = document.getElementById("typePanel");
    const typeBtn = document.getElementById("typeBtn");
    if (!grid || !typePanel) return;

    const STORAGE_KEY = "japanese-lang-hard-vocabulary";
    let hardMode = false;
    let previousTypeState = null;

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

    function updateTypeButtonLabel() {
        if (!typeBtn) return;
        const boxes = Array.from(typePanel.querySelectorAll('input[type="checkbox"]'));
        const selected = boxes.filter(box => box.checked);
        if (selected.length === boxes.length) {
            typeBtn.textContent = "All types";
        } else if (selected.length === 0) {
            typeBtn.textContent = "None";
        } else {
            typeBtn.textContent = selected
                .map(box => box.closest("label").textContent.trim())
                .join(" + ");
        }
    }

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
        if (!hardMode) {
            grid.querySelectorAll(":scope > .card").forEach(card => {
                card.style.display = "";
            });
            return;
        }

        grid.querySelectorAll(":scope > .card").forEach(card => {
            const vocabBack = card.querySelector(".vocabulary-back");
            if (!vocabBack) {
                card.style.display = "none";
                return;
            }
            card.style.display = hardWords.has(cardKey(card)) ? "" : "none";
        });
    }

    function refreshHardView() {
        // Rendering the normal vocabulary list is synchronous, but the grid
        // mutation and star insertion are observed asynchronously. Run the
        // filter on the next two animation frames so the freshly rendered
        // cards are definitely present before we hide/show them.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                addStars();
                applyHardFilter();
                updateTypeButtonLabel();
            });
        });
    }

    const observer = new MutationObserver(() => {
        addStars();
        if (hardMode) applyHardFilter();
    });
    observer.observe(grid, { childList: true });

    hardCheckbox.addEventListener("change", event => {
        event.stopImmediatePropagation();

        if (hardCheckbox.checked) {
            // Remember the user's normal Type filter so leaving Hard vocabulary
            // returns to exactly the previous selection.
            previousTypeState = Array.from(typePanel.querySelectorAll('input[type="checkbox"]'))
                .filter(box => box !== hardCheckbox)
                .map(box => ({ value: box.value, checked: box.checked }));

            hardMode = true;

            // Hard vocabulary is a vocabulary-only view. Let the normal
            // renderer rebuild the current lesson cards, then filter them to
            // the starred vocabulary.
            const normalBoxes = Array.from(typePanel.querySelectorAll('input[type="checkbox"]'))
                .filter(box => box !== hardCheckbox);
            normalBoxes.forEach(box => {
                box.checked = box.value === "vocabulary";
            });

            const vocabularyBox = typePanel.querySelector('input[value="vocabulary"]');
            if (vocabularyBox) {
                vocabularyBox.dispatchEvent(new Event("change", { bubbles: true }));
            }

            refreshHardView();
        } else {
            hardMode = false;

            // Restore the Type filter exactly as it was before Hard vocabulary
            // was selected, then allow the normal renderer to rebuild the grid.
            if (previousTypeState) {
                previousTypeState.forEach(saved => {
                    const box = typePanel.querySelector(`input[value="${CSS.escape(saved.value)}"]`);
                    if (box) box.checked = saved.checked;
                });
            }

            const restoreBox = typePanel.querySelector('input[value="vocabulary"]');
            if (restoreBox) {
                restoreBox.dispatchEvent(new Event("change", { bubbles: true }));
            }

            refreshHardView();
        }

        updateTypeButtonLabel();
    }, true);

    typePanel.addEventListener("change", event => {
        if (event.target === hardCheckbox || !hardMode) return;
        refreshHardView();
    });

    addStars();
    updateTypeButtonLabel();
});
