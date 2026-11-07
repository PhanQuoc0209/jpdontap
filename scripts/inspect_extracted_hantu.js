const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/manabi_hantu_extracted.json'), 'utf8'));

console.log('Kanji chars count:', data.kanjiChars.length);
console.log('Sample Kanji chars:', data.kanjiChars.slice(0, 10));

console.log('\nKanji Vocab count:', data.vocabWords.length);
console.log('Sample Kanji vocab:');
data.vocabWords.slice(0, 15).forEach(v => {
  console.log(`  ${v.word} (${v.kana}) [${v.romaji}] -> ${v.meaning} (Lesson: ${v.lessonId})`);
});
