// =====================================================
// Japanese Lang — optional cloud sync
// =====================================================
// Uses Supabase Auth + one per-user settings row.
// LocalStorage remains the fast/offline cache.
// =====================================================
(() => {
    const SUPABASE_URL = "https://levpdywhnikadumfocao.supabase.co";
    const SUPABASE_KEY = "sb_publishable_gRamSgjPAECxDmztLWLUfg_ZTrmYt4I";
    const TABLE = "user_settings";
    const HARD_KEY = "japanese-lang-hard-vocabulary";
    const SR_KEY = "japanese-lang-spaced-repetition-v1";
    const PRACTICE_KEY = "japanese-lang-practice-lessons-v1";

    let client = null;
    let syncTimer = null;
    let lastSnapshot = "";

    function get(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch (_) { return fallback; } }
    function set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
    function snapshot() { return JSON.stringify({ hard: get(HARD_KEY, []), sr: get(SR_KEY, {}), lessons: get(PRACTICE_KEY, []) }); }

    async function pullCloud(userId) {
        if (!client || !userId) return;
        const { data, error } = await client.from(TABLE).select("hard_vocabulary,spaced_repetition,practice_lessons,updated_at").eq("user_id", userId).maybeSingle();
        if (error) { console.warn("Japanese Lang cloud sync:", error.message); return; }
        if (!data) return;

        // Cloud is authoritative when there are no local changes waiting to be uploaded.
        // This also allows removals from Hard vocabulary to sync across devices.
        if (Array.isArray(data.hard_vocabulary)) set(HARD_KEY, data.hard_vocabulary);
        if (data.spaced_repetition && typeof data.spaced_repetition === "object") set(SR_KEY, data.spaced_repetition);
        if (Array.isArray(data.practice_lessons)) set(PRACTICE_KEY, data.practice_lessons);

        lastSnapshot = snapshot();
        window.dispatchEvent(new CustomEvent("japaneseLangCloudLoaded"));
    }

    async function pushCloud(userId, force = false) {
        if (!client || !userId) return;
        const snap = snapshot();
        if (!force && snap === lastSnapshot) return;
        const payload = JSON.parse(snap);
        const { error } = await client.from(TABLE).upsert({ user_id: userId, hard_vocabulary: payload.hard, spaced_repetition: payload.sr, practice_lessons: payload.lessons, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
        if (error) { console.warn("Japanese Lang cloud sync:", error.message); return; }
        lastSnapshot = snap;
        window.dispatchEvent(new CustomEvent("japaneseLangCloudSaved"));
    }

    async function syncUser(userId) {
        if (!client || !userId) return;
        // If this page/device changed local data, upload it first.
        // Otherwise fetch the latest cloud data so changes made on another page/device appear automatically.
        if (snapshot() !== lastSnapshot) await pushCloud(userId);
        else await pullCloud(userId);
    }

    function startPolling(userId) {
        clearInterval(syncTimer);
        syncTimer = setInterval(() => syncUser(userId), 1500);
    }
    function stopPolling() { clearInterval(syncTimer); syncTimer = null; }

    function createAuthUI() {
        if (document.getElementById("jlCloudAuth")) return;
        const wrap = document.createElement("div");
        wrap.id = "jlCloudAuth";
        wrap.innerHTML = `<button id="jlCloudButton" type="button" aria-label="Cloud account">☁️</button><div id="jlCloudPanel" hidden><strong>Cloud Sync</strong><span id="jlCloudStatus">Not signed in</span><input id="jlEmail" type="email" placeholder="Email" autocomplete="email"><input id="jlPassword" type="password" placeholder="Password" autocomplete="current-password"><button id="jlSignIn" type="button">Sign in</button><button id="jlSignUp" type="button">Create account</button><button id="jlSignOut" type="button" hidden>Sign out</button><small id="jlCloudMessage"></small></div>`;
        document.body.appendChild(wrap);

        const style = document.createElement("style");
        style.textContent = `
          #jlCloudAuth{position:fixed;left:14px;bottom:14px;z-index:99999;font-family:inherit}
          #jlCloudButton{width:42px;height:42px;border:1px solid var(--paper-line,#d9d2c3);border-radius:50%;background:var(--paper-cell,#fffdf8);color:var(--ink,#241f18);cursor:pointer;font-size:19px;box-shadow:var(--shadow,0 2px 10px rgba(0,0,0,.12))}
          #jlCloudPanel{position:absolute;left:0;bottom:52px;width:250px;padding:14px;border-radius:14px;background:var(--paper-cell,#fffdf8);color:var(--ink,#241f18);box-shadow:0 10px 35px rgba(0,0,0,.2);border:1px solid var(--paper-line,#d9d2c3);display:flex;flex-direction:column;gap:8px}
          #jlCloudPanel[hidden]{display:none}
          #jlCloudPanel input,#jlCloudPanel button:not(#jlCloudButton){box-sizing:border-box;width:100%;padding:8px;border-radius:8px;border:1px solid var(--paper-line,#d9d2c3);background:var(--paper,#f7f2e7);color:var(--ink,#241f18);font:inherit}
          #jlCloudPanel input{font-size:16px;}
          #jlCloudPanel input::placeholder{color:var(--ink-soft,#7a705e)}
          #jlCloudStatus,#jlCloudMessage{font-size:12px;color:var(--ink-soft,#7a705e)}
          @media (max-width:520px){
            #jlCloudAuth{position:static;left:auto;bottom:auto;width:auto;z-index:auto;grid-column:auto;margin:0}
            #jlCloudButton{width:100%;height:42px;border-radius:6px;box-shadow:none;font-size:16px;min-width:0}
            #jlCloudPanel{position:absolute;left:12px;right:12px;bottom:auto;top:calc(100% + 6px);width:auto;z-index:10001}
            #jlCloudAuth.jl-mobile-open #jlCloudPanel{display:flex}
          }
        `;
        document.head.appendChild(style);

        const button = document.getElementById("jlCloudButton");
        const panel = document.getElementById("jlCloudPanel");
        button.onclick = (e) => { e.stopPropagation(); if (window.innerWidth <= 520) { wrap.classList.toggle("jl-mobile-open"); panel.hidden = !wrap.classList.contains("jl-mobile-open"); } else panel.hidden = !panel.hidden; };
        document.getElementById("jlSignIn").onclick = () => auth(false);
        document.getElementById("jlSignUp").onclick = () => auth(true);
        document.getElementById("jlSignOut").onclick = async () => { await client.auth.signOut(); };

        function placeAuth() {
            const mobile = window.innerWidth <= 520;
            const nav = document.querySelector(".main-nav");
            const theme = document.getElementById("theme");
            if (mobile && nav) {
                // Only move the auth control when it is not already immediately after Theme.
                // This is important on mobile: opening the keyboard can resize the viewport.
                // Re-inserting the focused wrapper would otherwise blur the input and close the keyboard.
                if (theme && theme.parentNode === nav && wrap.previousElementSibling !== theme) theme.after(wrap);
                else if (wrap.parentNode !== nav) nav.appendChild(wrap);
            } else if (!mobile && wrap.parentNode !== document.body) document.body.appendChild(wrap);
            if (!mobile) { wrap.classList.remove("jl-mobile-open"); panel.hidden = true; }
        }
        placeAuth();
        window.addEventListener("resize", placeAuth);
        document.addEventListener("click", (e) => { if (window.innerWidth <= 520 && !wrap.contains(e.target)) { wrap.classList.remove("jl-mobile-open"); panel.hidden = true; } });
    }

    async function auth(signUp) {
        const email = document.getElementById("jlEmail").value.trim();
        const password = document.getElementById("jlPassword").value;
        const msg = document.getElementById("jlCloudMessage");
        if (!email || !password) { msg.textContent = "Enter email and password."; return; }
        const result = signUp ? await client.auth.signUp({ email, password }) : await client.auth.signInWithPassword({ email, password });
        msg.textContent = result.error ? result.error.message : (signUp ? "Account created. Check your email if confirmation is enabled." : "Signed in.");
    }

    function updateUI(session) {
        const status = document.getElementById("jlCloudStatus");
        if (!status) return;
        const signed = !!session?.user;
        status.textContent = signed ? `Synced: ${session.user.email}` : "Not signed in";
        document.getElementById("jlSignIn").hidden = signed;
        document.getElementById("jlSignUp").hidden = signed;
        document.getElementById("jlSignOut").hidden = !signed;
    }

    async function init() {
        if (!window.supabase) return;
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        createAuthUI();
        const { data } = await client.auth.getSession();
        updateUI(data.session);
        if (data.session?.user) { await pullCloud(data.session.user.id); startPolling(data.session.user.id); }
        client.auth.onAuthStateChange(async (_event, session) => { updateUI(session); if (session?.user) { await pullCloud(session.user.id); startPolling(session.user.user.id); } else stopPolling(); });
    }

    document.addEventListener("DOMContentLoaded", init);
})();
