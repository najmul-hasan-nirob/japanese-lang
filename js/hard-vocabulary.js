// =====================================================
// Hard Vocabulary — Lessons page only
// =====================================================
// Starred vocabulary is stored locally and can be practiced
// through the Type > Hard vocabulary filter.
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const typePanel = document.getElementById("typePanel");
    const typeBtn = document.getElementById("typeBtn");
    if (!grid || !typePanel) return;

    const STORAGE_KEY = "japanese-lang-hard-vocabulary";
    let hardMode = false;
    let previousTypeState = null;
    let syncTimer = null;

    function loadHardWords() {
        try {
            const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return new Set(Array.isArray(value) ? value : []);
        } catch (_) {
            return new Set();
        }
    }

    function saveHardWords() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...hardWords]));
    }

    let hardWords = loadHardWords();

    function ensureHardCheckbox() {
        let checkbox = typePanel.querySelector('input[value="hard"]');
        if (checkbox) return checkbox;

        const label = document.createElement("label");
        checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = "hard";
        checkbox.id = "hardVocabularyFilter";
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" Hard vocabulary"));
        typePanel.appendChild(label);
        bindHardCheckbox(checkbox);
        return checkbox;
    }

    function cardKey(card) {
        const front = card.querySelector(".front > div")?.textContent?.trim() || "";
        const romaji = card.querySelector(".romaji")?.textContent?.trim() || "";
        const english = card.querySelector(".english")?.textContent?.trim() || "";
        return [front, romaji, english].join("|");
    }

    function updateStar(star, active) {
        star.textContent = active ? "★" : "☆";
        star.classList.toggle("active", active);
        star.setAttribute("aria-pressed", String(active));
        star.setAttribute("aria-label", active ? "Remove from hard vocabulary" : "Mark as hard vocabulary");
        star.title = active ? "Remove from hard vocabulary" : "Hard vocabulary";
    }

    function addStars() {
        grid.querySelectorAll(":scope > .card").forEach(card => {
            if (!card.querySelector(".vocabulary-back")) return;
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

                    if (hardWords.has(key)) hardWords.delete(key);
                    else hardWords.add(key);
                    saveHardWords();
                    updateStar(star, hardWords.has(key));

                    if (hardMode) syncHardView();
                });
                card.appendChild(star);
            }
            updateStar(star, hardWords.has(key));
        });
    }

    function updateTypeButtonLabel() {
        if (!typeBtn) return;
        const boxes = Array.from(typePanel.querySelectorAll('input[type="checkbox"]'));
        const selected = boxes.filter(box => box.checked);
        if (selected.length === boxes.length) typeBtn.textContent = "All types";
        else if (selected.length === 0) typeBtn.textContent = "None";
        else typeBtn.textContent = selected.map(box => box.closest("label")?.textContent.trim() || box.value).join(" + ");
    }

    function applyHardFilter() {
        const cards = Array.from(grid.querySelectorAll(":scope > .card"));
        cards.forEach(card => {
            const vocab = card.querySelector(".vocabulary-back");
            const visible = !hardMode || (vocab && hardWords.has(cardKey(card)));
            card.style.display = visible ? "" : "none";
        });
        addStars();
        updateTypeButtonLabel();
        grid.dispatchEvent(new CustomEvent("hardVocabularyUpdated", { bubbles: true }));
    }

    function syncHardView() {
        clearTimeout(syncTimer);
        syncTimer = setTimeout(() => {
            addStars();
            if (hardMode) applyHardFilter();
        }, 0);
    }

    function renderNormalVocabularyThenFilter() {
        const hardCheckbox = ensureHardCheckbox();
        const boxes = Array.from(typePanel.querySelectorAll('input[type="checkbox"]'));
        const normalBoxes = boxes.filter(box => box !== hardCheckbox);

        // IMPORTANT: the normal lesson renderer does not know that "hard"
        // is a special filter. If it sees hard checked, it can render zero
        // cards. Temporarily remove hard from the renderer's input, ask it to
        // render Vocabulary, then restore Hard mode after the DOM is updated.
        hardCheckbox.checked = false;
        normalBoxes.forEach(box => {
            box.checked = box.value === "vocabulary";
        });

        const vocabularyBox = typePanel.querySelector('input[value="vocabulary"]');
        if (vocabularyBox) {
            vocabularyBox.dispatchEvent(new Event("change", { bubbles: true }));
        }

        hardCheckbox.checked = true;
        syncHardView();
    }

    function bindHardCheckbox(checkbox) {
        if (checkbox.dataset.hardBound === "1") return;
        checkbox.dataset.hardBound = "1";

        checkbox.addEventListener("change", event => {
            event.stopPropagation();

            if (checkbox.checked) {
                previousTypeState = Array.from(typePanel.querySelectorAll('input[type="checkbox"]'))
                    .filter(box => box !== checkbox)
                    .map(box => ({ value: box.value, checked: box.checked }));

                hardMode = true;
                renderNormalVocabularyThenFilter();
            } else {
                hardMode = false;

                if (previousTypeState) {
                    previousTypeState.forEach(saved => {
                        const box = typePanel.querySelector(`input[value="${CSS.escape(saved.value)}"]`);
                        if (box) box.checked = saved.checked;
                    });
                }

                const restoreBox = typePanel.querySelector('input[value="vocabulary"]');
                if (restoreBox) restoreBox.dispatchEvent(new Event("change", { bubbles: true }));
                syncHardView();
            }

            updateTypeButtonLabel();
        });
    }

    ensureHardCheckbox();

    // If another script rebuilds the Type panel, recreate the Hard option and
    // keep the active state. This is particularly important on mobile where
    // WebView/browser rendering can happen at different times.
    const typeObserver = new MutationObserver(() => {
        const checkbox = ensureHardCheckbox();
        bindHardCheckbox(checkbox);
        if (hardMode && !checkbox.checked) checkbox.checked = true;
        updateTypeButtonLabel();
    });
    typeObserver.observe(typePanel, { childList: true, subtree: true });

    const gridObserver = new MutationObserver(mutations => {
        if (!mutations.some(m => m.addedNodes.length || m.removedNodes.length)) return;
        syncHardView();
    });
    gridObserver.observe(grid, { childList: true });

    addStars();
    updateTypeButtonLabel();
});
