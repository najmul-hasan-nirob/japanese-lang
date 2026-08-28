// Japanese Lang — persistent crash / renderer diagnostics
// Uses the EXISTING user_settings cloud-sync path. No new table or secret key.
(() => {
    "use strict";
    const KEY="japanese-lang-crash-log-v3", UI_KEY="japanese-lang-ui-state-v1";
    const MAX_EVENTS=120, MAX_ERRORS=40;
    const now=()=>new Date().toISOString();
    const safe=(v,n=1200)=>{try{return String(typeof v==="string"?v:JSON.stringify(v)).slice(0,n)}catch(_){return String(v).slice(0,n)}};
    const mem=()=>{try{const m=performance.memory;return m?{limit:m.jsHeapSizeLimit,total:m.totalJSHeapSize,used:m.usedJSHeapSize}:null}catch(_){return null}};
    const target=el=>{try{if(!el?.tagName)return null;return{tag:el.tagName,id:el.id||"",classes:typeof el.className==="string"?el.className.slice(0,250):"",aria:el.getAttribute?.("aria-label")||"",text:(el.textContent||"").trim().replace(/\s+/g," ").slice(0,160)}}catch(_){return null}};
    const context=()=>({href:location.href,path:location.pathname,title:document.title||"",userAgent:navigator.userAgent,platform:navigator.platform||"",language:navigator.language||"",languages:navigator.languages||[],cores:navigator.hardwareConcurrency||null,deviceMemory:navigator.deviceMemory||null,online:navigator.onLine,visibility:document.visibilityState,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio||1},memory:mem(),at:now()});
    const appState=()=>{const keys=["japanese-lang-lesson-filter-v1","japanese-lang-lesson-shuffle-v1","japanese-lang-practice-lessons-v1","japanese-lang-spaced-repetition-v1","japanese-lang-hard-vocabulary","japanese-lang-ui-state-v1","japanese-lang-screen-awake","theme"];const o={};keys.forEach(k=>{try{const v=localStorage.getItem(k);if(v!==null)o[k]=v.slice(0,5000)}catch(_){}});return o};
    const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||"null");return x&&typeof x==="object"?x:null}catch(_){return null}};
    const old=read();
    const previous=old&&!old.cleanExit&&old.events?.length?{...old,detectedAt:now(),detectedAppState:appState()}:null;
    let state={sessionId:`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`,startedAt:now(),lastSeenAt:now(),cleanExit:false,context:context(),events:[],errors:[],lastEvent:null};
    function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){try{state.events=state.events.slice(-40);state.errors=state.errors.slice(-10);localStorage.setItem(KEY,JSON.stringify(state))}catch(_){}}}
    function cloudBreadcrumb(){
        try{
            const ui=JSON.parse(localStorage.getItem(UI_KEY)||"{}");
            ui.__japaneseLangCrash={version:3,updatedAt:Date.now(),sessionId:state.sessionId,
                previousCrash:previous?{sessionId:previous.sessionId,detectedAt:previous.detectedAt,startedAt:previous.startedAt,lastSeenAt:previous.lastSeenAt,context:previous.context,events:previous.events,errors:previous.errors,lastEvent:previous.lastEvent,appState:previous.detectedAppState}:null,
                current:{startedAt:state.startedAt,lastSeenAt:state.lastSeenAt,lastEvent:state.lastEvent,context:state.context}};
            localStorage.setItem(UI_KEY,JSON.stringify(ui));
            window.dispatchEvent(new Event("japaneseLangCrashStateChanged"));
        }catch(_){ }
    }
    function event(type,details={}){const e={at:now(),type,...details};state.lastSeenAt=e.at;state.lastEvent=e;state.events.push(e);if(state.events.length>MAX_EVENTS)state.events.splice(0,state.events.length-MAX_EVENTS);save();cloudBreadcrumb()}
    function error(type,details={}){state.errors.push({at:now(),type,...details});if(state.errors.length>MAX_ERRORS)state.errors.splice(0,state.errors.length-MAX_ERRORS);event(type,details)}

    window.addEventListener("error",e=>{if(e?.target&&e.target!==window)return error("resource-error",{resource:e.target.src||e.target.href||"",target:target(e.target)});error("window-error",{message:safe(e?.message||"Unknown error"),file:safe(e?.filename||""),line:e?.lineno||0,column:e?.colno||0,stack:safe(e?.error?.stack||"")})},true);
    window.addEventListener("unhandledrejection",e=>error("unhandled-rejection",{reason:safe(e?.reason),stack:safe(e?.reason?.stack||"")}));
    ["error","warn"].forEach(level=>{try{const original=console[level];console[level]=function(...args){try{error(`console-${level}`,{message:args.map(a=>safe(a,500)).join(" | ")})}catch(_){}return original.apply(this,args)}}catch(_){}});
    window.addEventListener("online",()=>event("network-online"));
    window.addEventListener("offline",()=>event("network-offline"));
    document.addEventListener("visibilitychange",()=>event("visibility",{value:document.visibilityState}));
    window.addEventListener("pageshow",e=>event("pageshow",{persisted:!!e.persisted}));
    window.addEventListener("pagehide",e=>event("pagehide",{persisted:!!e.persisted}));
    document.addEventListener("click",e=>event("click",{target:target(e.target)}),true);
    document.addEventListener("change",e=>event("change",{target:target(e.target)}),true);
    window.addEventListener("securitypolicyviolation",e=>error("csp-violation",{blockedURI:e.blockedURI||"",directive:e.violatedDirective||"",sourceFile:e.sourceFile||"",line:e.lineNumber||0,column:e.columnNumber||0}));
    document.addEventListener("DOMContentLoaded",()=>event("dom-ready"));
    setInterval(()=>{const m=mem();if(m)event("memory-sample",{memory:m})},15000);
    window.addEventListener("beforeunload",()=>{state.cleanExit=true;state.lastSeenAt=now();save();cloudBreadcrumb()});
    event("session-start",{previousSessionDetected:!!previous,previousSessionId:previous?.sessionId||null});
    save();cloudBreadcrumb();
    setInterval(cloudBreadcrumb,5000);
    window.JapaneseLangCrashLogger=Object.freeze({getState:()=>JSON.parse(JSON.stringify(state)),addEvent:(t,d)=>event(String(t),d||{}),addError:(t,d)=>error(String(t),d||{}),getPreviousCrash:()=>previous?JSON.parse(JSON.stringify(previous)):null});
})();
