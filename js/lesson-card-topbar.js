// =====================================================
// Lesson card structure
// .card > .lesson-card-inner
//     > .lesson-card-topbar
//         favourite | lesson tag | speaker
//     > .lesson-card-content
//         front / back
//     > .lesson-card-bottombar
//         rename | clue | delete
// Lessons page only.
// =====================================================
(function () {
    function findSpeaker(card) { return card.querySelector('.speaker-btn, .speak-btn, .pronunciation-btn, [aria-label="Play pronunciation"], [aria-label*="pronunciation" i]'); }
    function makeVisibleSpeaker(speaker) { if (!speaker) return; speaker.style.setProperty('display','flex','important'); speaker.style.setProperty('visibility','visible','important'); speaker.style.setProperty('opacity','1','important'); speaker.style.setProperty('pointer-events','auto','important'); }
    function isBackCard(card) { return !!card && (card.classList.contains('flipped') || card.getAttribute('data-flipped') === 'true'); }
    function teacherModeIsActive(card) { return !!card?.classList.contains('teacher-active'); }
    function getSpeechVoice(langPrefix) { if (!window.speechSynthesis) return null; const prefix=String(langPrefix||'').toLowerCase(); return window.speechSynthesis.getVoices().find(v=>String(v.lang||'').toLowerCase().startsWith(prefix))||null; }
    function speakBackSequence(card) {
        const bangla=(card.querySelector('.bangla')?.textContent||'').replace(/\s*\/\s*/g,' বা ').replace(/\s+/g,' ').trim();
        const english=card.querySelector('.english')?.textContent.replace(/\s+/g,' ').trim()||''; if(!bangla&&!english)return;
        if(window.speechSynthesis&&typeof SpeechSynthesisUtterance!=='undefined'){const s=window.speechSynthesis;try{s.cancel();s.resume()}catch(e){} const queue=[];
            if(bangla){const u=new SpeechSynthesisUtterance(bangla);u.lang='bn-BD';u.rate=1;const voice=getSpeechVoice('bn');if(voice)u.voice=voice;queue.push(u)}
            if(bangla&&english){const u=new SpeechSynthesisUtterance('বা');u.lang='bn-BD';u.rate=1;const voice=getSpeechVoice('bn');if(voice)u.voice=voice;queue.push(u)}
            if(english){const u=new SpeechSynthesisUtterance(english);u.lang='en-US';u.rate=1;const voice=getSpeechVoice('en');if(voice)u.voice=voice;queue.push(u)} queue.forEach(u=>s.speak(u));return;}
        if(window.AndroidTTS&&typeof window.AndroidTTS.speak==='function'){if(bangla){try{window.AndroidTTS.speak(bangla)}catch(e){}} if(bangla&&english){const delay=Math.max(900,Math.min(5000,bangla.replace(/\s/g,'').length*55+500));setTimeout(()=>{try{window.AndroidTTS.speak('বা')}catch(e){} setTimeout(()=>{try{window.AndroidTTS.speak(english)}catch(e){}},500)},delay)}else if(english){try{window.AndroidTTS.speak(english)}catch(e){}}}
    }
    function setupSpeakerBehavior(card,speaker){if(!speaker||speaker.dataset.backSpeechReady==='true')return;speaker.dataset.backSpeechReady='true';speaker.addEventListener('click',event=>{if(!isBackCard(card)||teacherModeIsActive(card))return;event.preventDefault();event.stopImmediatePropagation();speakBackSequence(card)},true)}
    function setupCard(card){
        if(!card)return; let inner=card.querySelector(':scope > .lesson-card-inner'); let bar=inner?.querySelector(':scope > .lesson-card-topbar'); let bottomBar=inner?.querySelector(':scope > .lesson-card-bottombar'); let content=inner?.querySelector(':scope > .lesson-card-content');
        if(!inner){inner=document.createElement('div');inner.className='lesson-card-inner';while(card.firstChild)inner.appendChild(card.firstChild);card.appendChild(inner)}
        if(!bar){bar=document.createElement('div');bar.className='lesson-card-topbar';bar.setAttribute('aria-label','Card controls');inner.insertBefore(bar,inner.firstChild)}
        if(!content){content=document.createElement('div');content.className='lesson-card-content';inner.appendChild(content)}
        if(!bottomBar){bottomBar=document.createElement('div');bottomBar.className='lesson-card-bottombar';bottomBar.setAttribute('aria-label','Card bottom controls');inner.appendChild(bottomBar)}
        const star=inner.querySelector(':scope > .hard-star'); const number=inner.querySelector(':scope > .lesson-card-number'); const speaker=findSpeaker(inner); const clue=inner.querySelector('.vocabulary-clue-btn'); const adminActions=card.querySelector(':scope > .admin-card-actions');
        let tag=bar.querySelector(':scope > .lesson-tag'); if(!tag){tag=document.createElement('span');tag.className='lesson-tag';tag.setAttribute('aria-hidden','true');bar.appendChild(tag)}
        if(star&&star.parentElement!==bar)bar.appendChild(star);
        if(number)number.remove();
        if(speaker&&speaker.parentElement!==bar)bar.appendChild(speaker);
        if(clue&&clue.parentElement!==bottomBar)bottomBar.appendChild(clue); if(adminActions&&adminActions.parentElement!==bottomBar)bottomBar.appendChild(adminActions);
        Array.from(inner.children).forEach(child=>{if(child!==bar&&child!==content&&child!==bottomBar&&(child.classList.contains('front')||child.classList.contains('back')))content.appendChild(child)});
        if(speaker){makeVisibleSpeaker(speaker);setupSpeakerBehavior(card,speaker)} card.classList.add('lesson-card-structured');
    }
    function injectStyles(){
        if(document.getElementById('lesson-card-structure-styles'))return; const style=document.createElement('style');style.id='lesson-card-structure-styles';style.textContent=`
.card.lesson-card-structured{position:relative;overflow:visible;border-radius:var(--radius);display:flex;align-items:stretch}
.lesson-card-inner{position:relative;width:100%;height:auto;min-height:0;overflow:visible;border-radius:inherit;box-sizing:border-box;display:flex;flex-direction:column;flex:1 1 auto;transform-style:preserve-3d}
.lesson-card-topbar{position:absolute;top:0;left:0;right:0;width:100%;height:42px;display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;z-index:50;pointer-events:none;padding:0 10px}
.lesson-card-topbar>.hard-star{margin-right:auto!important}
.lesson-card-topbar>.lesson-tag{position:absolute!important;left:50%!important;transform:translateX(-50%)!important;white-space:nowrap;overflow:visible!important;text-overflow:clip!important;max-width:none!important;width:max-content;font-size:9.5px;text-align:center;pointer-events:none}
.lesson-card-topbar>.speaker-btn,.lesson-card-topbar>.speak-btn,.lesson-card-topbar>.pronunciation-btn{margin-left:auto!important;display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
.lesson-card-content{position:relative;width:100%;height:auto;min-height:0;box-sizing:border-box;overflow:visible;display:grid;flex:1 1 auto;grid-template-columns:minmax(0,1fr);grid-template-rows:1fr;align-items:stretch;pointer-events:none}
.lesson-card-content>.front,.lesson-card-content>.back{position:relative;inset:auto;grid-area:1 / 1;width:100%;height:auto;min-height:0;box-sizing:border-box;padding-top:50px!important;padding-bottom:44px!important;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;pointer-events:auto}
.lesson-card-topbar .hard-star,.lesson-card-topbar .lesson-tag,.lesson-card-topbar .speaker-btn,.lesson-card-topbar .speak-btn,.lesson-card-topbar .pronunciation-btn{position:relative!important;inset:auto!important;top:auto!important;right:auto!important;left:auto!important;bottom:auto!important;margin:0!important;align-self:center}
.lesson-card-bottombar{position:absolute;left:0;right:0;bottom:0;width:100%;height:38px;display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;z-index:60;pointer-events:none;background:inherit;padding:0 10px}
.lesson-card-bottombar>.admin-card-actions{position:static!important;inset:auto!important;display:contents!important;pointer-events:none!important}
.lesson-card-bottombar>.admin-card-actions>.admin-card-edit{margin-right:auto!important}
.lesson-card-bottombar>.vocabulary-clue-btn{position:absolute!important;left:50%!important;transform:translateX(-50%)!important}
.lesson-card-bottombar>.admin-card-actions>.admin-card-delete{margin-left:auto!important}
.lesson-card-bottombar .vocabulary-clue-btn,.lesson-card-bottombar .admin-card-edit,.lesson-card-bottombar .admin-card-delete{position:relative!important;inset:auto!important;top:auto!important;right:auto!important;left:auto!important;bottom:auto!important;margin:0!important;pointer-events:auto!important;align-self:center;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;outline:0!important}
@media(max-width:520px){.lesson-card-topbar{height:38px;padding:0 8px}.lesson-card-bottombar{height:38px;padding:0 8px}.lesson-card-content>.front,.lesson-card-content>.back{padding-top:42px!important;padding-bottom:42px!important}}
`;document.head.appendChild(style)
    }
    function setupAll(grid){grid.querySelectorAll(':scope > .card').forEach(setupCard);if(typeof window.updateLessonCardNumbers==='function')window.updateLessonCardNumbers()}
    function init(){const grid=document.getElementById('grid');if(!grid)return;injectStyles();setupAll(grid);let processing=false;const observer=new MutationObserver(()=>{if(processing)return;processing=true;observer.disconnect();try{setupAll(grid)}finally{processing=false;observer.observe(grid,{childList:true,subtree:true})}});observer.observe(grid,{childList:true,subtree:true})}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
