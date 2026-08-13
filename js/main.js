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
// Android WebView does not expose the browser Web Speech
// synthesis API. When the app provides the AndroidTTS
// bridge, use native Android TextToSpeech first. Normal
// browsers continue using the existing Web Speech API.
// =====================================================

function speakJapanese(text){

    if(!text) return;

    const japaneseText = String(text).trim();
    if(!japaneseText) return;

    // Native Android TTS bridge (used by the WebView app).
    // Keep this first so Android does not depend on
    // window.speechSynthesis, which WebView may not support.
    if(window.AndroidTTS && typeof window.AndroidTTS.speak === "function"){
        try{
            window.AndroidTTS.speak(japaneseText);
            return;
        }catch(e){
            // Fall through to browser TTS if the bridge fails.
        }
    }

    // Normal browser pronunciation.
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