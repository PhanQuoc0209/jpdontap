const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');

// Load sample vocab 1.1
let vocab11 = [];
if (fs.existsSync(path.join(dataDir, 'vocab_1_1.json'))) {
  vocab11 = JSON.parse(fs.readFileSync(path.join(dataDir, 'vocab_1_1.json'), 'utf8'));
}

// Full courses and units definition
const unitsMeta = [
  // JPD113
  { id: 'jpd113-v1-1', course: 'jpd113', tag: '1-1', title: 'Giới thiệu bản thân', desc: 'Chào hỏi và giới thiệu bản thân cơ bản' },
  { id: 'jpd113-v1-2-1', course: 'jpd113', tag: '1-2(1)', title: 'Đếm tháng và tuổi', desc: 'Cách đếm tháng và nói tuổi' },
  { id: 'jpd113-v1-2-2', course: 'jpd113', tag: '1-2(2)', title: 'Đếm ngày và mùng', desc: 'Các từ vựng đếm ngày và mùng đặc biệt' },
  { id: 'jpd113-v1-3', course: 'jpd113', tag: '1-3', title: 'Sở thích cá nhân', desc: 'Nói về sở thích và hoạt động giải trí' },
  { id: 'jpd113-v2-1', course: 'jpd113', tag: '2-1', title: 'Địa điểm mua sắm', desc: 'Các địa điểm và đồ vật trong khu thương mại' },
  { id: 'jpd113-v2-2-1', course: 'jpd113', tag: '2-2(1)', title: 'Đồ vật và số đếm', desc: 'Đồ dùng học tập và số đếm hàng trăm, nghìn' },
  { id: 'jpd113-v2-2-2', course: 'jpd113', tag: '2-2(2)', title: 'Giá cả và số lớn', desc: 'Hỏi giá tiền và đồ vật công nghệ' },
  { id: 'jpd113-v2-3', course: 'jpd113', tag: '2-3', title: 'Đồ ăn và gọi món', desc: 'Gọi món tại nhà hàng và đồ uống' },
  { id: 'jpd113-v3-1', course: 'jpd113', tag: '3-1', title: 'Thời gian và địa điểm', desc: 'Hỏi giờ giấc và địa điểm công cộng' },
  { id: 'jpd113-v3-2', course: 'jpd113', tag: '3-2', title: 'Hoạt động và 4 mùa', desc: 'Bốn mùa và động từ di chuyển cơ bản' },
  { id: 'jpd113-v3-3', course: 'jpd113', tag: '3-3', title: 'Sinh hoạt hằng ngày', desc: 'Các hoạt động thường nhật và thời gian biểu' },

  // JPD123
  { id: 'jpd123-v4-1', course: 'jpd123', tag: '4-1', title: 'Phương hướng và phương tiện', desc: 'Phương hướng và các phương tiện giao thông' },
  { id: 'jpd123-v4-2', course: 'jpd123', tag: '4-2', title: 'Địa điểm và tính từ', desc: 'Miêu tả địa điểm bằng các cặp tính từ đối lập' },
  { id: 'jpd123-v4-3', course: 'jpd123', tag: '4-3', title: 'Thời tiết và vị giác', desc: 'Các trạng thái thời tiết và mùi vị món ăn' },
  { id: 'jpd123-v5-1', course: 'jpd123', tag: '5-1', title: 'Mốc thời gian và hoạt động', desc: 'Hôm qua, hôm nay, ngày mai và thói quen' },
  { id: 'jpd123-v5-2', course: 'jpd123', tag: '5-2', title: 'Cảm xúc và sở thích', desc: 'Bày tỏ cảm xúc vui, buồn, thích, ghét' },
  { id: 'jpd123-v5-3', course: 'jpd123', tag: '5-3', title: 'Mong muốn và ước mơ', desc: 'Cách nói muốn có đồ vật hoặc muốn làm gì' },
  { id: 'jpd123-v6-1', course: 'jpd123', tag: '6-1', title: 'Kế hoạch và rủ rê', desc: 'Rủ rê bạn bè tham gia lễ hội, xem phim' },
  { id: 'jpd123-v6-2', course: 'jpd123', tag: '6-2', title: 'So sánh và lựa chọn', desc: 'So sánh giữa hai vật và chọn thứ thích nhất' },
  { id: 'jpd123-v6-3', course: 'jpd123', tag: '6-3', title: 'Ẩm thực truyền thống Nhật', desc: 'Món ăn Nhật Bản và văn hoá bàn ăn' },
  { id: 'jpd123-v7-1', course: 'jpd123', tag: '7-1', title: 'Vị trí của người và vật', desc: 'Chỉ trên, dưới, trong, ngoài, bên cạnh' },
  { id: 'jpd123-v7-2', course: 'jpd123', tag: '7-2', title: 'Đồ dùng và hành động', desc: 'Động từ thao tác cắt, gửi, tặng, mượn' },
  { id: 'jpd123-v7-3', course: 'jpd123', tag: '7-3', title: 'Sinh hoạt gia đình', desc: 'Các thao tác bật đèn, tắt quạt, mở cửa' },

  // JPD133
  { id: 'jpd133-v8-1', course: 'jpd133', tag: '8-1', title: 'Gia đình và đếm người', desc: 'Từ xưng hô gia đình và đếm người, động vật' },
  { id: 'jpd133-v8-2', course: 'jpd133', tag: '8-2', title: 'Ngoại hình và tính cách', desc: 'Tả dáng người, mái tóc và nét tính cách' },
  { id: 'jpd133-v8-3', course: 'jpd133', tag: '8-3', title: 'Cho và nhận đồ vật', desc: 'Hành động tặng quà, giúp đỡ lẫn nhau' },
  { id: 'jpd133-v9-1', course: 'jpd133', tag: '9-1', title: 'Đơn vị đếm đồ vật', desc: 'Đếm trang giấy, cái chén, chai lọ, chiếc xe' },
  { id: 'jpd133-v9-2', course: 'jpd133', tag: '9-2', title: 'Câu lạc bộ và thể thao', desc: 'Tham gia hoạt động ngoại khoá và rèn luyện' },
  { id: 'jpd133-v9-3', course: 'jpd133', tag: '9-3', title: 'Thủ tục và giấy tờ', desc: 'Từ vựng làm visa, hộ chiếu, điền form' },
  { id: 'jpd133-v10-1', course: 'jpd133', tag: '10-1', title: 'Chỉ đường tại ngã tư', desc: 'Rẽ trái, rẽ phải, đi thẳng qua cây cầu' },
  { id: 'jpd133-v10-2', course: 'jpd133', tag: '10-2', title: 'Nhờ vả và dặn dò', desc: 'Nhờ giúp đỡ một cách lịch sự' },
  { id: 'jpd133-v10-3', course: 'jpd133', tag: '10-3', title: 'Cảm giác và sức khoẻ', desc: 'Đau đầu, sốt, cảm cúm, mệt mỏi' },
  { id: 'jpd133-v11-1', course: 'jpd133', tag: '11-1', title: 'Học tập và ôn thi', desc: 'Làm bài tập, chuẩn bị bài, kỳ thi JLPT' },
  { id: 'jpd133-v11-2', course: 'jpd133', tag: '11-2', title: 'Cột mốc cuộc đời', desc: 'Tốt nghiệp, nhập học, xin việc, kết hôn' },
  { id: 'jpd133-v11-3', course: 'jpd133', tag: '11-3', title: 'Thiết bị và chuyển nhà', desc: 'Vận hành máy móc và chuyển nơi ở mới' }
];

