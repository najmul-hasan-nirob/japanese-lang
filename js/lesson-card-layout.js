// =====================================================
// Lesson card layout — Lessons page only
// =====================================================
// Structure:
// .card
//   .lesson-card-inner
//     .lesson-card-topbar
//       hard star | card number | speaker
//     .lesson-card-content
//       front / back
//
// The topbar is independent from the card content so the
// front/back content has its own full, centered area.
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    if (!grid) return;

    function layoutCard(card) {
        if (!card || card.dataset.cardLayoutReady === "true") return;
        const inner = document.createElement("div");
        inner.className = "lesson-card-inner";
        while (card.firstChild) inner.appendChild(card.firstChild);
        card.appendChild(inner);

        const topbar = document.createElement("div");
        topbar.className = "lesson-card-topbar";
        topbar.setAttribute("aria-label", "Card controls");
        const content = document.createElement("div");
        content.className = "lesson-card-content";
        const controls = Array.from(inner.querySelectorAll(":scope > .hard-star, :scope > .lesson-card-number, :scope > .speaker-btn"));
        controls.forEach(control => topbar.appendChild(control));
        Array.from(inner.children).forEach(child => {
            if (child !== topbar) content.appendChild(child);
        });
        inner.appendChild(topbar);
        inner.appendChild(content);
        card.classList.add("lesson-card-layout");
        card.dataset.cardLayoutReady = "true";
        showSpeaker(card);
    }

    function showSpeaker(card) {
        card.querySelectorAll(".speaker-btn").forEach(btn => {
            btn.style.display = "flex";
            btn.style.visibility = "visible";
            btn.style.opacity = "1";
        });
    }

    function processCards() {
        grid.querySelectorAll(":scope > .card").forEach(card => {
            if (card.dataset.cardLayoutReady === "true") {
                const inner = card.querySelector(":scope > .lesson-card-inner");
                const topbar = inner?.querySelector(":scope > .lesson-card-topbar");
                if (!inner || !topbar) return;
                [".hard-star", ".lesson-card-number", ".speaker-btn"].forEach(selector => {
                    inner.querySelectorAll(`:scope > ${selector}`).forEach(control => topbar.appendChild(control));
                });
                showSpeaker(card);
                return;
            }
            layoutCard(card);
        });
    }

    processCards();
    const observer = new MutationObserver(() => setTimeout(processCards, 0));
    observer.observe(grid, { childList: true, subtree: true });
});

// Add the な-adjective marker from the lesson data itself.
// Lesson vocabulary marks な-adjectives with [な], so this stays
// synchronized automatically as Lessons 1–25 are updated.
(function addNaAdjectiveLabels() {
    function addLabels() {
        document.querySelectorAll('#grid > .card').forEach(card => {
            const item = card.__lessonItem;
            if (!item || item.type !== 'vocabulary') return;

            const jp = String(item.jp || '').trim();
            if (!/\[な\]/.test(jp)) return;

            card.querySelectorAll('.front, .back').forEach(side => {
                if (side.querySelector('.na-adjective-label')) return;
                const label = document.createElement('span');
                label.className = 'adjective-label na-adjective-label';
                label.textContent = '(な adj.)';
                side.appendChild(label);
            });
        });
    }

    function init() {
        addLabels();
        const grid = document.getElementById('grid');
        if (grid) new MutationObserver(() => setTimeout(addLabels, 0)).observe(grid, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();