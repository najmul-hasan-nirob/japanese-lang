// =====================================================
// Lessons page controls
// =====================================================
// Front / Back, Back Romaji, and Reset controls.
// Control order: Romaji → Front/Back → Shuffle → Reset.
// Reset returns every card to Front and scrolls to the top
// without reloading the page.
// =====================================================

(function () {
    let showBack = false;
    let showBackRomaji = true;
    let observer = null;
    let resetButton = null;
    let mobileQuery = null;

    function getCards() {
        return Array.from(document.querySelectorAll("#grid .card"));
    }

    function updateSwitchUI() {
        const direction = document.getElementById("direction");
        if (!direction) return;

        direction.classList.toggle("right", showBack);
        direction.setAttribute("aria-pressed", String(showBack));
        direction.setAttribute("aria-label", showBack ? "Show all cards Front" : "Show all cards Back");
        direction.setAttribute("title", showBack ? "Show Front" : "Show Back");

        // The control is intentionally icon-only.
        direction.textContent = "↔";
    }

    function updateRomajiUI() {
        const button = document.getElementById("backRomajiToggle");
        if (!button) return;

        // Keep the Romaji text visible on desktop and mobile.
        button.textContent = showBackRomaji ? "Romaji: ON" : "Romaji: OFF";
        button.setAttribute("aria-pressed", String(showBackRomaji));
        button.setAttribute("aria-label", showBackRomaji ? "Romaji: ON" : "Romaji: OFF");
    }

    function applyCardState() {
        getCards().forEach(card => {
            card.classList.toggle("flipped", showBack);

            const romaji = card.querySelector(".vocabulary-back .romaji");
            if (romaji) {
                romaji.style.display = showBackRomaji ? "" : "none";
            }
        });
    }

    function toggleAllCards() {
        showBack = !showBack;
        updateSwitchUI();
        applyCardState();
    }

    function toggleBackRomaji() {
        showBackRomaji = !showBackRomaji;
        updateRomajiUI();
        applyCardState();
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
        resetButton.textContent = "↻";

        resetButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            resetLessons();
        });

        return resetButton;
    }

    function getField(element) {
        return element ? element.closest(".field") : null;
    }

    function ensureDesktopOrder() {
        const toolbar = document.querySelector(".toolbar");
        const romajiButton = document.getElementById("backRomajiToggle");
        const direction = document.getElementById("direction");
        const shuffleButton = document.getElementById("shuffleBtn");
        if (!toolbar || !romajiButton || !direction || !shuffleButton) return;

        const romajiField = getField(romajiButton);
        const directionField = getField(direction);
        const shuffleField = getField(shuffleButton);
        if (!romajiField || !directionField || !shuffleField) return;

        const reset = createResetButton();
        let resetField = document.getElementById("lessonResetField");
        if (!resetField) {
            resetField = document.createElement("div");
            resetField.id = "lessonResetField";
            resetField.className = "field lesson-reset-field";
            const label = document.createElement("label");
            label.innerHTML = "&nbsp;";
            resetField.appendChild(label);
            resetField.appendChild(reset);
        }

        // Exact desktop order: Romaji → Front/Back → Shuffle → Reset.
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

        const button = createResetButton();

        // Exact mobile order: Romaji → Front/Back → Shuffle → Reset.
        mobileBar.appendChild(romajiButton);
        mobileBar.appendChild(direction);
        mobileBar.appendChild(shuffleButton);
        mobileBar.appendChild(button);

        // Mobile Shuffle is icon-only; Romaji keeps its text.
        shuffleButton.dataset.desktopText = shuffleButton.dataset.desktopText || "🔀 Shuffle";
        shuffleButton.textContent = "🔀";
        shuffleButton.setAttribute("aria-label", "Shuffle");
        shuffleButton.setAttribute("title", "Shuffle");

        updateRomajiUI();
        updateSwitchUI();
    }

    function updateShuffleMobileLabel() {
        const shuffleButton = document.getElementById("shuffleBtn");
        if (!shuffleButton) return;

        const isMobile = mobileQuery ? mobileQuery.matches : window.matchMedia("(max-width:520px)").matches;
        if (isMobile) {
            shuffleButton.dataset.desktopText = shuffleButton.dataset.desktopText || "🔀 Shuffle";
            shuffleButton.textContent = "🔀";
            shuffleButton.setAttribute("aria-label", "Shuffle");
            shuffleButton.setAttribute("title", "Shuffle");
        } else {
            shuffleButton.textContent = shuffleButton.dataset.desktopText || "🔀 Shuffle";
            shuffleButton.setAttribute("aria-label", "Shuffle");
            shuffleButton.removeAttribute("title");
        }
    }

    function syncResponsiveControls() {
        const isMobile = mobileQuery ? mobileQuery.matches : window.matchMedia("(max-width:520px)").matches;
        if (isMobile) {
            ensureMobileControls();
        } else {
            ensureDesktopOrder();
        }
        updateShuffleMobileLabel();
        updateRomajiUI();
        updateSwitchUI();
    }

    function init() {
        const direction = document.getElementById("direction");
        const grid = document.getElementById("grid");
        const romajiButton = document.getElementById("backRomajiToggle");

        if (!direction || !grid) return;

        if (direction.__lessonCardsHandler) {
            direction.removeEventListener("click", direction.__lessonCardsHandler);
        }
        direction.__lessonCardsHandler = function (event) {
            event.preventDefault();
            toggleAllCards();
        };
        direction.addEventListener("click", direction.__lessonCardsHandler);

        if (direction.__lessonCardsKeyHandler) {
            direction.removeEventListener("keydown", direction.__lessonCardsKeyHandler);
        }
        direction.__lessonCardsKeyHandler = function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleAllCards();
            }
        };
        direction.addEventListener("keydown", direction.__lessonCardsKeyHandler);

        if (romajiButton) {
            if (romajiButton.__handler) {
                romajiButton.removeEventListener("click", romajiButton.__handler);
            }
            romajiButton.__handler = function (event) {
                event.preventDefault();
                toggleBackRomaji();
            };
            romajiButton.addEventListener("click", romajiButton.__handler);
        }

        mobileQuery = window.matchMedia("(max-width:520px)");
        if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", syncResponsiveControls);
        else if (mobileQuery.addListener) mobileQuery.addListener(syncResponsiveControls);

        updateSwitchUI();
        updateRomajiUI();
        applyCardState();
        syncResponsiveControls();

        if (observer) observer.disconnect();
        observer = new MutationObserver(() => {
            if (showBack || !showBackRomaji) applyCardState();
            syncResponsiveControls();
        });
        observer.observe(grid, { childList: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
