// Shared Front / Back switch for Numbers & Lessons.
// Kana keeps its own direction logic in home.js because that page uses
// the Kana/Romaji compatibility labels while rendering cards.
(function () {
    if (document.getElementById('scriptBtn')) return;

    const FLIP_ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>';
    const LABEL = '<span class="lesson-control-text">Front / Back</span>';
    const REVERSE_WAIT_MS = 4000;
    const REVERSE_AFTER_MS = 1000;

    function initDirectionSwitch() {
        const direction = document.getElementById('direction');
        const grid = document.getElementById('grid');
        if (!direction || !grid) return;

        let showBack = false;
        let reverseRunning = false;

        function updateUI() {
            direction.classList.toggle('right', showBack);
            direction.setAttribute('aria-pressed', String(showBack));
            direction.setAttribute('aria-label', showBack ? 'Show all cards Front' : 'Show all cards Back');
            direction.setAttribute('title', showBack ? 'Show Front' : 'Show Back');
            direction.innerHTML = LABEL + FLIP_ICON;
        }

        function applyState() {
            grid.querySelectorAll(':scope > .card:not(.blank)').forEach(card => card.classList.toggle('flipped', showBack));
        }

        function japaneseText(card) {
            const clone = (card.querySelector('.front') || card).cloneNode(true);
            clone.querySelectorAll('.lesson-card-topbar,.speaker-btn,.speak-btn,.pronunciation-btn,.romaji,.hard-star,.lesson-card-number,img,svg,button').forEach(e => e.remove());
            return clone.textContent
                .replace(/[^\u3040-\u30ff\u3400-\u9fff\uff66-\uff9fー々〆〇・「」『』【】［］（）！？。、「」\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function banglaText(card) {
            const el = card.querySelector('.bangla');
            if (!el) return '';
            return el.textContent.replace(/\s*\/\s*/g, ' অথবা ').replace(/\s+/g, ' ').trim();
        }

        function browserSpeak(text, lang) {
            try {
                const s = window.speechSynthesis;
                if (!s || typeof SpeechSynthesisUtterance === 'undefined' || !text) return;
                const u = new SpeechSynthesisUtterance(text);
                u.lang = lang;
                u.rate = lang.startsWith('ja') ? .9 : .9;
                s.cancel();
                s.resume();
                s.speak(u);
            } catch (e) {
                console.warn('Front/Back reverse speech failed:', e);
            }
        }

        function speakBangla(text) {
            if (!text) return;
            if (window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') {
                try {
                    window.AndroidTTS.speak(text);
                    return;
                } catch (e) {
                    console.warn('AndroidTTS Bangla failed, falling back to Web Speech.', e);
                }
            }
            browserSpeak(text, 'bn-BD');
        }

        function speakJapanese(text) {
            if (!text) return;
            if (window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') {
                try {
                    window.AndroidTTS.speak(text);
                    return;
                } catch (e) {
                    console.warn('AndroidTTS Japanese failed, falling back to Web Speech.', e);
                }
            }
            browserSpeak(text, 'ja-JP');
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function reverseTeacherSequence(currentCard) {
            if (reverseRunning || !currentCard) return;

            // Only activate this special reverse sequence when Teacher Mode is
            // actually running on the current card.
            const teacherActive = currentCard.classList.contains('teacher-active');
            const teacherButton = document.querySelector('.teacher-mode-btn');
            if (!teacherActive || !teacherButton) return;

            reverseRunning = true;

            // Stop the normal Teacher Mode sequence so its timers/speech do not
            // race with the reverse sequence.
            const stopButton = document.querySelector('.teacher-stop-btn');
            if (stopButton && !stopButton.disabled) stopButton.click();
            try {
                window.speechSynthesis?.cancel();
            } catch (e) {}

            const bangla = banglaText(currentCard);
            const japanese = japaneseText(currentCard);

            // Back -> Front reverse sequence:
            // Bangla → wait 4 seconds → Japanese → wait 1 second → next card.
            speakBangla(bangla);
            await sleep(REVERSE_WAIT_MS);
            speakJapanese(japanese);
            await sleep(REVERSE_AFTER_MS);

            // Continue Teacher Mode from the card after the one just reviewed.
            const allCards = Array.from(grid.querySelectorAll(':scope > .card:not(.blank)'));
            const currentIndex = allCards.indexOf(currentCard);
            const nextCards = currentIndex >= 0 ? allCards.slice(currentIndex + 1) : [];

            if (nextCards.length) {
                // Teacher Mode always starts from its first currently-visible
                // card. Temporarily hide the current/previous cards so that its
                // first card is exactly the next card, then restore their display.
                const hidden = allCards.slice(0, currentIndex + 1).map(card => ({
                    card,
                    display: card.style.display
                }));
                hidden.forEach(item => { item.card.style.display = 'none'; });

                teacherButton.click();

                setTimeout(() => {
                    hidden.forEach(item => { item.card.style.display = item.display; });
                }, 0);
            }

            reverseRunning = false;
        }

        function toggle() {
            const wasBack = showBack;
            const currentCard = grid.querySelector(':scope > .card.teacher-active');

            showBack = !showBack;
            updateUI();
            applyState();

            // When returning from Back to Front during Teacher Mode, run the
            // reverse pronunciation flow on the currently active card.
            if (wasBack && !showBack && currentCard) {
                reverseTeacherSequence(currentCard);
            }
        }

        direction.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            toggle();
        }, true);

        direction.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopImmediatePropagation();
                toggle();
            }
        }, true);

        updateUI();
        applyState();
        new MutationObserver(() => { if (showBack) applyState(); }).observe(grid, { childList: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDirectionSwitch);
    else initDirectionSwitch();
})();
