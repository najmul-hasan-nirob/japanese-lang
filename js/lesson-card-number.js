// Lesson card sequence numbers — Lessons page only
// Shows 1, 2, 3... at the top-center of cards while Order = Normal.
// Shuffle never shows serial numbers.
//
// This controller intentionally does not depend on a single render event.
// The Lesson renderer, card layout observer, and other card scripts can all
// run asynchronously when switching Shuffle <-> Normal, so we retry after
// the DOM has settled.

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const mode = document.getElementById("mode");
    if (!grid || !mode) return;

    const NUMBER_CLASS = "lesson-card-number";
    let updateTimer = null;

    function isNormalOrder() {
        return String(mode.value || "").trim().toLowerCase() === "normal";
    }

    function updateNumbers() {
        const cards = Array.from(grid.querySelectorAll(":scope > .card"));
        const normal = isNormalOrder();
        let number = 1;

        cards.forEach(card => {
            let badge = card.querySelector(`.${NUMBER_CLASS}`);

            // Shuffle: remove every existing number.
            if (!normal) {
                if (badge) badge.remove();
                return;
            }

            // Normal: add the number if the freshly-rendered card does not
            // have one yet. Number only cards that are currently visible.
            const hidden = card.style.display === "none" ||
                           getComputedStyle(card).display === "none";

            if (hidden) {
                if (badge) badge.remove();
                return;
            }

            if (!badge) {
                badge = document.createElement("span");
                badge.className = NUMBER_CLASS;
                badge.setAttribute("aria-hidden", "true");
                card.appendChild(badge);
            }

            badge.textContent = String(number++);
        });
    }

    function settleUpdate() {
        updateNumbers();

        // The card renderer and card-layout script use MutationObservers.
        // Run again after each stage so Shuffle -> Normal cannot leave the
        // newly-created cards without their serial numbers.
        [30, 100, 250, 500].forEach(delay => {
            setTimeout(updateNumbers, delay);
        });
    }

    function queueUpdate() {
        clearTimeout(updateTimer);
        updateTimer = setTimeout(settleUpdate, 0);
    }

    // Order selector: this is the important Shuffle -> Normal transition.
    mode.addEventListener("change", queueUpdate);

    // The renderer replaces the entire grid when Order/filters change.
    const observer = new MutationObserver(queueUpdate);
    observer.observe(grid, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
    });

    document.addEventListener("lessonCardsRendered", queueUpdate);
    document.addEventListener("hardVocabularyUpdated", queueUpdate);

    // Initial state.
    settleUpdate();
});
