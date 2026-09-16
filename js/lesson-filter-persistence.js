// =====================================================
// Lesson filter persistence
// =====================================================
(() => {
    const KEY = "japanese-lang-lesson-filter-v1";
    const DEFAULT = {
        selectedLessons: ["lesson1"],
        selectedTypes: ["vocabulary"],
        orderMode: "normal"
    };

    function normalize(value) {
        if (!value || typeof value !== "object") return { ...DEFAULT };
        const selectedLessons = Array.isArray(value.selectedLessons)
            ? value.selectedLessons.filter(item => typeof item === "string" && /^lesson\d+$/.test(item))
            : [];
        const selectedTypes = Array.isArray(value.selectedTypes)
            ? value.selectedTypes.filter(item => typeof item === "string")
            : [];
        const orderMode = value.orderMode === "shuffle" ? "shuffle" : "normal";
        return {
            selectedLessons: selectedLessons.length ? selectedLessons : ["lesson1"],
            selectedTypes: selectedTypes.length ? selectedTypes : ["vocabulary"],
            orderMode
        };
    }

    function getSaved() {
        try { return normalize(JSON.parse(localStorage.getItem(KEY) || "null")); }
        catch (_) { return { ...DEFAULT }; }
    }

    function saveState() {
        const panel = document.getElementById("lessonPanel");
        const typePanel = document.getElementById("typePanel");
        const mode = document.getElementById("mode");
        if (!panel) return;

        const selectedLessons = Array.from(
            panel.querySelectorAll("input[type=checkbox][value^='lesson']:checked")
        ).map(cb => cb.value);

        const selectedTypes = typePanel
            ? Array.from(typePanel.querySelectorAll("input[type=checkbox]:checked")).map(cb => cb.value)
            : getSaved().selectedTypes;

        const current = getSaved();
        const value = {
            ...current,
            selectedLessons: selectedLessons.length ? selectedLessons : ["lesson1"],
            selectedTypes: selectedTypes.length ? selectedTypes : ["vocabulary"],
            orderMode: mode?.value === "shuffle" ? "shuffle" : "normal"
        };

        try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (_) {}
        window.dispatchEvent(new CustomEvent("lessonFilterStateChanged"));
    }

    function restoreState() {
        const panel = document.getElementById("lessonPanel");
        const typePanel = document.getElementById("typePanel");
        const mode = document.getElementById("mode");
        if (!panel) return false;

        const saved = getSaved();
        const wantedLessons = new Set(saved.selectedLessons);
        const lessonBoxes = Array.from(
            panel.querySelectorAll("input[type=checkbox][value^='lesson']")
        );
        if (!lessonBoxes.length) return false;

        let changed = false;
        lessonBoxes.forEach(cb => {
            const checked = wantedLessons.has(cb.value);
            if (cb.checked !== checked) {
                cb.checked = checked;
                changed = true;
            }
        });

        const all = panel.querySelector("input[type=checkbox][value='all']");
        if (all) all.checked = lessonBoxes.length > 0 && lessonBoxes.every(cb => cb.checked);

        let typeChanged = false;
        if (typePanel) {
            const wantedTypes = new Set(saved.selectedTypes);
            const typeBoxes = Array.from(typePanel.querySelectorAll("input[type=checkbox]"));
            typeBoxes.forEach(cb => {
                const checked = wantedTypes.has(cb.value);
                if (cb.checked !== checked) {
                    cb.checked = checked;
                    typeChanged = true;
                }
            });
        }

        let modeChanged = false;
        if (mode && (mode.value === "normal" || mode.value === "shuffle") && mode.value !== saved.orderMode) {
            mode.value = saved.orderMode;
            modeChanged = true;
        }

        if (changed) {
            const target = lessonBoxes.find(cb => cb.checked) || lessonBoxes[0];
            target.dispatchEvent(new Event("change", { bubbles: true }));
        } else if (typeChanged && typePanel) {
            const target = typePanel.querySelector("input[type=checkbox]");
            target?.dispatchEvent(new Event("change", { bubbles: true }));
        } else if (modeChanged) {
            mode.dispatchEvent(new Event("change", { bubbles: true }));
        }

        // Hard vocabulary is injected dynamically, so after restoring the checkbox
        // explicitly notify its filter system that its saved state is active.
        const hardBox = typePanel?.querySelector("input[type=checkbox][value='hard']");
        if (hardBox && hardBox.checked) {
            hardBox.dispatchEvent(new Event("change", { bubbles: true }));
        }

        return true;
    }

    function init() {
        const panel = document.getElementById("lessonPanel");
        const typePanel = document.getElementById("typePanel");
        const mode = document.getElementById("mode");
        if (!panel) return;

        restoreState();

        panel.addEventListener("change", event => {
            if (event.target?.matches("input[type=checkbox][value^='lesson']")) saveState();
        });
        typePanel?.addEventListener("change", event => {
            if (event.target?.matches("input[type=checkbox]")) saveState();
        });
        mode?.addEventListener("change", saveState);

        document.addEventListener("hardVocabularyFilterReady", restoreState);
    }

    window.addEventListener("japaneseLangCloudLoaded", () => {
        restoreState();
    });

    document.addEventListener("DOMContentLoaded", init);
})();
