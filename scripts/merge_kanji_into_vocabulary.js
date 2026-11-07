const fs = require('fs');
const path = require('path');

const vocabFile = path.join(__dirname, '../data/vocabulary.json');
const currentVocab = JSON.parse(fs.readFileSync(vocabFile, 'utf8'));

const hantuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/manabi_hantu_extracted.json'), 'utf8'));
const kanjiFile = path.join(__dirname, '../data/kanji.json');
const currentKanji = JSON.parse(fs.readFileSync(kanjiFile, 'utf8'));

console.log('--- STARTING KANJI MERGE ---');
console.log('Initial vocabulary words:', currentVocab.words.length);
console.log('Initial kanji characters:', currentKanji.length);

// 1. Build dictionary of Kana -> Kanji from Hán tự vocabulary
const kanaToKanjiMap = new Map();
hantuData.vocabWords.forEach(hv => {
  if (hv.hasKanji) {
    // If not already mapped or prefers longer Kanji
    if (!kanaToKanjiMap.has(hv.kana) || hv.word.length > kanaToKanjiMap.get(hv.kana).word.length) {
      kanaToKanjiMap.set(hv.kana, hv);
    }
  }
});

// Also add common standard JPD Kanji mappings for words where kana is used
const standardKanjiDictionary = {
  // JPD113
  'わたし': '私',
  'なまえ': '名前',
  'おなまえ': 'お名前',
  'くに': '国',
  'おくに': 'お国',
  'にほん': '日本',
  'かんこく': '韓国',
  'ちゅうごく': '中国',
  'こうこう': '高校',
  'だいがく': '大学',
  'せんせい': '先生',
  'がくせい': '学生',
  'かいしゃいん': '会社員',
  'ぎんこういん': '銀行員',
  'いしゃ': '医者',
  'びょういん': '病院',
  'だれ': '誰',
  'どなた': '何方',
  'なんさい': '何歳',
  'いちがつ': '一月',
  'にがつ': '二月',
  'さんがつ': '三月',
  'しがつ': '四月',
  'ごがつ': '五月',
  'ろくがつ': '六月',
  'しちがつ': '七月',
  'はちがつ': '八月',
  'くがつ': '九月',
  'じゅうがつ': '十月',
  'じゅういちがつ': '十一月',
  'じゅうにがつ': '十二月',
  'なんがつ': '何月',
  'ついたち': '一日',
  'ふつか': '二日',
  'みっか': '三日',
  'よっか': '四日',
  'いつか': '五日',
  'むいか': '六日',
  'なのか': '七日',
  'ようか': '八日',
  'ここのか': '九日',
  'とおか': '十日',
  'なんにち': '何日',
  'きょう': '今日',
  'あした': '明日',
  'きのう': '昨日',
  'たんじょうび': '誕生日',
  'しゅみ': '趣味',
  'どくしょ': '読書',
  'おんがく': '音楽',
  'えいが': '映画',
  'りょこう': '旅行',
  'しゃしん': '写真',
  'りょうり': '料理',
  'じょうず': '上手',
  'へた': '下手',
  'ほんや': '本屋',
  'ぎんこう': '銀行',
  'としょかん': '図書館',
  'きょうしつ': '教室',
  'しょくどう': '食堂',
  'じむしょ': '事務所',
  'かいぎしつ': '会議室',
  'へや': '部屋',
  'かいだん': '階段',
  'えんぴつ': '鉛筆',
  'ほん': '本',
  'じしょ': '辞書',
  'かさ': '傘',
  'かばん': '鞄',
  'とけい': '時計',
  'かぎ': '鍵',
  'ひとつ': '一つ',
  'ふたつ': '二つ',
  'みっつ': '三つ',
  'よっつ': '四つ',
  'いつつ': '五つ',
  'むっつ': '六つ',
  'ななつ': '七つ',
  'やっつ': '八つ',
  'ここのつ': '九つ',
  'とお': '十',
  'ひゃく': '百',
  'せん': '千',
  'まん': '万',
  'えん': '円',
  'たかい': '高い',
  'やすい': '安い',
  'さいふ': '財布',
  'おかね': 'お金',
  'ごはん': 'ご飯',
  'たまご': '卵',
  'にく': '肉',
  'ぎゅうにく': '牛肉',
  'ぶたにく': '豚肉',
  'とりにく': '鶏肉',
  'さかな': '魚',
  'やさい': '野菜',
  'くだもの': '果物',
  'みず': '水',
  'おちゃ': 'お茶',
  'こうちゃ': '紅茶',
  'ぎゅうにゅう': '牛乳',
  'おさけ': 'お酒',
  'いま': '今',
  'なんじ': '何時',
  'はん': '半',
  'ごぜん': '午前',
  'ごご': '午後',
  'あさ': '朝',
  'ひる': '昼',
  'ばん': '晩',
  'よる': '夜',
  'けさ': '今朝',
  'こんばん': '今晩',
  'やすみ': '休み',
  'ひるやすみ': '昼休み',
  'はる': '春',
  'なつ': '夏',
  'あき': '秋',
  'ふゆ': '冬',
  'いく': '行く',
  'くる': '来る',
  'かえる': '帰る',
  'うみ': '海',
  'やま': '山',
  'かわ': '川',
  'ゆき': '雪',
  'あめ': '雨',
  'あつい': '暑い',
  'さむい': '寒い',
  'おきる': '起きる',
  'ねる': '寝る',
  'はたらく': '働く',
  'やすむ': '休む',
  'べんきょうする': '勉強する',
  'おわる': '終わる',
  'たべる': '食べる',
  'のむ': '飲む',
  'みる': '見る',
  'きく': '聞く',
  'よむ': '読む',
  'かく': '書く',
  'かう': '買う',
  'とる': '撮る',
  'あう': '会う',
  'まいにち': '毎日',
  'まいあさ': '毎朝',
  'まいばん': '毎晩',

  // JPD123
  'ひと': '人',
  'ともだち': '友達',
  'かれ': '彼',
  'かのじょ': '彼女',
  'かぞく': '家族',
  'ひとり': '一人',
  'しずか': '静か',
  'ゆうめい': '有名',
  'しんせつ': '親切',
  'げんき': '元気',
  'ひま': '暇',
  'べんり': '便利',
  'まち': '町',
  'ところ': '所',
  'おおきい': '大きい',
  'ちいさい': '小さい',
  'あたらしい': '新しい',
  'ふるい': '古い',
  'わるい': '悪い',
  'あまい': '甘い',
  'からい': '辛い',
  'てんき': '天気',
  'たのしい': '楽しい',
  'おもしろい': '面白い',
  'いそがしい': '忙しい',
  'しろい': '白い',
  'くろい': '黒い',
  'あかい': '赤い',
  'あおい': '青い',
  'いろ': '色',
  'すき': '好き',
  'きらい': '嫌い',
  'ほしい': '欲しい',
  'ゆめ': '夢',
  'いしゃ': '医者',
  'いちばん': '一番',
  'きせつ': '季節',
  'せかい': '世界',
  'おなじ': '同じ',
  'ちがう': '違う',
  'はし': '箸',
  'つくえ': '机',
  'いす': '椅子',
  'ほんだな': '本棚',
  'はこ': '箱',
  'れいぞうこ': '冷蔵庫',
  'まど': '窓',
  'いえ': '家',
  'うち': '家',
  'へや': '部屋',
  'だいどころ': '台所',
  'おふろ': 'お風呂',
  'にわ': '庭',
  'そうじする': '掃除する',
  'せんたくする': '洗濯する',
  'いっしょに': '一緒に',

  // JPD133
  'ちち': '父',
  'はは': '母',
  'あに': '兄',
  'あね': '姉',
  'おとうと': '弟',
  'いもうと': '妹',
  'おとこのひと': '男の人',
  'おんなのひと': '女の人',
  'おとこのこ': '男の子',
  'おんなのこ': '女の子',
  'て': '手',
  'あし': '足',
  'め': '目',
  'みみ': '耳',
  'くち': '口',
  'はな': '鼻',
  'あたま': '頭',
  'かみ': '髪',
  'せ': '背',
  'やさしい': '優しい',
  'あかるい': '明るい',
  'みやげ': '土産',
  'おみやげ': 'お土産',
  'はな': '花',
  'かします': '貸します',
  'かります': '借ります',
  'おしえます': '教えます',
  'ならいます': '習います',
  'さんかする': '参加する',
  'れんしゅうする': '練習する',
  'しあい': '試合',
  'かつ': '勝つ',
  'まける': '負ける',
  'はしる': '走る',
  'およぐ': '泳ぐ',
  'うんどうする': '運動する',
  'たいかい': '大会',
  'しょるい': '書類',
  'きにゅうする': '記入する',
  'ていしゅつする': '提出する',
  'みぎ': '右',
  'ひだり': '左',
  'まえ': '前',
  'うしろ': '後ろ',
  'うえ': '上',
  'した': '下',
  'なか': '中',
  'そと': '外',
  'となり': '隣',
  'ちかく': '近く',
  'あいだ': '間',
  'かぜ': '風邪',
  'ねつ': '熱',
  'ずつう': '頭痛',
  'くすり': '薬',
  'うまれる': '生まれる',
  'にゅうがくする': '入学する',
  'そつぎょうする': '卒業する',
  'しゅうしょくする': '就職する',
  'けっこんする': '結婚する',
  'こども': '子供',
  'ひっこしする': '引越しする'
};

