// =====================================================
// Lesson 1 WebP visual memory illustrations
// =====================================================
// Lessons page only.
// Real WebP artwork is used on the BACK of selected Lesson 1
// vocabulary cards. Nothing is added to the card front.
// =====================================================

(function () {
    const illustrations = {
        "わたし": "watashi",
        "あなた": "anata",
        "せんせい": "sensei",
        "がくせい": "gakusei",
        "かいしゃいん": "kaisha"
    };

    function normalize(text) {
        return String(text || "").replace(/\s+/g, " ").trim();
    }

    function addIllustrations() {
        // Only vocabulary cards from Lesson 1 get artwork.
        document.querySelectorAll("#grid .card").forEach(card => {
            if (card.dataset.lessonIllustration === "done") return;

            const front = card.querySelector(".front");
            const back = card.querySelector(".back.vocabulary-back, .back");
            if (!front || !back) return;

            const key = Object.keys(illustrations).find(word => normalize(front.textContent).includes(word));
            const asset = key && window.lesson1WebP ? lesson1WebP[illustrations[key]] : null;
            if (!asset) return;

            const visual = document.createElement("img");
            visual.className = "lesson-illustration";
            visual.src = asset;
            visual.alt = "";
            visual.setAttribute("aria-hidden", "true");
            visual.decoding = "async";

            // IMPORTANT: artwork is added ONLY to the back.
            back.appendChild(visual);
            card.dataset.lessonIllustration = "done";
        });
    }

    function init() {
        addIllustrations();
        const grid = document.getElementById("grid");
        if (grid) {
            new MutationObserver(addIllustrations).observe(grid, { childList: true });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
