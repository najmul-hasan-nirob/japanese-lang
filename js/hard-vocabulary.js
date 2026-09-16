// =====================================================
// Favourite / Hard Vocabulary system
// - Stores favourite keys in localStorage
// - Existing vocabulary cards and Kanji cards share the same store
// - Injects the Hard vocabulary checkbox into the lesson Type filter
// - Filtering itself is handled by lesson-filter.js
// =====================================================
(() => {
  'use strict';

  const STORAGE_KEY = 'japanese-lang-hard-vocabulary';
  let hardWords = new Set();

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...hardWords]));
      window.dispatchEvent(new Event('japaneseLangFavouriteChanged'));
      window.dispatchEvent(new Event('japaneseLangDataChanged'));
      document.dispatchEvent(new CustomEvent('hardVocabularyUpdated'));
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

  function ensureCheckbox() {
    const p = panel();
    if (!p || p.querySelector('input[value="hard"]')) return;

    const label = document.createElement('label');
    label.innerHTML = '<input type="checkbox" value="hard"> Hard vocabulary';
    p.appendChild(label);
    document.dispatchEvent(new CustomEvent('hardVocabularyFilterReady'));
  }

  function init() {
    ensureCheckbox();
    addStars();

    document.addEventListener('lessonCardsRendered', addStars);

    window.addEventListener('japaneseLangCloudLoaded', () => {
      loadStored();
      addStars();
      document.dispatchEvent(new CustomEvent('hardVocabularyUpdated'));
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

  window.japaneseLangHardVocabulary = {
    getKey: cardKey,
    isHard: card => hardWords.has(cardKey(card)),
    sync: addStars
  };
})();
