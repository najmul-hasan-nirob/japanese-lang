// Context-specific Bangla corrections for words reused across lessons.
(function () {
  const fixes = {
    3: {
      "こちら": "এদিকে / এই স্থান; ここ-এর ভদ্র রূপ",
      "そちら": "ওদিকে / ওই স্থান; そこ-এর ভদ্র রূপ",
      "あちら": "ওদিকের সেই স্থান; あそこ-এর ভদ্র রূপ",
      "どちら": "কোন দিকে / কোথায়; どこ-এর ভদ্র রূপ"
    },
    4: {
      "そちら": "আপনার দিক / আপনার স্থান"
    },
    12: {
      "どちら": "দুটির মধ্যে কোনটি"
    },
    20: {
      "こっち": "এদিকে / এখানে — こちら-এর অনানুষ্ঠানিক রূপ",
      "そっち": "ওদিকে / সেখানে — そちら-এর অনানুষ্ঠানিক রূপ",
      "あっち": "ওইদিকে / ওখানে — あちら-এর অনানুষ্ঠানিক রূপ",
      "どっち": "দুটির মধ্যে কোনটি / কোন দিকে — どちら-এর অনানুষ্ঠানিক রূপ"
    },
    22: {
      "こちら": "এটি / এটা — これ-এর ভদ্র রূপ"
    }
  };

  for (const [num, map] of Object.entries(fixes)) {
    const lesson = window['lesson' + num];
    if (!lesson) continue;
    const walk = value => {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) return value.forEach(walk);
      if (typeof value.jp === 'string' && map[value.jp]) value.bn = map[value.jp];
      Object.keys(value).forEach(k => { if (k !== 'bn') walk(value[k]); });
    };
    walk(lesson);
  }
})();
