// Similar Words card system
(function () {
    const grid = document.getElementById('similarWordsGrid');
    const count = document.getElementById('similarWordsCount');
    const mode = document.getElementById('similarWordsMode');
    const direction = document.getElementById('similarWordsDirection');
    const romajiToggle = document.getElementById('similarWordsRomajiToggle');
    const shuffleBtn = document.getElementById('similarWordsShuffleBtn');
    if (!grid) return;

    const words = [
        { jp: 'なんで', romaji: 'nande', bn: 'কেন', group: 'why', no: 1 }
    ];
    let showJapaneseFirst = true;
    let showRomaji = true;
    let cards = words.slice();

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
    }

    function render() {
        grid.innerHTML = '';
        cards.forEach((word, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.kanji = word.jp;
            card.innerHTML = `
                <div class="lesson-card-topbar">
                    <button type="button" class="hard-star" aria-label="Mark as hard vocabulary">☆</button>
                    <span class="lesson-card-number">${index + 1}</span>
                    <span class="lesson-tag">Why</span>
                    <button type="button" class="speaker-btn" aria-label="Play pronunciation">🔊</button>
                </div>
                <div class="inner lesson-card-inner">
                    <div class="front">
                        <div class="jp">${escapeHtml(showJapaneseFirst ? word.jp : word.bn)}</div>
                        <div class="romaji" ${showRomaji ? '' : 'hidden'}>${escapeHtml(showJapaneseFirst ? word.romaji : '')}</div>
                    </div>
                    <div class="back">
                        <div class="jp">${escapeHtml(showJapaneseFirst ? word.bn : word.jp)}</div>
                        <div class="romaji" ${showRomaji ? '' : 'hidden'}>${escapeHtml(showJapaneseFirst ? '' : word.romaji)}</div>
                    </div>
                </div>`;
            card.addEventListener('click', e => { if (!e.target.closest('button')) card.classList.toggle('flipped'); });
            card.querySelector('.hard-star').addEventListener('click', e => { e.stopPropagation(); const b=e.currentTarget; b.classList.toggle('active'); b.textContent=b.classList.contains('active')?'★':'☆'; });
            card.querySelector('.speaker-btn').addEventListener('click', e => { e.stopPropagation(); speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(word.jp); u.lang='ja-JP'; speechSynthesis.speak(u); });
            grid.appendChild(card);
        });
        count.textContent = `Showing ${cards.length} ${cards.length === 1 ? 'card' : 'cards'}`;
    }
    function shuffle() { cards = cards.slice().sort(() => Math.random() - .5); render(); }
    direction?.addEventListener('click', () => { showJapaneseFirst = !showJapaneseFirst; direction.setAttribute('aria-pressed', String(!showJapaneseFirst)); render(); });
    romajiToggle?.addEventListener('click', () => { showRomaji = !showRomaji; romajiToggle.setAttribute('aria-pressed', String(showRomaji)); render(); });
    shuffleBtn?.addEventListener('click', shuffle);
    mode?.addEventListener('change', () => { if (mode.value === 'shuffle') shuffle(); else { cards = words.slice(); render(); } });
    render();
})();