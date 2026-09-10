// Japanese Lang — Important Rules data
const importantRules = [
    // Rules are appended automatically by the Manual Input page.,
    "To er niyom"
];
window.importantRules = importantRules;

(function () {
    'use strict';

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>'"]/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[c]));
    }

    function renderRules() {
        const list = document.getElementById('importantRulesList');
        if (!list) return;

        const rules = window.importantRules || [];
        list.innerHTML = '';

        if (!rules.length) {
            list.innerHTML = '<div class="important-rules-empty">No important rules added yet.</div>';
            return;
        }

        const fragment = document.createDocumentFragment();

        rules.forEach(function (rule, index) {
            const card = document.createElement('div');
            card.className = 'card important-rule-card';
            card.innerHTML = `
                <div class="lesson-card-topbar" aria-label="Card information">
                    <button type="button" class="hard-star" aria-label="Mark as important" title="Mark as important">☆</button>
                    <span class="lesson-card-number" aria-hidden="true">${index + 1}</span>
                    <span class="lesson-tag">Rule</span>
                </div>
                <div class="inner">
                    <div class="front">
                        <div class="important-rule-text">${escapeHtml(rule)}</div>
                    </div>
                </div>`;

            const star = card.querySelector('.hard-star');
            star.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                const active = star.classList.toggle('active');
                star.textContent = active ? '★' : '☆';
                star.setAttribute('aria-pressed', String(active));
            });

            fragment.appendChild(card);
        });

        list.appendChild(fragment);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderRules, { once: true });
    } else {
        renderRules();
    }
})();
