// Japanese Lang — Secure Manual Input
(function () {
    'use strict';

    const SUPABASE_URL = 'https://levpdywhnikadumfocao.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxldnBkeXdobmlrYWR1bWZvY2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4Nzk1MzUsImV4cCI6MjEwMjQ1NTUzNX0.NiBsJ_jEeAPNuDLdjqn9bQamTOz-kgLaLLQPcE6N6aM';
    const WORDS_RAW_URL = 'https://raw.githubusercontent.com/najmul-hasan-nirob/japanese-lang/main/js/similar%20words/similar-words-lesson.js';

    const lock = document.getElementById('manualLock');
    const unlockForm = document.getElementById('manualUnlockForm');
    const passwordInput = document.getElementById('manualPassword');
    const unlockStatus = document.getElementById('manualUnlockStatus');
    const form = document.getElementById('manualInputForm');
    const japaneseInput = document.getElementById('manualJapanese');
    const romajiInput = document.getElementById('manualRomaji');
    const banglaInput = document.getElementById('manualBangla');
    const groupInput = document.getElementById('manualGroup');
    const newGroupInput = document.getElementById('manualNewGroup');
    const targetSelect = document.getElementById('manualTarget');
    const submitButton = document.getElementById('manualSubmit');
    const status = document.getElementById('manualStatus');
    const lockButton = document.getElementById('manualLockButton');

    let unlockPassword = '';

    if (!form || !unlockForm) return;

    function setStatus(el, message, type) {
        el.textContent = message || '';
        el.className = 'manual-status' + (type ? ' ' + type : '');
    }

    function normalizeGroup(value) {
        return String(value || '').trim().toLowerCase().replace(/\s+/g, '-');
    }

    function displayGroup(value) {
        return String(value || '').replace(/[-_]+/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }

    function extractGroups(jsContent) {
        const match = jsContent.match(/const\s+words\s*=\s*\[([\s\S]*?)\n\s*\];/);
        if (!match) throw new Error('Could not find the words array.');
        const groups = [];
        const re = /group\s*:\s*(['"])(.*?)\1/g;
        let m;
        while ((m = re.exec(match[1]))) {
            if (m[2] && !groups.includes(m[2])) groups.push(m[2]);
        }
        return groups;
    }

    async function loadGroups() {
        try {
            groupInput.innerHTML = '<option value="" disabled selected>Loading groups...</option>';
            const response = await fetch(WORDS_RAW_URL + '?t=' + Date.now(), { cache: 'no-store' });
            if (!response.ok) throw new Error('Could not load groups.');
            populateGroups(extractGroups(await response.text()));
        } catch (error) {
            groupInput.innerHTML = '<option value="" disabled selected>Could not load groups</option><option value="__create_new__">＋ Create a new group</option>';
            setStatus(status, error.message, 'error');
        }
    }

    function populateGroups(groups) {
        groupInput.innerHTML = '<option value="" disabled>Select a group</option>';
        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = displayGroup(group);
            groupInput.appendChild(option);
        });
        const createOption = document.createElement('option');
        createOption.value = '__create_new__';
        createOption.textContent = '＋ Create a new group';
        groupInput.appendChild(createOption);
        if (groups.length) groupInput.value = groups[0];
        showNewGroupField();
    }

    function showNewGroupField() {
        const createNew = groupInput.value === '__create_new__';
        newGroupInput.hidden = !createNew;
        newGroupInput.required = createNew;
        if (createNew) newGroupInput.focus();
    }

    async function verifyPassword(password) {
        const response = await fetch(SUPABASE_URL + '/functions/v1/manual-input', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'verify', password })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Incorrect password.');
        return true;
    }

    function unlock() {
        lock.hidden = true;
        form.hidden = false;
        loadGroups();
        japaneseInput.focus();
    }

    function lockPage() {
        unlockPassword = '';
        form.hidden = true;
        lock.hidden = false;
        passwordInput.value = '';
        setStatus(unlockStatus, '', '');
        passwordInput.focus();
    }

    unlockForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const password = passwordInput.value;
        if (!password) return;
        const button = unlockForm.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        setStatus(unlockStatus, 'Checking password...', '');
        try {
            await verifyPassword(password);
            unlockPassword = password;
            unlock();
        } catch (error) {
            setStatus(unlockStatus, error.message || 'Incorrect password.', 'error');
        } finally {
            if (button) button.disabled = false;
        }
    });

    lockButton.addEventListener('click', lockPage);
    groupInput.addEventListener('change', showNewGroupField);

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        setStatus(status, '', '');

        const group = normalizeGroup(groupInput.value === '__create_new__' ? newGroupInput.value : groupInput.value);
        const word = {
            jp: japaneseInput.value.trim(),
            romaji: romajiInput.value.trim(),
            bn: banglaInput.value.trim(),
            group
        };
        const target = targetSelect.selectedOptions[0];

        if (!word.jp || !word.romaji || !word.bn || !word.group) {
            setStatus(status, 'Please complete all fields.', 'error');
            return;
        }
        if (!target || target.value !== 'similar-words') {
            setStatus(status, 'This Similar Words target is not configured yet.', 'error');
            return;
        }
        if (!unlockPassword) {
            lockPage();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Adding...';
        try {
            setStatus(status, 'Adding the word securely...', '');
            const response = await fetch(SUPABASE_URL + '/functions/v1/manual-input', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
                    'apikey': SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: unlockPassword, target: target.value, ...word })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'Could not add the word.');
            setStatus(status, data.message || ('Added successfully: ' + word.jp), 'success');
            form.reset();
            await loadGroups();
        } catch (error) {
            setStatus(status, error.message || 'Could not add the word.', 'error');
            if (/password/i.test(error.message || '')) lockPage();
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Add Word';
        }
    });

    lock.hidden = false;
    form.hidden = true;
    passwordInput.focus();
})();
