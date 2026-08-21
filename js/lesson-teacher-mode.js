// =====================================================
// Lessons — Teacher Mode
// Japanese → 5 second pause → Bangla → next card.
// Pause resumes exactly where it stopped. Stop resets to card 1.
// =====================================================
(function () {
    const WAIT_MS = 5000;
    let state = 'stopped'; // stopped | japanese | waiting | bangla | paused
    let cards = [];
    let index = 0;
    let pausedPhase = null;
    let waitTimer = null;
    let waitStartedAt = 0;
    let waitRemaining = WAIT_MS;
    let pausedSpeech = false;

    const ICONS = {
        play: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"></path></svg>',
        pause: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14M17 5v14"></path></svg>',
        stop: '<svg class="lesson-control-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1"></rect></svg>'
    };

    function labelIcon(label, icon) {
        return '<span class="lesson-control-text">' + label + '</span>' + icon;
    }

    function japaneseText(card) {
        const source = card.querySelector('.front, .back') || card;
        const clone = source.cloneNode(true);
        clone.querySelectorAll('.lesson-card-topbar,.speaker-btn,.speak-btn,.pronunciation-btn,.romaji,.hard-star,.lesson-card-number,img,svg,button').forEach(el => el.remove());
        const text = clone.textContent.replace(/\s+/g, ' ').trim();
        // Keep Japanese scripts/kanji and normal Japanese punctuation, while
        // dropping English/Romaji and UI text.
        return text.replace(/[^\u3040-\u30ff\u3400-\u9fff\uff66-\uff9f\u3000-\u303f\u31f0-\u31ff\sー々〆〇・「」『』【】［］（）！？。、「」]/g, '')
            .replace(/\s+/g, ' ').trim();
    }

    function banglaText(card) {
        const back = card.querySelector('.back') || card;
        const clone = back.cloneNode(true);
        clone.querySelectorAll('.lesson-card-topbar,.speaker-btn,.speak-btn,.pronunciation-btn,.romaji,.hard-star,.lesson-card-number,img,svg,button').forEach(el => el.remove());
        const text = clone.textContent.replace(/\s+/g, ' ').trim();
        // Extract Bengali script so English/Romaji on the back is not spoken.
        const matches = text.match(/[\u0980-\u09ff\u200c\u200d\s।,!?;:()\-–—/]+/g) || [];
        return matches.join(' ').replace(/\s+/g, ' ').trim();
    }

    function getCurrentCards() {
        return Array.from(document.querySelectorAll('#grid > .card')).filter(card => {
            const style = window.getComputedStyle(card);
            return style.display !== 'none' && card.offsetParent !== null;
        });
    }

    function setActiveCard(card) {
        document.querySelectorAll('#grid > .card.teacher-active').forEach(el => el.classList.remove('teacher-active'));
        if (!card) return;
        card.classList.add('teacher-active');
        const rect = card.getBoundingClientRect();
        if (rect.top < 50 || rect.bottom > window.innerHeight - 50) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function getVoice(lang) {
        const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
        const exact = voices.find(v => v.lang && v.lang.toLowerCase() === lang.toLowerCase());
        if (exact) return exact;
        const prefix = lang.slice(0, 2).toLowerCase();
        return voices.find(v => v.lang && v.lang.toLowerCase().startsWith(prefix)) || null;
    }

    function speak(text, lang, done) {
        if (!text || !window.speechSynthesis) { done(); return; }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = lang.toLowerCase().startsWith('ja') ? 0.9 : 0.95;
        utterance.pitch = 1;
        const voice = getVoice(lang);
        if (voice) utterance.voice = voice;
        utterance.onend = function () { if (state !== 'paused' && state !== 'stopped') done(); };
        utterance.onerror = function () { if (state !== 'paused' && state !== 'stopped') done(); };
        speechSynthesis.speak(utterance);
    }

    function scheduleBangla(delay) {
        clearTimeout(waitTimer);
        state = 'waiting';
        waitRemaining = delay;
        waitStartedAt = Date.now();
        waitTimer = setTimeout(() => {
            waitTimer = null;
            waitRemaining = 0;
            speakBangla();
        }, delay);
        updateUI();
    }

    function speakJapanese() {
        if (state === 'stopped') return;
        const card = cards[index];
        if (!card) return finish();
        setActiveCard(card);
        state = 'japanese';
        updateUI();
        const text = japaneseText(card);
        speak(text, 'ja-JP', () => scheduleBangla(WAIT_MS));
    }

    function speakBangla() {
        if (state === 'stopped' || state === 'paused') return;
        const card = cards[index];
        if (!card) return finish();
        state = 'bangla';
        updateUI();
        const text = banglaText(card);
        speak(text, 'bn-BD', () => {
            if (state === 'stopped' || state === 'paused') return;
            index += 1;
            if (index >= cards.length) finish();
            else speakJapanese();
        });
    }

    function start() {
        speechSynthesis.cancel();
        clearTimeout(waitTimer);
        cards = getCurrentCards();
        if (!cards.length) return;
        index = 0;
        pausedPhase = null;
        waitRemaining = WAIT_MS;
        state = 'japanese';
        speakJapanese();
    }

    function pause() {
        if (state === 'stopped' || state === 'paused') return;
        pausedPhase = state;
        if (state === 'waiting') {
            waitRemaining = Math.max(0, waitRemaining - (Date.now() - waitStartedAt));
            clearTimeout(waitTimer);
            waitTimer = null;
        } else if (window.speechSynthesis && speechSynthesis.speaking) {
            speechSynthesis.pause();
            pausedSpeech = true;
        }
        state = 'paused';
        updateUI();
    }

    function resume() {
        if (state !== 'paused') return;
        state = pausedPhase || 'japanese';
        if (pausedSpeech && window.speechSynthesis && speechSynthesis.paused) {
            pausedSpeech = false;
            speechSynthesis.resume();
        } else if (state === 'waiting') {
            scheduleBangla(waitRemaining || WAIT_MS);
            return;
        } else if (state === 'japanese') {
            speakJapanese();
            return;
        } else if (state === 'bangla') {
            speakBangla();
            return;
        }
        updateUI();
    }

    function stop() {
        speechSynthesis.cancel();
        clearTimeout(waitTimer);
        waitTimer = null;
        state = 'stopped';
        pausedPhase = null;
        pausedSpeech = false;
        index = 0;
        waitRemaining = WAIT_MS;
        document.querySelectorAll('#grid > .card.teacher-active').forEach(el => el.classList.remove('teacher-active'));
        updateUI();
    }

    function finish() {
        speechSynthesis.cancel();
        clearTimeout(waitTimer);
        waitTimer = null;
        state = 'stopped';
        pausedPhase = null;
        index = 0;
        waitRemaining = WAIT_MS;
        document.querySelectorAll('#grid > .card.teacher-active').forEach(el => el.classList.remove('teacher-active'));
        updateUI(true);
    }

    function updateButton(button, type) {
        if (!button) return;
        if (state === 'stopped') {
            button.innerHTML = labelIcon('Teacher', ICONS.play);
            button.setAttribute('aria-label', 'Start Teacher Mode from first card');
            button.title = 'Start Teacher Mode';
        } else if (state === 'paused') {
            button.innerHTML = labelIcon('Play', ICONS.play);
            button.setAttribute('aria-label', 'Resume Teacher Mode');
            button.title = 'Resume Teacher Mode';
        } else {
            button.innerHTML = labelIcon('Pause', ICONS.pause);
            button.setAttribute('aria-label', 'Pause Teacher Mode');
            button.title = 'Pause Teacher Mode';
        }
    }

    function updateUI() {
        document.querySelectorAll('.teacher-mode-btn').forEach(btn => updateButton(btn));
        document.querySelectorAll('.teacher-stop-btn').forEach(btn => {
            btn.innerHTML = labelIcon('Stop', ICONS.stop);
            btn.setAttribute('aria-label', 'Stop Teacher Mode');
            btn.title = 'Stop Teacher Mode';
            btn.disabled = state === 'stopped';
        });
    }

    function createButton(cls) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = cls;
        return button;
    }

    function addToolbarControls() {
        const toolbar = document.querySelector('.toolbar');
        if (!toolbar || document.querySelector('.teacher-mode-field')) return;
        const field = document.createElement('div');
        field.className = 'field teacher-mode-field';
        const start = createButton('teacher-mode-btn');
        const stopBtn = createButton('teacher-stop-btn');
        field.append(start, stopBtn);
        toolbar.appendChild(field);
        start.addEventListener('click', () => state === 'stopped' ? startMode() : (state === 'paused' ? resume() : pause()));
        stopBtn.addEventListener('click', stop);
    }

    function addMobileControls() {
        const bar = document.querySelector('.mobile-bottom-controls');
        if (!bar || bar.querySelector('.teacher-mode-btn')) return;
        const start = createButton('teacher-mode-btn');
        const stopBtn = createButton('teacher-stop-btn');
        bar.append(start, stopBtn);
        start.addEventListener('click', () => state === 'stopped' ? startMode() : (state === 'paused' ? resume() : pause()));
        stopBtn.addEventListener('click', stop);
    }

    function startMode() {
        start();
        addMobileControls();
        updateUI();
    }

    function init() {
        if (!document.getElementById('grid')) return;
        addToolbarControls();
        addMobileControls();
        updateUI();
        if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
