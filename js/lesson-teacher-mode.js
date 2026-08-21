// =====================================================
// Lessons — Teacher Mode
// Japanese → 5 second pause → Bangla → next card immediately.
// =====================================================
(function () {
    const WAIT_MS = 5000;
    let state='stopped',cards=[],index=0,pausedPhase=null,waitTimer=null,waitStartedAt=0,waitRemaining=WAIT_MS,pausedSpeech=false;
    const ICONS={play:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"></path></svg>',pause:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14M17 5v14"></path></svg>',stop:'<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1"></rect></svg>'};
    const labelIcon=(label,icon)=>'<span class="lesson-control-text">'+label+'</span>'+icon;

    function getCurrentCards(){return Array.from(document.querySelectorAll('#grid > .card')).filter(c=>{const s=getComputedStyle(c);return s.display!=='none'&&c.offsetParent!==null;});}

    function japaneseText(card){
        const clone=(card.querySelector('.front')||card).cloneNode(true);
        clone.querySelectorAll('.lesson-card-topbar,.speaker-btn,.speak-btn,.pronunciation-btn,.romaji,.hard-star,.lesson-card-number,img,svg,button').forEach(e=>e.remove());
        return clone.textContent.replace(/[^\u3040-\u30ff\u3400-\u9fff\uff66-\uff9fー々〆〇・「」『』【】［］（）！？。、「」\s]/g,'').replace(/\s+/g,' ').trim();
    }

    function banglaText(card){
        // Only take Bengali-script text from the back. This prevents English
        // labels, Romaji, slash characters, punctuation, etc. from being spoken.
        const clone=(card.querySelector('.back')||card).cloneNode(true);
        clone.querySelectorAll('.lesson-card-topbar,.speaker-btn,.speak-btn,.pronunciation-btn,.romaji,.hard-star,.lesson-card-number,img,svg,button').forEach(e=>e.remove());
        let text=(clone.textContent.match(/[\u0980-\u09ff\u200c\u200d]+(?:\s+[\u0980-\u09ff\u200c\u200d]+)*/g)||[]).join(' ');
        text=text.replace(/\s+/g,' ').trim();
        // If a slash separated two Bengali meanings, say "অথবা" instead.
        text=text.replace(/\s*\/\s*/g,' অথবা ');
        return text;
    }

    function setActiveCard(card){document.querySelectorAll('#grid > .card.teacher-active').forEach(e=>e.classList.remove('teacher-active'));if(!card)return;card.classList.add('teacher-active');const r=card.getBoundingClientRect();if(r.top<50||r.bottom>innerHeight-50)card.scrollIntoView({behavior:'smooth',block:'center'});}

    function getVoice(lang){
        const vs=window.speechSynthesis?speechSynthesis.getVoices():[];
        const exact=vs.find(v=>v.lang&&v.lang.toLowerCase()===lang.toLowerCase());
        if(exact)return exact;
        const base=vs.find(v=>v.lang&&v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
        if(base)return base;
        return null;
    }

    function speak(text,lang,done){
        if(!text){
            // Never silently advance when the meaning could not be extracted.
            // This is what previously made Teacher Mode jump to the next card.
            if(lang==='bn-BD'){
                state='bangla';
                updateUI();
                return;
            }
            done();return;
        }
        if(!window.speechSynthesis){done();return;}
        speechSynthesis.cancel();
        const u=new SpeechSynthesisUtterance(text);
        u.lang=lang;
        u.rate=lang.startsWith('ja')?.9:.95;
        const v=getVoice(lang);if(v)u.voice=v;
        let completed=false;
        u.onend=()=>{if(!completed){completed=true;if(state!=='paused'&&state!=='stopped')done();}};
        u.onerror=()=>{
            if(completed||state==='paused'||state==='stopped')return;
            completed=true;
            // Do not advance on a Bangla TTS error. Retry once without forcing
            // a specific voice so Chrome can use its system/default speech engine.
            if(lang==='bn-BD'){
                setTimeout(()=>speakBangla(true),100);
            } else done();
        };
        speechSynthesis.speak(u);
    }

    function scheduleBangla(delay){clearTimeout(waitTimer);state='waiting';waitRemaining=delay;waitStartedAt=Date.now();waitTimer=setTimeout(()=>{waitTimer=null;waitRemaining=0;speakBangla(false);},delay);updateUI();}

    function speakJapanese(){if(state==='stopped')return;const card=cards[index];if(!card)return finish();setActiveCard(card);state='japanese';updateUI();speak(japaneseText(card),'ja-JP',()=>scheduleBangla(WAIT_MS));}

    function speakBangla(retry){
        if(state==='stopped'||state==='paused')return;
        const card=cards[index];if(!card)return finish();
        const text=banglaText(card);
        state='bangla';updateUI();
        if(!text){
            // Keep the card active rather than skipping it.
            return;
        }
        speechSynthesis.cancel();
        const u=new SpeechSynthesisUtterance(text);
        u.lang='bn-BD';u.rate=.95;
        const v=getVoice('bn-BD');if(v)u.voice=v;
        let completed=false;
        u.onend=()=>{if(completed)return;completed=true;if(state==='stopped'||state==='paused')return;index++;if(index>=cards.length)finish();else speakJapanese();};
        u.onerror=()=>{
            if(completed||state==='stopped'||state==='paused')return;
            completed=true;
            if(!retry){
                setTimeout(()=>speakBangla(true),100);
            }
        };
        speechSynthesis.speak(u);
    }

    function start(){speechSynthesis.cancel();clearTimeout(waitTimer);cards=getCurrentCards();if(!cards.length)return;index=0;pausedPhase=null;waitRemaining=WAIT_MS;state='japanese';speakJapanese();}
    function pause(){if(state==='stopped'||state==='paused')return;pausedPhase=state;if(state==='waiting'){waitRemaining=Math.max(0,waitRemaining-(Date.now()-waitStartedAt));clearTimeout(waitTimer);waitTimer=null;}else if(speechSynthesis?.speaking){speechSynthesis.pause();pausedSpeech=true;}state='paused';updateUI();}
    function resume(){if(state!=='paused')return;state=pausedPhase||'japanese';if(pausedSpeech&&speechSynthesis?.paused){pausedSpeech=false;speechSynthesis.resume();}else if(state==='waiting')scheduleBangla(waitRemaining||WAIT_MS);else if(state==='japanese')speakJapanese();else if(state==='bangla')speakBangla(false);else updateUI();}
    function stop(){speechSynthesis.cancel();clearTimeout(waitTimer);waitTimer=null;state='stopped';pausedPhase=null;pausedSpeech=false;index=0;waitRemaining=WAIT_MS;document.querySelectorAll('#grid > .card.teacher-active').forEach(e=>e.classList.remove('teacher-active'));updateUI();}
    function finish(){stop();}
    function updateButton(b){if(state==='stopped'){b.innerHTML=labelIcon('',ICONS.play);b.setAttribute('aria-label','Start Teacher Mode from first card');b.title='Start Teacher Mode';}else if(state==='paused'){b.innerHTML=labelIcon('',ICONS.play);b.setAttribute('aria-label','Resume Teacher Mode');b.title='Resume Teacher Mode';}else{b.innerHTML=labelIcon('',ICONS.pause);b.setAttribute('aria-label','Pause Teacher Mode');b.title='Pause Teacher Mode';}}
    function updateUI(){document.querySelectorAll('.teacher-mode-btn').forEach(updateButton);document.querySelectorAll('.teacher-stop-btn').forEach(b=>{b.innerHTML=labelIcon('',ICONS.stop);b.setAttribute('aria-label','Stop Teacher Mode');b.title='Stop Teacher Mode';b.disabled=state==='stopped';});}
    function createButton(cls){const b=document.createElement('button');b.type='button';b.className=cls;return b;}
    function addToolbarControls(){const toolbar=document.querySelector('.toolbar');if(!toolbar||document.querySelector('.teacher-mode-field'))return;const field=document.createElement('div');field.className='field teacher-mode-field';const startBtn=createButton('teacher-mode-btn'),stopBtn=createButton('teacher-stop-btn');field.append(startBtn,stopBtn);toolbar.appendChild(field);startBtn.addEventListener('click',()=>state==='stopped'?start():state==='paused'?resume():pause());stopBtn.addEventListener('click',stop);}
    function addMobileControls(){const bar=document.querySelector('.mobile-bottom-controls');if(!bar||bar.querySelector('.teacher-mode-btn'))return;const startBtn=createButton('teacher-mode-btn'),stopBtn=createButton('teacher-stop-btn');bar.append(startBtn,stopBtn);startBtn.addEventListener('click',()=>state==='stopped'?start():state==='paused'?resume():pause());stopBtn.addEventListener('click',stop);}
    function init(){if(!document.getElementById('grid'))return;addToolbarControls();addMobileControls();updateUI();}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
