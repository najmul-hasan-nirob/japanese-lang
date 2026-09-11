// Similar Words uses the Lesson card content/controls, with the topbar kept OUTSIDE
// the flipping .inner so it remains static exactly like the Lesson card design.
(function () {
    const grid = document.getElementById('grid');
    const count = document.getElementById('countDisplay');
    const mode = document.getElementById('mode');
    const filterPanel = document.getElementById('similarWordsPanel');
    const FILTER_KEY = 'japanese-lang-similar-words-filter-v1';

    if (!grid || !count || !mode) return;

    const words = [
        { jp: 'なんで', romaji: 'nande', bn: 'কেন', group: 'why' },
        { jp: 'どうして', romaji: 'doushite', bn: 'কেন', group: 'why' },
        { jp: 'なぜ', romaji: 'naze', bn: 'কেন', group: 'why' },
        { jp: 'が', romaji: 'ga', bn: 'কিন্তু', group: 'but' },
        { jp: 'でも', romaji: 'demo', bn: 'কিন্তু', group: 'but' },
        { jp: 'どこ', romaji: 'doko', bn: 'কোথায়', group: 'where' },
        { jp: 'どんな～', romaji: 'donna', bn: 'কী ধরনের ~', group: 'what-kind-of' },
        { jp: '～と～', romaji: '～to～', bn: '~ এবং ~ / ~ ও ~', group: 'and' },
        { jp: 'なに', romaji: 'nani', bn: 'কি / কী', group: 'questions-words' },
        { jp: 'なん', romaji: 'nan', bn: 'কি / কী', group: 'questions-words' },
        { jp: 'だれ', romaji: 'dare', bn: 'কে', group: 'questions-words' },
        { jp: 'だれの', romaji: 'dare no', bn: 'কার', group: 'questions-words' },
        { jp: 'どなた', romaji: 'donata', bn: 'কে (ভদ্রভাবে)', group: 'questions-words' },
        { jp: 'どなたさま', romaji: 'donatasama', bn: 'কে (আরও সম্মানজনকভাবে)', group: 'questions-words' },
        { jp: 'どこから', romaji: 'doko kara', bn: 'কোথা থেকে', group: 'questions-words' },
        { jp: 'どこへ', romaji: 'doko e', bn: 'কোথায় (গন্তব্য)', group: 'questions-words' },
        { jp: 'いつ', romaji: 'itsu', bn: 'কখন', group: 'questions-words' },
        { jp: 'どう', romaji: 'dou', bn: 'কেমন / কীভাবে', group: 'questions-words' },
        { jp: 'どうやって', romaji: 'dou yatte', bn: 'কীভাবে / কেমন করে', group: 'questions-words' },
        { jp: 'どんな', romaji: 'donna', bn: 'কেমন / কী ধরনের', group: 'questions-words' },
        { jp: 'どれ', romaji: 'dore', bn: 'কোনটি', group: 'questions-words' },
        { jp: 'どの', romaji: 'dono', bn: 'কোন + noun', group: 'questions-words' },
        { jp: 'どちら', romaji: 'dochira', bn: 'কোনটি / কোন দিক (ভদ্র)', group: 'questions-words' },
        { jp: 'どっち', romaji: 'docchi', bn: 'কোনটা / কোন দিক (কথ্য)', group: 'questions-words' },
        { jp: 'いくつ', romaji: 'ikutsu', bn: 'কত', group: 'questions-words' },
        { jp: 'いくら', romaji: 'ikura', bn: 'কত টাকা', group: 'questions-words' },
        { jp: 'なんにん', romaji: 'nannin', bn: 'কতজন', group: 'questions-words' },
        { jp: 'どのくらい', romaji: 'dono kurai', bn: 'কত সময় / কতক্ষণ', group: 'questions-words' },
        { jp: 'なにご', romaji: 'nanigo', bn: 'কোন ভাষা', group: 'questions-words' },
        { jp: 'なんの', romaji: 'nan no', bn: 'কীসের / কোন ধরনের', group: 'questions-words' },
        { jp: 'おわります', romaji: 'owarimasu', bn: 'শেষ করা / শেষ হওয়া', group: 'similar-kind-of-sound', soundGroup: 'owari-wakari' },
        { jp: 'おわかります', romaji: 'owakarimasu', bn: 'বোঝা / বুঝতে পারা', group: 'similar-kind-of-sound', soundGroup: 'owari-wakari' },
        { jp: 'りょう', romaji: 'ryou', bn: 'ডরমিটরি / ছাত্রাবাস', group: 'similar-kind-of-sound', soundGroup: 'ryou-group' },
        { jp: 'りょうり', romaji: 'ryouri', bn: 'রান্না / রান্না করা খাবার', group: 'similar-kind-of-sound', soundGroup: 'ryou-group' },
        { jp: 'りょこう', romaji: 'ryokou', bn: 'ভ্রমণ / সফর', group: 'similar-kind-of-sound', soundGroup: 'ryou-group' },
        { jp: 'じ', romaji: 'ji', bn: 'টা (সময়) / ঘণ্টা', group: 'similar-kind-of-sound', soundGroup: 'ji-group' },
        { jp: 'じ', romaji: 'ji', bn: 'অক্ষর / character', group: 'similar-kind-of-sound', soundGroup: 'ji-group' },
        { jp: 'きっぷ', romaji: 'kippu', bn: 'টিকিট', group: 'similar-kind-of-sound', soundGroup: 'kippu-ticket-group' },
        { jp: 'チケット', romaji: 'chiketto', bn: 'টিকিট', group: 'similar-kind-of-sound', soundGroup: 'kippu-ticket-group' }
    ];
    const validGroups = new Set(words.map(word => word.group));
    const DEFAULT_STATE = { selectedGroups: [...validGroups], orderMode: 'normal' };
    let lastRenderKey = '';

    function getSavedState() {
        try {
            const value = JSON.parse(localStorage.getItem(FILTER_KEY) || 'null');
            if (!value || !Array.isArray(value.selectedGroups)) return { ...DEFAULT_STATE, selectedGroups: [...DEFAULT_STATE.selectedGroups] };
            const selectedGroups = value.selectedGroups.filter(group => validGroups.has(group));
            return { selectedGroups: selectedGroups.length ? selectedGroups : [...DEFAULT_STATE.selectedGroups], orderMode: value.orderMode === 'shuffle' ? 'shuffle' : 'normal' };
        } catch (_) { return { ...DEFAULT_STATE, selectedGroups: [...DEFAULT_STATE.selectedGroups] }; }
    }

    function saveState() {
        if (!filterPanel) return;
        const selectedGroups = Array.from(filterPanel.querySelectorAll('input[type="checkbox"][value]:checked')).map(input => input.value).filter(group => validGroups.has(group));
        try { localStorage.setItem(FILTER_KEY, JSON.stringify({ selectedGroups: selectedGroups.length ? selectedGroups : [...DEFAULT_STATE.selectedGroups], orderMode: mode.value === 'shuffle' ? 'shuffle' : 'normal' })); } catch (_) {}
        window.dispatchEvent(new CustomEvent('similarWordsFilterStateChanged'));
    }

    function restoreState() {
        if (!filterPanel) return;
        const saved = getSavedState();
        const wanted = new Set(saved.selectedGroups);
        const boxes = Array.from(filterPanel.querySelectorAll('input[type="checkbox"][value]:not([value="all"])'));
        boxes.forEach(box => { box.checked = wanted.has(box.value); });
        const all = filterPanel.querySelector('input[type="checkbox"][value="all"]');
        if (all) all.checked = boxes.length > 0 && boxes.every(box => box.checked);
        mode.value = saved.orderMode;
    }

    function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
    function selectedGroups() { return filterPanel ? Array.from(filterPanel.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value).filter(group => validGroups.has(group)) : [...DEFAULT_STATE.selectedGroups]; }
    function getVisibleWords() { const groups = selectedGroups(); return words.filter(word => groups.includes(word.group)); }

    function speakJapanese(text) {
        if (!text) return;
        if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'ja-JP'; utterance.rate = 0.9; window.speechSynthesis.speak(utterance); }
        else if (window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') { try { window.AndroidTTS.speak(text); } catch (_) {} }
    }

    function createCard(word, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.similarWordGroup = word.group;
        card.__similarWord = word;
        const english = word.jp === 'おわります' ? 'finish' : word.jp === 'おわかります' ? 'understand' : word.jp === 'りょう' ? 'dormitory' : word.jp === 'りょうり' ? 'cooking / cooked food' : word.jp === 'りょこう' ? 'travel' : word.jp === 'きっぷ' ? 'ticket' : word.jp === 'チケット' ? 'ticket' : word.soundGroup === 'ji-group' ? (index === 0 ? 'hour / o’clock' : 'character / letter') : '';
        card.innerHTML = `<div class="lesson-card-topbar" aria-label="Card controls"><button type="button" class="hard-star" aria-label="Mark as hard vocabulary" title="Mark as hard vocabulary">☆</button><span class="lesson-card-number" aria-hidden="true">${index + 1}</span><span class="lesson-tag">${escapeHtml(word.group === 'similar-kind-of-sound' ? 'Similar Sound' : word.group.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))}</span><button type="button" class="speaker-btn" aria-label="Play pronunciation" title="Play pronunciation">🔊</button></div><div class="inner"><div class="front"><div class="lesson-japanese">${escapeHtml(word.jp)}</div></div><div class="back vocabulary-back"><span class="romaji">${escapeHtml(word.romaji)}</span><span class="english">${escapeHtml(english)}</span><span class="bangla">${escapeHtml(word.bn)}</span></div></div>`;
        card.addEventListener('click', event => { if (!event.target.closest('button')) card.classList.toggle('flipped'); });
        const star = card.querySelector('.hard-star');
        star.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); const active = star.classList.toggle('active'); star.textContent = active ? '★' : '☆'; star.setAttribute('aria-pressed', String(active)); });
        card.querySelector('.speaker-btn').addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); if (!card.classList.contains('flipped')) speakJapanese(word.jp); });
        return card;
    }

    function appendSoundGroup(container, groupWords) {
        const group = document.createElement('div');
        group.className = 'similar-sound-group';
        group.setAttribute('aria-label', 'Similar Sound group');
        groupWords.forEach((word, index) => {
            group.appendChild(createCard(word, index));
            if (index < groupWords.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'similar-sound-connector';
                connector.setAttribute('aria-hidden', 'true');
                connector.innerHTML = '<span>≈</span>';
                group.appendChild(connector);
            }
        });
        container.appendChild(group);
    }

    function render(force = false) {
        let visible = getVisibleWords();
        const soundOnly = selectedGroups().length === 1 && selectedGroups()[0] === 'similar-kind-of-sound';
        const renderKey = `${visible.map(word => `${word.jp}:${word.bn}`).join('|')}::${mode.value}::${soundOnly}`;
        if (!force && renderKey === lastRenderKey) return;
        lastRenderKey = renderKey;
        if (mode.value === 'shuffle' && !soundOnly) visible = visible.slice().sort(() => Math.random() - 0.5);
        grid.innerHTML = '';
        grid.classList.toggle('similar-sound-active', soundOnly);

        if (soundOnly) {
            const groups = new Map();
            visible.forEach(word => {
                const key = word.soundGroup || 'similar-sound-other';
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(word);
            });
            groups.forEach(groupWords => appendSoundGroup(grid, groupWords));
        } else {
            const fragment = document.createDocumentFragment();
            visible.forEach((word, index) => fragment.appendChild(createCard(word, index)));
            grid.appendChild(fragment);
        }

        count.textContent = `Showing ${visible.length} ${visible.length === 1 ? 'card' : 'cards'}`;
    }

    if (filterPanel) {
        restoreState();
        filterPanel.addEventListener('change', event => { if (event.target.matches('input[type="checkbox"]')) { if (event.target.value === 'all') filterPanel.querySelectorAll('input[type="checkbox"]:not([value="all"])').forEach(input => { input.checked = event.target.checked; }); saveState(); render(true); } });
        mode.addEventListener('change', () => { saveState(); render(true); });
        window.addEventListener('japaneseLangCloudLoaded', () => { restoreState(); render(true); window.dispatchEvent(new CustomEvent('similarWordsFilterStateRestored')); });
        window.dispatchEvent(new CustomEvent('similarWordsFilterStateRestored'));
    }
    document.getElementById('shuffleBtn')?.addEventListener('click', () => { mode.value = 'shuffle'; saveState(); render(true); });
    render(true);
})();
