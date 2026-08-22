// Lesson card sequence numbers — Lessons page only
// Normal order: show 1, 2, 3... in the card's topbar.
// Shuffle order: remove the serial numbers.
//
// Important: the Lesson card topbar script restructures every freshly-rendered
// card. Therefore numbers are inserted directly into .lesson-card-topbar
// instead of first being appended to .card and waiting for another script to
// move them. This makes Shuffle -> Normal deterministic.

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const mode = document.getElementById("mode");
    if (!grid || !mode) return;

    const NUMBER_CLASS = "lesson-card-number";
    let timer = null;

    function isNormalOrder() {
        return String(mode.value || "").trim().toLowerCase() === "normal";
    }

    function updateNumbers() {
        const cards = Array.from(grid.querySelectorAll(":scope > .card"));
        const normal = isNormalOrder();
        let number = 1;

        cards.forEach(card => {
            // The topbar is created by lesson-card-topbar.js. If it has not
            // been created yet, leave this card alone and the observer/retry
            // will run again after the structure is ready.
            const topbar = card.querySelector(":scope > .lesson-card-inner > .lesson-card-topbar");
            if (!topbar) return;

            const badges = Array.from(topbar.querySelectorAll(`.${NUMBER_CLASS}`));

            if (!normal) {
                badges.forEach(badge => badge.remove());
                return;
            }

            // Only one number is allowed per card.
            const badge = badges[0] || document.createElement("span");
            badges.slice(1).forEach(item => item.remove());

            badge.className = NUMBER_CLASS;
            badge.setAttribute("aria-hidden", "true");
            badge.textContent = String(number++);

            if (badge.parentElement !== topbar) {
                // Put it directly in the center slot of the topbar.
                topbar.appendChild(badge);
            }
        });
    }

    function queueUpdate() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            updateNumbers();
            // Topbar restructuring itself runs through a MutationObserver, so
            // make sure we also run after that observer has completed.
            setTimeout(updateNumbers, 20);
            setTimeout(updateNumbers, 100);
            setTimeout(updateNumbers, 300);
        }, 0);
    }

    mode.addEventListener("change", queueUpdate);

    const observer = new MutationObserver(queueUpdate);
    observer.observe(grid, {
        childList: true,
        subtree: true
    });

    document.addEventListener("lessonCardsRendered", queueUpdate);
    document.addEventListener("hardVocabularyUpdated", queueUpdate);

    // Expose a small hook for the card-topbar script so it can request a
    // numbering pass after it finishes restructuring newly-rendered cards.
    window.updateLessonCardNumbers = updateNumbers;

    queueUpdate();
});
