// =====================================================
// Lessons — Teacher Mode
// Japanese → 5 second pause → Bangla → next card immediately.
// =====================================================
(function () {
    const WAIT_MS = 5000;
    let state='stopped',cards=[],index=0,pausedPhase=null,waitTimer=null,waitStartedAt=0,waitRemaining=WAIT_MS,pausedSpeech=false,runId=0;
    const ICONS={play:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"></path></svg>',pause:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14M17 5v14"></path></svg>',stop:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1"></rect></svg>'};
    const labelIcon=(label,icon)=>'<span class="lesson-control-text">'+label+'</span>'+icon;

    function getCurrentCards(){return Array.from(document.querySelectorAll('#grid > .card')).filter(c=>{const s=getComputedStyle(c);return s.display!=='none'&&c.offsetParent!==null;});}
    function japaneseText(card){const clone=(card.querySelector('.front')||card).cloneNode(true);clone.querySelectorAll('.lesson-card-topbar,.speaker-btn,.speak-btn,.pronunciation-btn,.romaji,.hard-star,.lesson-card-number,img,svg,button').forEach(e=>e.remove());return clone.textContent.replace(/[^\u3040-\u30ff\u3400-\u9fff\uff66-\uff9fー々〆〇・「」『』【】［］（）！？。、「」\s]/g,'').replace(/\s+/g,' ').trim();}
    function banglaText(card){const el=card.querySelector('.bangla');if(!el)return '';return el.textContent.replace(/\s*\/\s*/g,' অথবা ').replace(/\s+/g,' ').trim();}

    function setActiveCard(card){document.querySelectorAll('#grid > .card.teacher-active').forEach(e=>e.classList.remove('teacher-active'));if(!card)return;card.classList.add('teacher-active');const r=card.getBoundingClientRect();if(r.top<50||r.bottom>innerHeight-50)card.scrollIntoView({behavior:'smooth',block:'center'});}

    // Chrome can expose voices asynchronously. Always refresh the list before
    // selecting a voice; Bengali must use an actual bn-* voice.
    function getVoices(){return window.speechSynthesis?speechSynthesis.getVoices():[];}
    function getVoice(lang){const voices=getVoices();const exact=voices.find(v=>v.lang&&v.lang.toLowerCase()===lang.toLowerCase());if(exact)return exact;return voices.find(v=>v.lang&&v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()))||null;}
    function waitForVoices(timeout=1200){return new Promise(resolve=>{const ready=getVoices();if(ready.length)return resolve(ready);let done=false;const finish=()=>{if(done)return;done=true;if(speechSynthesis.removeEventListener)speechSynthesis.removeEventListener('voiceschanged',finish);resolve(getVoices());};if(speechSynthesis.addEventListener)speechSynthesis.addEventListener('voiceschanged',finish,{once:true});setTimeout(finish,timeout);});}

    async function speakText(text,lang,onEnd,onError){
        if(!text){onError?.({error:'empty-text'});return;}
        await waitForVoices();
        if(state==='stopped'||state==='paused')return;
        const voice=getVoice(lang);
        if(lang.startsWith('bn')&&!voice){
            console.warn('Teacher Mode: no Bengali speech voice is installed/available.');
            onError?.({error:'no-bengali-voice'});
            return;
        }
        const u=new SpeechSynthesisUtterance(text);u.lang=voice?.lang||lang;u.rate=lang.startsWith('ja')?.9:.95;if(voice)u.voice=voice;
        let started=false,settled=false;
        u.onstart=()=>{started=true;};
        u.onend=()=>{if(settled)return;settled=true;if(started)onEnd?.();else onError?.({error:'ended-without-start'});};
        u.onerror=e=>{if(settled)return;settled=true;onError?.(e);};
        speechSynthesis.speak(u);
    }

    function scheduleBangla(delay,id){clearTimeout(waitTimer);state='waiting';waitRemaining=delay;waitStartedAt=Date.now();updateUI();waitTimer=setTimeout(()=>{if(id!==runId||state==='stopped'||state==='paused')return;waitTimer=null;waitRemaining=0;speakBangla(id);},delay);}

    function speakJapanese(){
        if(state==='stopped')return;const id=runId,card=cards[index];if(!card)return finish();
        setActiveCard(card);state='japanese';updateUI();speechSynthesis.cancel();
        speakText(japaneseText(card),'ja-JP',()=>{if(id===runId&&state!=='stopped'&&state!=='paused')scheduleBangla(WAIT_MS,id);},()=>{if(id===runId&&state!=='stopped'&&state!=='paused')scheduleBangla(WAIT_MS,id);});
    }

    function speakBangla(id){
        if(id!==runId||state==='stopped'||state==='paused')return;
        const card=cards[index];if(!card)return finish();
        const text=banglaText(card);state='bangla';updateUI();
        if(!text){console.warn('Teacher Mode: no .bangla text found for card',index);return;}

        // CRITICAL: advancing is allowed ONLY after a Bengali utterance has
        // actually started and then fired its end event. If Chrome rejects or
        // instantly ends the utterance, stay on this card instead of silently
        // jumping to the next Japanese card.
        speakText(text,'bn-BD',()=>{
            if(id!==runId||state==='stopped'||state==='paused')return;
            index++;if(index>=cards.length)finish();else speakJapanese();
        },e=>{
            if(id!==runId||state==='stopped'||state==='paused')return;
            console.warn('Teacher Mode Bangla TTS:',e?.error||e);
            // Do NOT advance. Retry once after voices are refreshed.
            setTimeout(()=>{
                if(id===runId&&state==='bangla'&&index<cards.length)speakText(text,'bn-BD',()=>{
                    if(id!==runId||state==='stopped'||state==='paused')return;
                    index++;if(index>=cards.length)finish();else speakJapanese();
                },err=>console.warn('Teacher Mode Bangla retry failed:',err?.error||err));
            },250);
        });
    }

    function start(){runId++;speechSynthesis.cancel();clearTimeout(waitTimer);cards=getCurrentCards();if(!cards.length)return;index=0;pausedPhase=null;pausedSpeech=false;waitRemaining=WAIT_MS;state='japanese';speakJapanese();}
    function pause(){if(state==='stopped'||state==='paused')return;pausedPhase=state;if(state==='waiting'){waitRemaining=Math.max(0,waitRemaining-(Date.now()-waitStartedAt));clearTimeout(waitTimer);waitTimer=null;}else if(speechSynthesis?.speaking){speechSynthesis.pause();pausedSpeech=true;}state='paused';updateUI();}
    function resume(){if(state!=='paused')return;state=pausedPhase||'japanese';if(pausedSpeech&&speechSynthesis?.paused){pausedSpeech=false;speechSynthesis.resume();}else if(state==='waiting')scheduleBangla(waitRemaining||WAIT_MS,runId);else if(state==='japanese')speakJapanese();else if(state==='bangla')speakBangla(runId);else updateUI();}
    function stop(){runId++;speechSynthesis.cancel();clearTimeout(waitTimer);waitTimer=null;state='stopped';pausedPhase=null;pausedSpeech=false;index=0;waitRemaining=WAIT_MS;document.querySelectorAll('#grid > .card.teacher-active').forEach(e=>e.classList.remove('teacher-active'));updateUI();}
    function finish(){stop();}
    function updateButton(b){if(state==='stopped'){b.innerHTML=labelIcon('',ICONS.play);b.setAttribute('aria-label','Start Teacher Mode from first card');b.title='Start Teacher Mode';}else if(state==='paused'){b.innerHTML=labelIcon('',ICONS.play);b.setAttribute('aria-label','Resume Teacher Mode');b.title='Resume Teacher Mode';}else{b.innerHTML=labelIcon('',ICONS.pause);b.setAttribute('aria-label','Pause Teacher Mode');b.title='Pause Teacher Mode';}}
    function updateUI(){document.querySelectorAll('.teacher-mode-btn').forEach(updateButton);document.querySelectorAll('.teacher-stop-btn').forEach(b=>{b.innerHTML=labelIcon('',ICONS.stop);b.setAttribute('aria-label','Stop Teacher Mode');b.title='Stop Teacher Mode';b.disabled=state==='stopped';});}
    function createButton(cls){const b=document.createElement('button');b.type='button';b.className=cls;return b;}
    function addToolbarControls(){const toolbar=document.querySelector('.toolbar');if(!toolbar||document.querySelector('.teacher-mode-field'))return;const field=document.createElement('div');field.className='field teacher-mode-field';const startBtn=createButton('teacher-mode-btn'),stopBtn=createButton('teacher-stop-btn');field.append(startBtn,stopBtn);toolbar.appendChild(field);startBtn.addEventListener('click',()=>state==='stopped'?start():state==='paused'?resume():pause());stopBtn.addEventListener('click',stop);}
    function addMobileControls(){const bar=document.querySelector('.mobile-bottom-controls');if(!bar||bar.querySelector('.teacher-mode-btn'))return;const startBtn=createButton('teacher-mode-btn'),stopBtn=createButton('teacher-stop-btn');bar.append(startBtn,stopBtn);startBtn.addEventListener('click',()=>state==='stopped'?start():state==='paused'?resume():pause());stopBtn.addEventListener('click',stop);}
    function init(){if(!document.getElementById('grid'))return;addToolbarControls();addMobileControls();updateUI();}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
