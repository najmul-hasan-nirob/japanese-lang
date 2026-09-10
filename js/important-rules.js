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
        return { kind: 'General', rule: String(value ?? '').trim() };
    }

    function addModalStyles() {
        if (document.getElementById('importantRulesModalStyles')) return;
        const style = document.createElement('style');
        style.id = 'importantRulesModalStyles';
        style.textContent = `
            #importantRuleEditModal{position:fixed;inset:0;z-index:100000;display:none;background:var(--paper,#f7f2e7);color:var(--ink,#241f18);overflow:auto}
            #importantRuleEditModal.open{display:block}
            #importantRuleEditModal .irm-wrap{min-height:100%;box-sizing:border-box;padding:28px 20px 50px;display:flex;flex-direction:column}
            #importantRuleEditModal .irm-head{display:flex;align-items:center;justify-content:space-between;gap:20px;max-width:900px;width:100%;margin:0 auto 28px}
            #importantRuleEditModal .irm-head h2{margin:0;font-family:"Shippori Mincho",serif;font-size:30px}
            #importantRuleEditModal .irm-close{width:42px;height:42px;border:0;border-radius:50%;background:transparent;color:inherit;font-size:30px;line-height:1;cursor:pointer}
            #importantRuleEditModal .irm-form{width:100%;max-width:900px;margin:auto;display:flex;flex-direction:column;gap:18px}
            #importantRuleEditModal label{font-weight:700;font-size:15px}
            #importantRuleEditModal input,#importantRuleEditModal textarea{width:100%;box-sizing:border-box;border:1px solid var(--paper-line,#d9d2c3);border-radius:10px;background:var(--paper-cell,#fffdf8);color:var(--ink,#241f18);font:inherit;padding:13px 14px}
            #importantRuleEditModal input{min-height:48px}
            #importantRuleEditModal textarea{min-height:260px;resize:vertical;line-height:1.65}
            #importantRuleEditModal .irm-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:6px}
            #importantRuleEditModal .irm-actions button{min-width:110px;padding:11px 18px;border-radius:9px;border:1px solid var(--paper-line,#d9d2c3);background:var(--paper-cell,#fffdf8);color:var(--ink,#241f18);font:inherit;font-weight:700;cursor:pointer}
            #importantRuleEditModal .irm-actions .irm-save{background:#18212c;color:#fff;border-color:#18212c}
            @media(max-width:520px){#importantRuleEditModal .irm-wrap{padding:18px 14px 30px}#importantRuleEditModal .irm-head h2{font-size:24px}#importantRuleEditModal .irm-head{margin-bottom:20px}#importantRuleEditModal textarea{min-height:220px}.irm-actions{padding-bottom:env(safe-area-inset-bottom)}}
        `;
        document.head.appendChild(style);
    }

    function ensureModal() {
        if (document.getElementById('importantRuleEditModal')) return document.getElementById('importantRuleEditModal');
        addModalStyles();
        const modal = document.createElement('div');
        modal.id = 'importantRuleEditModal';
        modal.innerHTML = `
            <div class="irm-wrap">
                <div class="irm-head"><h2>Edit Important Rule</h2><button type="button" class="irm-close" id="irmClose" aria-label="Close">×</button></div>
                <form class="irm-form" id="irmForm">
                    <div><label for="irmKind">What kind of rule?</label><input id="irmKind" type="text" autocomplete="off"></div>
                    <div><label for="irmRule">Write the rule</label><textarea id="irmRule"></textarea></div>
                    <div class="irm-actions"><button type="button" id="irmCancel">Cancel</button><button type="submit" class="irm-save">Save changes</button></div>
                </form>
            </div>`;
        document.body.appendChild(modal);
        modal.querySelector('#irmClose').addEventListener('click', closeModal);
        modal.querySelector('#irmCancel').addEventListener('click', closeModal);
        modal.querySelector('#irmForm').addEventListener('submit', saveEdit);
        return modal;
    }

    let editingIndex = -1;

    function openEdit(index) {
        const modal = ensureModal();
        const item = ruleObject(window.importantRules?.[index]);
        editingIndex = index;
        modal.querySelector('#irmKind').value = item.kind;
        modal.querySelector('#irmRule').value = item.rule;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.querySelector('#irmKind').focus(), 0);
    }

    function closeModal() {
        const modal = document.getElementById('importantRuleEditModal');
        if (!modal) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
        editingIndex = -1;
    }

    function saveEdit(event) {
        event.preventDefault();
        if (editingIndex < 0) return;
        const modal = document.getElementById('importantRuleEditModal');
        const kind = modal.querySelector('#irmKind').value.trim();
        const rule = modal.querySelector('#irmRule').value.trim();
        if (!kind || !rule) { alert('Both fields are required.'); return; }
        window.importantRules[editingIndex] = { kind, rule };
        closeModal();
        renderRules();
        saveRulesToDataFile();
    }

    async function saveRulesToDataFile() {
        // Editing/deleting the generated JS data requires the same protected
        // manual-input backend used to append new rules.
        if (typeof window.manualInputRuleAdminSave === 'function') {
            await window.manualInputRuleAdminSave(window.importantRules);
        }
    }

    function deleteRule(index) {
        const item = ruleObject(window.importantRules?.[index]);
        const confirmed = window.confirm(`Delete this important rule?\n\n${item.kind}\n${item.rule}\n\nThis cannot be undone.`);
        if (!confirmed) return;
        window.importantRules.splice(index, 1);
        renderRules();
        saveRulesToDataFile();
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
                    <button type="button" class="important-rule-edit" aria-label="Edit rule" title="Edit rule">✎</button>
                    <span class="lesson-card-number" aria-hidden="true">${index + 1}</span>
                    <span class="lesson-tag">Rule</span>
                    <button type="button" class="important-rule-delete" aria-label="Delete rule" title="Delete rule">🗑</button>
                </div>
                <div class="inner">
                    <div class="front"><div class="important-rule-text">${escapeHtml(rule.kind)}</div></div>
                    <div class="back"><div class="important-rule-text">${escapeHtml(rule.rule)}</div></div>
                </div>`;
            card.querySelector('.important-rule-edit').addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); openEdit(index); });
            card.querySelector('.important-rule-delete').addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); deleteRule(index); });
            card.addEventListener('click', function (event) {
                if (!event.target.closest('button')) card.classList.toggle('flipped');
            });
            fragment.appendChild(card);
        });
        list.appendChild(fragment);
        document.dispatchEvent(new CustomEvent('lessonCardsRendered'));
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderRules, { once: true });
    else renderRules();
})();
