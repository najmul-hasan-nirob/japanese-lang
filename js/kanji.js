(function () {
    function init() {
        const grid = document.getElementById('kanjiGrid');
        const search = document.getElementById('kanjiSearch');
        const clear = document.getElementById('kanjiSearchClear');
        const levelPanel = document.getElementById('kanjiLevelPanel');
        const levelBtn = document.getElementById('kanjiLevelBtn');
        const mode = document.getElementById('kanjiMode');
        const shuffleBtn = document.getElementById('kanjiShuffleBtn');
        const count = document.getElementById('kanjiCount');
        if (!grid || !levelPanel || !search || !clear || !mode || !shuffleBtn || !count || !Array.isArray(window.kanjiData)) return;

        // Batch 20-30 from the PDF. Mapping is by Kanji character, never by
        // array position, so the site's existing Kanji order is unchanged.
        const batchChars = new Set(['十','百','千','万','円','年','上','下','中','半','分']);

        const cards = window.kanjiData.map(function (item, index) {
            const no = item.no || index + 1;
            const extra = (window.n5KanjiBangla && window.n5KanjiBangla[item.kanji]) || {};
            const hasMnemonic = batchChars.has(item.kanji) && Number.isInteger(extra.mnemonicIndex);
            return {
                no: no,
                kanji: item.kanji || '',
                level: item.level || 'N5',
                kunyomi: item.kunyomi || '',
                onyomi: item.onyomi || '',
                reading: item.reading || '',
                meaning: hasMnemonic ? (extra.meaning || item.meaning || '') : (item.meaning || ''),
                mnemonicImage: hasMnemonic ? 'assets/kanji-mnemonics.webp?v=2' : '',
                mnemonicIndex: hasMnemonic ? extra.mnemonicIndex : null,
                banglaExamples: hasMnemonic && Array.isArray(extra.examples) ? extra.examples : []
            };
        }).filter(function (item) { return item.kanji; });

        function esc(v) {
            return String(v == null ? '' : v).replace(/[&<>\'"]/g, function (ch) {
                return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch];
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
        function filtered() {
            const q = search.value.trim().toLowerCase();
            const levels = selectedLevels();
            return cards.filter(function (item) {
                if (levels.length && !levels.includes(item.level)) return false;
                if (!q) return true;
                return [item.kanji,item.kunyomi,item.onyomi,item.reading,item.meaning,item.level,String(item.no)].join(' ').toLowerCase().includes(q);
            });
        }
        function details(item) {
            let html = item.meaning ? '<div class="kanji-detail-meaning">' + esc(item.meaning) + '</div>' : '';
            html += '<div class="kanji-reading-line"><span class="kanji-reading-label">Kunyomi:</span> ' + (item.kunyomi ? esc(item.kunyomi) : '—') + '</div>';
            html += '<div class="kanji-reading-line"><span class="kanji-reading-label">Onyomi:</span> ' + (item.onyomi ? esc(item.onyomi) : '—') + '</div>';
            if (item.banglaExamples.length) {
                html += '<div class="kanji-bangla-examples"><div class="kanji-examples-title">উদাহরণ:</div>';
                html += item.banglaExamples.map(function (ex) {
                    return '<div class="kanji-example-line"><span class="kanji-example-jp">' + esc(ex.jp) + '</span> — <span class="kanji-example-bn">' + esc(ex.bn) + '</span></div>';
                }).join('') + '</div>';
            }
            return html;
        }
        function render() {
            let visible = filtered();
            if (mode.value === 'shuffle') visible = visible.slice().sort(function () { return Math.random() - 0.5; });
            grid.innerHTML = visible.map(function (item) {
                let image = '';
                if (item.mnemonicImage && Number.isInteger(item.mnemonicIndex)) {
                    const x = (item.mnemonicIndex % 5) * -180;
                    const y = Math.floor(item.mnemonicIndex / 5) * -140;
                    image = '<div class="kanji-mnemonic-image" style="background-image:url(\'' + item.mnemonicImage + '\');background-size:900px 1120px;background-position:' + x + 'px ' + y + 'px;background-repeat:no-repeat;" role="img" aria-label="' + esc(item.kanji) + ' mnemonic image"></div>';
                }
                return '<div class="card kanji-card" data-no="' + item.no + '" data-kanji="' + esc(item.kanji) + '"><div class="inner">' +
                    '<div class="front"><div class="lesson-card-topbar"><span class="lesson-card-number">' + item.no + '</span><span class="lesson-tag">' + esc(item.level) + '</span></div><div class="kanji-character">' + esc(item.kanji) + '</div></div>' +
                    '<div class="back"><div class="lesson-card-topbar"><span class="lesson-card-number">' + item.no + '</span><span class="lesson-tag">' + esc(item.level) + '</span></div>' + image +
                    '<div class="kanji-character small">' + esc(item.kanji) + '</div><div class="kanji-details">' + details(item) + '</div></div></div></div>';
            }).join('');
            grid.querySelectorAll('.card').forEach(function (card) { card.addEventListener('click', function () { card.classList.toggle('flipped'); }); });
            count.textContent = 'Showing ' + visible.length + ' kanji';
            clear.hidden = !search.value;
        }
        levelBtn.addEventListener('click', function (e) { e.stopPropagation(); const open = levelPanel.classList.toggle('open'); levelBtn.setAttribute('aria-expanded', String(open)); });
        levelPanel.addEventListener('click', function (e) { e.stopPropagation(); });
        levelPanel.addEventListener('change', function () { updateLevelLabel(); render(); });
        document.addEventListener('click', function () { levelPanel.classList.remove('open'); levelBtn.setAttribute('aria-expanded', 'false'); });
        search.addEventListener('input', render);
        clear.addEventListener('click', function () { search.value = ''; render(); search.focus(); });
        mode.addEventListener('change', render);
        shuffleBtn.addEventListener('click', function () { mode.value = 'shuffle'; render(); });
        updateLevelLabel();
        render();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
