// Shared, reliable Japanese pronunciation for Kana and Numbers.
(function(){
    function speakJapanese(text){
        if(text === undefined || text === null) return;
        const japaneseText=String(text).trim();
        if(!japaneseText) return;

        if(window.AndroidTTS && typeof window.AndroidTTS.speak === 'function'){
            try{ window.AndroidTTS.speak(japaneseText); return; }catch(e){}
        }

        const synth=window.speechSynthesis;
        if(!synth || typeof SpeechSynthesisUtterance === 'undefined') return;

        const utter=new SpeechSynthesisUtterance(japaneseText);
        utter.lang='ja-JP';
        utter.rate=0.9;
        utter.volume=1;
        utter.pitch=1;

        const speakNow=()=>{
            const voices=synth.getVoices();
            const jaVoice=voices.find(v=>v.lang && /^ja(?:-|$)/i.test(v.lang));
            if(jaVoice) utter.voice=jaVoice;
            synth.cancel();
            synth.speak(utter);
        };

        if(synth.getVoices().length===0){
            synth.addEventListener('voiceschanged',speakNow,{once:true});
            // Some browsers never fire voiceschanged reliably; retry once.
            setTimeout(()=>{ if(!utter.voice) speakNow(); },300);
        }else{
            speakNow();
        }
    }

    function createSpeakerButton(text){
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='speaker-btn';
        btn.setAttribute('aria-label','Play pronunciation');
        btn.title='Play pronunciation';
        btn.textContent='🔊';
        btn.addEventListener('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            speakJapanese(text);
        });
        return btn;
    }

    window.speakJapanese=speakJapanese;
    window.createSpeakerButton=createSpeakerButton;
})();
