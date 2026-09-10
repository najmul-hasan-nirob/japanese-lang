// Japanese Lang — Manual Input
// Adds Similar Words entries directly to the repository through the GitHub Contents API.
(function () {
    'use strict';

    const OWNER = 'najmul-hasan-nirob';
    const REPO = 'japanese-lang';
    const BRANCH = 'main';
    const WORDS_PATH = 'js/similar words/similar-words-lesson.js';
    const SIMILAR_WORDS_PAGE = 'similar-words.html';
    const FILTER_KEY = 'japanese-lang-similar-words-filter-v1';

    const form = document.getElementById('manualInputForm');
    const japaneseInput = document.getElementById('manualJapanese');
    const romajiInput = document.getElementById('manualRomaji');
    const banglaInput = document.getElementById('manualBangla');
    const groupInput = document.getElementById('manualGroup');
    const groupOptions = document.getElementById('manualGroupOptions');
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
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
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
            { method: 'GET' },
            token
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
            },
            token
        );
    }

    function jsString(value) {
        return JSON.stringify(String(value));
    }

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
        const body = match[1].trimEnd();
        const separator = body ? ',\n' : '\n';
        const replacement = 'const words = [' + match[1].replace(/\s*$/, '') + separator + entry + '\n    ];';
        return jsContent.replace(match[0], replacement);
    }

    function addFilterCheckbox(htmlContent, group) {
        const panelRegex = /(<div\s+class=["']multiselect-panel["']\s+id=["']similarWordsPanel["'][^>]*>)([\s\S]*?)(<\/div>)/i;
        const match = htmlContent.match(panelRegex);
        if (!match) throw new Error('Could not find the Similar Words filter panel.');

        const escapedGroup = group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const valueRegex = new RegExp('value=["\\\']' + escapedGroup + '["\\\']');
        if (valueRegex.test(match[2])) return htmlContent;

        const checkbox = `            <label><input type="checkbox" value="${group}"> ${displayGroup(group)}</label>\n`;
        return htmlContent.replace(panelRegex, match[1] + match[2] + checkbox + match[3]);
    }

    function addGroupToDefaultState(jsContent, group) {
        const pattern = /(const\s+DEFAULT_STATE\s*=\s*\{\s*selectedGroups:\s*\[)([^\]]*)(\])/;
        const match = jsContent.match(pattern);
        if (!match) return jsContent;
        const escapedGroup = group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp("['\"]" + escapedGroup + "['\"]").test(match[2])) return jsContent;
        const separator = match[2].trim() ? ', ' : '';
        return jsContent.replace(pattern, '$1$2' + separator + jsString(group) + '$3');
    }

    function updateLocalFilter(group) {
        try {
            const current = JSON.parse(localStorage.getItem(FILTER_KEY) || 'null');
            const selected = Array.isArray(current?.selectedGroups) ? current.selectedGroups : ['why', 'but', 'where'];
            if (!selected.includes(group)) selected.push(group);
            localStorage.setItem(FILTER_KEY, JSON.stringify({
                selectedGroups: selected,
                orderMode: current?.orderMode === 'shuffle' ? 'shuffle' : 'normal'
            }));
        } catch (_) {}
    }

    async function loadGroups() {
        groupOptions.innerHTML = '';
        const token = tokenInput.value.trim();
        if (!token) return;
        try {
            const file = await getFile(WORDS_PATH, token);
            extractWords(file.content).groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group;
                groupOptions.appendChild(option);
            });
        } catch (_) {}
    }

    tokenInput.addEventListener('blur', loadGroups);

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        setStatus('', '');

        const word = {
            jp: japaneseInput.value.trim(),
            romaji: romajiInput.value.trim(),
            bn: banglaInput.value.trim(),
            group: normalizeGroup(groupInput.value)
        };
        const token = tokenInput.value.trim();
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

        submitButton.disabled = true;
        submitButton.textContent = 'Adding...';

        try {
            setStatus('Reading the current Similar Words files...', '');
            const wordsFile = await getFile(WORDS_PATH, token);
            const pageFile = await getFile(SIMILAR_WORDS_PAGE, token);
            const { groups } = extractWords(wordsFile.content);

            const escapedJapanese = word.jp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const alreadyExists = new RegExp('jp\\s*:\\s*(["\\\'])' + escapedJapanese + '\\1').test(wordsFile.content);
            if (alreadyExists) throw new Error('This Japanese word already exists in the Similar Words file.');

            let updatedWords = appendWord(wordsFile.content, word);
            let updatedPage = pageFile.content;
            const isNewGroup = !groups.includes(word.group);
            if (isNewGroup) {
                updatedWords = addGroupToDefaultState(updatedWords, word.group);
                updatedPage = addFilterCheckbox(updatedPage, word.group);
            }

            // Update the filter page first. If the second commit fails, retrying is safe:
            // the existing filter group will simply be detected and left unchanged.
            if (updatedPage !== pageFile.content) {
                setStatus('Adding the new filter group...', '');
                await updateFile(SIMILAR_WORDS_PAGE, updatedPage, pageFile.sha, 'Add Similar Words filter group: ' + word.group, token);
            }

            setStatus('Adding the new word...', '');
            await updateFile(WORDS_PATH, updatedWords, wordsFile.sha, 'Add Similar Word: ' + word.jp, token);

            updateLocalFilter(word.group);
            setStatus('Added successfully: ' + word.jp + ' (' + word.group + '). Refresh the Similar Words page after GitHub Pages rebuilds.', 'success');
            form.reset();
            await loadGroups();
        } catch (error) {
            setStatus(error?.message || 'Could not add the word.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Add Word';
        }
    });
})();
