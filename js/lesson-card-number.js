// =====================================================
// Lesson card sequence numbers + persisted Shuffle order — Lessons page only.
// Serial numbers are shown for BOTH Normal and Shuffle orders.
// Shuffle order is cached locally and included in Cloud Sync by supabase-sync.js.


document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const mode = document.getElementById("mode");
    if (!grid || !mode) return;

    const NUMBER_CLASS = "lesson-card-number";
    const SHUFFLE_KEY = "japanese-lang-lesson-shuffle-v1";
    let timer = null;

    function getLocal(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "null");
            return value == null ? fallback : value;
        } catch (_) { return fallback; }
    }

    function setLocal(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
    }

    function cardKey(card) {
        const item = card?.__lessonItem;
        if (!item) return "";
        return JSON.stringify([item.lesson || "", item.type || "", item.jp || "", item.en || "", item.bn || ""]);
    }

    function currentCards() { return Array.from(grid.querySelectorAll(":scope > .card")); }
    function orderSignature(cards) { return cards.map(cardKey).filter(Boolean).sort().join("\u001f"); }

    function saveShuffleOrder(cards) {
        const keys = cards.map(cardKey).filter(Boolean);
        if (!keys.length) return;
        setLocal(SHUFFLE_KEY, { signature: keys.slice().sort().join("\u001f"), order: keys, updatedAt: Date.now() });
    }

    function restoreShuffleOrder(cards) {
        if (String(mode.value || "").trim().toLowerCase() !== "shuffle") return false;
        const saved = getLocal(SHUFFLE_KEY, null);
        const currentKeys = cards.map(cardKey).filter(Boolean);
        if (!saved || !Array.isArray(saved.order) || !currentKeys.length) return false;
        if (saved.signature !== orderSignature(cards) || saved.order.length !== currentKeys.length) return false;

        // Already in the saved order — do not touch the DOM or trigger our observer again.
        if (saved.order.length === currentKeys.length && saved.order.every((key, i) => key === currentKeys[i])) return true;

        const byKey = new Map();
        cards.forEach(card => byKey.set(cardKey(card), card));
        const ordered = [];
        const used = new Set();
        saved.order.forEach(key => {
            const card = byKey.get(key);
            if (card && !used.has(card)) { ordered.push(card); used.add(card); }
        });
        if (ordered.length !== cards.length) return false;

        const fragment = document.createDocumentFragment();
        ordered.forEach(card => fragment.appendChild(card));
        grid.appendChild(fragment);
        return true;
    }

    function persistOrRestoreShuffleOrder() {
        const cards = currentCards();
        if (!cards.length || String(mode.value || "").trim().toLowerCase() !== "shuffle") return;
        if (!restoreShuffleOrder(cards)) saveShuffleOrder(cards);
    }

    function updateNumbers() {
        const cards = currentCards();
        let number = 1;
        cards.forEach(card => {
            const topbar = card.querySelector(":scope > .lesson-card-inner > .lesson-card-topbar");
            if (!topbar) return;
            const badges = Array.from(topbar.querySelectorAll(`.${NUMBER_CLASS}`));
            const badge = badges[0] || document.createElement("span");
            badges.slice(1).forEach(item => item.remove());
            badge.className = NUMBER_CLASS;
            badge.setAttribute("aria-hidden", "true");
            badge.textContent = String(number++);
            if (badge.parentElement !== topbar) topbar.appendChild(badge);
        });
    }

    function refresh() {
        persistOrRestoreShuffleOrder();
        updateNumbers();
        setTimeout(() => { persistOrRestoreShuffleOrder(); updateNumbers(); }, 20);
        setTimeout(updateNumbers, 100);
        setTimeout(updateNumbers, 300);
    }

    function queueUpdate() {
        clearTimeout(timer);
        timer = setTimeout(refresh, 0);
    }

    mode.addEventListener("change", queueUpdate);
    const observer = new MutationObserver(queueUpdate);
    observer.observe(grid, { childList: true, subtree: true });
    document.addEventListener("lessonCardsRendered", queueUpdate);
    document.addEventListener("hardVocabularyUpdated", queueUpdate);
    window.addEventListener("japaneseLangCloudLoaded", queueUpdate);

    window.updateLessonCardNumbers = updateNumbers;
    queueUpdate();

    // -----------------------------------------------------
    // Lesson card search — Japanese / Romaji / English / Bangla
    // -----------------------------------------------------
    // Search is layered on top of the existing lesson/type filters. It only
    // hides non-matching cards; it does not rebuild, reorder, or modify cards.
    const countDisplay = document.getElementById("countDisplay");
    if (!countDisplay) return;

    const searchWrap = document.createElement("div");
    searchWrap.className = "lesson-search-wrap";
    searchWrap.innerHTML = `
        <div class="lesson-search-box">
            <span class="lesson-search-icon" aria-hidden="true">⌕</span>
            <input id="lessonSearch" type="search" autocomplete="off" spellcheck="false"
                   placeholder="Search Japanese, Romaji or Bangla..."
                   aria-label="Search lesson cards">
            <button id="lessonSearchClear" type="button" aria-label="Clear search" hidden>×</button>
        </div>
    `;
    countDisplay.parentNode.insertBefore(searchWrap, countDisplay);

    const searchInput = searchWrap.querySelector("#lessonSearch");
    const clearButton = searchWrap.querySelector("#lessonSearchClear");

    const style = document.createElement("style");
    style.textContent = `
        .lesson-search-wrap{max-width:var(--layout-width);margin:0 auto 14px;padding:0 0;box-sizing:border-box}
        .lesson-search-box{position:relative;width:100%;display:flex;align-items:center;box-sizing:border-box}
        .lesson-search-box input{width:100%;height:42px;box-sizing:border-box;padding:8px 40px 8px 38px;border:1px solid var(--paper-line);border-radius:8px;background:var(--paper-cell);color:var(--ink);font:500 14px 'Zen Kaku Gothic New',sans-serif;outline:none;transition:border-color .2s ease,box-shadow .2s ease}
        .lesson-search-box input:focus{border-color:var(--vermilion);box-shadow:0 0 0 2px color-mix(in srgb,var(--vermilion) 15%,transparent)}
        .lesson-search-box input::-webkit-search-cancel-button{display:none;-webkit-appearance:none;appearance:none}
        .lesson-search-box input::-ms-clear{display:none}
        .lesson-search-icon{position:absolute;left:13px;z-index:1;font-size:22px;line-height:1;color:var(--ink-soft);pointer-events:none;transform:translateY(-1px)}
        .lesson-search-box button{position:absolute;right:6px;width:30px;height:30px;padding:0;border:0;border-radius:50%;background:transparent;color:var(--ink-soft);font-size:22px;line-height:1;cursor:pointer}
        .lesson-search-box button:hover{color:var(--vermilion);background:rgba(0,0,0,.05)}
        body.dark .lesson-search-box button:hover{background:rgba(255,255,255,.08)}
        .lesson-search-empty{grid-column:1/-1;text-align:center;padding:28px 12px;color:var(--ink-soft);font-size:14px}
        @media only screen and (max-width:520px){
            .lesson-search-wrap{margin-bottom:10px}
            .lesson-search-box input{height:40px;font-size:13px;padding-left:36px}
        }
    `;
    document.head.appendChild(style);

    function normalizeSearch(value){
        return String(value || "")
            .toLocaleLowerCase()
            .normalize("NFKC")
            .replace(/[\u200B-\u200D\uFEFF]/g, "")
            .trim();
    }

    function getCardSearchText(card){
        const item = card.__lessonItem || {};
        // Prefer the explicit Romaji stored with the lesson data. Some entries
        // have punctuation/kanji that cannot be reliably converted from jp alone.
        const romaji = item.romaji || (typeof toRomaji === "function" ? toRomaji(item.jp || "") : "");
        const bangla = card.__teacherBangla || item.bn || "";
        return normalizeSearch([item.jp, romaji, item.en, bangla, item.lesson, item.type].join(" "));
    }

    function updateSearch(){
        const query = normalizeSearch(searchInput.value);
        clearButton.hidden = !query;
        const cards = currentCards();
        let matches = 0;

        cards.forEach(card => {
            const matched = !query || getCardSearchText(card).includes(query);
            card.dataset.lessonSearchHidden = matched ? "false" : "true";
            card.style.display = matched ? "" : "none";
            if (matched) matches++;
        });

        const empty = grid.querySelector(":scope > .lesson-search-empty");
        if (empty) empty.remove();
        if (query && matches === 0){
            const message = document.createElement("div");
            message.className = "lesson-search-empty";
            message.textContent = `No cards found for “${searchInput.value.trim()}”`;
            grid.appendChild(message);
        }
    }

    searchInput.addEventListener("input", updateSearch);
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.focus();
        updateSearch();
    });

    // Existing filters rebuild the grid. Re-apply the current search after each
    // render without changing their behavior.
    document.addEventListener("lessonCardsRendered", () => setTimeout(updateSearch, 0));
    window.addEventListener("japaneseLangCloudLoaded", () => setTimeout(updateSearch, 0));
});
