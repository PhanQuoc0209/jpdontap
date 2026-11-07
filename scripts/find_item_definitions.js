const fs = require('fs');

const text = fs.readFileSync('sample_v2_2_2_unescaped.txt', 'utf8');

['1d:', '1e:', '1f:', '20:', '21:'].forEach(k => {
  const idx = text.indexOf(k);
  console.log(`Key ${k} at ${idx}:`);
  if (idx !== -1) {
    console.log(text.slice(idx, idx + 200));
  }
});
