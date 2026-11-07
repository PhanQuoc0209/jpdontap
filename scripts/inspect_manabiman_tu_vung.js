const fs = require('fs');

const content = fs.readFileSync('manabiman_tu_vung.html', 'utf8');

// Find links
const hrefs = [...content.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
console.log('Hrefs in tu-vung:', [...new Set(hrefs)]);

// Search for self.__next_f pushes
const nextFPushes = [...content.matchAll(/self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g)].map(m => m[1]);
console.log('Next F pushes count:', nextFPushes.length);
if (nextFPushes.length > 0) {
  const allText = nextFPushes.join('\n');
  fs.writeFileSync('manabiman_tu_vung_text.txt', allText);
  console.log('Saved manabiman_tu_vung_text.txt, length:', allText.length);
}
