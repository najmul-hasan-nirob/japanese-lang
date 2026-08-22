// =====================================================
// Lesson filter persistence
// =====================================================
// Keeps the Lessons page selection in the existing local
// cache and lets supabase-sync.js include it in Cloud Sync.
// =====================================================
(() => {
    const KEY = "japanese-lang-lesson-filter-v1";
    const DEFAULT = { selectedLessons: ["lesson1"] };

    function getSaved() {
        try {
            const value = JSON.parse(localStorage.getItem(KEY) || "null");
            if (!value || !Array.isArray(value.selectedLessons)) return DEFAULT;
            const selectedLessons = value.selectedLessons.filter(
                item => typeof item === "string" && /^lesson\d+$/.test(item)
            );
            return { selectedLessons: selectedLessons.length ? selectedLessons : ["lesson1"] };
        } catch (_) {
            return DEFAULT;
        }
    }

    function saveSelectedLessons() {
        const panel = document.getElementById("lessonPanel");
        if (!panel) return;
        const selectedLessons = Array.from(
            panel.querySelectorAll("input[type=checkbox][value^='lesson']:checked")
        ).map(cb => cb.value);

        const value = {
            selectedLessons: selectedLessons.length ? selectedLessons : ["lesson1"]
        };

        try {
            localStorage.setItem(KEY, JSON.stringify(value));
        } catch (_) {}
    }

    function restoreSelectedLessons() {
        const panel = document.getElementById("lessonPanel");
        if (!panel) return false;

        const saved = getSaved();
        const wanted = new Set(saved.selectedLessons);
        const boxes = Array.from(
            panel.querySelectorAll("input[type=checkbox][value^='lesson']")
        );
        if (!boxes.length) return false;

        let changed = false;
        boxes.forEach(cb => {
            const checked = wanted.has(cb.value);
            if (cb.checked !== checked) {
                cb.checked = checked;
                changed = true;
            }
        });

        const all = panel.querySelector("input[type=checkbox][value='all']");
        if (all) all.checked = boxes.length > 0 && boxes.every(cb => cb.checked);

        if (changed) {
            // lesson-filter.js owns the actual rendering. Trigger one of its
            // existing checkbox handlers instead of duplicating its logic.
            const target = boxes.find(cb => cb.checked) || boxes[0];
            target.dispatchEvent(new Event("change", { bubbles: true }));
        }

        return true;
    }

    function init() {
        const panel = document.getElementById("lessonPanel");
        if (!panel) return;

        // lesson-filter.js creates the checkboxes during DOMContentLoaded.
        // This listener runs after it because that script is loaded first.
        restoreSelectedLessons();

        panel.addEventListener("change", event => {
            if (event.target?.matches("input[type=checkbox][value^='lesson']")) {
                saveSelectedLessons();
            }
        });
    }

    // Cloud sync finishes its async pull after the page's initial render.
    // Restore the cloud value when that event arrives.
    window.addEventListener("japaneseLangCloudLoaded", () => {
        restoreSelectedLessons();
    });

    document.addEventListener("DOMContentLoaded", init);
})();
