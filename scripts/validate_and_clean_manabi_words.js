const fs = require('fs');
const path = require('path');

const words = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/manabiman_extracted_words.json'), 'utf8'));

let issues = 0;
words.forEach((w, idx) => {
  if (!w.word || !w.kana || !w.meaning) {
    console.log(`Word ${idx} has missing field:`, w);
    issues++;
  }
  // Check if meaning contains garbage or unescaped tokens
  if (w.meaning.includes('["$') || w.meaning.includes('className') || w.meaning.includes('$L')) {
    console.log(`Word ${idx} has raw JSX meaning:`, w);
    issues++;
  }
});

console.log(`Validation complete. Total issues found: ${issues}`);
