const fs = require('fs');
const path = require('path');

const vocabData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/vocabulary.json'), 'utf8'));

// Additional essential vocabulary for JPD113, JPD123, JPD133
const additionalWords = [
  // JPD113 (Nhật 1)
  { id: 'jpd113-extra-1', word: 'おはようございます', kana: 'おはようございます', romaji: 'ohayou gozaimasu', meaning: 'Chào buổi sáng (lịch sự)', course: 'jpd113', unitId: 'jpd113-v1-1', unitTitle: 'Giới thiệu bản thân', unitTag: '1-1' },
  { id: 'jpd113-extra-2', word: 'こんにちは', kana: 'こんにちは', romaji: 'konnichiwa', meaning: 'Chào buổi trưa / Xin chào', course: 'jpd113', unitId: 'jpd113-v1-1', unitTitle: 'Giới thiệu bản thân', unitTag: '1-1' },
  { id: 'jpd113-extra-3', word: 'こんばんは', kana: 'こんばんは', romaji: 'konbanwa', meaning: 'Chào buổi tối', course: 'jpd113', unitId: 'jpd113-v1-1', unitTitle: 'Giới thiệu bản thân', unitTag: '1-1' },
  { id: 'jpd113-extra-4', word: 'はじめまして', kana: 'はじめまして', romaji: 'hajimemashite', meaning: 'Rất vui được gặp bạn lần đầu', course: 'jpd113', unitId: 'jpd113-v1-1', unitTitle: 'Giới thiệu bản thân', unitTag: '1-1' },
  { id: 'jpd113-extra-5', word: 'どうぞよろしく', kana: 'どうぞよろしく', romaji: 'douzo yoroshiku', meaning: 'Xin nhờ bạn giúp đỡ', course: 'jpd113', unitId: 'jpd113-v1-1', unitTitle: 'Giới thiệu bản thân', unitTag: '1-1' },
  { id: 'jpd113-extra-6', word: 'ベトナム', kana: 'ベトナム', romaji: 'betonamu', meaning: 'Việt Nam', course: 'jpd113', unitId: 'jpd113-v1-1', unitTitle: 'Giới thiệu bản thân', unitTag: '1-1' },
  { id: 'jpd113-extra-7', word: 'エンジニア', kana: 'エンジニア', romaji: 'enjinia', meaning: 'Kỹ sư công nghệ', course: 'jpd113', unitId: 'jpd113-v1-1', unitTitle: 'Giới thiệu bản thân', unitTag: '1-1' },
  { id: 'jpd113-extra-8', word: 'ペン', kana: 'ペン', romaji: 'pen', meaning: 'Bút mực', course: 'jpd113', unitId: 'jpd113-v2-1', unitTitle: 'Đồ vật và số đếm', unitTag: '2-1' },
  { id: 'jpd113-extra-9', word: 'ノート', kana: 'ノート', romaji: 'nooto', meaning: 'Vở ghi bài', course: 'jpd113', unitId: 'jpd113-v2-1', unitTitle: 'Đồ vật và số đếm', unitTag: '2-1' },
  { id: 'jpd113-extra-10', word: '時計', kana: 'とけい', romaji: 'tokei', meaning: 'Đồng hồ', course: 'jpd113', unitId: 'jpd113-v2-1', unitTitle: 'Đồ vật và số đếm', unitTag: '2-1' },
  { id: 'jpd113-extra-11', word: '傘', kana: 'かさ', romaji: 'kasa', meaning: 'Cái ô, cây dù', course: 'jpd113', unitId: 'jpd113-v2-1', unitTitle: 'Đồ vật và số đếm', unitTag: '2-1' },
  { id: 'jpd113-extra-12', word: '鞄', kana: 'かばん', romaji: 'kaban', meaning: 'Cặp sách, túi xách', course: 'jpd113', unitId: 'jpd113-v2-1', unitTitle: 'Đồ vật và số đếm', unitTag: '2-1' },
  { id: 'jpd113-extra-13', word: '今日', kana: 'きょう', romaji: 'kyou', meaning: 'Hôm nay', course: 'jpd113', unitId: 'jpd113-v3-1', unitTitle: 'Thời gian và ngày', unitTag: '3-1' },
  { id: 'jpd113-extra-14', word: '明日', kana: 'あした', romaji: 'ashita', meaning: 'Ngày mai', course: 'jpd113', unitId: 'jpd113-v3-1', unitTitle: 'Thời gian và ngày', unitTag: '3-1' },
  { id: 'jpd113-extra-15', word: '昨日', kana: 'きのう', romaji: 'kinou', meaning: 'Hôm qua', course: 'jpd113', unitId: 'jpd113-v3-1', unitTitle: 'Thời gian và ngày', unitTag: '3-1' },
  { id: 'jpd113-extra-16', word: '今', kana: 'いま', romaji: 'ima', meaning: 'Bây giờ', course: 'jpd113', unitId: 'jpd113-v3-1', unitTitle: 'Thời gian và ngày', unitTag: '3-1' },
  { id: 'jpd113-extra-17', word: '朝', kana: 'あさ', romaji: 'asa', meaning: 'Buổi sáng', course: 'jpd113', unitId: 'jpd113-v3-1', unitTitle: 'Thời gian và ngày', unitTag: '3-1' },
  { id: 'jpd113-extra-18', word: '昼', kana: 'ひる', romaji: 'hiru', meaning: 'Buổi trưa', course: 'jpd113', unitId: 'jpd113-v3-1', unitTitle: 'Thời gian và ngày', unitTag: '3-1' },
  { id: 'jpd113-extra-19', word: '晩', kana: 'ばん', romaji: 'ban', meaning: 'Buổi tối', course: 'jpd113', unitId: 'jpd113-v3-1', unitTitle: 'Thời gian và ngày', unitTag: '3-1' },

  // JPD123 (Nhật 2)
  { id: 'jpd123-extra-1', word: '歌', kana: 'うた', romaji: 'uta', meaning: 'Bài hát', course: 'jpd123', unitId: 'jpd123-v6-1', unitTitle: 'Sở thích cá nhân', unitTag: '6-1' },
  { id: 'jpd123-extra-2', word: '映画', kana: 'えいが', romaji: 'eiga', meaning: 'Phim ảnh', course: 'jpd123', unitId: 'jpd123-v6-1', unitTitle: 'Sở thích cá nhân', unitTag: '6-1' },
  { id: 'jpd123-extra-3', word: '音楽', kana: 'おんがく', romaji: 'ongaku', meaning: 'Âm nhạc', course: 'jpd123', unitId: 'jpd123-v6-1', unitTitle: 'Sở thích cá nhân', unitTag: '6-1' },
  { id: 'jpd123-extra-4', word: '水泳', kana: 'すいえい', romaji: 'suiei', meaning: 'Bơi lội', course: 'jpd123', unitId: 'jpd123-v6-1', unitTitle: 'Sở thích cá nhân', unitTag: '6-1' },
  { id: 'jpd123-extra-5', word: '写真', kana: 'しゃしん', romaji: 'shashin', meaning: 'Bức ảnh, chụp ảnh', course: 'jpd123', unitId: 'jpd123-v6-1', unitTitle: 'Sở thích cá nhân', unitTag: '6-1' },
  { id: 'jpd123-extra-6', word: '旅行', kana: 'りょこう', romaji: 'ryokou', meaning: 'Du lịch', course: 'jpd123', unitId: 'jpd123-v6-1', unitTitle: 'Sở thích cá nhân', unitTag: '6-1' },
  { id: 'jpd123-extra-7', word: '料理', kana: 'りょうり', romaji: 'ryouri', meaning: 'Nấu ăn, món ăn', course: 'jpd123', unitId: 'jpd123-v6-1', unitTitle: 'Sở thích cá nhân', unitTag: '6-1' },
  { id: 'jpd123-extra-8', word: '歩く', kana: 'あるく', romaji: 'aruku', meaning: 'Đi bộ', course: 'jpd123', unitId: 'jpd123-v7-1', unitTitle: 'Hành động và thể Te', unitTag: '7-1' },
  { id: 'jpd123-extra-9', word: '待つ', kana: 'まつ', romaji: 'matsu', meaning: 'Chờ đợi', course: 'jpd123', unitId: 'jpd123-v7-1', unitTitle: 'Hành động và thể Te', unitTag: '7-1' },
  { id: 'jpd123-extra-10', word: '急ぐ', kana: 'いそぐ', romaji: 'isogu', meaning: 'Vội vã, gấp gáp', course: 'jpd123', unitId: 'jpd123-v7-1', unitTitle: 'Hành động và thể Te', unitTag: '7-1' },
  { id: 'jpd123-extra-11', word: '手伝う', kana: 'てつだう', romaji: 'tetsudau', meaning: 'Giúp đỡ', course: 'jpd123', unitId: 'jpd123-v7-1', unitTitle: 'Hành động và thể Te', unitTag: '7-1' },
  { id: 'jpd123-extra-12', word: '開ける', kana: 'あける', romaji: 'akeru', meaning: 'Mở (cửa/sổ)', course: 'jpd123', unitId: 'jpd123-v7-1', unitTitle: 'Hành động và thể Te', unitTag: '7-1' },
  { id: 'jpd123-extra-13', word: '閉める', kana: 'しめる', romaji: 'shimeru', meaning: 'Đóng (cửa)', course: 'jpd123', unitId: 'jpd123-v7-1', unitTitle: 'Hành động và thể Te', unitTag: '7-1' },
  { id: 'jpd123-extra-14', word: 'つける', kana: 'つける', romaji: 'tsukeru', meaning: 'Bật (đèn/điều hòa)', course: 'jpd123', unitId: 'jpd123-v7-1', unitTitle: 'Hành động và thể Te', unitTag: '7-1' },
  { id: 'jpd123-extra-15', word: '消す', kana: 'けす', romaji: 'kesu', meaning: 'Tắt (điện/máy móc)', course: 'jpd123', unitId: 'jpd123-v7-1', unitTitle: 'Hành động và thể Te', unitTag: '7-1' },
  { id: 'jpd123-extra-16', word: '病院', kana: 'びょういん', romaji: 'byouin', meaning: 'Bệnh viện', course: 'jpd123', unitId: 'jpd123-v9-1', unitTitle: 'Thể Nai và sức khỏe', unitTag: '9-1' },
  { id: 'jpd123-extra-17', word: '薬', kana: 'くすり', romaji: 'kusuri', meaning: 'Thuốc uống', course: 'jpd123', unitId: 'jpd123-v9-1', unitTitle: 'Thể Nai và sức khỏe', unitTag: '9-1' },
  { id: 'jpd123-extra-18', word: '熱', kana: 'ねつ', romaji: 'netsu', meaning: 'Sốt, cơn sốt', course: 'jpd123', unitId: 'jpd123-v9-1', unitTitle: 'Thể Nai và sức khỏe', unitTag: '9-1' },
  { id: 'jpd123-extra-19', word: '痛い', kana: 'いたい', romaji: 'itai', meaning: 'Đau đớn', course: 'jpd123', unitId: 'jpd123-v9-1', unitTitle: 'Thể Nai và sức khỏe', unitTag: '9-1' },

  // JPD133 (Nhật 3)
  { id: 'jpd133-extra-1', word: '意見', kana: 'いけん', romaji: 'iken', meaning: 'Ý kiến, quan điểm', course: 'jpd133', unitId: 'jpd133-v12-1', unitTitle: 'Bày tỏ ý kiến', unitTag: '12-1' },
  { id: 'jpd133-extra-2', word: '本当', kana: 'ほんとう', romaji: 'hontou', meaning: 'Thật sự, sự thật', course: 'jpd133', unitId: 'jpd133-v12-1', unitTitle: 'Bày tỏ ý kiến', unitTag: '12-1' },
  { id: 'jpd133-extra-3', word: '嘘', kana: 'うそ', romaji: 'uso', meaning: 'Lời nói dối', course: 'jpd133', unitId: 'jpd133-v12-1', unitTitle: 'Bày tỏ ý kiến', unitTag: '12-1' },
  { id: 'jpd133-extra-4', word: 'ニュース', kana: 'ニュース', romaji: 'nyuusu', meaning: 'Tin tức, thời sự', course: 'jpd133', unitId: 'jpd133-v12-1', unitTitle: 'Bày tỏ ý kiến', unitTag: '12-1' },
  { id: 'jpd133-extra-5', word: '首相', kana: 'しゅしょう', romaji: 'shushou', meaning: 'Thủ tướng', course: 'jpd133', unitId: 'jpd133-v12-1', unitTitle: 'Bày tỏ ý kiến', unitTag: '12-1' },
  { id: 'jpd133-extra-6', word: '大統領', kana: 'だいとうりょう', romaji: 'daitouryou', meaning: 'Tổng thống', course: 'jpd133', unitId: 'jpd133-v12-1', unitTitle: 'Bày tỏ ý kiến', unitTag: '12-1' },
  { id: 'jpd133-extra-7', word: '交通', kana: 'こうつう', romaji: 'koutsuu', meaning: 'Giao thông', course: 'jpd133', unitId: 'jpd133-v12-1', unitTitle: 'Bày tỏ ý kiến', unitTag: '12-1' },
  { id: 'jpd133-extra-8', word: '物価', kana: 'ぶっか', romaji: 'bukka', meaning: 'Giá cả thị trường', course: 'jpd133', unitId: 'jpd133-v12-1', unitTitle: 'Bày tỏ ý kiến', unitTag: '12-1' },
  { id: 'jpd133-extra-9', word: '便利', kana: 'べんり', romaji: 'benri', meaning: 'Tiện lợi (Tính từ な)', course: 'jpd133', unitId: 'jpd133-v13-1', unitTitle: 'Định ngữ và bổ nghĩa', unitTag: '13-1' },
  { id: 'jpd133-extra-10', word: '不便', kana: 'ふべん', romaji: 'fuben', meaning: 'Bất tiện', course: 'jpd133', unitId: 'jpd133-v13-1', unitTitle: 'Định ngữ và bổ nghĩa', unitTag: '13-1' },
  { id: 'jpd133-extra-11', word: '経験', kana: 'けいけん', romaji: 'keiken', meaning: 'Kinh nghiệm sống/làm việc', course: 'jpd133', unitId: 'jpd133-v14-1', unitTitle: 'Điều kiện và trải nghiệm', unitTag: '14-1' },
  { id: 'jpd133-extra-12', word: '将来', kana: 'しょうらい', romaji: 'shourai', meaning: 'Tương lai', course: 'jpd133', unitId: 'jpd133-v14-1', unitTitle: 'Điều kiện và trải nghiệm', unitTag: '14-1' },
  { id: 'jpd133-extra-13', word: '社長', kana: 'しゃちょう', romaji: 'shachou', meaning: 'Giám đốc công ty', course: 'jpd133', unitId: 'jpd133-v15-1', unitTitle: 'Kính ngữ doanh nghiệp', unitTag: '15-1' },
  { id: 'jpd133-extra-14', word: '部長', kana: 'ぶちょう', romaji: 'buchou', meaning: 'Trưởng phòng', course: 'jpd133', unitId: 'jpd133-v15-1', unitTitle: 'Kính ngữ doanh nghiệp', unitTag: '15-1' },
  { id: 'jpd133-extra-15', word: 'お客様', kana: 'おきゃくさま', romaji: 'okyakusama', meaning: 'Quý khách hàng', course: 'jpd133', unitId: 'jpd133-v15-1', unitTitle: 'Kính ngữ doanh nghiệp', unitTag: '15-1' },
  { id: 'jpd133-extra-16', word: 'おっしゃる', kana: 'おっしゃる', romaji: 'ossharu', meaning: 'Nói (Kính trọng ngữ của 言う)', course: 'jpd133', unitId: 'jpd133-v15-1', unitTitle: 'Kính ngữ doanh nghiệp', unitTag: '15-1' },
  { id: 'jpd133-extra-17', word: 'いらっしゃる', kana: 'いらっしゃる', romaji: 'irassharu', meaning: 'Đi/Đến/Ở (Kính trọng ngữ)', course: 'jpd133', unitId: 'jpd133-v15-1', unitTitle: 'Kính ngữ doanh nghiệp', unitTag: '15-1' },
  { id: 'jpd133-extra-18', word: '召し上がる', kana: 'めしあがる', romaji: 'meshiagaru', meaning: 'Ăn/Uống (Kính trọng ngữ)', course: 'jpd133', unitId: 'jpd133-v15-1', unitTitle: 'Kính ngữ doanh nghiệp', unitTag: '15-1' },
  { id: 'jpd133-extra-19', word: '参る', kana: 'まいる', romaji: 'mairu', meaning: 'Đi/Đến (Khiêm nhường ngữ của 行く/来る)', course: 'jpd133', unitId: 'jpd133-v15-1', unitTitle: 'Kính ngữ doanh nghiệp', unitTag: '15-1' },
  { id: 'jpd133-extra-20', word: '申す', kana: 'もうす', romaji: 'mousu', meaning: 'Tên là, nói là (Khiêm nhường ngữ)', course: 'jpd133', unitId: 'jpd133-v15-1', unitTitle: 'Kính ngữ doanh nghiệp', unitTag: '15-1' }
];

// Add unique words to vocabulary
const existingIds = new Set(vocabData.words.map(w => w.id));
additionalWords.forEach(w => {
  if (!existingIds.has(w.id)) {
    vocabData.words.push(w);
  }
});

fs.writeFileSync(
  path.join(__dirname, '../data/vocabulary.json'),
  JSON.stringify(vocabData, null, 2),
  'utf8'
);

console.log('Enriched data/vocabulary.json to total:', vocabData.words.length, 'words!');
