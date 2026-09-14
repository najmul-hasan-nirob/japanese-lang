(function () {
  'use strict';

  function bookIcon() {
    return '<svg class="gs-source-book" viewBox="0 0 1024 1024" aria-hidden="true"><path d="M896 128v832h-672c-53.026 0-96-42.98-96-96s42.974-96 96-96h608v-768h-640c-70.398 0-128 57.6-128 128v768c0 70.4 57.602 128 128 128h768v-896h-64z"></path><path d="M224.056 832v0c-.018.002-.038 0-.056 0-17.672 0-32 14.326-32 32s14.328 32 32 32c.018 0 .038-.002.056-.002v.002h607.89v-64h-607.89z"></path></svg>';
  }

  function arrowIcon() {
    return '<svg class="gs-source-arrow" viewBox="0 0 512 1024" aria-hidden="true"><path d="M49.414 76.202l-39.598 39.596c-9.372 9.372-9.372 24.568 0 33.942l361.398 362.26-361.398 362.26c-9.372 9.372-9.372 24.568 0 33.942l39.598 39.598c9.372 9.372 24.568 9.372 33.942 0l418.828-418.828c9.372-9.372 9.372-24.568 0-33.942l-418.828-418.828c-9.374-9.374-24.57-9.374-33.942 0z"></path></svg>';
  }

  function render() {
    var lessons = document.querySelectorAll('.grammar-lesson');
    var lesson = lessons[3];
    if (!lesson || !window.grammarLesson04Source) return false;

    var content = lesson.querySelector('.grammar-content');
    if (!content) return false;
    if (content.dataset.lesson04SourceLoaded === 'true') return true;

    content.innerHTML = '';

    window.grammarLesson04Source.forEach(function (rule, index) {
      var item = document.createElement('div');
      item.className = 'gs-source-accordion-item';
      item.id = 'lesson04-source-rule-' + (index + 1);

      var title = document.createElement('div');
      title.className = 'gs-source-accordion-title';
      title.setAttribute('role', 'button');
      title.setAttribute('tabindex', '0');
      title.setAttribute('aria-expanded', 'false');
      title.innerHTML = '<span class="gs-source-icon">' + bookIcon() + '</span>' +
        '<h3>' + rule.title.replace(/^Rule\s*[^：:]+[：:]\s*/i, '') + '</h3>' +
        '<span class="gs-source-toggle">' + arrowIcon() + '</span>';

      var body = document.createElement('div');
      body.className = 'gs-source-accordion-content';
      body.setAttribute('aria-hidden', 'true');

      var inner = document.createElement('div');
      inner.className = 'gs-source-accordion-text';
      inner.innerHTML = rule.html.trim();
      body.appendChild(inner);

      item.appendChild(title);
      item.appendChild(body);
      content.appendChild(item);

      function toggle() {
        var open = title.getAttribute('aria-expanded') === 'true';
        title.setAttribute('aria-expanded', String(!open));
        body.setAttribute('aria-hidden', String(open));
        item.classList.toggle('gs-source-open', !open);
      }

      title.addEventListener('click', toggle);
      title.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      });
    });

    content.dataset.lesson04SourceLoaded = 'true';
    return true;
  }

  function init() {
    var attempts = 0;
    var timer = setInterval(function () {
      attempts++;
      if (render() || attempts > 100) clearInterval(timer);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
