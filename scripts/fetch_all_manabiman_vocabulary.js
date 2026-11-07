const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const units = [
  // JPD113
  { course: 'jpd113', unitId: 'jpd113-v1-1', tag: '1-1', title: 'Giới thiệu bản thân' },
  { course: 'jpd113', unitId: 'jpd113-v1-2-1', tag: '1-2(1)', title: 'Đếm tháng và tuổi' },
  { course: 'jpd113', unitId: 'jpd113-v1-2-2', tag: '1-2(2)', title: 'Đếm ngày và mùng' },
  { course: 'jpd113', unitId: 'jpd113-v1-3', tag: '1-3', title: 'Sở thích cá nhân' },
  { course: 'jpd113', unitId: 'jpd113-v2-1', tag: '2-1', title: 'Địa điểm mua sắm' },
  { course: 'jpd113', unitId: 'jpd113-v2-2-1', tag: '2-2(1)', title: 'Đồ vật và số đếm' },
  { course: 'jpd113', unitId: 'jpd113-v2-2-2', tag: '2-2(2)', title: 'Giá cả và số lớn' },
  { course: 'jpd113', unitId: 'jpd113-v2-3', tag: '2-3', title: 'Đồ ăn và gọi món' },
  { course: 'jpd113', unitId: 'jpd113-v3-1', tag: '3-1', title: 'Thời gian và địa điểm' },
  { course: 'jpd113', unitId: 'jpd113-v3-2', tag: '3-2', title: 'Hoạt động và 4 mùa' },
  { course: 'jpd113', unitId: 'jpd113-v3-3', tag: '3-3', title: 'Sinh hoạt hằng ngày' },

  // JPD123
  { course: 'jpd123', unitId: 'jpd123-v4-1', tag: '4-1', title: 'Phương hướng và phương tiện' },
  { course: 'jpd123', unitId: 'jpd123-v4-2', tag: '4-2', title: 'Địa điểm và tính từ' },
  { course: 'jpd123', unitId: 'jpd123-v4-3', tag: '4-3', title: 'Thời tiết và vị giác' },
  { course: 'jpd123', unitId: 'jpd123-v5-1', tag: '5-1', title: 'Mốc thời gian và hoạt động' },
  { course: 'jpd123', unitId: 'jpd123-v5-2', tag: '5-2', title: 'Cảm xúc và sở thích' },
  { course: 'jpd123', unitId: 'jpd123-v5-3', tag: '5-3', title: 'Mong muốn và ước mơ' },
  { course: 'jpd123', unitId: 'jpd123-v6-1', tag: '6-1', title: 'Kế hoạch và rủ rê' },
  { course: 'jpd123', unitId: 'jpd123-v6-2', tag: '6-2', title: 'So sánh và lựa chọn' },
  { course: 'jpd123', unitId: 'jpd123-v6-3', tag: '6-3', title: 'Ẩm thực truyền thống Nhật' },
  { course: 'jpd123', unitId: 'jpd123-v7-1', tag: '7-1', title: 'Vị trí của người và vật' },
  { course: 'jpd123', unitId: 'jpd123-v7-2', tag: '7-2', title: 'Đồ dùng và hành động' },
  { course: 'jpd123', unitId: 'jpd123-v7-3', tag: '7-3', title: 'Sinh hoạt gia đình' },

  // JPD133
  { course: 'jpd133', unitId: 'jpd133-v8-1', tag: '8-1', title: 'Gia đình và đếm người' },
  { course: 'jpd133', unitId: 'jpd133-v8-2', tag: '8-2', title: 'Ngoại hình và tính cách' },
  { course: 'jpd133', unitId: 'jpd133-v8-3', tag: '8-3', title: 'Cho và nhận đồ vật' },
  { course: 'jpd133', unitId: 'jpd133-v9-1', tag: '9-1', title: 'Đơn vị đếm đồ vật' },
  { course: 'jpd133', unitId: 'jpd133-v9-2', tag: '9-2', title: 'Câu lạc bộ và thể thao' },
  { course: 'jpd133', unitId: 'jpd133-v9-3', tag: '9-3', title: 'Thủ tục và giấy tờ' },
  { course: 'jpd133', unitId: 'jpd133-v10-1', tag: '10-1', title: 'Chỉ đường tại ngã tư' },
  { course: 'jpd133', unitId: 'jpd133-v10-2', tag: '10-2', title: 'Nhờ vả và dặn dò' },
  { course: 'jpd133', unitId: 'jpd133-v10-3', tag: '10-3', title: 'Cảm giác và sức khoẻ' },
  { course: 'jpd133', unitId: 'jpd133-v11-1', tag: '11-1', title: 'Học tập và ôn thi' },
  { course: 'jpd133', unitId: 'jpd133-v11-2', tag: '11-2', title: 'Cột mốc cuộc đời' },
  { course: 'jpd133', unitId: 'jpd133-v11-3', tag: '11-3', title: 'Thiết bị và chuyển nhà' }
];

