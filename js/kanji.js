(function () {
    function init() {
        const grid = document.getElementById('kanjiGrid');
        const search = document.getElementById('kanjiSearch');
        const clear = document.getElementById('kanjiSearchClear');
        const levelPanel = document.getElementById('kanjiLevelPanel');
        const levelBtn = document.getElementById('kanjiLevelBtn');
        const mode = document.getElementById('kanjiMode');
        const shuffleBtn = document.getElementById('kanjiShuffleBtn');
        const directionBtn = document.getElementById('kanjiDirection');
        const count = document.getElementById('kanjiCount');

        if (!grid || !levelPanel || !Array.isArray(window.kanjiManualData)) return;

        // Manual-only source. All Kanji information comes from js/kanji-manual-data.js.
        const cards = window.kanjiManualData.map(function (item, index) {
            return {
                no: item.no || index + 1,
                kanji: item.kanji || '',
                level: item.level || 'N5',
                kunyomi: Array.isArray(item.kun) ? item.kun.join('、') : (item.kun || ''),
                onyomi: Array.isArray(item.on) ? item.on.join('、') : (item.on || ''),
                meaning: item.meaning || '',
                examples: Array.isArray(item.examples) ? item.examples.map(function (e) {
                    if (typeof e === 'string') return { word: e, reading: '', romaji: '', meaning: '', furigana: [] };
                    return {
                        word: e.word || '',
                        reading: e.reading || '',
                        romaji: e.romaji || '',
                        meaning: e.meaning || '',
                        furigana: Array.isArray(e.furigana) ? e.furigana : []
                    };
                }) : []
            };
        }).filter(function (item) { return item.kanji; });

        let showBack = false;
        const UI_STATE_KEY = 'japanese-lang-ui-state-v1';
        const PAGE_KEY = (location.pathname || '/').replace(/\/+$/, '') || '/';
        const FLIP_ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>';

        function kanaToRomaji(text) {
            text = String(text || '').replace(/[ァ-ヺ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0x60); });
            const table = {'きゃ':'kya','きゅ':'kyu','きょ':'kyo','しゃ':'sha','しゅ':'shu','しょ':'sho','ちゃ':'cha','ちゅ':'chu','ちょ':'cho','にゃ':'nya','にゅ':'nyu','にょ':'nyo','ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','みゃ':'mya','みゅ':'myu','みょ':'myo','りゃ':'rya','りゅ':'ryu','りょ':'ryo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo','じゃ':'ja','じゅ':'ju','じょ':'jo','びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo','あ':'a','い':'i','う':'u','え':'e','お':'o','か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko','が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go','さ':'sa','し':'shi','す':'su','せ':'se','そ':'so','ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo','た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to','だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do','な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no','は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho','ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo','ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po','ま':'ma','み':'mi','む':'mu','め':'me','も':'mo','や':'ya','ゆ':'yu','よ':'yo','ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro','わ':'wa','を':'o','ん':'n','っ':'','ー':'-'};
            let out = '';
            for (let i = 0; i < text.length; i++) {
                if (text[i] === 'っ') { const n = table[text.slice(i + 1, i + 3)] || table[text[i + 1]] || ''; if (n) out += n.charAt(0); continue; }
                const pair = text.slice(i, i + 2);
                if (table[pair]) { out += table[pair]; i++; continue; }
                out += table[text[i]] ?? text[i];
            }
            return out;
        }

        function escapeHtml(value) {
            return String(value == null ? '' : value).replace(/[&<>\'"]/g, function (ch) {
                return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]);
            });
        }

        function selectedLevels() {
            return Array.from(levelPanel.querySelectorAll('input[type="checkbox"]:checked')).map(function (x) { return x.value; });
        }

        function updateLevelLabel() {
            const selected = selectedLevels();
            const all = Array.from(levelPanel.querySelectorAll('input[type="checkbox"]'));
            levelBtn.textContent = selected.length === all.length ? 'N5 + N4' : selected.length ? selected.join(' + ') : 'None';
        }

        function filteredCards() {
            const q = search.value.trim().toLowerCase();
            const levels = selectedLevels();
            return cards.filter(function (item) {
                if (levels.length && !levels.includes(item.level)) return false;
                if (!q) return true;
                const text = [item.kanji, item.kunyomi, item.onyomi, item.meaning, kanaToRomaji(item.kunyomi), kanaToRomaji(item.onyomi)]
                    .concat(item.examples.flatMap(function (e) { return [e.word, e.reading, e.meaning, e.romaji || kanaToRomaji(e.reading)]; }))
                    .join(' ').toLowerCase();
                return text.includes(q) || String(item.no).includes(q);
            });
        }

        function readingsHtml(value) {
            return String(value || '').split(/[、,\s]+/).filter(Boolean).map(function (kana) {
                return escapeHtml(kana) + ' (' + escapeHtml(kanaToRomaji(kana)) + ')';
            }).join(', ');
        }

        function furiganaHtml(example) {
            if (!Array.isArray(example.furigana) || !example.furigana.length) return escapeHtml(example.word);
            const parts = [];
            example.furigana.forEach(function (part) {
                if (part && part.kanji) {
                    parts.push('<ruby>' + escapeHtml(part.kanji) + '<rt>' + escapeHtml(part.reading || '') + '</rt></ruby>');
                }
            });
            return parts.length ? parts.join('') : escapeHtml(example.word);
        }

        function detailHtml(item) {
            const kun = readingsHtml(item.kunyomi);
            const on = readingsHtml(item.onyomi);
            const jap = kun ? '<div class="kanji-reading-line"><span class="kanji-reading-label">Jap:</span> ' + kun + ' - ' + escapeHtml(item.meaning) + '</div>' : (item.meaning ? '<div class="kanji-reading-line"><span class="kanji-reading-label">Jap:</span> - ' + escapeHtml(item.meaning) + '</div>' : '');
            const chi = on ? '<div class="kanji-reading-line kanji-chi-line"><span class="kanji-reading-label">Chi:</span> ' + on + '</div>' : '';
            const examplesHtml = item.examples.filter(function (e) { return e.word && e.word !== item.kanji; }).map(function (e) {
                const reading = e.reading || '';
                const romaji = e.romaji || kanaToRomaji(reading);
                return '<div class="kanji-reading-line kanji-example-line"><span class="kanji-reading-label">Ex:</span> ' + furiganaHtml(e) + (reading ? ' - ' + escapeHtml(reading) + ' (' + escapeHtml(romaji) + ')' : '') + (e.meaning ? ' - ' + escapeHtml(e.meaning) : '') + '</div>';
            }).join('');
            return jap + chi + examplesHtml;
        }

        function render() {
            let visible = filteredCards();
            if (mode.value === 'shuffle') visible = visible.slice().sort(function () { return Math.random() - 0.5; });
            grid.innerHTML = visible.map(function (item) {
                return '<div class="card kanji-card" data-no="' + item.no + '" data-kanji="' + escapeHtml(item.kanji) + '"><div class="inner"><div class="front"><div class="lesson-card-topbar"><span class="lesson-card-number">' + item.no + '</span><span class="lesson-tag">' + escapeHtml(item.level) + '</span></div><div class="kanji-character">' + escapeHtml(item.kanji) + '</div></div><div class="back"><div class="lesson-card-topbar"><span class="lesson-card-number">' + item.no + '</span><span class="lesson-tag">' + escapeHtml(item.level) + '</span></div><div class="kanji-character small">' + escapeHtml(item.kanji) + '</div><div class="kanji-details">' + detailHtml(item) + '</div></div></div></div>';
            }).join('');
            grid.querySelectorAll('.card').forEach(function (card) {
                card.addEventListener('click', function (event) {
                    if (event.target.closest('.speaker-btn')) return;
                    card.classList.toggle('flipped');
                });
            });
            if (showBack) grid.querySelectorAll('.card').forEach(function (card) { card.classList.add('flipped'); });
            count.textContent = 'Showing ' + visible.length + ' kanji';
            clear.hidden = !search.value;
        }

        function readUIState() {
            try {
                const all = JSON.parse(localStorage.getItem(UI_STATE_KEY) || '{}');
                return all && typeof all === 'object' ? all : {};
            } catch (_) { return {}; }
        }

        function saveUIState() {
            try {
                const all = readUIState();
                const previous = all[PAGE_KEY] && typeof all[PAGE_KEY] === 'object' ? all[PAGE_KEY] : {};
                const controls = previous.controls && typeof previous.controls === 'object' ? { ...previous.controls } : {};
                levelPanel.querySelectorAll('input[type="checkbox"]').forEach(function (el) {
                    if (el.id) controls[el.id] = { type:'checkbox', checked:el.checked };
                });
                all[PAGE_KEY] = { updatedAt:Date.now(), controls:controls };
                localStorage.setItem(UI_STATE_KEY, JSON.stringify(all));
            } catch (_) {}
        }

        function restoreUIState() {
            const saved = readUIState()[PAGE_KEY];
            const controls = saved && saved.controls && typeof saved.controls === 'object' ? saved.controls : {};
            levelPanel.querySelectorAll('input[type="checkbox"]').forEach(function (el) {
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
            grid.querySelectorAll('.card').forEach(function (card) { card.classList.toggle('flipped', showBack); });
        }

        levelBtn.addEventListener('click', function (event) {
            event.stopPropagation();
            const open = levelPanel.classList.toggle('open');
            levelBtn.setAttribute('aria-expanded', String(open));
        });
        levelPanel.addEventListener('click', function (event) { event.stopPropagation(); });
        levelPanel.addEventListener('change', function () { updateLevelLabel(); saveUIState(); render(); });
        document.addEventListener('click', function () { levelPanel.classList.remove('open'); levelBtn.setAttribute('aria-expanded', 'false'); });
        directionBtn.addEventListener('click', function (event) { event.preventDefault(); event.stopPropagation(); toggleAllCards(); });
        search.addEventListener('input', render);
        clear.addEventListener('click', function () { search.value = ''; render(); search.focus(); });
        mode.addEventListener('change', render);
        shuffleBtn.addEventListener('click', function () { mode.value = 'shuffle'; render(); });

        restoreUIState();
        updateDirectionUI();
        render();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
