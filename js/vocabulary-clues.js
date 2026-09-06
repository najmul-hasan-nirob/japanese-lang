/* Vocabulary clues — persistent storage through the Supabase Edge Function. */
(function(){
'use strict';

const API='https://levpdywhnikadumfocao.supabase.co/functions/v1/vocabulary-clues';
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function identity(card){
  const lesson=card.querySelector('.lesson-tag')?.textContent?.trim()||'';
  const romaji=card.dataset.romaji||'';
  const english=card.querySelector('.english')?.textContent?.trim()||'';
  const front=card.querySelector('.front>div')?.textContent?.trim()||'';
  return {lesson,romaji,english,front};
}
function cardKey(card){const i=identity(card);return [i.lesson,i.romaji,i.english,i.front].join('|');}
function url(card){return API+'?card_key='+encodeURIComponent(cardKey(card));}

async function load(card){
  try{
    const r=await fetch(url(card),{method:'GET',cache:'no-store'});
    if(!r.ok)return '';
    const d=await r.json();
    const clue=d?.clue||'';
    card.dataset.vocabularyClue=clue;
    card.classList.toggle('has-vocabulary-clue',!!clue);
    return clue;
  }catch(e){console.warn('Vocabulary clue load failed',e);return '';}
}

async function save(card,clue){
  const i=identity(card);
  const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({card_key:cardKey(card),lesson:i.lesson,vocabulary:i.front,clue})});
  let data=null;try{data=await r.json()}catch(e){}
  if(!r.ok)throw new Error(data?.error||('HTTP '+r.status));
  card.dataset.vocabularyClue=data?.clue||clue;
  card.classList.toggle('has-vocabulary-clue',true);
}

async function remove(card){
  const r=await fetch(url(card),{method:'DELETE'});
  let data=null;try{data=await r.json()}catch(e){}
  if(!r.ok)throw new Error(data?.error||('HTTP '+r.status));
  card.dataset.vocabularyClue='';
  card.classList.remove('has-vocabulary-clue');
}

function closePanels(card){
  card.querySelector('.vocabulary-clue-panel')?.remove();
  card.querySelector('.vocabulary-clue-editor')?.remove();
}
function showClue(card){
  closePanels(card);
  const clue=card.dataset.vocabularyClue||'';
  const panel=document.createElement('div');
  panel.className='vocabulary-clue-panel';
  panel.innerHTML=`<div class="vocabulary-clue-label">💡 Clue</div><div class="vocabulary-clue-text">${esc(clue||'No clue yet.')}</div><button type="button" class="clue-edit">Edit</button>`;
  card.appendChild(panel);
  panel.querySelector('.clue-edit').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();panel.remove();showEditor(card);});
}

function showEditor(card){
  closePanels(card);
  const old=card.dataset.vocabularyClue||'';
  const box=document.createElement('div');
  box.className='vocabulary-clue-editor';
  box.innerHTML=`<div class="clue-editor-head"><span>💡 Edit clue</span><button type="button" class="clue-close" aria-label="Close">×</button></div><textarea maxlength="500" placeholder="Write a clue..."></textarea><div class="clue-editor-actions"><button type="button" class="clue-save">Save</button><button type="button" class="clue-delete">Delete</button></div>`;
  card.appendChild(box);
  const ta=box.querySelector('textarea');ta.value=old;ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);

  box.querySelector('.clue-close').onclick=e=>{e.preventDefault();e.stopPropagation();box.remove();};
  box.querySelector('.clue-save').onclick=async()=>{
    const v=ta.value.trim(),btn=box.querySelector('.clue-save');btn.disabled=true;
    try{if(v)await save(card,v);else await remove(card);box.remove();if(v)showClue(card);}
    catch(err){console.error('Vocabulary clue save failed:',err);alert('Could not save clue. Please try again.\n\n'+err.message);btn.disabled=false;}
  };
  box.querySelector('.clue-delete').onclick=async()=>{
    const btn=box.querySelector('.clue-delete');btn.disabled=true;
    try{await remove(card);box.remove();}
    catch(err){console.error('Vocabulary clue delete failed:',err);alert('Could not delete clue. Please try again.\n\n'+err.message);btn.disabled=false;}
  };
}

