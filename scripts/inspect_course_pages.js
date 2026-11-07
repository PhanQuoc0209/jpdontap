const fs = require('fs');

['jpd113', 'jpd123', 'jpd133'].forEach(c => {
  const file = `manabiman_tu_vung_${c}.html`;
  const content = fs.readFileSync(file, 'utf8');
  console.log(`=== ${c} ===`);
  const routes = [...content.matchAll(/(\/tu-vung\/[a-zA-Z0-9_\-\/]+)/g)].map(m => m[1]);
  const uniqueRoutes = [...new Set(routes)];
  console.log(`Unique routes (${uniqueRoutes.length}):`, uniqueRoutes);

  // Check for any embedded JSON data or chunks
  const jsonMatches = [...content.matchAll(/"(id|word|kana|meaning|vietnamese)":\s*"([^"]+)"/g)].slice(0, 10);
  console.log('Sample word tokens in page:', jsonMatches.map(m => `${m[1]}=${m[2]}`));
});