// Rich vocabulary mapping
const unitVocabularies = {
  'jpd113-v1-1': vocab11.length > 0 ? vocab11 : [
    { word: '私', kana: 'わたし', romaji: 'watashi', meaning: 'Tôi' },
    { word: 'あなた', kana: 'あなた', romaji: 'anata', meaning: 'Bạn / Anh / Chị' },
    { word: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'Thầy / Cô giáo' },
    { word: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'Học sinh / Sinh viên' },
    { word: '会社員', kana: 'かいしゃいん', romaji: 'kaishain', meaning: 'Nhân viên công ty' },
    { word: '日本', kana: 'にほん', romaji: 'nihon', meaning: 'Nhật Bản' },
    { word: 'ベトナム', kana: 'ベトナム', romaji: 'betonamu', meaning: 'Việt Nam' },
    { word: '初めまして', kana: 'はじめまして', romaji: 'hajimemashite', meaning: 'Rất vui được gặp bạn' },
    { word: 'どうぞよろしく', kana: 'どうぞよろしく', romaji: 'douzo yoroshiku', meaning: 'Rất mong được giúp đỡ' }
  ],
  'jpd113-v1-2-1': [
    { word: '何才', kana: 'なんさい', romaji: 'nansai', meaning: 'Mấy tuổi' },
    { word: '一才', kana: 'いっさい', romaji: 'issai', meaning: '1 tuổi' },
    { word: '八才', kana: 'はっさい', romaji: 'hassai', meaning: '8 tuổi' },
    { word: '十才', kana: 'じゅっさい', romaji: 'jussai', meaning: '10 tuổi' },
    { word: '二十才', kana: 'はたち', romaji: 'hatachi', meaning: '20 tuổi' },
    { word: '一月', kana: 'いちがつ', romaji: 'ichigatsu', meaning: 'Tháng 1' },
    { word: '四月', kana: 'しがつ', romaji: 'shigatsu', meaning: 'Tháng 4' },
    { word: '七月', kana: 'しちがつ', romaji: 'shichigatsu', meaning: 'Tháng 7' },
    { word: '九月', kana: 'くがつ', romaji: 'kugatsu', meaning: 'Tháng 9' },
    { word: '何月', kana: 'なんがつ', romaji: 'nangatsu', meaning: 'Tháng mấy' }
  ],
  'jpd113-v1-2-2': [
    { word: '一日', kana: 'ついたち', romaji: 'tsuitachi', meaning: 'Mùng 1' },
    { word: '二日', kana: 'ふつか', romaji: 'futsuka', meaning: 'Mùng 2 / 2 ngày' },
    { word: '三日', kana: 'みっか', romaji: 'mikka', meaning: 'Mùng 3 / 3 ngày' },
    { word: '四日', kana: 'よっか', romaji: 'yokka', meaning: 'Mùng 4 / 4 ngày' },
    { word: '五日', kana: 'いつか', romaji: 'itsuka', meaning: 'Mùng 5 / 5 ngày' },
    { word: '十日', kana: 'とおか', romaji: 'tooka', meaning: 'Mùng 10 / 10 ngày' },
    { word: '十四日', kana: 'じゅうよっか', romaji: 'juuyokka', meaning: 'Ngày 14' },
    { word: '二十日', kana: 'はつか', romaji: 'hatsuka', meaning: 'Ngày 20' },
    { word: '二十四日', kana: 'にじゅうよっか', romaji: 'nijuuyokka', meaning: 'Ngày 24' },
    { word: '何日', kana: 'なんにち', romaji: 'nannichi', meaning: 'Mùng mấy / Bao nhiêu ngày' }
  ],
  'jpd113-v1-3': [
    { word: '趣味', kana: 'しゅみ', romaji: 'shumi', meaning: 'Sở thích' },
    { word: '読書', kana: 'どくしょ', romaji: 'dokusho', meaning: 'Đọc sách' },
    { word: '音楽', kana: 'おんがく', romaji: 'ongaku', meaning: 'Âm nhạc' },
    { word: '映画', kana: 'えいが', romaji: 'eiga', meaning: 'Phim ảnh' },
    { word: '旅行', kana: 'りょこう', romaji: 'ryokou', meaning: 'Du lịch' },
    { word: '料理', kana: 'りょうり', romaji: 'ryouri', meaning: 'Nấu ăn / Món ăn' },
    { word: '写真', kana: 'しゃしん', romaji: 'shashin', meaning: 'Nhiếp ảnh / Bức ảnh' },
    { word: 'アニメ', kana: 'アニメ', romaji: 'anime', meaning: 'Hoạt hình Nhật' },
    { word: 'ゲーム', kana: 'ゲーム', romaji: 'geemu', meaning: 'Trò chơi điện tử' }
  ],
  'jpd113-v2-1': [
    { word: 'ここ', kana: 'ここ', romaji: 'koko', meaning: 'Ở đây (chỗ người nói)' },
    { word: 'そこ', kana: 'そこ', romaji: 'soko', meaning: 'Ở đó (chỗ người nghe)' },
    { word: 'あそこ', kana: 'あそこ', romaji: 'asoko', meaning: 'Ở kia (xa cả hai)' },
    { word: 'どこ', kana: 'どこ', romaji: 'doko', meaning: 'Ở đâu' },
    { word: '教室', kana: 'きょうしつ', romaji: 'kyoushitsu', meaning: 'Lớp học' },
    { word: '食堂', kana: 'しょくどう', romaji: 'shokudou', meaning: 'Nhà ăn / Căn tin' },
    { word: '事務所', kana: 'じむしょ', romaji: 'jimusho', meaning: 'Văn phòng' },
    { word: 'トイレ', kana: 'トイレ', romaji: 'toire', meaning: 'Nhà vệ sinh' },
    { word: '銀行', kana: 'ぎんこう', romaji: 'ginkou', meaning: 'Ngân hàng' },
    { word: '郵便局', kana: 'ゆうびんきょく', romaji: 'yuubinkyoku', meaning: 'Bưu điện' }
  ],
  'jpd113-v2-2-1': [
    { word: 'これ', kana: 'これ', romaji: 'kore', meaning: 'Cái này' },
    { word: 'それ', kana: 'それ', romaji: 'sore', meaning: 'Cái đó' },
    { word: 'あれ', kana: 'あれ', romaji: 'are', meaning: 'Cái kia' },
    { word: '本', kana: 'ほん', romaji: 'hon', meaning: 'Sách' },
    { word: '辞書', kana: 'じしょ', romaji: 'jisho', meaning: 'Từ điển' },
    { word: '雑誌', kana: 'ざっし', romaji: 'zasshi', meaning: 'Tạp chí' },
    { word: '新聞', kana: 'しんぶん', romaji: 'shinbun', meaning: 'Báo chí' },
    { word: 'ノート', kana: 'ノート', romaji: 'nooto', meaning: 'Vở / Sổ tay' },
    { word: '鉛筆', kana: 'えんぴつ', romaji: 'enpitsu', meaning: 'Bút chì' },
    { word: '百', kana: 'ひゃく', romaji: 'hyaku', meaning: 'Một trăm' },
    { word: '千', kana: 'せん', romaji: 'sen', meaning: 'Một nghìn' },
    { word: '万', kana: 'まん', romaji: 'man', meaning: 'Mười nghìn (Vạn)' }
  ],
  'jpd113-v2-3': [
    { word: 'ご飯', kana: 'ごはん', romaji: 'gohan', meaning: 'Cơm / Bữa ăn' },
    { word: 'パン', kana: 'パン', romaji: 'pan', meaning: 'Bánh mì' },
    { word: '肉', kana: 'にく', romaji: 'niku', meaning: 'Thịt' },
    { word: '魚', kana: 'さかな', romaji: 'sakana', meaning: 'Cá' },
    { word: '野菜', kana: 'やさい', romaji: 'yasai', meaning: 'Rau xanh' },
    { word: '果物', kana: 'くだもの', romaji: 'kudamono', meaning: 'Hoa quả / Trái cây' },
    { word: '水', kana: 'みず', romaji: 'mizu', meaning: 'Nước lọc' },
    { word: 'お茶', kana: 'おちゃ', romaji: 'ocha', meaning: 'Trà xanh' },
    { word: 'コーヒー', kana: 'コーヒー', romaji: 'koohii', meaning: 'Cà phê' },
    { word: 'ください', kana: 'ください', romaji: 'kudasai', meaning: 'Xin vui lòng cho tôi...' }
  ],
  'jpd113-v3-1': [
    { word: '今', kana: 'いま', romaji: 'ima', meaning: 'Bây giờ' },
    { word: '何時', kana: 'なんじ', romaji: 'nanji', meaning: 'Mấy giờ' },
    { word: '何分', kana: 'なんぷん', romaji: 'nanpun', meaning: 'Mấy phút' },
    { word: '午前', kana: 'ごぜん', romaji: 'gozen', meaning: 'Buổi sáng (AM)' },
    { word: '午後', kana: 'ごご', romaji: 'gogo', meaning: 'Buổi chiều (PM)' },
    { word: '朝', kana: 'あさ', romaji: 'asa', meaning: 'Buổi sáng' },
    { word: '昼', kana: 'ひる', romaji: 'hiru', meaning: 'Buổi trưa' },
    { word: '晩', kana: 'ばん', romaji: 'ban', meaning: 'Buổi tối' },
    { word: '学校', kana: 'がっこう', romaji: 'gakkou', meaning: 'Trường học' },
    { word: '会社', kana: 'かいしゃ', romaji: 'kaisha', meaning: 'Công ty' },
    { word: '駅', kana: 'えき', romaji: 'eki', meaning: 'Nhà ga' }
  ],
  'jpd123-v4-1': [
    { word: '電車', kana: 'でんしゃ', romaji: 'densha', meaning: 'Tàu điện' },
    { word: '地下鉄', kana: 'ちかてつ', romaji: 'chikatetsu', meaning: 'Tàu điện ngầm' },
    { word: '新幹線', kana: 'しんかんせん', romaji: 'shinkansen', meaning: 'Tàu cao tốc Shinkansen' },
    { word: 'バス', kana: 'バス', romaji: 'basu', meaning: 'Xe buýt' },
    { word: 'タクシー', kana: 'タクシー', romaji: 'takushii', meaning: 'Xe taxi' },
    { word: '自転車', kana: 'じてんしゃ', romaji: 'jitensha', meaning: 'Xe đạp' },
    { word: '飛行機', kana: 'ひこうき', romaji: 'hikouki', meaning: 'Máy bay' },
    { word: '歩いて', kana: 'あるいて', romaji: 'aruite', meaning: 'Đi bộ' },
    { word: '右', kana: 'みぎ', romaji: 'migi', meaning: 'Bên phải' },
    { word: '左', kana: 'ひだり', romaji: 'hidari', meaning: 'Bên trái' },
    { word: '前', kana: 'まえ', romaji: 'mae', meaning: 'Phía trước' },
    { word: '後ろ', kana: 'うしろ', romaji: 'ushiro', meaning: 'Phía sau' }
  ],
  'jpd123-v4-3': [
    { word: '天気', kana: 'てんき', romaji: 'tenki', meaning: 'Thời tiết' },
    { word: '雨', kana: 'あめ', romaji: 'ame', meaning: 'Mưa' },
    { word: '雪', kana: 'ゆき', romaji: 'yuki', meaning: 'Tuyết' },
    { word: '晴れ', kana: 'はれ', romaji: 'hare', meaning: 'Nắng đẹp' },
    { word: '曇り', kana: 'くもり', romaji: 'kumori', meaning: 'Trời nhiều mây' },
    { word: '美味しい', kana: 'おいしい', romaji: 'oishii', meaning: 'Ngon miệng' },
    { word: 'まずい', kana: 'まずい', romaji: 'mazui', meaning: 'Dở / Khó ăn' },
    { word: '甘い', kana: 'あまい', romaji: 'amai', meaning: 'Ngọt' },
    { word: '辛い', kana: 'からい', romaji: 'karai', meaning: 'Cay' },
    { word: '酸っぱい', kana: 'すっぱい', romaji: 'suppai', meaning: 'Chua' }
  ],
  'jpd133-v8-1': [
    { word: '家族', kana: 'かぞく', romaji: 'kazoku', meaning: 'Gia đình' },
    { word: '両親', kana: 'りょうしん', romaji: 'ryoushin', meaning: 'Bố mẹ' },
    { word: '父', kana: 'ちち', romaji: 'chichi', meaning: 'Bố (của tôi)' },
    { word: '母', kana: 'はは', romaji: 'haha', meaning: 'Mẹ (của tôi)' },
    { word: 'お父さん', kana: 'おとうさん', romaji: 'otousan', meaning: 'Bố (người khác / gọi bố)' },
    { word: 'お母さん', kana: 'おかあさん', romaji: 'okaasan', meaning: 'Mẹ (người khác / gọi mẹ)' },
    { word: '兄', kana: 'あに', romaji: 'ani', meaning: 'Anh trai (của tôi)' },
    { word: '姉', kana: 'あね', romaji: 'ane', meaning: 'Chị gái (của tôi)' },
    { word: '弟', kana: 'おとうと', romaji: 'otouto', meaning: 'Em trai' },
    { word: '妹', kana: 'いもうと', romaji: 'imouto', meaning: 'Em gái' },
    { word: '一人', kana: 'ひとり', romaji: 'hitori', meaning: '1 người' },
    { word: '二人', kana: 'ふたり', romaji: 'futari', meaning: '2 người' }
  ]
};

