// =====================================================
// Shared Front / Back switch for Kana, Numbers & Lessons
// =====================================================
// Uses the same labelled SVG button presentation as Lessons.
// =====================================================

(function () {
    const FLIP_ICON = '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15l-3-3M20 17H5l3 3M19 7l-3-3M5 17l3 3"></path></svg>';

    function labelledIcon(label) {
        return '<span class="lesson-control-text">' + label + '</span>' + FLIP_ICON;
    }

    function moveToDesktopToolbar(direction) {
        if (window.innerWidth <= 520) return;
        const toolbar = document.querySelector('.toolbar');
        if (!direction || !toolbar) return;

        let field = direction.closest('.field');
        if (!field) {
            field = document.createElement('div');
            field.id = 'directionFilterField';
            field.className = 'field direction-field';
            toolbar.appendChild(field);
            field.appendChild(direction);
        }

        const label = field.querySelector(':scope > label');
        if (label) label.remove();
    }

    function initDirectionSwitch() {
        const direction = document.getElementById('direction');
        const grid = document.getElementById('grid');
        if (!direction || !grid) return;

        let showBack = false;

        function updateUI() {
            direction.classList.toggle('right', showBack);
            direction.setAttribute('aria-pressed', String(showBack));
            direction.setAttribute('aria-label', showBack ? 'Show all cards Front' : 'Show all cards Back');
            direction.setAttribute('title', showBack ? 'Show Front' : 'Show Back');
            // Lessons uses the exact same visual control.
            if (!direction.closest('.mobile-bottom-controls')) {
                direction.innerHTML = labelledIcon('Front / Back');
            }
        }

        function applyState() {
            grid.querySelectorAll(':scope > .card:not(.blank)').forEach(card => {
                card.classList.toggle('flipped', showBack);
            });
        }

        function toggle() {
            showBack = !showBack;
            updateUI();
            applyState();
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
        moveToDesktopToolbar(direction);

        const observer = new MutationObserver(() => {
            if (showBack) applyState();
        });
        observer.observe(grid, { childList: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDirectionSwitch);
    } else {
        initDirectionSwitch();
    }
})();
