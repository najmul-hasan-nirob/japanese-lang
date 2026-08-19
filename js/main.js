// =====================================================
// Dark Mode or Light mode
// =====================================================

const themeBtn=document.getElementById("theme");

if(themeBtn){
    if(localStorage.getItem("theme")==="dark"){
        document.body.classList.add("dark");
        themeBtn.textContent="☀️";
    }

    themeBtn.addEventListener("click",()=>{
        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){
            localStorage.setItem("theme","dark");
            themeBtn.textContent="☀️";
        }else{
            localStorage.setItem("theme","light");
            themeBtn.textContent="🌙";
        }
    });
}

// =====================================================
// Screen Wake Lock — keep display awake while studying
// =====================================================
(function(){
    const STORAGE_KEY="japanese-lang-screen-awake";
    let wakeLock=null;
    let button=null;

    function isEnabled(){ return localStorage.getItem(STORAGE_KEY)==="on"; }

    async function requestWakeLock(){
        if(!('wakeLock' in navigator)) return false;
        try{
            wakeLock=await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release',()=>{
                wakeLock=null;
                updateButton();
            });
            return true;
        }catch(e){
            wakeLock=null;
            return false;
        }
    }

    async function releaseWakeLock(){
        if(wakeLock){
            try{ await wakeLock.release(); }catch(e){}
            wakeLock=null;
        }
    }

    async function applyState(){
        if(isEnabled()){
            const ok=await requestWakeLock();
            if(!ok) localStorage.setItem(STORAGE_KEY,"off");
        }else{
            await releaseWakeLock();
        }
        updateButton();
    }

    function updateButton(){
        if(!button) return;
        const on=isEnabled();
        button.innerHTML=on
            ? '<svg class="mobile-control-icon screen-wake-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>'
            : '<svg class="mobile-control-icon screen-wake-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z"></path></svg>';
        button.setAttribute('aria-pressed',String(on));
        button.setAttribute('aria-label',on?'Screen Always On':'Normal screen timeout');
        button.title=on?'Screen stays awake while this page is active':'Allow normal screen timeout';
    }

    function createControl(){
        if(document.getElementById('screenWakeField')) return;
        const toolbar=document.querySelector('.toolbar');
        if(!toolbar) return;

        const field=document.createElement('div');
        field.className='field screen-wake-field';
        field.id='screenWakeField';
        field.innerHTML='<label>Screen</label><button id="screenWakeToggle" class="screen-wake-toggle" type="button" aria-pressed="false" aria-label="Normal screen timeout"></button>';
        toolbar.appendChild(field);
        button=field.querySelector('#screenWakeToggle');

        const style=document.createElement('style');
        style.textContent=`
          .screen-wake-field button{cursor:pointer;display:flex;align-items:center;justify-content:center;}
          .screen-wake-icon{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}
          .screen-wake-field button[aria-pressed="true"]{font-weight:700;}
          @media(max-width:520px){
            .mobile-bottom-controls .screen-wake-field{width:auto;flex:1;min-width:0;}
            .mobile-bottom-controls .screen-wake-field label{display:none;}
            .mobile-bottom-controls .screen-wake-field button{width:100%;min-width:0;white-space:nowrap;}
            .mobile-bottom-controls .screen-wake-icon{width:22px;height:22px;}
          }
        `;
        document.head.appendChild(style);

        button.addEventListener('click',async()=>{
            const next=!isEnabled();
            localStorage.setItem(STORAGE_KEY,next?'on':'off');
            await applyState();
        });

        updateButton();
        if(isEnabled()) applyState();
    }

    function resumeOnVisibility(){
        if(document.visibilityState==='visible' && isEnabled() && !wakeLock) applyState();
    }

    document.addEventListener('visibilitychange',resumeOnVisibility);
    window.addEventListener('pageshow',resumeOnVisibility);

    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',createControl);
    else createControl();
})();

// =====================================================
// Shared: Japanese pronunciation
// =====================================================

function speakJapanese(text){
    if(!text) return;
    const japaneseText = String(text).trim();
    if(!japaneseText) return;
    if(window.AndroidTTS && typeof window.AndroidTTS.speak === "function"){
        try{ window.AndroidTTS.speak(japaneseText); return; }catch(e){}
    }
    if(!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return;
    const utter = new SpeechSynthesisUtterance(japaneseText);
    utter.lang = "ja-JP";
    utter.rate = 0.9;
    const applyVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("ja"));
        if(jaVoice) utter.voice = jaVoice;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
    };
    if(window.speechSynthesis.getVoices().length === 0){
        window.speechSynthesis.addEventListener("voiceschanged", applyVoiceAndSpeak, { once:true });
    }else{
        applyVoiceAndSpeak();
    }
}

function cleanForSpeech(text){
    if(!text) return "";
    return String(text).replace(/[①-⑳]/g, "").trim();
}

function isSpeakableJapanese(text){
    if(!text) return false;
    return !/[₀-₉]/.test(text);
}

function createSpeakerButton(text){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "speaker-btn";
    btn.setAttribute("aria-label", "Play pronunciation");
    btn.textContent = "🔊";
    btn.addEventListener("click", e => { e.stopPropagation(); speakJapanese(text); });
    return btn;
}

// =====================================================
// Shared header / mobile controls
// =====================================================

