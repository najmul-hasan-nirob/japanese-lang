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

    const kanaToRomaji = (text) => {
        const table = {
            'きゃ':'kya','きゅ':'kyu','きょ':'kyo','しゃ':'sha','しゅ':'shu','しょ':'sho','ちゃ':'cha','ちゅ':'chu','ちょ':'cho','にゃ':'nya','にゅ':'nyu','にょ':'nyo','ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','みゃ':'mya','みゅ':'myu','みょ':'myo','りゃ':'rya','りゅ':'ryu','りょ':'ryo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo','じゃ':'ja','じゅ':'ju','じょ':'jo','びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo','あ':'a','い':'i','う':'u','え':'e','お':'o','か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko','が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go','さ':'sa','し':'shi','す':'su','せ':'se','そ':'so','ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo','た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to','だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do','な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no','は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho','ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo','ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po','ま':'ma','み':'mi','む':'mu','め':'me','も':'mo','や':'ya','ゆ':'yu','よ':'yo','ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro','わ':'wa','を':'o','ん':'n','っ':'','ー':'-'
        };
        let out = '';
        for (let i = 0; i < text.length; i++) {
            const pair = text.slice(i, i + 2);
            if (table[pair]) { out += table[pair]; i++; continue; }
            out += table[text[i]] ?? text[i];
        }
        return out;
    };

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
        const kun = (d.kun_readings || []).join('、');
        const on = (d.on_readings || []).join('、');
        const readings = [kun, on].filter(Boolean).join(' / ') || '—';
        const romaji = kanaToRomaji([...(d.kun_readings || []), ...(d.on_readings || [])].join(' / '));
        const meaning = (d.meanings || []).slice(0, 4).join(', ') || '—';
        return `
            <div class="kanji-detail-reading"><strong>Reading:</strong> ${readings}</div>
            <div class="kanji-detail-romaji"><strong>Romaji:</strong> ${romaji || '—'}</div>
            <div class="kanji-detail-meaning"><strong>English:</strong> ${meaning}</div>
            <div class="kanji-detail-meta"><span>Stroke: ${d.stroke_count ?? '—'}</span><span>Grade: ${d.grade ?? '—'}</span></div>
        `;
    }

    function render() {
        let visible = filteredCards();
        if (mode.value === 'shuffle') visible = [...visible].sort(() => Math.random() - 0.5);
        grid.innerHTML = visible.map(item => `
            <div class="card kanji-card" data-no="${item.no}" data-kanji="${item.kanji}">
                <div class="inner">
                    <div class="front">
                        <div class="lesson-card-topbar">
                            <span class="lesson-card-number">${item.no}</span>
                            <span class="lesson-tag">${item.level}</span>
                        </div>
                        <div class="kanji-character">${item.kanji}</div>
                    </div>
                    <div class="back">
                        <div class="lesson-card-topbar">
                            <span class="lesson-card-number">${item.no}</span>
                            <span class="lesson-tag">${item.level}</span>
                        </div>
                        <div class="kanji-character small">${item.kanji}</div>
                        <div class="kanji-details">${detailHtml(item)}</div>
                    </div>
                </div>
            </div>`).join('');

        grid.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', async (event) => {
                if (event.target.closest('.speaker-btn')) return;
                card.classList.toggle('flipped');
                if (!detailCache.has(card.dataset.kanji)) {
                    await loadDetail(card.dataset.kanji);
                    const back = card.querySelector('.kanji-details');
                    if (back) back.innerHTML = detailHtml({ kanji: card.dataset.kanji });
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
        } catch (error) {
            detailCache.set(kanji, {});
            return {};
        }
    }

    // The shared lesson multiselect logic is not loaded on this page, so Kanji owns its
    // own small N5/N4 dropdown. This keeps the existing control markup unchanged.
    levelBtn.addEventListener('click', event => {
        event.stopPropagation();
        const open = levelPanel.classList.toggle('open');
        levelBtn.setAttribute('aria-expanded', String(open));
    });
    levelPanel.addEventListener('click', event => event.stopPropagation());
    levelPanel.addEventListener('change', () => { updateLevelLabel(); render(); });
    document.addEventListener('click', () => {
        levelPanel.classList.remove('open');
        levelBtn.setAttribute('aria-expanded', 'false');
    });

    search.addEventListener('input', render);
    clear.addEventListener('click', () => { search.value = ''; render(); search.focus(); });
    mode.addEventListener('change', render);
    shuffleBtn.addEventListener('click', () => { mode.value = 'shuffle'; render(); });
    directionBtn.addEventListener('click', () => {
        showBack = !showBack;
        directionBtn.setAttribute('aria-pressed', String(showBack));
        directionBtn.textContent = showBack ? 'Front' : 'Back';
        grid.querySelectorAll('.card').forEach(card => card.classList.toggle('flipped', showBack));
    });

    updateLevelLabel();
    render();
})();
