// Time, Date & Numbers
(function () {
  'use strict';

  function numberToRomaji(n) {
    const ones = ['', 'ichi', 'ni', 'san', 'yon', 'go', 'roku', 'nana', 'hachi', 'kyuu'];
    const hundreds = ['', 'hyaku', 'nihyaku', 'sanbyaku', 'yonhyaku', 'gohyaku', 'roppyaku', 'nanahyaku', 'happyaku', 'kyuuhyaku'];
    const thousands = ['', 'sen', 'nisen', 'sanzen', 'yonsen', 'gosen', 'rokusen', 'nanasen', 'hassen', 'kyuusen'];
    if (n < 100) {
      if (n < 10) return ones[n];
      const ten = Math.floor(n / 10), one = n % 10;
      return (ten === 1 ? 'juu' : ones[ten] + 'juu') + (one ? ones[one] : '');
    }
    if (n < 1000) {
      const h = Math.floor(n / 100), rest = n % 100;
      return hundreds[h] + (rest ? numberToRomaji(rest) : '');
    }
    if (n < 10000) {
      const s = Math.floor(n / 1000), rest = n % 1000;
      return thousands[s] + (rest ? numberToRomaji(rest) : '');
    }
    const man = Math.floor(n / 10000), rest = n % 10000;
    return (man === 1 ? 'ichi' : numberToRomaji(man)) + 'man' + (rest ? numberToRomaji(rest) : '');
  }

  function init() {
    const grid = document.getElementById('grid');
    const count = document.getElementById('countDisplay');
    const panel = document.getElementById('timeDatePanel');
    const filterBtn = document.getElementById('timeDateBtn');
    const filterLabel = document.getElementById('timeDateLabel');
    const mode = document.getElementById('mode');
    const direction = document.getElementById('direction');
    const romajiToggle = document.getElementById('backRomajiToggle');
    if (!grid || !panel) return;

    const KEY = 'japanese-lang-time-date-numbers-filter-v2';
    const groups = ['numerals', 'telling-time', 'days-of-week', 'month', 'date', 'time-duration'];
    const labels = {
      numerals: 'Numerals',
      'telling-time': 'Telling Time',
      'days-of-week': 'Days of Week',
      month: 'Month',
      date: 'Date',
      'time-duration': 'Time Duration'
    };
    const manual = Array.isArray(window.timeDateNumbers) ? window.timeDateNumbers : [];
    let showBack = false;
    let showBackRomaji = true;

    const ICONS = {
      romaji: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7M7.5 5v14M4 19h7M14 5l6 14M20 5l-6 14"></path></svg>',
      flip: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>'
    };
    const labelledIcon = function (label, icon) {
      return '<span class="lesson-control-text">' + label + '</span>' + icon;
    };

    function esc(value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
      });
    }

    function allowedNumerals() {
      const values = [];
      for (let i = 1; i <= 10; i++) values.push(i);
      for (let i = 100; i <= 1000; i += 100) values.push(i);
      for (let i = 1000; i <= 10000; i += 1000) {
        if (values.indexOf(i) === -1) values.push(i);
      }
      for (let i = 100000; i <= 1000000; i += 100000) values.push(i);
      return values;
    }

    const allowed = allowedNumerals();

    function checkedGroups() {
      const boxes = Array.from(panel.querySelectorAll('input:not([value="all"])'));
      return boxes.filter(function (box) { return box.checked; }).map(function (box) { return box.value; });
    }

    function updateFilterUI() {
      const boxes = Array.from(panel.querySelectorAll('input:not([value="all"])'));
      const chosen = boxes.filter(function (box) { return box.checked; });
      const all = panel.querySelector('input[value="all"]');
      if (all) all.checked = chosen.length === boxes.length;
      const text = chosen.length === boxes.length ? 'All' : chosen.length ? chosen.map(function (x) { return x.parentElement.textContent.trim(); }).join(', ') : 'None';
      if (filterBtn) filterBtn.textContent = text;
      if (filterLabel) filterLabel.textContent = text;
    }

    function saveFilters() {
      try {
        localStorage.setItem(KEY, JSON.stringify({ groups: checkedGroups(), order: mode ? mode.value : 'normal' }));
      } catch (_) {}
      updateFilterUI();
    }

    function restoreFilters() {
      let saved = null;
      try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) {}
      const wanted = new Set(saved && Array.isArray(saved.groups) ? saved.groups : groups);
      panel.querySelectorAll('input:not([value="all"])').forEach(function (box) {
        box.checked = wanted.has(box.value);
      });
      if (mode) mode.value = saved && saved.order === 'shuffle' ? 'shuffle' : 'normal';
      updateFilterUI();
    }

    function allCards() {
      const cards = allowed.map(function (num) {
        return { id: 'builtin-' + num, jp: numberToRomaji(num), num: num, group: 'numerals', builtin: true, milestone: num >= 100 };
      });
      manual.forEach(function (item, index) {
        const num = Number(item.num);
        if (item.group !== 'numerals' || allowed.indexOf(num) !== -1) {
          cards.push(Object.assign({}, item, { id: item.id || 'manual-' + index, builtin: false }));
        }
      });
      const selected = new Set(checkedGroups());
      return cards.filter(function (item) { return selected.has(item.group); });
    }

    function speak(text) {
      if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(String(text));
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      } else if (window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') {
        try { window.AndroidTTS.speak(String(text)); } catch (_) {}
      }
    }

    function updateRomajiUI() {
      if (!romajiToggle) return;
      romajiToggle.innerHTML = labelledIcon('Romaji', ICONS.romaji);
      romajiToggle.setAttribute('aria-pressed', String(showBackRomaji));
      romajiToggle.setAttribute('aria-label', showBackRomaji ? 'Romaji: ON' : 'Romaji: OFF');
      romajiToggle.title = showBackRomaji ? 'Romaji: ON' : 'Romaji: OFF';
    }

    function updateDirectionUI() {
      if (!direction) return;
      direction.classList.toggle('right', showBack);
      direction.innerHTML = labelledIcon('Front / Back', ICONS.flip);
      direction.setAttribute('aria-pressed', String(showBack));
      direction.setAttribute('aria-label', showBack ? 'Show all cards Front' : 'Show all cards Back');
      direction.title = showBack ? 'Show Front' : 'Show Back';
    }

    function applyRomajiVisibility() {
      grid.querySelectorAll('.romaji').forEach(function (element) {
        element.style.display = showBackRomaji ? '' : 'none';
      });
    }

    function applyCardState() {
      grid.querySelectorAll('.card').forEach(function (card) {
        card.classList.toggle('flipped', showBack);
      });
      applyRomajiVisibility();
    }

    function render() {
      let cards = allCards();
      if (mode && mode.value === 'shuffle') {
        cards = cards.slice().sort(function () { return Math.random() - 0.5; });
      }
      grid.innerHTML = '';
      const fragment = document.createDocumentFragment();
      const groupSerials = {};

      cards.forEach(function (item) {
        const card = document.createElement('div');
        card.className = 'card' + (item.milestone ? ' milestone' : '');
        card.dataset.timeDateId = item.id;
        card.__timeDateItem = item;

        groupSerials[item.group] = (groupSerials[item.group] || 0) + 1;
        const groupSerial = groupSerials[item.group];
        const groupLabel = labels[item.group] || item.group;

        // Keep the card sides stable, exactly like the lesson cards.
        // The global Front / Back control only applies the .flipped class.
        const front = item.jp;
        let back = '';
        if (item.builtin) {
          back = esc(item.num);
        } else {
          back = '<span class="romaji">' + esc(item.romaji) + '</span>' +
            (item.en ? '<span class="english">' + esc(item.en) + '</span>' : '') +
            '<span class="bangla">' + esc(item.bn) + '</span>';
        }

        card.innerHTML =
          '<div class="lesson-card-topbar">' +
            '<button type="button" class="hard-star" aria-label="Favourite">☆</button>' +
            '<span class="lesson-tag">' + esc(groupLabel + ' ' + groupSerial) + '</span>' +
            '<button type="button" class="speaker-btn" aria-label="Play pronunciation">🔊</button>' +
          '</div>' +
          '<div class="inner"><div class="front">' + esc(front) + '</div><div class="back">' + back + '</div></div>';

        card.addEventListener('click', function (event) {
          if (!event.target.closest('button')) card.classList.toggle('flipped');
        });

        const star = card.querySelector('.hard-star');
        const favouriteKey = 'time-date-number|' + item.id;
        let favourites = [];
        try { favourites = JSON.parse(localStorage.getItem('japanese-lang-hard-vocabulary') || '[]'); } catch (_) {}
        star.textContent = favourites.indexOf(favouriteKey) !== -1 ? '★' : '☆';
        star.addEventListener('click', function (event) {
          event.stopPropagation();
          let list = [];
          try { list = JSON.parse(localStorage.getItem('japanese-lang-hard-vocabulary') || '[]'); } catch (_) {}
          const on = star.textContent !== '★';
          list = list.filter(function (value) { return value !== favouriteKey; });
          if (on) list.push(favouriteKey);
          star.textContent = on ? '★' : '☆';
          try { localStorage.setItem('japanese-lang-hard-vocabulary', JSON.stringify(list)); } catch (_) {}
        });

        card.querySelector('.speaker-btn').addEventListener('click', function (event) {
          event.stopPropagation();
          speak(item.jp);
        });
        fragment.appendChild(card);
      });

      grid.appendChild(fragment);
      applyCardState();
      if (count) count.textContent = 'Showing ' + cards.length + ' ' + (cards.length === 1 ? 'card' : 'cards');
    }

    window.renderTimeDateNumbers = render;
    updateRomajiUI();
    updateDirectionUI();

    if (direction) direction.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      showBack = !showBack;
      updateDirectionUI();
      applyCardState();
    });

    if (romajiToggle) romajiToggle.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      showBackRomaji = !showBackRomaji;
      updateRomajiUI();
      applyRomajiVisibility();
    });

    panel.addEventListener('change', function (event) {
      if (event.target.value === 'all') {
        panel.querySelectorAll('input:not([value="all"])').forEach(function (box) {
          box.checked = event.target.checked;
        });
      }
      saveFilters();
      render();
    });

    if (filterBtn) filterBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      panel.classList.toggle('open');
      filterBtn.setAttribute('aria-expanded', panel.classList.contains('open') ? 'true' : 'false');
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.filter-field')) panel.classList.remove('open');
    });

    if (mode) mode.addEventListener('change', function () { saveFilters(); render(); });
    const shuffleBtn = document.getElementById('shuffleBtn');
    if (shuffleBtn) shuffleBtn.addEventListener('click', function () {
      if (mode) mode.value = 'shuffle';
      saveFilters();
      render();
    });

    restoreFilters();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
