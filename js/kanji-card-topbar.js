// Kanji card topbar: Lesson-style controls plus stroke-order viewer.
(function () {
    const style = document.createElement('style');
    style.textContent = `
        .kanji-card > .lesson-card-topbar {
            display:flex !important;
            flex-direction:row !important;
            flex-wrap:nowrap !important;
            align-items:center !important;
            justify-content:space-between !important;
            gap:8px !important;
            width:100% !important;
            min-height:34px !important;
            white-space:nowrap !important;
        }
        .kanji-card > .lesson-card-topbar > * { flex:0 0 auto !important; white-space:nowrap !important; }
        .kanji-card > .lesson-card-topbar .lesson-card-number { margin-right:auto !important; }
        .kanji-card > .lesson-card-topbar button {
            width:30px !important;
            height:30px !important;
            min-width:30px !important;
            padding:0 !important;
            display:inline-flex !important;
            align-items:center !important;
            justify-content:center !important;
        }
        .kanji-card > .lesson-card-topbar .kanji-stroke-btn {
            font-size:17px !important;
            line-height:1 !important;
            cursor:pointer !important;
            color:#fff !important;
            background:transparent !important;
            border:0 !important;
        }
        .kanji-stroke-modal {
            position:fixed !important;
            inset:0 !important;
            z-index:99999 !important;
            display:flex !important;
            align-items:center !important;
            justify-content:center !important;
            padding:20px !important;
            background:rgba(0,0,0,.72) !important;
            box-sizing:border-box !important;
        }
        .kanji-stroke-panel {
            position:relative !important;
            width:min(92vw,430px) !important;
            max-height:90vh !important;
            overflow:auto !important;
            background:var(--paper-cell,#fff) !important;
            color:var(--ink,#111) !important;
            border-radius:14px !important;
            padding:18px !important;
            box-sizing:border-box !important;
            text-align:center !important;
            box-shadow:0 15px 45px rgba(0,0,0,.35) !important;
        }
        .kanji-stroke-close {
            position:absolute !important;
            top:8px !important;
            right:10px !important;
            width:32px !important;
            height:32px !important;
            border:0 !important;
            background:transparent !important;
            color:inherit !important;
            font-size:25px !important;
            cursor:pointer !important;
        }
        .kanji-stroke-title {
            margin:0 34px 4px !important;
            font-size:18px !important;
            font-weight:700 !important;
        }
        .kanji-stroke-subtitle {
            margin:0 0 10px !important;
            font-size:12px !important;
            opacity:.7 !important;
        }
        .kanji-stroke-stage {
            width:min(72vw,300px) !important;
            height:min(72vw,300px) !important;
            max-width:300px !important;
            max-height:300px !important;
            margin:8px auto 12px !important;
            display:flex !important;
            align-items:center !important;
            justify-content:center !important;
            background:rgba(128,128,128,.07) !important;
            border-radius:10px !important;
            overflow:hidden !important;
        }
        .kanji-stroke-stage svg {
            width:100% !important;
            height:100% !important;
            display:block !important;
        }
        .kanji-stroke-note {
            margin:0 !important;
            font-size:12px !important;
            opacity:.7 !important;
        }
        .kanji-stroke-error {
            min-height:80px !important;
            display:flex !important;
            align-items:center !important;
            justify-content:center !important;
            font-size:13px !important;
        }
        @media (max-width:520px){
            .kanji-card > .lesson-card-topbar { gap:5px !important; }
            .kanji-card > .lesson-card-topbar button { width:28px !important; height:28px !important; min-width:28px !important; }
            .kanji-stroke-panel { padding:14px !important; }
        }
    `;
    document.head.appendChild(style);

    let activeModal = null;

    function kanjiCodePoint(text) {
        const code = text.codePointAt(0);
        return code ? code.toString(16).padStart(5, '0') : '';
    }

    function closeModal() {
        if (activeModal) {
            activeModal.remove();
            activeModal = null;
        }
        document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(event) {
        if (event.key === 'Escape') closeModal();
    }

    function animateStrokeOrder(svg) {
        const paths = Array.from(svg.querySelectorAll('path')).filter(function (path) {
            return /-s\d+/.test(path.id || '');
        }).sort(function (a, b) {
            const getNo = function (el) {
                const m = (el.id || '').match(/-s(\d+)/);
                return m ? Number(m[1]) : 9999;
            };
            return getNo(a) - getNo(b);
        });

        if (!paths.length) return;

        // Show the finished Kanji faintly as a guide, then draw each stroke in order.
        paths.forEach(function (path) {
            path.style.fill = 'none';
            path.style.stroke = '#b8b8b8';
            path.style.strokeWidth = '3';
            path.style.strokeLinecap = 'round';
            path.style.strokeLinejoin = 'round';
            path.style.opacity = '0.28';
        });

        paths.forEach(function (path, index) {
            try {
                const length = path.getTotalLength();
                path.style.stroke = 'currentColor';
                path.style.strokeWidth = '3.5';
                path.style.strokeDasharray = String(length);
                path.style.strokeDashoffset = String(length);
                path.style.opacity = '1';
                path.getBoundingClientRect();
                path.style.transition = 'stroke-dashoffset .55s ease';
                path.style.transitionDelay = (index * .62) + 's';
                requestAnimationFrame(function () {
                    path.style.strokeDashoffset = '0';
                });
            } catch (error) {
                path.style.strokeDashoffset = '0';
            }
        });
    }

    async function showStrokeOrder(card) {
        closeModal();

        const kanji = card.dataset.kanji || '';
        const modal = document.createElement('div');
        modal.className = 'kanji-stroke-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="kanji-stroke-panel">
                <button type="button" class="kanji-stroke-close" aria-label="Close stroke order">×</button>
                <h3 class="kanji-stroke-title">${kanji} — Stroke Order</h3>
                <p class="kanji-stroke-subtitle">Watch how to write this Kanji, one stroke at a time.</p>
                <div class="kanji-stroke-stage"><div class="kanji-stroke-error">Loading…</div></div>
                <p class="kanji-stroke-note">The strokes are drawn in writing order automatically.</p>
            </div>`;
        document.body.appendChild(modal);
        activeModal = modal;
        document.addEventListener('keydown', onKeyDown);

        modal.querySelector('.kanji-stroke-close').addEventListener('click', closeModal);
        modal.addEventListener('click', function (event) {
            if (event.target === modal) closeModal();
        });

        const code = kanjiCodePoint(kanji);
        const stage = modal.querySelector('.kanji-stroke-stage');
        if (!code) {
            stage.innerHTML = '<div class="kanji-stroke-error">Stroke order unavailable.</div>';
            return;
        }

        try {
            const response = await fetch('https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/' + code + '.svg', { cache: 'force-cache' });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const svgText = await response.text();
            const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml');
            const svg = parsed.documentElement;
            if (!svg || svg.nodeName.toLowerCase() !== 'svg') throw new Error('Invalid SVG');
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            svg.setAttribute('aria-label', kanji + ' stroke order');
            stage.innerHTML = '';
            stage.appendChild(document.importNode(svg, true));
            requestAnimationFrame(function () {
                animateStrokeOrder(stage.querySelector('svg'));
            });
        } catch (error) {
            stage.innerHTML = '<div class="kanji-stroke-error">Stroke order could not be loaded.</div>';
        }
    }

    function setupCard(card) {
        if (!card || card.dataset.kanjiTopbarReady === 'true') return;
        const inner = card.querySelector(':scope > .inner');
        if (!inner) return;

        const topbar = document.createElement('div');
        topbar.className = 'lesson-card-topbar';
        topbar.setAttribute('aria-label', 'Card controls');

        const number = document.createElement('span');
        number.className = 'lesson-card-number';
        number.textContent = card.dataset.no || '';

        const tag = document.createElement('span');
        tag.className = 'lesson-tag';
        tag.textContent = card.dataset.level || '';

        const stroke = document.createElement('button');
        stroke.type = 'button';
        stroke.className = 'kanji-stroke-btn';
        stroke.textContent = '✍';
        stroke.setAttribute('aria-label', 'Show stroke order');
        stroke.setAttribute('title', 'Show stroke order');
        stroke.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            showStrokeOrder(card);
        });

        const star = document.createElement('button');
        star.type = 'button';
        star.className = 'hard-star';
        star.textContent = '☆';
        star.setAttribute('aria-label', 'Mark as hard Kanji');
        star.setAttribute('title', 'Mark as hard Kanji');
        star.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const active = star.classList.toggle('active');
            star.textContent = active ? '★' : '☆';
            star.setAttribute('aria-pressed', String(active));
        });

        const speaker = document.createElement('button');
        speaker.type = 'button';
        speaker.className = 'speaker-btn';
        speaker.textContent = '🔊';
        speaker.setAttribute('aria-label', 'Play pronunciation');
        speaker.setAttribute('title', 'Play pronunciation');
        speaker.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const text = card.dataset.kanji || '';
            if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'ja-JP';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        });

        topbar.append(star, number, stroke, tag, speaker);
        card.insertBefore(topbar, inner);
        card.dataset.kanjiTopbarReady = 'true';
    }

    function init() {
        const grid = document.getElementById('kanjiGrid');
        if (!grid) return;
        grid.querySelectorAll(':scope > .card').forEach(setupCard);
        new MutationObserver(function () {
            grid.querySelectorAll(':scope > .card').forEach(setupCard);
        }).observe(grid, { childList: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
