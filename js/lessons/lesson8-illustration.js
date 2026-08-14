// Lesson 8 visual-memory illustrations
// Lessons page ONLY. Shown on the BACK of cards.
(function () {
  const map = {
    "ハンサム[な]":"handsome","きれい[な]":"beautiful","しずか[な]":"quiet","にぎやか[な]":"lively","ゆうめい[な]":"famous","しんせつ[な]":"kind","げんき[な]":"energy","ひま[な]":"free","べんり[な]":"convenient","すてき[な]":"wonderful",
    "おおきい":"big","ちいさい":"small","あたらしい":"new","ふるい":"old","いい（よい）":"good","わるい":"bad","あつい":"hot","さむい":"cold","つめたい":"coldTouch","むずかしい":"difficult","やさしい":"easy","たかい":"high","やすい":"cheap","ひくい":"low","おもしろい":"interesting","おいしい":"food","いそがしい":"busy","たのしい":"fun","しろい":"white","くろい":"black","あかい":"red","あおい":"blue",
    "さくら":"sakura","やま":"mountain","まち":"town","たべもの":"food","ところ":"place","りょう":"dorm","レストラン":"restaurant","せいかつ":"life","[お]しごと":"work","どう":"how","どんな～":"kind","とても":"very","あまり":"notmuch","そして":"and","～が、～":"but",
    "おげんきですか。":"hello","そうですね。":"thinking","[～。] もう いっぱい いかがですか。":"drink","[いいえ、] けっこうです。":"no","もう ～です[ね。]":"already","そろそろ しつれいします。":"leave","いいえ。":"no","また いらっしゃって ください。":"comeagain",
    "シャンハイ":"city","きんかくじ":"temple","ならこうえん":"park","ふじさん":"mountain","「しちにんのさむらい」":"movie"
  };

  const common = {
    person: '<circle cx="80" cy="45" r="23" fill="#f2c7a5"/><path d="M52 45c2-25 14-35 28-35s26 10 28 35c-9-9-18-12-28-12S61 36 52 45z" fill="#403632"/><path d="M40 136c3-37 17-54 40-54s37 17 40 54" fill="#7897b8"/>',
    star: '<path d="M80 15l15 38 40 2-31 25 10 40-34-22-34 22 10-40-31-25 40-2z" fill="#e8b957" stroke="#69533b" stroke-width="5" stroke-linejoin="round"/>',
    house: '<path d="M20 65L80 20l60 45" fill="none" stroke="#5b514a" stroke-width="7" stroke-linejoin="round"/><rect x="35" y="60" width="90" height="65" rx="4" fill="#e6d4b3" stroke="#5b514a" stroke-width="5"/><rect x="70" y="88" width="22" height="37" fill="#9ab3c4" stroke="#5b514a" stroke-width="4"/>',
    arrows: '<path d="M25 45h105M105 25l25 20-25 20M135 95H30M55 75L30 95l25 20" fill="none" stroke="#63798a" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>',
    thermometer: '<rect x="70" y="20" width="20" height="82" rx="10" fill="#e9eef0" stroke="#59656e" stroke-width="5"/><circle cx="80" cy="110" r="20" fill="#e88765"/><rect x="75" y="42" width="10" height="68" fill="#e88765"/>',
    book: '<rect x="30" y="22" width="100" height="102" rx="7" fill="#d9e2eb" stroke="#56636d" stroke-width="5"/><path d="M80 25v95M48 48h20M92 48h20M48 67h20M92 67h20" stroke="#71818d" stroke-width="5" stroke-linecap="round"/>',
    food: '<path d="M25 85h110" stroke="#5b514a" stroke-width="6"/><path d="M38 85c5-38 59-47 84 0" fill="#e88765" stroke="#5b514a" stroke-width="5"/><circle cx="63" cy="67" r="7" fill="#f3d27a"/><circle cx="88" cy="57" r="7" fill="#9dbd8e"/><circle cx="105" cy="72" r="7" fill="#d98c79"/>',
    car: '<path d="M25 87l15-35h68l27 35v25H25z" fill="#7897b8" stroke="#4f5962" stroke-width="5"/><path d="M50 52l10-22h30l13 22" fill="#dce8ee" stroke="#4f5962" stroke-width="5"/><circle cx="51" cy="112" r="13" fill="#4f5962"/><circle cx="109" cy="112" r="13" fill="#4f5962"/>',
    flower: '<path d="M80 60v70" stroke="#5c7950" stroke-width="6"/><circle cx="80" cy="48" r="18" fill="#e88765"/><circle cx="58" cy="48" r="18" fill="#e88765"/><circle cx="102" cy="48" r="18" fill="#e88765"/><circle cx="80" cy="26" r="18" fill="#e88765"/><circle cx="80" cy="70" r="18" fill="#e88765"/><circle cx="80" cy="48" r="10" fill="#f0c35c"/>',
    mountain: '<path d="M15 120L62 48l22 31 19-25 42 66z" fill="#9db6a0" stroke="#52675a" stroke-width="5" stroke-linejoin="round"/><path d="M62 48l12 19 10-13" fill="none" stroke="#f4f1e7" stroke-width="8"/>',
    clock: '<circle cx="80" cy="70" r="48" fill="#e8eef0" stroke="#59656e" stroke-width="5"/><path d="M80 70V38M80 70l25 15" stroke="#59656e" stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="70" r="5" fill="#59656e"/>'
  };

  function svg(kind) {
    let body = common.person;
    if (["handsome","beautiful","famous","kind","energy"].includes(kind)) body = common.person + (kind === "famous" ? common.star : '');
    else if (kind === "quiet") body = common.book + '<path d="M48 105h64" stroke="#7897b8" stroke-width="7" stroke-linecap="round"/>';
    else if (kind === "lively") body = common.person + '<path d="M25 30l10-12M135 30l-10-12M80 10V0" stroke="#e8b957" stroke-width="6" stroke-linecap="round"/>';
    else if (kind === "free") body = common.clock;
    else if (kind === "convenient") body = '<circle cx="80" cy="70" r="48" fill="#d9e2eb" stroke="#59656e" stroke-width="5"/><path d="M55 70l15 15 35-40" fill="none" stroke="#5b8b68" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>';
    else if (kind === "wonderful" || kind === "interesting") body = common.star;
    else if (["big","small","high","low"].includes(kind)) body = common.arrows;
    else if (kind === "new") body = '<rect x="35" y="35" width="90" height="75" rx="6" fill="#e8b957" stroke="#5b514a" stroke-width="5"/><path d="M80 20v40M60 40h40" stroke="#d65d55" stroke-width="8" stroke-linecap="round"/>';
    else if (kind === "old") body = '<path d="M30 110h100M45 110V55h70v55M45 55l35-28 35 28" fill="#d8c3a0" stroke="#5b514a" stroke-width="5"/>';
    else if (kind === "good") body = '<circle cx="80" cy="70" r="52" fill="#b9d7ad"/><path d="M48 72l21 22 44-49" fill="none" stroke="#4f7d54" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>';
    else if (kind === "bad") body = '<circle cx="80" cy="70" r="52" fill="#f0c1bb"/><path d="M50 42l60 56M110 42L50 98" fill="none" stroke="#a84d48" stroke-width="12" stroke-linecap="round"/>';
    else if (["hot","cold","coldTouch"].includes(kind)) body = common.thermometer;
    else if (["difficult","easy"].includes(kind)) body = common.book + (kind === "difficult" ? '<path d="M55 82l50-35M55 47l50 35" stroke="#c65c54" stroke-width="7"/>' : '<path d="M52 75l18 18 40-46" fill="none" stroke="#5b8b68" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>');
    else if (["cheap","low"].includes(kind)) body = '<path d="M35 35h90M45 55h70M55 75h50M65 95h30" stroke="#5b8b68" stroke-width="10" stroke-linecap="round"/><circle cx="80" cy="120" r="10" fill="#e8b957"/>';
    else if (kind === "food") body = common.food;
    else if (kind === "busy") body = common.clock + '<path d="M35 30l90 80M125 30l-90 80" stroke="#d65d55" stroke-width="7" stroke-linecap="round"/>';
    else if (kind === "fun") body = common.person + '<path d="M65 58c10 10 20 10 30 0" fill="none" stroke="#d76555" stroke-width="5" stroke-linecap="round"/>';
    else if (["white","black","red","blue"].includes(kind)) body = '<circle cx="80" cy="70" r="45" fill="' + ({white:'#f5f5f5',black:'#333333',red:'#d65d55',blue:'#6f9fbd'}[kind]) + '" stroke="#59656e" stroke-width="6"/>';
    else if (kind === "sakura") body = common.flower;
    else if (kind === "mountain") body = common.mountain;
    else if (kind === "town") body = '<path d="M20 120V65h30v55M65 120V35h30v85M110 120V55h30v65" fill="#d9e2eb" stroke="#59656e" stroke-width="5"/><path d="M15 120h130" stroke="#59656e" stroke-width="7"/>';
    else if (kind === "car") body = common.car;
    else if (kind === "place") body = common.house;
    else if (kind === "dorm") body = common.house + '<path d="M50 75h60" stroke="#7897b8" stroke-width="8"/>';
    else if (kind === "restaurant") body = '<rect x="25" y="35" width="110" height="85" rx="6" fill="#e8d1aa" stroke="#5b514a" stroke-width="5"/><path d="M45 75h70M80 45v60" stroke="#d76555" stroke-width="7"/>';
    else if (kind === "life") body = common.person + '<path d="M40 115c25-20 55-20 80 0" fill="none" stroke="#5b8b68" stroke-width="7"/>';
    else if (kind === "work") body = '<rect x="35" y="50" width="90" height="65" rx="5" fill="#d9e2eb" stroke="#59656e" stroke-width="5"/><path d="M60 50v-18h40v18M50 75h60" stroke="#59656e" stroke-width="6" fill="none"/>';
    else if (kind === "hello" || kind === "comeagain") body = common.person + '<path d="M105 55l25-20M105 70l30 0" stroke="#e8b957" stroke-width="6" stroke-linecap="round"/>';
    else if (kind === "thinking") body = common.person + '<circle cx="125" cy="30" r="18" fill="#e8eef0" stroke="#59656e" stroke-width="4"/><text x="125" y="36" text-anchor="middle" font-size="22" fill="#59656e">?</text>';
    else if (kind === "drink") body = '<path d="M50 45h60l-8 75H58z" fill="#d9e2eb" stroke="#59656e" stroke-width="5"/><path d="M60 60h40" stroke="#e88765" stroke-width="8"/>';
    else if (kind === "already") body = common.clock + '<path d="M30 120h100" stroke="#d76555" stroke-width="7"/>';
    else if (kind === "leave") body = '<path d="M30 110h100" stroke="#59656e" stroke-width="7"/><path d="M55 110V45h50v65" fill="#e8d1aa" stroke="#59656e" stroke-width="5"/><path d="M80 45V25" stroke="#59656e" stroke-width="6"/><path d="M112 45l22 22-22 22" fill="none" stroke="#d76555" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
    else if (kind === "city") body = '<path d="M20 120V65h30v55M65 120V30h30v90M110 120V50h30v70" fill="#9db6c4" stroke="#59656e" stroke-width="5"/><path d="M15 120h130" stroke="#59656e" stroke-width="7"/>';
    else if (kind === "temple") body = '<path d="M20 45L80 15l60 30" fill="#d8a34f" stroke="#5b514a" stroke-width="5"/><path d="M35 50v65M65 50v65M95 50v65M125 50v65M20 120h120" stroke="#5b514a" stroke-width="7"/>';
    else if (kind === "park") body = '<path d="M20 120c20-60 100-60 120 0" fill="#9dbd8e"/><circle cx="50" cy="65" r="22" fill="#7fa06f"/><circle cx="110" cy="55" r="25" fill="#7fa06f"/><path d="M50 75v45M110 75v45" stroke="#705c46" stroke-width="8"/>';
    else if (kind === "movie") body = '<rect x="30" y="30" width="100" height="80" rx="5" fill="#59656e"/><path d="M50 50l60 20-60 20z" fill="#f0c35c"/><circle cx="80" cy="120" r="7" fill="#d65d55"/>';
    else if (kind === "how") body = common.person + '<circle cx="125" cy="40" r="22" fill="#e8eef0" stroke="#59656e" stroke-width="4"/><text x="125" y="48" text-anchor="middle" font-size="28" fill="#59656e">?</text>';
    else if (kind === "kind") body = common.person + '<path d="M80 110c-30-20-35-45-15-45 9 0 15 8 15 8s6-8 15-8c20 0 15 25-15 45z" fill="#e88765"/>';
    else if (kind === "very") body = common.star + '<path d="M80 105v25" stroke="#59656e" stroke-width="7"/>';
    else if (kind === "notmuch") body = common.star + '<path d="M35 115h90" stroke="#a84d48" stroke-width="8"/>';
    else if (kind === "and") body = '<path d="M45 45h70M45 70h70M45 95h70" stroke="#59656e" stroke-width="7" stroke-linecap="round"/>';
    else if (kind === "but") body = '<path d="M25 70h75" stroke="#59656e" stroke-width="8"/><path d="M90 45l35 25-35 25" fill="none" stroke="#d76555" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>';
    const el = `<svg viewBox="0 0 160 140" aria-hidden="true">${body}</svg>`;
    return el;
  }

  function add() {
    document.querySelectorAll('#grid .card').forEach(card => {
      if (card.dataset.lesson8Illustration === 'done') return;
      const front = card.querySelector('.front');
      const back = card.querySelector('.back.vocabulary-back, .back');
      if (!front || !back) return;
      const text = String(front.textContent || '').replace(/\s+/g, ' ').trim();
      const key = Object.keys(map).find(k => text.includes(k));
      if (!key) return;
      const visual = document.createElement('div');
      visual.className = 'lesson-illustration';
      visual.innerHTML = svg(map[key]);
      visual.setAttribute('aria-hidden', 'true');
      const last = back.lastElementChild;
      last ? back.insertBefore(visual, last) : back.appendChild(visual);
      card.dataset.lesson8Illustration = 'done';
    });
  }
  const start = () => { add(); const grid = document.getElementById('grid'); if (grid) new MutationObserver(add).observe(grid, {childList:true}); };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
