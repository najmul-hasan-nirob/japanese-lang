(function(){
  'use strict';

  function setupCard(card){
    if(!card || card.dataset.strokeReplacementReady === 'true') return;
    const inner = card.querySelector(':scope > .inner');
    const section = card.querySelector(':scope > .kanji-stroke-section');
    const button = card.querySelector(':scope > .lesson-card-bottombar > .kanji-stroke-btn');
    if(!inner || !section || !button) return;

    inner.appendChild(section);
    section.classList.add('kanji-stroke-replacement');

    const sync = function(){
      const open = section.classList.contains('open');
      inner.classList.toggle('stroke-view-active', open);
      inner.querySelectorAll(':scope > *:not(.kanji-stroke-section)').forEach(el=>{
        el.style.display = open ? 'none' : '';
      });
      section.style.display = open ? 'block' : 'none';
    };

    button.addEventListener('click', function(){
      requestAnimationFrame(sync);
    });
    sync();
    card.dataset.strokeReplacementReady = 'true';
  }

  function init(){
    const grid = document.getElementById('kanjiGrid');
    if(!grid) return;
    const scan = ()=>grid.querySelectorAll(':scope > .card.kanji-card').forEach(setupCard);
    scan();
    new MutationObserver(scan).observe(grid,{childList:true});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
