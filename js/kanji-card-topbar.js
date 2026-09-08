// Kanji cards use the exact Lesson-card topbar behavior.
// The topbar is outside the flipping element and remains static.
(function () {
    function setupCard(card) {
        if (!card || card.dataset.kanjiTopbarReady === 'true') return;
        const inner = card.querySelector(':scope > .inner');
        if (!inner) return;

        inner.querySelectorAll(':scope > .lesson-card-topbar').forEach(function (bar) {
            bar.remove();
        });

        const topbar = document.createElement('div');
        topbar.className = 'lesson-card-topbar';
        topbar.setAttribute('aria-label', 'Card controls');

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

        const number = inner.querySelector('.lesson-card-number');
        const speaker = document.createElement('button');
        speaker.type = 'button';
        speaker.className = 'speaker-btn';
        speaker.setAttribute('aria-label', 'Play pronunciation');
        speaker.setAttribute('title', 'Play pronunciation');
        speaker.textContent = '🔊';
        speaker.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const kanji = card.getAttribute('data-kanji') || '';
            if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(kanji);
                utterance.lang = 'ja-JP';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            } else if (window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') {
                try { window.AndroidTTS.speak(kanji); } catch (e) {}
            }
        });

        topbar.appendChild(star);
        if (number) topbar.appendChild(number);
        topbar.appendChild(speaker);

        // .inner flips. The topbar is inserted before it, so it never flips.
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
