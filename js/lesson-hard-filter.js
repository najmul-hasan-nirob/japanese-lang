// =====================================================
// Lesson Hard Vocabulary filter
// =====================================================
// The favourite store is shared with Kanji. Hard vocabulary is
// a normal lesson filter: selected type(s) still define the base
// set, while the Hard checkbox limits vocabulary cards to favourites.
// The selected filter itself is persisted by lesson-filter-persistence.js.
// =====================================================
(() => {
  'use strict';

  const STORAGE_KEY = 'japanese-lang-hard-vocabulary';

  function storedHard() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch (_) {
      return new Set();
    }
  }

  function isHardCard(card, hardSet) {
    const api = window.japaneseLangHardVocabulary;
    if (api?.getKey) return hardSet.has(api.getKey(card));

    const front = card.querySelector('.front > div')?.textContent?.trim() || '';
    const romaji = card.querySelector('.romaji')?.textContent?.trim() || '';
    const english = card.querySelector('.english')?.textContent?.trim() || '';
    return hardSet.has(`${front}|${romaji}|${english}`);
  }

  function apply() {
    const grid = document.getElementById('grid');
    const typePanel = document.getElementById('typePanel');
    if (!grid || !typePanel) return;

    const hard = typePanel.querySelector('input[value="hard"]');
    const hardSelected = !!hard?.checked;
    const hardSet = hardSelected ? storedHard() : null;

    grid.querySelectorAll(':scope > .card').forEach(card => {
      const isVocabulary = !!card.querySelector('.vocabulary-back');
      if (!hardSelected) {
        card.style.display = '';
        return;
      }
      card.style.display = isVocabulary && isHardCard(card, hardSet) ? '' : 'none';
    });

    const count = document.getElementById('countDisplay');
    if (count && hardSelected) {
      const visible = grid.querySelectorAll(':scope > .card:not([style*="display: none"])').length;
      count.textContent = `Showing ${visible} Hard Vocabulary`;
    }
  }

  function refresh() {
    window.japaneseLangHardVocabulary?.sync?.();
    apply();
  }

  function init() {
    document.addEventListener('lessonCardsRendered', () => setTimeout(apply, 0));
    document.addEventListener('hardVocabularyFilterReady', () => setTimeout(apply, 0));
    document.addEventListener('hardVocabularyUpdated', refresh);

    document.getElementById('typePanel')?.addEventListener('change', event => {
      if (event.target?.value === 'hard') setTimeout(apply, 0);
    });

    window.addEventListener('japaneseLangCloudLoaded', refresh);
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
