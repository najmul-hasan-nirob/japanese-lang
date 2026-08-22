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
        return card.querySelector('.speaker-btn, .speak-btn, .pronunciation-btn, [aria-label="Play pronunciation"], [aria-label*="pronunciation" i]');
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

        const star = inner.querySelector(':scope > .hard-star');
        const number = inner.querySelector(':scope > .lesson-card-number');
        const speaker = findSpeaker(inner);

        if (star && star.parentElement !== bar) bar.appendChild(star);
        if (number && number.parentElement !== bar) bar.appendChild(number);
        if (speaker && speaker.parentElement !== bar) bar.appendChild(speaker);

        Array.from(inner.children).forEach(child => {
            if (child !== bar && child !== content &&
                (child.classList.contains('front') || child.classList.contains('back'))) {
                content.appendChild(child);
            }
        });

        if (speaker) makeVisibleSpeaker(speaker);
        card.classList.add('lesson-card-structured');
    }

    function injectStyles() {
        if (document.getElementById('lesson-card-structure-styles')) return;

        const style = document.createElement('style');
        style.id = 'lesson-card-structure-styles';
        style.textContent = `
.card.lesson-card-structured {
    position:relative;
    overflow:hidden;
    border-radius:var(--radius);
}

.lesson-card-inner {
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    overflow:hidden;
    border-radius:inherit;
    box-sizing:border-box;
}

.lesson-card-topbar {
    position:absolute;
    top:0;
    left:0;
    right:0;
    width:100%;
    height:42px;
    display:grid;
    grid-template-columns:1fr auto 1fr;
    align-items:center;
    justify-items:center;
    box-sizing:border-box;
    z-index:50;
    pointer-events:none;
}

.lesson-card-content {
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    box-sizing:border-box;
    overflow:hidden;
    pointer-events:none;
}

.lesson-card-content > .front,
.lesson-card-content > .back {
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    box-sizing:border-box;
    padding-top:50px !important;
    padding-bottom:14px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    pointer-events:auto;
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

.lesson-card-topbar .hard-star {
    grid-column:1;
    justify-self:start;
    margin-left:8px !important;
}

.lesson-card-topbar .lesson-card-number {
    grid-column:2;
    justify-self:center;
}

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
    .lesson-card-topbar { height:38px; }

    .lesson-card-content > .front,
    .lesson-card-content > .back {
        padding-top:44px !important;
        padding-bottom:10px;
    }

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

        // The number controller inserts the serial directly into the finished
        // topbar. Calling it here removes the Shuffle -> Normal race between
        // the two MutationObservers.
        if (typeof window.updateLessonCardNumbers === 'function') {
            window.updateLessonCardNumbers();
        }
    }

    function init() {
        const grid = document.getElementById('grid');
        if (!grid) return;

        injectStyles();
        setupAll(grid);

        const observer = new MutationObserver(() => setTimeout(() => setupAll(grid), 0));
        observer.observe(grid, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
