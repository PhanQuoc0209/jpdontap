const fs = require('fs');

const text = fs.readFileSync('sample_v2_2_2_extracted.txt', 'utf8');

// Unescape json string
function unescapeStr(str) {
  try {
    return JSON.parse('"' + str + '"');
  } catch(e) {
    return str.replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }
}

const unescaped = unescapeStr(text);
fs.writeFileSync('sample_v2_2_2_unescaped.txt', unescaped);
console.log('Saved sample_v2_2_2_unescaped.txt, length:', unescaped.length);

// Search for Japanese characters or Vietnamese characters in unescaped
const jpMatches = unescaped.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]+/g) || [];
console.log('Japanese words found:', jpMatches.length, 'sample:', jpMatches.slice(0, 30));
