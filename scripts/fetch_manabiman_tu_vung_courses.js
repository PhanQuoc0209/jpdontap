const { execSync } = require('child_process');
const fs = require('fs');

const courses = ['jpd113', 'jpd123', 'jpd133'];

courses.forEach(c => {
  const url = `https://manabiman.io.vn/tu-vung/${c}`;
  const outFile = `manabiman_tu_vung_${c}.html`;
  console.log(`Fetching ${url}...`);
  try {
    execSync(`curl.exe -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${url}" -o "${outFile}"`);
    const stat = fs.statSync(outFile);
    console.log(`Saved ${outFile}, size: ${stat.size} bytes`);
  } catch(e) {
    console.error(`Failed ${c}:`, e.message);
  }
});
