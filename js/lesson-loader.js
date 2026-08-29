// Lazy lesson loader
// Only the lesson(s) selected in the Lesson filter are fetched and kept in memory.
(function () {
    const store = window.__lessonDataStore;
    const loaded = new Set();
    const loading = new Map();

    if (!store || !Array.isArray(window.LESSON_KEYS) && typeof LESSON_KEYS === 'undefined') return;

    function lessonKeys() {
        return Array.isArray(window.LESSON_KEYS)
            ? window.LESSON_KEYS.slice()
            : Array.from({ length: 25 }, (_, i) => `lesson${i + 1}`);
    }

    async function loadLesson(key) {
        if (loaded.has(key)) return true;
        if (loading.has(key)) return loading.get(key);

        const lessonUrl = new URL(`js/lessons/${key}.js`, document.baseURI).href;

        const promise = fetch(lessonUrl, { cache: 'force-cache' })
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${key}: HTTP ${response.status}`);
                return response.text();
            })
            .then(source => {
                // Lesson files start with a comment, e.g. "// Lesson 1", before
                // the const declaration. The previous parser incorrectly
                // required const to be the first non-whitespace token.
                const match = source.match(/(?:^|\n)\s*const\s+(lesson\d+)\s*=\s*/);
                if (!match || match[1] !== key) throw new Error(`Invalid lesson data format: ${key}`);

                const replacement = match[0].startsWith('\n')
                    ? '\nwindow.__lessonDataStore.' + key + ' = '
                    : 'window.__lessonDataStore.' + key + ' = ';
                const executable = source.replace(match[0], replacement);
                new Function(executable)();

                if (!store[key]) throw new Error(`Lesson data did not initialize: ${key}`);
                loaded.add(key);
                return true;
            })
            .catch(error => {
                console.error('[LessonLoader]', error);
                return false;
            })
            .finally(() => loading.delete(key));

        loading.set(key, promise);
        return promise;
    }

    async function syncSelectedLessons() {
        const panel = document.getElementById('lessonPanel');
        if (!panel) return;

        const selected = Array.from(panel.querySelectorAll('input[type="checkbox"][value^="lesson"]'))
            .filter(box => box.checked)
            .map(box => box.value);

        const wanted = new Set(selected.length ? selected : ['lesson1']);

        Object.keys(store).forEach(key => {
            if (!wanted.has(key)) delete store[key];
        });
        Array.from(loaded).forEach(key => {
            if (!wanted.has(key)) loaded.delete(key);
        });

        const results = await Promise.all(Array.from(wanted, loadLesson));
        if (results.every(Boolean)) {
            const typePanel = document.getElementById('typePanel');
            if (typePanel) typePanel.dispatchEvent(new Event('change', { bubbles: true }));
            document.dispatchEvent(new CustomEvent('lessonDataLoaded', {
                detail: { lessons: Array.from(wanted) }
            }));
        }
    }

    window.lessonLoader = { loadLesson, syncSelectedLessons };

    document.addEventListener('change', event => {
        const target = event.target;
        if (target?.matches?.('#lessonPanel input[type="checkbox"][value^="lesson"]')) {
            syncSelectedLessons();
        }
    }, true);

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(syncSelectedLessons, 0);
    });
})();