// 2. ENRICH existing words with Kanji in place (preserving all properties, IDs, meaning)
let enrichedCount = 0;
currentVocab.words.forEach(w => {
  // If word does not yet contain Kanji
  if (!/[\u4e00-\u9faf]/.test(w.word)) {
    // Check Hantu map
    if (kanaToKanjiMap.has(w.kana)) {
      const match = kanaToKanjiMap.get(w.kana);
      if (/[\u4e00-\u9faf]/.test(match.word)) {
        w.word = match.word;
        enrichedCount++;
        return;
      }
    }
    // Check standard dictionary
    if (standardKanjiDictionary[w.kana]) {
      w.word = standardKanjiDictionary[w.kana];
      enrichedCount++;
      return;
    }
    // Check if word itself matches standard dictionary key
    if (standardKanjiDictionary[w.word]) {
      w.word = standardKanjiDictionary[w.word];
      enrichedCount++;
      return;
    }
  }
});
console.log(`Enriched ${enrichedCount} existing words with Kanji!`);

// 3. MERGE new Kanji vocabulary from Manabiman Hán tự that are not yet in currentVocab ("ko xoa nha")
const existingWordSet = new Set(currentVocab.words.map(w => `${w.course}::${w.word}`));
let newKanjiVocabAdded = 0;

