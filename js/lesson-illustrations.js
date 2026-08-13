// Lesson 1 visual memory illustrations
// Lessons page ONLY. Illustrations are shown on the BACK of cards.
(function () {
    const illustrations = {
        "わたし": "person",
        "あなた": "person",
        "あのひと": "person",
        "あのかた": "person",
        "せんせい": "teacher",
        "きょうし": "teacher",
        "がくせい": "student",
        "かいしゃいん": "employee",
        "しゃいん": "employee",
        "ぎんこういん": "bank",
        "いしゃ": "doctor",
        "けんきゅうしゃ": "researcher",
        "だいがく": "university",
        "びょういん": "hospital",
        "だれ": "question-person",
        "どなた": "question-person",
        "～さい": "birthday",
        "なんさい": "birthday",
        "おいくつ": "birthday",
        "～さん": "person-name",
        "～ちゃん": "person-name",
        "～じん": "globe-person",
        "はい": "yes",
        "いいえ": "no"
    };

    const svg = {
        person: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="42" r="24" fill="#f2c7a5"/><path d="M55 42c2-24 12-34 25-34s24 10 25 34c-8-8-16-11-25-11S63 34 55 42z" fill="#3b302c"/><path d="M38 132c3-35 19-52 42-52s39 17 42 52" fill="#e88765"/><path d="M54 82c8 7 17 10 26 10s18-3 26-10" fill="none" stroke="#d36d55" stroke-width="5" stroke-linecap="round"/><circle cx="71" cy="43" r="3" fill="#3b302c"/><circle cx="89" cy="43" r="3" fill="#3b302c"/></svg>`,
        teacher: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="18" y="18" width="124" height="62" rx="5" fill="#e9e0c9" stroke="#544b45" stroke-width="5"/><path d="M34 39h68M34 57h48" stroke="#756a62" stroke-width="5" stroke-linecap="round"/><circle cx="111" cy="48" r="13" fill="#f2c7a5"/><path d="M94 132c2-30 10-43 25-43s23 13 25 43" fill="#7897b8"/><path d="M28 83l-13 30" stroke="#544b45" stroke-width="5" stroke-linecap="round"/><circle cx="112" cy="48" r="15" fill="none" stroke="#544b45" stroke-width="4"/></svg>`,
        student: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M20 43L80 15l60 28-60 28z" fill="#d8a34f" stroke="#544b45" stroke-width="5" stroke-linejoin="round"/><path d="M42 54v30c14 14 62 14 76 0V54" fill="#f1d27c" stroke="#544b45" stroke-width="5"/><circle cx="80" cy="105" r="18" fill="#f2c7a5"/><path d="M52 136c3-20 13-30 28-30s25 10 28 30" fill="#6d8fb2"/></svg>`,
        employee: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="42" y="12" width="76" height="116" rx="8" fill="#d9e2eb" stroke="#4f5962" stroke-width="5"/><circle cx="80" cy="48" r="18" fill="#f2c7a5"/><path d="M53 111c3-27 12-40 27-40s24 13 27 40" fill="#7897b8"/><path d="M61 25h38" stroke="#4f5962" stroke-width="6" stroke-linecap="round"/><path d="M67 91h26" stroke="#f2f4f6" stroke-width="5" stroke-linecap="round"/></svg>`,
        bank: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M15 48L80 15l65 33H15z" fill="#e5b85c" stroke="#51483f" stroke-width="5" stroke-linejoin="round"/><path d="M28 55v58M54 55v58M106 55v58M132 55v58M17 120h126" stroke="#51483f" stroke-width="7"/><rect x="67" y="55" width="26" height="58" fill="#f3e5bf" stroke="#51483f" stroke-width="5"/><path d="M80 27v15" stroke="#51483f" stroke-width="5" stroke-linecap="round"/></svg>`,
        doctor: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="31" r="22" fill="#f2c7a5"/><path d="M54 31c2-20 12-29 26-29s24 9 26 29c-8-8-16-11-26-11S62 23 54 31z" fill="#55443d"/><path d="M43 132c3-37 16-57 37-57s34 20 37 57" fill="#f5f5f3" stroke="#cad0d5" stroke-width="4"/><path d="M80 76v29M66 91h28" stroke="#d76555" stroke-width="6" stroke-linecap="round"/><path d="M111 91c18 3 23 14 18 27-3 7-9 10-15 6" fill="none" stroke="#68757f" stroke-width="5" stroke-linecap="round"/><path d="M113 94c-6-8-10-11-14-12" fill="none" stroke="#68757f" stroke-width="4"/></svg>`,
        researcher: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="54" cy="38" r="20" fill="#f2c7a5"/><path d="M30 38c2-20 12-29 24-29s23 9 24 29c-7-7-15-10-24-10S37 31 30 38z" fill="#4d4039"/><path d="M25 132c3-31 13-47 29-47s26 16 29 47" fill="#91a9bd"/><path d="M105 22v52" stroke="#59656e" stroke-width="6"/><path d="M91 22h28M101 74h28" stroke="#59656e" stroke-width="5" stroke-linecap="round"/><path d="M117 74l18 18" stroke="#59656e" stroke-width="5" stroke-linecap="round"/><circle cx="139" cy="101" r="18" fill="#e7eef2" stroke="#59656e" stroke-width="5"/><path d="M151 114l8 8" stroke="#59656e" stroke-width="5" stroke-linecap="round"/></svg>`,
        university: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><path d="M12 42L80 12l68 30-68 30z" fill="#d7a951" stroke="#51483f" stroke-width="5" stroke-linejoin="round"/><path d="M27 51v58M51 61v48M109 61v48M133 51v58M16 120h128" stroke="#51483f" stroke-width="7"/><path d="M80 25v18" stroke="#51483f" stroke-width="5"/><rect x="68" y="66" width="24" height="43" fill="#efe2c0" stroke="#51483f" stroke-width="5"/></svg>`,
        hospital: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="31" y="30" width="98" height="94" rx="4" fill="#e8eef0" stroke="#59656e" stroke-width="5"/><rect x="64" y="12" width="32" height="22" fill="#e8eef0" stroke="#59656e" stroke-width="5"/><path d="M80 45v42M59 66h42" stroke="#d65d55" stroke-width="10" stroke-linecap="round"/><rect x="48" y="98" width="22" height="26" fill="#a9bfcc"/><rect x="90" y="98" width="22" height="26" fill="#a9bfcc"/></svg>`,
        "question-person": () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="60" cy="54" r="24" fill="#f2c7a5"/><path d="M34 54c2-22 13-34 26-34s25 12 26 34c-8-9-16-12-26-12S42 45 34 54z" fill="#4d4039"/><path d="M25 132c3-34 15-50 35-50s32 16 35 50" fill="#e88765"/><path d="M108 37c0-16 30-18 35-3 4 11-7 17-15 22v7" fill="none" stroke="#d76555" stroke-width="8" stroke-linecap="round"/><circle cx="128" cy="78" r="4" fill="#d76555"/></svg>`,
        birthday: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><rect x="28" y="62" width="104" height="54" rx="7" fill="#e88765" stroke="#6a5148" stroke-width="5"/><rect x="28" y="62" width="104" height="18" fill="#f0b65c" stroke="#6a5148" stroke-width="5"/><path d="M80 28v24M68 40h24" stroke="#d65d55" stroke-width="6" stroke-linecap="round"/><path d="M48 62c-15-17 10-26 25-7 15-19 40-10 25 7" fill="#8db1ca" stroke="#6a5148" stroke-width="4"/></svg>`,
        "person-name": () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="43" r="28" fill="#f2c7a5"/><path d="M50 44c2-26 13-38 30-38s29 12 30 38c-10-9-19-13-30-13S60 35 50 44z" fill="#4d4039"/><path d="M42 132c3-37 18-55 38-55s35 18 38 55" fill="#7897b8"/><path d="M115 83l15 16-15 16" fill="none" stroke="#d76555" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        "globe-person": () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="62" r="45" fill="#9fc1d3" stroke="#566a75" stroke-width="5"/><path d="M35 62h90M80 17c-18 17-18 73 0 90M80 17c18 17 18 73 0 90" fill="none" stroke="#566a75" stroke-width="4"/><circle cx="80" cy="122" r="11" fill="#f2c7a5"/><path d="M62 140c2-12 9-18 18-18s16 6 18 18" fill="#e88765"/></svg>`,
        yes: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="70" r="55" fill="#b9d7ad"/><path d="M43 72l24 25 51-57" fill="none" stroke="#4f7d54" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        no: () => `<svg viewBox="0 0 160 140" aria-hidden="true"><circle cx="80" cy="70" r="55" fill="#f0c1bb"/><path d="M48 38l64 64M112 38L48 102" fill="none" stroke="#a84d48" stroke-width="13" stroke-linecap="round"/></svg>`
    };

    function normalize(text) {
        return String(text || "").replace(/\s+/g, " ").trim();
    }

    function addIllustrations() {
        document.querySelectorAll("#grid .card").forEach(card => {
            if (card.dataset.lessonIllustration === "done") return;

            const front = card.querySelector(".front");
            const back = card.querySelector(".back.vocabulary-back, .back");
            if (!front || !back) return;

            const text = normalize(front.textContent);
            const key = Object.keys(illustrations).find(word => text.includes(word));
            if (!key || !svg[illustrations[key]]) return;

            const visual = document.createElement("div");
            visual.className = "lesson-illustration";
            visual.innerHTML = svg[illustrations[key]]();
            visual.setAttribute("aria-hidden", "true");

            // Back order: Romaji → English → Illustration → Bangla.
            // The Bangla meaning is the final content block on vocabulary backs,
            // so insert the illustration immediately before it.
            const lastChild = back.lastElementChild;
            if (lastChild) {
                back.insertBefore(visual, lastChild);
            } else {
                back.appendChild(visual);
            }

            card.dataset.lessonIllustration = "done";
        });
    }

    function init() {
        addIllustrations();
        const grid = document.getElementById("grid");
        if (grid) new MutationObserver(addIllustrations).observe(grid, { childList: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
