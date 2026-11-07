const fs = require('fs');

const text = fs.readFileSync('sample_v2_2_2_unescaped.txt', 'utf8');

const idx = text.indexOf('ひゃくにじゅう');
console.log('Index:', idx);
if (idx !== -1) {
  console.log('Surrounding 1000 chars:');
  console.log(text.slice(Math.max(0, idx - 400), idx + 800));
}
