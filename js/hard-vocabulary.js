// =====================================================
// Favourite / Hard Vocabulary system
// - Stores favourite keys in localStorage
// - Existing vocabulary cards use the same store as before
// - Any card with data-favorite-key can use the same star system
// - supabase-sync.js mirrors this local store to Supabase
// =====================================================
(() => {
  'use strict';

  const STORAGE_KEY = 'japanese-lang-hard-vocabulary';
  let hardWords = new Set();
  let hardMode = false;

  function loadStored() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      hardWords = new Set(Array.isArray(saved) ? saved : []);
    } catch (_) {
      hardWords = new Set();
    }
  }

  loadStored();

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...hardWords])); } catch (_) {}
  };
  const grid = () => document.getElementById('grid') || document.getElementById('importantRulesList');
  const panel = () => document.getElementById('typePanel');

  function cardKey(card) {
    const custom = card.getAttribute('data-favorite-key');
    if (custom) return custom;

    const front = card.querySelector('.front > div')?.textContent?.trim() || '';
    const romaji = card.querySelector('.romaji')?.textContent?.trim() || '';
    const english = card.querySelector('.english')?.textContent?.trim() || '';
    return `${front}|${romaji}|${english}`;
  }

  function canFavourite(card) {
    return !!card.getAttribute('data-favorite-key') || !!card.querySelector('.vocabulary-back');
  }

  function updateStar(card) {
    if (!canFavourite(card)) return;

    let star = card.querySelector('.hard-star');
    if (!star) {
      star = document.createElement('button');
      star.type = 'button';
      star.className = 'hard-star';
      star.setAttribute('aria-label', 'Mark as favourite');
      star.setAttribute('title', 'Mark as favourite');
      card.querySelector('.lesson-card-topbar')?.appendChild(star) || card.appendChild(star);
    }

    // Some cards (such as Important Rules) render their own star before this
    // system runs. Always bind the handler once, regardless of who created it.
    if (!star.dataset.favouriteBound) {
      star.dataset.favouriteBound = 'true';
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
    star.setAttribute('aria-label', active ? 'Remove from favourites' : 'Mark as favourite');
    star.setAttribute('title', active ? 'Remove from favourites' : 'Mark as favourite');
  }

  function addStars() {
    grid()?.querySelectorAll(':scope > .card').forEach(updateStar);
  }

  function applyFilter() {
    addStars();

    const cards = [...(document.getElementById('grid')?.querySelectorAll(':scope > .card') || [])];
    let visible = 0;

    cards.forEach(card => {
      const isHard = !!card.querySelector('.vocabulary-back') && hardWords.has(cardKey(card));
      card.style.display = isHard ? '' : 'none';
      if (isHard) visible++;
    });

    const count = document.getElementById('cardCount');
    if (count) count.textContent = `Showing ${visible} hard vocabulary cards`;
  }

  function clearFilter() {
    hardMode = false;
    document.getElementById('grid')?.querySelectorAll(':scope > .card').forEach(card => { card.style.display = ''; });
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

    // Hard vocabulary is an overlay filter. Any change in the normal type
    // filters must be followed by the hard filter, otherwise a lesson render
    // can temporarily restore all vocabulary cards while Hard vocabulary is on.
    panel()?.addEventListener('change', event => {
      if (event.target?.value === 'hard') {
        hardMode = event.target.checked;
        if (hardMode) {
          setTimeout(applyFilter, 0);
        } else {
          clearFilter();
        }
        return;
      }

      if (hardMode) setTimeout(applyFilter, 0);
    });

    addStars();

    document.addEventListener('lessonCardsRendered', () => {
      addStars();
      if (hardMode) applyFilter();
    });

    // supabase-sync.js pulls the cloud copy into localStorage and then
    // dispatches this event. Refresh the visible stars from that store.
    window.addEventListener('japaneseLangCloudLoaded', () => {
      loadStored();
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