// Mapping lesson to unit:
const lessonToUnitMap = {
  'jpd113-l1': 'jpd113-v1-1',
  'jpd113-l2': 'jpd113-v2-1',
  'jpd113-l3': 'jpd113-v3-1',
  'jpd123-l4': 'jpd123-v4-1',
  'jpd123-l5': 'jpd123-v5-1',
  'jpd123-l6': 'jpd123-v6-1',
  'jpd123-l7': 'jpd123-v7-1',
  'jpd133-l8': 'jpd133-v8-1',
  'jpd133-l9': 'jpd133-v9-1',
  'jpd133-l10': 'jpd133-v10-1',
  'jpd133-l11': 'jpd133-v11-1'
};

hantuData.vocabWords.forEach((hv, idx) => {
  if (hv.hasKanji) {
    const key = `${hv.course}::${hv.word}`;
    if (!existingWordSet.has(key)) {
      existingWordSet.add(key);

      const targetUnitId = lessonToUnitMap[hv.lessonId] || `${hv.course}-v${hv.bai}-1`;
      const unitObj = currentVocab.units.find(u => u.id === targetUnitId) || currentVocab.units.find(u => u.course === hv.course) || currentVocab.units[0];

      currentVocab.words.push({
        id: `kanji-${hv.lessonId}-${idx + 1}`,
        word: hv.word,
        kana: hv.kana,
        romaji: hv.romaji || '',
        meaning: hv.meaning,
        course: hv.course,
        unitId: unitObj.id,
        unitTitle: unitObj.title,
        unitTag: unitObj.tag
      });
      newKanjiVocabAdded++;
    }
  }
});
console.log(`Added ${newKanjiVocabAdded} new authentic Kanji vocabulary entries without deleting anything!`);

// 4. Also UPDATE data/kanji.json with all 116 Kanji characters from Manabiman
const existingKanjiCharSet = new Set(currentKanji.map(k => k.kanji));
let newKanjiCharsAdded = 0;

hantuData.kanjiChars.forEach(kc => {
  if (!existingKanjiCharSet.has(kc.kanji)) {
    existingKanjiCharSet.add(kc.kanji);
    // Parse onyomi/kunyomi/meaning from raw: "私 TƯ Tôi, riêng tư シ わたし わたくし"
    const parts = kc.raw.split(/\s+/);
    const hanViet = parts[1] || '';
    const meaning = parts[2] || '';
    const onyomi = parts[3] || '';
    const kunyomi = parts.slice(4).join(', ') || '';

    currentKanji.push({
      kanji: kc.kanji,
      hanViet: hanViet,
      meaning: meaning,
      onyomi: onyomi,
      kunyomi: kunyomi,
      strokes: 0,
      level: kc.course.toUpperCase(),
      course: kc.course,
      example: `${kc.kanji} (${hanViet})`
    });
    newKanjiCharsAdded++;
  }
});
console.log(`Added ${newKanjiCharsAdded} new Kanji characters to data/kanji.json! Total Kanji characters: ${currentKanji.length}`);

// Save files
fs.writeFileSync(vocabFile, JSON.stringify(currentVocab, null, 2), 'utf8');
fs.writeFileSync(kanjiFile, JSON.stringify(currentKanji, null, 2), 'utf8');

console.log('\n--- FINAL STATS ---');
console.log('Total vocabulary words:', currentVocab.words.length);
let totalWithKanji = 0;
currentVocab.words.forEach(w => {
  if (/[\u4e00-\u9faf]/.test(w.word)) totalWithKanji++;
});
console.log(`Words containing Kanji: ${totalWithKanji} / ${currentVocab.words.length} (${Math.round((totalWithKanji / currentVocab.words.length) * 100)}%)`);
