// Static Lesson-style topbar for Kanji cards. It is outside .inner, so it never flips.
(function () {
    function setupCard(card) {
        if (!card || card.dataset.kanjiTopbarReady === 'true') return;
        const inner = card.querySelector(':scope > .inner');
        if (!inner) return;

        const topbar = document.createElement('div');
        topbar.className = 'lesson-card-topbar';
        topbar.setAttribute('aria-label', 'Card controls');

        const number = document.createElement('span');
        number.className = 'lesson-card-number';
        number.textContent = card.dataset.no || '';

        const tag = document.createElement('span');
        tag.className = 'lesson-tag';
        tag.textContent = card.dataset.level || '';

        const star = document.createElement('button');
        star.type = 'button';
        star.className = 'hard-star';
        star.setAttribute('aria-label', 'Mark as hard Kanji');
        star.setAttribute('title', 'Mark as hard Kanji');
        star.textContent = '☆';
        star.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const active = star.classList.toggle('active');
            star.textContent = active ? '★' : '☆';
            star.setAttribute('aria-pressed', String(active));
        });

        const speaker = document.createElement('button');
        speaker.type = 'button';
        speaker.className = 'speaker-btn';
        speaker.setAttribute('aria-label', 'Play pronunciation');
        speaker.setAttribute('title', 'Play pronunciation');
        speaker.textContent = '🔊';
        speaker.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const text = card.dataset.kanji || '';
            if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'ja-JP';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        });

        topbar.appendChild(star);
        topbar.appendChild(number);
        topbar.appendChild(tag);
        topbar.appendChild(speaker);
        card.insertBefore(topbar, inner);
        card.dataset.kanjiTopbarReady = 'true';
    }

    function init() {
        const grid = document.getElementById('kanjiGrid');
        if (!grid) return;
        grid.querySelectorAll(':scope > .card').forEach(setupCard);
        new MutationObserver(function () {
            grid.querySelectorAll(':scope > .card').forEach(setupCard);
        }).observe(grid, { childList: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();
