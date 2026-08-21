// =====================================================
// Lessons — Teacher Mode
// Japanese → 5 seconds → Bangla → next card immediately.
// Japanese speech is intentionally untouched.
// Bangla uses Google's translate_tts endpoint played through
// a plain <audio> element — no npm import, no WASM model
// download, no pre-generated mp3 files. Falls back to the
// browser's own Bengali voice only if that request fails.
// =====================================================
(function () {
    const WAIT_MS = 5000;
    const RETRY_MS = 700;
    const GOOGLE_TTS_ENDPOINT = 'https://translate.google.com/translate_tts';
    const GOOGLE_TTS_MAX_CHARS = 190; // Google's unofficial endpoint caps out around ~200 chars per request
    let state='stopped', cards=[], index=0, pausedPhase=null;
    let waitTimer=null, waitStartedAt=0, waitRemaining=WAIT_MS, pausedSpeech=false, runId=0;
    let banglaAudio=null, banglaGeneration=0;
    const ICONS={play:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"></path></svg>',pause:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14M17 5v14"></path></svg>',stop:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1"></rect></svg>'};
    const labelIcon=(label,icon)=>'<span class="lesson-control-text">'+label+'</span>'+icon;
    const synth=()=>window.speechSynthesis||null;
    function getCurrentCards(){return Array.from(document.querySelectorAll('#grid > .card')).filter(c=>{const s=getComputedStyle(c);return s.display!=='none'&&c.offsetParent!==null;});}
    function japaneseText(card){const clone=(card.querySelector('.front')||card).cloneNode(true);clone.querySelectorAll('.lesson-card-topbar,.speaker-btn,.speak-btn,.pronunciation-btn,.romaji,.hard-star,.lesson-card-number,img,svg,button').forEach(e=>e.remove());return clone.textContent.replace(/[^\u3040-\u30ff\u3400-\u9fff\uff66-\uff9fー々〆〇・「」『』【】［］（）！？。、「」\s]/g,'').replace(/\s+/g,' ').trim();}
    function banglaText(card){const el=card.querySelector('.bangla');if(!el)return '';return el.textContent.replace(/\s*\/\s*/g,' অথবা ').replace(/\s+/g,' ').trim();}
    function setActiveCard(card){document.querySelectorAll('#grid > .card.teacher-active').forEach(e=>e.classList.remove('teacher-active'));if(!card)return;card.classList.add('teacher-active');const r=card.getBoundingClientRect();if(r.top<50||r.bottom>innerHeight-50)card.scrollIntoView({behavior:'smooth',block:'center'});}
    function getVoices(){return synth()?synth().getVoices():[];}
    function findVoice(prefix){const p=prefix.toLowerCase();return getVoices().find(v=>String(v.lang||'').toLowerCase().startsWith(p))||null;}
    // Existing browser speech path; used only by Japanese fallback.
    function browserSpeak(text,lang){return new Promise(resolve=>{const s=synth();if(!s||!text||typeof SpeechSynthesisUtterance==='undefined'){resolve(false);return;}let finished=false,started=false;const finish=ok=>{if(finished)return;finished=true;resolve(ok);};const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=lang.startsWith('ja')?.9:.95;const voice=findVoice(lang.split('-')[0]);if(voice)u.voice=voice;u.onstart=()=>{started=true;};u.onend=()=>finish(started);u.onerror=()=>finish(false);try{s.cancel();s.resume();s.speak(u);}catch(e){finish(false);}setTimeout(()=>{if(!started)try{s.cancel();}catch(e){};finish(false);},7000);});}
    async function speakJapanese(text){if(!text)return false;if(window.AndroidTTS&&typeof window.AndroidTTS.speak==='function'){try{window.AndroidTTS.speak(text);return true;}catch(e){}}return browserSpeak(text,'ja-JP');}

    // =====================================================
    // Bangla TTS — Google's translate_tts endpoint
    // (no CDN library, no model download, no stored mp3 files)
    // =====================================================
    function splitForGoogleTTS(text){
        const parts=[];
        let remaining=text.trim();
        while(remaining.length>GOOGLE_TTS_MAX_CHARS){
            let cut=remaining.lastIndexOf(' ',GOOGLE_TTS_MAX_CHARS);
            if(cut<=0)cut=GOOGLE_TTS_MAX_CHARS;
            parts.push(remaining.slice(0,cut).trim());
            remaining=remaining.slice(cut).trim();
        }
        if(remaining)parts.push(remaining);
        return parts;
    }
    function googleTTSUrl(text){return GOOGLE_TTS_ENDPOINT+'?ie=UTF-8&q='+encodeURIComponent(text)+'&tl=bn&client=tw-ob';}
    function stopBanglaAudio(){banglaGeneration++;if(banglaAudio){try{banglaAudio.pause();banglaAudio.currentTime=0;}catch(e){}banglaAudio=null;}}
    function playAudioUrl(url,id,generation){return new Promise(resolve=>{const audio=new Audio();banglaAudio=audio;audio.preload='auto';let settled=false;const finish=ok=>{if(settled)return;settled=true;if(banglaAudio===audio)banglaAudio=null;resolve(ok);};audio.onended=()=>finish(true);audio.onerror=()=>finish(false);audio.onpause=()=>{if(state==='stopped')finish(false);};if(id!==runId||state==='stopped'||generation!==banglaGeneration){finish(false);return;}audio.src=url;audio.play().catch(()=>finish(false));});}
    async function speakBanglaGoogle(text,id){
        const generation=banglaGeneration;
        const chunks=splitForGoogleTTS(text);
        if(!chunks.length)return false;
        for(const chunk of chunks){
            if(id!==runId||state==='stopped'||state==='paused'||generation!==banglaGeneration)return false;
            const ok=await playAudioUrl(googleTTSUrl(chunk),id,generation);
            if(!ok)return false;
        }
        return true;
    }
    async function speakBangla(text,id){
        if(!text||id!==runId)return false;
        const generation=++banglaGeneration;
        stopBanglaAudio();
        if(id!==runId||state==='stopped'||state==='paused')return false;
        const ok=await speakBanglaGoogle(text,id);
        if(ok)return true;
        // Fallback only if Google's endpoint is unreachable (e.g. fully offline)
        if(id!==runId||state==='stopped'||state==='paused'||generation!==banglaGeneration)return false;
        return browserSpeak(text,'bn-BD');
    }
    function scheduleBangla(delay,id){clearTimeout(waitTimer);state='waiting';waitRemaining=delay;waitStartedAt=Date.now();updateUI();waitTimer=setTimeout(()=>{if(id!==runId||state==='stopped'||state==='paused')return;waitTimer=null;waitRemaining=0;speakBanglaForCard(id);},delay);}
    async function speakJapaneseForCard(){if(state==='stopped')return;const id=runId,card=cards[index];if(!card)return finish();setActiveCard(card);state='japanese';updateUI();await speakJapanese(japaneseText(card));if(id!==runId||state==='stopped'||state==='paused')return;scheduleBangla(WAIT_MS,id);}
    async function speakBanglaForCard(id){if(id!==runId||state==='stopped'||state==='paused')return;const card=cards[index];if(!card)return finish();const text=banglaText(card);if(!text){console.warn('Teacher Mode: no Bangla text found on current card.');retryBangla(id);return;}state='bangla';updateUI();try{const ok=await speakBangla(text,id);if(id!==runId||state==='stopped'||state==='paused')return;if(!ok){retryBangla(id);return;}index++;if(index>=cards.length)finish();else speakJapaneseForCard();}catch(e){console.error('Teacher Mode Bengali TTS error:',e);retryBangla(id);}}
    function retryBangla(id){if(id!==runId||state!=='bangla')return;setTimeout(()=>{if(id===runId&&state==='bangla')speakBanglaForCard(id);},RETRY_MS);}
    function start(){runId++;stopBanglaAudio();try{synth()?.cancel();synth()?.resume();}catch(e){}clearTimeout(waitTimer);cards=getCurrentCards();if(!cards.length)return;index=0;pausedPhase=null;pausedSpeech=false;waitRemaining=WAIT_MS;state='japanese';speakJapaneseForCard();}
    function pause(){if(state==='stopped'||state==='paused')return;pausedPhase=state;if(state==='waiting'){waitRemaining=Math.max(0,waitRemaining-(Date.now()-waitStartedAt));clearTimeout(waitTimer);waitTimer=null;}else if(state==='bangla'&&banglaAudio){try{banglaAudio.pause();}catch(e){}pausedSpeech=true;}else if(synth()?.speaking){try{synth().pause();}catch(e){}pausedSpeech=true;}state='paused';updateUI();}
    function resume(){if(state!=='paused')return;state=pausedPhase||'japanese';if(pausedSpeech&&state==='bangla'&&banglaAudio){pausedSpeech=false;banglaAudio.play().catch(()=>{});}else if(pausedSpeech&&synth()?.paused){pausedSpeech=false;try{synth().resume();}catch(e){}}else if(state==='waiting')scheduleBangla(waitRemaining||WAIT_MS,runId);else if(state==='japanese')speakJapaneseForCard();else if(state==='bangla')speakBanglaForCard(runId);else updateUI();}
    function stop(){runId++;stopBanglaAudio();try{synth()?.cancel();}catch(e){}clearTimeout(waitTimer);waitTimer=null;state='stopped';pausedPhase=null;pausedSpeech=false;index=0;waitRemaining=WAIT_MS;document.querySelectorAll('#grid > .card.teacher-active').forEach(e=>e.classList.remove('teacher-active'));updateUI();}
    function finish(){stop();}
    function updateButton(b){if(state==='stopped'){b.innerHTML=labelIcon('',ICONS.play);b.setAttribute('aria-label','Start Teacher Mode from first card');b.title='Start Teacher Mode';}else if(state==='paused'){b.innerHTML=labelIcon('',ICONS.play);b.setAttribute('aria-label','Resume Teacher Mode');b.title='Resume Teacher Mode';}else{b.innerHTML=labelIcon('',ICONS.pause);b.setAttribute('aria-label','Pause Teacher Mode');b.title='Pause Teacher Mode';}}
    function updateUI(){document.querySelectorAll('.teacher-mode-btn').forEach(updateButton);document.querySelectorAll('.teacher-stop-btn').forEach(b=>{b.innerHTML=labelIcon('',ICONS.stop);b.setAttribute('aria-label','Stop Teacher Mode');b.title='Stop Teacher Mode';b.disabled=state==='stopped';});}
    function createButton(cls){const b=document.createElement('button');b.type='button';b.className=cls;return b;}
    function addToolbarControls(){const toolbar=document.querySelector('.toolbar');if(!toolbar||document.querySelector('.teacher-mode-field'))return;const field=document.createElement('div');field.className='field teacher-mode-field';const startBtn=createButton('teacher-mode-btn'),stopBtn=createButton('teacher-stop-btn');field.append(startBtn,stopBtn);toolbar.appendChild(field);startBtn.addEventListener('click',()=>state==='stopped'?start():state==='paused'?resume():pause());stopBtn.addEventListener('click',stop);}
    function addMobileControls(){const bar=document.querySelector('.mobile-bottom-controls');if(!bar||bar.querySelector('.teacher-mode-btn'))return;const startBtn=createButton('teacher-mode-btn'),stopBtn=createButton('teacher-stop-btn');bar.append(startBtn,stopBtn);startBtn.addEventListener('click',()=>state==='stopped'?start():state==='paused'?resume():pause());stopBtn.addEventListener('click',stop);}
    function init(){if(!document.getElementById('grid'))return;addToolbarControls();addMobileControls();updateUI();}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
