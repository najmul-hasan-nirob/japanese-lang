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
        return JSON.stringify([
            item.lesson || "",
            item.type || "",
            item.jp || "",
            item.en || "",
            item.bn || ""
        ]);
    }

    function currentCards() {
        return Array.from(grid.querySelectorAll(":scope > .card"));
    }

    function orderSignature(cards) {
        return cards.map(cardKey).filter(Boolean).sort().join("\u001f");
    }

    function saveShuffleOrder(cards) {
        const keys = cards.map(cardKey).filter(Boolean);
        if (!keys.length) return;
        setLocal(SHUFFLE_KEY, {
            signature: keys.slice().sort().join("\u001f"),
            order: keys,
            updatedAt: Date.now()
        });
    }

    function restoreShuffleOrder(cards) {
        if (String(mode.value || "").trim().toLowerCase() !== "shuffle") return false;

        const saved = getLocal(SHUFFLE_KEY, null);
        const currentKeys = cards.map(cardKey).filter(Boolean);
        if (!saved || !Array.isArray(saved.order) || !currentKeys.length) return false;

        const signature = orderSignature(cards);
        if (saved.signature !== signature || saved.order.length !== currentKeys.length) return false;

        const byKey = new Map();
        cards.forEach(card => byKey.set(cardKey(card), card));
        const ordered = [];
        const used = new Set();

        saved.order.forEach(key => {
            const card = byKey.get(key);
            if (card && !used.has(card)) {
                ordered.push(card);
                used.add(card);
            }
        });

        if (ordered.length !== cards.length) return false;

        const fragment = document.createDocumentFragment();
        ordered.forEach(card => fragment.appendChild(card));
        grid.appendChild(fragment);
        return true;
    }

    function persistOrRestoreShuffleOrder() {
        const cards = currentCards();
        if (!cards.length) return;

        if (String(mode.value || "").trim().toLowerCase() === "shuffle") {
            if (!restoreShuffleOrder(cards)) saveShuffleOrder(cards);
        }
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
});
