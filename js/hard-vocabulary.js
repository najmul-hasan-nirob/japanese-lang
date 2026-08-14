// =====================================================
// Hard Vocabulary — Lessons page only
// =====================================================
// IMPORTANT: "Hard vocabulary" is an OVERLAY filter.
// It never replaces the user's normal Type selection.
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const typePanel = document.getElementById("typePanel");
    const typeBtn = document.getElementById("typeBtn");
    if (!grid || !typePanel) return;

    const STORAGE_KEY = "japanese-lang-hard-vocabulary";
    let hardMode = false;
    let hardBusy = false;
    let restoreState = null;
    let renderTimer = null;

    function loadHardWords() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return new Set(Array.isArray(data) ? data : []);
        } catch (_) {
            return new Set();
        }
    }

    let hardWords = loadHardWords();

    function saveHardWords() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...hardWords])); } catch (_) {}
    }

    function normalBoxes() {
        return Array.from(typePanel.querySelectorAll('input[type="checkbox"]'))
            .filter(cb => cb.value !== "hard");
    }

    function selectedNormalBoxes() {
        return normalBoxes().filter(cb => cb.checked);
    }

    function getHardCheckbox() {
        return typePanel.querySelector('input[type="checkbox"][value="hard"]');
    }

    function ensureHardCheckbox() {
        let cb = getHardCheckbox();
        if (cb) return cb;

        const label = document.createElement("label");
        cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = "hard";
        cb.id = "hardVocabularyFilter";
        label.appendChild(cb);
        label.appendChild(document.createTextNode(" Hard vocabulary"));
        typePanel.appendChild(label);
        return cb;
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

                    if (hardMode) scheduleHardFilter();
                });
                card.appendChild(star);
            }
            updateStar(star, hardWords.has(key));
        });
    }

    function updateTypeLabel() {
        if (!typeBtn) return;

        const boxes = normalBoxes();
        const selected = boxes.filter(cb => cb.checked);
        const hard = getHardCheckbox();

        const labels = selected.map(cb =>
            cb.closest("label")?.textContent.trim() || cb.value
        );

        if (hard?.checked) labels.push("Hard vocabulary");

        if (!labels.length) typeBtn.textContent = "None";
        else if (labels.length === boxes.length && !hard?.checked) typeBtn.textContent = "All types";
        else typeBtn.textContent = labels.join(" + ");
    }

    function applyHardFilter() {
        if (!hardMode) return;
        const cards = Array.from(grid.querySelectorAll(":scope > .card"));

        cards.forEach(card => {
            const vocab = card.querySelector(".vocabulary-back");
            card.style.display = (vocab && hardWords.has(cardKey(card))) ? "" : "none";
        });

        addStars();
        updateTypeLabel();
        grid.dispatchEvent(new CustomEvent("hardVocabularyUpdated", { bubbles: true }));
    }

    function scheduleHardFilter() {
        clearTimeout(renderTimer);
        renderTimer = setTimeout(() => {
            if (!hardMode) return;
            addStars();
            applyHardFilter();
        }, 30);
    }

    function activateHardMode(cb) {
        if (hardBusy) return;
        hardBusy = true;
        hardMode = true;

        // Remember exactly what the user had selected in Type.
        restoreState = normalBoxes().map(box => ({
            value: box.value,
            checked: box.checked
        }));

        // Hard is only an overlay. Keep every normal Type checkbox exactly
        // as the user selected it. Temporarily uncheck only the Hard box so
        // the normal renderer does not see an unknown "hard" type.
        cb.checked = false;

        const selected = selectedNormalBoxes();
        const renderTrigger = selected[0] || normalBoxes()[0];

        if (renderTrigger) {
            renderTrigger.dispatchEvent(new Event("change", { bubbles: true }));
        }

        // Restore the visible Hard checkbox after the normal renderer has
        // rendered using the original Type selection.
        cb.checked = true;

        setTimeout(() => {
            addStars();
            applyHardFilter();
            hardBusy = false;
        }, 50);

        setTimeout(() => {
            addStars();
            applyHardFilter();
        }, 250);
    }

    function deactivateHardMode(cb) {
        hardMode = false;
        cb.checked = false;

        if (restoreState) {
            restoreState.forEach(saved => {
                const box = typePanel.querySelector(`input[value="${CSS.escape(saved.value)}"]`);
                if (box) box.checked = saved.checked;
            });
        }

        const renderTrigger = selectedNormalBoxes()[0] || normalBoxes()[0];
        if (renderTrigger) renderTrigger.dispatchEvent(new Event("change", { bubbles: true }));

        restoreState = null;
        updateTypeLabel();
    }

    function handleHardChange(event) {
        const cb = event.target;
        if (!cb || cb.value !== "hard") return;

        // Capture phase prevents the normal renderer from receiving the
        // special "hard" checkbox as a normal card type.
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (cb.checked) activateHardMode(cb);
        else deactivateHardMode(cb);
        updateTypeLabel();
    }

    typePanel.addEventListener("change", handleHardChange, true);

    ensureHardCheckbox();

    // If lesson-type.js or another script rebuilds the panel, recreate the
    // Hard option without changing the user's normal Type selections.
    const typeObserver = new MutationObserver(() => {
        const cb = ensureHardCheckbox();
        if (hardMode) cb.checked = true;
        updateTypeLabel();
    });
    typeObserver.observe(typePanel, { childList: true, subtree: true });

    const gridObserver = new MutationObserver(() => {
        addStars();
        if (hardMode) scheduleHardFilter();
    });
    gridObserver.observe(grid, { childList: true });

    addStars();
    updateTypeLabel();
});
