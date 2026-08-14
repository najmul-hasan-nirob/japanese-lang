// Spaced-repetition Practice — local device only.
(() => {
    const STORAGE = "japanese-lang-spaced-repetition-v1";
    const HARD_STORAGE = "japanese-lang-hard-vocabulary";
    const LESSON_FILTER_STORAGE = "japanese-lang-practice-lessons-v1";
    const intervals = {
        again: 10 * 60 * 1000,
        hard: 24 * 60 * 60 * 1000,
        good: 3 * 24 * 60 * 60 * 1000,
        easy: 7 * 24 * 60 * 60 * 1000
    };

    let state = loadState();
    let queue = [];
    let index = 0;
    let answered = 0;
    let practiceMode = "due";
    let selectedLessons = loadLessonSelection();

    function loadState() {
        try { return JSON.parse(localStorage.getItem(STORAGE) || "{}"); }
        catch (_) { return {}; }
    }

    function saveState() {
        try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch (_) {}
    }

    function hardWords() {
        try {
            const a = JSON.parse(localStorage.getItem(HARD_STORAGE) || "[]");
            return new Set(Array.isArray(a) ? a : []);
        } catch (_) { return new Set(); }
    }

    function loadLessonSelection() {
        try {
            const saved = JSON.parse(localStorage.getItem(LESSON_FILTER_STORAGE) || "null");
            return Array.isArray(saved) ? saved : [];
        } catch (_) { return []; }
    }

    function saveLessonSelection() {
        try { localStorage.setItem(LESSON_FILTER_STORAGE, JSON.stringify(selectedLessons)); } catch (_) {}
    }

    function allLessonKeys() {
        if (typeof lessonsData === "undefined" || typeof sortedLessonKeys !== "function") return [];
        return sortedLessonKeys();
    }

    function allVocabulary() {
        if (typeof lessonsData === "undefined" || typeof sortedLessonKeys !== "function") return [];
        const out = [];

        sortedLessonKeys().forEach(key => {
            const lesson = lessonsData[key];
            if (!lesson) return;

            ["vocabulary", "cpart", "country"].forEach(type => {
                (Array.isArray(lesson[type]) ? lesson[type] : []).forEach(item => {
                    if (!item || !item.jp) return;
                    const entry = {
                        ...item,
                        type,
                        lesson: lessonLabel(key),
                        lessonKey: key
                    };
                    const romaji = item.romaji || "";
                    entry.id = `${key}|${type}|${item.jp}|${item.en || ""}`;
                    entry.cardKey = [item.jp.trim(), romaji.trim(), (item.en || "").trim()].join("|");
                    out.push(entry);
                });
            });
        });

        return out;
    }

    function selectedItems(items) {
        if (!selectedLessons.length) return [];
        const selected = new Set(selectedLessons);
        return items.filter(item => selected.has(item.lessonKey));
    }

    function dueItems() {
        const t = Date.now();
        return selectedItems(allVocabulary()).filter(item => {
            const r = state[item.id];
            return !r || !r.nextReview || r.nextReview <= t;
        });
    }

    function newItems() {
        return selectedItems(allVocabulary()).filter(item => !state[item.id]?.repetitions);
    }

    function hardItems() {
        const h = hardWords();
        return selectedItems(allVocabulary()).filter(item => h.has(item.cardKey));
    }

    function getRecord(item) {
        if (!state[item.id]) {
            state[item.id] = {
                interval: 0,
                repetitions: 0,
                correct: 0,
                incorrect: 0,
                nextReview: 0
            };
        }
        return state[item.id];
    }

    function updateStats() {
        const due = dueItems().length;
        const fresh = newItems().length;
        const hard = hardItems().length;

        document.getElementById("dueCount").textContent = due;
        document.getElementById("newCount").textContent = fresh;
        document.getElementById("hardCount").textContent = hard;

        const summary = document.getElementById("startSummary");
        if (!selectedLessons.length) {
            summary.textContent = "Select at least one lesson to start practicing.";
            return;
        }

        const labels = selectedLessons.length === allLessonKeys().length
            ? "all lessons"
            : selectedLessons.map(key => lessonLabel(key)).join(", ");

        if (practiceMode === "hard") {
            summary.textContent = hard
                ? `${hard} hard ${hard === 1 ? "word" : "words"} from ${labels} are ready to practice.`
                : `No saved hard vocabulary in ${labels}.`;
        } else {
            summary.textContent = due
                ? `${due} vocabulary ${due === 1 ? "card is" : "cards are"} ready for review from ${labels}.`
                : `No reviews are due right now in ${labels}. You have ${fresh} new ${fresh === 1 ? "word" : "words"}.`;
        }
    }

    function renderLessonChoices() {
        const container = document.getElementById("lessonChoices");
        if (!container) return;

        const keys = allLessonKeys();
        if (!selectedLessons.length && keys.length) selectedLessons = keys.slice();

        container.innerHTML = keys.map(key => {
            const checked = selectedLessons.includes(key) ? " checked" : "";
            return `<label class="lesson-choice"><input type="checkbox" value="${key}"${checked}><span>${lessonLabel(key)}</span></label>`;
        }).join("");

        container.querySelectorAll("input[type=checkbox]").forEach(input => {
            input.addEventListener("change", () => {
                selectedLessons = Array.from(container.querySelectorAll("input:checked")).map(box => box.value);
                saveLessonSelection();
                updateStats();
            });
        });
    }

    function renderCard() {
        const item = queue[index];
        if (!item) return finish();

        document.getElementById("practiceLesson").textContent = item.lesson;
        document.getElementById("practiceJapanese").textContent = item.jp;
        document.getElementById("practiceRomaji").textContent = item.romaji || "";
        document.getElementById("practiceEnglish").textContent = item.en || "";
        document.getElementById("practiceBangla").textContent = item.bn || "";
        document.getElementById("practiceIllustration").innerHTML = "";
        document.getElementById("practiceAnswer").hidden = true;
        document.getElementById("ratingButtons").hidden = true;
        document.getElementById("showAnswer").hidden = false;
        document.getElementById("progressText").textContent = `${index + 1} / ${queue.length}`;
        document.querySelector("#progressBar i").style.width = `${(index / queue.length) * 100}%`;
    }

    function speak(item) {
        if (typeof window.speakJapanese === "function") {
            window.speakJapanese(item.jp);
        } else if ("speechSynthesis" in window) {
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(item.jp);
            u.lang = "ja-JP";
            speechSynthesis.speak(u);
        }
    }

    function showAnswer() {
        document.getElementById("practiceAnswer").hidden = false;
        document.getElementById("showAnswer").hidden = true;
        document.getElementById("ratingButtons").hidden = false;
    }

    function rate(kind) {
        const item = queue[index];
        if (!item) return;

        const r = getRecord(item);
        const old = r.interval || 0;
        r.repetitions = (r.repetitions || 0) + 1;

        if (kind === "again") {
            r.incorrect = (r.incorrect || 0) + 1;
            r.interval = intervals.again;
        } else {
            r.correct = (r.correct || 0) + 1;
            if (kind === "hard") r.interval = Math.max(intervals.hard, old ? Math.floor(old * 1.3) : intervals.hard);
            if (kind === "good") r.interval = Math.max(intervals.good, old ? old * 2 : intervals.good);
            if (kind === "easy") r.interval = Math.max(intervals.easy, old ? old * 3 : intervals.easy);
        }

        r.nextReview = Date.now() + r.interval;
        saveState();
        answered++;
        index++;
        renderCard();
    }

    function start() {
        if (!selectedLessons.length) {
            updateStats();
            return;
        }

        if (practiceMode === "hard") {
            queue = hardItems().slice().sort(() => Math.random() - 0.5);
        } else {
            queue = dueItems().slice().sort(() => Math.random() - 0.5);
            if (!queue.length) queue = newItems().slice(0, 10).sort(() => Math.random() - 0.5);
        }

        index = 0;
        answered = 0;
        document.getElementById("practiceStart").hidden = true;
        document.getElementById("practiceDone").hidden = true;
        document.getElementById("practiceCard").hidden = false;

        if (!queue.length) {
            finish();
            return;
        }

        renderCard();
    }

    function finish() {
        document.getElementById("practiceCard").hidden = true;
        document.getElementById("practiceDone").hidden = false;
        document.getElementById("doneSummary").textContent = answered
            ? `You reviewed ${answered} ${answered === 1 ? "card" : "cards"}. Your next reviews have been scheduled.`
            : practiceMode === "hard"
                ? "There are no saved hard vocabulary cards in the selected lessons."
                : "There are no cards ready to review yet.";
        updateStats();
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (!document.getElementById("practiceCard")) return;

        renderLessonChoices();
        updateStats();

        document.getElementById("startPractice").addEventListener("click", () => {
            practiceMode = "due";
            start();
        });

        document.getElementById("hardPractice").addEventListener("click", () => {
            practiceMode = "hard";
            updateStats();
            start();
        });

        document.getElementById("restartPractice").addEventListener("click", start);
        document.getElementById("showAnswer").addEventListener("click", showAnswer);
        document.getElementById("practiceSpeak").addEventListener("click", () => {
            if (queue[index]) speak(queue[index]);
        });

        document.querySelectorAll("#ratingButtons button").forEach(btn => {
            btn.addEventListener("click", () => rate(btn.dataset.rating));
        });

        document.getElementById("selectAllLessons").addEventListener("click", () => {
            selectedLessons = allLessonKeys();
            saveLessonSelection();
            renderLessonChoices();
            updateStats();
        });

        document.getElementById("clearLessons").addEventListener("click", () => {
            selectedLessons = [];
            saveLessonSelection();
            renderLessonChoices();
            updateStats();
        });
    });
})();
