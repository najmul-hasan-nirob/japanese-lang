// Japanese Lang — Manual Input
// Adds Similar Words entries directly to the repository through the GitHub Contents API.
(function () {
    'use strict';

    const OWNER = 'najmul-hasan-nirob';
    const REPO = 'japanese-lang';
    const BRANCH = 'main';
    const WORDS_PATH = 'js/similar words/similar-words-lesson.js';
    const SIMILAR_WORDS_PAGE = 'similar-words.html';
    const TOKEN_KEY = 'japanese-lang-github-token-session';

    const form = document.getElementById('manualInputForm');
    const japaneseInput = document.getElementById('manualJapanese');
    const romajiInput = document.getElementById('manualRomaji');
    const banglaInput = document.getElementById('manualBangla');
    const groupInput = document.getElementById('manualGroup');
    const newGroupInput = document.getElementById('manualNewGroup');
    const tokenInput = document.getElementById('githubToken');
    const targetSelect = document.getElementById('manualTarget');
    const submitButton = document.getElementById('manualSubmit');
    const status = document.getElementById('manualStatus');

    if (!form) return;

    function setStatus(message, type) {
        status.textContent = message || '';
        status.className = 'manual-status' + (type ? ' ' + type : '');
    }

    function encodeBase64(text) {
        const bytes = new TextEncoder().encode(text);
        let binary = '';
        for (let i = 0; i < bytes.length; i += 0x8000) {
            binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        }
        return btoa(binary);
    }

    function decodeBase64(base64) {
        const binary = atob(base64.replace(/\s/g, ''));
        const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    }

    async function githubRequest(path, options, token) {
        const response = await fetch('https://api.github.com' + path, {
            ...options,
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'Authorization': 'Bearer ' + token,
                ...(options && options.body ? { 'Content-Type': 'application/json' } : {}),
                ...(options && options.headers ? options.headers : {})
            }
        });
        const text = await response.text();
        let data = null;
        try { data = JSON.parse(text); } catch (_) {}
        if (!response.ok) throw new Error(data?.message || ('GitHub API error ' + response.status));
        return data;
    }

    async function getFile(path, token) {
        const data = await githubRequest(
            '/repos/' + OWNER + '/' + REPO + '/contents/' + encodeURIComponent(path).replace(/%2F/g, '/'),
            { method: 'GET' }, token
        );
        if (!data || Array.isArray(data) || !data.content || !data.sha) throw new Error('Could not read ' + path + '.');
        return { content: decodeBase64(data.content), sha: data.sha };
    }

    async function updateFile(path, content, sha, message, token) {
        return githubRequest(
            '/repos/' + OWNER + '/' + REPO + '/contents/' + encodeURIComponent(path).replace(/%2F/g, '/'),
            {
                method: 'PUT',
                body: JSON.stringify({ message, content: encodeBase64(content), sha, branch: BRANCH })
            }, token
        );
    }

    function jsString(value) { return JSON.stringify(String(value)); }

    function normalizeGroup(value) {
        return String(value || '').trim().toLowerCase().replace(/\s+/g, '-');
    }

    function displayGroup(value) {
        return String(value || '').replace(/[-_]+/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }

    function extractWords(jsContent) {
        const match = jsContent.match(/const\s+words\s*=\s*\[([\s\S]*?)\n\s*\];/);
        if (!match) throw new Error('Could not find the words array in the Similar Words file.');
        const groups = [];
        const groupRegex = /group\s*:\s*(['"])(.*?)\1/g;
        let groupMatch;
        while ((groupMatch = groupRegex.exec(match[1]))) {
            if (groupMatch[2] && !groups.includes(groupMatch[2])) groups.push(groupMatch[2]);
        }
        return { groups };
    }

    function appendWord(jsContent, word) {
        const match = jsContent.match(/const\s+words\s*=\s*\[([\s\S]*?)\n\s*\];/);
        if (!match) throw new Error('Could not find the words array in the Similar Words file.');
        const entry = `        { jp: ${jsString(word.jp)}, romaji: ${jsString(word.romaji)}, bn: ${jsString(word.bn)}, group: ${jsString(word.group)} }`;
        const separator = match[1].trim() ? ',\n' : '\n';
        const replacement = 'const words = [' + match[1].replace(/\s*$/, '') + separator + entry + '\n    ];';
        return jsContent.replace(match[0], replacement);
    }

    function addFilterCheckbox(htmlContent, group) {
        const panelRegex = /(<div\s+class=["']multiselect-panel["']\s+id=["']similarWordsPanel["'][^>]*>)([\s\S]*?)(<\/div>)/i;
        const match = htmlContent.match(panelRegex);
        if (!match) throw new Error('Could not find the Similar Words filter panel.');
        const escapedGroup = group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp('value=["\\\']' + escapedGroup + '["\\\']').test(match[2])) return htmlContent;
        const checkbox = `            <label><input type="checkbox" value="${group}" checked> ${displayGroup(group)}</label>\n`;
        return htmlContent.replace(panelRegex, match[1] + match[2] + checkbox + match[3]);
    }

    function getSessionToken() {
        try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch (_) { return ''; }
    }

    function setSessionToken(token) {
        try { sessionStorage.setItem(TOKEN_KEY, token); } catch (_) {}
    }

    function updateTokenUI() {
        const saved = getSessionToken();
        if (saved) {
            tokenInput.value = saved;
            tokenInput.placeholder = 'Token saved for this browser tab';
        }
    }

    function showNewGroupField() {
        const createNew = groupInput.value === '__create_new__';
        newGroupInput.hidden = !createNew;
        newGroupInput.required = createNew;
        if (createNew) newGroupInput.focus();
    }

    function populateGroups(groups) {
        const current = groupInput.value;
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
        if (groups.includes(current)) groupInput.value = current;
        else if (groups.length) groupInput.value = groups[0];
        showNewGroupField();
    }

    async function loadGroups() {
        const token = tokenInput.value.trim() || getSessionToken();
        if (!token) {
            groupInput.innerHTML = '<option value="" disabled selected>Enter GitHub token first</option><option value="__create_new__">＋ Create a new group</option>';
            return;
        }
        try {
            const file = await getFile(WORDS_PATH, token);
            populateGroups(extractWords(file.content).groups);
        } catch (_) {
            groupInput.innerHTML = '<option value="" disabled selected>Could not load groups</option><option value="__create_new__">＋ Create a new group</option>';
        }
    }

    groupInput.addEventListener('change', showNewGroupField);

    tokenInput.addEventListener('input', () => {
        const token = tokenInput.value.trim();
        if (token) setSessionToken(token);
    });
    tokenInput.addEventListener('blur', loadGroups);

    updateTokenUI();
    if (getSessionToken()) loadGroups();
    else groupInput.innerHTML = '<option value="" disabled selected>Enter GitHub token first</option><option value="__create_new__">＋ Create a new group</option>';

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        setStatus('', '');

        let group = groupInput.value === '__create_new__' ? newGroupInput.value : groupInput.value;
        group = normalizeGroup(group);
        const token = tokenInput.value.trim() || getSessionToken();
        const word = {
            jp: japaneseInput.value.trim(),
            romaji: romajiInput.value.trim(),
            bn: banglaInput.value.trim(),
            group
        };
        const target = targetSelect.selectedOptions[0];
        const wordsPath = target?.dataset.jsPath || WORDS_PATH;

        if (!word.jp || !word.romaji || !word.bn || !word.group || !token) {
            setStatus('Please complete all fields.', 'error');
            return;
        }
        if (wordsPath !== WORDS_PATH) {
            setStatus('This Similar Words target is not configured yet.', 'error');
            return;
        }

        setSessionToken(token);
        tokenInput.value = token;
        submitButton.disabled = true;
        submitButton.textContent = 'Adding...';

        try {
            setStatus('Reading the current Similar Words files...', '');
            const wordsFile = await getFile(WORDS_PATH, token);
            const pageFile = await getFile(SIMILAR_WORDS_PAGE, token);
            const { groups } = extractWords(wordsFile.content);
            const escapedJapanese = word.jp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (new RegExp('jp\\s*:\\s*(["\\\'])' + escapedJapanese + '\\1').test(wordsFile.content)) {
                throw new Error('This Japanese word already exists in the Similar Words file.');
            }

            let updatedWords = appendWord(wordsFile.content, word);
            let updatedPage = pageFile.content;
            if (!groups.includes(word.group)) updatedPage = addFilterCheckbox(updatedPage, word.group);

            if (updatedPage !== pageFile.content) {
                setStatus('Adding the new filter group...', '');
                await updateFile(SIMILAR_WORDS_PAGE, updatedPage, pageFile.sha, 'Add Similar Words filter group: ' + word.group, token);
            }
            setStatus('Adding the new word...', '');
            await updateFile(WORDS_PATH, updatedWords, wordsFile.sha, 'Add Similar Word: ' + word.jp, token);

            setStatus('Added successfully: ' + word.jp + ' (' + word.group + ').', 'success');
            form.reset();
            tokenInput.value = token;
            await loadGroups();
        } catch (error) {
            setStatus(error?.message || 'Could not add the word.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Add Word';
        }
    });
})();
