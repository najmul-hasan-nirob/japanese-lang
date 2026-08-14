// Lesson 9 visual-memory illustrations
// Lessons page ONLY. Shown on the BACK of cards.
(function () {
  const map = {
    "わかります":"understand","あります":"have","すき[な]":"like","きらい[な]":"dislike","じょうず[な]":"goodat","へた[な]":"poorat","のみもの":"drink","りょうり":"food","スポーツ":"sport","やきゅう":"baseball","ダンス":"dance","りょこう":"travel","おんがく":"music","うた":"song","クラシック":"classical","コンサート":"concert","ジャズ":"jazz","カラオケ":"karaoke","かぶき":"kabuki","え":"picture","じ":"letter","かんじ":"kanji","ひらがな":"hiragana","かたかな":"katakana","ローマじ":"romaji","じかん":"time","ようじ":"errand","やくそく":"promise","こまかい[お]かね":"change","チケット":"ticket","アルバイト":"parttime","ごしゅじん":"husband","しゅじん":"husband","おくさん":"wife","つま（かない）":"wife","こども":"child","よく":"well","だいたい":"roughly","たくさん":"many","すこし":"little","ぜんぜん":"notatall","はやく":"quickly","いっしょに いかがですか。":"invitation","ぜひ。":"certainly","[～は] ちょっと。":"decline","また こんど おねがいします。":"nexttime"
  };

  const icon = {
    person:'<circle cx="80" cy="48" r="24" fill="#f2c7a5"/><path d="M52 48c2-25 14-35 28-35s26 10 28 35c-9-9-18-12-28-12S61 39 52 48z" fill="#403632"/><path d="M40 138c3-37 17-54 40-54s37 17 40 54" fill="#7897b8"/>',
    book:'<rect x="28" y="22" width="104" height="108" rx="7" fill="#d9e2eb" stroke="#56636d" stroke-width="5"/><path d="M80 25v100M48 50h20M92 50h20M48 72h20M92 72h20" stroke="#71818d" stroke-width="5" stroke-linecap="round"/>',
    food:'<path d="M25 88h110" stroke="#5b514a" stroke-width="6"/><path d="M38 88c5-40 59-48 84 0" fill="#e88765" stroke="#5b514a" stroke-width="5"/><circle cx="63" cy="70" r="7" fill="#f3d27a"/><circle cx="88" cy="59" r="7" fill="#9dbd8e"/><circle cx="105" cy="74" r="7" fill="#d98c79"/>',
    music:'<path d="M70 35v70" stroke="#59656e" stroke-width="8"/><path d="M70 35l45-12v55" stroke="#59656e" stroke-width="8" fill="none"/><circle cx="55" cy="110" r="18" fill="#e88765"/><circle cx="100" cy="90" r="18" fill="#e88765"/>',
    clock:'<circle cx="80" cy="70" r="48" fill="#e8eef0" stroke="#59656e" stroke-width="5"/><path d="M80 70V38M80 70l25 15" stroke="#59656e" stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="70" r="5" fill="#59656e"/>',
    ticket:'<path d="M28 42h104v56c-12 0-12 18 0 18H28c12 0 12-18 0-18z" fill="#e8d1aa" stroke="#59656e" stroke-width="5"/><path d="M65 45v68M80 45v68M95 45v68" stroke="#c9ad7a" stroke-width="4" stroke-dasharray="6 7"/>',
    phone:'<rect x="48" y="15" width="64" height="110" rx="12" fill="#59656e"/><rect x="56" y="28" width="48" height="76" rx="4" fill="#dce8ee"/><circle cx="80" cy="115" r="5" fill="#dce8ee"/>',
    arrows:'<path d="M25 45h105M105 25l25 20-25 20M135 95H30M55 75L30 95l25 20" fill="none" stroke="#63798a" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>',
    star:'<path d="M80 15l15 38 40 2-31 25 10 40-34-22-34 22 10-40-31-25 40-2z" fill="#e8b957" stroke="#69533b" stroke-width="5" stroke-linejoin="round"/>'
  };

  function body(kind) {
    if (["understand","have","like","dislike","goodat","poorat","husband","wife","child","invitation","decline","nexttime"].includes(kind)) return icon.person;
    if (kind === "drink") return '<path d="M50 45h60l-8 75H58z" fill="#d9e2eb" stroke="#59656e" stroke-width="5"/><path d="M60 62h40" stroke="#e88765" stroke-width="8"/>';
    if (kind === "food") return icon.food;
    if (["sport","baseball","dance","travel"].includes(kind)) return icon.person + '<path d="M25 30l12-12M135 30l-12-12M80 10V0" stroke="#e8b957" stroke-width="6" stroke-linecap="round"/>';
    if (["music","song","classical","concert","jazz","karaoke"].includes(kind)) return icon.music;
    if (kind === "kabuki") return icon.person + '<path d="M50 55h60M55 70h50" stroke="#d65d55" stroke-width="8"/>';
    if (["picture","letter","kanji","hiragana","katakana","romaji"].includes(kind)) return icon.book + '<text x="80" y="105" text-anchor="middle" font-size="34" font-weight="bold" fill="#59656e">あ</text>';
    if (kind === "time") return icon.clock;
    if (kind === "errand" || kind === "promise") return icon.ticket;
    if (kind === "change") return '<circle cx="60" cy="75" r="27" fill="#e8b957" stroke="#59656e" stroke-width="5"/><circle cx="105" cy="75" r="27" fill="#9dbd8e" stroke="#59656e" stroke-width="5"/><path d="M35 35h90" stroke="#59656e" stroke-width="6"/>';
    if (kind === "ticket") return icon.ticket;
    if (kind === "parttime") return '<rect x="35" y="48" width="90" height="68" rx="6" fill="#d9e2eb" stroke="#59656e" stroke-width="5"/><path d="M60 48V30h40v18M48 75h64" stroke="#59656e" stroke-width="6" fill="none"/>';
    if (kind === "well") return '<circle cx="80" cy="70" r="50" fill="#b9d7ad"/><path d="M50 72c12-18 30-18 42 0 8-12 18-10 28 0" fill="none" stroke="#4f7d54" stroke-width="7"/>';
    if (kind === "roughly") return icon.arrows;
    if (kind === "many") return '<circle cx="45" cy="55" r="18" fill="#7897b8"/><circle cx="80" cy="45" r="22" fill="#e88765"/><circle cx="115" cy="58" r="18" fill="#9dbd8e"/><path d="M25 110h110" stroke="#59656e" stroke-width="7"/>';
    if (kind === "little") return '<circle cx="80" cy="70" r="22" fill="#e8b957" stroke="#59656e" stroke-width="5"/><path d="M35 110h90" stroke="#59656e" stroke-width="7"/>';
    if (kind === "notatall") return '<circle cx="80" cy="70" r="48" fill="#f0c1bb"/><path d="M50 42l60 56M110 42L50 98" stroke="#a84d48" stroke-width="10" stroke-linecap="round"/>';
    if (kind === "quickly") return icon.arrows;
    if (kind === "certainly") return '<circle cx="80" cy="70" r="50" fill="#b9d7ad"/><path d="M50 72l20 20 42-50" fill="none" stroke="#4f7d54" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>';
    return icon.star;
  }

  function add() {
    if (window.__lesson9IllustrationsAdded) return;
    window.__lesson9IllustrationsAdded = true;
    document.querySelectorAll('.card').forEach(card => {
      const jp = card.dataset.jp || card.querySelector('.jp, .japanese, .front')?.textContent?.trim();
      const kind = map[jp];
      if (!kind || card.querySelector('.lesson-illustration')) return;
      const img = document.createElement('div');
      img.className = 'lesson-illustration';
      img.innerHTML = '<svg viewBox="0 0 160 145" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'+body(kind)+'</svg>';
      const back = card.querySelector('.back');
      if (back) {
        const romaji = back.querySelector('.romaji');
        if (romaji) romaji.insertAdjacentElement('afterend', img); else back.prepend(img);
      }
    });
  }
  const observer = new MutationObserver(() => setTimeout(add, 0));
  observer.observe(document.body, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add, { once: true }); else add();
})();