// Fill any other units with default thematic vocabulary
unitsMeta.forEach(u => {
  if (!unitVocabularies[u.id]) {
    unitVocabularies[u.id] = [
      { word: '単語', kana: 'たんご', romaji: 'tango', meaning: `Từ vựng chủ đề ${u.title}` },
      { word: '勉強', kana: 'べんきょう', romaji: 'benkyou', meaning: 'Học tập' },
      { word: '練習', kana: 'れんしゅう', romaji: 'renshuu', meaning: 'Luyện tập' },
      { word: '質問', kana: 'しつもん', romaji: 'shitsumon', meaning: 'Câu hỏi' },
      { word: '答え', kana: 'こたえ', romaji: 'kotae', meaning: 'Câu trả lời' },
      { word: '大切', kana: 'たいせつ', romaji: 'taisetsu', meaning: 'Quan trọng' },
      { word: '上手', kana: 'じょうず', romaji: 'jouzu', meaning: 'Giỏi' },
      { word: '合格', kana: 'ごうかく', romaji: 'goukaku', meaning: 'Đỗ kỳ thi' }
    ];
  }
});

// Build all vocabulary items with unique IDs
let allVocabList = [];
unitsMeta.forEach(u => {
  const items = unitVocabularies[u.id] || [];
  items.forEach((item, idx) => {
    allVocabList.push({
      id: `${u.id}-${idx + 1}`,
      word: item.word,
      kana: item.kana,
      romaji: item.romaji,
      meaning: item.meaning,
      course: u.course,
      unitId: u.id,
      unitTitle: u.title,
      unitTag: u.tag
    });
  });
});

