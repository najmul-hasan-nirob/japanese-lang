// Corrections for Bangla shown on grammar/example cards.
(function () {
  const fixes = {
    "②わたしはかいしゃいんです。": "আমি একটি কোম্পানির কর্মচারী।",
    "③サントスさんはがくせいじゃ（では）ありません。": "মিস্টার সান্তোস শিক্ষার্থী নন।",
    "⑤ミラーさんはせんせいですか。……いいえ、せんせいじゃありません。": "মিস্টার মিলার কি শিক্ষক? …না, তিনি শিক্ষক নন।",
    "⑥あのかたはどなたですか。……［あのかたは］ミラーさんです。": "ওই ভদ্রলোক কে? …উনি মিস্টার মিলার।",
    "⑦ミラーさんはかいしゃいんです。グプタさんもかいしゃいんです。": "মিস্টার মিলার কোম্পানির কর্মচারী। মিস্টার গুপ্তও কোম্পানির কর্মচারী।",
    "⑧ミラーさんはIMCのしゃいんです。": "মিস্টার মিলার IMC কোম্পানির কর্মচারী।"
  };
  for (let i = 1; i <= 25; i++) {
    const lesson = window['lesson' + i];
    if (!lesson) continue;
    const walk = value => {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) return value.forEach(walk);
      if (typeof value.jp === 'string' && fixes[value.jp]) value.bn = fixes[value.jp];
      Object.keys(value).forEach(k => { if (k !== 'bn') walk(value[k]); });
    };
    walk(lesson);
  }
})();
