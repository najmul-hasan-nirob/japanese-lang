// Lesson card sequence numbers — Lessons page only
// Shows 1, 2, 3... at the top-center of cards while Order = Normal.
// Numbers follow the currently visible card order after all filters.

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const mode = document.getElementById("mode");
    if (!grid || !mode) return;

    const NUMBER_CLASS = "lesson-card-number";
    let timer = null;

    function updateNumbers() {
        const cards = Array.from(grid.querySelectorAll(":scope > .card"));
        const normal = mode.value === "normal";
        let number = 1;

        cards.forEach(card => {
            let badge = card.querySelector(`.${NUMBER_CLASS}`);

            if (!normal || card.style.display === "none") {
                if (badge) badge.remove();
                return;
            }

            if (!badge) {
                badge = document.createElement("span");
                badge.className = NUMBER_CLASS;
                badge.setAttribute("aria-hidden", "true");
                card.appendChild(badge);
            }

            badge.textContent = number++;
        });
    }

    function scheduleUpdate() {
        clearTimeout(timer);
        timer = setTimeout(updateNumbers, 0);
    }

    mode.addEventListener("change", scheduleUpdate);

    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(grid, {
        childList: true,
        attributes: true,
        attributeFilter: ["style"]
    });

    // Other Lesson controls may change the visible cards without changing
    // the Order select, so keep the numbering synchronized with the grid.
    document.addEventListener("hardVocabularyUpdated", scheduleUpdate);

    updateNumbers();
});
