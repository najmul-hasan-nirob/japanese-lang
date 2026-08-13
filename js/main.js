// =====================================================
// Dark Mode or Light mode
// =====================================================

const themeBtn=document.getElementById("theme");

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

// =====================================================
// Shared: Japanese pronunciation
// =====================================================
// Primary: direct Japanese TTS audio (no MP3 files in the repo).
// Fallback: the device/browser Web Speech API.
// The audio request is started directly from the speaker click,
// which is important for Android WebView user-gesture policies.
// =====================================================

let activeTtsAudio = null;
const ttsAudioCache = new Map();

function speakJapanese(text){
    text = cleanForSpeech(text);
    if(!text) return;

    // Stop the previous pronunciation first.
    if(activeTtsAudio){
        try{
            activeTtsAudio.pause();
            activeTtsAudio.currentTime = 0;
        }catch(e){}
        activeTtsAudio = null;
    }

    // Direct audio TTS. No per-card audio files are stored in GitHub.
    const key = String(text);
    let audio = ttsAudioCache.get(key);

    if(!audio){
        const url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ja&total=1&idx=0&q=" + encodeURIComponent(key);
        audio = new Audio(url);
        audio.preload = "auto";
        audio.setAttribute("playsinline", "true");
        ttsAudioCache.set(key, audio);
    }

    activeTtsAudio = audio;

    const fallback = () => {
        if(activeTtsAudio === audio) activeTtsAudio = null;
        speakJapaneseWithWebSpeech(key);
    };

    audio.onended = () => {
        if(activeTtsAudio === audio) activeTtsAudio = null;
    };
    audio.onerror = fallback;

    const playPromise = audio.play();
    if(playPromise && typeof playPromise.catch === "function"){
        playPromise.catch(fallback);
    }
}

function speakJapaneseWithWebSpeech(text){
    if(!(window.speechSynthesis && window.SpeechSynthesisUtterance)) return;

    const utter = new SpeechSynthesisUtterance(String(text));
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

// Strips example-sentence numbering (①②③...) before speaking
function cleanForSpeech(text){
    if(!text) return "";
    return String(text).replace(/[①-⑳]/g, "").trim();
}

// Grammar "pattern" entries (e.g. "N₁は N₂です") aren't real
// speakable sentences - skip the speaker button for those.
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
    btn.addEventListener("click", e => {
        e.stopPropagation();
        speakJapanese(text);
    });
    return btn;
}
