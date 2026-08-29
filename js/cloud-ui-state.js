// =====================================================
// Japanese Lang — Local-only toolbar / mobile control state
// =====================================================
// Toolbar and mobile sticky-button state is intentionally NOT cloud synced.
// Supabase Cloud Sync is reserved for learning data and lesson-filter state.
// This file keeps the existing localStorage persistence only.
// =====================================================
(() => {
    const KEY = "japanese-lang-ui-state-v1";
    let restoring = false;

    function pageKey() {
        const path = (location.pathname || "/").replace(/\/+$/, "");
        return path || "/";
    }

    function read() {
        try {
            const value = JSON.parse(localStorage.getItem(KEY) || "null");
            return value && typeof value === "object" ? value : {};
        } catch (_) { return {}; }
    }

    function write(value) {
        try {
            localStorage.setItem(KEY, JSON.stringify(value));
            window.dispatchEvent(new CustomEvent("japaneseLangUIStateChanged"));
        } catch (_) {}
    }

    function controls() {
        const result = [];
        const seen = new Set();
        document.querySelectorAll(
            ".toolbar select, .toolbar input[type=checkbox], .toolbar button[aria-pressed], .toolbar .abacus[aria-pressed], " +
            ".mobile-bottom-controls select, .mobile-bottom-controls input[type=checkbox], .mobile-bottom-controls button[aria-pressed], .mobile-bottom-controls .abacus[aria-pressed]"
        ).forEach(el => {
            if (!el.id || seen.has(el.id)) return;
            if (el.id === "screenWakeToggle") return;
            if (el.closest("#lessonPanel")) return;
            seen.add(el.id);
            result.push(el);
        });
        return result;
    }

    function capture() {
        const state = {};
        controls().forEach(el => {
            if (el.matches("select")) {
                state[el.id] = { type: "select", value: el.value };
            } else if (el.matches("input[type=checkbox]")) {
                state[el.id] = { type: "checkbox", checked: el.checked };
            } else if (el.getAttribute("aria-pressed") !== null) {
                state[el.id] = {
                    type: "pressed",
                    pressed: el.getAttribute("aria-pressed") === "true"
                };
            }
        });
        return state;
    }

    function save() {
        if (restoring) return;
        const all = read();
        all[pageKey()] = {
            updatedAt: Date.now(),
            controls: capture()
        };
        write(all);
    }

    function restore() {
        const saved = read()[pageKey()];
        if (!saved || !saved.controls) return;

        const map = saved.controls;
        restoring = true;
        try {
            controls().forEach(el => {
                const state = map[el.id];
                if (!state) return;

                if (state.type === "select" && el.value !== state.value) {
                    const option = Array.from(el.options).find(o => o.value === state.value);
                    if (option) {
                        el.value = state.value;
                        el.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                } else if (state.type === "checkbox" && el.checked !== state.checked) {
                    el.checked = state.checked;
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                } else if (state.type === "pressed") {
                    const current = el.getAttribute("aria-pressed") === "true";
                    if (current !== state.pressed) el.click();
                }
            });
        } finally {
            restoring = false;
        }
    }

    function init() {
        // Capture phase ensures controls that stop propagation are still saved.
        document.addEventListener("click", event => {
            if (restoring) return;
            const control = event.target.closest(
                ".toolbar button[aria-pressed], .toolbar .abacus[aria-pressed], " +
                ".mobile-bottom-controls button[aria-pressed], .mobile-bottom-controls .abacus[aria-pressed]"
            );
            if (control && control.id !== "screenWakeToggle") setTimeout(save, 0);
        }, true);

        document.addEventListener("change", event => {
            if (restoring) return;
            if (
                event.target.closest(".toolbar, .mobile-bottom-controls") &&
                !event.target.closest("#lessonPanel")
            ) save();
        });

        // Custom direction event is local-only; it never enters Supabase.
        window.addEventListener("japaneseLangDirectionChanged", () => {
            if (!restoring) save();
        });

        // Fallback bubble listener for controls that allow propagation.
        document.addEventListener("click", event => {
            if (restoring) return;
            const control = event.target.closest(
                ".toolbar button[aria-pressed], .toolbar .abacus[aria-pressed], " +
                ".mobile-bottom-controls button[aria-pressed], .mobile-bottom-controls .abacus[aria-pressed]"
            );
            if (control && control.id !== "screenWakeToggle") setTimeout(save, 0);
        });

        // Restore ONLY from localStorage on page load.
        // Deliberately do not listen for japaneseLangCloudLoaded.
        restore();
    }

    document.addEventListener("DOMContentLoaded", init);
})();