console.log('Total vocabulary compiled:', allVocabList.length);
fs.writeFileSync(path.join(dataDir, 'vocabulary.json'), JSON.stringify({
  units: unitsMeta,
  words: allVocabList
}, null, 2), 'utf8');

// 3. Kanji data
const kanjiList = [
  { kanji: '私', hanViet: 'TƯ', meaning: 'Tôi, riêng tư', onyomi: 'シ', kunyomi: 'わたし, わたくし', strokes: 7, level: 'N5', example: '私 (watashi - Tôi)' },
  { kanji: '日', hanViet: 'NHẬT', meaning: 'Mặt trời, ngày', onyomi: 'ニチ, ジツ', kunyomi: 'ひ, か', strokes: 4, level: 'N5', example: '日本 (nihon - Nhật Bản)' },
  { kanji: '本', hanViet: 'BẢN', meaning: 'Gốc, sách, cội nguồn', onyomi: 'ホン', kunyomi: 'もと', strokes: 5, level: 'N5', example: '本 (hon - Sách)' },
  { kanji: '人', hanViet: 'NHÂN', meaning: 'Người', onyomi: 'ジン, ニン', kunyomi: 'ひと', strokes: 2, level: 'N5', example: '日本人 (nihonjin - Người Nhật)' },
  { kanji: '学', hanViet: 'HỌC', meaning: 'Học tập, tri thức', onyomi: 'ガク', kunyomi: 'まな・ぶ', strokes: 8, level: 'N5', example: '学生 (gakusei - Sinh viên)' },
  { kanji: '生', hanViet: 'SINH', meaning: 'Sinh ra, sống', onyomi: 'セイ, ショウ', kunyomi: 'い・きる, う・まれる', strokes: 5, level: 'N5', example: '先生 (sensei - Thầy cô)' },
  { kanji: '大', hanViet: 'ĐẠI', meaning: 'To lớn', onyomi: 'ダイ, タイ', kunyomi: 'おお・きい', strokes: 3, level: 'N5', example: '大学 (daigaku - Đại học)' },
  { kanji: '校', hanViet: 'HIỆU', meaning: 'Trường học', onyomi: 'コウ', kunyomi: '—', strokes: 10, level: 'N5', example: '学校 (gakkou - Trường học)' },
  { kanji: '先', hanViet: 'TIÊN', meaning: 'Trước tiên, đi trước', onyomi: 'セン', kunyomi: 'さき', strokes: 6, level: 'N5', example: '先生 (sensei - Giáo viên)' },
  { kanji: '語', hanViet: 'NGỮ', meaning: 'Ngôn ngữ, tiếng nói', onyomi: 'ゴ', kunyomi: 'かた・る', strokes: 14, level: 'N5', example: '日本語 (nihongo - Tiếng Nhật)' },
  { kanji: '一', hanViet: 'NHẤT', meaning: 'Số 1', onyomi: 'イチ, イツ', kunyomi: 'ひと・つ', strokes: 1, level: 'N5', example: '一日 (tsuitachi - Mùng 1)' },
  { kanji: '二', hanViet: 'NHỊ', meaning: 'Số 2', onyomi: 'ニ', kunyomi: 'ふた・つ', strokes: 2, level: 'N5', example: '二月 (nigatsu - Tháng 2)' },
  { kanji: '三', hanViet: 'TAM', meaning: 'Số 3', onyomi: 'サン', kunyomi: 'みっ・つ', strokes: 3, level: 'N5', example: '三日 (mikka - Mùng 3)' },
  { kanji: '四', hanViet: 'TỨ', meaning: 'Số 4', onyomi: 'シ', kunyomi: 'よん, よっ・つ', strokes: 5, level: 'N5', example: '四月 (shigatsu - Tháng 4)' },
  { kanji: '五', hanViet: 'NGŨ', meaning: 'Số 5', onyomi: 'ゴ', kunyomi: 'いつ・つ', strokes: 4, level: 'N5', example: '五日 (itsuka - Mùng 5)' },
  { kanji: '六', hanViet: 'LỤC', meaning: 'Số 6', onyomi: 'ロク', kunyomi: 'むっ・つ', strokes: 4, level: 'N5', example: '六月 (rokugatsu - Tháng 6)' },
  { kanji: '七', hanViet: 'THẤT', meaning: 'Số 7', onyomi: 'シチ', kunyomi: 'なな, なな・つ', strokes: 2, level: 'N5', example: '七月 (shichigatsu - Tháng 7)' },
  { kanji: '八', hanViet: 'BÁT', meaning: 'Số 8', onyomi: 'ハチ', kunyomi: 'やっ・つ', strokes: 2, level: 'N5', example: '八才 (hassai - 8 tuổi)' },
  { kanji: '九', hanViet: 'CỬU', meaning: 'Số 9', onyomi: 'キュウ, ク', kunyomi: 'ここの・つ', strokes: 2, level: 'N5', example: '九時 (kuji - 9 giờ)' },
  { kanji: '十', hanViet: 'THẬP', meaning: 'Số 10', onyomi: 'ジュウ', kunyomi: 'とお', strokes: 2, level: 'N5', example: '十日 (tooka - Mùng 10)' },
  { kanji: '百', hanViet: 'BÁCH', meaning: 'Trăm', onyomi: 'ヒャク', kunyomi: '—', strokes: 6, level: 'N5', example: '三百 (sanbyaku - 300)' },
  { kanji: '千', hanViet: 'THIÊN', meaning: 'Nghìn', onyomi: 'セン', kunyomi: 'ち', strokes: 3, level: 'N5', example: '千円 (sen\'en - 1.000 Yên)' },
  { kanji: '万', hanViet: 'VẠN', meaning: 'Mười nghìn', onyomi: 'マン, バン', kunyomi: '—', strokes: 3, level: 'N5', example: '一万円 (ichiman\'en - 10.000 Yên)' },
  { kanji: '円', hanViet: 'VIÊN', meaning: 'Tiền Yên, tròn', onyomi: 'エン', kunyomi: 'まる・い', strokes: 4, level: 'N5', example: '百円 (hyakuen - 100 Yên)' },
  { kanji: '年', hanViet: 'NIÊN', meaning: 'Năm', onyomi: 'ネン', kunyomi: 'とし', strokes: 6, level: 'N5', example: '今年 (kotoshi - Năm nay)' },
  { kanji: '月', hanViet: 'NGUYỆT', meaning: 'Mặt trăng, tháng', onyomi: 'ゲツ, ガツ', kunyomi: 'つき', strokes: 4, level: 'N5', example: '月曜日 (getsuyoubi - Thứ hai)' },
  { kanji: '火', hanViet: 'HỎA', meaning: 'Lửa', onyomi: 'カ', kunyomi: 'ひ', strokes: 4, level: 'N5', example: '火曜日 (kayoubi - Thứ ba)' },
  { kanji: '水', hanViet: 'THỦY', meaning: 'Nước', onyomi: 'スイ', kunyomi: 'みず', strokes: 4, level: 'N5', example: '水 (mizu - Nước)' },
  { kanji: '木', hanViet: 'MỘC', meaning: 'Cây cối', onyomi: 'モク, ボク', kunyomi: 'き', strokes: 4, level: 'N5', example: '木曜日 (mokuyoubi - Thứ năm)' },
  { kanji: '金', hanViet: 'KIM', meaning: 'Vàng, tiền', onyomi: 'キン', kunyomi: 'かね', strokes: 8, level: 'N5', example: 'お金 (okane - Tiền bạc)' },
  { kanji: '土', hanViet: 'THỔ', meaning: 'Đất', onyomi: 'ド, ト', kunyomi: 'つち', strokes: 3, level: 'N5', example: '土曜日 (doyoubi - Thứ bảy)' }
];

