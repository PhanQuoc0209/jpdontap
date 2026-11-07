const fs = require('fs');
const path = require('path');

const vocabFile = path.join(__dirname, '../data/vocabulary.json');
const currentData = JSON.parse(fs.readFileSync(vocabFile, 'utf8'));

const jpd123Extensions = {
  'jpd123-v4-1': [
    { word: '飛行機', kana: 'ひこうき', romaji: 'hikouki', meaning: 'Máy bay' },
    { word: '船', kana: 'ふね', romaji: 'fune', meaning: 'Thuyền, tàu thủy' },
    { word: 'タクシー', kana: 'タクシー', romaji: 'takushii', meaning: 'Xe taxi' },
    { word: 'バス', kana: 'バス', romaji: 'basu', meaning: 'Xe buýt' },
    { word: '自転車', kana: 'じてんしゃ', romaji: 'jitensha', meaning: 'Xe đạp' },
    { word: '歩いて', kana: 'あるいて', romaji: 'aruite', meaning: 'Đi bộ' },
    { word: '人', kana: 'ひと', romaji: 'hito', meaning: 'Người' },
    { word: '友達', kana: 'ともだち', romaji: 'tomodachi', meaning: 'Bạn bè' },
    { word: '彼', kana: 'かれ', romaji: 'kare', meaning: 'Anh ấy, bạn trai' },
    { word: '彼女', kana: 'かのじょ', romaji: 'kanojo', meaning: 'Cô ấy, bạn gái' },
    { word: '家族', kana: 'かぞく', romaji: 'kazoku', meaning: 'Gia đình' },
    { word: '一人で', kana: 'ひとりで', romaji: 'hitoride', meaning: 'Một mình' }
  ],
  'jpd123-v4-2': [
    { word: 'きれい', kana: 'きれい', romaji: 'kirei', meaning: 'Đẹp, sạch sẽ (Tính từ な)' },
    { word: '静か', kana: 'しずか', romaji: 'shizuka', meaning: 'Yên tĩnh' },
    { word: 'にぎやか', kana: 'にぎやか', romaji: 'nigiyaka', meaning: 'Náo nhiệt, sôi động' },
    { word: '有名', kana: 'ゆうめい', romaji: 'yuumei', meaning: 'Nổi tiếng' },
    { word: '親切', kana: 'しんせつ', romaji: 'shinsetsu', meaning: 'Thân thiện, tốt bụng' },
    { word: '元気', kana: 'げんき', romaji: 'genki', meaning: 'Khỏe mạnh' },
    { word: '暇', kana: 'ひま', romaji: 'hima', meaning: 'Rảnh rỗi' },
    { word: '便利', kana: 'べんり', romaji: 'benri', meaning: 'Tiện lợi' },
    { word: 'すてき', kana: 'すてき', romaji: 'suteki', meaning: 'Tuyệt vời, đẹp đẽ' }
  ],
  'jpd123-v4-3': [
    { word: '大きい', kana: 'おおきい', romaji: 'ookii', meaning: 'To lớn' },
    { word: '小さい', kana: 'ちいさい', romaji: 'chiisai', meaning: 'Nhỏ bé' },
    { word: '新しい', kana: 'あたらしい', romaji: 'atarashii', meaning: 'Mới' },
    { word: '古い', kana: 'ふるい', romaji: 'furui', meaning: 'Cũ' },
    { word: 'いい / よい', kana: 'いい / よい', romaji: 'ii / yoi', meaning: 'Tốt' },
    { word: '悪い', kana: 'わるい', romaji: 'warui', meaning: 'Xấu, tồi' },
    { word: '熱い', kana: 'あつい', romaji: 'atsui', meaning: 'Nóng (thức ăn / đồ vật)' },
    { word: '冷たい', kana: 'つめたい', romaji: 'tsumetai', meaning: 'Lạnh (nước / cảm giác)' },
    { word: '難しい', kana: 'むずかしい', romaji: 'muzukashii', meaning: 'Khó' },
    { word: '易しい', kana: 'やさしい', romaji: 'yasashii', meaning: 'Dễ' },
    { word: 'おいしい', kana: 'おいしい', romaji: 'oishii', meaning: 'Ngon miệng' },
    { word: 'まずい', kana: 'まずい', romaji: 'mazui', meaning: 'Dở, không ngon' }
  ],
  'jpd123-v5-1': [
    { word: '先週', kana: 'せんしゅう', romaji: 'senshuu', meaning: 'Tuần trước' },
    { word: '今週', kana: 'こんしゅう', romaji: 'konshuu', meaning: 'Tuần này' },
    { word: '来週', kana: 'らいしゅう', romaji: 'raishuu', meaning: 'Tuần tới' },
    { word: '先月', kana: 'せんげつ', romaji: 'sengetsu', meaning: 'Tháng trước' },
    { word: '今月', kana: 'こんげつ', romaji: 'kongetsu', meaning: 'Tháng này' },
    { word: '来月', kana: 'らいげつ', romaji: 'raigetsu', meaning: 'Tháng tới' },
    { word: '去年', kana: 'きょねん', romaji: 'kyonen', meaning: 'Năm ngoái' },
    { word: '今年', kana: 'ことし', romaji: 'kotoshi', meaning: 'Năm nay' },
    { word: '来年', kana: 'らいねん', romaji: 'rainen', meaning: 'Năm sau' }
  ],
  'jpd123-v5-2': [
    { word: '楽しい', kana: 'たのしい', romaji: 'tanoshii', meaning: 'Vui vẻ' },
    { word: '面白い', kana: 'おもしろい', romaji: 'omoshiroi', meaning: 'Thú vị' },
    { word: 'つまらない', kana: 'つまらない', romaji: 'tsumaranai', meaning: 'Nhàm chán' },
    { word: '忙しい', kana: 'いそがしい', romaji: 'isogashii', meaning: 'Bận rộn' },
    { word: '白い', kana: 'しろい', romaji: 'shiroi', meaning: 'Màu trắng' },
    { word: '黒い', kana: 'くろい', romaji: 'kuroi', meaning: 'Màu đen' },
    { word: '赤い', kana: 'あかい', romaji: 'akai', meaning: 'Màu đỏ' },
    { word: '青い', kana: 'あおい', romaji: 'aoi', meaning: 'Màu xanh da trời' }
  ],
  'jpd123-v6-1': [
    { word: '山', kana: 'やま', romaji: 'yama', meaning: 'Ngọn núi' },
    { word: '町', kana: 'まち', romaji: 'machi', meaning: 'Thị trấn, thành phố' },
    { word: '食べ物', kana: 'たべもの', romaji: 'tabemono', meaning: 'Đồ ăn' },
    { word: '飲み物', kana: 'のみもの', romaji: 'nomimono', meaning: 'Đồ uống' },
    { word: '車', kana: 'くるま', romaji: 'kuruma', meaning: 'Xe hơi' },
    { word: '所', kana: 'ところ', romaji: 'tokoro', meaning: 'Nơi chốn' },
    { word: '寮', kana: 'りょう', romaji: 'ryou', meaning: 'Ký túc xá' },
    { word: 'レストラン', kana: 'レストラン', romaji: 'resutoran', meaning: 'Nhà hàng' },
    { word: '生活', kana: 'せいかつ', romaji: 'seikatsu', meaning: 'Cuộc sống' },
    { word: '仕事', kana: 'しごと', romaji: 'shigoto', meaning: 'Công việc' }
  ],
  'jpd123-v7-1': [
    { word: '上', kana: 'うえ', romaji: 'ue', meaning: 'Phía trên' },
    { word: '下', kana: 'した', romaji: 'shita', meaning: 'Phía dưới' },
    { word: '前', kana: 'まえ', romaji: 'mae', meaning: 'Phía trước' },
    { word: '後ろ', kana: 'うしろ', romaji: 'ushiro', meaning: 'Phía sau' },
    { word: '右', kana: 'みぎ', romaji: 'migi', meaning: 'Bên phải' },
    { word: '左', kana: 'ひだり', romaji: 'hidari', meaning: 'Bên trái' },
    { word: '中', kana: 'なか', romaji: 'naka', meaning: 'Bên trong' },
    { word: '外', kana: 'そと', romaji: 'soto', meaning: 'Bên ngoài' },
    { word: '隣', kana: 'となり', romaji: 'tonari', meaning: 'Bên cạnh (cùng loại)' },
    { word: '近く', kana: 'ちかく', romaji: 'chikaku', meaning: 'Gần đây' },
    { word: '間', kana: 'あいだ', romaji: 'aida', meaning: 'Ở giữa (A và B)' }
  ]
};

let addedCount = 0;
const existingWordMap = new Set(currentData.words.map(w => `${w.unitId}::${w.word}`));

Object.entries(jpd123Extensions).forEach(([unitId, words]) => {
  const unitObj = currentData.units.find(u => u.id === unitId);
  if (!unitObj) return;

  words.forEach((w, idx) => {
    const key = `${unitId}::${w.word}`;
    if (!existingWordMap.has(key)) {
      currentData.words.push({
        id: `${unitId}-exp2-${idx + 1}`,
        word: w.word,
        kana: w.kana,
        romaji: w.romaji,
        meaning: w.meaning,
        course: unitObj.course,
        unitId: unitObj.id,
        unitTitle: unitObj.title,
        unitTag: unitObj.tag
      });
      existingWordMap.add(key);
      addedCount++;
    }
  });
});

fs.writeFileSync(vocabFile, JSON.stringify(currentData, null, 2), 'utf8');
console.log('Added', addedCount, 'words to JPD123. Total words now:', currentData.words.length);
