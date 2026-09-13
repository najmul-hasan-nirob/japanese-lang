// =====================================================
// Kanji page controls — mirrors Lesson page Front / Back
// =====================================================
(function () {
    let showBack = false;
    let writingPractice = false;
    let mobileQuery = null;

    const ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>';
    const WRITING_ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"></path></svg>';
    const NORMAL_ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"></path><path d="M3 21v-5h5"></path></svg>';

    function labelledIcon(label) {
        return '<span class="lesson-control-text">' + label + '</span>' + ICON;
    }

    function practiceIcon(isActive) {
        return isActive ? NORMAL_ICON : WRITING_ICON;
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

        const practiceDesktop = document.getElementById('kanjiWritingPractice');
        const practiceMobile = document.getElementById('kanjiMobileWritingPractice');
        [practiceDesktop, practiceMobile].forEach(function (button) {
            if (!button) return;
            button.setAttribute('aria-pressed', String(writingPractice));
            button.setAttribute('aria-label', writingPractice ? 'Disable writing practice mode' : 'Enable writing practice mode');
            button.title = writingPractice ? 'Normal Backside' : 'Writing Practice';
            button.innerHTML = practiceIcon(writingPractice);
            button.classList.toggle('right', writingPractice);
        });
    }

    function applyCardState() {
        getCards().forEach(function (card) {
            card.classList.toggle('flipped', showBack);
        });
    }

    function applyWritingPracticeState() {
        document.documentElement.classList.toggle('kanji-writing-practice', writingPractice);
    }

    function toggle() {
        showBack = !showBack;
        updateUI();
        applyCardState();
    }

    function toggleWritingPractice() {
        writingPractice = !writingPractice;
        try { localStorage.setItem('japanese-lang-kanji-writing-practice', writingPractice ? '1' : '0'); } catch (_) {}
        applyWritingPracticeState();
        updateUI();
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

        let practiceMobile = document.getElementById('kanjiMobileWritingPractice');
        if (!practiceMobile) {
            practiceMobile = document.createElement('button');
            practiceMobile.type = 'button';
            practiceMobile.id = 'kanjiMobileWritingPractice';
            practiceMobile.className = 'direction-toggle';
            practiceMobile.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleWritingPractice();
            });
        }

        bar.appendChild(mobile);
        bar.appendChild(practiceMobile);
        updateUI();
    }

    function syncResponsive() {
        const mobile = mobileQuery && mobileQuery.matches;
        const desktop = document.getElementById('kanjiDirection');
        const practiceDesktop = document.getElementById('kanjiWritingPractice');
        if (desktop) {
            const field = desktop.closest('.field');
            if (field) field.style.display = mobile ? 'none' : '';
        }
        if (practiceDesktop) {
            const field = practiceDesktop.closest('.field');
            if (field) field.style.display = mobile ? 'none' : '';
        }
        if (mobile) ensureMobileControl();
        else updateUI();
    }

    function init() {
        const desktop = document.getElementById('kanjiDirection');
        const practiceDesktop = document.getElementById('kanjiWritingPractice');
        const grid = document.getElementById('kanjiGrid');
        if (!desktop || !practiceDesktop || !grid) return;

        desktop.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggle();
        });

        practiceDesktop.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleWritingPractice();
        });

        try { writingPractice = localStorage.getItem('japanese-lang-kanji-writing-practice') === '1'; } catch (_) {}
        applyWritingPracticeState();

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
