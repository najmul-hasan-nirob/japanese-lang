
const hiraganaChars = [

    // =========================
    // Basic
    // =========================

    {jp:"あ",en:"a",type:"basic"},
    {jp:"い",en:"i",type:"basic"},
    {jp:"う",en:"u",type:"basic"},
    {jp:"え",en:"e",type:"basic"},
    {jp:"お",en:"o",type:"basic"},

    {jp:"か",en:"ka",type:"basic"},
    {jp:"き",en:"ki",type:"basic"},
    {jp:"く",en:"ku",type:"basic"},
    {jp:"け",en:"ke",type:"basic"},
    {jp:"こ",en:"ko",type:"basic"},

    {jp:"さ",en:"sa",type:"basic"},
    {jp:"し",en:"shi",type:"basic"},
    {jp:"す",en:"su",type:"basic"},
    {jp:"せ",en:"se",type:"basic"},
    {jp:"そ",en:"so",type:"basic"},

    {jp:"た",en:"ta",type:"basic"},
    {jp:"ち",en:"chi",type:"basic"},
    {jp:"つ",en:"tsu",type:"basic"},
    {jp:"て",en:"te",type:"basic"},
    {jp:"と",en:"to",type:"basic"},

    {jp:"な",en:"na",type:"basic"},
    {jp:"に",en:"ni",type:"basic"},
    {jp:"ぬ",en:"nu",type:"basic"},
    {jp:"ね",en:"ne",type:"basic"},
    {jp:"の",en:"no",type:"basic"},

    {jp:"は",en:"ha",type:"basic"},
    {jp:"ひ",en:"hi",type:"basic"},
    {jp:"ふ",en:"fu",type:"basic"},
    {jp:"へ",en:"he",type:"basic"},
    {jp:"ほ",en:"ho",type:"basic"},

    {jp:"ま",en:"ma",type:"basic"},
    {jp:"み",en:"mi",type:"basic"},
    {jp:"む",en:"mu",type:"basic"},
    {jp:"め",en:"me",type:"basic"},
    {jp:"も",en:"mo",type:"basic"},

    {jp:"や",en:"ya",type:"basic"},
    {jp:"ゆ",en:"yu",type:"basic"},
    {jp:"よ",en:"yo",type:"basic"},

    {jp:"ら",en:"ra",type:"basic"},
    {jp:"り",en:"ri",type:"basic"},
    {jp:"る",en:"ru",type:"basic"},
    {jp:"れ",en:"re",type:"basic"},
    {jp:"ろ",en:"ro",type:"basic"},

    {jp:"わ",en:"wa",type:"basic"},
    {jp:"を",en:"wo",type:"basic"},
    {jp:"ん",en:"n",type:"basic"},

    // =========================
    // Dakuten
    // =========================

    {jp:"が",en:"ga",type:"dakuten"},
    {jp:"ぎ",en:"gi",type:"dakuten"},
    {jp:"ぐ",en:"gu",type:"dakuten"},
    {jp:"げ",en:"ge",type:"dakuten"},
    {jp:"ご",en:"go",type:"dakuten"},

    {jp:"ざ",en:"za",type:"dakuten"},
    {jp:"じ",en:"ji",type:"dakuten"},
    {jp:"ず",en:"zu",type:"dakuten"},
    {jp:"ぜ",en:"ze",type:"dakuten"},
    {jp:"ぞ",en:"zo",type:"dakuten"},

    {jp:"だ",en:"da",type:"dakuten"},
    {jp:"ぢ",en:"ji",type:"dakuten"},
    {jp:"づ",en:"zu",type:"dakuten"},
    {jp:"で",en:"de",type:"dakuten"},
    {jp:"ど",en:"do",type:"dakuten"},

    {jp:"ば",en:"ba",type:"dakuten"},
    {jp:"び",en:"bi",type:"dakuten"},
    {jp:"ぶ",en:"bu",type:"dakuten"},
    {jp:"べ",en:"be",type:"dakuten"},
    {jp:"ぼ",en:"bo",type:"dakuten"},

    // =========================
    // Handakuten
    // =========================

    {jp:"ぱ",en:"pa",type:"handakuten"},
    {jp:"ぴ",en:"pi",type:"handakuten"},
    {jp:"ぷ",en:"pu",type:"handakuten"},
    {jp:"ぺ",en:"pe",type:"handakuten"},
    {jp:"ぽ",en:"po",type:"handakuten"},

    // =========================
    // Yoon
    // =========================

    {jp:"きゃ",en:"kya",type:"yoon"},
    {jp:"きゅ",en:"kyu",type:"yoon"},
    {jp:"きょ",en:"kyo",type:"yoon"},

    {jp:"ぎゃ",en:"gya",type:"yoon"},
    {jp:"ぎゅ",en:"gyu",type:"yoon"},
    {jp:"ぎょ",en:"gyo",type:"yoon"},

    {jp:"しゃ",en:"sha",type:"yoon"},
    {jp:"しゅ",en:"shu",type:"yoon"},
    {jp:"しょ",en:"sho",type:"yoon"},

    {jp:"じゃ",en:"ja",type:"yoon"},
    {jp:"じゅ",en:"ju",type:"yoon"},
    {jp:"じょ",en:"jo",type:"yoon"},

    {jp:"ちゃ",en:"cha",type:"yoon"},
    {jp:"ちゅ",en:"chu",type:"yoon"},
    {jp:"ちょ",en:"cho",type:"yoon"},

    {jp:"にゃ",en:"nya",type:"yoon"},
    {jp:"にゅ",en:"nyu",type:"yoon"},
    {jp:"にょ",en:"nyo",type:"yoon"},

    {jp:"ひゃ",en:"hya",type:"yoon"},
    {jp:"ひゅ",en:"hyu",type:"yoon"},
    {jp:"ひょ",en:"hyo",type:"yoon"},

    {jp:"びゃ",en:"bya",type:"yoon"},
    {jp:"びゅ",en:"byu",type:"yoon"},
    {jp:"びょ",en:"byo",type:"yoon"},

    {jp:"ぴゃ",en:"pya",type:"yoon"},
    {jp:"ぴゅ",en:"pyu",type:"yoon"},
    {jp:"ぴょ",en:"pyo",type:"yoon"},

    {jp:"みゃ",en:"mya",type:"yoon"},
    {jp:"みゅ",en:"myu",type:"yoon"},
    {jp:"みょ",en:"myo",type:"yoon"},

    {jp:"りゃ",en:"rya",type:"yoon"},
    {jp:"りゅ",en:"ryu",type:"yoon"},
    {jp:"りょ",en:"ryo",type:"yoon"}

];

