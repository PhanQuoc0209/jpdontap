const fs = require('fs');

const content = fs.readFileSync('sample_v1_1.html', 'utf8');

const pushes = [...content.matchAll(/self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g)].map(m => m[1]);
function unescapeStr(str) {
  try {
    return JSON.parse('"' + str + '"');
  } catch(e) {
    return str.replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }
}

const unescaped = unescapeStr(pushes.join('\n'));
fs.writeFileSync('sample_v1_1_unescaped.txt', unescaped);

const dataSearchMatches = [...unescaped.matchAll(/"data-search":\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total data-search items in v1-1:', dataSearchMatches.length);

dataSearchMatches.slice(0, 15).forEach((ds, i) => {
  console.log(`Item ${i}: "${ds}"`);
});

// Also find the text of paragraphs (meaning)
const pMatches = [...unescaped.matchAll(/\["\$","p",null,\{"className":"mt-1\.5 text-sm leading-relaxed text-ink-2","children":"([^"]+)"\}\]/g)].map(m => m[1]);
console.log('Meanings count:', pMatches.length);
console.log('Sample meanings:', pMatches.slice(0, 15));