(function(){
    const MOBILE_ICONS={
        flip:'<svg class="mobile-control-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"/></svg>',
        shuffle:'<svg class="mobile-control-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3c4 0 6 10 10 10h3M17 14l3 3-3 3M4 17h3c1.5 0 2.5-1.5 3.5-3M14 10c1-1.5 2-3 3-3h3M17 4l3 3-3 3"/></svg>'
    };

    function applySharedMobileIcons(){
        if(window.innerWidth>520) return;
        const direction=document.getElementById('direction');
        if(direction){
            direction.innerHTML=MOBILE_ICONS.flip;
            direction.setAttribute('aria-label',direction.classList.contains('right')?'Show all cards Front':'Show all cards Back');
            direction.setAttribute('title',direction.classList.contains('right')?'Show Front':'Show Back');
        }
        const shuffle=document.getElementById('shuffleBtn');
        if(shuffle){
            shuffle.innerHTML=MOBILE_ICONS.shuffle;
            shuffle.setAttribute('aria-label','Shuffle');
            shuffle.setAttribute('title','Shuffle');
        }
    }

    function restoreSharedMobileIcons(){
        if(window.innerWidth<=520) return;
        const direction=document.getElementById('direction');
        if(direction && !document.body.classList.contains('mobile-menu-open')){
            direction.innerHTML='<span class="abacus-label left active" id="directionLeftLabel">Front</span><div class="rod"><div class="bead" id="bead"></div></div><span class="abacus-label right" id="directionRightLabel">Back</span>';
        }
        const shuffle=document.getElementById('shuffleBtn');
        if(shuffle && !shuffle.closest('.mobile-bottom-controls')) shuffle.innerHTML='🔀 Shuffle';
    }

    function initMobileMenu(){
        const toggle=document.getElementById('mobileMenuToggle');
        const nav=document.getElementById('mobileMenuArea');
        const toolbar=document.querySelector('.toolbar');
        if(!toggle || !nav) return;
        const direction=document.getElementById('direction');
        let bottom=document.querySelector('.mobile-bottom-controls');
        let directionMark=null,shuffleMark=null,romajiMark=null,moved=false;
        if(!bottom){ bottom=document.createElement('div'); bottom.className='mobile-bottom-controls'; document.body.appendChild(bottom); }
        function move(){
            if(moved || window.innerWidth>520) return;
            const shuffle=document.getElementById('shuffleBtn');
            if(toolbar && shuffle && shuffle.parentNode!==bottom){ shuffleMark=document.createComment('desktop-shuffle-position'); shuffle.before(shuffleMark); bottom.appendChild(shuffle); }
            const romaji=document.getElementById('backRomajiToggle');
            if(romaji && romaji.parentNode!==bottom){ romajiMark=document.createComment('desktop-romaji-position'); romaji.before(romajiMark); bottom.appendChild(romaji); }
            if(direction && direction.parentNode!==bottom){ directionMark=document.createComment('desktop-direction-position'); direction.before(directionMark); direction.classList.add('mobile-bottom-direction'); bottom.appendChild(direction); }
            const wake=document.getElementById('screenWakeField');
            if(wake && wake.parentNode!==bottom){ const wakeMark=document.createComment('desktop-screen-wake-position'); wake.before(wakeMark); bottom.appendChild(wake); wake.dataset.desktopMarker='screen-wake'; }
            if(bottom.parentNode!==document.body) document.body.appendChild(bottom);
            applySharedMobileIcons();
            moved=true;
        }
        function restore(){
            if(!moved) return;
            const shuffle=document.getElementById('shuffleBtn');
            if(shuffle && shuffleMark && shuffleMark.parentNode){ shuffle.remove(); shuffleMark.after(shuffle); }
            if(shuffleMark){ shuffleMark.remove(); shuffleMark=null; }
            const romaji=document.getElementById('backRomajiToggle');
            if(romaji && romajiMark && romajiMark.parentNode){ romaji.remove(); romajiMark.after(romaji); }
            if(romajiMark){ romajiMark.remove(); romajiMark=null; }
            if(direction && directionMark && directionMark.parentNode){ direction.remove(); direction.classList.remove('mobile-bottom-direction'); directionMark.after(direction); }
            if(directionMark){ directionMark.remove(); directionMark=null; }
            const wake=document.getElementById('screenWakeField');
            const wakeMark=document.querySelector('.desktop-screen-wake-position');
            if(wake && wakeMark && wakeMark.parentNode){ wake.remove(); wakeMark.after(wake); }
            if(wakeMark) wakeMark.remove();
            restoreSharedMobileIcons();
            moved=false;
        }
        function sync(){ window.innerWidth<=520 ? move() : restore(); }
        function close(){ document.body.classList.remove('mobile-menu-open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
        sync();
        toggle.addEventListener('click',e=>{ e.stopPropagation(); sync(); const open=document.body.classList.toggle('mobile-menu-open'); toggle.classList.toggle('open',open); toggle.setAttribute('aria-expanded',String(open)); applySharedMobileIcons(); });
        nav.addEventListener('click',e=>{ if(window.innerWidth<=520 && e.target.closest('a')) close(); });
        document.addEventListener('click',e=>{ if(window.innerWidth<=520 && !e.target.closest('.page-head')) close(); });
        window.addEventListener('resize',()=>{ sync(); if(window.innerWidth>520) close(); });
    }

    function nudgeFromTop(){ if(window.innerWidth>520) return; if(window.scrollY<=0) window.scrollTo(0,10); }
    function initMultiselectTopNudge(){
        if(window.innerWidth>520) return;
        document.addEventListener('click',function(e){ const button=e.target.closest('.multiselect-btn'); if(!button) return; const panel=button.parentElement?.querySelector('.multiselect-panel'); if(!panel) return; setTimeout(function(){ if(panel.classList.contains('open')) nudgeFromTop(); },0); });
        document.addEventListener('touchstart',function(e){ const panel=e.target.closest('.multiselect-panel.open'); if(panel && window.scrollY<=0) nudgeFromTop(); },{passive:true});
    }
    function init(){ initMobileMenu(); initMultiselectTopNudge(); }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
