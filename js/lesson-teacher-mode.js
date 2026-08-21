// =====================================================
// Lessons — Teacher Mode
// Japanese → 4 seconds → Bangla finishes → 1 second → next card.
// Japanese speech is intentionally untouched.
// Bangla uses the same working method as test.html.
// =====================================================
(function () {
    const WAIT_MS = 4000;
    const AFTER_BANGLA_MS = 500;
    const RETRY_MS = 700;
    let state='stopped', cards=[], index=0, pausedPhase=null;
    let waitTimer=null, waitStartedAt=0, waitRemaining=WAIT_MS, pausedSpeech=false, runId=0;
    let banglaGeneration=0;
    const ICONS={play:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"></path></svg>',pause:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14M17 5v14"></path></svg>',stop:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1"></rect></svg>'};
    const labelIcon=(label,icon)=>'<span class="lesson-control-text">'+label+'</span>'+icon;
    const synth=()=>window.speechSynthesis||null;
    function getCurrentCards(){return Array.from(document.querySelectorAll('#grid > .card')).filter(c=>{const s=getComputedStyle(c);return s.display!=='none'&&c.offsetParent!==null;});}
    function japaneseText(card){const clone=(card.querySelector('.front')||card).cloneNode(true);clone.querySelectorAll('.lesson-card-topbar,.speaker-btn,.speak-btn,.pronunciation-btn,.romaji,.hard-star,.lesson-card-number,img,svg,button').forEach(e=>e.remove());return clone.textContent.replace(/[^\u3040-\u30ff\u3400-\u9fff\uff66-\uff9fー々〆〇・「」『』【】［］（）！？。、「」\s]/g,'').replace(/\s+/g,' ').trim();}
    function banglaText(card){const el=card.querySelector('.bangla');if(!el)return '';return el.textContent.replace(/\s*\/\s*/g,' অথবা ').replace(/\s+/g,' ').trim();}
    function setActiveCard(card){document.querySelectorAll('#grid > .card.teacher-active').forEach(e=>e.classList.remove('teacher-active'));if(!card)return;card.classList.add('teacher-active');const r=card.getBoundingClientRect();if(r.top<50||r.bottom>innerHeight-50)card.scrollIntoView({behavior:'smooth',block:'center'});}
    function getVoices(){return synth()?synth().getVoices():[];}
    function findVoice(prefix){const p=prefix.toLowerCase();return getVoices().find(v=>String(v.lang||'').toLowerCase().startsWith(p))||null;}
    function browserSpeak(text,lang){return new Promise(resolve=>{const s=synth();if(!s||!text||typeof SpeechSynthesisUtterance==='undefined'){resolve(false);return;}let finished=false,started=false;const finish=ok=>{if(finished)return;finished=true;resolve(ok);};const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=lang.startsWith('ja')?.9:.95;const voice=findVoice(lang.split('-')[0]);if(voice)u.voice=voice;u.onstart=()=>{started=true;};u.onend=()=>finish(started);u.onerror=()=>finish(false);try{s.cancel();s.resume();s.speak(u);}catch(e){finish(false);}setTimeout(()=>{if(!started)try{s.cancel();}catch(e){};finish(false);},7000);});}
    async function speakJapanese(text){if(!text)return false;if(window.AndroidTTS&&typeof window.AndroidTTS.speak==='function'){try{window.AndroidTTS.speak(text);return true;}catch(e){}}return browserSpeak(text,'ja-JP');}

    // AndroidTTS.speak() is fire-and-forget, so the native path does not
    // provide an onend callback to the webpage. Estimate the speech duration
    // from the Bengali text, then add the required 1-second pause.
    function getBanglaWaitMs(text){
        const words=String(text||'').trim().split(/\s+/).filter(Boolean).length;
        const chars=String(text||'').replace(/\s/g,'').length;
        // ~0.42s/word plus a small character-based component, with safe bounds.
        return Math.max(1400,Math.min(9000,Math.round(words*420+chars*35+500)));
    }

    function speakBangla(text,id){
        return new Promise(resolve=>{
            if(!text||id!==runId||state==='stopped'||state==='paused'){resolve(false);return;}
            const bengaliText=String(text).trim();
            if(!bengaliText){resolve(false);return;}

            if(window.AndroidTTS&&typeof window.AndroidTTS.speak==='function'){
                try{
                    window.AndroidTTS.speak(bengaliText);
                    // Keep the promise open for approximately the full native
                    // speech duration. The 1-second card transition is added later.
                    const speechWait=getBanglaWaitMs(bengaliText);
                    setTimeout(()=>resolve(true),speechWait);
                    return;
                }catch(e){
                    console.warn('Teacher Mode: AndroidTTS failed, falling back to Web Speech API.',e);
                }
            }

            const s=synth();
            if(!s||typeof SpeechSynthesisUtterance==='undefined'){resolve(false);return;}
            const generation=++banglaGeneration;
            let finished=false,started=false;
            const finish=ok=>{if(finished)return;finished=true;resolve(ok);};
            const u=new SpeechSynthesisUtterance(bengaliText);
            u.lang='bn-BD';
            u.rate=.9;
            u.volume=1;
            u.pitch=1;
            const speakNow=()=>{
                if(finished||generation!==banglaGeneration||id!==runId||state==='stopped'||state==='paused')return;
                const voices=s.getVoices();
                const voice=voices.find(v=>v.lang&&/^bn(?:-|$)/i.test(v.lang));
                if(voice)u.voice=voice;
                try{s.cancel();s.resume();s.speak(u);}catch(e){finish(false);}
            };
            u.onstart=()=>{started=true;};
            u.onend=()=>finish(started);
            u.onerror=()=>finish(false);
            if(s.getVoices().length===0){
                s.addEventListener('voiceschanged',speakNow,{once:true});
                setTimeout(()=>{if(!finished&&s.getVoices().length>0)speakNow();},300);
            }else speakNow();
            setTimeout(()=>{if(!started&&generation===banglaGeneration)finish(false);},7000);
        });
    }

    function scheduleBangla(delay,id){clearTimeout(waitTimer);state='waiting';waitRemaining=delay;waitStartedAt=Date.now();updateUI();waitTimer=setTimeout(()=>{if(id!==runId||state==='stopped'||state==='paused')return;waitTimer=null;waitRemaining=0;speakBanglaForCard(id);},delay);}
    async function speakJapaneseForCard(){if(state==='stopped')return;const id=runId,card=cards[index];if(!card)return finish();setActiveCard(card);state='japanese';updateUI();await speakJapanese(japaneseText(card));if(id!==runId||state==='stopped'||state==='paused')return;scheduleBangla(WAIT_MS,id);}
    async function speakBanglaForCard(id){if(id!==runId||state==='stopped'||state==='paused')return;const card=cards[index];if(!card)return finish();const text=banglaText(card);if(!text){console.warn('Teacher Mode: no Bangla text found on current card.');retryBangla(id);return;}state='bangla';updateUI();try{const ok=await speakBangla(text,id);if(id!==runId||state==='stopped'||state==='paused')return;if(!ok){retryBangla(id);return;}setTimeout(()=>{if(id!==runId||state==='stopped'||state==='paused')return;index++;if(index>=cards.length)finish();else speakJapaneseForCard();},AFTER_BANGLA_MS);}catch(e){console.error('Teacher Mode Bengali TTS error:',e);retryBangla(id);}}
    function retryBangla(id){if(id!==runId||state!=='bangla')return;setTimeout(()=>{if(id===runId&&state==='bangla')speakBanglaForCard(id);},RETRY_MS);}
    function start(){runId++;banglaGeneration++;try{synth()?.cancel();synth()?.resume();}catch(e){}clearTimeout(waitTimer);cards=getCurrentCards();if(!cards.length)return;index=0;pausedPhase=null;pausedSpeech=false;waitRemaining=WAIT_MS;state='japanese';speakJapaneseForCard();}
    function pause(){if(state==='stopped'||state==='paused')return;pausedPhase=state;if(state==='waiting'){waitRemaining=Math.max(0,waitRemaining-(Date.now()-waitStartedAt));clearTimeout(waitTimer);waitTimer=null;}else if(synth()?.speaking){try{synth().pause();}catch(e){}pausedSpeech=true;}state='paused';updateUI();}
    function resume(){if(state!=='paused')return;state=pausedPhase||'japanese';if(pausedSpeech&&synth()?.paused){pausedSpeech=false;try{synth().resume();}catch(e){}}else if(state==='waiting')scheduleBangla(waitRemaining||WAIT_MS,runId);else if(state==='japanese')speakJapaneseForCard();else if(state==='bangla')speakBanglaForCard(runId);else updateUI();}
    function stop(){runId++;banglaGeneration++;try{synth()?.cancel();}catch(e){}clearTimeout(waitTimer);waitTimer=null;state='stopped';pausedPhase=null;pausedSpeech=false;index=0;waitRemaining=WAIT_MS;document.querySelectorAll('#grid > .card.teacher-active').forEach(e=>e.classList.remove('teacher-active'));updateUI();}
    function finish(){stop();}
    function updateButton(b){if(state==='stopped'){b.innerHTML=labelIcon('',ICONS.play);b.setAttribute('aria-label','Start Teacher Mode from first card');b.title='Start Teacher Mode';}else if(state==='paused'){b.innerHTML=labelIcon('',ICONS.play);b.setAttribute('aria-label','Resume Teacher Mode');b.title='Resume Teacher Mode';}else{b.innerHTML=labelIcon('',ICONS.pause);b.setAttribute('aria-label','Pause Teacher Mode');b.title='Pause Teacher Mode';}}
    function updateUI(){document.querySelectorAll('.teacher-mode-btn').forEach(updateButton);document.querySelectorAll('.teacher-stop-btn').forEach(b=>{b.innerHTML=labelIcon('',ICONS.stop);b.setAttribute('aria-label','Stop Teacher Mode');b.title='Stop Teacher Mode';b.disabled=state==='stopped';});}
    function createButton(cls){const b=document.createElement('button');b.type='button';b.className=cls;return b;}
    function addToolbarControls(){const toolbar=document.querySelector('.toolbar');if(!toolbar||document.querySelector('.teacher-mode-field'))return;const field=document.createElement('div');field.className='field teacher-mode-field';const startBtn=createButton('teacher-mode-btn'),stopBtn=createButton('teacher-stop-btn');field.append(startBtn,stopBtn);toolbar.appendChild(field);startBtn.addEventListener('click',()=>state==='stopped'?start():state==='paused'?resume():pause());stopBtn.addEventListener('click',stop);}
    function addMobileControls(){
        const bar=document.querySelector('.mobile-bottom-controls');
        if(!bar)return;

        // Keep the Screen Always On control in the mobile sticky bar.
        // main.js creates this field in the toolbar first, so move it here
        // after the shared mobile-controls container has been created.
        const screenWake=document.getElementById('screenWakeField');
        if(screenWake&&screenWake.parentNode!==bar){
            bar.appendChild(screenWake);
        }

        if(bar.querySelector('.teacher-mode-btn'))return;
        const startBtn=createButton('teacher-mode-btn'),stopBtn=createButton('teacher-stop-btn');
        bar.append(startBtn,stopBtn);
        startBtn.addEventListener('click',()=>state==='stopped'?start():state==='paused'?resume():pause());
        stopBtn.addEventListener('click',stop);
    }
    function init(){if(!document.getElementById('grid'))return;addToolbarControls();addMobileControls();updateUI();}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
