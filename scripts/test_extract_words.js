const fs = require('fs');

const text = fs.readFileSync('sample_v2_2_2_unescaped.txt', 'utf8');

// Strategy 1: data-search attribute
// Example: data-search="ひゃくにじゅう ひゃくにじゅう hyakunijuu 120 "
const dataSearchMatches = [...text.matchAll(/"data-search":\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total data-search items found:', dataSearchMatches.length);

dataSearchMatches.slice(0, 10).forEach((ds, i) => {
  console.log(`Item ${i}: "${ds}"`);
});

// Check if itemId and label also exist
const itemMatches = [...text.matchAll(/"itemId":\s*(\d+),\s*"label":\s*"([^"]+)"/g)];
console.log('Total itemId matches:', itemMatches.length);