const katakanaChars = [

    // =========================
    // Basic
    // =========================

    {jp:"ア",en:"a",type:"basic"},
    {jp:"イ",en:"i",type:"basic"},
    {jp:"ウ",en:"u",type:"basic"},
    {jp:"エ",en:"e",type:"basic"},
    {jp:"オ",en:"o",type:"basic"},

    {jp:"カ",en:"ka",type:"basic"},
    {jp:"キ",en:"ki",type:"basic"},
    {jp:"ク",en:"ku",type:"basic"},
    {jp:"ケ",en:"ke",type:"basic"},
    {jp:"コ",en:"ko",type:"basic"},

    {jp:"サ",en:"sa",type:"basic"},
    {jp:"シ",en:"shi",type:"basic"},
    {jp:"ス",en:"su",type:"basic"},
    {jp:"セ",en:"se",type:"basic"},
    {jp:"ソ",en:"so",type:"basic"},

    {jp:"タ",en:"ta",type:"basic"},
    {jp:"チ",en:"chi",type:"basic"},
    {jp:"ツ",en:"tsu",type:"basic"},
    {jp:"テ",en:"te",type:"basic"},
    {jp:"ト",en:"to",type:"basic"},

    {jp:"ナ",en:"na",type:"basic"},
    {jp:"ニ",en:"ni",type:"basic"},
    {jp:"ヌ",en:"nu",type:"basic"},
    {jp:"ネ",en:"ne",type:"basic"},
    {jp:"ノ",en:"no",type:"basic"},

    {jp:"ハ",en:"ha",type:"basic"},
    {jp:"ヒ",en:"hi",type:"basic"},
    {jp:"フ",en:"fu",type:"basic"},
    {jp:"ヘ",en:"he",type:"basic"},
    {jp:"ホ",en:"ho",type:"basic"},

    {jp:"マ",en:"ma",type:"basic"},
    {jp:"ミ",en:"mi",type:"basic"},
    {jp:"ム",en:"mu",type:"basic"},
    {jp:"メ",en:"me",type:"basic"},
    {jp:"モ",en:"mo",type:"basic"},

    {jp:"ヤ",en:"ya",type:"basic"},
    {jp:"ユ",en:"yu",type:"basic"},
    {jp:"ヨ",en:"yo",type:"basic"},

    {jp:"ラ",en:"ra",type:"basic"},
    {jp:"リ",en:"ri",type:"basic"},
    {jp:"ル",en:"ru",type:"basic"},
    {jp:"レ",en:"re",type:"basic"},
    {jp:"ロ",en:"ro",type:"basic"},

    {jp:"ワ",en:"wa",type:"basic"},
    {jp:"ヲ",en:"wo",type:"basic"},
    {jp:"ン",en:"n",type:"basic"},

    // =========================
    // Dakuten
    // =========================

    {jp:"ガ",en:"ga",type:"dakuten"},
    {jp:"ギ",en:"gi",type:"dakuten"},
    {jp:"グ",en:"gu",type:"dakuten"},
    {jp:"ゲ",en:"ge",type:"dakuten"},
    {jp:"ゴ",en:"go",type:"dakuten"},

    {jp:"ザ",en:"za",type:"dakuten"},
    {jp:"ジ",en:"ji",type:"dakuten"},
    {jp:"ズ",en:"zu",type:"dakuten"},
    {jp:"ゼ",en:"ze",type:"dakuten"},
    {jp:"ゾ",en:"zo",type:"dakuten"},

    {jp:"ダ",en:"da",type:"dakuten"},
    {jp:"ヂ",en:"ji",type:"dakuten"},
    {jp:"ヅ",en:"zu",type:"dakuten"},
    {jp:"デ",en:"de",type:"dakuten"},
    {jp:"ド",en:"do",type:"dakuten"},

    {jp:"バ",en:"ba",type:"dakuten"},
    {jp:"ビ",en:"bi",type:"dakuten"},
    {jp:"ブ",en:"bu",type:"dakuten"},
    {jp:"ベ",en:"be",type:"dakuten"},
    {jp:"ボ",en:"bo",type:"dakuten"},

    // =========================
    // Handakuten
    // =========================

    {jp:"パ",en:"pa",type:"handakuten"},
    {jp:"ピ",en:"pi",type:"handakuten"},
    {jp:"プ",en:"pu",type:"handakuten"},
    {jp:"ペ",en:"pe",type:"handakuten"},
    {jp:"ポ",en:"po",type:"handakuten"},

    // =========================
    // Yoon
    // =========================

    {jp:"キャ",en:"kya",type:"yoon"},
    {jp:"キュ",en:"kyu",type:"yoon"},
    {jp:"キョ",en:"kyo",type:"yoon"},

    {jp:"ギャ",en:"gya",type:"yoon"},
    {jp:"ギュ",en:"gyu",type:"yoon"},
    {jp:"ギョ",en:"gyo",type:"yoon"},

    {jp:"シャ",en:"sha",type:"yoon"},
    {jp:"シュ",en:"shu",type:"yoon"},
    {jp:"ショ",en:"sho",type:"yoon"},

    {jp:"ジャ",en:"ja",type:"yoon"},
    {jp:"ジュ",en:"ju",type:"yoon"},
    {jp:"ジョ",en:"jo",type:"yoon"},

    {jp:"チャ",en:"cha",type:"yoon"},
    {jp:"チュ",en:"chu",type:"yoon"},
    {jp:"チョ",en:"cho",type:"yoon"},

    {jp:"ニャ",en:"nya",type:"yoon"},
    {jp:"ニュ",en:"nyu",type:"yoon"},
    {jp:"ニョ",en:"nyo",type:"yoon"},

    {jp:"ヒャ",en:"hya",type:"yoon"},
    {jp:"ヒュ",en:"hyu",type:"yoon"},
    {jp:"ヒョ",en:"hyo",type:"yoon"},

    {jp:"ビャ",en:"bya",type:"yoon"},
    {jp:"ビュ",en:"byu",type:"yoon"},
    {jp:"ビョ",en:"byo",type:"yoon"},

    {jp:"ピャ",en:"pya",type:"yoon"},
    {jp:"ピュ",en:"pyu",type:"yoon"},
    {jp:"ピョ",en:"pyo",type:"yoon"},

    {jp:"ミャ",en:"mya",type:"yoon"},
    {jp:"ミュ",en:"myu",type:"yoon"},
    {jp:"ミョ",en:"myo",type:"yoon"},

    {jp:"リャ",en:"rya",type:"yoon"},
    {jp:"リュ",en:"ryu",type:"yoon"},
    {jp:"リョ",en:"ryo",type:"yoon"}

];

