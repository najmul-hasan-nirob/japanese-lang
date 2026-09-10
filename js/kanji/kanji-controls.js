// =====================================================
// Kanji page controls — mirrors Lesson page Front / Back
// =====================================================
(function () {
    let showBack = false;
    let mobileQuery = null;

    const ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>';

    function labelledIcon(label) {
        return '<span class="lesson-control-text">' + label + '</span>' + ICON;
    }

    function getCards() {
        return Array.from(document.querySelectorAll('#kanjiGrid .card'));
    }

    function updateUI() {
        const desktop = document.getElementById('kanjiDirection');
        const mobile = document.getElementById('kanjiMobileDirection');
        [desktop, mobile].forEach(function (button) {
            if (!button) return;
            button.classList.toggle('right', showBack);
            button.setAttribute('aria-pressed', String(showBack));
            button.setAttribute('aria-label', showBack ? 'Show all cards Front' : 'Show all cards Back');
            button.title = showBack ? 'Show Front' : 'Show Back';
            button.innerHTML = labelledIcon('Front / Back');
        });
    }

    function applyCardState() {
        getCards().forEach(function (card) {
            card.classList.toggle('flipped', showBack);
        });
    }

    function toggle() {
        showBack = !showBack;
        updateUI();
        applyCardState();
    }

    function ensureMobileControl() {
        const desktop = document.getElementById('kanjiDirection');
        if (!desktop) return;

        let bar = document.querySelector('.mobile-bottom-controls');
        if (!bar) {
            bar = document.createElement('div');
            bar.className = 'mobile-bottom-controls';
            bar.setAttribute('aria-label', 'Kanji controls');
            document.body.appendChild(bar);
        }

        let mobile = document.getElementById('kanjiMobileDirection');
        if (!mobile) {
            mobile = document.createElement('button');
            mobile.type = 'button';
            mobile.id = 'kanjiMobileDirection';
            mobile.className = 'direction-toggle';
            mobile.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggle();
            });
        }
        bar.appendChild(mobile);
        updateUI();
    }

    function syncResponsive() {
        const mobile = mobileQuery && mobileQuery.matches;
        const desktop = document.getElementById('kanjiDirection');
        if (desktop) {
            const field = desktop.closest('.field');
            if (field) field.style.display = mobile ? 'none' : '';
        }
        if (mobile) ensureMobileControl();
        else updateUI();
    }

    function init() {
        const desktop = document.getElementById('kanjiDirection');
        const grid = document.getElementById('kanjiGrid');
        if (!desktop || !grid) return;

        desktop.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggle();
        });

        mobileQuery = matchMedia('(max-width:520px)');
        if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', syncResponsive);
        else mobileQuery.addListener(syncResponsive);

        updateUI();
        applyCardState();
        syncResponsive();

        new MutationObserver(function () {
            if (showBack) applyCardState();
        }).observe(grid, { childList: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
