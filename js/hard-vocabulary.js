// =====================================================
// Favourite / Hard Vocabulary system
// =====================================================
(() => {
  'use strict';

  const STORAGE_KEY = 'japanese-lang-hard-vocabulary';
  const FILTER_KEY = 'japanese-lang-lesson-filter-v1';
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

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...hardWords])); } catch (_) {}
  }

  function savedHardMode() {
    try {
      const saved = JSON.parse(localStorage.getItem(FILTER_KEY) || 'null');
      return Array.isArray(saved?.selectedTypes) && saved.selectedTypes.includes('hard');
    } catch (_) {
      return false;
    }
  }

  loadStored();

  const grid = () => document.getElementById('grid') || document.getElementById('importantRulesList');
  const panel = () => document.getElementById('typePanel');

  function keyCandidates(card) {
    const keys = [];
    const custom = card.getAttribute('data-favorite-key');
    if (custom) keys.push(custom);

    const item = card.__lessonItem;
    if (item) {
      const lesson = String(item.lesson || '').trim();
      const type = String(item.type || '').trim();
      const jp = String(item.jp || '').trim();
      const en = String(item.en || '').trim();
      if (jp || en) keys.push(`v2|${lesson}|${type}|${jp}|${en}`);
    }

    const front = card.querySelector('.front > div')?.textContent?.trim() || '';
    const romaji = card.querySelector('.romaji')?.textContent?.trim() || '';
    const english = card.querySelector('.english')?.textContent?.trim() || '';
    if (front || romaji || english) keys.push(`${front}|${romaji}|${english}`);

    return [...new Set(keys)];
  }

  function isHardCard(card) {
    return keyCandidates(card).some(key => hardWords.has(key));
  }

  function canFavourite(card) {
    return !!card.querySelector('.vocabulary-back');
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

        const wasHard = isHardCard(card);
        const item = card.__lessonItem || {};
        const key = `v2|${String(item.lesson || '').trim()}|${String(item.type || '').trim()}|${String(item.jp || '').trim()}|${String(item.en || '').trim()}`;

        if (wasHard) {
          keyCandidates(card).forEach(candidate => hardWords.delete(candidate));
        } else {
          hardWords.add(key);
        }

        save();
        updateStar(card);
        document.dispatchEvent(new CustomEvent('hardVocabularyUpdated'));

        const checkbox = panel()?.querySelector('input[type="checkbox"][value="hard"]');
        if (checkbox?.checked && wasHard) {
          card.style.display = 'none';
          updateHardCount();
        }
      });
    }

    const active = isHardCard(card);
    star.textContent = active ? '★' : '☆';
    star.classList.toggle('active', active);
    star.setAttribute('aria-pressed', String(active));
    star.setAttribute('aria-label', active ? 'Remove from favourites' : 'Mark as favourite');
    star.setAttribute('title', active ? 'Remove from favourites' : 'Mark as favourite');
  }

  function addStars() {
    grid()?.querySelectorAll(':scope > .card').forEach(updateStar);
  }

  function updateHardCount() {
    const count = document.getElementById('cardCount');
    if (!count) return;
    const visible = [...(grid()?.querySelectorAll(':scope > .card') || [])]
      .filter(card => card.style.display !== 'none' && canFavourite(card) && isHardCard(card)).length;
    count.textContent = `Showing ${visible} hard vocabulary cards`;
  }

  function applyFilter() {
    addStars();
    const cards = [...(grid()?.querySelectorAll(':scope > .card') || [])];
    let visible = 0;

    cards.forEach(card => {
      const isHard = canFavourite(card) && isHardCard(card);
      card.style.display = isHard ? '' : 'none';
      if (isHard) visible++;
    });

    const count = document.getElementById('cardCount');
    if (count) count.textContent = `Showing ${visible} hard vocabulary cards`;
  }

  function clearFilter() {
    hardMode = false;
    grid()?.querySelectorAll(':scope > .card').forEach(card => { card.style.display = ''; });
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

  function restoreCheckboxFromFilterState() {
    const checkbox = panel()?.querySelector('input[type="checkbox"][value="hard"]');
    if (!checkbox) return;
    const shouldBeHard = savedHardMode();
    checkbox.checked = shouldBeHard;
  }

  function syncModeFromCheckbox() {
    const checkbox = panel()?.querySelector('input[type="checkbox"][value="hard"]');
    if (!checkbox) return;

    // The persisted filter state is authoritative during page initialization.
    // This prevents a later lesson render from briefly unchecking Hard and
    // clearing the filter while lazy lesson data is loading.
    if (savedHardMode()) checkbox.checked = true;

    hardMode = checkbox.checked;
    if (hardMode) applyFilter();
    else clearFilter();
  }

  window.japaneseLangHardVocabulary = {
    sync: syncModeFromCheckbox,
    apply: applyFilter,
    clear: clearFilter,
    isActive: () => hardMode
  };

  function init() {
    ensureCheckbox();
    restoreCheckboxFromFilterState();

    panel()?.addEventListener('change', event => {
      if (event.target?.value === 'hard') {
        hardMode = event.target.checked;
        if (hardMode) applyFilter();
        else clearFilter();
        return;
      }
      if (hardMode || savedHardMode()) {
        const checkbox = panel()?.querySelector('input[type="checkbox"][value="hard"]');
        if (checkbox) checkbox.checked = true;
        hardMode = true;
        applyFilter();
      }
    });

    addStars();
    syncModeFromCheckbox();

    document.addEventListener('lessonCardsRendered', () => {
      addStars();
      if (savedHardMode()) {
        const checkbox = panel()?.querySelector('input[value="hard"]');
        if (checkbox) checkbox.checked = true;
        hardMode = true;
        applyFilter();
      }
    });

    document.addEventListener('lessonDataLoaded', () => {
      addStars();
      if (savedHardMode()) {
        const checkbox = panel()?.querySelector('input[value="hard"]');
        if (checkbox) checkbox.checked = true;
        hardMode = true;
        applyFilter();
      }
    });

    window.addEventListener('japaneseLangCloudLoaded', () => {
      loadStored();
      restoreCheckboxFromFilterState();
      addStars();
      syncModeFromCheckbox();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();