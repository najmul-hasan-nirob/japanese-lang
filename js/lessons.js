// Lesson data registry
// Lesson files are now loaded on demand by lesson-loader.js.
// Only the lesson(s) selected by the user are kept in memory.

const LESSON_KEYS = Array.from({ length: 25 }, (_, i) => `lesson${i + 1}`);
const lessonsData = {};
window.__lessonDataStore = lessonsData;

function sortedLessonKeys() {
    return LESSON_KEYS.slice();
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

// Stable card identity. Meaning text is deliberately excluded.
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
        if (!value || typeof value !== "object") return { version: 5, states: {} };
        if (Array.isArray(value.order) && Array.isArray(value.cards)) {
            const key = value.cards.slice().sort().join("\u001e");
            return { version: 5, states: { [key]: { cards: value.cards, order: value.order, updatedAt: Number(value.updatedAt || 0) } } };
        }
        return value.states && typeof value.states === "object"
            ? { version: 5, states: value.states }
            : { version: 5, states: {} };
    } catch (_) {
        return { version: 5, states: {} };
    }
}

function writeLessonShuffleState(array) {
    try {
        const cards = array.map(lessonShuffleId);
        const key = lessonShuffleSetKey(array);
        const store = readLessonShuffleStore();
        store.states[key] = {
            cards: cards.slice(),
            order: cards.slice(),
            updatedAt: Date.now()
        };
        store.version = 5;
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
    const forceNew = window.lessonForceShuffle === true;
    window.lessonForceShuffle = false;

    const saved = readLessonShuffleState(array);
    if (!forceNew && saved && restoreLessonShuffle(array, saved)) return array;
    if (!forceNew) return array;

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    writeLessonShuffleState(array);
    return array;
}

let showJapaneseFirst = true;