function shuffle(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
}

const grid=document.getElementById("grid");
const mode = document.getElementById("mode");

const directionToggle = document.getElementById("direction");
const labelLeft = directionToggle.querySelector(".left");
const labelRight = directionToggle.querySelector(".right");

// This page uses the shared header toggle for "kana" vs "romaji"
labelLeft.textContent = "Kana";
labelRight.textContent = "Romaji";

let showKanaFirst = true;

const gojuonRows = [
    ["a","i","u","e","o"],
    ["ka","ki","ku","ke","ko"],
    ["sa","shi","su","se","so"],
    ["ta","chi","tsu","te","to"],
    ["na","ni","nu","ne","no"],
    ["ha","hi","fu","he","ho"],
    ["ma","mi","mu","me","mo"],
    ["ya",null,"yu",null,"yo"],
    ["ra","ri","ru","re","ro"],
    ["wa",null,null,null,"wo"],
    ["n",null,null,null,null]
];

const yoonRows = [
    ["kya","kyu","kyo"],
    ["gya","gyu","gyo"],
    ["sha","shu","sho"],
    ["ja","ju","jo"],
    ["cha","chu","cho"],
    ["nya","nyu","nyo"],
    ["hya","hyu","hyo"],
    ["bya","byu","byo"],
    ["pya","pyu","pyo"],
    ["mya","myu","myo"],
    ["rya","ryu","ryo"]
];

