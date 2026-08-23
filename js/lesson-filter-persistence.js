// =====================================================
// Lesson filter persistence
// =====================================================
// Keeps Lesson selection + Order mode in the existing local cache and lets
// supabase-sync.js include the same state in Cloud Sync.
// =====================================================
(() => {
    const KEY = "japanese-lang-lesson-filter-v1";
    const DEFAULT = { selectedLessons: ["lesson1"], orderMode: "normal" };

    function normalize(value) {
        if (!value || typeof value !== "object") return { ...DEFAULT };
        const selectedLessons = Array.isArray(value.selectedLessons)
            ? value.selectedLessons.filter(item => typeof item === "string" && /^lesson\d+$/.test(item))
            : [];
        const orderMode = value.orderMode === "shuffle" ? "shuffle" : "normal";
        return {
            selectedLessons: selectedLessons.length ? selectedLessons : ["lesson1"],
            orderMode
        };
    }

    function getSaved() {
        try { return normalize(JSON.parse(localStorage.getItem(KEY) || "null")); }
        catch (_) { return { ...DEFAULT }; }
    }

    function saveState() {
        const panel = document.getElementById("lessonPanel");
        const mode = document.getElementById("mode");
        if (!panel) return;

        const selectedLessons = Array.from(
            panel.querySelectorAll("input[type=checkbox][value^='lesson']:checked")
        ).map(cb => cb.value);

        const current = getSaved();
        const value = {
            ...current,
            selectedLessons: selectedLessons.length ? selectedLessons : ["lesson1"],
            orderMode: mode?.value === "shuffle" ? "shuffle" : "normal"
        };

        try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (_) {}
        window.dispatchEvent(new CustomEvent("lessonFilterStateChanged"));
    }

    function restoreState() {
        const panel = document.getElementById("lessonPanel");
        const mode = document.getElementById("mode");
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

        let modeChanged = false;
        if (mode && (mode.value === "normal" || mode.value === "shuffle") && mode.value !== saved.orderMode) {
            mode.value = saved.orderMode;
            modeChanged = true;
        }

        if (changed) {
            const target = boxes.find(cb => cb.checked) || boxes[0];
            target.dispatchEvent(new Event("change", { bubbles: true }));
        } else if (modeChanged) {
            mode.dispatchEvent(new Event("change", { bubbles: true }));
        }

        return true;
    }

    function init() {
        const panel = document.getElementById("lessonPanel");
        const mode = document.getElementById("mode");
        if (!panel) return;

        restoreState();

        panel.addEventListener("change", event => {
            if (event.target?.matches("input[type=checkbox][value^='lesson']")) saveState();
        });
        mode?.addEventListener("change", saveState);
    }

    window.addEventListener("japaneseLangCloudLoaded", () => {
        // Cloud Sync has already written the cloud values into localStorage.
        // Restore both Lesson and Order after that pull, including Shuffle.
        restoreState();
    });

    document.addEventListener("DOMContentLoaded", init);
})();
