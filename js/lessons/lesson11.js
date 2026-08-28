// Lesson 11
const lesson11 = {
  "vocabulary": [
    {"jp":"います[こどもが～]","romaji":"imasu[kodomoga～]","en":"have [a child]","bn":"সন্তান থাকা"},
    {"jp":"います[にほんに～]","romaji":"imasu[nihonni～]","en":"stay, be [in Japan]","bn":"[জাপানে] থাকা / অবস্থান করা"},
    {"jp":"かかります","romaji":"kakarimasu","en":"take, cost (referring to time or money)","bn":"সময় লাগা / খরচ হওয়া"},
    {"jp":"やすみます[かいしゃを～]","romaji":"yasumimasu[kaishao～]","en":"take a day off [work]","bn":"[কাজ থেকে] ছুটি নেওয়া"},
    {"jp":"ひとつ","romaji":"hitotsu","en":"one (used when counting things)","bn":"একটি / একটিমাত্র (বস্তু গণনায়)"},
    {"jp":"ふたつ","romaji":"futatsu","en":"two","bn":"দুটি"},{"jp":"みっつ","romaji":"mittsu","en":"three","bn":"তিনটি"},{"jp":"よっつ","romaji":"yottsu","en":"four","bn":"চারটি"},{"jp":"いつつ","romaji":"itsutsu","en":"five","bn":"পাঁচটি"},{"jp":"むっつ","romaji":"muttsu","en":"six","bn":"ছয়টি"},{"jp":"ななつ","romaji":"nanatsu","en":"seven","bn":"সাতটি"},{"jp":"やっつ","romaji":"yattsu","en":"eight","bn":"আটটি"},{"jp":"ここのつ","romaji":"kokonotsu","en":"nine","bn":"নয়টি"},{"jp":"とお","romaji":"too","en":"ten","bn":"দশটি"},
    {"jp":"いくつ","romaji":"ikutsu","en":"how many (used when counting things)","bn":"কতটি / কতগুলো"},
    {"jp":"ひとり","romaji":"hitori","en":"one person","bn":"একজন ব্যক্তি / এক জন"},
    {"jp":"ふたり","romaji":"futari","en":"two person","bn":"দুই জন ব্যক্তি / দুজন"},
    {"jp":"～だい","romaji":"～dai","en":"counter for machines, cars, etc.","bn":"ছোট বস্তু, মেশিন ইত্যাদি গণনার কাউন্টার"},
    {"jp":"～にん","romaji":"～nin","en":"counter for people","bn":"মানুষ গণনার কাউন্টার"},
    {"jp":"なんにん","romaji":"nannin","en":"how many people","bn":"কতজন"},
    {"jp":"～まい","romaji":"～mai","en":"counter for paper, stamps, etc.","bn":"কাগজ, ডাকটিকিট ইত্যাদি পাতলা জিনিস গণনার কাউন্টার"},
    {"jp":"～かい","romaji":"～kai","en":"counter for times (occurrences)","bn":"বার / ঘটনার সংখ্যা গণনার কাউন্টার"},
    {"jp":"なんかい","romaji":"nankai","en":"how many times","bn":"কতবার"},
    {"jp":"りんご","romaji":"ringo","en":"apple","bn":"আপেল"},
    {"jp":"みかん","romaji":"mikan","en":"mandarin orange","bn":"কমলা / ম্যান্ডারিন কমলা 🍊"},
    {"jp":"サンドイッチ","romaji":"sandoicchi","en":"sandwich","bn":"স্যান্ডউইচ"},{"jp":"カレー[ライス]","romaji":"kare-[raisu]","en":"curry [with rice]","bn":"কারি [ভাতের সঙ্গে]"},{"jp":"アイスクリーム","romaji":"aisukuri-mu","en":"ice cream","bn":"আইসক্রিম"},{"jp":"きって","romaji":"kitte","en":"postage stamp","bn":"ডাকটিকিট"},{"jp":"はがき","romaji":"hagaki","en":"postcard","bn":"পোস্টকার্ড"},{"jp":"ふうとう","romaji":"fuutou","en":"envelope","bn":"খাম"},
    {"jp":"りょうしん","romaji":"ryoushin","en":"parents","bn":"বাবা-মা / পিতা-মাতা"},{"jp":"きょうだい","romaji":"kyoudai","en":"brothers and sisters","bn":"ভাই-বোন"},{"jp":"あに","romaji":"ani","en":"(my) elder brother","bn":"আমার বড় ভাই"},{"jp":"あね","romaji":"ane","en":"(my) elder sister","bn":"আমার বড় বোন"},{"jp":"おとうと","romaji":"otouto","en":"(my) younger brother","bn":"আমার ছোট ভাই"},{"jp":"いもうと","romaji":"imouto","en":"(my) younger sister","bn":"আমার ছোট বোন"},{"jp":"おにいさん","romaji":"oniisan","en":"(someone else's) elder brother","bn":"অন্যের বড় ভাই"},{"jp":"おねえさん","romaji":"oneesan","en":"(someone else's) elder sister","bn":"অন্যের বড় বোন"},{"jp":"おとうとさん","romaji":"otoutosan","en":"(someone else's) younger brother","bn":"অন্যের ছোট ভাই"},{"jp":"いもうとさん","romaji":"imoutosan","en":"(someone else's) younger sister","bn":"অন্যের ছোট বোন"},
    {"jp":"りゅうがくせい","romaji":"ryuugakusei","en":"foreign student","bn":"বিদেশে পড়াশোনা করা শিক্ষার্থী / বিদেশি শিক্ষার্থী"},{"jp":"クラス","romaji":"kurasu","en":"class","bn":"ক্লাস / শ্রেণি"},{"jp":"がいこく","romaji":"gaikoku","en":"foreign country","bn":"বিদেশ / বিদেশি দেশ"},{"jp":"ぜんぶで","romaji":"zenbude","en":"in total","bn":"সব মিলিয়ে / মোট"},{"jp":"どのくらい／どれくらい","romaji":"donokurai／dorekurai","en":"how long, how much","bn":"কতক্ষণ / কতটা / কত পরিমাণ"},{"jp":"～じかん","romaji":"～jikan","en":"~ hour(s)","bn":"~ ঘণ্টা"},{"jp":"～しゅうかん","romaji":"～shuukan","en":"~ week(s)","bn":"~ সপ্তাহ"},{"jp":"～かげつ","romaji":"～kagetsu","en":"~ month(s)","bn":"~ মাস"},{"jp":"～ねんかん","romaji":"～nenkan","en":"~ year(s)","bn":"~ বছর"},
    {"jp":"～ぐらい","romaji":"gurai","en":"about～","bn":"প্রায়"},
{"jp":"みんな","romaji":"minna","en":"all, everything, everyone","bn":"সবাই, সবকিছু, সবাই মিলে"},
{"jp":"だけ","romaji":"dake","en":"only","bn":"শুধু, মাত্র"}
  ],
  "cpart": [
    {"jp":"おでかけですか。","romaji":"odekakedesuka。","en":"Are you going out?","bn":"আপনি কি বাইরে যাচ্ছেন?"},{"jp":"ちょっと ～まで。","romaji":"chotto ～made。","en":"I'm just going to ~.","bn":"আমি শুধু ~ পর্যন্ত যাচ্ছি।"},{"jp":"いってらっしゃい。","romaji":"itterasshai。","en":"See you later./So long. (lit. Go and come back.)","bn":"যান, পরে ফিরে আসবেন। / পরে দেখা হবে।"},{"jp":"いってきます。","romaji":"ittekimasu。","en":"See you later./So long. (lit. I'm going and coming back.)","bn":"আমি যাচ্ছি, পরে ফিরে আসব।"},{"jp":"いい おてんきですね。","romaji":"ii otenkidesune。","en":"Nice weather, isn't it?","bn":"আবহাওয়া সুন্দর, তাই না?"},{"jp":"そうですね。","romaji":"soudesune。","en":"Certainly. (Sir/Madam)","bn":"জি, তাই তো। / ঠিক বলেছেন।"}
  ],
  "country": [
    {"jp":"オーストラリア","romaji":"o-sutoraria","en":"Australia","bn":"অস্ট্রেলিয়া"},{"jp":"こうくうびん（エアメール）","romaji":"koukuubin（eame-ru）","en":"airmail","bn":"এয়ারমেইল / বিমান ডাক"},{"jp":"ふなびん","romaji":"funabin","en":"sea mail","bn":"সমুদ্র ডাক"},{"jp":"おねがいします。","romaji":"onegaishimasu。","en":"Please. (lit. ask for a favour)","bn":"দয়া করে / অনুগ্রহ করে"}
  ]
};
