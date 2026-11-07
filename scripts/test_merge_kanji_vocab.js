const fs = require('fs');
const path = require('path');

const vocabFile = path.join(__dirname, '../data/vocabulary.json');
const currentVocab = JSON.parse(fs.readFileSync(vocabFile, 'utf8'));

const hantuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/manabi_hantu_extracted.json'), 'utf8'));

console.log('Current vocab words:', currentVocab.words.length);
console.log('Hán tự vocab words to merge:', hantuData.vocabWords.length);

// Check how many match existing words by kana
const kanaToKanji = new Map();
hantuData.vocabWords.forEach(hv => {
  if (hv.hasKanji) {
    kanaToKanji.set(hv.kana, hv);
  }
});

let updatedCount = 0;
let newAddedCount = 0;

// Also look at existing words in currentVocab
const existingKeys = new Set(currentVocab.words.map(w => `${w.unitId}::${w.word}`));
const existingKanaKeys = new Set(currentVocab.words.map(w => `${w.course}::${w.kana}`));

currentVocab.words.forEach(w => {
  if (!/[\u4e00-\u9faf]/.test(w.word) && kanaToKanji.has(w.kana)) {
    const match = kanaToKanji.get(w.kana);
    // console.log(`Can update: ${w.word} -> ${match.word} (${w.meaning})`);
    updatedCount++;
  }
});

console.log(`Words that will be enriched with Kanji: ${updatedCount}`);
