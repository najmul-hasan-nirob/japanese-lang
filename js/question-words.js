// Question words (ぎもんし) — beginner-friendly hiragana cards.
const questionWords = [
  { id: 'question-nani', group: 'question-words', jp: 'なに', romaji: 'nani', en: 'What', bn: 'কি / কী' },
  { id: 'question-nan', group: 'question-words', jp: 'なん', romaji: 'nan', en: 'What', bn: 'কি / কী' },
  { id: 'question-dare', group: 'question-words', jp: 'だれ', romaji: 'dare', en: 'Who', bn: 'কে' },
  { id: 'question-dono', group: 'question-words', jp: 'だれの', romaji: 'dare no', en: 'Whose', bn: 'কার' },
  { id: 'question-donata', group: 'question-words', jp: 'どなた', romaji: 'donata', en: 'Who (polite)', bn: 'কে (ভদ্রভাবে)' },
  { id: 'question-donatasama', group: 'question-words', jp: 'どなたさま', romaji: 'donatasama', en: 'Who (very polite)', bn: 'কে (আরও সম্মানজনক)' },
  { id: 'question-doko', group: 'question-words', jp: 'どこ', romaji: 'doko', en: 'Where', bn: 'কোথায়' },
  { id: 'question-dokokara', group: 'question-words', jp: 'どこから', romaji: 'doko kara', en: 'Where from', bn: 'কোথা থেকে' },
  { id: 'question-dokohe', group: 'question-words', jp: 'どこへ', romaji: 'doko e', en: 'Where to', bn: 'কোথায় (গন্তব্য)' },
  { id: 'question-itsu', group: 'question-words', jp: 'いつ', romaji: 'itsu', en: 'When', bn: 'কখন' },
  { id: 'question-doushite', group: 'question-words', jp: 'どうして', romaji: 'doushite', en: 'Why', bn: 'কেন' },
  { id: 'question-dou', group: 'question-words', jp: 'どう', romaji: 'dou', en: 'How / How is it', bn: 'কেমন / কীভাবে' },
  { id: 'question-douyatte', group: 'question-words', jp: 'どうやって', romaji: 'dou yatte', en: 'How', bn: 'কীভাবে / কেমন করে' },
  { id: 'question-donna', group: 'question-words', jp: 'どんな', romaji: 'donna', en: 'What kind of', bn: 'কেমন / কী ধরনের' },
  { id: 'question-dore', group: 'question-words', jp: 'どれ', romaji: 'dore', en: 'Which one', bn: 'কোনটি / কোনটা' },
  { id: 'question-dono', group: 'question-words', jp: 'どの', romaji: 'dono', en: 'Which + noun', bn: 'কোন + noun' },
  { id: 'question-dochira', group: 'question-words', jp: 'どちら', romaji: 'dochira', en: 'Which / Where (polite)', bn: 'কোনটি / কোন দিক / কোথায় (ভদ্র)' },
  { id: 'question-docchi', group: 'question-words', jp: 'どっち', romaji: 'docchi', en: 'Which (casual)', bn: 'কোনটা / কোন দিক (কথ্য)' },
  { id: 'question-ikutsu', group: 'question-words', jp: 'いくつ', romaji: 'ikutsu', en: 'How many', bn: 'কত' },
  { id: 'question-ikura', group: 'question-words', jp: 'いくら', romaji: 'ikura', en: 'How much', bn: 'কত টাকা' },
  { id: 'question-nannin', group: 'question-words', jp: 'なんにん', romaji: 'nannin', en: 'How many people', bn: 'কতজন' },
  { id: 'question-donokurai', group: 'question-words', jp: 'どのくらい', romaji: 'dono kurai', en: 'How long / How much', bn: 'কত সময় / কতক্ষণ' },
  { id: 'question-nanigo', group: 'question-words', jp: 'なにご', romaji: 'nanigo', en: 'What language', bn: 'কোন ভাষা' },
  { id: 'question-nanno', group: 'question-words', jp: 'なんの', romaji: 'nan no', en: 'What kind of / Of what', bn: 'কীসের / কোন ধরনের' }
];
window.timeDateNumbers = (window.timeDateNumbers || []).concat(questionWords);
