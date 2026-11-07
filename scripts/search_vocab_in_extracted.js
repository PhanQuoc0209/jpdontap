const fs = require('fs');

const text = fs.readFileSync('sample_v2_2_2_extracted.txt', 'utf8');

// Look for unescaped JSON objects
const lines = text.split('\n');
console.log('Total lines:', lines.length);

lines.forEach((l, idx) => {
  if (l.includes('kana') || l.includes('meaning') || l.includes('furigana') || l.includes('vietnamese') || l.includes('tu-vung') || l.includes('word')) {
    console.log(`Line ${idx} match (${l.length} chars):`, l.slice(0, 300));
  }
});
