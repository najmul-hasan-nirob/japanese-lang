// Japanese Lang — lightweight local crash / renderer diagnostics
(() => {
    "use strict";
    const DB_NAME = "JapaneseLangDiagnostics";
    const STORE = "sessions";
    const KEY = "japanese-lang-crash-log-v5";
    const MAX_EVENTS = 140;
    const MAX_ERRORS = 40;
    const PERSIST_MS = 3000;

    const now = () => new Date().toISOString();
    const sensitive = /token|password|secret|authorization|cookie|access.?token|refresh.?token|sb-.*auth/i;
    const redact = (key, value) => sensitive.test(String(key)) ? "[REDACTED]" : value;
    const safe = (v, n = 1400) => {
        try { return String(typeof v === "string" ? v : JSON.stringify(v)).slice(0, n); }
        catch (_) { return String(v).slice(0, n); }
    };
    const memory = () => {
        try {
            const m = performance.memory;
            return m ? { limit: m.jsHeapSizeLimit, total: m.totalJSHeapSize, used: m.usedJSHeapSize } : null;
        } catch (_) { return null; }
    };
    const context = () => ({
        href: location.href, path: location.pathname, title: document.title || "",
        userAgent: navigator.userAgent, platform: navigator.platform || "",
        language: navigator.language || "", languages: navigator.languages || [],
        cores: navigator.hardwareConcurrency || null, deviceMemory: navigator.deviceMemory || null,
        online: navigator.onLine, visibility: document.visibilityState,
        viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio || 1 }, memory: memory(), at: now()
    });
    const target = el => {
        try {
            if (!el?.tagName) return null;
            return { tag: el.tagName, id: el.id || "", classes: typeof el.className === "string" ? el.className.slice(0, 200) : "",
                aria: el.getAttribute?.("aria-label") || "", text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120) };
        } catch (_) { return null; }
    };
    const appState = () => {
        const out = {};
        try {
            for (const k of Object.keys(localStorage)) {
                out[k] = sensitive.test(k) ? "[REDACTED]" : (localStorage.getItem(k) || "").slice(0, 2500);
            }
        } catch (_) {}
        return out;
    };
    function db() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) return reject(new Error("IndexedDB unavailable"));
            const r = indexedDB.open(DB_NAME, 1);
            r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE, { keyPath: "sessionId" }); };
            r.onsuccess = () => resolve(r.result);
            r.onerror = () => reject(r.error || new Error("IndexedDB open failed"));
        });
    }
    async function idbPut(value) {
        try {
            const d = await db();
            await new Promise((resolve, reject) => {
                const tx = d.transaction(STORE, "readwrite"); tx.objectStore(STORE).put(value);
                tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
            });
            d.close(); return true;
        } catch (_) { return false; }
    }
    async function idbAll() {
        try {
            const d = await db();
            const rows = await new Promise((resolve, reject) => {
                const r = d.transaction(STORE, "readonly").objectStore(STORE).getAll();
                r.onsuccess = () => resolve(r.result || []); r.onerror = () => reject(r.error);
            });
            d.close(); return rows;
        } catch (_) { return []; }
    }

    const oldLocal = (() => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (_) { return null; } })();
    const previous = oldLocal && !oldLocal.cleanExit && oldLocal.events?.length ? oldLocal : null;
    let state = {
        sessionId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
        startedAt: now(), lastSeenAt: now(), cleanExit: false, context: context(),
        events: [], errors: [], lastEvent: null, previousCrashDetected: !!previous
    };
    let persistTimer = null;
    let dirty = false;
    function snapshot() { return JSON.parse(JSON.stringify(state)); }
    function persistSoon(immediate = false) {
        dirty = true;
        if (immediate) { persistNow(); return; }
        if (persistTimer) return;
        persistTimer = setTimeout(() => { persistTimer = null; persistNow(); }, PERSIST_MS);
    }
    function persistNow() {
        if (!dirty) return;
        dirty = false;
        const copy = snapshot();
        try { localStorage.setItem(KEY, JSON.stringify(copy)); } catch (_) {}
        idbPut(copy);
    }
    function event(type, details = {}, immediate = false) {
        const e = { at: now(), type, ...details };
        state.lastSeenAt = e.at; state.lastEvent = e; state.events.push(e);
        if (state.events.length > MAX_EVENTS) state.events.splice(0, state.events.length - MAX_EVENTS);
        persistSoon(immediate);
    }
    function error(type, details = {}) {
        state.errors.push({ at: now(), type, ...details });
        if (state.errors.length > MAX_ERRORS) state.errors.splice(0, state.errors.length - MAX_ERRORS);
        event(type, details, true);
    }

    // Capture only useful error information; never intercept console.error/warn because
    // doing so can alter application behavior and add significant overhead.
    window.addEventListener("error", e => {
        if (e?.target && e.target !== window) return error("resource-error", { resource: e.target.src || e.target.href || "", target: target(e.target) });
        error("window-error", { message: safe(e?.message || "Unknown error"), file: safe(e?.filename || ""), line: e?.lineno || 0, column: e?.colno || 0, stack: safe(e?.error?.stack || "") });
    }, true);
    window.addEventListener("unhandledrejection", e => error("unhandled-rejection", { reason: safe(e?.reason), stack: safe(e?.reason?.stack || "") }));
    window.addEventListener("online", () => event("network-online"));
    window.addEventListener("offline", () => event("network-offline"));
    document.addEventListener("visibilitychange", () => event("visibility", { value: document.visibilityState }, true));
    window.addEventListener("pageshow", e => event("pageshow", { persisted: !!e.persisted }));
    window.addEventListener("pagehide", e => event("pagehide", { persisted: !!e.persisted }, true));
    document.addEventListener("click", e => event("click", { target: target(e.target) }), true);
    document.addEventListener("change", e => event("change", { target: target(e.target) }), true);
    window.addEventListener("securitypolicyviolation", e => error("csp-violation", { blockedURI: e.blockedURI || "", directive: e.violatedDirective || "", sourceFile: e.sourceFile || "", line: e.lineNumber || 0, column: e.columnNumber || 0 }));
    setInterval(() => { const m = memory(); if (m) event("memory-sample", { memory: m }); }, 15000);
    window.addEventListener("beforeunload", () => { state.cleanExit = true; state.lastSeenAt = now(); persistNow(); });

    async function recoverPrevious() {
        if (!previous) return;
        await idbPut({ ...previous, recoveredAt: now(), possibleCrash: true, appStateAtRecovery: appState() });
        event("session-start", { previousSessionId: previous.sessionId }, true);
    }
    event("session-start", { previousCrashDetected: !!previous, previousSessionId: previous?.sessionId || null }, true);
    if (previous) recoverPrevious();

    function downloadBlob(filename, data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename;
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }
    async function downloadCrashLog() {
        persistNow();
        const rows = await idbAll();
        const payload = { exportedAt: now(), app: "Japanese Lang", loggerVersion: 5, currentSession: snapshot(), crashSessions: rows.filter(r => r.possibleCrash || r.recoveredAt), indexedDBSessions: rows };
        downloadBlob(`japanese-lang-crash-log-${new Date().toISOString().replace(/[:.]/g, "-")}.json`, payload);
        event("crash-log-downloaded", { sessions: rows.length });
        return payload;
    }
    function addDownloadButton() {
        if (document.getElementById("japaneseLangCrashDownload")) return;
        const b = document.createElement("button"); b.id = "japaneseLangCrashDownload"; b.type = "button"; b.textContent = "Download Crash Log";
        Object.assign(b.style, { position: "fixed", right: "12px", bottom: "12px", zIndex: "2147483647", display: previous ? "block" : "none", padding: "9px 12px", border: "0", borderRadius: "8px", font: "600 13px system-ui", cursor: "pointer" });
        b.addEventListener("click", downloadCrashLog); document.body.appendChild(b);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addDownloadButton); else addDownloadButton();

    window.JapaneseLangCrashLogger = Object.freeze({ getState: () => snapshot(), addEvent: (t, d) => event(String(t), d || {}), addError: (t, d) => error(String(t), d || {}), downloadCrashLog, getSessions: idbAll });
})();
