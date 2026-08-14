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
    let renderTimer = null;

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

    // Create the filter immediately so it exists even if the normal lesson
    // renderer has not finished initializing yet.
    let hardCheckbox = typePanel.querySelector('input[value="hard"]');
    if (!hardCheckbox) {
        const label = document.createElement("label");
        hardCheckbox = document.createElement("input");
        hardCheckbox.type = "checkbox";
        hardCheckbox.value = "hard";
        hardCheckbox.id = "hardVocabularyFilter";
        label.appendChild(hardCheckbox);
        label.appendChild(document.createTextNode(" Hard vocabulary"));
        typePanel.appendChild(label);
    }

    function updateTypeButtonLabel() {
        if (!typeBtn) return;
        const boxes = Array.from(typePanel.querySelectorAll('input[type="checkbox"]'));
        const selected = boxes.filter(box => box.checked);
        if (selected.length === boxes.length) typeBtn.textContent = "All types";
        else if (selected.length === 0) typeBtn.textContent = "None";
        else typeBtn.textContent = selected.map(box => box.closest("label")?.textContent.trim() || box.value).join(" + ");
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
                    saveHardWords(hardWords);
                    updateStar(star, hardWords.has(key));
                    // Do not wait for a renderer or animation frame. If the
                    // Hard view is active, update the visible grid immediately.
                    if (hardMode) applyHardFilter();
                });
                card.appendChild(star);
            }
            updateStar(star, hardWords.has(key));
        });
    }

    function applyHardFilter() {
        const cards = Array.from(grid.querySelectorAll(":scope > .card"));
        cards.forEach(card => {
            const vocab = card.querySelector(".vocabulary-back");
            card.style.display = hardMode && (!vocab || !hardWords.has(cardKey(card))) ? "none" : "";
        });
        addStars();
        updateTypeButtonLabel();
        // Keep any existing card-count logic informed by the actual visibility.
        grid.dispatchEvent(new CustomEvent("hardVocabularyUpdated", { bubbles: true }));
    }

    function waitForRenderedCards(callback, attempts = 30) {
        if (grid.querySelector(":scope > .card")) {
            callback();
            return;
        }
        if (attempts <= 0) {
            callback();
            return;
        }
        setTimeout(() => waitForRenderedCards(callback, attempts - 1), 20);
    }

    function refreshHardView() {
        clearTimeout(renderTimer);
        renderTimer = setTimeout(() => {
            waitForRenderedCards(() => {
                addStars();
                applyHardFilter();
            });
        }, 0);
    }

    // Observe only card additions/removals. This avoids depending on mobile
    // requestAnimationFrame timing and also avoids a MutationObserver loop.
    const observer = new MutationObserver(mutations => {
        if (!mutations.some(m => m.addedNodes.length || m.removedNodes.length)) return;
        addStars();
        if (hardMode) applyHardFilter();
    });
    observer.observe(grid, { childList: true });

    hardCheckbox.addEventListener("change", event => {
        event.stopImmediatePropagation();

        if (hardCheckbox.checked) {
            previousTypeState = Array.from(typePanel.querySelectorAll('input[type="checkbox"]'))
                .filter(box => box !== hardCheckbox)
                .map(box => ({ value: box.value, checked: box.checked }));

            hardMode = true;

            // Keep the normal renderer in vocabulary mode, then apply the hard
            // filter after its cards have actually been inserted into the DOM.
            const normalBoxes = Array.from(typePanel.querySelectorAll('input[type="checkbox"]'))
                .filter(box => box !== hardCheckbox);
            normalBoxes.forEach(box => { box.checked = box.value === "vocabulary"; });

            const vocabularyBox = typePanel.querySelector('input[value="vocabulary"]');
            if (vocabularyBox) vocabularyBox.dispatchEvent(new Event("change", { bubbles: true }));
            refreshHardView();
        } else {
            hardMode = false;

            if (previousTypeState) {
                previousTypeState.forEach(saved => {
                    const box = Array.from(typePanel.querySelectorAll('input[type="checkbox"]'))
                        .find(input => input.value === saved.value);
                    if (box) box.checked = saved.checked;
                });
            }

            const restoreBox = typePanel.querySelector('input[value="vocabulary"]');
            if (restoreBox) restoreBox.dispatchEvent(new Event("change", { bubbles: true }));
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
