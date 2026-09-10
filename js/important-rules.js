// Japanese Lang — Important Rules data
const importantRules = [
    // Rules are appended automatically by the Manual Input page.,
    "To er niyom"
];
window.importantRules = importantRules;

(function () {
    'use strict';

    function renderRules() {
        const list = document.getElementById('importantRulesList');
        if (!list) return;

        const rules = window.importantRules || [];
        list.innerHTML = '';

        if (!rules.length) {
            list.innerHTML = '<div class="important-rules-empty">No important rules added yet.</div>';
            return;
        }

        rules.forEach(function (rule) {
            const item = document.createElement('div');
            item.className = 'important-rule';
            item.textContent = rule;
            list.appendChild(item);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderRules, { once: true });
    } else {
        renderRules();
    }
})();
