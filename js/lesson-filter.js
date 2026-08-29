// =====================================================
// Lesson filter enhancement
// =====================================================
// Lesson 1 is selected by default and an "All Lesson"
// checkbox controls all lesson selections.
// Vocabulary back cards: Romaji → English → Bangla.
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    const oldLessonBtn = document.getElementById("lessonBtn");
    const oldLessonPanel = document.getElementById("lessonPanel");
    if (!oldLessonBtn || !oldLessonPanel || typeof lessonsData === "undefined") return;

    const lessonBtn = oldLessonBtn.cloneNode(true);
    const lessonPanel = oldLessonPanel.cloneNode(false);
    oldLessonBtn.replaceWith(lessonBtn);
    oldLessonPanel.replaceWith(lessonPanel);

    lessonBtn.textContent = "Lesson 1";
    lessonBtn.setAttribute("aria-expanded", "false");

    const allLabel = document.createElement("label");
    const allCheckbox = document.createElement("input");
    allCheckbox.type = "checkbox";
    allCheckbox.value = "all";
    allLabel.appendChild(allCheckbox);
    allLabel.appendChild(document.createTextNode(" All Lesson"));
    lessonPanel.appendChild(allLabel);

    sortedLessonKeys().forEach(key => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = key;
        checkbox.checked = key === "lesson1";
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + lessonLabel(key)));
        lessonPanel.appendChild(label);
    });

    const lessonCheckboxes = () => Array.from(lessonPanel.querySelectorAll("input[type=checkbox][value^='lesson']"));
    const selectedLessons = () => lessonCheckboxes().filter(cb => cb.checked).map(cb => cb.value);

    function updateLessonLabel() {
        const boxes = lessonCheckboxes();
        const selected = selectedLessons();
        lessonBtn.textContent = selected.length === boxes.length ? "All lessons" : selected.length === 0 ? "None" : selected.map(lessonLabel).join(" + ");
    }

    const kana = {"あ":"a","い":"i","う":"u","え":"e","お":"o","か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko","が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go","さ":"sa","し":"shi","す":"su","せ":"se","そ":"so","ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo","た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to","だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do","な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no","は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho","ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo","ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po","ま":"ma","み":"mi","む":"mu","め":"me","も":"mo","や":"ya","ゆ":"yu","よ":"yo","ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro","わ":"wa","を":"o","ん":"n","ア":"a","イ":"i","ウ":"u","エ":"e","オ":"o","カ":"ka","キ":"ki","ク":"ku","ケ":"ke","コ":"ko","ガ":"ga","ギ":"gi","グ":"gu","ゲ":"ge","ゴ":"go","サ":"sa","シ":"shi","ス":"su","セ":"se","ソ":"so","ザ":"za","ジ":"ji","ズ":"zu","ゼ":"ze","ゾ":"zo","タ":"ta","チ":"chi","ツ":"tsu","テ":"te","ト":"to","ダ":"da","ヂ":"ji","ヅ":"zu","デ":"de","ド":"do","ナ":"na","ニ":"ni","ヌ":"nu","ネ":"ne","ノ":"no","ハ":"ha","ヒ":"hi","フ":"fu","ヘ":"he","ホ":"ho","バ":"ba","ビ":"bi","ブ":"bu","ベ":"be","ボ":"bo","パ":"pa","ピ":"pi","プ":"pu","ペ":"pe","ポ":"po","マ":"ma","ミ":"mi","ム":"mu","メ":"me","モ":"mo","ヤ":"ya","ユ":"yu","ヨ":"yo","ラ":"ra","リ":"ri","ル":"ru","レ":"re","ロ":"ro","ワ":"wa","ヲ":"o","ン":"n","ヴ":"vu","ー":"-"};
    const pairs={"きゃ":"kya","きゅ":"kyu","きょ":"kyo","ぎゃ":"gya","ぎゅ":"gyu","ぎょ":"gyo","しゃ":"sha","しゅ":"shu","しょ":"sho","じゃ":"ja","じゅ":"ju","じょ":"jo","ちゃ":"cha","ちゅ":"chu","ちょ":"cho","にゃ":"nya","にゅ":"nyu","にょ":"nyo","ひゃ":"hya","ひゅ":"hyu","ひょ":"hyo","びゃ":"bya","びゅ":"byu","びょ":"byo","ぴゃ":"pya","ぴゅ":"pyu","ぴょ":"pyo","みゃ":"mya","みゅ":"myu","みょ":"myo","りゃ":"rya","りゅ":"ryu","りょ":"ryo","キャ":"kya","キュ":"kyu","キョ":"kyo","ギャ":"gya","ギュ":"gyu","ギョ":"gyo","シャ":"sha","シュ":"shu","ショ":"sho","ジャ":"ja","ジュ":"ju","ジョ":"jo","チャ":"cha","チュ":"chu","チョ":"cho","ニャ":"nya","ニュ":"nyu","ニョ":"nyo","ヒャ":"hya","ヒュ":"hyu","ヒョ":"hyo","ビャ":"bya","ビュ":"byu","ビョ":"byo","ピャ":"pya","ピュ":"pyu","ピョ":"pyo","ミャ":"mya","ミュ":"myu","ミョ":"myo","リャ":"rya","リュ":"ryu","リョ":"ryo"};
    function toRomaji(text){let out="";for(let i=0;i<text.length;i++){const pair=text.slice(i,i+2);if(pairs[pair]){out+=pairs[pair];i++;continue;}const c=text[i];if(c==="っ"||c==="ッ"){const next=kana[text[i+1]]||"";out+=next?next[0]:"";}else out+=kana[c]!==undefined?kana[c]:c;}return out.replace(/\s+/g," ").trim();}

    const bn={"I":"আমি","you":"তুমি / আপনি","student":"ছাত্র / শিক্ষার্থী","company employee":"কোম্পানির কর্মচারী","bank employee":"ব্যাংকের কর্মচারী","[medical] doctor":"ডাক্তার","researcher, scholar":"গবেষক","university":"বিশ্ববিদ্যালয়","hospital":"হাসপাতাল","yes":"হ্যাঁ","no":"না","~ years old":"~ বছর বয়স","how old (おいくつ is the polite form of なんさい)":"কত বছর বয়স","U.S.A.":"যুক্তরাষ্ট্র","U.K.":"যুক্তরাজ্য","India":"ভারত","Indonesia":"ইন্দোনেশিয়া","South Korea":"দক্ষিণ কোরিয়া","Thailand":"থাইল্যান্ড","China":"চীন","Germany":"জার্মানি","Japan":"জাপান","Brazil":"ব্রাজিল","this (thing here)":"এটি / এটা","that (thing near the listener)":"সেটি / ওটা","that (thing over there)":"ওটি / ওটা","book":"বই","dictionary":"অভিধান","magazine":"ম্যাগাজিন","newspaper":"সংবাদপত্র","notebook":"নোটবুক","business card":"ব্যবসায়িক কার্ড","(credit) card":"(ক্রেডিট) কার্ড","pencil":"পেন্সিল","ballpoint pen":"বলপেন","key":"চাবি","watch, clock":"ঘড়ি","umbrella":"ছাতা","bag, briefcase":"ব্যাগ / ব্রিফকেস","television":"টেলিভিশন","radio":"রেডিও","camera":"ক্যামেরা","computer":"কম্পিউটার","car, vehicle":"গাড়ি / যানবাহন","desk":"ডেস্ক","chair":"চেয়ার","chocolate":"চকলেট","coffee":"কফি"};
    function banglaMeaning(item){return item.bn||bn[item.en]||"বাংলা অর্থ যোগ করা হবে";}

    function renderLessons(){
        const grid=document.getElementById("grid"),mode=document.getElementById("mode"),typePanel=document.getElementById("typePanel");
        if(!grid||!mode||!typePanel)return;
        const types=Array.from(typePanel.querySelectorAll("input[type=checkbox]:checked")).map(cb=>cb.value);
        let cards=[];selectedLessons().forEach(key=>{cards=cards.concat(buildLessonCards(key).filter(card=>types.includes(card.type)));});
        if(mode.value==="shuffle")shuffle(cards);
        grid.innerHTML="";const frag=document.createDocumentFragment();
        cards.forEach(item=>{
            const card=document.createElement("div");card.className="card"+(item.type==="grammar"?" grammar":"");
            const romaji=toRomaji(item.jp||"");card.__lessonItem=item;card.__lessonItem.romaji=romaji;card.__teacherBangla=banglaMeaning(item);card.dataset.romaji=romaji;
            const tag=`${item.lesson} · ${item.type==="grammar"?"Grammar":"Vocabulary"}`;const isVocab=item.type==="vocabulary"||item.type==="cpart"||item.type==="country";const frontText=showJapaneseFirst?item.jp:(isVocab?romaji:item.en);
            if(isVocab){const hideRomaji=window.lessonBackRomajiVisible===false;card.innerHTML=`<div class="inner"><div class="front"><span class="lesson-tag">${tag}</span><div>${frontText}</div></div><div class="back vocabulary-back"><span class="romaji" style="display:${hideRomaji?'none':''}">${romaji}</span><span class="english">${item.en}</span><span class="bangla">${banglaMeaning(item)}</span></div></div>`;}else{const backText=showJapaneseFirst?item.en:item.jp;card.innerHTML=`<div class="inner"><div class="front"><span class="lesson-tag">${tag}</span><div>${frontText}</div></div><div class="back"><span class="lesson-tag">${tag}</span><div>${backText}</div></div>`;}
            card.addEventListener("click",()=>card.classList.toggle("flipped"));const speakText=isVocab?item.jp:cleanForSpeech(item.jp);if(speakText&&isSpeakableJapanese(speakText))card.appendChild(createSpeakerButton(speakText));frag.appendChild(card);
        });
        grid.appendChild(frag);const counter=document.getElementById("cardCount");if(counter)counter.textContent=`Showing ${cards.length} cards`;document.dispatchEvent(new CustomEvent("lessonCardsRendered"));
    }

    function rerenderAfterLessonData(){updateLessonLabel();renderLessons();}
    document.addEventListener("lessonDataLoaded",rerenderAfterLessonData);

    lessonBtn.addEventListener("click",e=>{e.stopPropagation();const open=lessonPanel.classList.contains("open");document.querySelectorAll(".multiselect-panel.open").forEach(p=>p.classList.remove("open"));lessonPanel.classList.toggle("open",!open);lessonBtn.setAttribute("aria-expanded",String(!open));});
    allCheckbox.addEventListener("change",()=>{lessonCheckboxes().forEach(cb=>cb.checked=allCheckbox.checked);updateLessonLabel();window.lessonLoader?.syncSelectedLessons();});
    lessonCheckboxes().forEach(cb=>cb.addEventListener("change",()=>{const boxes=lessonCheckboxes();allCheckbox.checked=boxes.length>0&&boxes.every(box=>box.checked);updateLessonLabel();window.lessonLoader?.syncSelectedLessons();}));
    document.addEventListener("click",e=>{if(!lessonPanel.contains(e.target)&&e.target!==lessonBtn){lessonPanel.classList.remove("open");lessonBtn.setAttribute("aria-expanded","false");}});
    document.getElementById("mode")?.addEventListener("change",renderLessons);document.getElementById("shuffleBtn")?.addEventListener("click",renderLessons);document.getElementById("typePanel")?.addEventListener("change",renderLessons);document.getElementById("direction")?.addEventListener("click",renderLessons);
    updateLessonLabel();renderLessons();
});
