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

        // The Kanji page now uses the complete kanji-data.js registry.
        // No manual Kanji dataset is loaded or required.
        const cards = window.kanjiData.map(function (item, index) {
            return {
                no: item.no || index + 1,
                kanji: item.kanji || '',
                level: item.level || 'N5',
                reading: item.reading || '',
                meaning: item.meaning || ''
            };
        }).filter(function (item) { return item.kanji; });

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
                const text = [item.kanji, item.reading, item.meaning, item.level, String(item.no)].join(' ').toLowerCase();
                return text.includes(q);
            });
        }

        function detailHtml(item) {
            const details = [];
            if (item.reading) details.push('<div class="kanji-reading-line"><span class="kanji-reading-label">Reading:</span> ' + escapeHtml(item.reading) + '</div>');
            if (item.meaning) details.push('<div class="kanji-reading-line"><span class="kanji-reading-label">Meaning:</span> ' + escapeHtml(item.meaning) + '</div>');
            return details.join('');
        }

        function render() {
            let visible = filteredCards();
            if (mode.value === 'shuffle') visible = visible.slice().sort(function () { return Math.random() - 0.5; });

            grid.innerHTML = visible.map(function (item) {
                return '<div class="card kanji-card" data-no="' + item.no + '" data-kanji="' + escapeHtml(item.kanji) + '">' +
                    '<div class="inner">' +
                        '<div class="front">' +
                            '<div class="lesson-card-topbar"><span class="lesson-card-number">' + item.no + '</span><span class="lesson-tag">' + escapeHtml(item.level) + '</span></div>' +
                            '<div class="kanji-character">' + escapeHtml(item.kanji) + '</div>' +
                        '</div>' +
                        '<div class="back">' +
                            '<div class="lesson-card-topbar"><span class="lesson-card-number">' + item.no + '</span><span class="lesson-tag">' + escapeHtml(item.level) + '</span></div>' +
                            '<div class="kanji-character small">' + escapeHtml(item.kanji) + '</div>' +
                            '<div class="kanji-details">' + detailHtml(item) + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');

            grid.querySelectorAll('.card').forEach(function (card) {
                card.addEventListener('click', function () {
                    card.classList.toggle('flipped');
                });
            });

            count.textContent = 'Showing ' + visible.length + ' kanji';
            clear.hidden = !search.value;
        }

        levelBtn.addEventListener('click', function (event) {
            event.stopPropagation();
            const open = levelPanel.classList.toggle('open');
            levelBtn.setAttribute('aria-expanded', String(open));
        });
        levelPanel.addEventListener('click', function (event) { event.stopPropagation(); });
        levelPanel.addEventListener('change', function () { updateLevelLabel(); render(); });
        document.addEventListener('click', function () {
            levelPanel.classList.remove('open');
            levelBtn.setAttribute('aria-expanded', 'false');
        });
        search.addEventListener('input', render);
        clear.addEventListener('click', function () {
            search.value = '';
            render();
            search.focus();
        });
        mode.addEventListener('change', render);
        shuffleBtn.addEventListener('click', function () {
            mode.value = 'shuffle';
            render();
        });

        updateLevelLabel();
        render();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
