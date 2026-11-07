const fs = require('fs');

const content = fs.readFileSync('manabiman_han_tu_jpd113.html', 'utf8');

// Find links under /han-tu
const routes = [...content.matchAll(/(\/han-tu\/[a-zA-Z0-9_\-\/]+)/g)].map(m => m[1]);
console.log('Unique routes in han-tu jpd113:', [...new Set(routes)]);

// Search for self.__next_f pushes
const pushes = [...content.matchAll(/self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g)].map(m => m[1]);
console.log('Pushes count:', pushes.length);
if (pushes.length > 0) {
  function unescapeStr(str) {
    try {
      return JSON.parse('"' + str + '"');
    } catch(e) {
      return str.replace(/\\"/g, '"').replace(/\\n/g, '\n');
    }
  }
  const unescaped = unescapeStr(pushes.join('\n'));
  fs.writeFileSync('manabiman_han_tu_jpd113_extracted.txt', unescaped);

  // Search for Kanji characters or han-viet
  const kanjiMatches = unescaped.match(/[\u4e00-\u9faf]/g) || [];
  console.log('Unique Kanji found:', [...new Set(kanjiMatches)]);
}
