const fs = require('fs');

const content = fs.readFileSync('sample_hantu_l1.html', 'utf8');

const pushes = [...content.matchAll(/self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g)].map(m => m[1]);
function unescapeStr(str) {
  try {
    return JSON.parse('"' + str + '"');
  } catch(e) {
    return str.replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }
}

const unescaped = unescapeStr(pushes.join('\n'));
fs.writeFileSync('sample_hantu_l1_unescaped.txt', unescaped);

// Search for data-search
const dataSearchMatches = [...unescaped.matchAll(/"data-search":\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total data-search items in hantu l1:', dataSearchMatches.length);
dataSearchMatches.slice(0, 15).forEach((ds, i) => console.log(`  Kanji ${i}: "${ds}"`));

// Look for Kanji card data
const kanjiList = [...unescaped.matchAll(/"kanji":\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Kanji matches count:', kanjiList.length);
console.log('Sample kanji matches:', kanjiList.slice(0, 15));
