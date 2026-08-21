(function(){
  function init(){
    const toolbar = document.querySelector('.toolbar');
    if(!toolbar) return;

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

    // Screen is always shown as Label + Icon, including the mobile sticky bar.
    const screen = document.getElementById('screenWakeToggle');
    function normalizeScreen(){
      if(!screen) return;
      const icon = screen.querySelector('.screen-wake-icon, .lesson-control-svg');
      if(!icon) return;
      screen.innerHTML = '<span class="lesson-control-text">Screen</span>' + icon.outerHTML;
    }
    normalizeScreen();
    if(screen){
      const screenObserver = new MutationObserver(function(){
        const text = screen.querySelector('.lesson-control-text');
        const icon = screen.querySelector('.screen-wake-icon, .lesson-control-svg');
        if(icon && !text) normalizeScreen();
      });
      screenObserver.observe(screen,{childList:true});
    }

    // Non-Lessons pages use the same labelled Shuffle control as Lessons.
    if(!lessonBtn){
      const shuffle = document.getElementById('shuffleBtn');
      if(shuffle){
        const icon = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3c4 0 6 10 10 10h3M17 14l3 3-3 3M4 17h3c1.5 0 2.5-1.5 3.5-3M14 10c1-1.5 2-3 3-3h3M17 4l3 3-3 3"></path></svg>';
        shuffle.innerHTML = '<span class="lesson-control-text">Shuffle</span>' + icon;
        shuffle.setAttribute('aria-label','Shuffle');
      }
    }

    // Add Reset to every non-Lessons toolbar, matching the Lessons control.
    if(!document.getElementById('lessonResetBtn')){
      const resetField = document.createElement('div');
      resetField.className='field lesson-reset-field';
      resetField.id='lessonResetField';
      const reset = document.createElement('button');
      reset.type='button';
      reset.id='lessonResetBtn';
      reset.className='lesson-reset-btn';
      reset.setAttribute('aria-label','Reset controls and cards');
      reset.setAttribute('title','Reset controls and cards');
      reset.innerHTML='<span class="lesson-control-text">Reset</span><svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.7-4L3 10M3 5v5h5M4 13a8 8 0 0 0 14.7 4L21 14M21 19v-5h-5"></path></svg>';
      reset.addEventListener('click',function(){
        window.scrollTo({top:0,left:0,behavior:'smooth'});
        window.location.reload();
      });
      resetField.appendChild(reset);
      toolbar.appendChild(resetField);

      const mobileBar = document.querySelector('.mobile-bottom-controls');
      if(mobileBar && window.innerWidth<=520) mobileBar.appendChild(reset);
    }

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