const tempDir = path.join(__dirname, '../data/manabiman_raw');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

function unescapeStr(str) {
  try {
    return JSON.parse('"' + str + '"');
  } catch(e) {
    return str.replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }
}

async function scrapeAll() {
  console.log(`Starting to scrape all ${units.length} units from Manabiman...`);
  const allExtractedWords = [];

  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    const url = `https://manabiman.io.vn/tu-vung/${u.course}/${u.unitId}`;
    const filePath = path.join(tempDir, `${u.unitId}.html`);

    console.log(`[${i + 1}/${units.length}] Fetching ${u.unitId}...`);
    try {
      execSync(`curl.exe -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${url}" -o "${filePath}"`);
      const html = fs.readFileSync(filePath, 'utf8');

      // Extract self.__next_f pushes
      const pushes = [...html.matchAll(/self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g)].map(m => m[1]);
      const unescaped = unescapeStr(pushes.join('\n'));

      // Extract each data-search attribute
      // Pattern: "data-search":"<word> <kana> <romaji> <meaning> "
      const dataSearchMatches = [...unescaped.matchAll(/"data-search":\s*"([^"]+)"/g)].map(m => m[1]);
      
      // Also extract the list of meanings from paragraph children
      const pMatches = [...unescaped.matchAll(/\["\$","p",null,\{"className":"mt-1\.5 text-sm leading-relaxed text-ink-2","children":"([^"]+)"\}\]/g)].map(m => m[1]);

      console.log(`  -> Found ${dataSearchMatches.length} words in ${u.unitId}`);

      dataSearchMatches.forEach((ds, idx) => {
        const parts = ds.trim().split(/\s+/);
        if (parts.length >= 3) {
          const rawWord = parts[0];
          const rawKana = parts[1];
          const rawRomaji = parts[2];
          // Meaning from pMatches if available, else remaining parts of data-search
          let meaning = (pMatches[idx] || parts.slice(3).join(' ')).trim();
          if (!meaning) meaning = parts.slice(3).join(' ');

          allExtractedWords.push({
            id: `manabi-${u.unitId}-${idx + 1}`,
            word: rawWord,
            kana: rawKana,
            romaji: rawRomaji,
            meaning: meaning,
            course: u.course,
            unitId: u.unitId,
            unitTitle: u.title,
            unitTag: u.tag
          });
        }
      });
    } catch(err) {
      console.error(`  Error in ${u.unitId}:`, err.message);
    }
  }

  console.log(`\nTotal extracted words from Manabiman: ${allExtractedWords.length}`);
  fs.writeFileSync(path.join(__dirname, '../data/manabiman_extracted_words.json'), JSON.stringify(allExtractedWords, null, 2), 'utf8');

  // Verify per-unit word counts
  const countMap = {};
  allExtractedWords.forEach(w => {
    countMap[w.unitId] = (countMap[w.unitId] || 0) + 1;
  });
  console.table(Object.entries(countMap).map(([k, count]) => ({ unitId: k, count })));
}

scrapeAll();
