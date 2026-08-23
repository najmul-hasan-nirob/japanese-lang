// Visual memory illustrations for Lessons 1-25
// Lessons page ONLY. Illustrations are shown on the BACK of vocabulary cards.
// Lesson 1 keeps its original hand-drawn SVG mapping. Lessons 2-25 use
// semantic visual mappings so every vocabulary card gets a memory cue.
(function () {
    const illustrations = {
        "わたし": "person", "あなた": "person", "あのひと": "person", "あのかた": "person",
        "せんせい": "teacher", "きょうし": "teacher", "がくせい": "student",
        "かいしゃいん": "employee", "しゃいん": "employee", "ぎんこういん": "bank",
        "いしゃ": "doctor", "けんきゅうしゃ": "researcher", "だいがく": "university",
        "びょういん": "hospital", "だれ": "question-person", "どなた": "question-person",
        "～さい": "birthday", "なんさい": "birthday", "おいくつ": "birthday",
        "～さん": "person-name", "～ちゃん": "person-name", "～じん": "globe-person",
        "はい": "yes", "いいえ": "no"
    };

    const svg = {
        person: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="42" r="24" fill="#f2c7a5"/><path d="M55 42c2-24 12-34 25-34s24 10 25 34c-8-8-16-11-25-11S63 34 55 42z" fill="#3b302c"/><path d="M38 132c3-35 19-52 42-52s39 17 42 52" fill="#e88765"/><circle cx="71" cy="43" r="3" fill="#3b302c"/><circle cx="89" cy="43" r="3" fill="#3b302c"/></svg>`,
        teacher: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="18" y="18" width="124" height="62" rx="5" fill="#e9e0c9" stroke="#544b45" stroke-width="5"/><path d="M34 39h68M34 57h48" stroke="#756a62" stroke-width="5" stroke-linecap="round"/><circle cx="111" cy="48" r="13" fill="#f2c7a5"/><path d="M94 132c2-30 10-43 25-43s23 13 25 43" fill="#7897b8"/><path d="M28 83l-13 30" stroke="#544b45" stroke-width="5" stroke-linecap="round"/><circle cx="112" cy="48" r="15" fill="none" stroke="#544b45" stroke-width="4"/></svg>`,
        student: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M20 43L80 15l60 28-60 28z" fill="#d8a34f" stroke="#544b45" stroke-width="5" stroke-linejoin="round"/><path d="M42 54v30c14 14 62 14 76 0V54" fill="#f1d27c" stroke="#544b45" stroke-width="5"/><circle cx="80" cy="105" r="18" fill="#f2c7a5"/><path d="M52 136c3-20 13-30 28-30s25 10 28 30" fill="#6d8fb2"/></svg>`,
        employee: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="42" y="12" width="76" height="116" rx="8" fill="#d9e2eb" stroke="#4f5962" stroke-width="5"/><circle cx="80" cy="48" r="18" fill="#f2c7a5"/><path d="M53 111c3-27 12-40 27-40s24 13 27 40" fill="#7897b8"/><path d="M61 25h38" stroke="#4f5962" stroke-width="6" stroke-linecap="round"/></svg>`,
        bank: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M15 48L80 15l65 33H15z" fill="#e5b85c" stroke="#51483f" stroke-width="5"/><path d="M28 55v58M54 55v58M106 55v58M132 55v58M17 120h126" stroke="#51483f" stroke-width="7"/><rect x="67" y="55" width="26" height="58" fill="#f3e5bf" stroke="#51483f" stroke-width="5"/></svg>`,
        doctor: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="31" r="22" fill="#f2c7a5"/><path d="M54 31c2-20 12-29 26-29s24 9 26 29c-8-8-16-11-26-11S62 23 54 31z" fill="#55443d"/><path d="M43 132c3-37 16-57 37-57s34 20 37 57" fill="#f5f5f3" stroke="#cad0d5" stroke-width="4"/><path d="M80 76v29M66 91h28" stroke="#d76555" stroke-width="6" stroke-linecap="round"/></svg>`,
        researcher: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="54" cy="38" r="20" fill="#f2c7a5"/><path d="M30 38c2-20 12-29 24-29s23 9 24 29c-7-7-15-10-24-10S37 31 30 38z" fill="#4d4039"/><path d="M25 132c3-31 13-47 29-47s26 16 29 47" fill="#91a9bd"/><path d="M105 22v52M91 22h28M101 74h28" stroke="#59656e" stroke-width="6" stroke-linecap="round"/><circle cx="139" cy="101" r="18" fill="#e7eef2" stroke="#59656e" stroke-width="5"/></svg>`,
        university: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M12 42L80 12l68 30-68 30z" fill="#d7a951" stroke="#51483f" stroke-width="5"/><path d="M27 51v58M51 61v48M109 61v48M133 51v58M16 120h128" stroke="#51483f" stroke-width="7"/><rect x="68" y="66" width="24" height="43" fill="#efe2c0" stroke="#51483f" stroke-width="5"/></svg>`,
        hospital: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="31" y="30" width="98" height="94" rx="4" fill="#e8eef0" stroke="#59656e" stroke-width="5"/><path d="M80 45v42M59 66h42" stroke="#d65d55" stroke-width="10" stroke-linecap="round"/><rect x="48" y="98" width="22" height="26" fill="#a9bfcc"/><rect x="90" y="98" width="22" height="26" fill="#a9bfcc"/></svg>`,
        "question-person": () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="60" cy="54" r="24" fill="#f2c7a5"/><path d="M34 54c2-22 13-34 26-34s25 12 26 34" fill="#4d4039"/><path d="M25 132c3-34 15-50 35-50s32 16 35 50" fill="#e88765"/><path d="M108 37c0-16 30-18 35-3 4 11-7 17-15 22v7" fill="none" stroke="#d76555" stroke-width="8" stroke-linecap="round"/><circle cx="128" cy="78" r="4" fill="#d76555"/></svg>`,
        birthday: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="28" y="62" width="104" height="54" rx="7" fill="#e88765" stroke="#6a5148" stroke-width="5"/><rect x="28" y="62" width="104" height="18" fill="#f0b65c" stroke="#6a5148" stroke-width="5"/><path d="M80 28v24M68 40h24" stroke="#d65d55" stroke-width="6" stroke-linecap="round"/><path d="M48 62c-15-17 10-26 25-7 15-19 40-10 25 7" fill="#8db1ca" stroke="#6a5148" stroke-width="4"/></svg>`,
        "person-name": () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="43" r="28" fill="#f2c7a5"/><path d="M50 44c2-26 13-38 30-38s29 12 30 38" fill="#4d4039"/><path d="M42 132c3-37 18-55 38-55s35 18 38 55" fill="#7897b8"/><path d="M115 83l15 16-15 16" fill="none" stroke="#d76555" stroke-width="6" stroke-linecap="round"/></svg>`,
        "globe-person": () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="62" r="45" fill="#9fc1d3" stroke="#566a75" stroke-width="5"/><path d="M35 62h90M80 17c-18 17-18 73 0 90M80 17c18 17 18 73 0 90" fill="none" stroke="#566a75" stroke-width="4"/><circle cx="80" cy="122" r="11" fill="#f2c7a5"/><path d="M62 140c2-12 9-18 18-18s16 6 18 18" fill="#e88765"/></svg>`,
        yes: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="70" r="55" fill="#b9d7ad"/><path d="M43 72l24 25 51-57" fill="none" stroke="#4f7d54" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        no: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="70" r="55" fill="#f0c1bb"/><path d="M48 38l64 64M112 38L48 102" fill="none" stroke="#a84d48" stroke-width="13" stroke-linecap="round"/></svg>`
    };

    // Semantic visual vocabulary used by Lessons 2-25. Matching is done against
    // the English + Bangla back of the card, so the lesson data files do not
    // need hundreds of manual illustration fields.
    const semanticRules = [
        [/teacher|শিক্ষক|প্রশিক্ষক/, "teacher"],
        [/student|শিক্ষার্থী|ছাত্র/, "student"],
        [/doctor|ডাক্তার/, "doctor"],
        [/hospital|হাসপাতাল/, "hospital"],
        [/bank|ব্যাংক/, "bank"],
        [/researcher|গবেষক/, "researcher"],
        [/university|বিশ্ববিদ্যালয়|বিশ্ববিদ্যালয়/, "university"],
        [/birthday|years old|বছর বয়স|বছর বয়স/, "birthday"],
        [/yes|হ্যাঁ/, "yes"],
        [/no|না/, "no"],
        [/person|people|man|woman|child|boy|girl|ব্যক্তি|মানুষ|পুরুষ|মহিলা|শিশু|ছেলে|মেয়ে|মেয়ে/, "person"],
        [/family|father|mother|parent|brother|sister|husband|wife|পরিবার|বাবা|মা|ভাই|বোন|স্বামী|স্ত্রী/, "person"],
        [/company|employee|worker|কোম্পানি|কর্মচারী|কাজ|কর্মী/, "employee"],
        [/country|national|দেশ|জাতীয়|জাতীয়/, "globe-person"],
        [/home|house|room|ঘর|বাড়ি|বাড়ি|কক্ষ/, "home"],
        [/school|class|classroom|স্কুল|বিদ্যালয়|বিদ্যালয়|শ্রেণি|ক্লাস/, "school"],
        [/book|notebook|dictionary|বই|খাতা|অভিধান/, "book"],
        [/pen|pencil|eraser|কলম|পেন্সিল|রাবার/, "writing"],
        [/car|bus|train|subway|taxi|airplane|ship|bicycle|গাড়ি|গাড়ি|বাস|ট্রেন|ট্যাক্সি|বিমান|জাহাজ|সাইকেল/, "transport"],
        [/station|airport|hotel|restaurant|store|shop|স্টেশন|বিমানবন্দর|হোটেল|রেস্তোরাঁ|দোকান/, "building"],
        [/food|meal|rice|bread|meat|fish|fruit|vegetable|খাবার|ভাত|রুটি|মাংস|মাছ|ফল|সবজি/, "food"],
        [/water|tea|coffee|milk|juice|পানি|জল|চা|কফি|দুধ|জুস/, "drink"],
        [/morning|afternoon|evening|night|today|tomorrow|yesterday|সকাল|দুপুর|বিকাল|সন্ধ্যা|রাত|আজ|আগামীকাল|গতকাল/, "time"],
        [/week|month|year|day|weekend|সপ্তাহ|মাস|বছর|দিন/, "calendar"],
        [/clock|watch|time|o'clock|ঘড়ি|ঘড়ি|সময়|সময়|টা বাজে/, "clock"],
        [/weather|rain|snow|sun|cloud|wind|আবহাওয়া|আবহাওয়া|বৃষ্টি|তুষার|সূর্য|মেঘ|বাতাস/, "weather"],
        [/mountain|sea|river|lake|tree|flower|sky|পাহাড়|পাহাড়|সমুদ্র|নদী|হ্রদ|গাছ|ফুল|আকাশ/, "nature"],
        [/phone|telephone|mobile|computer|camera|টেলিফোন|ফোন|মোবাইল|কম্পিউটার|ক্যামেরা/, "device"],
        [/money|price|yen|dollar|cash|টাকা|মূল্য|দাম|ইয়েন|ইয়েন|ডলার/, "money"],
        [/love|like|dislike|happy|sad|favorite|ভালোবাসা|পছন্দ|অপছন্দ|খুশি|দুঃখ|প্রিয়|প্রিয়/, "emotion"],
        [/question|who|what|where|when|why|how|কে|কি|কী|কোথায়|কোথায়|কখন|কেন|কীভাবে/, "question-person"],
        [/open|close|enter|exit|go|come|eat|drink|see|hear|read|write|buy|sell|open|বন্ধ|খোলা|যাওয়া|যাওয়া|আসা|খাওয়া|খাওয়া|পান|দেখা|শোনা|পড়া|পড়া|লেখা|কেনা|বেচা/, "action"]
    ];

    const extraSvg = {
        home: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M18 65L80 18l62 47" fill="#e8a15f" stroke="#5b5049" stroke-width="6" stroke-linejoin="round"/><path d="M31 62v60h98V62" fill="#f0e4c9" stroke="#5b5049" stroke-width="6"/><rect x="67" y="87" width="26" height="35" fill="#9ab4c5" stroke="#5b5049" stroke-width="5"/></svg>`,
        school: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M15 47L80 15l65 32-65 28z" fill="#d8a34f" stroke="#51483f" stroke-width="5"/><path d="M30 57v58M55 57v58M105 57v58M130 57v58M18 122h124" stroke="#51483f" stroke-width="7"/><rect x="68" y="68" width="24" height="47" fill="#efe2c0" stroke="#51483f" stroke-width="5"/></svg>`,
        book: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M24 24h48c12 0 18 7 18 18v76c-7-7-15-10-24-10H24z" fill="#7ea5bd" stroke="#4f5962" stroke-width="5"/><path d="M136 24H88c-12 0-18 7-18 18v76c7-7 15-10 24-10h42z" fill="#d99b70" stroke="#4f5962" stroke-width="5"/><path d="M35 45h32M35 61h27M103 45h22M103 61h28" stroke="#f7f2e7" stroke-width="5" stroke-linecap="round"/></svg>`,
        writing: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M34 112L104 42l19 19-70 70-25 6z" fill="#e7a95f" stroke="#554b45" stroke-width="5"/><path d="M104 42l14-14 19 19-14 14" fill="#d9e2eb" stroke="#554b45" stroke-width="5"/><path d="M29 119l-4 18 18-6" fill="#f2c7a5"/></svg>`,
        transport: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="24" y="48" width="112" height="55" rx="12" fill="#7fa9bd" stroke="#4e5961" stroke-width="6"/><path d="M40 48l13-25h54l13 25" fill="#e8eef0" stroke="#4e5961" stroke-width="6"/><circle cx="49" cy="108" r="13" fill="#4e5961"/><circle cx="111" cy="108" r="13" fill="#4e5961"/><path d="M43 62h74" stroke="#f7f2e7" stroke-width="6"/></svg>`,
        building: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="30" y="20" width="100" height="104" rx="4" fill="#d9e2eb" stroke="#56616a" stroke-width="6"/><path d="M48 39h20M92 39h20M48 62h20M92 62h20M48 85h20M92 85h20" stroke="#7897b8" stroke-width="8" stroke-linecap="round"/><rect x="69" y="92" width="22" height="32" fill="#e7b26b" stroke="#56616a" stroke-width="4"/></svg>`,
        food: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M25 73h110c-4 35-26 53-55 53S29 108 25 73z" fill="#e88765" stroke="#604f47" stroke-width="6"/><path d="M35 73c0-26 20-42 45-42s45 16 45 42" fill="#f1d27c" stroke="#604f47" stroke-width="6"/><path d="M55 48c7-10 15-10 22 0M88 48c7-10 15-10 22 0" stroke="#8db1ca" stroke-width="5" stroke-linecap="round"/></svg>`,
        drink: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M48 28h64l-8 94H56z" fill="#9fc7d9" stroke="#56616a" stroke-width="6"/><path d="M62 20h36" stroke="#56616a" stroke-width="6" stroke-linecap="round"/><path d="M68 54h24" stroke="#f7f2e7" stroke-width="5" stroke-linecap="round"/></svg>`,
        time: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="72" r="48" fill="#f0e3bd" stroke="#5a514a" stroke-width="6"/><path d="M80 72V43M80 72l23 14" stroke="#5a514a" stroke-width="7" stroke-linecap="round"/><circle cx="80" cy="72" r="5" fill="#d76555"/></svg>`,
        calendar: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="25" y="27" width="110" height="96" rx="8" fill="#f0e3bd" stroke="#5a514a" stroke-width="6"/><path d="M25 53h110M50 17v25M110 17v25" stroke="#5a514a" stroke-width="7" stroke-linecap="round"/><path d="M48 72h1M79 72h1M110 72h1M48 98h1M79 98h1M110 98h1" stroke="#d76555" stroke-width="10" stroke-linecap="round"/></svg>`,
        clock: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="70" r="48" fill="#f0e3bd" stroke="#5a514a" stroke-width="6"/><path d="M80 70V39M80 70l25 15" stroke="#5a514a" stroke-width="7" stroke-linecap="round"/><circle cx="80" cy="70" r="5" fill="#d76555"/></svg>`,
        weather: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="58" cy="52" r="25" fill="#f1c75b"/><path d="M42 105c0-20 16-34 35-34 8-18 36-17 41 5 17 0 28 11 28 29H42z" fill="#b9c9d2" stroke="#59656e" stroke-width="5"/></svg>`,
        nature: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M15 112L61 55l27 34 24-29 33 52H15z" fill="#86a987" stroke="#536653" stroke-width="5" stroke-linejoin="round"/><circle cx="119" cy="32" r="18" fill="#f0c15a"/></svg>`,
        device: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="39" y="15" width="82" height="110" rx="12" fill="#d9e2eb" stroke="#4f5962" stroke-width="6"/><rect x="51" y="30" width="58" height="75" rx="4" fill="#8fb6c8"/><circle cx="80" cy="115" r="4" fill="#4f5962"/></svg>`,
        money: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="24" y="38" width="112" height="68" rx="8" fill="#b9d7ad" stroke="#526b55" stroke-width="6"/><circle cx="80" cy="72" r="20" fill="#f0e3bd" stroke="#526b55" stroke-width="5"/><path d="M80 58v28M72 65c2-8 18-8 18 1s-18 6-18 15 16 9 18 1" fill="none" stroke="#526b55" stroke-width="4" stroke-linecap="round"/></svg>`,
        emotion: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="70" r="50" fill="#f0c1bb" stroke="#a85b56" stroke-width="5"/><circle cx="62" cy="62" r="5" fill="#594842"/><circle cx="98" cy="62" r="5" fill="#594842"/><path d="M55 87c13 15 37 15 50 0" fill="none" stroke="#a85b56" stroke-width="6" stroke-linecap="round"/></svg>`,
        action: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="70" r="50" fill="#d9e2eb" stroke="#56616a" stroke-width="5"/><path d="M55 72h48M84 53l19 19-19 19" fill="none" stroke="#5d7890" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    };

    Object.assign(svg, extraSvg);

    function normalize(text) {
        return String(text || "").replace(/\s+/g, " ").trim();
    }

    function findIllustration(frontText, backText) {
        const exact = Object.keys(illustrations).find(word => frontText.includes(word));
        if (exact && svg[illustrations[exact]]) return illustrations[exact];

        const semanticText = `${backText} ${frontText}`.toLowerCase();
        for (const [pattern, name] of semanticRules) {
            if (pattern.test(semanticText) && svg[name]) return name;
        }

        // Every vocabulary card receives a visual cue. This fallback is a
        // simple memory-light icon rather than leaving the card without one.
        return "action";
    }

    function addIllustrations() {
        document.querySelectorAll("#grid .card").forEach(card => {
            if (card.dataset.lessonIllustration === "done") return;

            const front = card.querySelector(".front");
            const back = card.querySelector(".back.vocabulary-back");
            if (!front || !back) return;

            const frontText = normalize(front.textContent);
            const backText = normalize(back.textContent);
            const key = findIllustration(frontText, backText);
            if (!key || !svg[key]) return;

            const visual = document.createElement("div");
            visual.className = "lesson-illustration";
            visual.innerHTML = svg[key]();
            visual.setAttribute("aria-hidden", "true");
            visual.dataset.illustrationType = key;

            // Back order: Romaji → English → Illustration → Bangla.
            const bangla = back.querySelector(".bangla");
            if (bangla) back.insertBefore(visual, bangla);
            else back.appendChild(visual);

            card.dataset.lessonIllustration = "done";
        });
    }

    function init() {
        addIllustrations();
        const grid = document.getElementById("grid");
        if (grid) new MutationObserver(addIllustrations).observe(grid, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
