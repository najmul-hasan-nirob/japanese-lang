(function(){
  function init(){
    const toolbar = document.querySelector('.toolbar');
    if(!toolbar) return;

    // Field names are represented by the controls themselves.
    toolbar.querySelectorAll('.field > label').forEach(label => label.setAttribute('aria-hidden','true'));

    const lessonBtn = document.getElementById('lessonBtn');
    const typeBtn = document.getElementById('typeBtn');
    const scriptBtn = document.getElementById('scriptBtn');
    if(lessonBtn) lessonBtn.setAttribute('aria-label','Lesson');
    if(typeBtn) typeBtn.setAttribute('aria-label','Type');
    if(scriptBtn) scriptBtn.setAttribute('aria-label','Script');

    const mode = document.getElementById('mode');
    if(mode){
      const first = mode.querySelector('option[value="normal"]');
      if(first) first.textContent = 'Order';
      mode.setAttribute('aria-label','Order');
    }

    const range = document.getElementById('range');
    if(range) range.setAttribute('aria-label','Range');

    // Non-Lessons pages own their Shuffle button here. Lessons keeps its
    // dedicated lesson-controls.js implementation so Shuffle never gets
    // rewritten when the card grid changes.
    if(!lessonBtn){
      const shuffle = document.getElementById('shuffleBtn');
      if(shuffle){
        const icon = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3c4 0 6 10 10 10h3M17 14l3 3-3 3M4 17h3c1.5 0 2.5-1.5 3.5-3M14 10c1-1.5 2-3 3-3h3M17 4l3 3-3 3"></path></svg>';
        shuffle.innerHTML = '<span class="lesson-control-text">Shuffle</span>' + icon;
        shuffle.setAttribute('aria-label','Shuffle');
        shuffle.removeAttribute('title');
      }
    }

    // One shared expand/collapse toggle for every page toolbar.
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
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
