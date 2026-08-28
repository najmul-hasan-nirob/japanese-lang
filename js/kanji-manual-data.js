// ============================================================
// MANUAL KANJI DATA
// ============================================================
// Add your Kanji information ONLY in this file.
// The Kanji page no longer loads any external/current Kanji data.
//
// Structure:
// {
//   no: 1,
//   kanji: "山",
//   level: "N5",
//   meaning: "পাহাড়",
//   kun: ["やま"],
//   on: ["サン"],
//   examples: [
//     {
//       word: "富士山",
//       reading: "ふじさん",
//       romaji: "fujisan",
//       meaning: "ফুজি পাহাড়",
//       furigana: [
//         { kanji: "富士", reading: "ふじ" }
//       ]
//     }
//   ]
// }
//
// furigana is optional. You can add multiple examples to one Kanji.

window.kanjiManualData = [
  {
    no: 1,
    kanji: "山",
    level: "N5",
    englishPronunciation: "mountain",
    banglaPronounciation: "পাহাড়",
    kunyomiPronunciation: ["やま"],
    onyomiPronunciation: ["サン"],
    examples: [
      {
        wordWithKanji: "ふじ山",
        readingPronunciation: "ふじさん",
        readingRomaji: "fujisan",
        banglaPronounciation: "ফুজি পাহাড়",
      }
    ]
  }
];
