// Similar Words uses the Lesson card content/controls, with the topbar kept OUTSIDE
// the flipping .inner so it remains static exactly like the Lesson card design.
(function () {
    const grid = document.getElementById('grid');
    const count = document.getElementById('countDisplay');
    const mode = document.getElementById('mode');
    const filterPanel = document.getElementById('similarWordsPanel');
    const FILTER_KEY = 'japanese-lang-similar-words-filter-v1';
    const DEFAULT_STATE = { selectedGroups: ['why', 'but', 'where'], orderMode: 'normal' };

    if (!grid || !count || !mode) return;

    const words = [
        { jp: 'なんで', romaji: 'nande', bn: 'কেন', group: 'why' },
        { jp: 'が', romaji: 'ga', bn: 'কিন্তু', group: 'but' },
        { jp: 'でも', romaji: 'demo', bn: 'কিন্তু', group: 'but' },
        { jp: 'どこ', romaji: 'doko', bn: 'কোথায়', group: 'where' }
    ];
    const validGroups = new Set(['why', 'but', 'where']);

    function getSavedState() {
        try {
            const value = JSON.parse(localStorage.getItem(FILTER_KEY) || 'null');
            if (!value || !Array.isArray(value.selectedGroups)) return { ...DEFAULT_STATE };
            const selectedGroups = value.selectedGroups.filter(group => validGroups.has(group));
            return {
                selectedGroups: selectedGroups.length ? selectedGroups : [...DEFAULT_STATE.selectedGroups],
                orderMode: value.orderMode === 'shuffle' ? 'shuffle' : 'normal'
            };
        } catch (_) {
            return { ...DEFAULT_STATE };
        }
    }

    function saveState() {
        if (!filterPanel) return;
        const selectedGroups = Array.from(
            filterPanel.querySelectorAll('input[type="checkbox"][value]:checked')
        )
            .map(input => input.value)
            .filter(group => validGroups.has(group));
        const value = {
            selectedGroups: selectedGroups.length ? selectedGroups : [...DEFAULT_STATE.selectedGroups],
            orderMode: mode.value === 'shuffle' ? 'shuffle' : 'normal'
        };
        try { localStorage.setItem(FILTER_KEY, JSON.stringify(value)); } catch (_) {}
        window.dispatchEvent(new CustomEvent('similarWordsFilterStateChanged'));
    }

    function restoreState() {
        if (!filterPanel) return;
        const saved = getSavedState();
        const wanted = new Set(saved.selectedGroups);
        const boxes = Array.from(
            filterPanel.querySelectorAll('input[type="checkbox"][value]:not([value="all"])')
        );
        boxes.forEach(box => { box.checked = wanted.has(box.value); });

        const all = filterPanel.querySelector('input[type="checkbox"][value="all"]');
        if (all) all.checked = boxes.length > 0 && boxes.every(box => box.checked);

        if (mode.value !== saved.orderMode) mode.value = saved.orderMode;
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>'"]/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[c]));
    }

    function selectedGroups() {
        if (!filterPanel) return [...DEFAULT_STATE.selectedGroups];
        return Array.from(filterPanel.querySelectorAll('input[type="checkbox"]:checked'))
            .map(input => input.value)
            .filter(group => validGroups.has(group));
    }

    function getVisibleWords() {
        const groups = selectedGroups();
        return words.filter(word => groups.includes(word.group));
    }

    function speakJapanese(text) {
        if (!text) return;
        if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        } else if (window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') {
            try { window.AndroidTTS.speak(text); } catch (_) {}
        }
    }

    function render() {
        let visible = getVisibleWords();
        if (mode.value === 'shuffle') visible = visible.slice().sort(() => Math.random() - 0.5);

        grid.innerHTML = '';
        const fragment = document.createDocumentFragment();

        visible.forEach((word, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.similarWordGroup = word.group;
            card.__similarWord = word;

            card.innerHTML = `
                <div class="lesson-card-topbar" aria-label="Card controls">
                    <button type="button" class="hard-star" aria-label="Mark as hard vocabulary" title="Mark as hard vocabulary">☆</button>
                    <span class="lesson-card-number" aria-hidden="true">${index + 1}</span>
                    <span class="lesson-tag">${escapeHtml(word.group === 'why' ? 'Why' : word.group === 'but' ? 'But' : 'Where')}</span>
                    <button type="button" class="speaker-btn" aria-label="Play pronunciation" title="Play pronunciation">🔊</button>
                </div>
                <div class="inner">
                    <div class="front">
                        <div class="lesson-japanese">${escapeHtml(word.jp)}</div>
                    </div>
                    <div class="back vocabulary-back">
                        <span class="romaji">${escapeHtml(word.romaji)}</span>
                        <span class="bangla">${escapeHtml(word.bn)}</span>
                    </div>
                </div>`;

            card.addEventListener('click', function (event) {
                if (event.target.closest('button')) return;
                card.classList.toggle('flipped');
            });

            const star = card.querySelector('.hard-star');
            star.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                const active = star.classList.toggle('active');
                star.textContent = active ? '★' : '☆';
                star.setAttribute('aria-pressed', String(active));
            });

            const speaker = card.querySelector('.speaker-btn');
            speaker.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                if (!card.classList.contains('flipped')) speakJapanese(word.jp);
            });

            fragment.appendChild(card);
        });

        grid.appendChild(fragment);
        count.textContent = `Showing ${visible.length} ${visible.length === 1 ? 'card' : 'cards'}`;
        document.dispatchEvent(new CustomEvent('lessonCardsRendered'));
    }

    function initFilterPersistence() {
        if (!filterPanel) return;
        restoreState();
        mode.value = getSavedState().orderMode;

        filterPanel.addEventListener('change', function (event) {
            if (event.target.matches('input[type="checkbox"]')) {
                saveState();
                render();
            }
        });
        mode.addEventListener('change', function () {
            saveState();
            render();
        });

        window.addEventListener('japaneseLangCloudLoaded', function () {
            restoreState();
            render();
            window.dispatchEvent(new CustomEvent('similarWordsFilterStateRestored'));
        });

        setTimeout(function () {
            window.dispatchEvent(new CustomEvent('similarWordsFilterStateRestored'));
        }, 0);
    }

    initFilterPersistence();

    document.getElementById('shuffleBtn')?.addEventListener('click', function () {
        mode.value = 'shuffle';
        saveState();
        render();
    });

    render();
})();
