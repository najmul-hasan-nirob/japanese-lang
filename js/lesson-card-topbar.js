// =====================================================
// Lesson card top bar
// Hard star + card number + speaker
// Keeps the three controls aligned in one centered row.
// Lessons page only.
// =====================================================
(function () {
    function findSpeaker(card) {
        return card.querySelector(
            '.speaker-btn, .speak-btn, .pronunciation-btn, [aria-label="Play pronunciation"], [aria-label*="pronunciation" i]'
        );
    }

    function setupCard(card) {
        if (!card || card.querySelector('.lesson-card-topbar')) return;

        const star = card.querySelector('.hard-star');
        const number = card.querySelector('.lesson-card-number');
        const speaker = findSpeaker(card);

        if (!star && !number && !speaker) return;

        const bar = document.createElement('div');
        bar.className = 'lesson-card-topbar';
        bar.setAttribute('aria-hidden', 'false');

        // Preserve the existing elements; only move them into the alignment bar.
        if (star) bar.appendChild(star);
        if (number) bar.appendChild(number);
        if (speaker) bar.appendChild(speaker);

        card.appendChild(bar);
    }

    function setupAll() {
        document.querySelectorAll('#grid .card').forEach(setupCard);
    }

    function init() {
        const grid = document.getElementById('grid');
        if (!grid) return;

        setupAll();

        const observer = new MutationObserver(() => setupAll());
        observer.observe(grid, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
