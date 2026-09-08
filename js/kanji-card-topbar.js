// Kanji card topbar: Lesson-style controls plus an in-card stroke-order section.
(function () {
    const style = document.createElement('style');
    style.textContent = `
        .kanji-card > .lesson-card-topbar {
            display:grid !important;
            grid-template-columns:repeat(5, minmax(0, 1fr)) !important;
            align-items:center !important;
            justify-items:center !important;
            gap:0 !important;
            width:100% !important;
            min-height:34px !important;
            white-space:nowrap !important;
        }
        .kanji-card > .lesson-card-topbar > * {
            min-width:0 !important;
            white-space:nowrap !important;
            margin:0 !important;
            position:static !important;
            transform:none !important;
        }
        .kanji-card > .lesson-card-topbar .hard-star,
        .kanji-card > .lesson-card-topbar .lesson-card-number,
        .kanji-card > .lesson-card-topbar .kanji-stroke-btn,
        .kanji-card > .lesson-card-topbar .lesson-tag,
        .kanji-card > .lesson-card-topbar .speaker-btn {
            grid-column:auto !important;
            justify-self:center !important;
        }
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
        .kanji-card > .kanji-stroke-section {
            display:none !important;
            width:100% !important;
            box-sizing:border-box !important;
            padding:12px !important;
            background:var(--paper-cell,#fff) !important;
            color:var(--ink,#111) !important;
            border-top:1px solid var(--paper-line,#ddd) !important;
            border-bottom:1px solid var(--paper-line,#ddd) !important;
            text-align:center !important;
        }
        .kanji-card > .kanji-stroke-section.open {
            display:block !important;
        }
        .kanji-stroke-section-title {
            margin:0 0 6px !important;
            font-size:15px !important;
            font-weight:700 !important;
        }
        .kanji-stroke-stage {
            width:min(55vw,220px) !important;
            height:min(55vw,220px) !important;
            max-width:220px !important;
            max-height:220px !important;
            margin:0 auto 8px !important;
            display:flex !important;
            align-items:center !important;
            justify-content:center !important;
            overflow:hidden !important;
            background:rgba(128,128,128,.06) !important;
            border-radius:10px !important;
        }
        .kanji-stroke-stage svg {
            width:100% !important;
            height:100% !important;
            display:block !important;
        }
        .kanji-stroke-status {
            min-height:20px !important;
            font-size:11px !important;
            opacity:.7 !important;
        }
        .kanji-stroke-replay {
            margin-top:4px !important;
            padding:4px 10px !important;
            border:1px solid var(--paper-line,#ccc) !important;
            border-radius:6px !important;
            background:transparent !important;
            color:inherit !important;
            cursor:pointer !important;
            font-size:11px !important;
        }
        .kanji-stroke-error {
            min-height:60px !important;
            display:flex !important;
            align-items:center !important;
            justify-content:center !important;
            font-size:12px !important;
        }
        @media (max-width:520px){
            .kanji-card > .lesson-card-topbar { grid-template-columns:repeat(5, minmax(0, 1fr)) !important; }
            .kanji-card > .lesson-card-topbar button { width:28px !important; height:28px !important; min-width:28px !important; }
            .kanji-card > .kanji-stroke-section { padding:10px !important; }
            .kanji-stroke-stage { width:58vw !important; height:58vw !important; max-width:200px !important; max-height:200px !important; }
        }
    `;
    document.head.appendChild(style);

    function kanjiCodePoint(text) {
        const code = text.codePointAt(0);
        return code ? code.toString(16).padStart(5, '0') : '';
    }

    function prepareSvg(svg) {
        if (!svg) return [];
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.setAttribute('aria-label', 'Kanji stroke order');
        const paths = Array.from(svg.querySelectorAll('path')).filter(function (path) {
            return /-s\d+/.test(path.id || '');
        }).sort(function (a, b) {
            const getNo = function (el) {
                const match = (el.id || '').match(/-s(\d+)/);
                return match ? Number(match[1]) : 9999;
            };
            return getNo(a) - getNo(b);
        });

        paths.forEach(function (path) {
            path.style.fill = 'none';
            path.style.stroke = 'currentColor';
            path.style.strokeWidth = '3.5';
            path.style.strokeLinecap = 'round';
            path.style.strokeLinejoin = 'round';
            path.style.opacity = '0.18';
        });
        return paths;
    }

    function playStrokes(svg, status) {
        const paths = prepareSvg(svg);
        if (!paths.length) {
            if (status) status.textContent = 'Stroke order data unavailable.';
            return;
        }

        paths.forEach(function (path, index) {
            try {
                const length = path.getTotalLength();
                path.style.stroke = 'currentColor';
                path.style.strokeWidth = '3.5';
                path.style.strokeDasharray = String(length);
                path.style.strokeDashoffset = String(length);
                path.style.opacity = '0.18';
                path.style.transition = 'stroke-dashoffset .5s ease, opacity .1s ease';
                path.style.transitionDelay = (index * .62) + 's';
                requestAnimationFrame(function () {
                    path.style.opacity = '1';
                    path.style.strokeDashoffset = '0';
                });
            } catch (error) {
                path.style.strokeDashoffset = '0';
                path.style.opacity = '1';
            }
        });

        if (status) {
            status.textContent = paths.length + ' strokes — watch how to write it.';
        }
    }

    async function loadStrokeOrder(section, card) {
        const stage = section.querySelector('.kanji-stroke-stage');
        const status = section.querySelector('.kanji-stroke-status');
        const kanji = card.dataset.kanji || '';
        const code = kanjiCodePoint(kanji);

        if (!code) {
            stage.innerHTML = '<div class="kanji-stroke-error">Stroke order unavailable.</div>';
            return;
        }

        stage.innerHTML = '<div class="kanji-stroke-error">Loading…</div>';
        status.textContent = 'Loading stroke order…';

        try {
            const response = await fetch('https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/' + code + '.svg', { cache: 'force-cache' });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const svgText = await response.text();
            const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml');
            const svg = parsed.documentElement;
            if (!svg || svg.nodeName.toLowerCase() !== 'svg') throw new Error('Invalid SVG');
            stage.innerHTML = '';
            stage.appendChild(document.importNode(svg, true));
            const currentSvg = stage.querySelector('svg');
            playStrokes(currentSvg, status);
        } catch (error) {
            stage.innerHTML = '<div class="kanji-stroke-error">Stroke order could not be loaded.</div>';
            status.textContent = 'Please try again.';
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

        const section = document.createElement('div');
        section.className = 'kanji-stroke-section';
        section.setAttribute('aria-hidden', 'true');
        section.innerHTML = `
            <div class="kanji-stroke-section-title">How to write ${card.dataset.kanji || ''}</div>
            <div class="kanji-stroke-stage"><div class="kanji-stroke-error">Stroke order will appear here.</div></div>
            <div class="kanji-stroke-status"></div>
        `;

        stroke.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const open = section.classList.toggle('open');
            section.setAttribute('aria-hidden', String(!open));
            stroke.setAttribute('aria-pressed', String(open));
            if (open && !section.dataset.loaded) {
                section.dataset.loaded = 'true';
                loadStrokeOrder(section, card);
            }
        });

        section.addEventListener('click', function (event) {
            event.stopPropagation();
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
        card.insertBefore(section, inner);
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
