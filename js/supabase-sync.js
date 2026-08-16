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

    function get(key, fallback) {
        try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
        catch (_) { return fallback; }
    }
    function set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
    }

    function snapshot() {
        return JSON.stringify({
            hard: get(HARD_KEY, []),
            sr: get(SR_KEY, {}),
            lessons: get(PRACTICE_KEY, [])
        });
    }

    async function pullCloud(userId) {
        if (!client || !userId) return;
        const { data, error } = await client.from(TABLE).select("hard_vocabulary,spaced_repetition,practice_lessons,updated_at").eq("user_id", userId).maybeSingle();
        if (error) { console.warn("Japanese Lang cloud sync:", error.message); return; }
        if (!data) return;

        // Merge hard vocabulary so local additions are never silently lost.
        const localHard = new Set(get(HARD_KEY, []));
        const cloudHard = Array.isArray(data.hard_vocabulary) ? data.hard_vocabulary : [];
        cloudHard.forEach(v => localHard.add(v));
        set(HARD_KEY, Array.from(localHard));

        // Cloud SR is the source of truth for existing review records, while
        // preserving any local records that the cloud does not yet know.
        const localSR = get(SR_KEY, {});
        const cloudSR = data.spaced_repetition && typeof data.spaced_repetition === "object" ? data.spaced_repetition : {};
        set(SR_KEY, { ...localSR, ...cloudSR });

        const cloudLessons = Array.isArray(data.practice_lessons) ? data.practice_lessons : [];
        if (cloudLessons.length) set(PRACTICE_KEY, cloudLessons);
        lastSnapshot = snapshot();
        window.dispatchEvent(new CustomEvent("japaneseLangCloudLoaded"));
    }

    async function pushCloud(userId, force = false) {
        if (!client || !userId) return;
        const snap = snapshot();
        if (!force && snap === lastSnapshot) return;
        const payload = JSON.parse(snap);
        const { error } = await client.from(TABLE).upsert({
            user_id: userId,
            hard_vocabulary: payload.hard,
            spaced_repetition: payload.sr,
            practice_lessons: payload.lessons,
            updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });
        if (error) { console.warn("Japanese Lang cloud sync:", error.message); return; }
        lastSnapshot = snap;
        window.dispatchEvent(new CustomEvent("japaneseLangCloudSaved"));
    }

    function startPolling(userId) {
        clearInterval(syncTimer);
        syncTimer = setInterval(() => pushCloud(userId), 1500);
    }

    function stopPolling() {
        clearInterval(syncTimer);
        syncTimer = null;
    }

    function createAuthUI() {
        if (document.getElementById("jlCloudAuth")) return;
        const wrap = document.createElement("div");
        wrap.id = "jlCloudAuth";
        wrap.innerHTML = `
          <button id="jlCloudButton" type="button" aria-label="Cloud account">☁️</button>
          <div id="jlCloudPanel" hidden>
            <strong>Cloud Sync</strong>
            <span id="jlCloudStatus">Not signed in</span>
            <input id="jlEmail" type="email" placeholder="Email" autocomplete="email">
            <input id="jlPassword" type="password" placeholder="Password" autocomplete="current-password">
            <button id="jlSignIn" type="button">Sign in</button>
            <button id="jlSignUp" type="button">Create account</button>
            <button id="jlSignOut" type="button" hidden>Sign out</button>
            <small id="jlCloudMessage"></small>
          </div>`;
        document.body.appendChild(wrap);

        const style = document.createElement("style");
        style.textContent = `
          #jlCloudAuth{position:fixed;right:14px;bottom:14px;z-index:99999;font-family:inherit}
          #jlCloudButton{width:42px;height:42px;border:1px solid rgba(127,127,127,.35);border-radius:50%;background:var(--card-bg,#fff);cursor:pointer;font-size:19px}
          #jlCloudPanel{position:absolute;right:0;bottom:52px;width:250px;padding:14px;border-radius:14px;background:var(--card-bg,#fff);box-shadow:0 10px 35px rgba(0,0,0,.2);border:1px solid rgba(127,127,127,.25);display:flex;flex-direction:column;gap:8px}
          #jlCloudPanel[hidden]{display:none}
          #jlCloudPanel input,#jlCloudPanel button:not(#jlCloudButton){box-sizing:border-box;width:100%;padding:8px;border-radius:8px;border:1px solid rgba(127,127,127,.35);font:inherit}
          #jlCloudStatus,#jlCloudMessage{font-size:12px;opacity:.8}
        `;
        document.head.appendChild(style);

        document.getElementById("jlCloudButton").onclick = () => {
            const p = document.getElementById("jlCloudPanel"); p.hidden = !p.hidden;
        };
        document.getElementById("jlSignIn").onclick = () => auth(false);
        document.getElementById("jlSignUp").onclick = () => auth(true);
        document.getElementById("jlSignOut").onclick = async () => { await client.auth.signOut(); };
    }

    async function auth(signUp) {
        const email = document.getElementById("jlEmail").value.trim();
        const password = document.getElementById("jlPassword").value;
        const msg = document.getElementById("jlCloudMessage");
        if (!email || !password) { msg.textContent = "Enter email and password."; return; }
        const result = signUp
            ? await client.auth.signUp({ email, password })
            : await client.auth.signInWithPassword({ email, password });
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
        if (data.session?.user) {
            await pullCloud(data.session.user.id);
            startPolling(data.session.user.id);
        }
        client.auth.onAuthStateChange(async (_event, session) => {
            updateUI(session);
            if (session?.user) {
                await pullCloud(session.user.id);
                startPolling(session.user.id);
            } else stopPolling();
        });
    }

    document.addEventListener("DOMContentLoaded", init);
})();
