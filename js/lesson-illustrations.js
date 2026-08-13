// =====================================================
// Lesson 1 visual memory illustrations
// =====================================================
// Lessons page only. These are lightweight inline SVG
// illustrations so no image/MP3 assets are added.
// Other lessons are intentionally left unchanged.
// =====================================================

(function () {
    const lesson1Visuals = new Set([
        "わたし", "あなた", "あのひと（あのかた）", "せんせい", "きょうし",
        "がくせい", "かいしゃいん", "しゃいん", "ぎんこういん", "いしゃ",
        "けんきゅうしゃ", "だいがく", "びょういん", "だれ（どなた）",
        "～さい", "なんさい／おいくつ", "はい", "いいえ",
        "アメリカ", "イギリス", "インド", "インドネシア", "かんこく", "タイ",
        "ちゅうごく", "ドイツ", "にほん", "ブラジル"
    ]);

    const people = {
        normal: `
            <circle cx="50" cy="29" r="14" fill="#F4C7A1"/>
            <path d="M36 28c1-15 27-19 29 1-6-6-18-7-29-1Z" fill="#4A3025"/>
            <path d="M26 82c2-19 13-28 24-28s22 9 24 28" fill="#6C91C9"/>
            <path d="M50 56v18M43 64l7 6 7-6" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
        `,
        teacher: `
            <rect x="15" y="25" width="70" height="42" rx="3" fill="#6C9B68"/>
            <path d="M25 38h22M25 48h34M25 58h18" stroke="#EAF1D8" stroke-width="3" stroke-linecap="round"/>
            <circle cx="62" cy="28" r="13" fill="#F4C7A1"/>
            <path d="M49 27c3-15 25-15 27 1-8-5-17-5-27-1Z" fill="#4A3025"/>
            <path d="M48 78c1-18 8-28 15-28 8 0 15 10 17 28" fill="#314A72"/>
            <path d="M40 48l-9 13" stroke="#6D4937" stroke-width="3" stroke-linecap="round"/>
        `,
        student: `
            <circle cx="50" cy="27" r="13" fill="#F4C7A1"/>
            <path d="M37 27c2-15 25-17 28 1-7-5-17-7-28-1Z" fill="#4A3025"/>
            <path d="M28 82c2-20 11-29 22-29s20 9 22 29" fill="#315C86"/>
            <rect x="56" y="52" width="17" height="24" rx="2" fill="#E7C64A"/>
            <path d="M34 65h32" stroke="#FFFFFF" stroke-width="3"/>
        `,
        doctor: `
            <circle cx="50" cy="27" r="13" fill="#F4C7A1"/>
            <path d="M37 26c2-15 25-17 28 1-7-5-17-7-28-1Z" fill="#4A3025"/>
            <path d="M27 82c2-20 11-29 23-29s21 9 23 29" fill="#F7F7F4" stroke="#D6D8DE" stroke-width="2"/>
            <path d="M50 58v18M43 67h14" stroke="#D85C5C" stroke-width="4" stroke-linecap="round"/>
            <path d="M60 58c8 4 10 9 10 17" fill="none" stroke="#8FA2B5" stroke-width="3"/>
        `,
        researcher: `
            <circle cx="50" cy="27" r="13" fill="#F4C7A1"/>
            <path d="M37 26c2-15 25-17 28 1-7-5-17-7-28-1Z" fill="#4A3025"/>
            <path d="M28 82c2-20 11-29 22-29s20 9 22 29" fill="#5C7B68"/>
            <circle cx="67" cy="66" r="10" fill="#DDECF4" stroke="#6C8798" stroke-width="3"/>
            <path d="M74 73l8 8" stroke="#6C8798" stroke-width="3" stroke-linecap="round"/>
        `
    };

    function svg(inner, label) {
        return `<svg class="lesson-illustration" viewBox="0 0 100 100" role="img" aria-label="${label}">${inner}</svg>`;
    }

    function building(type) {
        if (type === "hospital") {
            return svg(`<rect x="18" y="25" width="64" height="55" rx="3" fill="#E8EEF2" stroke="#718394" stroke-width="2"/><rect x="43" y="34" width="14" height="26" fill="#FFFFFF"/><path d="M50 38v18M44 47h12" stroke="#D95B5B" stroke-width="4"/><rect x="28" y="38" width="10" height="10" fill="#B9D7E8"/><rect x="62" y="38" width="10" height="10" fill="#B9D7E8"/><rect x="29" y="57" width="10" height="10" fill="#B9D7E8"/><rect x="61" y="57" width="10" height="10" fill="#B9D7E8"/>`, "hospital");
        }
        return svg(`<rect x="18" y="27" width="64" height="53" rx="3" fill="#E9EEF3" stroke="#718394" stroke-width="2"/><path d="M28 42h44M28 54h44M28 66h44" stroke="#A9C4D7" stroke-width="7"/><rect x="43" y="69" width="14" height="11" fill="#708CA0"/><circle cx="50" cy="20" r="8" fill="#E7C64A"/><path d="M50 15v10M45 20h10" stroke="#FFFFFF" stroke-width="2"/>`, "university");
    }

    function flag(country) {
        const flags = {
            "アメリカ": `<rect x="17" y="25" width="66" height="44" rx="3" fill="#FFF" stroke="#778" stroke-width="2"/><path d="M18 31h64M18 39h64M18 47h64M18 55h64M18 63h64" stroke="#D95B5B" stroke-width="5"/><rect x="18" y="25" width="29" height="23" fill="#3E5F9B"/><circle cx="27" cy="32" r="1.5" fill="#FFF"/><circle cx="35" cy="38" r="1.5" fill="#FFF"/><circle cx="42" cy="31" r="1.5" fill="#FFF"/>`,
            "イギリス": `<rect x="17" y="25" width="66" height="44" rx="3" fill="#345B9A"/><path d="M17 25l66 44M83 25L17 69" stroke="#FFF" stroke-width="9"/><path d="M17 25l66 44M83 25L17 69" stroke="#D95B5B" stroke-width="4"/><path d="M50 25v44M17 47h66" stroke="#FFF" stroke-width="11"/><path d="M50 25v44M17 47h66" stroke="#D95B5B" stroke-width="5"/>`,
            "インド": `<rect x="17" y="25" width="66" height="44" rx="3" fill="#FFF"/><path d="M18 25h64v14H18z" fill="#E88A3D"/><path d="M18 55h64v14H18z" fill="#4E9A5A"/><circle cx="50" cy="47" r="7" fill="none" stroke="#345B9A" stroke-width="2"/>`,
            "インドネシア": `<rect x="17" y="25" width="66" height="22" rx="3" fill="#D95B5B"/><path d="M17 47h66v22H17z" fill="#FFF"/>`,
            "かんこく": `<rect x="17" y="25" width="66" height="44" rx="3" fill="#FFF" stroke="#778" stroke-width="2"/><circle cx="50" cy="47" r="10" fill="none" stroke="#D95B5B" stroke-width="5"/><path d="M42 40c5 6 11 8 16 1" fill="none" stroke="#345B9A" stroke-width="5"/>`,
            "タイ": `<rect x="17" y="25" width="66" height="44" rx="3" fill="#FFF"/><path d="M17 25h66v8H17zM17 61h66v8H17z" fill="#D95B5B"/><path d="M17 33h66v28H17z" fill="#FFF"/><path d="M17 39h66v16H17z" fill="#345B9A"/>`,
            "ちゅうごく": `<rect x="17" y="25" width="66" height="44" rx="3" fill="#D95B5B"/><text x="30" y="49" font-size="22" fill="#F7D65C">★</text>`,
            "ドイツ": `<rect x="17" y="25" width="66" height="44" rx="3" fill="#D95B5B"/><path d="M17 40h66v14H17z" fill="#E7C64A"/><path d="M17 25h66v15H17z" fill="#252A31"/>`,
            "にほん": `<rect x="17" y="25" width="66" height="44" rx="3" fill="#FFF" stroke="#778" stroke-width="2"/><circle cx="50" cy="47" r="11" fill="#D95B5B"/>`,
            "ブラジル": `<rect x="17" y="25" width="66" height="44" rx="3" fill="#4E9A5A"/><path d="M50 29l28 18-28 18-28-18z" fill="#E7C64A"/><circle cx="50" cy="47" r="10" fill="#345B9B"/>`
        };
        return svg(flags[country] || `<rect x="20" y="28" width="60" height="42" rx="4" fill="#DCE5EA" stroke="#718394" stroke-width="2"/>`, country);
    }

    function illustrationFor(jp) {
        if (!lesson1Visuals.has(jp)) return "";
        if (jp === "せんせい" || jp === "きょうし") return svg(people.teacher, "teacher");
        if (jp === "がくせい") return svg(people.student, "student");
        if (jp === "いしゃ") return svg(people.doctor, "doctor");
        if (jp === "けんきゅうしゃ") return svg(people.researcher, "researcher");
        if (["わたし", "あなた", "あのひと（あのかた）", "かいしゃいん", "しゃいん", "ぎんこういん"].includes(jp)) return svg(people.normal, "person");
        if (jp === "だいがく") return building("university");
        if (jp === "びょういん") return building("hospital");
        if (jp === "だれ（どなた）") return svg(`<circle cx="36" cy="37" r="10" fill="#F4C7A1"/><circle cx="64" cy="37" r="10" fill="#F4C7A1"/><path d="M23 76c2-17 8-25 13-25s11 8 13 25M51 76c2-17 8-25 13-25s11 8 13 25" fill="#6C91C9"/><circle cx="50" cy="48" r="13" fill="#E7C64A"/><text x="44" y="55" font-size="20" font-weight="700" fill="#4A3025">?</text>`, "who");
        if (jp === "～さい" || jp === "なんさい／おいくつ") return svg(`<rect x="25" y="20" width="50" height="60" rx="5" fill="#FFF" stroke="#718394" stroke-width="2"/><rect x="25" y="20" width="50" height="13" rx="5" fill="#D95B5B"/><circle cx="50" cy="54" r="15" fill="#E7C64A"/><text x="45" y="61" font-size="22" font-weight="700" fill="#4A3025">?</text>`, "age");
        if (jp === "はい") return svg(`<circle cx="50" cy="50" r="30" fill="#6AA66A"/><path d="M34 51l10 10 23-25" fill="none" stroke="#FFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`, "yes");
        if (jp === "いいえ") return svg(`<circle cx="50" cy="50" r="30" fill="#D95B5B"/><path d="M36 36l28 28M64 36L36 64" stroke="#FFF" stroke-width="7" stroke-linecap="round"/>`, "no");
        if (jp === "～さん" || jp === "～ちゃん" || jp === "～じん") return "";
        if (["アメリカ","イギリス","インド","インドネシア","かんこく","タイ","ちゅうごく","ドイツ","にほん","ブラジル"].includes(jp)) return flag(jp);
        return "";
    }

    function enhance() {
        if (!location.pathname.includes("lessons")) return;
        document.querySelectorAll("#grid .card").forEach(card => {
            if (card.querySelector(".lesson-illustration")) return;
            const frontValue = card.querySelector(".front > div");
            if (!frontValue) return;
            const jp = frontValue.textContent.trim();
            const art = illustrationFor(jp);
            if (!art) return;
            const front = card.querySelector(".front");
            const back = card.querySelector(".back");
            if (front) front.insertAdjacentHTML("beforeend", art);
            if (back) back.insertAdjacentHTML("afterbegin", art);
        });
    }

    function init() {
        enhance();
        const grid = document.getElementById("grid");
        if (grid) new MutationObserver(enhance).observe(grid, { childList: true });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
