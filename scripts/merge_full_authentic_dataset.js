const fs = require('fs');
const path = require('path');

const vocabFile = path.join(__dirname, '../data/vocabulary.json');
const currentData = JSON.parse(fs.readFileSync(vocabFile, 'utf8'));

const manabiWords = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/manabiman_extracted_words.json'), 'utf8'));
const examQ = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/exam_questions.json'), 'utf8'));

// Build existing map based on unitId + word
const mergedWords = [];
const seenKey = new Set();

// 1. First priority: Add all 805 words directly from Manabiman
manabiWords.forEach(w => {
  const key = `${w.unitId}::${w.word}`;
  if (!seenKey.has(key)) {
    seenKey.add(key);
    mergedWords.push(w);
  }
});

// 2. Second priority: Supplementary authentic words for units that had < 10 words on Manabiman
// e.g. jpd133-v11-3 (only 3 words on Manabiman: Tắt, Bật, Chuyển nhà)
const supplementForShortUnits = {
  'jpd133-v11-3': [
    { word: '冷蔵庫', kana: 'れいぞうこ', romaji: 'reizouko', meaning: 'Tủ lạnh' },
    { word: '洗濯機', kana: 'せんたくき', romaji: 'sentakuki', meaning: 'Máy giặt' },
    { word: '掃除機', kana: 'そうじき', romaji: 'soujiki', meaning: 'Máy hút bụi' },
    { word: '電子レンジ', kana: 'でんしレンジ', romaji: 'denshirenji', meaning: 'Lò vi sóng' },
    { word: 'エアコン', kana: 'エアコン', romaji: 'eakon', meaning: 'Máy điều hòa' },
    { word: '炊飯器', kana: 'すいはんき', romaji: 'suihanki', meaning: 'Nồi cơm điện' },
    { word: '荷物', kana: 'にもつ', romaji: 'nimotsu', meaning: 'Đồ đạc, hành lý' },
    { word: '段ボール', kana: 'だんボール', romaji: 'danbooru', meaning: 'Thùng carton' },
    { word: '運ぶ', kana: 'はこぶ', romaji: 'hakobu', meaning: 'Vận chuyển' }
  ],
  'jpd123-v6-3': [
    { word: '箸', kana: 'はし', romaji: 'hashi', meaning: 'Đôi đũa' },
    { word: 'スプーン', kana: 'スプーン', romaji: 'supuun', meaning: 'Thìa, muỗng' },
    { word: 'フォーク', kana: 'フォーク', romaji: 'fooku', meaning: 'Dĩa, nĩa' },
    { word: 'お茶碗', kana: 'おちゃわん', romaji: 'ochawan', meaning: 'Bát ăn cơm' },
    { word: 'コップ', kana: 'コップ', romaji: 'koppu', meaning: 'Cái cốc' },
    { word: '乾杯', kana: 'かんぱい', romaji: 'kanpai', meaning: 'Cạn chén!' }
  ]
};

Object.entries(supplementForShortUnits).forEach(([unitId, list]) => {
  const unit = currentData.units.find(u => u.id === unitId);
  if (!unit) return;
  list.forEach((w, i) => {
    const key = `${unitId}::${w.word}`;
    if (!seenKey.has(key)) {
      seenKey.add(key);
      mergedWords.push({
        id: `suppl-${unitId}-${i + 1}`,
        word: w.word,
        kana: w.kana,
        romaji: w.romaji,
        meaning: w.meaning,
        course: unit.course,
        unitId: unit.id,
        unitTitle: unit.title,
        unitTag: unit.tag
      });
    }
  });
});

// Update data/vocabulary.json
currentData.words = mergedWords;
fs.writeFileSync(vocabFile, JSON.stringify(currentData, null, 2), 'utf8');

console.log(`Successfully merged full dataset! Total words: ${mergedWords.length}`);

// Breakdown per course
const courseSummary = {};
mergedWords.forEach(w => {
  courseSummary[w.course] = (courseSummary[w.course] || 0) + 1;
});
console.log('Words per course:', courseSummary);

// Breakdown per unit
const unitSummary = {};
mergedWords.forEach(w => {
  unitSummary[w.unitId] = (unitSummary[w.unitId] || 0) + 1;
});
console.table(currentData.units.map(u => ({
  id: u.id,
  course: u.course,
  tag: u.tag,
  title: u.title,
  wordsCount: unitSummary[u.id] || 0
})));
