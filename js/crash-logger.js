// Japanese Lang crash diagnostics.
// Never put a GitHub token in this browser-side file.
(() => {
    "use strict";

    const KEY = "japanese-lang-crash-log-v1";
    const VERSION = "1.0.0";
    const MAX_EVENTS = 100;
    const MAX_ERRORS = 30;
    const SUPABASE_URL = "https://levpdywhnikadumfocao.supabase.co";
    const SUPABASE_KEY = "sb_publishable_gRamSgjPAECxDmztLWLUfg_ZTrmYt4I";
    const TABLE = "crash_logs";

    const now = () => new Date().toISOString();
    const text = (v, n = 1200) => {
        try { return String(typeof v === "string" ? v : JSON.stringify(v)).slice(0, n); }
        catch (_) { return String(v).slice(0, n); }
    };
    const memory = () => {
        try {
            const m = performance.memory;
            return m ? { limit:m.jsHeapSizeLimit, total:m.totalJSHeapSize, used:m.usedJSHeapSize } : null;
        } catch (_) { return null; }
    };
    const context = () => ({
        href: location.href,
        path: location.pathname,
        referrer: document.referrer || "",
        title: document.title || "",
        userAgent: navigator.userAgent,
        platform: navigator.platform || "",
        language: navigator.language || "",
        languages: navigator.languages || [],
        cores: navigator.hardwareConcurrency || null,
        deviceMemory: navigator.deviceMemory || null,
        online: navigator.onLine,
        visibility: document.visibilityState,
        viewport: { width:innerWidth, height:innerHeight, dpr:devicePixelRatio || 1 },
        memory: memory(),
        loggerVersion: VERSION
    });
    const target = el => {
        try {
            if (!el?.tagName) return null;
            return {
                tag: el.tagName,
                id: el.id || "",
                classes: typeof el.className === "string" ? el.className.slice(0,250) : "",
                aria: el.getAttribute?.("aria-label") || "",
                text: (el.textContent || "").trim().replace(/\s+/g," ").slice(0,120)
            };
        } catch (_) { return null; }
    };
    const appState = () => {
        const keys = [
            "japanese-lang-lesson-filter-v1",
            "japanese-lang-lesson-shuffle-v1",
            "japanese-lang-practice-lessons-v1",
            "japanese-lang-spaced-repetition-v1",
            "japanese-lang-hard-vocabulary",
            "japanese-lang-ui-state-v1",
            "japanese-lang-screen-awake",
            "theme"
        ];
        const out = {};
        keys.forEach(k => { try { const v=localStorage.getItem(k); if(v!==null) out[k]=v.slice(0,5000); } catch(_){} });
        return out;
    };
    const read = () => {
        try { const x=JSON.parse(localStorage.getItem(KEY)||"null"); return x && typeof x === "object" ? x : null; }
        catch(_) { return null; }
    };
    let state = read();
    const previous = state && !state.cleanExit && state.events?.length ? {
        ...state,
        detectedAt: now(),
        detectedAppState: appState()
    } : null;

    state = {
        sessionId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`,
        startedAt: now(),
        lastSeenAt: now(),
        cleanExit: false,
        context: context(),
        events: [],
        errors: [],
        lastEvent: null
    };

    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(state)); }
        catch (_) {
            try {
                state.events = state.events.slice(-40);
                state.errors = state.errors.slice(-10);
                localStorage.setItem(KEY, JSON.stringify(state));
            } catch (_) {}
        }
    }
    function addEvent(type, details={}) {
        const e = { at:now(), type, ...details };
        state.lastSeenAt=e.at; state.lastEvent=e; state.events.push(e);
        if(state.events.length>MAX_EVENTS) state.events.splice(0,state.events.length-MAX_EVENTS);
        save();
    }
    function addError(type, details={}) {
        const e={at:now(),type,...details}; state.errors.push(e);
        if(state.errors.length>MAX_ERRORS) state.errors.splice(0,state.errors.length-MAX_ERRORS);
        addEvent(type,details);
    }

    // Install first so later application scripts are covered.
    window.addEventListener("error", e => {
        if(e?.target && e.target !== window) return addError("resource-error", {
            resource:e.target.src || e.target.href || "", target:target(e.target)
        });
        addError("window-error", {
            message:text(e?.message || "Unknown error"), filename:text(e?.filename || ""),
            line:e?.lineno || 0, column:e?.colno || 0, stack:text(e?.error?.stack || "")
        });
    }, true);
    window.addEventListener("unhandledrejection", e => addError("unhandled-rejection", {
        reason:text(e?.reason), stack:text(e?.reason?.stack || "")
    }));
    ["error","warn"].forEach(level => {
        try {
            const original=console[level];
            console[level]=function(...args){
                try { addError(`console-${level}`, { message:args.map(a=>text(a,500)).join(" | ") }); } catch(_){}
                return original.apply(this,args);
            };
        } catch(_){}
    });

    window.addEventListener("online",()=>addEvent("network-online"));
    window.addEventListener("offline",()=>addEvent("network-offline"));
    document.addEventListener("visibilitychange",()=>addEvent("visibility",{value:document.visibilityState}));
    window.addEventListener("pageshow",e=>addEvent("pageshow",{persisted:!!e.persisted}));
    window.addEventListener("pagehide",e=>addEvent("pagehide",{persisted:!!e.persisted}));
    document.addEventListener("click",e=>addEvent("click",{target:target(e.target)}),true);
    document.addEventListener("change",e=>addEvent("change",{target:target(e.target)}),true);
    window.addEventListener("securitypolicyviolation",e=>addError("csp-violation",{
        blockedURI:e.blockedURI || "", directive:e.violatedDirective || "",
        sourceFile:e.sourceFile || "", line:e.lineNumber || 0, column:e.columnNumber || 0
    }));

    // This is intentionally persistent. A renderer crash can prevent unload handlers,
    // leaving this session dirty; the next successful launch uploads it.
    window.addEventListener("beforeunload",()=>{ state.cleanExit=true; state.lastSeenAt=now(); save(); });
    setInterval(()=>{ const m=memory(); if(m) addEvent("memory-sample",{memory:m}); },15000);

    async function uploadPrevious() {
        if(!previous) return false;
        const payload={
            session_id:previous.sessionId,
            detected_at:previous.detectedAt,
            started_at:previous.startedAt,
            last_seen_at:previous.lastSeenAt,
            possible_crash:true,
            context:previous.context,
            events:previous.events,
            errors:previous.errors,
            last_event:previous.lastEvent,
            app_state:previous.detectedAppState
        };
        try {
            const r=await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`,{
                method:"POST",
                headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,"Content-Type":"application/json",Prefer:"return=minimal"},
                body:JSON.stringify(payload),keepalive:true
            });
            return r.ok;
        } catch(_) { return false; }
    }
    function waitAndUpload(){
        let tries=0;
        const t=setInterval(async()=>{
            if(++tries>=30 || window.supabase){ clearInterval(t); await uploadPrevious(); }
        },250);
    }

    addEvent("session-start",{previousSessionDetected:!!previous,previousSessionId:previous?.sessionId || null});
    save();
    if(previous) waitAndUpload();

    // Manual diagnostic access from DevTools if needed.
    window.JapaneseLangCrashLogger=Object.freeze({
        version:VERSION,
        getState:()=>JSON.parse(JSON.stringify(state)),
        addEvent:(type,details)=>addEvent(String(type),details || {}),
        addError:(type,details)=>addError(String(type),details || {})
    });
})();
