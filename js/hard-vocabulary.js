// =====================================================
// Favourite / Hard Vocabulary system
// - Stores favourite keys in localStorage
// - Existing vocabulary cards use the same store as before
// - Any card with data-favorite-key can use the same star system
// - Kanji cards also use this persistent favourite store
// - Changes are exposed to supabase-sync.js through japaneseLangDataChanged
// - Hard vocabulary filter selection is also persisted locally
// =====================================================
(() => {
  'use strict';

  const STORAGE_KEY = 'japanese-lang-hard-vocabulary';
  const FILTER_STORAGE_KEY = 'japanese-lang-hard-filter';
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

  function loadFilterState() {
    try {
      return localStorage.getItem(FILTER_STORAGE_KEY) === 'true';
    } catch (_) {
      return false;
    }
  }

  function saveFilterState() {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, String(hardMode));
    } catch (_) {}
  }

  loadStored();
  hardMode = loadFilterState();

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...hardWords]));
      window.dispatchEvent(new Event('japaneseLangFavouriteChanged'));
      window.dispatchEvent(new Event('japaneseLangDataChanged'));
    } catch (_) {}
  };

  const grids = () => [
    document.getElementById('grid'),
    document.getElementById('importantRulesList'),
    document.getElementById('kanjiGrid')
  ].filter(Boolean);

  const panel = () => document.getElementById('typePanel');

  function cardKey(card) {
    const custom = card.getAttribute('data-favorite-key');
    if (custom) return custom;

    const kanji = card.dataset.kanji || card.querySelector('.kanji-character')?.textContent?.trim() || '';
    if (kanji && (card.closest('#kanjiGrid') || card.classList.contains('kanji-card'))) {
      return `kanji|${kanji}`;
    }

    const front = card.querySelector('.front > div')?.textContent?.trim() || '';
    const romaji = card.querySelector('.romaji')?.textContent?.trim() || '';
    const english = card.querySelector('.english')?.textContent?.trim() || '';
    return `${front}|${romaji}|${english}`;
  }

  function canFavourite(card) {
    return !!card.getAttribute('data-favorite-key') ||
      !!card.querySelector('.vocabulary-back') ||
      !!card.closest('#kanjiGrid') ||
      card.classList.contains('kanji-card');
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

    if (!star.dataset.favouriteBound) {
      star.dataset.favouriteBound = 'true';
      star.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const key = cardKey(card);
        hardWords.has(key) ? hardWords.delete(key) : hardWords.add(key);
        save();
        updateStar(card);

        if (hardMode && card.closest('#grid')) applyFilter();
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
    grids().forEach(g => g.querySelectorAll(':scope > .card').forEach(updateStar));
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
    saveFilterState();
    document.getElementById('grid')?.querySelectorAll(':scope > .card').forEach(card => { card.style.display = ''; });
    addStars();
  }

  function ensureCheckbox() {
    const p = panel();
    if (!p || p.querySelector('input[value="hard"]')) return;

    const label = document.createElement('label');
    label.innerHTML = '<input type="checkbox" value="hard"> Hard vocabulary';
    p.appendChild(label);
    document.dispatchEvent(new CustomEvent('hardVocabularyFilterReady'));
  }

  function restoreCheckbox() {
    const input = panel()?.querySelector('input[value="hard"]');
    if (!input) return;
    input.checked = hardMode;
    if (hardMode) setTimeout(applyFilter, 0);
  }

  function init() {
    ensureCheckbox();

    panel()?.addEventListener('change', event => {
      if (event.target?.value === 'hard') {
        hardMode = event.target.checked;
        saveFilterState();
        if (hardMode) {
          setTimeout(applyFilter, 0);
        } else {
          clearFilter();
        }
        return;
      }

      if (hardMode) setTimeout(applyFilter, 0);
    });

    restoreCheckbox();
    addStars();

    document.addEventListener('lessonCardsRendered', () => {
      addStars();
      if (hardMode) applyFilter();
    });

    window.addEventListener('japaneseLangCloudLoaded', () => {
      loadStored();
      addStars();
      if (hardMode) applyFilter();
    });

    const kanjiGrid = document.getElementById('kanjiGrid');
    if (kanjiGrid) {
      new MutationObserver(() => setTimeout(addStars, 0)).observe(kanjiGrid, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
