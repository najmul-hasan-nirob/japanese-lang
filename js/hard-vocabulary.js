// =====================================================
// Favourite / Hard Vocabulary system
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

  // Keep the old key format for compatibility, but also use a stable key based
  // on the actual lesson item. The old key depended on the current front side
  // (Japanese/romaji), so changing direction could make a saved hard word
  // impossible to find after a re-render.
  function keyCandidates(card) {
    const keys = [];
    const custom = card.getAttribute('data-favorite-key');
    if (custom) keys.push(custom);

    const item = card.__lessonItem;
    if (item) {
      const lesson = String(item.lesson || '');
      const type = String(item.type || '');
      const jp = String(item.jp || '').trim();
      const english = String(item.en || '').trim();
      keys.push(`v2|${lesson}|${type}|${jp}|${english}`);
    }

    const front = card.querySelector('.front > div')?.textContent?.trim() || '';
    const romaji = card.querySelector('.romaji')?.textContent?.trim() || '';
    const english = card.querySelector('.english')?.textContent?.trim() || '';
    keys.push(`${front}|${romaji}|${english}`);

    return [...new Set(keys)];
  }

  function cardKey(card) {
    return keyCandidates(card)[0] || '';
  }

  function isHardCard(card) {
    return keyCandidates(card).some(key => key && hardWords.has(key));
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

    if (!star.dataset.favouriteBound) {
      star.dataset.favouriteBound = 'true';
      star.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const key = `v2|${String(card.__lessonItem?.lesson || '')}|${String(card.__lessonItem?.type || '')}|${String(card.__lessonItem?.jp || '').trim()}|${String(card.__lessonItem?.en || '').trim()}`;
        if (isHardCard(card)) {
          keyCandidates(card).forEach(candidate => hardWords.delete(candidate));
        } else {
          hardWords.add(key);
        }
        save();
        updateStar(card);
        if (hardMode) applyFilter();
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

  function applyFilter() {
    addStars();
    const cards = [...(document.getElementById('grid')?.querySelectorAll(':scope > .card') || [])];
    let visible = 0;

    cards.forEach(card => {
      const isHard = !!card.querySelector('.vocabulary-back') && isHardCard(card);
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
    document.dispatchEvent(new CustomEvent('hardVocabularyFilterReady'));
  }

  function syncModeFromCheckbox() {
    const checkbox = panel()?.querySelector('input[type="checkbox"][value="hard"]');
    if (!checkbox) return;
    hardMode = checkbox.checked;
    if (hardMode) setTimeout(applyFilter, 0);
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

    panel()?.addEventListener('change', event => {
      if (event.target?.value === 'hard') {
        hardMode = event.target.checked;
        if (hardMode) setTimeout(applyFilter, 0);
        else clearFilter();
        return;
      }
      if (hardMode) setTimeout(applyFilter, 0);
    });

    addStars();
    syncModeFromCheckbox();

    document.addEventListener('lessonCardsRendered', () => {
      addStars();
      if (hardMode) applyFilter();
    });

    window.addEventListener('japaneseLangCloudLoaded', () => {
      loadStored();
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
