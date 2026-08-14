// Lesson 7 visual memory illustrations
// Lessons page ONLY. Illustrations are shown on the BACK of cards.
(function () {
    const illustrations = {
        "きります": "cut",
        "おくります": "send",
        "あげます": "give",
        "もらいます": "receive",
        "かします": "lend",
        "かります": "borrow",
        "おしえます": "teach",
        "ならいます": "learn",
        "かけます": "phone",
        "て": "hand",
        "はし": "chopsticks",
        "スプーン": "spoon",
        "ナイフ": "knife",
        "フォーク": "fork",
        "はさみ": "scissors",
        "パソコン": "computer",
        "けいたい": "phone",
        "メール": "email",
        "ねんがじょう": "card",
        "パンチ": "punch",
        "ホッチキス": "stapler",
        "セロテープ": "tape",
        "けしゴム": "eraser",
        "かみ": "paper",
        "はな": "flower",
        "シャツ": "shirt",
        "プレゼント": "gift",
        "にもつ": "luggage",
        "おかね": "money",
        "きっぷ": "ticket",
        "クリスマス": "christmas",
        "ちち": "father",
        "はは": "mother",
        "おとうさん": "father",
        "おかあさん": "mother",
        "もう": "already",
        "まだ": "notyet",
        "これから": "future"
    };

    const svg = {
        cut: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M35 105L103 37M49 119L117 51" stroke="#59656e" stroke-width="9" stroke-linecap="round"/><circle cx="31" cy="109" r="18" fill="none" stroke="#59656e" stroke-width="7"/><circle cx="45" cy="123" r="18" fill="none" stroke="#59656e" stroke-width="7"/><path d="M101 39l35-25M115 53l31 22" stroke="#d76555" stroke-width="6" stroke-linecap="round"/></svg>`,
        send: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="24" y="34" width="86" height="67" rx="6" fill="#f1d27c" stroke="#59656e" stroke-width="5"/><path d="M30 42l37 31 37-31" fill="none" stroke="#59656e" stroke-width="5"/><path d="M88 82h48M118 65l18 17-18 17" fill="none" stroke="#d76555" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        give: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="48" cy="48" r="22" fill="#f2c7a5"/><path d="M27 130c2-31 10-48 21-48s20 17 22 48" fill="#7897b8"/><circle cx="112" cy="48" r="22" fill="#f2c7a5"/><path d="M91 130c2-31 10-48 21-48s20 17 22 48" fill="#e88765"/><path d="M58 72h44M89 56l20 16-20 16" fill="none" stroke="#d76555" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        receive: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="48" y="48" width="64" height="48" rx="5" fill="#f0b65c" stroke="#59656e" stroke-width="5"/><path d="M80 18v46M61 45l19 19 19-19" fill="none" stroke="#d76555" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 130c3-25 13-38 27-38s24 13 27 38M71 130c3-25 13-38 27-38s24 13 27 38" fill="#7897b8"/></svg>`,
        lend: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="52" y="32" width="56" height="75" rx="5" fill="#e9e0c9" stroke="#59656e" stroke-width="5"/><path d="M36 76h40M62 58l18 18-18 18" fill="none" stroke="#d76555" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M116 76h20" stroke="#59656e" stroke-width="7" stroke-linecap="round"/></svg>`,
        borrow: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="52" y="32" width="56" height="75" rx="5" fill="#e9e0c9" stroke="#59656e" stroke-width="5"/><path d="M124 76H84M98 58L80 76l18 18" fill="none" stroke="#d76555" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 76h20" stroke="#59656e" stroke-width="7" stroke-linecap="round"/></svg>`,
        teach: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="25" y="18" width="110" height="58" rx="4" fill="#e9e0c9" stroke="#59656e" stroke-width="5"/><path d="M43 40h67M43 58h48" stroke="#756a62" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="103" r="19" fill="#f2c7a5"/><path d="M51 140c3-24 13-35 29-35s26 11 29 35" fill="#7897b8"/><path d="M108 88l25-25" stroke="#59656e" stroke-width="6" stroke-linecap="round"/></svg>`,
        learn: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M18 30h55c9 0 16 7 16 16v68H34c-9 0-16-7-16-16z" fill="#f3e5bf" stroke="#59656e" stroke-width="5"/><path d="M142 30H87c-9 0-16 7-16 16v68h55c9 0 16-7 16-16z" fill="#f3e5bf" stroke="#59656e" stroke-width="5"/><path d="M37 53h35M37 71h28M91 53h35M91 71h28" stroke="#7897b8" stroke-width="5" stroke-linecap="round"/></svg>`,
        phone: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="55" y="12" width="50" height="116" rx="9" fill="#d9e2eb" stroke="#59656e" stroke-width="6"/><rect x="63" y="27" width="34" height="72" rx="3" fill="#9fc1d3"/><circle cx="80" cy="113" r="5" fill="#59656e"/><path d="M116 54h23M128 42l11 12-11 12" fill="none" stroke="#d76555" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        hand: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M58 118c-9-12-17-28-21-43-3-11 12-16 17-6l13 24V36c0-9 14-9 14 0v42-52c0-9 14-9 14 0v52-43c0-9 14-9 14 0v45-33c0-9 14-9 14 0v49c0 19-14 32-31 32H76c-8 0-14-3-18-9z" fill="#f2c7a5" stroke="#9c6e58" stroke-width="5"/></svg>`,
        chopsticks: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M39 20l75 101M62 20l75 101" stroke="#c58a45" stroke-width="8" stroke-linecap="round"/><path d="M91 81c14-14 30-14 40 0" fill="none" stroke="#d76555" stroke-width="7" stroke-linecap="round"/></svg>`,
        spoon: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><ellipse cx="68" cy="38" rx="25" ry="29" fill="#cbd3d8" stroke="#59656e" stroke-width="5"/><path d="M68 65v62" stroke="#59656e" stroke-width="9" stroke-linecap="round"/></svg>`,
        knife: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M28 49h70l34-25v50l-34-25H28z" fill="#cbd3d8" stroke="#59656e" stroke-width="5"/><rect x="28" y="49" width="55" height="30" rx="6" fill="#8d6954"/></svg>`,
        fork: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M58 22v42M72 22v42M86 22v42M100 22v42M79 64v62" stroke="#59656e" stroke-width="7" stroke-linecap="round"/><path d="M58 64c0 10 21 14 42 0" fill="none" stroke="#59656e" stroke-width="7"/></svg>`,
        scissors: () => svg.cut(),
        computer: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="25" y="20" width="110" height="76" rx="6" fill="#d9e2eb" stroke="#59656e" stroke-width="6"/><rect x="36" y="31" width="88" height="54" fill="#9fc1d3"/><path d="M64 113h32M48 125h64" stroke="#59656e" stroke-width="7" stroke-linecap="round"/></svg>`,
        email: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="22" y="35" width="116" height="75" rx="7" fill="#f3e5bf" stroke="#59656e" stroke-width="5"/><path d="M25 42l55 43 55-43" fill="none" stroke="#d76555" stroke-width="6"/></svg>`,
        card: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="25" y="28" width="110" height="82" rx="6" fill="#f3e5bf" stroke="#59656e" stroke-width="5"/><path d="M42 50h76M42 68h50M42 87h32" stroke="#7897b8" stroke-width="6" stroke-linecap="round"/></svg>`,
        punch: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="45" y="50" width="70" height="55" rx="6" fill="#7897b8" stroke="#59656e" stroke-width="5"/><path d="M80 50V25M66 25h28" stroke="#59656e" stroke-width="8" stroke-linecap="round"/><circle cx="66" cy="80" r="6" fill="#f3e5bf"/><circle cx="94" cy="80" r="6" fill="#f3e5bf"/></svg>`,
        stapler: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M35 55h82l20 25H55z" fill="#7897b8" stroke="#59656e" stroke-width="5"/><path d="M55 80h68v20H55z" fill="#d9e2eb" stroke="#59656e" stroke-width="5"/><path d="M82 42v34" stroke="#d76555" stroke-width="7"/></svg>`,
        tape: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="70" cy="70" r="38" fill="#d9e2eb" stroke="#59656e" stroke-width="7"/><circle cx="70" cy="70" r="15" fill="#fff" stroke="#59656e" stroke-width="5"/><path d="M102 55h35v35h-35" fill="#f1d27c" stroke="#59656e" stroke-width="5"/></svg>`,
        eraser: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M35 93l55-55 35 35-55 55H45z" fill="#e887a0" stroke="#59656e" stroke-width="5"/><path d="M35 93l20 20" stroke="#f3e5bf" stroke-width="18"/></svg>`,
        paper: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M42 15h58l20 20v90H42z" fill="#f8f6ef" stroke="#59656e" stroke-width="5"/><path d="M100 15v22h20M57 57h48M57 75h48M57 93h35" stroke="#7897b8" stroke-width="6" stroke-linecap="round"/></svg>`,
        flower: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M80 65v66" stroke="#5f8b5a" stroke-width="7"/><path d="M80 95c-25-18-36 7 0 8M80 108c25-18 36 7 0 8" fill="#7da86f"/><circle cx="80" cy="48" r="14" fill="#f0b65c"/><circle cx="60" cy="35" r="18" fill="#e887a0"/><circle cx="100" cy="35" r="18" fill="#e887a0"/><circle cx="64" cy="62" r="18" fill="#e887a0"/><circle cx="96" cy="62" r="18" fill="#e887a0"/></svg>`,
        shirt: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M52 25l28-12 28 12 28 22-18 22-13-10v67H55V59L42 69 24 47z" fill="#7897b8" stroke="#59656e" stroke-width="5" stroke-linejoin="round"/></svg>`,
        gift: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="30" y="55" width="100" height="65" rx="4" fill="#e88765" stroke="#59656e" stroke-width="5"/><path d="M80 55v65M30 76h100" stroke="#f1d27c" stroke-width="9"/><path d="M80 55c-22-7-32-20-20-29 11-8 22 7 20 29zm0 0c22-7 32-20 20-29-11-8-22 7-20 29z" fill="#f1d27c" stroke="#59656e" stroke-width="4"/></svg>`,
        luggage: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="42" y="38" width="76" height="80" rx="9" fill="#7897b8" stroke="#59656e" stroke-width="6"/><path d="M63 38V24h34v14M32 119h96" stroke="#59656e" stroke-width="7" stroke-linecap="round"/><circle cx="61" cy="123" r="7" fill="#59656e"/><circle cx="99" cy="123" r="7" fill="#59656e"/></svg>`,
        money: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="28" y="35" width="104" height="70" rx="6" fill="#9fcf9a" stroke="#59656e" stroke-width="5"/><circle cx="80" cy="70" r="20" fill="#f1d27c" stroke="#59656e" stroke-width="4"/><path d="M80 56v28M70 62c5-8 18-6 20 1 2 7-18 6-20 13-2 7 13 10 20 2" fill="none" stroke="#59656e" stroke-width="4"/></svg>`,
        ticket: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M25 43h110v54H25z" fill="#f3e5bf" stroke="#59656e" stroke-width="5" stroke-dasharray="8 5"/><circle cx="80" cy="70" r="15" fill="#f0b65c"/><path d="M48 55v30M112 55v30" stroke="#7897b8" stroke-width="5"/></svg>`,
        christmas: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M80 15L45 70h22l-30 38h86L93 70h22z" fill="#6d9b68" stroke="#59656e" stroke-width="5" stroke-linejoin="round"/><rect x="72" y="108" width="16" height="20" fill="#8d6954"/><circle cx="80" cy="28" r="7" fill="#f1d27c"/><circle cx="60" cy="68" r="5" fill="#e88765"/><circle cx="103" cy="75" r="5" fill="#9fc1d3"/></svg>`,
        father: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="42" r="25" fill="#f2c7a5"/><path d="M53 43c2-23 12-34 27-34s25 11 27 34c-9-8-17-11-27-11S62 35 53 43z" fill="#4d4039"/><path d="M43 136c3-36 16-54 37-54s34 18 37 54" fill="#7897b8"/><path d="M68 53h8M84 53h8M70 65h20" stroke="#59656e" stroke-width="4" stroke-linecap="round"/></svg>`,
        mother: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="42" r="24" fill="#f2c7a5"/><path d="M51 42c1-25 13-36 29-36s28 11 29 36c-9-9-18-12-29-12S60 33 51 42z" fill="#4d4039"/><path d="M42 136c3-35 17-54 38-54s35 19 38 54" fill="#e887a0"/><path d="M68 55h8M84 55h8M70 67h20" stroke="#59656e" stroke-width="4" stroke-linecap="round"/></svg>`,
        already: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="70" r="50" fill="#b9d7ad" stroke="#59656e" stroke-width="5"/><path d="M80 40v32l22 13" fill="none" stroke="#4f7d54" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 17v8M80 115v8M27 70h8M125 70h8" stroke="#4f7d54" stroke-width="5" stroke-linecap="round"/></svg>`,
        notyet: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="70" r="50" fill="#f3e5bf" stroke="#59656e" stroke-width="5"/><path d="M80 40v32l22 13" fill="none" stroke="#59656e" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 117l84-94" stroke="#d76555" stroke-width="10" stroke-linecap="round"/></svg>`,
        future: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M25 100L70 55l25 25 40-55" fill="none" stroke="#7897b8" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M113 25h22v22" fill="none" stroke="#d76555" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="28" cy="100" r="8" fill="#d76555"/></svg>`
    };

    function normalize(text) {
        return String(text || "").replace(/\s+/g, " ").trim();
    }

    function addIllustrations() {
        document.querySelectorAll("#grid .card").forEach(card => {
            if (card.dataset.lesson7Illustration === "done") return;
            const lessonText = normalize(card.querySelector(".front")?.textContent);
            if (!lessonText) return;
            const key = Object.keys(illustrations).find(word => lessonText.includes(word));
            if (!key || !svg[illustrations[key]]) return;
            const back = card.querySelector(".back.vocabulary-back, .back");
            if (!back) return;

            const visual = document.createElement("div");
            visual.className = "lesson-illustration lesson7-illustration";
            visual.innerHTML = svg[illustrations[key]]();
            visual.setAttribute("aria-hidden", "true");

            const lastChild = back.lastElementChild;
            if (lastChild) back.insertBefore(visual, lastChild);
            else back.appendChild(visual);
            card.dataset.lesson7Illustration = "done";
        });
    }

    function init() {
        addIllustrations();
        const grid = document.getElementById("grid");
        if (grid) new MutationObserver(addIllustrations).observe(grid, { childList: true });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
