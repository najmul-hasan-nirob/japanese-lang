// =====================================================
// Hard Vocabulary filter — lessons page
// =====================================================
(() => {
  'use strict';

  const STORAGE_KEY = 'japanese-lang-hard-vocabulary';
  let hardWords = new Set();
  let hardMode = false;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) hardWords = new Set(saved);
  } catch (_) {}

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...hardWords])); } catch (_) {}
  };
  const grid = () => document.getElementById('grid');
  const panel = () => document.getElementById('typePanel');

  function cardKey(card) {
    const front = card.querySelector('.front > div')?.textContent?.trim() || '';
    const romaji = card.querySelector('.romaji')?.textContent?.trim() || '';
    const english = card.querySelector('.english')?.textContent?.trim() || '';
    return `${front}|${romaji}|${english}`;
  }

  function updateStar(card) {
    if (!card.querySelector('.vocabulary-back')) return;

    let star = card.querySelector('.hard-star');
    if (!star) {
      star = document.createElement('button');
      star.type = 'button';
      star.className = 'hard-star';
      card.querySelector('.lesson-card-topbar')?.appendChild(star) || card.appendChild(star);

      star.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const key = cardKey(card);
        hardWords.has(key) ? hardWords.delete(key) : hardWords.add(key);
        save();
        updateStar(card);

        if (hardMode) applyFilter();
      });
    }

    const active = hardWords.has(cardKey(card));
    star.textContent = active ? '★' : '☆';
    star.classList.toggle('active', active);
    star.setAttribute('aria-pressed', String(active));
    star.setAttribute('aria-label', active ? 'Remove from hard vocabulary' : 'Mark as hard vocabulary');
  }

  function addStars() {
    grid()?.querySelectorAll(':scope > .card').forEach(updateStar);
  }

  function applyFilter() {
    addStars();

    const cards = [...(grid()?.querySelectorAll(':scope > .card') || [])];
    let visible = 0;

    cards.forEach(card => {
      const isHard = !!card.querySelector('.vocabulary-back') && hardWords.has(cardKey(card));

      // Use inline display instead of the hidden attribute. Some of the
      // lesson-card CSS uses explicit display rules, which can override
      // the browser's default [hidden] { display:none } rule.
      card.style.display = isHard ? '' : 'none';
      if (isHard) visible++;
    });

    const count = document.getElementById('cardCount');
    if (count) count.textContent = `Showing ${visible} hard vocabulary cards`;
  }

  function clearFilter() {
    hardMode = false;
    grid()?.querySelectorAll(':scope > .card').forEach(card => {
      card.style.display = '';
    });
    addStars();
  }

  function ensureCheckbox() {
    const p = panel();
    if (!p || p.querySelector('input[value="hard"]')) return;

    const label = document.createElement('label');
    label.innerHTML = '<input type="checkbox" value="hard"> Hard vocabulary';
    p.appendChild(label);
  }

  function init() {
    ensureCheckbox();

    panel()?.addEventListener('change', event => {
      if (event.target?.value !== 'hard') return;

      hardMode = event.target.checked;
      hardMode ? applyFilter() : clearFilter();
    });

    addStars();

    document.addEventListener('lessonCardsRendered', () => {
      addStars();
      if (hardMode) applyFilter();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
