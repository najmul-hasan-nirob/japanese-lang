// =====================================================
// Hard Vocabulary filter — lessons page
// =====================================================
(() => {
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
  const hardCheckbox = () => panel()?.querySelector('input[value="hard"]');

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
      star.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const key = cardKey(card);
        if (hardWords.has(key)) hardWords.delete(key); else hardWords.add(key);
        save();
        updateStar(card);
        if (hardMode) apply();
        document.dispatchEvent(new CustomEvent('hardVocabularyUpdated'));
      });
      card.appendChild(star);
    }
    const active = hardWords.has(cardKey(card));
    star.textContent = active ? '★' : '☆';
    star.classList.toggle('active', active);
    star.setAttribute('aria-pressed', String(active));
    star.title = active ? 'Remove from hard vocabulary' : 'Hard vocabulary';
  }

  function addStars() {
    grid()?.querySelectorAll(':scope > .card').forEach(updateStar);
  }

  function apply() {
    addStars();
    grid()?.querySelectorAll(':scope > .card').forEach(card => {
      const isHard = card.querySelector('.vocabulary-back') && hardWords.has(cardKey(card));
      card.style.display = isHard ? '' : 'none';
    });
    const count = document.getElementById('countDisplay');
    if (count) {
      const visible = [...(grid()?.querySelectorAll(':scope > .card') || [])].filter(c => c.style.display !== 'none').length;
      count.textContent = `Showing ${visible} hard vocabulary`;
    }
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
  }

  function handleChange(e) {
    const cb = e.target;
    if (!cb || cb.value !== 'hard') return;
    e.stopImmediatePropagation();
    hardMode = cb.checked;
    if (hardMode) {
      // Let the lesson renderer finish first, then apply only starred cards.
      setTimeout(apply, 0);
      setTimeout(apply, 100);
      setTimeout(apply, 400);
    } else clearFilter();
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureCheckbox();
    panel()?.addEventListener('change', handleChange, true);
    addStars();
    document.addEventListener('lessonCardsRendered', () => {
      addStars();
      if (hardMode) apply();
    });
    new MutationObserver(() => {
      ensureCheckbox();
      addStars();
      if (hardMode) apply();
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
