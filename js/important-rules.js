// Japanese Lang — Important Rules data
const importantRules = [
    { kind: "General", rule: "To er niyom" },
    { kind: "Test front", rule: "Test back" }
];
window.importantRules = importantRules;

(function () {
    'use strict';

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>'"]/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[c]));
    }

    function ruleObject(value) {
        if (value && typeof value === 'object') {
            return {
                kind: String(value.kind ?? '').trim() || 'General',
                rule: String(value.rule ?? '').trim()
            };
        }
        // Keep older rules added before the two-field system working.
        return { kind: 'General', rule: String(value ?? '').trim() };
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

        rules.forEach(function (rawRule, index) {
            const rule = ruleObject(rawRule);
            const card = document.createElement('div');
            card.className = 'card important-rule-card';
            card.setAttribute('data-favorite-key', `important-rule|${rule.kind}|${rule.rule}`);
            card.innerHTML = `
                <div class="lesson-card-topbar" aria-label="Card controls">
                    <button type="button" class="hard-star" aria-label="Mark as favourite" title="Mark as favourite">☆</button>
                    <span class="lesson-card-number" aria-hidden="true">${index + 1}</span>
                    <span class="lesson-tag">Rule</span>
                </div>
                <div class="inner">
                    <div class="front">
                        <div class="important-rule-text">${escapeHtml(rule.kind)}</div>
                    </div>
                    <div class="back">
                        <div class="important-rule-text">${escapeHtml(rule.rule)}</div>
                    </div>
                </div>`;

            card.addEventListener('click', function (event) {
                if (!event.target.closest('button')) card.classList.toggle('flipped');
            });

            fragment.appendChild(card);
        });

        list.appendChild(fragment);
        document.dispatchEvent(new CustomEvent('lessonCardsRendered'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderRules, { once: true });
    } else {
        renderRules();
    }
})();
