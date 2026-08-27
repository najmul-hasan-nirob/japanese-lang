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
        return Array.from(levelPanel.querySelectorAll('input:checked')).map(x => x.value);
    }

    function updateLevelLabel() {
        const selected = selectedLevels();
        levelBtn.textContent = selected.length === 2 ? 'N5 + N4' : (selected[0] || 'All Levels');
    }

    function filteredCards() {
        const q = search.value.trim().toLowerCase();
        const levels = selectedLevels();
        return cards.filter(item => {
            if (levels.length && !levels.includes(item.level)) return false;
            if (!q) return true;
            const romaji = kanaToRomaji(item.reading || '').toLowerCase();
            return String(item.kanji).toLowerCase().includes(q) ||
                String(item.no).includes(q) ||
                String(item.reading || '').toLowerCase().includes(q) ||
                romaji.includes(q);
        });
    }

    function render() {
        let visible = filteredCards();
        if (mode.value === 'shuffle') visible = [...visible].sort(() => Math.random() - 0.5);
        grid.innerHTML = visible.map(item => `
            <div class="card kanji-card" data-no="${item.no}">
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
                        <div class="kanji-reading">${item.reading || '—'}</div>
                        <div class="kanji-romaji">${kanaToRomaji(item.reading || '')}</div>
                        <div class="kanji-meaning">${item.meaning || '—'}</div>
                    </div>
                </div>
            </div>`).join('');
        grid.querySelectorAll('.card').forEach(card => card.addEventListener('click', () => card.classList.toggle('flipped')));
        if (showBack) grid.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
        count.textContent = `Showing ${visible.length} kanji`;
        clear.hidden = !search.value;
    }

    search.addEventListener('input', render);
    clear.addEventListener('click', () => { search.value = ''; render(); search.focus(); });
    levelPanel.addEventListener('change', () => { updateLevelLabel(); render(); });
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
