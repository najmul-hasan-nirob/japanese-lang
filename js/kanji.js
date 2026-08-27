(function () {
    const grid = document.getElementById('kanjiGrid');
    const search = document.getElementById('kanjiSearch');
    const clear = document.getElementById('kanjiSearchClear');
    const levelPanel = document.getElementById('kanjiLevelPanel');
    const levelBtn = document.getElementById('kanjiLevelBtn');
    const mode = document.getElementById('kanjiMode');
    const shuffleBtn = document.getElementById('kanjiShuffleBtn');
    const directionBtn = document.getElementById('kanjiDirection');
    const count = document.getElementById('kanjiCount');
    if (!grid || !Array.isArray(window.kanjiData)) return;

    let cards = [...window.kanjiData];
    let showBack = false;
    const detailCache = new Map();
    const UI_STATE_KEY = 'japanese-lang-ui-state-v1';
    const PAGE_KEY = (location.pathname || '/').replace(/\/+$/, '') || '/';
    const FLIP_ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>';

    function kanaToRomaji(text) {
        text = String(text || '').replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
        const table = {
            'きゃ':'kya','きゅ':'kyu','きょ':'kyo','しゃ':'sha','しゅ':'shu','しょ':'sho','ちゃ':'cha','ちゅ':'chu','ちょ':'cho','にゃ':'nya','にゅ':'nyu','にょ':'nyo','ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','みゃ':'mya','みゅ':'myu','みょ':'myo','りゃ':'rya','りゅ':'ryu','りょ':'ryo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo','じゃ':'ja','じゅ':'ju','じょ':'jo','びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo','あ':'a','い':'i','う':'u','え':'e','お':'o','か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko','が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go','さ':'sa','し':'shi','す':'su','せ':'se','そ':'so','ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo','た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to','だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do','な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no','は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho','ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo','ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po','ま':'ma','み':'mi','む':'mu','め':'me','も':'mo','や':'ya','ゆ':'yu','よ':'yo','ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro','わ':'wa','を':'o','ん':'n','っ':'','ー':'-'
        };
        let out = '';
        for (let i = 0; i < text.length; i++) {
            if (text[i] === 'っ') {
                const nextPair = text.slice(i + 1, i + 3);
                const next = table[nextPair] || table[text[i + 1]] || '';
                if (next) out += next.charAt(0);
                continue;
            }
            const pair = text.slice(i, i + 2);
            if (table[pair]) { out += table[pair]; i++; continue; }
            out += table[text[i]] ?? text[i];
        }
        return out;
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
    }

    function selectedLevels() {
        return Array.from(levelPanel.querySelectorAll('input[type="checkbox"]:checked')).map(x => x.value);
    }

    function updateLevelLabel() {
        const selected = selectedLevels();
        const all = Array.from(levelPanel.querySelectorAll('input[type="checkbox"]'));
        levelBtn.textContent = selected.length === all.length ? 'N5 + N4' : selected.length ? selected.join(' + ') : 'None';
    }

    function filteredCards() {
        const q = search.value.trim().toLowerCase();
        const levels = selectedLevels();
        return cards.filter(item => {
            if (levels.length && !levels.includes(item.level)) return false;
            if (!q) return true;
            const detail = detailCache.get(item.kanji) || {};
            const readings = [item.reading, ...(detail.kun_readings || []), ...(detail.on_readings || [])].filter(Boolean).join(' ');
            const romaji = kanaToRomaji(readings).toLowerCase();
            const meanings = [item.meaning, ...(detail.meanings || [])].filter(Boolean).join(' ').toLowerCase();
            return item.kanji.includes(q) || String(item.no).includes(q) || readings.toLowerCase().includes(q) || romaji.includes(q) || meanings.includes(q);
        });
    }

    function detailHtml(item) {
        const d = detailCache.get(item.kanji);
        if (!d) return '<span class="kanji-loading">Loading details…</span>';

        const kun = (d.kun_readings || []).filter(Boolean);
        const on = (d.on_readings || []).filter(Boolean);
        const meaning = item.meaning || d.bangla_meaning || (d.meanings || []).filter(Boolean)[0] || '';
        const kunReading = kun[0] || '';
        const onReading = on[0] || '';
        const kunRomaji = kanaToRomaji(kunReading);
        const onRomaji = kanaToRomaji(onReading);
        const pdfExample = (window.KANJI_EXAMPLES || {})[item.kanji] || null;

        const japLine = `<div class="kanji-reading-line"><span class="kanji-reading-label">Jap:</span> ${kunReading ? `${escapeHtml(kunReading)} (${escapeHtml(kunRomaji)})` : '-'} - ${escapeHtml(meaning)}</div>`;

        // Chi is shown only when this Kanji actually has an On'yomi reading.
        // The example comes from the user's Basic Kanji 320 PDF vocabulary.
        let chiLine = '';
        if (onReading) {
            const example = pdfExample && pdfExample.example ? escapeHtml(pdfExample.example) : '';
            const exampleRomaji = pdfExample && pdfExample.reading ? escapeHtml(kanaToRomaji(pdfExample.reading)) : '';
            const exampleText = example ? ` - (Ex. ${example} - ${exampleRomaji})` : '';
            chiLine = `<div class="kanji-reading-line kanji-chi-line"><span class="kanji-reading-label">Chi:</span> ${escapeHtml(onReading)} (${escapeHtml(onRomaji)})${exampleText}</div>`;
        }
        return `${japLine}${chiLine}`;
    }

    function render() {
        let visible = filteredCards();
        if (mode.value === 'shuffle') visible = [...visible].sort(() => Math.random() - 0.5);
        grid.innerHTML = visible.map(item => `
            <div class="card kanji-card" data-no="${item.no}" data-kanji="${escapeHtml(item.kanji)}">
                <div class="inner">
                    <div class="front">
                        <div class="lesson-card-topbar"><span class="lesson-card-number">${item.no}</span><span class="lesson-tag">${escapeHtml(item.level)}</span></div>
                        <div class="kanji-character">${escapeHtml(item.kanji)}</div>
                    </div>
                    <div class="back">
                        <div class="lesson-card-topbar"><span class="lesson-card-number">${item.no}</span><span class="lesson-tag">${escapeHtml(item.level)}</span></div>
                        <div class="kanji-character small">${escapeHtml(item.kanji)}</div>
                        <div class="kanji-details">${detailHtml(item)}</div>
                    </div>
                </div>
            </div>`).join('');

        grid.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', async event => {
                if (event.target.closest('.speaker-btn')) return;
                card.classList.toggle('flipped');
                if (!detailCache.has(card.dataset.kanji)) {
                    await loadDetail(card.dataset.kanji);
                    const item = cards.find(x => x.kanji === card.dataset.kanji);
                    const back = card.querySelector('.kanji-details');
                    if (back) back.innerHTML = detailHtml(item || { kanji: card.dataset.kanji });
                }
            });
        });
        if (showBack) grid.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
        count.textContent = `Showing ${visible.length} kanji`;
        clear.hidden = !search.value;
    }

    async function loadDetail(kanji) {
        if (detailCache.has(kanji)) return detailCache.get(kanji);
        try {
            const response = await fetch(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(kanji)}`);
            if (!response.ok) throw new Error('Kanji API request failed');
            const data = await response.json();
            detailCache.set(kanji, data);
            return data;
        } catch (_) {
            detailCache.set(kanji, {});
            return {};
        }
    }

    function readUIState() {
        try { const all = JSON.parse(localStorage.getItem(UI_STATE_KEY) || '{}'); return all && typeof all === 'object' ? all : {}; }
        catch (_) { return {}; }
    }

    function saveUIState() {
        try {
            const all = readUIState();
            const previous = all[PAGE_KEY] && typeof all[PAGE_KEY] === 'object' ? all[PAGE_KEY] : {};
            const controls = previous.controls && typeof previous.controls === 'object' ? { ...previous.controls } : {};
            levelPanel.querySelectorAll('input[type="checkbox"]').forEach(el => { if (el.id) controls[el.id] = { type: 'checkbox', checked: el.checked }; });
            all[PAGE_KEY] = { updatedAt: Date.now(), controls };
            localStorage.setItem(UI_STATE_KEY, JSON.stringify(all));
            window.dispatchEvent(new CustomEvent('japaneseLangUIStateChanged'));
        } catch (_) {}
    }

    function restoreUIState() {
        const saved = readUIState()[PAGE_KEY];
        const controls = saved && saved.controls && typeof saved.controls === 'object' ? saved.controls : {};
        levelPanel.querySelectorAll('input[type="checkbox"]').forEach(el => {
            const state = el.id ? controls[el.id] : null;
            if (state && state.type === 'checkbox' && typeof state.checked === 'boolean') el.checked = state.checked;
        });
        updateLevelLabel();
    }

    function updateDirectionUI() {
        directionBtn.classList.toggle('right', showBack);
        directionBtn.setAttribute('aria-pressed', String(showBack));
        directionBtn.setAttribute('aria-label', showBack ? 'Show all cards Front' : 'Show all cards Back');
        directionBtn.title = showBack ? 'Show Front' : 'Show Back';
        directionBtn.innerHTML = '<span class="lesson-control-text">Front / Back</span>' + FLIP_ICON;
    }

    function toggleAllCards() {
        showBack = !showBack;
        updateDirectionUI();
        grid.querySelectorAll('.card').forEach(card => card.classList.toggle('flipped', showBack));
    }

    levelBtn.addEventListener('click', event => { event.stopPropagation(); const open = levelPanel.classList.toggle('open'); levelBtn.setAttribute('aria-expanded', String(open)); });
    levelPanel.addEventListener('click', event => event.stopPropagation());
    levelPanel.addEventListener('change', () => { updateLevelLabel(); saveUIState(); render(); });
    document.addEventListener('click', () => { levelPanel.classList.remove('open'); levelBtn.setAttribute('aria-expanded', 'false'); });
    directionBtn.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); toggleAllCards(); });
    updateDirectionUI();
    search.addEventListener('input', render);
    clear.addEventListener('click', () => { search.value = ''; render(); search.focus(); });
    mode.addEventListener('change', render);
    shuffleBtn.addEventListener('click', () => { mode.value = 'shuffle'; render(); });
    restoreUIState();
    render();
    window.addEventListener('japaneseLangCloudLoaded', () => { restoreUIState(); render(); });
})();
