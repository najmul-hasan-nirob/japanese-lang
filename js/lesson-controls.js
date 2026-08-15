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
        romajiOn: '<span class="lesson-control-icon" aria-hidden="true">AB</span>',
        romajiOff: '<span class="lesson-control-icon" aria-hidden="true">A/B</span>',
        direction: '<span class="lesson-control-icon lesson-flip-icon" aria-hidden="true">↕</span>',
        shuffle: '<span class="lesson-control-icon" aria-hidden="true">⤨</span>',
        reset: '<span class="lesson-control-icon" aria-hidden="true">↻</span>'
    };

    function getCards() { return Array.from(document.querySelectorAll("#grid .card")); }

    function updateSwitchUI() {
        const direction = document.getElementById("direction");
        if (!direction) return;
        direction.classList.toggle("right", showBack);
        direction.setAttribute("aria-pressed", String(showBack));
        direction.setAttribute("aria-label", showBack ? "Show all cards Front" : "Show all cards Back");
        direction.setAttribute("title", showBack ? "Show Front" : "Show Back");
        direction.innerHTML = ICONS.direction;
    }

    function updateRomajiUI() {
        const button = document.getElementById("backRomajiToggle");
        if (!button) return;
        button.innerHTML = ICONS.romajiOn + '<span class="lesson-control-label"> Romaji: ' + (showBackRomaji ? 'ON' : 'OFF') + '</span>';
        button.setAttribute("aria-pressed", String(showBackRomaji));
        button.setAttribute("aria-label", showBackRomaji ? "Romaji: ON" : "Romaji: OFF");
    }

    function applyCardState() {
        getCards().forEach(card => {
            card.classList.toggle("flipped", showBack);
            const romaji = card.querySelector(".vocabulary-back .romaji");
            if (romaji) romaji.style.display = showBackRomaji ? "" : "none";
        });
    }

    function toggleAllCards() { showBack = !showBack; updateSwitchUI(); applyCardState(); }
    function toggleBackRomaji() { showBackRomaji = !showBackRomaji; updateRomajiUI(); applyCardState(); }

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
            const label = document.createElement("label"); label.innerHTML = "&nbsp;";
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
        shuffleButton.dataset.desktopText = shuffleButton.dataset.desktopText || "Shuffle";
        shuffleButton.innerHTML = ICONS.shuffle;
        shuffleButton.setAttribute("aria-label", "Shuffle");
        shuffleButton.setAttribute("title", "Shuffle");
        updateRomajiUI(); updateSwitchUI();
    }

    function updateShuffleMobileLabel() {
        const shuffleButton = document.getElementById("shuffleBtn");
        if (!shuffleButton) return;
        const isMobile = mobileQuery ? mobileQuery.matches : window.matchMedia("(max-width:520px)").matches;
        if (isMobile) {
            shuffleButton.dataset.desktopText = shuffleButton.dataset.desktopText || "Shuffle";
            shuffleButton.innerHTML = ICONS.shuffle;
            shuffleButton.setAttribute("aria-label", "Shuffle");
            shuffleButton.setAttribute("title", "Shuffle");
        } else {
            shuffleButton.innerHTML = ICONS.shuffle + '<span class="lesson-control-label"> Shuffle</span>';
            shuffleButton.setAttribute("aria-label", "Shuffle");
            shuffleButton.removeAttribute("title");
        }
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
        direction.onclick = function (event) { event.preventDefault(); toggleAllCards(); };
        if (romajiButton) romajiButton.onclick = function (event) { event.preventDefault(); toggleBackRomaji(); };
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
