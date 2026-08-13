// Lesson 1 WebP visual memory illustrations
// Lessons page only. Artwork is shown on the BACK of vocabulary cards.
(function () {
    const spriteUrl = "/japanese-lang/assets/lesson1-vocab-sprite.webp";
    const illustrations = {
        "わたし": [0,0], "あなた": [1,0], "あのひと": [2,0], "あのかた": [2,0],
        "せんせい": [3,0], "がくせい": [4,0], "かいしゃいん": [5,0], "しゃいん": [5,0], "きょうし": [6,0],
        "ぎんこういん": [0,1], "いしゃ": [1,1], "けんきゅうしゃ": [2,1], "だいがく": [3,1], "びょういん": [4,1],
        "だれ": [5,1], "どなた": [5,1], "～さい": [6,1], "なんさい": [0,2], "おいくつ": [0,2],
        "～さん": [1,2], "～ちゃん": [2,2], "～じん": [3,2], "はい": [4,2], "いいえ": [5,2]
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
            if (!key) return;

            const [col, row] = illustrations[key];
            const visual = document.createElement("div");
            visual.className = "lesson-illustration";
            visual.setAttribute("aria-hidden", "true");
            visual.style.setProperty("--cell", window.matchMedia("(max-width: 520px)").matches ? "88px" : "120px");
            visual.style.backgroundImage = `url("${spriteUrl}")`;
            visual.style.setProperty("--sprite-col", col);
            visual.style.setProperty("--sprite-row", row);
            visual.style.backgroundRepeat = "no-repeat";
            visual.style.backgroundSize = "calc(var(--cell) * 7) calc(var(--cell) * 3)";
            visual.style.backgroundPosition = "calc(var(--cell) * var(--sprite-col) * -1) calc(var(--cell) * var(--sprite-row) * -1)";

            back.appendChild(visual);
            card.dataset.lessonIllustration = "done";
        });
    }

    function init() {
        addIllustrations();
        const grid = document.getElementById("grid");
        if (grid) new MutationObserver(addIllustrations).observe(grid, { childList: true });
        window.addEventListener("resize", () => {
            document.querySelectorAll(".lesson-illustration").forEach(el => {
                el.style.setProperty("--cell", window.matchMedia("(max-width: 520px)").matches ? "88px" : "120px");
            });
        });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
