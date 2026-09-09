// Similar Words uses the real Lesson card DOM and the real Lesson controls.
(function () {
    const grid = document.getElementById('grid');
    const count = document.getElementById('countDisplay');
    const mode = document.getElementById('mode');
    const filterPanel = document.getElementById('similarWordsPanel');

    if (!grid || !count || !mode) return;

    const words = [
        { jp: 'なんで', romaji: 'nande', bn: 'কেন', group: 'why' }
    ];

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>'"]/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[c]));
    }

    function selectedGroups() {
        if (!filterPanel) return ['why'];
        return Array.from(filterPanel.querySelectorAll('input[type="checkbox"]:checked'))
            .map(input => input.value);
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
            card.dataset.romaji = word.romaji;
            card.__similarWord = word;

            card.innerHTML = `
                <div class="inner">
                    <div class="lesson-card-topbar">
                        <button type="button" class="hard-star" aria-label="Mark as hard vocabulary" title="Mark as hard vocabulary">☆</button>
                        <span class="lesson-card-number" aria-hidden="true">${index + 1}</span>
                        <span class="lesson-tag">Why</span>
                        <button type="button" class="speaker-btn" aria-label="Play pronunciation" title="Play pronunciation">🔊</button>
                    </div>
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

    filterPanel?.addEventListener('change', render);
    mode.addEventListener('change', render);
    document.getElementById('shuffleBtn')?.addEventListener('click', function () {
        mode.value = 'shuffle';
        render();
    });

    render();
})();
