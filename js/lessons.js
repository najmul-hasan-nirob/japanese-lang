// Lesson data registry
// Each lesson is stored in its own file under /js/lessons/.
// The lesson files are loaded by lessons.html BEFORE this file.

const lessonsData = {
    lesson1,
    lesson2,
    lesson3,
    lesson4,
    lesson5,
    lesson6,
    lesson7,
    lesson8,
    lesson9,
    lesson10,
    lesson11,
    lesson12,
    lesson13,
    lesson14,
    lesson15,
    lesson16,
    lesson17,
    lesson18,
    lesson19,
    lesson20,
    lesson21,
    lesson22,
    lesson23,
    lesson24,
    lesson25
};

function sortedLessonKeys() {
    return Object.keys(lessonsData).sort((a, b) => {
        const na = parseInt(a.replace("lesson", ""), 10);
        const nb = parseInt(b.replace("lesson", ""), 10);
        return na - nb;
    });
}

function lessonLabel(key) {
    const number = key.replace(/^lesson/i, "");
    return `Lesson ${number}`;
}

// Build the cards expected by lesson-filter.js.
function buildLessonCards(key) {
    const lesson = lessonsData[key];
    if (!lesson) return [];

    const cards = [];

    if (Array.isArray(lesson.vocabulary)) {
        lesson.vocabulary.forEach(item => {
            if (!item || !item.jp) return;
            cards.push({
                ...item,
                type: "vocabulary",
                lesson: lessonLabel(key)
            });
        });
    }

    if (Array.isArray(lesson.grammar)) {
        lesson.grammar.forEach(item => {
            if (!item) return;

            // Grammar entries use pattern/note/examples in the lesson files.
            // Convert each grammar point into a card while preserving its data.
            const pattern = item.pattern || item.jp || "";
            const note = item.note || item.en || "";

            cards.push({
                jp: pattern,
                en: note,
                type: "grammar",
                lesson: lessonLabel(key),
                grammar: item
            });
        });
    }

    return cards;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Default direction: Japanese first.
// lesson-filter.js reads this variable when rendering cards.
let showJapaneseFirst = true;

// The direction control is optional, so this is safe on pages where it doesn't exist.
document.addEventListener("DOMContentLoaded", () => {
    const direction = document.getElementById("direction");
    if (!direction) return;

    direction.addEventListener("click", () => {
        showJapaneseFirst = !showJapaneseFirst;
    });

    direction.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showJapaneseFirst = !showJapaneseFirst;
        }
    });
});
