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

  const getGrid = () => document.getElementById('grid');
  const getPanel = () => document.getElementById('typePanel');

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
      star.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const key = cardKey(card);
        if (hardWords.has(key)) hardWords.delete(key);
        else hardWords.add(key);
        save();
        updateStar(card);
        if (hardMode) applyFilter();
      });
      card.querySelector('.lesson-card-topbar')?.appendChild(star) || card.appendChild(star);
    }
    const active = hardWords.has(cardKey(card));
    star.textContent = active ? '★' : '☆';
    star.classList.toggle('active', active);
    star.setAttribute('aria-pressed', String(active));
    star.setAttribute('aria-label', active ? 'Remove from hard vocabulary' : 'Mark as hard vocabulary');
    star.title = active ? 'Remove from hard vocabulary' : 'Hard vocabulary';
  }

  function addStars() {
    getGrid()?.querySelectorAll(':scope > .card').forEach(updateStar);
  }

  function applyFilter() {
    addStars();
    getGrid()?.querySelectorAll(':scope > .card').forEach(card => {
      const isHard = !!card.querySelector('.vocabulary-back') && hardWords.has(cardKey(card));
      card.style.display = isHard ? '' : 'none';
    });
    const count = document.getElementById('countDisplay');
    if (count) {
      const visible = [...(getGrid()?.querySelectorAll(':scope > .card') || [])]
        .filter(card => card.style.display !== 'none').length;
      count.textContent = `Showing ${visible} hard vocabulary`;
    }
  }

  function clearFilter() {
    hardMode = false;
    getGrid()?.querySelectorAll(':scope > .card').forEach(card => { card.style.display = ''; });
    addStars();
  }

  function ensureCheckbox() {
    const panel = getPanel();
    if (!panel || panel.querySelector('input[value="hard"]')) return;
    const label = document.createElement('label');
    label.innerHTML = '<input type="checkbox" value="hard"> Hard vocabulary';
    panel.appendChild(label);
  }

  function init() {
    ensureCheckbox();
    getPanel()?.addEventListener('change', event => {
      if (event.target?.value !== 'hard') return;
      hardMode = event.target.checked;
      if (hardMode) applyFilter();
      else clearFilter();
    });
    addStars();
    document.addEventListener('lessonCardsRendered', () => {
      addStars();
      if (hardMode) applyFilter();
    });
    new MutationObserver(() => {
      ensureCheckbox();
      addStars();
      if (hardMode) applyFilter();
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
