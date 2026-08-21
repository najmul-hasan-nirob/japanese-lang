(function(){
  function init(){
    const toolbar = document.querySelector('.toolbar');
    if(!toolbar || !document.getElementById('lessonBtn')) return;

    // Filter names are represented by the controls themselves.
    toolbar.querySelectorAll('.filter-field > label').forEach(label => label.setAttribute('aria-hidden','true'));

    const lessonBtn = document.getElementById('lessonBtn');
    const typeBtn = document.getElementById('typeBtn');
    const mode = document.getElementById('mode');
    if(lessonBtn){ lessonBtn.dataset.placeholder = 'Lesson'; lessonBtn.setAttribute('aria-label','Lesson'); }
    if(typeBtn){ typeBtn.dataset.placeholder = 'Type'; typeBtn.setAttribute('aria-label','Type'); }
    if(mode) mode.setAttribute('aria-label','Order');

    // The toolbar starts collapsed on every page load.
    if(!document.getElementById('toolbarToggle')){
      const toggle = document.createElement('button');
      toggle.type='button';
      toggle.id='toolbarToggle';
      toggle.className='toolbar-toggle';
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Expand toolbar');
      toggle.title='Expand toolbar';
      toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg>';
      toolbar.parentNode.insertBefore(toggle, toolbar);
      toolbar.classList.add('toolbar-collapsed');
      toggle.addEventListener('click', function(){
        const expanded = !toolbar.classList.toggle('toolbar-collapsed');
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.setAttribute('aria-label', expanded ? 'Collapse toolbar' : 'Expand toolbar');
        toggle.title = expanded ? 'Collapse toolbar' : 'Expand toolbar';
        toggle.classList.toggle('expanded', expanded);
      });
    }

    const host = document.getElementById('footerMobileControls');
    function moveSticky(){
      const bar = document.querySelector('.mobile-bottom-controls');
      if(host && bar && bar !== host && bar.parentNode !== host) host.appendChild(bar);
    }
    moveSticky();

    // Do not observe attributes or rewrite control HTML here.
    // lesson-controls.js owns the action icons and their order. Rewriting
    // them from a second observer caused the icons to change after Shuffle.
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
