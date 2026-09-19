(function(){
  'use strict';

  const STYLE_ID = 'kanji-bottom-controls-fix-style';
  let observer = null;
  let scheduled = false;

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
      .kanji-card .hard-star:not(.lesson-card-topbar .hard-star){display:none!important}
      .kanji-card .kanji-merged-label{
        order:2!important;
        text-align:center!important;
        color:#fff!important;
        font-size:12px!important;
        font-weight:700!important;
        pointer-events:none!important;
      }
      .kanji-card .kanji-mnemonic-toggle{
        order:7!important;
        width:30px!important;
        height:30px!important;
        min-width:30px!important;
        padding:0!important;
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        border:0!important;
        border-radius:6px!important;
        background:transparent!important;
        color:#fff!important;
        cursor:pointer!important;
        pointer-events:auto!important;
        font-size:17px!important;
        line-height:1!important;
      }
      .kanji-card .kanji-mnemonic-toggle[aria-pressed="true"]{background:rgba(255,255,255,.18)!important}
      .kanji-card .kanji-mnemonic-wrap.kanji-mnemonic-hidden{display:none!important}
      .kanji-card > .kanji-stroke-section{
        display:none!important;
        width:100%!important;
        box-sizing:border-box!important;
        background:var(--paper-cell,#fff)!important;
        color:var(--ink,#111)!important;
        border-top:1px solid var(--paper-line,#ddd)!important;
        border-bottom:1px solid var(--paper-line,#ddd)!important;
        text-align:center!important;
      }
      .kanji-card > .kanji-stroke-section.open{display:block!important}
    `;
    document.head.appendChild(style);
  }

  function setupTopbar(card){
    const top=card.querySelector(':scope > .lesson-card-topbar');
    if(!top) return;

    const number=top.querySelector('.lesson-card-number');
    const tag=top.querySelector('.lesson-tag');
    if(number && tag){
      let label=top.querySelector('.kanji-merged-label');
      if(!label){
        label=document.createElement('span');
        label.className='kanji-merged-label';
        top.insertBefore(label,number);
      }
      const level=tag.textContent.trim();
      const serial=number.textContent.trim();
      const nextText=(level+' '+serial).trim();
      if(label.textContent!==nextText) label.textContent=nextText;
      number.style.display='none';
      tag.style.display='none';
    }

    let toggle=top.querySelector('.kanji-mnemonic-toggle');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='kanji-mnemonic-toggle';
      toggle.textContent='▣';
      toggle.title='Show mnemonic image';
      toggle.setAttribute('aria-label','Show mnemonic image');
      toggle.setAttribute('aria-pressed','false');
      toggle.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        const wrap=card.querySelector('.kanji-mnemonic-wrap');
        if(!wrap) return;
        const show=toggle.getAttribute('aria-pressed')!=='true';
        toggle.setAttribute('aria-pressed',String(show));
        toggle.textContent=show?'▣':'□';
        toggle.title=show?'Hide mnemonic image':'Show mnemonic image';
        toggle.setAttribute('aria-label',show?'Hide mnemonic image':'Show mnemonic image');
        wrap.classList.toggle('kanji-mnemonic-hidden',!show);
      });
      top.appendChild(toggle);
    }

    const wrap=card.querySelector('.kanji-mnemonic-wrap');
    if(wrap && !toggle.dataset.initialized){
      wrap.classList.add('kanji-mnemonic-hidden');
      toggle.dataset.initialized='true';
    }
  }

  function fixCard(card){
    if(!card || !card.classList.contains('kanji-card')) return;
    const bottom=card.querySelector(':scope > .lesson-card-bottombar');
    const inner=card.querySelector(':scope > .inner');
    if(!bottom || !inner) return;

    const top=card.querySelector(':scope > .lesson-card-topbar');
    card.querySelectorAll('.hard-star').forEach(el=>{
      if(!top || !top.contains(el)) el.remove();
    });

    const actions=card.querySelector(':scope > .admin-card-actions');
    if(actions && actions.parentElement!==bottom) bottom.appendChild(actions);

    const clue=card.querySelector(':scope > .vocabulary-clue-btn');
    if(clue && clue.parentElement!==bottom) bottom.appendChild(clue);

    const stroke=card.querySelector(':scope > .kanji-stroke-btn');
    if(stroke && stroke.parentElement!==bottom) bottom.appendChild(stroke);

    const section=card.querySelector(':scope > .kanji-stroke-section');
    if(section && section.parentElement!==card) card.appendChild(section);

    setupTopbar(card);
  }

  function fixAll(){
    scheduled=false;
    injectStyle();
    document.querySelectorAll('#kanjiGrid .kanji-card').forEach(fixCard);
  }

  function scheduleFix(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(fixAll);
  }

  function init(){
    injectStyle();
    fixAll();
    const grid=document.getElementById('kanjiGrid');
    if(grid){
      observer=new MutationObserver(function(mutations){
        const relevant=mutations.some(m=>Array.from(m.addedNodes).some(node=>node.nodeType===1));
        if(relevant) scheduleFix();
      });
      observer.observe(grid,{childList:true,subtree:true});
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
