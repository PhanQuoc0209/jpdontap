const fs = require('fs');
const path = require('path');

async function main() {
  const alpha = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/alphabet.json'), 'utf8'));
  const kanji = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kanji.json'), 'utf8'));

  const charSet = new Set();
  alpha.groups.forEach(g => {
    g.rows?.forEach(r => {
      r.items?.forEach(it => {
        if (it.hira) for (const ch of it.hira) charSet.add(ch);
        if (it.kata) for (const ch of it.kata) charSet.add(ch);
      });
    });
  });

  kanji.forEach(k => {
    if (k.kanji) for (const ch of k.kanji) charSet.add(ch);
  });

  const chars = Array.from(charSet);
  console.log(`Fetching stroke data for ${chars.length} characters from KanjiVG...`);

  const results = {};
  let fetchedCount = 0;
  let failCount = 0;

  // Fetch in concurrent batches of 15
  const batchSize = 15;
  for (let i = 0; i < chars.length; i += batchSize) {
    const batch = chars.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (char) => {
        const hex = char.codePointAt(0).toString(16).padStart(5, '0');
        const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;

        try {
          const resp = await fetch(url);
          if (!resp.ok) {
            failCount++;
            return;
          }
          const xml = await resp.text();

          // Extract stroke paths
          const pathMatches = xml.matchAll(/<path[^>]+d="([^"]+)"/g);
          const paths = [];
          for (const m of pathMatches) {
            paths.push(m[1]);
          }

          // Extract stroke start coordinates from first 'M' or 'm'
          const strokeData = paths.map((d, idx) => {
            const m = d.match(/^[Mm]\s*([0-9.]+)[,\s]+([0-9.]+)/);
            const startX = m ? parseFloat(m[1]) : 50;
            const startY = m ? parseFloat(m[2]) : 50;

            return {
              strokeNumber: idx + 1,
              d,
              startX: Math.round(startX * 100) / 100,
              startY: Math.round(startY * 100) / 100
            };
          });

          if (strokeData.length > 0) {
            results[char] = {
              char,
              hex,
              totalStrokes: strokeData.length,
              strokes: strokeData
            };
            fetchedCount++;
          }
        } catch (err) {
          failCount++;
        }
      })
    );

    process.stdout.write(`Progress: ${Math.min(i + batchSize, chars.length)}/${chars.length} (Fetched: ${fetchedCount}, Failed: ${failCount})\r`);
  }

  console.log(`\nFetch complete! Successfully cached ${fetchedCount} characters (${failCount} not in KanjiVG).`);

  const outPath = path.join(__dirname, '../data/kanjivg_strokes.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Saved to: ${outPath}`);
}

main().catch(console.error);
