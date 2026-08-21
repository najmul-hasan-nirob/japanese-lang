// =====================================================
// Lessons page controls
// =====================================================
// Control order: Screen → Romaji → Front / Back → Shuffle → Reset.
// =====================================================

(function () {
    let showBack = false;
    let showBackRomaji = true;
    let observer = null;
    let resetButton = null;
    let mobileQuery = null;

    const ICONS = {
        screenOn: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>',
        screenOff: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.5A8 8 0 1 1 8.5 4 8 8 0 0 0 20 15.5Z"></path></svg>',
        romaji: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7M7.5 5v14M4 19h7M14 5l6 14M20 5l-6 14"></path></svg>',
        flip: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>',
        shuffle: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3c4 0 6 10 10 10h3M17 14l3 3-3 3M4 17h3c1.5 0 2.5-1.5 3.5-3M14 10c1-1.5 2-3 3-3h3M17 4l3 3-3 3"></path></svg>',
        reset: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.7-4L3 10M3 5v5h5M4 13a8 8 0 0 0 14.7 4L21 14M21 19v-5h-5"></path></svg>'
    };

    function getCards() { return Array.from(document.querySelectorAll("#grid .card")); }
    function labelledIcon(label, icon) { return '<span class="lesson-control-text">' + label + '</span>' + icon; }

    function updateScreenUI() {
        const button = document.getElementById("screenWakeToggle");
        if (!button) return;
        const on = button.getAttribute("aria-pressed") === "true";
        button.innerHTML = labelledIcon("Screen", on ? ICONS.screenOn : ICONS.screenOff);
        button.setAttribute("aria-label", on ? "Screen Always On" : "Normal screen timeout");
        button.setAttribute("title", on ? "Screen Always On" : "Normal screen timeout");
    }

    function updateSwitchUI() {
        const direction = document.getElementById("direction");
        if (!direction) return;
        direction.classList.toggle("right", showBack);
        direction.setAttribute("aria-pressed", String(showBack));
        direction.setAttribute("aria-label", showBack ? "Show all cards Front" : "Show all cards Back");
        direction.setAttribute("title", showBack ? "Show Front" : "Show Back");
        direction.innerHTML = labelledIcon("Front / Back", ICONS.flip);
    }

    function updateRomajiUI() {
        const button = document.getElementById("backRomajiToggle");
        if (!button) return;
        button.innerHTML = labelledIcon("Romaji", ICONS.romaji);
        button.setAttribute("aria-pressed", String(showBackRomaji));
        button.setAttribute("aria-label", showBackRomaji ? "Romaji: ON" : "Romaji: OFF");
        button.setAttribute("title", showBackRomaji ? "Romaji: ON" : "Romaji: OFF");
    }

    function applyRomajiVisibility() {
        getCards().forEach(card => card.querySelectorAll(".romaji").forEach(romaji => { romaji.style.display = showBackRomaji ? "" : "none"; }));
    }

    function applyCardState() {
        getCards().forEach(card => card.classList.toggle("flipped", showBack));
        applyRomajiVisibility();
    }

    function toggleAllCards() { showBack = !showBack; updateSwitchUI(); applyCardState(); }
    function toggleBackRomaji() { showBackRomaji = !showBackRomaji; updateRomajiUI(); applyRomajiVisibility(); }

    function resetLessons() {
        showBack = false;
        updateSwitchUI();
        applyCardState();
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }

    function createResetButton() {
        if (resetButton && document.contains(resetButton)) return resetButton;
        resetButton = document.createElement("button");
        resetButton.type = "button";
        resetButton.id = "lessonResetBtn";
        resetButton.className = "lesson-reset-btn";
        resetButton.setAttribute("aria-label", "Reset lesson cards and return to top");
        resetButton.setAttribute("title", "Reset cards and return to top");
        resetButton.innerHTML = labelledIcon("Reset", ICONS.reset);
        resetButton.addEventListener("click", function (event) { event.preventDefault(); event.stopPropagation(); resetLessons(); });
        return resetButton;
    }

    function getField(element) { return element ? element.closest(".field") : null; }

    function ensureScreenField() {
        const toolbar = document.querySelector(".toolbar");
        const screenButton = document.getElementById("screenWakeToggle");
        if (!toolbar || !screenButton) return;
        let field = getField(screenButton);
        if (!field) {
            field = document.createElement("div");
            field.id = "screenWakeField";
            field.className = "field screen-wake-field";
            toolbar.appendChild(field);
            field.appendChild(screenButton);
        }
        field.classList.add("screen-wake-field");
        updateScreenUI();
    }

    function ensureDesktopOrder() {
        const toolbar = document.querySelector(".toolbar");
        const romajiButton = document.getElementById("backRomajiToggle");
        const direction = document.getElementById("direction");
        const shuffleButton = document.getElementById("shuffleBtn");
        if (!toolbar || !romajiButton || !direction || !shuffleButton) return;
        const romajiField = getField(romajiButton), directionField = getField(direction), shuffleField = getField(shuffleButton);
        if (!romajiField || !directionField || !shuffleField) return;
        const screenField = getField(document.getElementById("screenWakeToggle"));
        const reset = createResetButton();
        let resetField = document.getElementById("lessonResetField");
        if (!resetField) {
            resetField = document.createElement("div");
            resetField.id = "lessonResetField";
            resetField.className = "field lesson-reset-field";
            resetField.appendChild(reset);
        }
        if (screenField) toolbar.appendChild(screenField);
        toolbar.appendChild(romajiField);
        toolbar.appendChild(directionField);
        toolbar.appendChild(shuffleField);
        toolbar.appendChild(resetField);
        updateScreenUI();
        updateRomajiUI();
        updateSwitchUI();
        shuffleButton.innerHTML = labelledIcon("Shuffle", ICONS.shuffle);
        shuffleButton.setAttribute("aria-label", "Shuffle");
        shuffleButton.setAttribute("title", "Shuffle");
    }

    function ensureMobileControls() {
        const shuffleButton = document.getElementById("shuffleBtn");
        const romajiButton = document.getElementById("backRomajiToggle");
        const direction = document.getElementById("direction");
        if (!shuffleButton || !romajiButton || !direction) return;
        let mobileBar = document.querySelector(".mobile-bottom-controls");
        if (!mobileBar) {
            mobileBar = document.createElement("div");
            mobileBar.className = "mobile-bottom-controls";
            mobileBar.setAttribute("aria-label", "Lesson controls");
            document.body.appendChild(mobileBar);
        }
        mobileBar.appendChild(romajiButton);
        mobileBar.appendChild(direction);
        mobileBar.appendChild(shuffleButton);
        mobileBar.appendChild(createResetButton());
        shuffleButton.innerHTML = ICONS.shuffle;
        shuffleButton.setAttribute("aria-label", "Shuffle");
        shuffleButton.setAttribute("title", "Shuffle");
        updateRomajiUI(); updateSwitchUI();
    }

    function syncResponsiveControls() {
        const isMobile = mobileQuery ? mobileQuery.matches : window.matchMedia("(max-width:520px)").matches;
        if (isMobile) ensureMobileControls(); else ensureDesktopOrder();
    }

    function init() {
        const direction = document.getElementById("direction");
        const grid = document.getElementById("grid");
        const romajiButton = document.getElementById("backRomajiToggle");
        if (!direction || !grid) return;
        direction.onclick = function (event) { event.preventDefault(); event.stopPropagation(); toggleAllCards(); };
        if (romajiButton) romajiButton.onclick = function (event) { event.preventDefault(); event.stopPropagation(); toggleBackRomaji(); };
        mobileQuery = window.matchMedia("(max-width:520px)");
        if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", syncResponsiveControls); else if (mobileQuery.addListener) mobileQuery.addListener(syncResponsiveControls);
        updateSwitchUI(); updateRomajiUI(); applyCardState(); ensureScreenField(); syncResponsiveControls();
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => { if (showBack || !showBackRomaji) applyCardState(); });
        observer.observe(grid, { childList: true });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
