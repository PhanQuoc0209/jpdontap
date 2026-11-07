const fs = require('fs');

const text = fs.readFileSync('manabiman_tu_vung_text.txt', 'utf8');
const allHrefs = [...text.matchAll(/"(\/[a-zA-Z0-9_\-\/]+)"/g)].map(m => m[1]);
console.log('Unique hrefs in tu-vung page:', [...new Set(allHrefs)].filter(h => !h.includes('_next')));

const homeHtml = fs.readFileSync('manabiman.html', 'utf8');
const homeHrefs = [...homeHtml.matchAll(/"(\/[a-zA-Z0-9_\-\/]+)"/g)].map(m => m[1]);
console.log('Unique hrefs in home page:', [...new Set(homeHrefs)].filter(h => !h.includes('_next')));
