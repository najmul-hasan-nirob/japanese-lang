// =====================================================
// Mobile Lessons masonry layout
// Keeps card order while allowing each column to have
// its own height. Desktop layout is untouched.
// Lessons page only.
// =====================================================
(function () {
    const BREAKPOINT = 520;
    const STYLE_ID = 'lesson-mobile-masonry-styles';
    let grid = null;
    let columns = null;
    let resizeTimer = null;
    let layoutTimer = null;
    let layingOut = false;

    function isMobile() {
        return window.innerWidth <= BREAKPOINT;
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            @media (max-width:${BREAKPOINT}px) {
                #grid.lesson-mobile-masonry-grid {
                    display:grid !important;
                    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
                    align-items:start !important;
                    gap:var(--grid-gap,14px) !important;
                    grid-auto-rows:auto !important;
                }
                #grid.lesson-mobile-masonry-grid > .lesson-masonry-column {
                    min-width:0;
                    display:flex;
                    flex-direction:column;
                    gap:var(--grid-gap,14px);
                    align-items:stretch;
                }
                #grid.lesson-mobile-masonry-grid > .lesson-masonry-column > .card {
                    width:100% !important;
                    margin:0 !important;
                    align-self:stretch;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function getGap() {
        const gap = parseFloat(getComputedStyle(grid).columnGap);
        return Number.isFinite(gap) ? gap : 14;
    }

    function getCards() {
        return Array.from(grid.querySelectorAll(':scope > .card'));
    }

    function createColumns() {
        if (!columns) {
            columns = [document.createElement('div'), document.createElement('div')];
            columns.forEach((column, index) => {
                column.className = 'lesson-masonry-column';
                column.dataset.masonryColumn = String(index);
            });
        }
        return columns;
    }

    function layoutMobile() {
        if (!grid || !isMobile() || layingOut) return;
        layingOut = true;
        try {
            const cards = getCards();
            if (!cards.length) return;
            const cols = createColumns();
            cols.forEach(column => {
                while (column.firstChild) column.removeChild(column.firstChild);
            });
            grid.classList.add('lesson-mobile-masonry-grid');

            const heights = [0, 0];
            const gap = getGap();

            cards.forEach(card => {
                const index = heights[0] <= heights[1] ? 0 : 1;
                cols[index].appendChild(card);
                heights[index] += card.offsetHeight + gap;
            });

            cols.forEach(column => grid.appendChild(column));
        } finally {
            layingOut = false;
        }
    }

    function restoreDesktop() {
        if (!grid || isMobile() || !columns) return;
        const cards = [];
        // Restore according to each card's current sequence number when possible.
        columns.forEach(column => {
            Array.from(column.children).forEach(card => {
                if (card.classList.contains('card')) cards.push(card);
            });
        });
        cards.sort((a, b) => {
            const na = parseInt(a.querySelector('.lesson-card-number')?.textContent || '999999', 10);
            const nb = parseInt(b.querySelector('.lesson-card-number')?.textContent || '999999', 10);
            return na - nb;
        });
        const fragment = document.createDocumentFragment();
        cards.forEach(card => fragment.appendChild(card));
        grid.replaceChildren(fragment);
        columns = null;
        grid.classList.remove('lesson-mobile-masonry-grid');
    }

    function scheduleLayout() {
        clearTimeout(layoutTimer);
        layoutTimer = setTimeout(() => {
            if (isMobile()) layoutMobile();
            else restoreDesktop();
        }, 50);
    }

    function init() {
        grid = document.getElementById('grid');
        if (!grid) return;
        injectStyles();
        scheduleLayout();

        // Only observe direct children. This avoids reacting to the many
        // internal mutations produced by individual lesson cards.
        const observer = new MutationObserver(() => {
            if (!layingOut) scheduleLayout();
        });
        observer.observe(grid, { childList: true });

        document.addEventListener('lessonCardsRendered', scheduleLayout);
        document.addEventListener('hardVocabularyUpdated', scheduleLayout);
        window.addEventListener('japaneseLangCloudLoaded', scheduleLayout);

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(scheduleLayout, 120);
        });
        window.addEventListener('orientationchange', () => setTimeout(scheduleLayout, 180));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
