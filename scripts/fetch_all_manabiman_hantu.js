const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const hantuLessons = [
  // JPD113
  { course: 'jpd113', lessonId: 'jpd113-l1', bai: '1' },
  { course: 'jpd113', lessonId: 'jpd113-l2', bai: '2' },
  { course: 'jpd113', lessonId: 'jpd113-l3', bai: '3' },

  // JPD123
  { course: 'jpd123', lessonId: 'jpd123-l4', bai: '4' },
  { course: 'jpd123', lessonId: 'jpd123-l5', bai: '5' },
  { course: 'jpd123', lessonId: 'jpd123-l6', bai: '6' },
  { course: 'jpd123', lessonId: 'jpd123-l7', bai: '7' },

  // JPD133
  { course: 'jpd133', lessonId: 'jpd133-l8', bai: '8' },
  { course: 'jpd133', lessonId: 'jpd133-l9', bai: '9' },
  { course: 'jpd133', lessonId: 'jpd133-l10', bai: '10' },
  { course: 'jpd133', lessonId: 'jpd133-l11', bai: '11' }
];

const outDir = path.join(__dirname, '../data/manabiman_hantu_raw');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function unescapeStr(str) {
  try {
    return JSON.parse('"' + str + '"');
  } catch(e) {
    return str.replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }
}

async function scrapeHantu() {
  console.log('Fetching all 11 Hán tự lessons from Manabiman...');
  const allHantuVocab = [];
  const allKanjiChars = [];

  for (let i = 0; i < hantuLessons.length; i++) {
    const l = hantuLessons[i];
    const url = `https://manabiman.io.vn/han-tu/${l.course}/${l.lessonId}`;
    const filePath = path.join(outDir, `${l.lessonId}.html`);

    console.log(`[${i + 1}/11] Fetching ${l.lessonId}...`);
    try {
      execSync(`curl.exe -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${url}" -o "${filePath}"`);
      const html = fs.readFileSync(filePath, 'utf8');

      const pushes = [...html.matchAll(/self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g)].map(m => m[1]);
      const unescaped = unescapeStr(pushes.join('\n'));

      // Extract data-search
      const dataSearchMatches = [...unescaped.matchAll(/"data-search":\s*"([^"]+)"/g)].map(m => m[1]);
      console.log(`  -> Found ${dataSearchMatches.length} items in ${l.lessonId}`);

      dataSearchMatches.forEach((ds, idx) => {
        const parts = ds.trim().split(/\s+/);
        // Case A: Kanji character item: e.g. "私 TƯ Tôi, riêng tư シ わたし わたくし"
        // First token is single Kanji, second token is ALL CAPS (Hán-Việt)
        if (parts.length >= 3 && /^[\u4e00-\u9faf]$/.test(parts[0]) && /^[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]+$/.test(parts[1])) {
          allKanjiChars.push({
            kanji: parts[0],
            hanViet: parts[1],
            course: l.course,
            lessonId: l.lessonId,
            bai: l.bai,
            raw: ds
          });
        }
        // Case B: Kanji vocabulary word: e.g. "あの人 あのひと anohito Người kia" or "私 わたし watashi Tôi"
        else if (parts.length >= 4) {
          const rawWord = parts[0];
          const rawKana = parts[1];
          const rawRomaji = parts[2];
          const meaning = parts.slice(3).join(' ');

          allHantuVocab.push({
            word: rawWord,
            kana: rawKana,
            romaji: rawRomaji,
            meaning: meaning,
            course: l.course,
            lessonId: l.lessonId,
            bai: l.bai,
            hasKanji: /[\u4e00-\u9faf]/.test(rawWord)
          });
        }
      });
    } catch(e) {
      console.error(`  Error in ${l.lessonId}:`, e.message);
    }
  }

  console.log(`\nTotal Kanji chars found: ${allKanjiChars.length}`);
  console.log(`Total Kanji vocabulary items found: ${allHantuVocab.length}`);

  fs.writeFileSync(path.join(__dirname, '../data/manabi_hantu_extracted.json'), JSON.stringify({
    kanjiChars: allKanjiChars,
    vocabWords: allHantuVocab
  }, null, 2), 'utf8');
}

scrapeHantu();
