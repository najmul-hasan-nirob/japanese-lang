(function(){
  function init(){
    const toolbar = document.querySelector('.toolbar');
    if(!toolbar || !document.getElementById('lessonBtn')) return;

    toolbar.querySelectorAll('.filter-field > label').forEach(label => label.setAttribute('aria-hidden','true'));

    const lessonBtn = document.getElementById('lessonBtn');
    const typeBtn = document.getElementById('typeBtn');
    const mode = document.getElementById('mode');
    if(lessonBtn){ lessonBtn.dataset.placeholder = 'Lesson'; lessonBtn.textContent = 'Lesson'; lessonBtn.setAttribute('aria-label','Lesson'); }
    if(typeBtn){ typeBtn.dataset.placeholder = 'Type'; typeBtn.textContent = 'Type'; typeBtn.setAttribute('aria-label','Type'); }
    if(mode){
      const first = mode.querySelector('option[value="normal"]');
      if(first) first.textContent = 'Order';
      mode.setAttribute('aria-label','Order');
    }

    const icons = {
      screenOn:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>',
      screenOff:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8 8 0 1 1 8.5 4 8 8 0 0 0 20 15.5Z"></path></svg>',
      romaji:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7M7.5 5v14M4 19h7M14 5l6 14M20 5l-6 14"></path></svg>',
      flip:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>',
      shuffle:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3c4 0 6 10 10 10h3M17 14l3 3-3 3M4 17h3c1.5 0 2.5-1.5 3.5-3M14 10c1-1.5 2-3 3-3h3M17 4l3 3-3 3"></path></svg>'
    };

    function applyActionIcons(){
      const screen = document.getElementById('screenWakeToggle');
      if(screen) screen.innerHTML = screen.getAttribute('aria-pressed') === 'true' ? icons.screenOn : icons.screenOff;
      const romaji = document.getElementById('backRomajiToggle');
      if(romaji){ romaji.innerHTML = icons.romaji; romaji.setAttribute('aria-label', romaji.getAttribute('aria-pressed') === 'true' ? 'Romaji: ON' : 'Romaji: OFF'); }
      const direction = document.getElementById('direction');
      if(direction){ direction.innerHTML = icons.flip; direction.setAttribute('aria-label', direction.classList.contains('right') ? 'Show all cards Front' : 'Show all cards Back'); }
      const shuffle = document.getElementById('shuffleBtn');
      if(shuffle){ shuffle.innerHTML = icons.shuffle; shuffle.setAttribute('aria-label','Shuffle'); shuffle.title='Shuffle'; }
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
        const expanded = toolbar.classList.toggle('toolbar-collapsed') === false;
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
    const observer = new MutationObserver(moveSticky);
    observer.observe(document.body,{childList:true,subtree:true});

    applyActionIcons();
    const iconObserver = new MutationObserver(applyActionIcons);
    iconObserver.observe(document.body,{attributes:true,attributeFilter:['aria-pressed','class'],subtree:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
