const fs = require('fs');

const text = fs.readFileSync('manabiman_tu_vung_text.txt', 'utf8');

// Find all strings like /tu-vung/... or courses like jpd...
const routes = [...text.matchAll(/(\/(?:tu-vung|han-tu|bai-hoc|khoa-hoc|jpd)[a-zA-Z0-9_\-\/]*)/g)].map(m => m[1]);
console.log('Routes in text:', [...new Set(routes)]);

// Search for Vietnamese text or titles
const titles = [...text.matchAll(/"children":\s*"([^"]{4,50})"/g)].map(m => m[1]);
console.log('Titles / Text children count:', titles.length);
console.log('Sample text children:', titles.slice(0, 30));
