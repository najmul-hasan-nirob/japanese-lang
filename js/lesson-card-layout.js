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

        // Give the card a stable inner wrapper.
        const inner = document.createElement("div");
        inner.className = "lesson-card-inner";

        // Move the existing card children into the inner wrapper.
        while (card.firstChild) inner.appendChild(card.firstChild);
        card.appendChild(inner);

        const topbar = document.createElement("div");
        topbar.className = "lesson-card-topbar";
        topbar.setAttribute("aria-label", "Card controls");

        const content = document.createElement("div");
        content.className = "lesson-card-content";

        // Move the controls into the topbar. These may have been added
        // by hard-vocabulary.js / lesson-card-number.js / card renderer.
        const controls = Array.from(inner.querySelectorAll(":scope > .hard-star, :scope > .lesson-card-number, :scope > .speaker-btn"));
        controls.forEach(control => topbar.appendChild(control));

        // Everything else is the actual front/back card content.
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
            // Controls can be added after the card itself is created.
            // If the card is already laid out, move any newly-added controls.
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

    const observer = new MutationObserver(() => {
        // Defer until the other Lesson scripts finish adding their controls.
        setTimeout(processCards, 0);
    });

    observer.observe(grid, { childList: true, subtree: true });
});
