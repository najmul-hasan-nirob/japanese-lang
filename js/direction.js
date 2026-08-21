// Shared Front / Back switch for Numbers & Lessons.
// Kana keeps its own direction logic in home.js because that page uses
// the Kana/Romaji compatibility labels while rendering cards.
(function () {
    if (document.getElementById('scriptBtn')) return;

    const FLIP_ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>';
    const LABEL = '<span class="lesson-control-text">Front / Back</span>';

    function initDirectionSwitch() {
        const direction = document.getElementById('direction');
        const grid = document.getElementById('grid');
        if (!direction || !grid) return;

        // Use the button's actual visual state as the source of truth. This
        // keeps the reverse Teacher Mode trigger synchronized even if another
        // script changes the direction state before this handler runs.
        let showBack = direction.classList.contains('right') || direction.getAttribute('aria-pressed') === 'true';

        function updateUI() {
            direction.classList.toggle('right', showBack);
            direction.setAttribute('aria-pressed', String(showBack));
            direction.setAttribute('aria-label', showBack ? 'Show all cards Front' : 'Show all cards Back');
            direction.setAttribute('title', showBack ? 'Show Front' : 'Show Back');
            direction.innerHTML = LABEL + FLIP_ICON;
        }

        function applyState() {
            grid.querySelectorAll(':scope > .card:not(.blank)').forEach(card => {
                card.classList.toggle('flipped', showBack);
            });
        }

        function runReverseTeacherMode() {
            if (typeof window.TeacherMode?.reverseCurrent === 'function') {
                window.TeacherMode.reverseCurrent();
            }
        }

        function toggle() {
            // Capture the state BEFORE changing it. If we were on Back and
            // are now returning to Front, Teacher Mode must run:
            // Bangla -> 4 seconds -> Japanese -> 1 second -> next card.
            const wasBack = showBack;
            showBack = !showBack;
            updateUI();
            applyState();

            if (wasBack && !showBack) {
                runReverseTeacherMode();
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
