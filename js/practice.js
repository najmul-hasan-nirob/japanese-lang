// Spaced-repetition Practice — local device only.
// Uses the same lesson vocabulary already loaded by lessons.js.
(() => {
    const STORAGE = "japanese-lang-spaced-repetition-v1";
    const HARD_STORAGE = "japanese-lang-hard-vocabulary";
    const intervals = { again: 10 * 60 * 1000, hard: 24 * 60 * 60 * 1000, good: 3 * 24 * 60 * 60 * 1000, easy: 7 * 24 * 60 * 60 * 1000 };
    let state = loadState();
    let queue = [];
    let index = 0;
    let answered = 0;

    function loadState() {
        try { return JSON.parse(localStorage.getItem(STORAGE) || "{}"); } catch (_) { return {}; }
    }
    function saveState() {
        try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch (_) {}
    }
    function hardWords() {
        try { const a = JSON.parse(localStorage.getItem(HARD_STORAGE) || "[]"); return new Set(Array.isArray(a) ? a : []); } catch (_) { return new Set(); }
    }
    function allVocabulary() {
        if (typeof lessonsData === "undefined") return [];
        const out = [];
        sortedLessonKeys().forEach(key => {
            const lesson = lessonsData[key];
            if (!lesson) return;
            ["vocabulary", "cpart", "country"].forEach(type => {
                (Array.isArray(lesson[type]) ? lesson[type] : []).forEach(item => {
                    if (!item?.jp) return;
                    const entry = { ...item, type, lesson: lessonLabel(key) };
                    entry.id = `${key}|${type}|${item.jp}|${item.en || ""}`;
                    entry.cardKey = [item.jp.trim(), toRomaji(item.jp).trim(), (item.en || "").trim()].join("|");
                    out.push(entry);
                });
            });
        });
        return out;
    }
    function now() { return Date.now(); }
    function getRecord(item) {
        if (!state[item.id]) state[item.id] = { interval: 0, repetitions: 0, correct: 0, incorrect: 0, nextReview: 0 };
        return state[item.id];
    }
    function dueItems() {
        const t = now();
        return allVocabulary().filter(item => {
            const r = state[item.id];
            return !r || !r.nextReview || r.nextReview <= t;
        });
    }
    function newItems() {
        return allVocabulary().filter(item => !state[item.id]?.repetitions);
    }
    function hardItems() {
        const h = hardWords();
        return allVocabulary().filter(item => h.has(item.cardKey));
    }
    function updateStats() {
        document.getElementById("dueCount").textContent = dueItems().length;
        document.getElementById("newCount").textContent = newItems().length;
        document.getElementById("hardCount").textContent = hardItems().length;
        const due = dueItems().length;
        const hard = hardItems().length;
        document.getElementById("startSummary").textContent = due ? `${due} vocabulary ${due === 1 ? "card is" : "cards are"} ready for review.` : `No reviews are due right now. You have ${hard} hard ${hard === 1 ? "word" : "words"} saved.`;
    }
    function renderCard() {
        const item = queue[index];
        if (!item) return finish();
        document.getElementById("practiceLesson").textContent = item.lesson;
        document.getElementById("practiceJapanese").textContent = item.jp;
        document.getElementById("practiceRomaji").textContent = toRomaji(item.jp);
        document.getElementById("practiceEnglish").textContent = item.en || "";
        document.getElementById("practiceBangla").textContent = item.bn || (typeof banglaMeaning === "function" ? banglaMeaning(item) : "");
        document.getElementById("practiceIllustration").innerHTML = "";
        document.getElementById("practiceAnswer").hidden = true;
        document.getElementById("ratingButtons").hidden = true;
        document.getElementById("showAnswer").hidden = false;
        document.getElementById("progressText").textContent = `${index + 1} / ${queue.length}`;
        document.querySelector("#progressBar i").style.width = `${((index) / queue.length) * 100}%`;
    }
    function speak(item) {
        const text = item.jp;
        if (typeof window.speakJapanese === "function") window.speakJapanese(text);
        else if ("speechSynthesis" in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = "ja-JP"; speechSynthesis.speak(u); }
    }
    function showAnswer() {
        document.getElementById("practiceAnswer").hidden = false;
        document.getElementById("showAnswer").hidden = true;
        document.getElementById("ratingButtons").hidden = false;
    }
    function rate(kind) {
        const item = queue[index];
        const r = getRecord(item);
        const oldInterval = r.interval || 0;
        r.repetitions = (r.repetitions || 0) + 1;
        if (kind === "again") {
            r.incorrect = (r.incorrect || 0) + 1;
            r.interval = intervals.again;
        } else {
            r.correct = (r.correct || 0) + 1;
            if (kind === "hard") r.interval = Math.max(intervals.hard, oldInterval ? Math.floor(oldInterval * 1.3) : intervals.hard);
            if (kind === "good") r.interval = Math.max(intervals.good, oldInterval ? oldInterval * 2 : intervals.good);
            if (kind === "easy") r.interval = Math.max(intervals.easy, oldInterval ? oldInterval * 3 : intervals.easy);
        }
        r.nextReview = now() + r.interval;
        saveState();
        answered++;
        index++;
        renderCard();
    }
    function start() {
        const due = dueItems();
        queue = due.slice().sort(() => Math.random() - 0.5);
        if (!queue.length) {
            const fresh = newItems().slice(0, 10).sort(() => Math.random() - 0.5);
            queue = fresh;
        }
        index = 0; answered = 0;
        document.getElementById("practiceStart").hidden = true;
        document.getElementById("practiceDone").hidden = true;
        document.getElementById("practiceCard").hidden = false;
        renderCard();
    }
    function finish() {
        document.getElementById("practiceCard").hidden = true;
        document.getElementById("practiceDone").hidden = false;
        document.getElementById("doneSummary").textContent = answered ? `You reviewed ${answered} ${answered === 1 ? "card" : "cards"}. Your next reviews have been scheduled.` : "There are no cards ready to review yet.";
        updateStats();
    }
    document.addEventListener("DOMContentLoaded", () => {
        if (!document.getElementById("practiceCard")) return;
        updateStats();
        document.getElementById("startPractice").addEventListener("click", start);
        document.getElementById("restartPractice").addEventListener("click", start);
        document.getElementById("showAnswer").addEventListener("click", showAnswer);
        document.getElementById("practiceSpeak").addEventListener("click", () => queue[index] && speak(queue[index]));
        document.querySelectorAll("#ratingButtons button").forEach(btn => btn.addEventListener("click", () => rate(btn.dataset.rating)));
    });
})();
