// =====================================================
// Lesson card structure
// .card > .lesson-card-inner
//     > .lesson-card-topbar
//         star | number | speaker
//     > .lesson-card-content
//         front / back
// Lessons page only.
// =====================================================
(function () {
    function findSpeaker(card) {
        return card.querySelector(
            '.speaker-btn, .speak-btn, .pronunciation-btn, [aria-label="Play pronunciation"], [aria-label*="pronunciation" i]'
        );
    }

    function makeVisibleSpeaker(speaker) {
        if (!speaker) return;
        speaker.style.setProperty('display', 'flex', 'important');
        speaker.style.setProperty('visibility', 'visible', 'important');
        speaker.style.setProperty('opacity', '1', 'important');
        speaker.style.setProperty('pointer-events', 'auto', 'important');
    }

    function setupCard(card) {
        if (!card) return;

        // Already converted: make sure a speaker added later is moved into
        // the topbar instead of being left inside the card content.
        let inner = card.querySelector(':scope > .lesson-card-inner');
        let bar = inner?.querySelector(':scope > .lesson-card-topbar');
        let content = inner?.querySelector(':scope > .lesson-card-content');

        if (!inner) {
            inner = document.createElement('div');
            inner.className = 'lesson-card-inner';

            while (card.firstChild) inner.appendChild(card.firstChild);
            card.appendChild(inner);
        }

        if (!bar) {
            bar = document.createElement('div');
            bar.className = 'lesson-card-topbar';
            bar.setAttribute('aria-label', 'Card controls');
            inner.insertBefore(bar, inner.firstChild);
        }

        if (!content) {
            content = document.createElement('div');
            content.className = 'lesson-card-content';
            inner.appendChild(content);
        }

        // Controls can be created by other Lesson scripts after this script.
        // Move them into the topbar whenever they appear.
        const star = inner.querySelector(':scope > .hard-star');
        const number = inner.querySelector(':scope > .lesson-card-number');
        const speaker = findSpeaker(inner);

        if (star) bar.appendChild(star);
        if (number) bar.appendChild(number);
        if (speaker && speaker.parentElement !== bar) bar.appendChild(speaker);

        // Everything in the inner wrapper that isn't the topbar/content belongs
        // to the card content (normally .front and .back).
        Array.from(inner.children).forEach(child => {
            if (child !== bar && child !== content) content.appendChild(child);
        });

        if (speaker) makeVisibleSpeaker(speaker);
        card.classList.add('lesson-card-structured');
    }

    function injectStyles() {
        if (document.getElementById('lesson-card-structure-styles')) return;

        const style = document.createElement('style');
        style.id = 'lesson-card-structure-styles';
        style.textContent = `
.lesson-card-inner {
    position:relative;
    width:100%;
    height:100%;
    min-height:100%;
    display:flex;
    flex-direction:column;
    box-sizing:border-box;
}

.lesson-card-topbar {
    position:relative;
    flex:0 0 38px;
    width:100%;
    min-height:38px;
    display:grid;
    grid-template-columns:1fr auto 1fr;
    align-items:center;
    justify-items:center;
    box-sizing:border-box;
    z-index:20;
    pointer-events:none;
}

.lesson-card-content {
    position:relative;
    flex:1 1 auto;
    min-height:0;
    width:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    box-sizing:border-box;
    padding:8px 12px 14px;
}

.lesson-card-content > .front,
.lesson-card-content > .back {
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    box-sizing:border-box;
}

.lesson-card-topbar .hard-star,
.lesson-card-topbar .lesson-card-number,
.lesson-card-topbar .speaker-btn,
.lesson-card-topbar .speak-btn,
.lesson-card-topbar .pronunciation-btn {
    position:relative !important;
    inset:auto !important;
    transform:none !important;
    margin:0 !important;
    pointer-events:auto;
}

.lesson-card-topbar .hard-star { grid-column:1; justify-self:start; margin-left:8px !important; }
.lesson-card-topbar .lesson-card-number { grid-column:2; justify-self:center; }
.lesson-card-topbar .speaker-btn,
.lesson-card-topbar .speak-btn,
.lesson-card-topbar .pronunciation-btn {
    grid-column:3;
    justify-self:end;
    margin-right:8px !important;
    display:flex !important;
    visibility:visible !important;
    opacity:1 !important;
    pointer-events:auto !important;
}

@media (max-width:520px) {
    .lesson-card-topbar { flex-basis:34px; min-height:34px; }
    .lesson-card-content { padding:6px 8px 12px; }
    .lesson-card-topbar .hard-star { margin-left:5px !important; }
    .lesson-card-topbar .speaker-btn,
    .lesson-card-topbar .speak-btn,
    .lesson-card-topbar .pronunciation-btn { margin-right:5px !important; }
}
`;
        document.head.appendChild(style);
    }

    function setupAll(grid) {
        grid.querySelectorAll(':scope > .card').forEach(setupCard);
    }

    function init() {
        const grid = document.getElementById('grid');
        if (!grid) return;

        injectStyles();
        setupAll(grid);

        const observer = new MutationObserver(() => {
            // Other Lesson scripts rebuild cards and add the star/number/speaker
            // asynchronously. Re-run after their DOM mutations settle.
            setTimeout(() => setupAll(grid), 0);
        });
        observer.observe(grid, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
