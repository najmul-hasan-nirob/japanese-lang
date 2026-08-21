// =====================================================
// Lessons page controls
// =====================================================
// Control order: Romaji → Front/Back → Shuffle → Reset.
// =====================================================

(function () {
    let showBack = false;
    let showBackRomaji = true;
    let observer = null;
    let resetButton = null;
    let mobileQuery = null;

    const ICONS = {
        romaji: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7M7.5 5v14M4 19h7M14 5l6 14M20 5l-6 14"/></svg>',
        flip: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"/></svg>',
        shuffle: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3c4 0 6 10 10 10h3M17 14l3 3-3 3M4 17h3c1.5 0 2.5-1.5 3.5-3M14 10c1-1.5 2-3 3-3h3M17 4l3 3-3 3"/></svg>',
        reset: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.7-4L3 10M3 5v5h5M4 13a8 8 0 0 0 14.7 4L21 14M21 19v-5h-5"/></svg>'
    };

    function getCards() { return Array.from(document.querySelectorAll("#grid .card")); }

    function updateSwitchUI() {
        const direction = document.getElementById("direction");
        if (!direction) return;
        direction.classList.toggle("right", showBack);
        direction.setAttribute("aria-pressed", String(showBack));
        direction.setAttribute("aria-label", showBack ? "Show all cards Front" : "Show all cards Back");
        direction.setAttribute("title", showBack ? "Show Front" : "Show Back");
        direction.innerHTML = ICONS.flip;
    }

    function updateRomajiUI() {
        const button = document.getElementById("backRomajiToggle");
        if (!button) return;
        button.innerHTML = ICONS.romaji;
        button.setAttribute("aria-pressed", String(showBackRomaji));
        button.setAttribute("aria-label", showBackRomaji ? "Romaji: ON" : "Romaji: OFF");
        button.setAttribute("title", showBackRomaji ? "Romaji: ON" : "Romaji: OFF");
    }

    // Romaji is an independent setting. Hide/show every Romaji element
    // rendered by lesson cards, regardless of which card type it belongs to.
    function applyRomajiVisibility() {
        getCards().forEach(card => {
            card.querySelectorAll(".romaji").forEach(romaji => {
                romaji.style.display = showBackRomaji ? "" : "none";
            });
        });
    }

    function applyCardState() {
        getCards().forEach(card => {
            card.classList.toggle("flipped", showBack);
        });
        applyRomajiVisibility();
    }

    function toggleAllCards() {
        showBack = !showBack;
        updateSwitchUI();
        applyCardState();
    }

    function toggleBackRomaji() {
        showBackRomaji = !showBackRomaji;
        updateRomajiUI();
        applyRomajiVisibility();
    }

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
        resetButton.innerHTML = ICONS.reset;
        resetButton.addEventListener("click", function (event) {
            event.preventDefault(); event.stopPropagation(); resetLessons();
        });
        return resetButton;
    }

    function getField(element) { return element ? element.closest(".field") : null; }

    function ensureDesktopOrder() {
        const toolbar = document.querySelector(".toolbar");
        const romajiButton = document.getElementById("backRomajiToggle");
        const direction = document.getElementById("direction");
        const shuffleButton = document.getElementById("shuffleBtn");
        if (!toolbar || !romajiButton || !direction || !shuffleButton) return;
        const romajiField = getField(romajiButton), directionField = getField(direction), shuffleField = getField(shuffleButton);
        if (!romajiField || !directionField || !shuffleField) return;
        const reset = createResetButton();
        let resetField = document.getElementById("lessonResetField");
        if (!resetField) {
            resetField = document.createElement("div");
            resetField.id = "lessonResetField";
            resetField.className = "field lesson-reset-field";
            const label = document.createElement("label"); label.innerHTML = "Reset";
            resetField.appendChild(label); resetField.appendChild(reset);
        }
        toolbar.appendChild(romajiField);
        toolbar.appendChild(directionField);
        toolbar.appendChild(shuffleField);
        toolbar.appendChild(resetField);
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

    function updateShuffleMobileLabel() {
        const shuffleButton = document.getElementById("shuffleBtn");
        if (!shuffleButton) return;
        const isMobile = mobileQuery ? mobileQuery.matches : window.matchMedia("(max-width:520px)").matches;
        shuffleButton.innerHTML = ICONS.shuffle + (isMobile ? '' : '<span class="lesson-control-label"> Shuffle</span>');
        shuffleButton.setAttribute("aria-label", "Shuffle");
        if (isMobile) shuffleButton.setAttribute("title", "Shuffle"); else shuffleButton.removeAttribute("title");
    }

    function syncResponsiveControls() {
        const isMobile = mobileQuery ? mobileQuery.matches : window.matchMedia("(max-width:520px)").matches;
        if (isMobile) ensureMobileControls(); else ensureDesktopOrder();
        updateShuffleMobileLabel(); updateRomajiUI(); updateSwitchUI();
    }

    function init() {
        const direction = document.getElementById("direction");
        const grid = document.getElementById("grid");
        const romajiButton = document.getElementById("backRomajiToggle");
        if (!direction || !grid) return;
        direction.onclick = function (event) { event.preventDefault(); event.stopPropagation(); toggleAllCards(); };
        if (romajiButton) romajiButton.onclick = function (event) {
            event.preventDefault();
            event.stopPropagation();
            toggleBackRomaji();
        };
        mobileQuery = window.matchMedia("(max-width:520px)");
        if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", syncResponsiveControls);
        else if (mobileQuery.addListener) mobileQuery.addListener(syncResponsiveControls);
        updateSwitchUI(); updateRomajiUI(); applyCardState(); syncResponsiveControls();
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => { if (showBack || !showBackRomaji) applyCardState(); syncResponsiveControls(); });
        observer.observe(grid, { childList: true });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
