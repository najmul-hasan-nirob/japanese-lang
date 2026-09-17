// Kanji card topbar and bottom controls.
(function () {
    const style = document.createElement('style');
    style.textContent = `
        .kanji-card > .lesson-card-topbar { display:flex!important; align-items:center!important; justify-content:space-between!important; gap:6px!important; width:100%!important; min-height:34px!important; white-space:nowrap!important; }
        .kanji-card > .lesson-card-topbar > * { min-width:0!important; white-space:nowrap!important; margin:0!important; position:static!important; transform:none!important; }
        .kanji-card > .lesson-card-topbar button { width:30px!important; height:30px!important; min-width:30px!important; padding:0!important; display:inline-flex!important; align-items:center!important; justify-content:center!important; }
        .kanji-card > .lesson-card-topbar .kanji-writing-practice-btn { font-size:17px!important; line-height:1!important; cursor:pointer!important; color:#fff!important; background:transparent!important; border:0!important; }
        .kanji-card > .lesson-card-topbar .kanji-writing-practice-btn .lesson-control-svg { width:18px!important; height:18px!important; fill:none!important; stroke:currentColor!important; stroke-width:1.8!important; stroke-linecap:round!important; stroke-linejoin:round!important; }
        .kanji-card > .lesson-card-topbar .kanji-writing-practice-btn.right { background:var(--accent-color,#2563eb)!important; border-radius:6px!important; }
        .kanji-card > .lesson-card-bottombar { display:flex!important; align-items:center!important; justify-content:space-between!important; gap:6px!important; width:100%!important; min-height:38px!important; box-sizing:border-box!important; }
        .kanji-card > .lesson-card-bottombar > .kanji-stroke-btn { order:3!important; flex:0 0 auto!important; }
        .kanji-card > .lesson-card-bottombar > .vocabulary-clue-btn { order:2!important; flex:0 0 auto!important; }
        .kanji-card > .lesson-card-bottombar > .admin-card-actions { order:1!important; position:static!important; inset:auto!important; display:contents!important; }
        .kanji-card > .lesson-card-bottombar > .admin-card-actions > .admin-card-edit { order:1!important; }
        .kanji-card > .lesson-card-bottombar > .admin-card-actions > .admin-card-delete { order:4!important; }
        .kanji-card > .kanji-stroke-section { display:none!important; width:100%!important; box-sizing:border-box!important; padding:12px!important; background:var(--paper-cell,#fff)!important; color:var(--ink,#111)!important; border-top:1px solid var(--paper-line,#ddd)!important; border-bottom:1px solid var(--paper-line,#ddd)!important; text-align:center!important; }
        .kanji-card > .kanji-stroke-section.open { display:block!important; }
        .kanji-stroke-section-title { margin:0 0 6px!important; font-size:15px!important; font-weight:700!important; }
        .kanji-stroke-stage { display:flex!important; align-items:center!important; justify-content:center!important; overflow:hidden!important; background:rgba(128,128,128,.06)!important; border-radius:10px!important; }
        .kanji-stroke-stage svg { width:100%!important; height:100%!important; display:block!important; }
        .kanji-stroke-status { min-height:20px!important; font-size:11px!important; opacity:.7!important; }
        .kanji-stroke-error { min-height:60px!important; display:flex!important; align-items:center!important; justify-content:center!important; font-size:12px!important; }
        @media (max-width:520px){ .kanji-card > .lesson-card-topbar button { width:28px!important;height:28px!important;min-width:28px!important; } .kanji-card > .kanji-stroke-section{padding:10px!important;} .kanji-stroke-stage{width:58vw!important;height:58vw!important;max-width:200px!important;max-height:200px!important;} }
    `;
    document.head.appendChild(style);

    function kanjiCodePoint(text) { const code=text.codePointAt(0); return code?code.toString(16).padStart(5,'0'):''; }
    function prepareSvg(svg) {
        if(!svg)return[]; svg.removeAttribute('width');svg.removeAttribute('height');svg.setAttribute('aria-label','Kanji stroke order');
        const paths=Array.from(svg.querySelectorAll('path')).filter(p=>/-s\\d+/.test(p.id||'')).sort((a,b)=>{const n=e=>(e.id.match(/-s(\\d+)/)||[])[1]||9999;return Number(n(a))-Number(n(b));});
        paths.forEach(p=>{p.style.fill='none';p.style.stroke='currentColor';p.style.strokeWidth='3.5';p.style.strokeLinecap='round';p.style.strokeLinejoin='round';p.style.opacity='.18';});return paths;
    }
    function playStrokes(svg,status){const paths=prepareSvg(svg);if(!paths.length){if(status)status.textContent='Stroke order data unavailable.';return;}paths.forEach((p,i)=>{try{const l=p.getTotalLength();p.style.strokeDasharray=String(l);p.style.strokeDashoffset=String(l);p.style.transition='stroke-dashoffset .5s ease, opacity .1s ease';p.style.transitionDelay=(i*.62)+'s';requestAnimationFrame(()=>{p.style.opacity='1';p.style.strokeDashoffset='0';});}catch(e){p.style.strokeDashoffset='0';p.style.opacity='1';}});if(status)status.textContent=paths.length+' strokes — watch how to write it.';}
    async function loadStrokeOrder(section,card){const stage=section.querySelector('.kanji-stroke-stage'),status=section.querySelector('.kanji-stroke-status'),code=kanjiCodePoint(card.dataset.kanji||'');if(!code){stage.innerHTML='<div class="kanji-stroke-error">Stroke order unavailable.</div>';return;}stage.innerHTML='<div class="kanji-stroke-error">Loading…</div>';status.textContent='Loading stroke order…';try{const r=await fetch('https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/'+code+'.svg',{cache:'force-cache'});if(!r.ok)throw new Error('HTTP '+r.status);const svg=new DOMParser().parseFromString(await r.text(),'image/svg+xml').documentElement;if(!svg||svg.nodeName.toLowerCase()!=='svg')throw new Error('Invalid SVG');stage.innerHTML='';stage.appendChild(document.importNode(svg,true));playStrokes(stage.querySelector('svg'),status);}catch(e){stage.innerHTML='<div class="kanji-stroke-error">Stroke order could not be loaded.</div>';status.textContent='Please try again.';}}

    function setupCard(card){
        if(!card||card.dataset.kanjiTopbarReady==='true')return; const inner=card.querySelector(':scope > .inner');if(!inner)return;
        const topbar=document.createElement('div');topbar.className='lesson-card-topbar';topbar.setAttribute('aria-label','Card top controls');
        const number=document.createElement('span');number.className='lesson-card-number';number.textContent=card.dataset.no||'';
        const tag=document.createElement('span');tag.className='lesson-tag';tag.textContent=card.dataset.level||'';
        const writing=document.createElement('button');writing.type='button';writing.className='kanji-writing-practice-btn';writing.setAttribute('aria-label','Enable writing practice for this card');writing.title='Writing Practice';writing.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(window.KanjiControls&&window.KanjiControls.toggleCardWritingPractice)window.KanjiControls.toggleCardWritingPractice(card);});
        const section=document.createElement('div');section.className='kanji-stroke-section';section.setAttribute('aria-hidden','true');section.innerHTML='<div class="kanji-stroke-section-title">How to write '+(card.dataset.kanji||'')+'</div><div class="kanji-stroke-stage"><div class="kanji-stroke-error">Stroke order will appear here.</div></div><div class="kanji-stroke-status"></div>';
        const stroke=document.createElement('button');stroke.type='button';stroke.className='kanji-stroke-btn';stroke.textContent='✍';stroke.setAttribute('aria-label','Show stroke order');stroke.title='Show stroke order';
        stroke.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();const open=section.classList.toggle('open');section.setAttribute('aria-hidden',String(!open));stroke.setAttribute('aria-pressed',String(open));if(open&&!section.dataset.loaded){section.dataset.loaded='true';loadStrokeOrder(section,card);}});
        section.addEventListener('click',e=>e.stopPropagation());
        const star=document.createElement('button');star.type='button';star.className='hard-star';star.textContent='☆';star.setAttribute('aria-label','Mark as hard Kanji');star.title='Mark as hard Kanji';star.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();const active=star.classList.toggle('active');star.textContent=active?'★':'☆';star.setAttribute('aria-pressed',String(active));});
        const speaker=document.createElement('button');speaker.type='button';speaker.className='speaker-btn';speaker.textContent='🔊';speaker.setAttribute('aria-label','Play pronunciation');speaker.title='Play pronunciation';speaker.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();const text=card.dataset.kanji||'';if(window.speechSynthesis&&typeof SpeechSynthesisUtterance!=='undefined'){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ja-JP';u.rate=.9;window.speechSynthesis.speak(u);}});
        const bottom=document.createElement('div');bottom.className='lesson-card-bottombar';bottom.setAttribute('aria-label','Card actions');
        topbar.append(star,number,tag,writing,speaker);
        bottom.append(stroke);
        card.insertBefore(topbar,inner);card.insertBefore(bottom,inner.nextSibling);card.insertBefore(section,bottom.nextSibling);card.dataset.kanjiTopbarReady='true';
    }
    function init(){const grid=document.getElementById('kanjiGrid');if(!grid)return;grid.querySelectorAll(':scope > .card').forEach(setupCard);new MutationObserver(()=>grid.querySelectorAll(':scope > .card').forEach(setupCard)).observe(grid,{childList:true});}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
