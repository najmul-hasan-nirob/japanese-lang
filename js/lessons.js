// Lesson data registry
// Each lesson is stored in its own file under /js/lessons/.
// The lesson files are loaded by lessons.html BEFORE this file.

const lessonsData = {
    lesson1, lesson2, lesson3, lesson4, lesson5,
    lesson6, lesson7, lesson8, lesson9, lesson10,
    lesson11, lesson12, lesson13, lesson14, lesson15,
    lesson16, lesson17, lesson18, lesson19, lesson20,
    lesson21, lesson22, lesson23, lesson24, lesson25
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

function buildLessonCards(key) {
    const lesson = lessonsData[key];
    if (!lesson) return [];
    const cards = [];

    if (Array.isArray(lesson.vocabulary)) lesson.vocabulary.forEach(item => {
        if (!item || !item.jp) return;
        cards.push({ ...item, type: "vocabulary", lesson: lessonLabel(key) });
    });
    if (Array.isArray(lesson.cpart)) lesson.cpart.forEach(item => {
        if (!item || !item.jp) return;
        cards.push({ ...item, type: "cpart", lesson: lessonLabel(key) });
    });
    if (Array.isArray(lesson.country)) lesson.country.forEach(item => {
        if (!item || !item.jp) return;
        cards.push({ ...item, type: "country", lesson: lessonLabel(key) });
    });
    if (Array.isArray(lesson.grammar)) lesson.grammar.forEach(item => {
        if (!item) return;
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
    return cards;
}

// Use only immutable card identity here. Do NOT include the English/Bangla
// meaning because those fields can be changed by data/meaning fixes without
// changing which cards are in the shuffle set.
function lessonShuffleId(card) {
    return [card.lesson || "", card.type || "", card.jp || ""].join("\u001f");
}

const LESSON_SHUFFLE_STORAGE = "japanese-lang-lesson-shuffle-v1";

function lessonShuffleSetKey(array) {
    return array.map(lessonShuffleId).slice().sort().join("\u001e");
}

function readLessonShuffleStore() {
    try {
        const value = JSON.parse(localStorage.getItem(LESSON_SHUFFLE_STORAGE) || "null");
        if (!value || typeof value !== "object") return { version: 4, states: {} };
        if (Array.isArray(value.order) && Array.isArray(value.cards)) {
            const key = value.cards.slice().sort().join("\u001e");
            return { version: 4, states: { [key]: { cards: value.cards, order: value.order, updatedAt: Number(value.updatedAt || 0) } } };
        }
        return value.states && typeof value.states === "object"
            ? { version: 4, states: value.states }
            : { version: 4, states: {} };
    } catch (_) {
        return { version: 4, states: {} };
    }
}

function writeLessonShuffleState(array) {
    try {
        const cards = array.map(lessonShuffleId);
        const key = lessonShuffleSetKey(array);
        const store = readLessonShuffleStore();
        const state = {
            cards: cards.slice(),
            order: cards.slice(),
            updatedAt: Date.now()
        };
        store.states[key] = state;
        store.version = 4;
        localStorage.setItem(LESSON_SHUFFLE_STORAGE, JSON.stringify(store));
        window.dispatchEvent(new CustomEvent("lessonShuffleStateChanged"));
    } catch (_) {}
}

function readLessonShuffleState(array) {
    const store = readLessonShuffleStore();
    const key = lessonShuffleSetKey(array);
    const state = store.states[key];
    return state && Array.isArray(state.order) ? state : null;
}

function restoreLessonShuffle(array, state) {
    if (!state || !Array.isArray(state.order)) return false;
    const currentIds = array.map(lessonShuffleId);
    if (currentIds.length !== state.order.length) return false;
    if (new Set(currentIds).size !== currentIds.length) return false;
    const positions = new Map(array.map(card => [lessonShuffleId(card), card]));
    if (state.order.some(id => !positions.has(id))) return false;
    array.splice(0, array.length, ...state.order.map(id => positions.get(id)));
    return true;
}

function shuffle(array) {
    // Only an explicit click on Shuffle is allowed to generate a new order.
    // Every other call restores the saved order. This is deliberately strict:
    // a reload must NEVER create another random order.
    const forceNew = window.lessonForceShuffle === true;
    window.lessonForceShuffle = false;

    if (!forceNew) {
        const saved = readLessonShuffleState(array);
        if (saved && restoreLessonShuffle(array, saved)) return array;
    }

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    writeLessonShuffleState(array);
    return array;
}

// Lessons always use Japanese as the card FRONT.
let showJapaneseFirst = true;
