// =====================================================
// Lesson 1 visual memory illustrations
// =====================================================
// Lessons page only. Adds clean inline SVG illustrations to
// the BACK of Lesson 1 vocabulary cards. Nothing is added
// to the card front, and no emoji are used.
// =====================================================

(function () {
    const illustrations = {
        "わたし": "person",
        "あなた": "person",
        "あのひと（あのかた）": "person",
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
        "だれ（どなた）": "person-question",
        "～さい": "birthday",
        "なんさい／おいくつ": "birthday",
        "はい": "yes",
        "いいえ": "no"
    };

    const svg = {
        person: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="29" r="14" fill="none" stroke="currentColor" stroke-width="5"/><path d="M25 78c2-19 12-29 25-29s23 10 25 29" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M38 55h24" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
        teacher: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="12" y="16" width="76" height="48" rx="3" fill="none" stroke="currentColor" stroke-width="5"/><path d="M24 32h50M24 45h34" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="68" cy="74" r="10" fill="none" stroke="currentColor" stroke-width="4"/><path d="M50 91c2-11 8-17 18-17s16 6 18 17M40 62l-12 22" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
        student: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M15 35l35-16 35 16-35 16z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M27 43v20c8 8 28 10 46 0V43M85 36v22" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="76" r="9" fill="none" stroke="currentColor" stroke-width="4"/></svg>`,
        employee: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="24" y="12" width="52" height="76" rx="6" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="50" cy="38" r="10" fill="none" stroke="currentColor" stroke-width="4"/><path d="M34 67c2-11 9-16 16-16s14 5 16 16M38 20h24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
        bank: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 35L50 15l38 20H12zM20 40v35M38 40v35M62 40v35M80 40v35M12 82h76" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/></svg>`,
        doctor: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="25" r="12" fill="none" stroke="currentColor" stroke-width="4"/><path d="M27 82c2-23 11-34 23-34s21 11 23 34M39 52v20M61 52v20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M69 61c9 2 12 8 9 17-2 7-8 9-13 6" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M74 71c-3-5-6-9-10-10" fill="none" stroke="currentColor" stroke-width="3"/></svg>`,
        researcher: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="42" cy="38" r="11" fill="none" stroke="currentColor" stroke-width="4"/><path d="M23 82c2-19 9-28 19-28s17 9 19 28M65 24v30M65 54c8 0 13 6 13 13" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M60 22h20M76 67l9 9" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="86" cy="78" r="8" fill="none" stroke="currentColor" stroke-width="4"/></svg>`,
        university: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M10 36L50 16l40 20-40 20z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M20 43v35M36 50v28M64 50v28M80 43v35M12 86h76" fill="none" stroke="currentColor" stroke-width="5"/><path d="M50 25v15" stroke="currentColor" stroke-width="4"/></svg>`,
        hospital: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M20 86V28h60v58" fill="none" stroke="currentColor" stroke-width="5"/><path d="M42 28V15h16v13" fill="none" stroke="currentColor" stroke-width="5"/><path d="M50 42v24M38 54h24" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M30 86V70h12v16M58 86V70h12v16" fill="none" stroke="currentColor" stroke-width="4"/></svg>`,
        "person-question": () => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="40" cy="34" r="13" fill="none" stroke="currentColor" stroke-width="5"/><path d="M18 82c2-20 10-29 22-29s20 9 22 29" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M69 35c0-8 14-10 17-2 2 6-4 9-8 12v4" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="78" cy="57" r="2.5" fill="currentColor"/></svg>`,
        birthday: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="18" y="48" width="64" height="34" rx="4" fill="none" stroke="currentColor" stroke-width="5"/><path d="M18 60h64M35 48c-9-11 7-18 15-5 8-13 24-6 15 5" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M50 24v14M43 31h14" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
        yes: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 52l20 20 44-46" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        no: () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M25 25l50 50M75 25L25 75" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/></svg>`
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

            const key = Object.keys(illustrations).find(word => normalize(front.textContent).includes(word));
            if (!key || !svg[illustrations[key]]) return;

            const visual = document.createElement("div");
            visual.className = "lesson-illustration";
            visual.innerHTML = svg[illustrations[key]]();
            visual.setAttribute("aria-hidden", "true");

            // Illustration is deliberately added ONLY to the back.
            back.appendChild(visual);
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
