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

    // Put the shared toolbar into the floating filter overlay.
    if(!document.getElementById('toolbarOverlay')){
      const overlay = document.createElement('div');
      overlay.id='toolbarOverlay';
      overlay.className='toolbar-overlay';
      overlay.setAttribute('aria-hidden','true');

      const panel = document.createElement('div');
      panel.className='toolbar-overlay-panel';
      panel.setAttribute('role','dialog');
      panel.setAttribute('aria-modal','true');
      panel.setAttribute('aria-label','Filters and controls');

      const header = document.createElement('div');
      header.className='toolbar-overlay-header';
      header.innerHTML='<div class="toolbar-overlay-title"><span>Filters &amp; Controls</span><span class="toolbar-overlay-count" id="toolbarOverlayCount" aria-live="polite"></span></div>';

      const close = document.createElement('button');
      close.type='button';
      close.id='toolbarClose';
      close.className='toolbar-close';
      close.setAttribute('aria-label','Close filters and controls');
      close.title='Close';
      close.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
      header.appendChild(close);

      panel.appendChild(header);
      panel.appendChild(toolbar);
      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      // Clone the live count shown under the toolbar. The original countDisplay
      // remains in place, while this copy mirrors its text in the overlay.
      const sourceCount = document.getElementById('countDisplay');
      const overlayCount = document.getElementById('toolbarOverlayCount');
      function syncOverlayCount(){
        if(sourceCount && overlayCount) overlayCount.textContent = sourceCount.textContent || '';
      }
      syncOverlayCount();
      if(sourceCount){
        new MutationObserver(syncOverlayCount).observe(sourceCount,{childList:true,characterData:true,subtree:true});
      }

      document.addEventListener('hardVocabularyUpdated',syncOverlayCount);
      document.addEventListener('lessonCardsRendered',syncOverlayCount);
      toolbar.addEventListener('change',function(){setTimeout(syncOverlayCount,0);});

      const toggle = document.createElement('button');
      toggle.type='button';
      toggle.id='toolbarToggle';
      toggle.className='toolbar-toggle';
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-controls','toolbarOverlay');
      toggle.setAttribute('aria-label','Open filters and controls');
      toggle.title='Filters & Controls';
      toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"></path></svg>';
      document.body.appendChild(toggle);

      function positionOverlay(){
        if(window.innerWidth>520) return;
        const headerEl = document.querySelector('header');
        const sticky = document.querySelector('.mobile-bottom-controls');
        const top = headerEl ? Math.max(0,headerEl.getBoundingClientRect().bottom) : 0;
        const bottom = sticky ? Math.max(0,window.innerHeight-sticky.getBoundingClientRect().top) : 0;
        overlay.style.setProperty('--toolbar-overlay-top',top+'px');
        overlay.style.setProperty('--toolbar-overlay-bottom',bottom+'px');
      }
      positionOverlay();
      window.addEventListener('resize',positionOverlay,{passive:true});
      window.addEventListener('orientationchange',positionOverlay,{passive:true});

      function setOpen(open){
        positionOverlay();
        overlay.classList.toggle('open',open);
        toggle.classList.toggle('active',open);
        toggle.setAttribute('aria-expanded',String(open));
        overlay.setAttribute('aria-hidden',String(!open));
        toggle.setAttribute('aria-label',open ? 'Close filters and controls' : 'Open filters and controls');
        if(open){
          document.documentElement.classList.add('toolbar-overlay-open');
          document.body.classList.add('toolbar-overlay-open');
          setTimeout(function(){
            const firstControl = toolbar.querySelector('button, select, input');
            if(firstControl) firstControl.focus();
          },50);
        }else{
          document.documentElement.classList.remove('toolbar-overlay-open');
          document.body.classList.remove('toolbar-overlay-open');
          toggle.focus({preventScroll:true});
        }
      }

      toggle.addEventListener('click',function(){ setOpen(!overlay.classList.contains('open')); });
      close.addEventListener('click',function(){ setOpen(false); });
      overlay.addEventListener('click',function(event){
        if(event.target === overlay) setOpen(false);
      });
      document.addEventListener('keydown',function(event){
        if(event.key === 'Escape' && overlay.classList.contains('open')) setOpen(false);
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