// =====================
// Generic multi-select dropdown
// =====================

function setupMultiselect(btn, panel, allLabel, onChange){

    const checkboxes = Array.from(panel.querySelectorAll("input[type=checkbox]"));

    function getSelected(){
        return checkboxes.filter(cb=>cb.checked).map(cb=>cb.value);
    }

    function updateLabel(){

        const selected = getSelected();

        if(selected.length === checkboxes.length){
            btn.textContent = allLabel;
        }else if(selected.length === 0){
            btn.textContent = "None";
        }else{
            const names = selected.map(v=>{
                const lbl = panel.querySelector(`input[value="${v}"]`).closest("label").textContent.trim();
                return lbl;
            });
            btn.textContent = names.join(" + ");
        }

    }

    btn.addEventListener("click",(e)=>{
        e.stopPropagation();
        const isOpen = panel.classList.contains("open");
        document.querySelectorAll(".multiselect-panel.open").forEach(p=>p.classList.remove("open"));
        if(!isOpen){
            panel.classList.add("open");
            btn.setAttribute("aria-expanded","true");
        }else{
            btn.setAttribute("aria-expanded","false");
        }
    });

    checkboxes.forEach(cb=>{
        cb.addEventListener("change",()=>{

            // enforce at least one checked
            if(getSelected().length === 0){
                cb.checked = true;
                return;
            }

            updateLabel();
            onChange();

        });
    });

    document.addEventListener("click",(e)=>{
        if(!panel.contains(e.target) && e.target !== btn){
            panel.classList.remove("open");
            btn.setAttribute("aria-expanded","false");
        }
    });

    updateLabel();

    return { getSelected };

}

