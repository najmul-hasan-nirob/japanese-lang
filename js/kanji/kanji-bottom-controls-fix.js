(function(){
  'use strict';

  const STYLE_ID = 'kanji-bottom-controls-fix-style';

  function injectStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      .kanji-card > .lesson-card-bottombar{
        display:flex!important;
        flex-direction:row!important;
        flex-wrap:nowrap!important;
        align-items:center!important;
        justify-content:space-between!important;
        gap:6px!important;
        width:100%!important;
        min-width:0!important;
        overflow:hidden!important;
        box-sizing:border-box!important;
      }
      .kanji-card > .lesson-card-bottombar > .admin-card-actions{
        position:static!important;
        inset:auto!important;
        display:contents!important;
      }
      .kanji-card > .lesson-card-bottombar > .admin-card-actions > .admin-card-edit,
      .kanji-card > .lesson-card-bottombar > .vocabulary-clue-btn,
      .kanji-card > .lesson-card-bottombar > .kanji-stroke-btn,
      .kanji-card > .lesson-card-bottombar > .admin-card-actions > .admin-card-delete{
        order:initial!important;
        flex:1 1 0!important;
        min-width:0!important;
        max-width:none!important;
        margin:0!important;
      }
      .kanji-card > .lesson-card-bottombar > .admin-card-actions > .admin-card-edit{order:1!important}
      .kanji-card > .lesson-card-bottombar > .vocabulary-clue-btn{order:2!important}
      .kanji-card > .lesson-card-bottombar > .kanji-stroke-btn{order:3!important}
      .kanji-card > .lesson-card-bottombar > .admin-card-actions > .admin-card-delete{order:4!important}
      .kanji-card > .lesson-card-bottombar .hard-star{display:none!important}
    `;
    document.head.appendChild(style);
  }

  function fixCard(card){
    if(!card || !card.classList.contains('kanji-card')) return;
    const bottom=card.querySelector(':scope > .lesson-card-bottombar');
    if(!bottom) return;

    bottom.querySelectorAll('.hard-star').forEach(el=>el.remove());

    const actions=card.querySelector(':scope > .admin-card-actions');
    if(actions) bottom.appendChild(actions);

    const clue=card.querySelector(':scope > .vocabulary-clue-btn');
    if(clue) bottom.appendChild(clue);

    const stroke=card.querySelector(':scope > .kanji-stroke-btn');
    if(stroke) bottom.appendChild(stroke);
  }

  function fixAll(){
    injectStyle();
    document.querySelectorAll('#kanjiGrid .kanji-card').forEach(fixCard);
  }

  function init(){
    fixAll();
    const grid=document.getElementById('kanjiGrid');
    if(grid){
      const observer=new MutationObserver(fixAll);
      observer.observe(grid,{childList:true,subtree:true});
    }
    [100,300,700,1200].forEach(delay=>setTimeout(fixAll,delay));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
