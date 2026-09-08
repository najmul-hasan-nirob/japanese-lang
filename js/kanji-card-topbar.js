// Static Lesson-style topbar for Kanji cards. It is outside .inner, so it never flips.
(function () {
    const style = document.createElement('style');
    style.textContent = `
        .kanji-card > .lesson-card-topbar {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 8px !important;
            width: 100% !important;
            min-height: 34px !important;
            white-space: nowrap !important;
        }
        .kanji-card > .lesson-card-topbar > * {
            flex: 0 0 auto !important;
            white-space: nowrap !important;
        }
        .kanji-card > .lesson-card-topbar .lesson-card-number {
            margin-right: auto !important;
        }
        .kanji-card > .lesson-card-topbar button {
            width: 30px !important;
            height: 30px !important;
            min-width: 30px !important;
            padding: 0 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        @media (max-width: 520px) {
            .kanji-card > .lesson-card-topbar { gap: 5px !important; }
            .kanji-card > .lesson-card-topbar button {
                width: 28px !important;
                height: 28px !important;
                min-width: 28px !important;
            }
        }
    `;
    document.head.appendChild(style);

    function setupCard(card) {
        if (!card || card.dataset.kanjiTopbarReady === 'true') return;
        const inner = card.querySelector(':scope > .inner');
        if (!inner) return;
        const topbar = document.createElement('div');
        topbar.className = 'lesson-card-topbar';
        topbar.setAttribute('aria-label', 'Card controls');
        const number = document.createElement('span'); number.className = 'lesson-card-number'; number.textContent = card.dataset.no || '';
        const tag = document.createElement('span'); tag.className = 'lesson-tag'; tag.textContent = card.dataset.level || '';
        const star = document.createElement('button'); star.type = 'button'; star.className = 'hard-star'; star.textContent = '☆'; star.setAttribute('aria-label', 'Mark as hard Kanji'); star.setAttribute('title', 'Mark as hard Kanji');
        star.addEventListener('click', function (event) { event.preventDefault(); event.stopPropagation(); const active = star.classList.toggle('active'); star.textContent = active ? '★' : '☆'; star.setAttribute('aria-pressed', String(active)); });
        const speaker = document.createElement('button'); speaker.type = 'button'; speaker.className = 'speaker-btn'; speaker.textContent = '🔊'; speaker.setAttribute('aria-label', 'Play pronunciation'); speaker.setAttribute('title', 'Play pronunciation');
        speaker.addEventListener('click', function (event) { event.preventDefault(); event.stopPropagation(); const text = card.dataset.kanji || ''; if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'ja-JP'; utterance.rate = 0.9; window.speechSynthesis.speak(utterance); } });
        topbar.append(star, number, tag, speaker); card.insertBefore(topbar, inner); card.dataset.kanjiTopbarReady = 'true';
    }
    function init() { const grid = document.getElementById('kanjiGrid'); if (!grid) return; grid.querySelectorAll(':scope > .card').forEach(setupCard); new MutationObserver(function () { grid.querySelectorAll(':scope > .card').forEach(setupCard); }).observe(grid, { childList: true }); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