function setup(card){
  if(!card.querySelector('.vocabulary-back')||card.querySelector('.vocabulary-clue-btn'))return;
  const bar=card.querySelector('.lesson-card-topbar');if(!bar)return;
  const b=document.createElement('button');b.type='button';b.className='vocabulary-clue-btn';b.innerHTML='💡';b.title='Show clue';b.setAttribute('aria-label','Show clue');bar.appendChild(b);
  load(card);
  b.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();if(!card.dataset.vocabularyClue)await load(card);showClue(card);});
}
function all(){document.querySelectorAll('#grid>.card').forEach(setup)}

function styles(){
  if(document.getElementById('vocabulary-clue-styles'))return;
  const s=document.createElement('style');s.id='vocabulary-clue-styles';s.textContent=`
.vocabulary-clue-btn{grid-column:2;grid-row:1;margin:0!important;padding:0 5px!important;border:0!important;background:transparent!important;color:#fff!important;font-size:17px!important;line-height:1;cursor:pointer;pointer-events:auto!important;width:auto!important;height:auto!important;box-shadow:none!important;}
.has-vocabulary-clue .vocabulary-clue-btn{filter:saturate(1.25);}

/* Clue UI: never clip the panel/editor, even when a card/grid has fixed dimensions. */
.card.lesson-card-structured,
.lesson-card-inner,
.lesson-card-content,
.lesson-card-content>.front,
.lesson-card-content>.back{overflow:visible!important;}
.vocabulary-clue-panel,.vocabulary-clue-editor{position:absolute!important;z-index:9999!important;top:44px!important;left:8px!important;right:8px!important;width:auto!important;max-width:none!important;background:#18212c;color:#fff;padding:11px!important;border-radius:9px;box-shadow:0 5px 20px #0009;box-sizing:border-box!important;}
.vocabulary-clue-panel{text-align:center;}
.vocabulary-clue-label{font-size:12px;opacity:.75;margin-bottom:5px;}
.vocabulary-clue-text{font-size:15px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;max-height:none!important;overflow:visible!important;}
.vocabulary-clue-panel .clue-edit{display:inline-block!important;margin-top:9px!important;padding:5px 14px!important;border:0;border-radius:6px;cursor:pointer;visibility:visible!important;opacity:1!important;}
.clue-editor-head{display:flex;align-items:center;justify-content:space-between;font-size:13px;margin-bottom:7px;}
.clue-close{border:0;background:transparent;color:#fff;font-size:23px;line-height:1;cursor:pointer;padding:0 3px;}
.vocabulary-clue-editor textarea{display:block!important;width:100%!important;min-height:76px!important;height:auto!important;box-sizing:border-box!important;resize:vertical;padding:8px;border-radius:6px;border:1px solid #66717d;font:inherit;}
.clue-editor-actions{display:flex!important;gap:7px!important;margin-top:7px!important;visibility:visible!important;opacity:1!important;position:relative!important;z-index:2!important;}
.clue-editor-actions button{display:inline-block!important;visibility:visible!important;opacity:1!important;padding:6px 12px!important;border:0;border-radius:6px;cursor:pointer;}
.clue-editor-actions button:disabled{opacity:.6!important;cursor:wait;}
@media(max-width:520px){
 .vocabulary-clue-btn{font-size:16px!important;}
 .vocabulary-clue-panel,.vocabulary-clue-editor{top:40px!important;left:6px!important;right:6px!important;}
}
`;
  document.head.appendChild(s);
}

function init(){styles();all();document.addEventListener('lessonCardsRendered',()=>setTimeout(all,30));const grid=document.getElementById('grid');if(grid)new MutationObserver(()=>setTimeout(all,0)).observe(grid,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
