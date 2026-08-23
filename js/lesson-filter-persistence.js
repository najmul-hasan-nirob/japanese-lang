// =====================================================
// Lesson filter persistence
// =====================================================
// Keeps the Lessons page selection in the existing local cache and lets
// supabase-sync.js include the related UI state in Cloud Sync.
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
            return {
                selectedLessons: selectedLessons.length ? selectedLessons : ["lesson1"]
            };
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

        // Preserve the other synced UI state. Changing Lesson selection should
        // not accidentally turn off Screen Always On or erase the last shuffle.
        let current = {};
        try { current = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (_) {}

        const value = {
            selectedLessons: selectedLessons.length ? selectedLessons : ["lesson1"],
            ...current
        };
        value.selectedLessons = selectedLessons.length ? selectedLessons : ["lesson1"];

        try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (_) {}
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
            const target = boxes.find(cb => cb.checked) || boxes[0];
            target.dispatchEvent(new Event("change", { bubbles: true }));
        }

        return true;
    }

    function init() {
        const panel = document.getElementById("lessonPanel");
        if (!panel) return;
        restoreSelectedLessons();
        panel.addEventListener("change", event => {
            if (event.target?.matches("input[type=checkbox][value^='lesson']")) {
                saveSelectedLessons();
            }
        });
    }

    window.addEventListener("japaneseLangCloudLoaded", () => {
        restoreSelectedLessons();
    });

    document.addEventListener("DOMContentLoaded", init);
})();
