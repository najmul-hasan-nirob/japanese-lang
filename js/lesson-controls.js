// =====================================================
// Lessons page controls
// =====================================================
// Front / Back, Back Romaji, and Reset controls.
// Reset returns every card to Front and scrolls to the top
// without reloading the page. On mobile it lives beside
// Shuffle in the existing sticky bottom controls.
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
        const leftLabel = document.getElementById("directionLeftLabel");
        const rightLabel = document.getElementById("directionRightLabel");

        if (!direction) return;

        direction.classList.toggle("right", showBack);
        direction.setAttribute("aria-pressed", String(showBack));

        if (leftLabel) {
            leftLabel.textContent = "Front";
            leftLabel.classList.toggle("active", !showBack);
        }

        if (rightLabel) {
            rightLabel.textContent = "Back";
            rightLabel.classList.toggle("active", showBack);
        }
    }

    function updateRomajiUI() {
        const button = document.getElementById("backRomajiToggle");
        if (!button) return;

        button.textContent = showBackRomaji ? "Romaji: ON" : "Romaji: OFF";
        button.setAttribute("aria-pressed", String(showBackRomaji));
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
        // Reset the visual study state only. Do not reload or change filters.
        showBack = false;
        updateSwitchUI();
        applyCardState();

        // Return to the very top of the Lessons page.
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

    function ensureDesktopReset() {
        const romajiButton = document.getElementById("backRomajiToggle");
        if (!romajiButton) return;

        const button = createResetButton();
        const field = romajiButton.closest(".field");

        if (field && field.parentElement) {
            // Keep Reset immediately after the Romaji control on desktop.
            let resetField = document.getElementById("lessonResetField");
            if (!resetField) {
                resetField = document.createElement("div");
                resetField.id = "lessonResetField";
                resetField.className = "field lesson-reset-field";
                const label = document.createElement("label");
                label.innerHTML = "&nbsp;";
                resetField.appendChild(label);
                resetField.appendChild(button);
                field.parentElement.insertBefore(resetField, field.nextSibling);
            } else if (button.parentElement !== resetField) {
                resetField.appendChild(button);
            }
        }
    }

    function ensureMobileControls() {
        const shuffleButton = document.getElementById("shuffleBtn");
        const romajiButton = document.getElementById("backRomajiToggle");
        if (!shuffleButton || !romajiButton) return;

        let mobileBar = document.querySelector(".mobile-bottom-controls");
        if (!mobileBar) {
            mobileBar = document.createElement("div");
            mobileBar.className = "mobile-bottom-controls";
            mobileBar.setAttribute("aria-label", "Lesson controls");
            document.body.appendChild(mobileBar);
        }

        const button = createResetButton();

        // Keep mobile order: Shuffle → Reset → Romaji.
        if (shuffleButton.parentElement !== mobileBar) mobileBar.appendChild(shuffleButton);
        if (button.parentElement !== mobileBar) mobileBar.appendChild(button);
        if (romajiButton.parentElement !== mobileBar) mobileBar.appendChild(romajiButton);

        mobileBar.appendChild(shuffleButton);
        mobileBar.appendChild(button);
        mobileBar.appendChild(romajiButton);

        updateShuffleMobileLabel();
    }

    function updateShuffleMobileLabel() {
        const shuffleButton = document.getElementById("shuffleBtn");
        if (!shuffleButton) return;

        const isMobile = mobileQuery ? mobileQuery.matches : window.matchMedia("(max-width:520px)").matches;
        if (isMobile) {
            shuffleButton.dataset.desktopText = shuffleButton.dataset.desktopText || shuffleButton.textContent.trim();
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
        if (isMobile) ensureMobileControls();
        else ensureDesktopReset();
        updateShuffleMobileLabel();
    }

    function init() {
        const direction = document.getElementById("direction");
        const grid = document.getElementById("grid");
        const romajiButton = document.getElementById("backRomajiToggle");

        if (!direction || !grid) return;

        direction.setAttribute("aria-label", "Show all lesson cards front or back");

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
        });
        observer.observe(grid, { childList: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
