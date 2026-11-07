const fs = require('fs');

const text = fs.readFileSync('sample_v2_2_2_unescaped.txt', 'utf8');

const idx = text.indexOf('20:[');
console.log(text.slice(idx, idx + 600));
