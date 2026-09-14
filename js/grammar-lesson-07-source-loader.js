(function () {
  'use strict';

  function addIcons(item) {
    var title = item.querySelector('.gs-source-accordion-title');
    if (!title) return;

    var book = document.createElement('span');
    book.className = 'gs-source-icon gs-source-book';
    book.innerHTML = '<svg viewBox="0 0 1024 1024" aria-hidden="true"><path d="M896 128v832h-672c-53.026 0-96-42.98-96-96s42.974-96 96-96h608v-768h-640c-70.398 0-128 57.6-128 128v768c0 70.4 57.602 128 128 128h768v-896h-64z"></path><path d="M224.056 832v0c-0.018 0.002-0.038 0-0.056 0-17.672 0-32 14.326-32 32s14.328 32 32 32c0.018 0 0.038-0.002 0.056-0.002v0.002h607.89v-64h-607.89z"></path></svg>';

    var arrow = document.createElement('span');
    arrow.className = 'gs-source-icon gs-source-arrow';
    arrow.innerHTML = '<svg viewBox="0 0 512 1024" aria-hidden="true"><path d="M49.414 76.202l-39.598 39.596c-9.372 9.372-9.372 24.568 0 33.942l361.398 362.26-361.398 362.26c-9.372 9.372-9.372 24.568 0 33.942l39.598 39.598c9.372 9.372 24.568 9.372 33.942 0l418.828-418.828c9.372-9.372 9.372-24.568 0-33.942l-418.828-418.828c-9.374-9.374-24.57-9.374-33.942 0z"></path></svg>';

    title.insertBefore(book, title.firstChild);
    title.appendChild(arrow);
  }

  function toggle(item, open) {
    var title = item.querySelector('.gs-source-accordion-title');
    var content = item.querySelector('.gs-source-accordion-content');
    if (!title || !content) return;

    var next = typeof open === 'boolean' ? open : !item.classList.contains('gs-source-open');
    item.classList.toggle('gs-source-open', next);
    title.setAttribute('aria-expanded', String(next));
    content.setAttribute('aria-hidden', String(!next));
  }

  function build() {
    var lessons = document.querySelectorAll('.grammar-lesson');
    var lesson = lessons[6];
    if (!lesson || !window.grammarLesson07Source) return false;

    var content = lesson.querySelector('.grammar-content');
    if (!content || content.dataset.lesson07Loaded === 'true') return true;

    content.innerHTML = '';
    window.grammarLesson07Source.forEach(function (rule, index) {
      var item = document.createElement('div');
      item.className = 'gs-source-accordion-item';

      var title = document.createElement('div');
      title.className = 'gs-source-accordion-title';
      title.setAttribute('role', 'button');
      title.setAttribute('tabindex', '0');
      title.setAttribute('aria-expanded', 'false');
      title.textContent = rule.title;

      var body = document.createElement('div');
      body.className = 'gs-source-accordion-content';
      body.setAttribute('aria-hidden', 'true');
      body.innerHTML = '<div class="gs-source-accordion-text">' + rule.html + '</div>';

      item.appendChild(title);
      item.appendChild(body);
      content.appendChild(item);
      addIcons(item);

      title.addEventListener('click', function () { toggle(item); });
      title.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle(item);
        }
      });

      if (index === 0) toggle(item, false);
    });

    content.dataset.lesson07Loaded = 'true';
    return true;
  }

  function waitForLesson() {
    if (build()) return;
    var attempts = 0;
    var timer = setInterval(function () {
      attempts += 1;
      if (build() || attempts >= 100) clearInterval(timer);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForLesson);
  } else {
    waitForLesson();
  }
})();
