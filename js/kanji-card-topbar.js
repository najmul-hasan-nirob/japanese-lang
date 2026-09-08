// Kanji cards: use the same topbar structure and controls as Lesson cards.
(function () {
    function speak(text) {
        if (!text) return;
        if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        } else if (window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') {
            try { window.AndroidTTS.speak(text); } catch (e) {}
        }
    }

    function setupCard(card) {
        if (!card || card.dataset.kanjiTopbarReady === 'true') return;
        const inner = card.querySelector(':scope > .inner');
        if (!inner) return;

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
            speak(kanji);
        });

        topbar.appendChild(star);
        if (number) topbar.appendChild(number);
        topbar.appendChild(speaker);
        inner.insertBefore(topbar, inner.firstChild);
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

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
