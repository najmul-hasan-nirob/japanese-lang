function numberToRomaji(n){

    if(n===0) return "zero";

    let remainder = n;

    const man = Math.floor(remainder/10000); remainder%=10000;
    const sen = Math.floor(remainder/1000); remainder%=1000;
    const hyaku = Math.floor(remainder/100); remainder%=100;
    const juu = Math.floor(remainder/10); remainder%=10;
    const ichi = remainder;

    const digitWords = ["","ichi","ni","san","yon","go","roku","nana","hachi","kyuu"];

    const hyakuWords = {
        1:"hyaku", 2:"nihyaku", 3:"sanbyaku", 4:"yonhyaku", 5:"gohyaku",
        6:"roppyaku", 7:"nanahyaku", 8:"happyaku", 9:"kyuuhyaku"
    };

    const senWords = {
        1:"sen", 2:"nisen", 3:"sanzen", 4:"yonsen", 5:"gosen",
        6:"rokusen", 7:"nanasen", 8:"hassen", 9:"kyuusen"
    };

    let result = "";

    if(man>0){ result += (man===1 ? "ichi" : digitWords[man]) + "man"; }
    if(sen>0){ result += senWords[sen]; }
    if(hyaku>0){ result += hyakuWords[hyaku]; }
    if(juu>0){ result += (juu===1 ? "" : digitWords[juu]) + "juu"; }
    if(ichi>0){ result += digitWords[ichi]; }

    return result;

}

// =====================
// Build the data set
// =====================

const numbersData = [];

for(let i=1;i<=1000;i++){
    numbersData.push({
        num:i,
        jp:numberToRomaji(i),
        range: i<=100 ? "1-100" : "101-1000",
        milestone: i % 100 === 0
    });
}

for(let i=2000;i<=10000;i+=1000){
    numbersData.push({
        num:i,
        jp:numberToRomaji(i),
        range:"thousands",
        milestone:true
    });
}

// =====================
// Helpers
// =====================

function shuffle(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
}

const grid=document.getElementById("grid");
const rangeSel=document.getElementById("range");
const mode=document.getElementById("mode");
const directionToggle=document.getElementById("direction");
const labelLeft=directionToggle.querySelector(".left");
const labelRight=directionToggle.querySelector(".right");

// This page uses the shared header toggle for "reading" vs "number"
labelLeft.textContent = "reading";
labelRight.textContent = "123";

let showJapaneseFirst = true;

function render(){

    grid.innerHTML="";

    let cards;

    if(rangeSel.value==="all"){
        cards=[...numbersData];
    }else{
        cards=numbersData.filter(item=>item.range===rangeSel.value);
    }

    if(mode.value==="shuffle"){
        shuffle(cards);
    }

    const frag=document.createDocumentFragment();

    cards.forEach(item=>{

        const card=document.createElement("div");

        card.className="card" + (item.milestone ? " milestone" : "");

        const frontText = showJapaneseFirst ? item.jp : item.num;
        const backText = showJapaneseFirst ? item.num : item.jp;

        card.innerHTML=`
            <div class="inner">
                <div class="front">${frontText}</div>
                <div class="back">${backText}</div>
            </div>
        `;

        card.addEventListener("click",()=>{
            card.classList.toggle("flipped");
        });

        card.appendChild(createSpeakerButton(item.num));

        frag.appendChild(card);

    });

    grid.appendChild(frag);

}

render();

// =====================
// Controls
// =====================

rangeSel.addEventListener("change",render);
mode.addEventListener("change",render);

function toggleDirection(){

    showJapaneseFirst = !showJapaneseFirst;

    directionToggle.classList.toggle("right", !showJapaneseFirst);
    directionToggle.setAttribute("aria-pressed", String(!showJapaneseFirst));

    labelLeft.classList.toggle("active", showJapaneseFirst);
    labelRight.classList.toggle("active", !showJapaneseFirst);

    render();

}

directionToggle.addEventListener("click",toggleDirection);
directionToggle.addEventListener("keydown",(e)=>{
    if(e.key==="Enter" || e.key===" "){
        e.preventDefault();
        toggleDirection();
    }
});