fs.writeFileSync(path.join(dataDir, 'kanji.json'), JSON.stringify(kanjiList, null, 2), 'utf8');
console.log('Saved kanji.json:', kanjiList.length);

// 4. Grammar data
const grammarList = [
  {
    id: 'g-38',
    pattern: 'N1 は N2 です。',
    meaning: 'Câu khẳng định: N1 là N2',
    explanation: 'Dùng trợ từ は (đọc là wa) để đánh dấu chủ ngữ N1. です biểu thị sự khẳng định lịch sự.',
    examples: [
      { jp: 'わたしは がくせいです。', vi: 'Tôi là sinh viên.' },
      { jp: 'たなかさんは にほんじんです。', vi: 'Anh Tanaka là người Nhật Bản.' },
      { jp: 'ゴクウさんは えいゆうです。', vi: 'Ngộ Không là một anh hùng.' }
    ]
  },
  {
    id: 'g-39',
    pattern: 'N1 は N2 じゃありません / ではありません。',
    meaning: 'Câu phủ định: N1 không phải là N2',
    explanation: 'じゃありません dùng trong văn nói thân mật, ではありません mang sắc thái trang trọng hơn.',
    examples: [
      { jp: 'わたしは せんせいじゃありません。', vi: 'Tôi không phải là giáo viên.' },
      { jp: 'ワンさんは にほんじんではありません。', vi: 'Anh Wang không phải là người Nhật.' }
    ]
  },
  {
    id: 'g-40',
    pattern: 'N1 は N2 ですか。',
    meaning: 'Câu hỏi nghi vấn: N1 có phải là N2 không?',
    explanation: 'Thêm trợ từ か vào cuối câu để tạo câu hỏi. Khi trả lời khẳng định dùng はい, phủ định dùng いいえ.',
    examples: [
      { jp: 'あなたは がくせいですか。', vi: 'Bạn có phải là sinh viên không?' },
      { jp: 'はい、がくせいです。', vi: 'Vâng, tôi là sinh viên.' },
      { jp: 'いいえ、かいしゃいんです。', vi: 'Không, tôi là nhân viên công ty.' }
    ]
  },
  {
    id: 'g-41',
    pattern: 'N も N です。',
    meaning: 'Cũng... (Trợ từ も)',
    explanation: 'Trợ từ も thay thế cho は khi nêu một đối tượng có cùng thuộc tính với đối tượng đã nhắc trước đó.',
    examples: [
      { jp: 'わたしも ベトナムじんです。', vi: 'Tôi cũng là người Việt Nam.' },
      { jp: 'あのかたも がくせいです。', vi: 'Người kia cũng là sinh viên.' }
    ]
  },
  {
    id: 'g-42',
    pattern: 'N1 の N2',
    meaning: 'Sở hữu / Thuộc tính: N2 của N1',
    explanation: 'Trợ từ の dùng để nối hai danh từ, N1 bổ nghĩa cho N2 (sở hữu, nguồn gốc, trường học, công ty).',
    examples: [
      { jp: 'これは わたしの ほんです。', vi: 'Đây là sách của tôi.' },
      { jp: 'にほんごの せんせいです。', vi: 'Là giáo viên tiếng Nhật.' }
    ]
  },
  {
    id: 'g-43',
    pattern: 'これ / それ / あれ は N です。',
    meaning: 'Cái này / Cái đó / Cái kia là N',
    explanation: 'これ (gần người nói), それ (gần người nghe), あれ (xa cả hai).',
    examples: [
      { jp: 'これは じしょです。', vi: 'Cái này là từ điển.' },
      { jp: 'それは なんですか。', vi: 'Cái đó là cái gì vậy?' },
      { jp: 'あれは くるまです。', vi: 'Cái kia là ô tô.' }
    ]
  },
  {
    id: 'g-44',
    pattern: 'N(Địa điểm) へ 行きます / 来ます / 帰ります。',
    meaning: 'Đi / Đến / Về một địa điểm nào đó',
    explanation: 'Trợ từ へ (đọc là e) chỉ phương hướng di chuyển đến địa điểm đích.',
    examples: [
      { jp: 'わたしは にほんへ いきます。', vi: 'Tôi đi Nhật Bản.' },
      { jp: 'うちへ かえります。', vi: 'Tôi trở về nhà.' }
    ]
  },
  {
    id: 'g-45',
    pattern: 'N を V-ます。',
    meaning: 'Làm hành động V đối với tân ngữ N',
    explanation: 'Trợ từ を (đọc là o) đánh dấu đối tượng chịu tác động của hành động.',
    examples: [
      { jp: 'ごはんを たべます。', vi: 'Ăn cơm.' },
      { jp: 'おちゃを のみます。', vi: 'Uống trà xanh.' },
      { jp: 'にほんごを べんきょうします。', vi: 'Học tiếng Nhật.' }
    ]
  },
  {
    id: 'g-46',
    pattern: 'V-てください。',
    meaning: 'Xin hãy làm V / Vui lòng làm V',
    explanation: 'Dùng thể Te (て) cộng ください để đưa ra lời yêu cầu, nhờ vả một cách lịch sự.',
    examples: [
      { jp: 'ここに なまえを かいてください。', vi: 'Xin hãy viết tên vào đây.' },
      { jp: 'ちょっと まってください。', vi: 'Xin hãy chờ một chút.' }
    ]
  },
  {
    id: 'g-47',
    pattern: 'V-てもいいですか。',
    meaning: 'Tôi làm V có được không? (Xin phép)',
    explanation: 'Dùng để xin phép đối phương làm một hành động nào đó.',
    examples: [
      { jp: 'しゃしんを とってもいいですか。', vi: 'Tôi chụp ảnh có được không?' },
      { jp: 'はい、いいですよ。', vi: 'Vâng, được chứ ạ.' }
    ]
  }
];

fs.writeFileSync(path.join(dataDir, 'grammar.json'), JSON.stringify(grammarList, null, 2), 'utf8');
console.log('Saved grammar.json:', grammarList.length);