const scriptBtn = document.getElementById("scriptBtn");
const scriptPanel = document.getElementById("scriptPanel");
const typeBtn = document.getElementById("typeBtn");
const typePanel = document.getElementById("typePanel");

const scriptMulti = setupMultiselect(scriptBtn, scriptPanel, "Hiragana + Katakana", ()=>render());
const typeMulti = setupMultiselect(typeBtn, typePanel, "All types", ()=>render());

function render(){

    grid.innerHTML="";

    const selectedScripts = scriptMulti.getSelected();
    const selectedTypes = typeMulti.getSelected();

    const useTableLayout =
        selectedScripts.length === 1 &&
        selectedTypes.length === 1 &&
        selectedTypes[0] === "basic" &&
        mode.value === "normal";

    const useYoonLayout =
        selectedScripts.length === 1 &&
        selectedTypes.length === 1 &&
        selectedTypes[0] === "yoon" &&
        mode.value === "normal";

    grid.classList.toggle("table-mode", useTableLayout);
    grid.classList.toggle("yoon-mode", useYoonLayout);

    if(useTableLayout || useYoonLayout){

        const source = selectedScripts[0] === "katakana" ? katakanaChars : hiraganaChars;
        const rows = useTableLayout ? gojuonRows : yoonRows;
        const wantedType = useTableLayout ? "basic" : "yoon";

        const lookup = {};
        source.filter(c=>c.type===wantedType).forEach(c=>{ lookup[c.en]=c; });

        rows.forEach(row=>{
            row.forEach(code=>{

                const card=document.createElement("div");

                if(code===null || !lookup[code]){
                    card.className="card blank";
                    grid.appendChild(card);
                    return;
                }

                const item=lookup[code];

                card.className="card";

                const frontText = showKanaFirst ? item.jp : item.en;
                const backText = showKanaFirst ? item.en : item.jp;

                card.innerHTML=`
                    <div class="inner">
                        <div class="front">${frontText}</div>
                        <div class="back">${backText}</div>
                    </div>
                `;

                card.addEventListener("click",()=>{
                    card.classList.toggle("flipped");
                });

                card.appendChild(createSpeakerButton(item.jp));

                grid.appendChild(card);

            });
        });

        return;
    }

    let cards = [];

    if(selectedScripts.includes("hiragana")){
        cards = cards.concat(hiraganaChars.filter(c=>selectedTypes.includes(c.type)));
    }
    if(selectedScripts.includes("katakana")){
        cards = cards.concat(katakanaChars.filter(c=>selectedTypes.includes(c.type)));
    }

    if(mode.value==="shuffle"){
        shuffle(cards);
    }

    cards.forEach(item=>{

        const card=document.createElement("div");

        card.className="card";

        const frontText = showKanaFirst ? item.jp : item.en;
        const backText = showKanaFirst ? item.en : item.jp;

        card.innerHTML=`
            <div class="inner">
                <div class="front">${frontText}</div>
                <div class="back">${backText}</div>
            </div>
        `;

        card.addEventListener("click",()=>{
            card.classList.toggle("flipped");
        });

        card.appendChild(createSpeakerButton(item.jp));

        grid.appendChild(card);

    });

}

render();

// =====================
// Controls
// =====================

mode.addEventListener("change",render);

const shuffleBtn = document.getElementById("shuffleBtn");

shuffleBtn.addEventListener("click", () => {
    mode.value = "shuffle";
    render();
});

function toggleDirection(){

    showKanaFirst = !showKanaFirst;

    directionToggle.classList.toggle("right", !showKanaFirst);
    directionToggle.setAttribute("aria-pressed", String(!showKanaFirst));

    labelLeft.classList.toggle("active", showKanaFirst);
    labelRight.classList.toggle("active", !showKanaFirst);

    render();

}

directionToggle.addEventListener("click",toggleDirection);
directionToggle.addEventListener("keydown",(e)=>{
    if(e.key==="Enter" || e.key===" "){
        e.preventDefault();
        toggleDirection();
    }
});