// Adaptive spaced-repetition Practice — local device + cloud sync via Supabase.
(() => {
    const STORAGE = "japanese-lang-spaced-repetition-v1";
    const HARD_STORAGE = "japanese-lang-hard-vocabulary";
    const LESSON_FILTER_STORAGE = "japanese-lang-practice-lessons-v1";
    const LEARNING_AGAIN = 10 * 60 * 1000;
    const MIN_HARD = 1;
    const MIN_GOOD = 3;
    const MIN_EASY = 7;
    const MAX_INTERVAL = 3650;
    let state = loadState(), queue = [], index = 0, answered = 0, practiceMode = "due";
    let selectedLessons = loadLessonSelection();

    function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE)||"{}");}catch(_){return {};}}
    function saveState(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch(_){} }
    function hardWords(){try{const a=JSON.parse(localStorage.getItem(HARD_STORAGE)||"[]");return new Set(Array.isArray(a)?a:[]);}catch(_){return new Set();}}
    function saveHardWords(set){try{localStorage.setItem(HARD_STORAGE,JSON.stringify(Array.from(set)));}catch(_){} }
    function loadLessonSelection(){try{const saved=JSON.parse(localStorage.getItem(LESSON_FILTER_STORAGE)||"null");return Array.isArray(saved)?saved:[];}catch(_){return [];}}
    function saveLessonSelection(){try{localStorage.setItem(LESSON_FILTER_STORAGE,JSON.stringify(selectedLessons));}catch(_){} }
    function allLessonKeys(){if(typeof lessonsData==="undefined"||typeof sortedLessonKeys!=="function")return [];return sortedLessonKeys();}
    function allVocabulary(){
        if(typeof lessonsData==="undefined"||typeof sortedLessonKeys!=="function")return[];
        const out=[];
        sortedLessonKeys().forEach(key=>{const lesson=lessonsData[key];if(!lesson)return;["vocabulary","cpart","country"].forEach(type=>{
            (Array.isArray(lesson[type])?lesson[type]:[]).forEach(item=>{if(!item||!item.jp)return;const entry={...item,type,lesson:lessonLabel(key),lessonKey:key};const romaji=item.romaji||"";entry.id=`${key}|${type}|${item.jp}|${item.en||""}`;entry.cardKey=[item.jp.trim(),romaji.trim(),(item.en||"").trim()].join("|");out.push(entry);});
        });});return out;
    }
    function selectedItems(items){if(!selectedLessons.length)return[];const selected=new Set(selectedLessons);return items.filter(item=>selected.has(item.lessonKey));}
    function dueItems(){const t=Date.now();return selectedItems(allVocabulary()).filter(item=>{const r=state[item.id];return !r||!r.nextReview||r.nextReview<=t;});}
    function newItems(){return selectedItems(allVocabulary()).filter(item=>!state[item.id]?.repetitions);}
    function hardItems(){const h=hardWords();return selectedItems(allVocabulary()).filter(item=>h.has(item.cardKey));}
    function getRecord(item){
        if(!state[item.id])state[item.id]={interval:0,repetitions:0,correct:0,incorrect:0,lapses:0,ease:2.5,nextReview:0};
        const r=state[item.id];
        if(typeof r.ease!=="number"||r.ease<1.3)r.ease=2.5;
        if(typeof r.interval!=="number"||r.interval<0)r.interval=0;
        if(typeof r.repetitions!=="number")r.repetitions=0;
        if(typeof r.lapses!=="number")r.lapses=0;
        return r;
    }
    function clampInterval(days){return Math.min(MAX_INTERVAL,Math.max(0,days));}
    function formatInterval(msOrDays, compact=false){
        if(typeof msOrDays==="number" && msOrDays < 1){
            const minutes=Math.max(1,Math.round(msOrDays*24*60));
            return `${minutes} min`;
        }
        const days=typeof msOrDays==="number"?msOrDays:0;
        if(days<1)return "10 min";
        if(days<30)return `${Math.max(1,Math.round(days))} day${Math.round(days)===1?"":"s"}`;
        if(days<365){const months=Math.max(1,Math.round(days/30));return `${months} mo`+ (months===1?"":"s");}
        const years=Math.max(1,Math.round(days/365));return `${years} yr`+(years===1?"":"s");
    }
    function previewIntervals(item){
        const r=getRecord(item),old=Number(r.interval)||0,ease=Number(r.ease)||2.5;
        return {
            again:"10 min",
            hard:formatInterval(Math.max(MIN_HARD,old?old*0.8:MIN_HARD)),
            good:formatInterval(Math.max(MIN_GOOD,old?old*ease:MIN_GOOD)),
            easy:formatInterval(Math.max(MIN_EASY,old?old*ease*1.3:MIN_EASY))
        };
    }
    function updateRatingLabels(item){
        const times=previewIntervals(item);
        document.querySelectorAll("#ratingButtons button").forEach(btn=>{
            const small=btn.querySelector("small");if(!small)return;
            const kind=btn.dataset.rating;small.textContent=times[kind]||"";
        });
    }
    function updateStats(){
        const due=dueItems().length,fresh=newItems().length,hard=hardItems().length;
        document.getElementById("dueCount").textContent=due;document.getElementById("newCount").textContent=fresh;document.getElementById("hardCount").textContent=hard;
        const summary=document.getElementById("startSummary");
        if(!selectedLessons.length){summary.textContent="Select at least one lesson to start practicing.";return;}
        const labels=selectedLessons.length===allLessonKeys().length?"all lessons":selectedLessons.map(key=>lessonLabel(key)).join(", ");
        if(practiceMode==="hard")summary.textContent=hard?`${hard} hard ${hard===1?"word":"words"} from ${labels} are ready to practice.`:`No saved hard vocabulary in ${labels}.`;
        else summary.textContent=due?`${due} vocabulary ${due===1?"card is":"cards are"} ready for review from ${labels}.`:`No reviews are due right now in ${labels}. You have ${fresh} new ${fresh===1?"word":"words"}.`;
    }
    function renderLessonChoices(){
        const container=document.getElementById("lessonChoices");if(!container)return;const keys=allLessonKeys();
        container.innerHTML=keys.map(key=>{const checked=selectedLessons.includes(key)?" checked":"";return `<label class="lesson-choice"><input type="checkbox" value="${key}"${checked}><span>${lessonLabel(key)}</span></label>`;}).join("");
        container.querySelectorAll("input[type=checkbox]").forEach(input=>input.addEventListener("change",()=>{selectedLessons=Array.from(container.querySelectorAll("input:checked")).map(box=>box.value);saveLessonSelection();updateStats();}));
    }
    function renderCard(){
        const item=queue[index];
        if(!item)return finish();
        document.getElementById("practiceLesson").textContent=item.lesson;
        document.getElementById("practiceJapanese").textContent=item.jp;
        document.getElementById("practiceRomaji").textContent=item.romaji||"";
        document.getElementById("practiceEnglish").textContent=item.en||"";
        document.getElementById("practiceBangla").textContent=item.bn||"";
        document.getElementById("practiceIllustration").innerHTML="";
        document.getElementById("practiceAnswer").hidden=true;
        document.getElementById("ratingButtons").hidden=true;
        document.getElementById("showAnswer").hidden=false;
        document.getElementById("progressText").textContent=`${index+1} / ${queue.length}`;
        document.querySelector("#progressBar i").style.width=`${((index+1)/queue.length)*100}%`;
        const hardSet=hardWords();
        const star=document.getElementById("hardStar");
        if(star){
            const saved=hardSet.has(item.cardKey);
            star.classList.toggle("removed",!saved);
            star.textContent=saved?"★":"☆";
            star.setAttribute("aria-label",saved?"Remove from Hard vocabulary":"This card is not in Hard vocabulary");
            star.title=saved?"Remove from Hard vocabulary":"Not saved as Hard";
        }
        updateRatingLabels(item);
        const previous=document.getElementById("previousReview"),next=document.getElementById("nextReview");
        if(previous)previous.disabled=index<=0;
        if(next)next.disabled=index>=queue.length-1;
    }
    function speak(item){if(typeof window.speakJapanese==="function")window.speakJapanese(item.jp);else if("speechSynthesis"in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(item.jp);u.lang="ja-JP";speechSynthesis.speak(u);}}
    function showAnswer(){document.getElementById("practiceAnswer").hidden=false;document.getElementById("showAnswer").hidden=true;document.getElementById("ratingButtons").hidden=false;}
    function rate(kind){
        const item=queue[index];if(!item)return;
        const r=getRecord(item),old=Number(r.interval)||0,ease=Number(r.ease)||2.5;
        r.lastReviewed=Date.now();
        if(kind==="again"){
            r.incorrect=(r.incorrect||0)+1;r.lapses=(r.lapses||0)+1;r.repetitions=0;r.interval=0;r.ease=Math.max(1.3,ease-0.2);r.nextReview=Date.now()+LEARNING_AGAIN;
        } else if(kind==="hard"){
            r.correct=(r.correct||0)+1;r.repetitions=(r.repetitions||0)+1;r.ease=Math.max(1.3,ease-0.15);r.interval=clampInterval(Math.max(MIN_HARD,old?old*0.8:MIN_HARD));r.nextReview=Date.now()+r.interval*86400000;
        } else if(kind==="good"){
            r.correct=(r.correct||0)+1;r.repetitions=(r.repetitions||0)+1;r.ease=Math.max(1.3,ease);r.interval=clampInterval(Math.max(MIN_GOOD,old?old*r.ease:MIN_GOOD));r.nextReview=Date.now()+r.interval*86400000;
        } else if(kind==="easy"){
            r.correct=(r.correct||0)+1;r.repetitions=(r.repetitions||0)+1;r.ease=Math.min(3.5,ease+0.15);r.interval=clampInterval(Math.max(MIN_EASY,old?old*r.ease*1.3:MIN_EASY));r.nextReview=Date.now()+r.interval*86400000;
        }
        saveState();answered++;index++;renderCard();updateStats();
        window.dispatchEvent(new CustomEvent("japaneseLangPracticeChanged"));
    }
    function removeFromHard(){
        const item=queue[index];if(!item)return;
        const hardSet=hardWords();
        if(!hardSet.has(item.cardKey))return;
        hardSet.delete(item.cardKey);saveHardWords(hardSet);
        queue.splice(index,1);
        if(index>=queue.length)index=queue.length-1;
        updateStats();
        if(!queue.length){finish();return;}
        renderCard();
    }
    function start(){
        if(!selectedLessons.length){updateStats();return;}
        if(practiceMode==="hard")queue=hardItems().slice().sort(()=>Math.random()-.5);
        else{queue=dueItems().slice().sort(()=>Math.random()-.5);if(!queue.length)queue=newItems().slice(0,10).sort(()=>Math.random()-.5);}
        index=0;answered=0;document.getElementById("practiceStart").hidden=true;document.getElementById("practiceDone").hidden=true;document.getElementById("practiceCard").hidden=false;
        if(!queue.length){finish();return;}renderCard();
    }
    function finish(){document.getElementById("practiceCard").hidden=true;document.getElementById("practiceDone").hidden=false;document.getElementById("doneSummary").textContent=answered?`You reviewed ${answered} ${answered===1?"card":"cards"}. Your next reviews have been scheduled.`:practiceMode==="hard"?"There are no saved hard vocabulary cards in the selected lessons.":"There are no cards ready to review yet.";updateStats();}
    document.addEventListener("DOMContentLoaded",()=>{
        if(!document.getElementById("practiceCard"))return;
        renderLessonChoices();updateStats();
        window.addEventListener("japaneseLangCloudLoaded",()=>{ state=loadState();updateStats(); });
        document.getElementById("startPractice").addEventListener("click",()=>{practiceMode="due";start();});
        document.getElementById("hardPractice").addEventListener("click",()=>{practiceMode="hard";updateStats();start();});
        document.getElementById("restartPractice").addEventListener("click",start);
        document.getElementById("showAnswer").addEventListener("click",showAnswer);
        document.getElementById("practiceSpeak").addEventListener("click",()=>{if(queue[index])speak(queue[index]);});
        document.getElementById("hardStar").addEventListener("click",removeFromHard);
        document.getElementById("previousReview").addEventListener("click",()=>{if(index>0){index--;renderCard();}});
        document.getElementById("nextReview").addEventListener("click",()=>{if(index<queue.length-1){index++;renderCard();}});
        document.querySelectorAll("#ratingButtons button").forEach(btn=>btn.addEventListener("click",()=>rate(btn.dataset.rating)));
        document.getElementById("selectAllLessons").addEventListener("click",()=>{selectedLessons=allLessonKeys();saveLessonSelection();renderLessonChoices();updateStats();});
        document.getElementById("clearLessons").addEventListener("click",()=>{selectedLessons=[];saveLessonSelection();renderLessonChoices();updateStats();});
    });
})();
