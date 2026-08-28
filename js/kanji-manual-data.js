// Manual Kanji data source.
// Edit ONLY this file to add/change Kanji information used by the Kanji page.
// Structure:
// { no, kanji, level, meaning, kun: [], on: [], examples: [{ word, reading, romaji, meaning }] }
// Example:
// { no: 32, kanji: "中", level: "N5", meaning: "inside", kun: ["なか"], on: ["チュウ"], examples: [
//   { word: "中ごく", reading: "ちゅうごく", romaji: "chuugoku", meaning: "China" },
//   { word: "でんわ中", reading: "でんわちゅう", romaji: "denwachuu", meaning: "on the phone" },
//   { word: "いちにち中", reading: "いちにちじゅう", romaji: "ichinichijuu", meaning: "all day long" }
// ] }

const kanjiChars = "人日一二三四五六七八九十月火水木金土百千万円行来休見今大小上下中右左山川白本子男女父母友先生学校何時間分半毎年前後午名車天気電話食聞書読国外語入出雨東西南北長高口目手足近有花赤紙買朝昼夕夜私家会社店飲多少古新広安立知言思歩走住空週魚耳銀道駅曜作使待力不心文元音楽持映画料理方台字主以去正田同早明牛肉世界仕事工場屋旅動勉強考送売始終計兄弟姉妹代用自地図館英鉄町京味度風洋茶鳥堂室色青黒品物注意医者病院急春夏秋冬親切特別写真運転質問題答教習起死悪重発帰通開集歌着貸借犬服建海員族飯野菜止漢研究試験内体全回所公園利便頭部祖業太低短好若弱軽遠暑寒合伝決困返泳消忘呼閉引押拾捨説受取席連座変乗降働残調続練落寝遅顔首声都県区市村民産林森池門薬洗進暗光線";

window.kanjiManualData = [...kanjiChars].map((kanji, index) => ({
  no: index + 1,
  kanji,
  level: index < 120 ? "N5" : "N4",
  meaning: "",
  kun: [],
  on: [],
  examples: []
}));

window.kanjiData = window.kanjiManualData;
