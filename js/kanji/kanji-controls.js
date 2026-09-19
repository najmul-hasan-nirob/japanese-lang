// =====================================================
// Kanji page controls — mirrors Lesson page Front / Back
// =====================================================
(function () {
    let showBack = false;
    let writingPractice = false;
    let mobileQuery = null;

    const ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>';
    const WRITING_ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"></path></svg>';
    const NORMAL_ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M8 9h8M8 13h5"></path></svg>';

    function labelledIcon(label) { return '<span class="lesson-control-text">' + label + '</span>' + ICON; }
    function practiceIcon(isActive) { return isActive ? NORMAL_ICON : WRITING_ICON; }
    function getCards() { return Array.from(document.querySelectorAll('#kanjiGrid .card')); }

    function cardWritingPractice(card) {
        if (!card) return writingPractice;
        if (card.dataset.writingPractice === '1') return true;
        if (card.dataset.writingPractice === '0') return false;
        return writingPractice;
    }

    function applyCardPracticeVisual(card, active) {
        if (!card) return;
        card.classList.toggle('kanji-card-writing-practice', active);
        const back = card.querySelector(':scope > .inner > .back');
        if (!back) return;
        const mnemonic = back.querySelector('.kanji-mnemonic-wrap');
        const character = back.querySelector(':scope > .kanji-character');
        const details = back.querySelector('.kanji-details');
        if (mnemonic) mnemonic.style.display = active ? 'none' : '';
        if (character) character.style.display = active ? 'none' : '';
        if (details) {
            details.querySelectorAll(':scope > *').forEach(function (item) {
                const keepVisible = item.classList.contains('kanji-detail-meaning') || item.classList.contains('kanji-reading-line');
                item.style.display = active && !keepVisible ? 'none' : '';
            });
            details.style.minHeight = active ? '120px' : '';
            details.style.justifyContent = active ? 'center' : '';
        }
    }

    function updateCardPracticeButton(card) {
        if (!card) return;
        const button = card.querySelector('.kanji-writing-practice-btn');
        const active = cardWritingPractice(card);
        applyCardPracticeVisual(card, active);
        if (!button) return;
        button.setAttribute('aria-pressed', String(active));
        button.setAttribute('aria-label', active ? 'Disable writing practice for this card' : 'Enable writing practice for this card');
        button.title = active ? 'Normal Backside' : 'Writing Practice';
        button.innerHTML = practiceIcon(active);
        button.classList.toggle('right', active);
    }

    function updateCardPracticeButtons() { getCards().forEach(updateCardPracticeButton); }

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
        updateCardPracticeButtons();
    }

    function applyCardState() { getCards().forEach(function (card) { card.classList.toggle('flipped', showBack); }); }
    function applyWritingPracticeState() { updateCardPracticeButtons(); }
    function toggle() { showBack = !showBack; updateUI(); applyCardState(); }

    function toggleWritingPractice() {
        writingPractice = !writingPractice;
        try { localStorage.setItem('japanese-lang-kanji-writing-practice', writingPractice ? '1' : '0'); } catch (_) {}
        applyWritingPracticeState();
        updateUI();
    }

    function toggleCardWritingPractice(card) {
        if (!card) return;
        const next = !cardWritingPractice(card);
        card.dataset.writingPractice = next ? '1' : '0';
        updateCardPracticeButton(card);
    }

    window.KanjiControls = { toggleCardWritingPractice: toggleCardWritingPractice };

    function ensureMobileControl() {
        const desktop = document.getElementById('kanjiDirection');
        if (!desktop) return;
        let bar = document.querySelector('.mobile-bottom-controls');
        if (!bar) { bar = document.createElement('div'); bar.className = 'mobile-bottom-controls'; bar.setAttribute('aria-label', 'Kanji controls'); document.body.appendChild(bar); }
        let mobile = document.getElementById('kanjiMobileDirection');
        if (!mobile) { mobile = document.createElement('button'); mobile.type='button'; mobile.id='kanjiMobileDirection'; mobile.className='direction-toggle'; mobile.addEventListener('click', function(e){e.preventDefault();e.stopPropagation();toggle();}); }
        let practiceMobile = document.getElementById('kanjiMobileWritingPractice');
        if (!practiceMobile) { practiceMobile=document.createElement('button');practiceMobile.type='button';practiceMobile.id='kanjiMobileWritingPractice';practiceMobile.className='direction-toggle';practiceMobile.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleWritingPractice();}); }
        const screenField=document.getElementById('screenWakeField');
        if(screenField) screenField.style.display='';
        bar.appendChild(mobile);
        bar.appendChild(practiceMobile);
        if(screenField) bar.appendChild(screenField);
        updateUI();
    }

    function restoreDesktopControls() {
        const toolbar=document.querySelector('.toolbar');
        const screenField=document.getElementById('screenWakeField');
        if(screenField && toolbar && screenField.parentElement!==toolbar) toolbar.appendChild(screenField);
        if(screenField) screenField.style.display='';
        updateUI();
    }

    function syncResponsive() {
        const mobile = mobileQuery && mobileQuery.matches;
        const desktop = document.getElementById('kanjiDirection');
        const practiceDesktop = document.getElementById('kanjiWritingPractice');
        if (desktop) { const field=desktop.closest('.field'); if(field) field.style.display=mobile?'none':''; }
        if (practiceDesktop) { const field=practiceDesktop.closest('.field'); if(field) field.style.display=mobile?'none':''; }
        if (mobile) ensureMobileControl(); else restoreDesktopControls();
    }

    function init() {
        const desktop=document.getElementById('kanjiDirection'), practiceDesktop=document.getElementById('kanjiWritingPractice'), grid=document.getElementById('kanjiGrid');
        if(!desktop||!practiceDesktop||!grid)return;
        desktop.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggle();});
        practiceDesktop.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleWritingPractice();});
        try { writingPractice=localStorage.getItem('japanese-lang-kanji-writing-practice')==='1'; } catch(_) {}
        mobileQuery=matchMedia('(max-width:520px)');
        if(mobileQuery.addEventListener)mobileQuery.addEventListener('change',syncResponsive);else mobileQuery.addListener(syncResponsive);
        updateUI(); applyCardState(); syncResponsive();
        new MutationObserver(function(){if(showBack)applyCardState();updateCardPracticeButtons();}).observe(grid,{childList:true});
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
