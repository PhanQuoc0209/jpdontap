const fs = require('fs');
const path = require('path');

const vocabFile = path.join(__dirname, '../data/vocabulary.json');
const currentData = JSON.parse(fs.readFileSync(vocabFile, 'utf8'));

// Build dictionary of rich vocabulary for each unit
const unitVocabExtensions = {
  // --- JPD113 ---
  'jpd113-v1-1': [
    { word: 'あなた', kana: 'あなた', romaji: 'anata', meaning: 'Bạn, anh/chị (ngôi thứ 2)' },
    { word: 'あの方', kana: 'あのかた', romaji: 'anokata', meaning: 'Vị kia (lịch sự của あの人)' },
    { word: '〜さん', kana: '〜さん', romaji: '~san', meaning: 'Hậu tố xưng hô lịch sự (Anh/Chị)' },
    { word: '〜ちゃん', kana: '〜ちゃん', romaji: '~chan', meaning: 'Hậu tố gọi bé gái / thân mật' },
    { word: '〜くん', kana: '〜くん', romaji: '~kun', meaning: 'Hậu tố gọi bé trai / đồng nghiệp nam' },
    { word: '〜人', kana: '〜じん', romaji: '~jin', meaning: 'Người (nước nào đó)' },
    { word: '先生', kana: 'せんせい', romaji: 'sensei', meaning: 'Thầy giáo, cô giáo, bác sĩ' },
    { word: '教師', kana: 'きょうし', romaji: 'kyoushi', meaning: 'Nghề giáo viên' },
    { word: '学生', kana: 'がくせい', romaji: 'gakusei', meaning: 'Học sinh, sinh viên' },
    { word: '会社員', kana: 'かいしゃいん', romaji: 'kaishain', meaning: 'Nhân viên công ty' },
    { word: '社員', kana: 'しゃいん', romaji: 'shain', meaning: 'Nhân viên (của công ty cụ thể)' },
    { word: '銀行員', kana: 'ぎんこういん', romaji: 'ginkouin', meaning: 'Nhân viên ngân hàng' },
    { word: '医者', kana: 'いしゃ', romaji: 'isha', meaning: 'Bác sĩ' },
    { word: '研究者', kana: 'けんきゅうしゃ', romaji: 'kenkyuusha', meaning: 'Nhà nghiên cứu' },
    { word: '大学', kana: 'だいがく', romaji: 'daigaku', meaning: 'Trường đại học' },
    { word: '病院', kana: 'びょういん', romaji: 'byouin', meaning: 'Bệnh viện' },
    { word: 'だれ', kana: 'だれ', romaji: 'dare', meaning: 'Ai (từ để hỏi)' },
    { word: 'どなた', kana: 'どなた', romaji: 'donata', meaning: 'Vị nào (lịch sự của だれ)' },
    { word: '〜歳', kana: '〜さい', romaji: '~sai', meaning: '... tuổi' },
    { word: '何歳', kana: 'なんさい', romaji: 'nansai', meaning: 'Mấy tuổi, bao nhiêu tuổi' },
    { word: 'おいくつ', kana: 'おいくつ', romaji: 'oikutsu', meaning: 'Bao nhiêu tuổi (lịch sự)' }
  ],
  'jpd113-v1-2-1': [
    { word: '一月', kana: 'いちがつ', romaji: 'ichigatsu', meaning: 'Tháng 1' },
    { word: '二月', kana: 'にがつ', romaji: 'nigatsu', meaning: 'Tháng 2' },
    { word: '三月', kana: 'さんがつ', romaji: 'sangatsu', meaning: 'Tháng 3' },
    { word: '四月', kana: 'しがつ', romaji: 'shigatsu', meaning: 'Tháng 4' },
    { word: '五月', kana: 'ごがつ', romaji: 'gogatsu', meaning: 'Tháng 5' },
    { word: '六月', kana: 'ろくがつ', romaji: 'rokugatsu', meaning: 'Tháng 6' },
    { word: '七月', kana: 'しちがつ', romaji: 'shichigatsu', meaning: 'Tháng 7' },
    { word: '八月', kana: 'はちがつ', romaji: 'hachigatsu', meaning: 'Tháng 8' },
    { word: '九月', kana: 'くがつ', romaji: 'kugatsu', meaning: 'Tháng 9' },
    { word: '十月', kana: 'じゅうがつ', romaji: 'juugatsu', meaning: 'Tháng 10' },
    { word: '十一月', kana: 'じゅういちがつ', romaji: 'juuichigatsu', meaning: 'Tháng 11' },
    { word: '十二月', kana: 'じゅうにがつ', romaji: 'juunigatsu', meaning: 'Tháng 12' },
    { word: '何月', kana: 'なんがつ', romaji: 'nangatsu', meaning: 'Tháng mấy' },
    { word: '二十歳', kana: 'はたち', romaji: 'hatachi', meaning: '20 tuổi (trưởng thành)' }
  ],
  'jpd113-v1-2-2': [
    { word: '一日', kana: 'ついたち', romaji: 'tsuitachi', meaning: 'Mùng 1 (ngày đầu tháng)' },
    { word: '二日', kana: 'ふつか', romaji: 'futsuka', meaning: 'Mùng 2 (2 ngày)' },
    { word: '三日', kana: 'みっか', romaji: 'mikka', meaning: 'Mùng 3 (3 ngày)' },
    { word: '四日', kana: 'よっか', romaji: 'yokka', meaning: 'Mùng 4 (4 ngày)' },
    { word: '五日', kana: 'いつか', romaji: 'itsuka', meaning: 'Mùng 5 (5 ngày)' },
    { word: '六日', kana: 'むいか', romaji: 'muika', meaning: 'Mùng 6 (6 ngày)' },
    { word: '七日', kana: 'なのか', romaji: 'nanoka', meaning: 'Mùng 7 (7 ngày)' },
    { word: '八日', kana: 'ようか', romaji: 'youka', meaning: 'Mùng 8 (8 ngày)' },
    { word: '九日', kana: 'ここのか', romaji: 'kokonoka', meaning: 'Mùng 9 (9 ngày)' },
    { word: '十日', kana: 'とおか', romaji: 'tooka', meaning: 'Mùng 10 (10 ngày)' },
    { word: '十四日', kana: 'じゅうよっか', romaji: 'juuyokka', meaning: 'Ngày 14' },
    { word: '二十日', kana: 'はつか', romaji: 'hatsuka', meaning: 'Ngày 20' },
    { word: '二十四日', kana: 'にじゅうよっか', romaji: 'nijuuyokka', meaning: 'Ngày 24' },
    { word: '何日', kana: 'なんにち', romaji: 'nannichi', meaning: 'Ngày mấy / bao nhiêu ngày' },
    { word: '誕生日', kana: 'たんじょうび', romaji: 'tanjoubi', meaning: 'Ngày sinh nhật' }
  ],
  'jpd113-v1-3': [
    { word: 'サッカー', kana: 'サッカー', romaji: 'sakkaa', meaning: 'Bóng đá' },
    { word: '野球', kana: 'やきゅう', romaji: 'yakyuu', meaning: 'Bóng chày' },
    { word: 'テニス', kana: 'テニス', romaji: 'tenisu', meaning: 'Quần vợt / Tennis' },
    { word: '水泳', kana: 'すいえい', romaji: 'suiei', meaning: 'Bơi lội' },
    { word: '読書', kana: 'どくしょ', romaji: 'dokusho', meaning: 'Đọc sách' },
    { word: '音楽', kana: 'おんがく', romaji: 'ongaku', meaning: 'Âm nhạc' },
    { word: '映画', kana: 'えいが', romaji: 'eiga', meaning: 'Phim ảnh' },
    { word: '旅行', kana: 'りょこう', romaji: 'ryokou', meaning: 'Du lịch' },
    { word: '写真', kana: 'しゃしん', romaji: 'shashin', meaning: 'Bức ảnh, chụp ảnh' },
    { word: '料理', kana: 'りょうり', romaji: 'ryouri', meaning: 'Món ăn, nấu ăn' },
    { word: 'ゲーム', kana: 'ゲーム', romaji: 'geemu', meaning: 'Trò chơi điện tử' },
    { word: 'アニメ', kana: 'アニメ', romaji: 'anime', meaning: 'Phim hoạt hình Nhật' },
    { word: 'ピアノ', kana: 'ピアノ', romaji: 'piano', meaning: 'Đàn dương cầm' },
    { word: 'ギター', kana: 'ギター', romaji: 'gitaa', meaning: 'Đàn ghi-ta' },
    { word: '趣味', kana: 'しゅみ', romaji: 'shumi', meaning: 'Sở thích' },
    { word: '上手', kana: 'じょうず', romaji: 'jouzu', meaning: 'Giỏi, khéo léo' },
    { word: '下手', kana: 'へた', romaji: 'heta', meaning: 'Kém, vụng về' }
  ],
  'jpd113-v2-1': [
    { word: 'スーパー', kana: 'スーパー', romaji: 'suupaa', meaning: 'Siêu thị' },
    { word: 'デパート', kana: 'デパート', romaji: 'depaato', meaning: 'Trung tâm bách hóa cao cấp' },
    { word: 'コンビニ', kana: 'コンビニ', romaji: 'konbini', meaning: 'Cửa hàng tiện lợi 24/7' },
    { word: '本屋', kana: 'ほんや', romaji: 'honya', meaning: 'Tiệm sách' },
    { word: '銀行', kana: 'ぎんこう', romaji: 'ginkou', meaning: 'Ngân hàng' },
    { word: '郵便局', kana: 'ゆうびんきょく', romaji: 'yuubinkyoku', meaning: 'Bưu điện' },
    { word: '図書館', kana: 'としょかん', romaji: 'toshokan', meaning: 'Thư viện' },
    { word: '教室', kana: 'きょうしつ', romaji: 'kyoushitsu', meaning: 'Phòng học' },
    { word: '食堂', kana: 'しょくどう', romaji: 'shokudou', meaning: 'Nhà ăn, căng tin' },
    { word: '事務所', kana: 'じむしょ', romaji: 'jimusho', meaning: 'Văn phòng làm việc' },
    { word: '会議室', kana: 'かいぎしつ', romaji: 'kaigishitsu', meaning: 'Phòng họp' },
    { word: '受付', kana: 'うけつけ', romaji: 'uketsuke', meaning: 'Quầy tiếp tân' },
    { word: '部屋', kana: 'へや', romaji: 'heya', meaning: 'Căn phòng' },
    { word: 'トイレ', kana: 'トイレ', romaji: 'toire', meaning: 'Nhà vệ sinh' },
    { word: '階段', kana: 'かいだん', romaji: 'kaidan', meaning: 'Cầu thang bộ' },
    { word: 'エレベーター', kana: 'エレベーター', romaji: 'erebeetaa', meaning: 'Thang máy' }
  ],
  'jpd113-v2-2-1': [
    { word: '本', kana: 'ほん', romaji: 'hon', meaning: 'Quyển sách' },
    { word: '辞書', kana: 'じしょ', romaji: 'jisho', meaning: 'Quyển từ điển' },
    { word: '雑誌', kana: 'ざっし', romaji: 'zasshi', meaning: 'Tạp chí' },
    { word: '新聞', kana: 'しんぶん', romaji: 'shinbun', meaning: 'Tờ báo' },
    { word: 'ノート', kana: 'ノート', romaji: 'nooto', meaning: 'Vở ghi bài' },
    { word: '手帳', kana: 'てちょう', romaji: 'techou', meaning: 'Sổ tay bỏ túi' },
    { word: '名刺', kana: 'めいし', romaji: 'meishi', meaning: 'Danh thiếp' },
    { word: 'カード', kana: 'カード', romaji: 'kaado', meaning: 'Thẻ ATM / Thẻ ghi nợ' },
    { word: '鉛筆', kana: 'えんぴつ', romaji: 'enpitsu', meaning: 'Bút chì' },
    { word: 'ボールペン', kana: 'ボールペン', romaji: 'boorupen', meaning: 'Bút bi' },
    { word: '鍵', kana: 'かぎ', romaji: 'kagi', meaning: 'Chìa khóa' },
    { word: '時計', kana: 'とけい', romaji: 'tokei', meaning: 'Đồng hồ đeo tay / để bàn' },
    { word: '傘', kana: 'かさ', romaji: 'kasa', meaning: 'Cái ô, cây dù' },
    { word: 'かばん', kana: 'かばん', romaji: 'kaban', meaning: 'Cặp xách, túi xách' },
    { word: 'テレビ', kana: 'テレビ', romaji: 'terebi', meaning: 'Tivi' },
    { word: 'ラジオ', kana: 'ラジオ', romaji: 'rajio', meaning: 'Đài radio' },
    { word: 'カメラ', kana: 'カメラ', romaji: 'kamera', meaning: 'Máy chụp ảnh' },
    { word: 'コンピューター', kana: 'コンピューター', romaji: 'konpyuutaa', meaning: 'Máy tính' }
  ],
  'jpd113-v2-2-2': [
    { word: '百', kana: 'ひゃく', romaji: 'hyaku', meaning: 'Một trăm (100)' },
    { word: '千', kana: 'せん', romaji: 'sen', meaning: 'Một nghìn (1.000)' },
    { word: '万', kana: 'まん', romaji: 'man', meaning: 'Mười nghìn / Vạn (10.000)' },
    { word: '円', kana: 'えん', romaji: 'en', meaning: 'Đồng Yên Nhật' },
    { word: 'いくら', kana: 'いくら', romaji: 'ikura', meaning: 'Giá bao nhiêu tiền' },
    { word: '高い', kana: 'たかい', romaji: 'takai', meaning: 'Đắt tiền / Cao' },
    { word: '安い', kana: 'やすい', romaji: 'yasui', meaning: 'Rẻ tiền' },
    { word: '財布', kana: 'さいふ', romaji: 'saifu', meaning: 'Cái ví tiền' },
    { word: 'レシート', kana: 'レシート', romaji: 'reshiito', meaning: 'Hóa đơn tính tiền' },
    { word: '割引', kana: 'わりびき', romaji: 'waribiki', meaning: 'Giảm giá, chiết khấu' },
    { word: 'ぜんぶで', kana: 'ぜんぶで', romaji: 'zenbude', meaning: 'Tổng cộng tất cả' },
    { word: 'ちょうど', kana: 'ちょうど', romaji: 'choudo', meaning: 'Vừa đúng, vừa khít' }
  ],
  'jpd113-v2-3': [
    { word: 'ご飯', kana: 'ごはん', romaji: 'gohan', meaning: 'Cơm, bữa ăn' },
    { word: 'パン', kana: 'パン', romaji: 'pan', meaning: 'Bánh mì' },
    { word: '卵', kana: 'たまご', romaji: 'tamago', meaning: 'Quả trứng' },
    { word: '肉', kana: 'にく', romaji: 'niku', meaning: 'Thịt' },
    { word: '魚', kana: 'さかな', romaji: 'sakana', meaning: 'Cá' },
    { word: '野菜', kana: 'やさい', romaji: 'yasai', meaning: 'Rau củ' },
    { word: '果物', kana: 'くだもの', romaji: 'kudamono', meaning: 'Trái cây, hoa quả' },
    { word: '水', kana: 'みず', romaji: 'mizu', meaning: 'Nước lọc' },
    { word: 'お茶', kana: 'おちゃ', romaji: 'ocha', meaning: 'Trà xanh' },
    { word: '紅茶', kana: 'こうちゃ', romaji: 'koucha', meaning: 'Hồng trà' },
    { word: '牛乳', kana: 'ぎゅうにゅう', romaji: 'gyuunyuu', meaning: 'Sữa bò' },
    { word: 'ジュース', kana: 'ジュース', romaji: 'juusu', meaning: 'Nước ép trái cây' },
    { word: 'ビール', kana: 'ビール', romaji: 'biiru', meaning: 'Bia' },
    { word: 'お酒', kana: 'おさけ', romaji: 'osake', meaning: 'Rượu sake, đồ có cồn' },
    { word: 'メニュー', kana: 'メニュー', romaji: 'menyuu', meaning: 'Thực đơn' },
    { word: '注文', kana: 'ちゅうもん', romaji: 'chuumon', meaning: 'Gọi món, đặt hàng' }
  ],
  'jpd113-v3-1': [
    { word: '今', kana: 'いま', romaji: 'ima', meaning: 'Bây giờ' },
    { word: '何時', kana: 'なんじ', romaji: 'nanji', meaning: 'Mấy giờ' },
    { word: '分', kana: 'ふん / ぷん', romaji: 'fun / pun', meaning: 'Phút' },
    { word: '半', kana: 'はん', romaji: 'han', meaning: 'Rưỡi, nửa (giờ)' },
    { word: '午前', kana: 'ごぜん', romaji: 'gozen', meaning: 'Buổi sáng (AM)' },
    { word: '午後', kana: 'ごご', romaji: 'gogo', meaning: 'Buổi chiều (PM)' },
    { word: '朝', kana: 'あさ', romaji: 'asa', meaning: 'Buổi sáng' },
    { word: '昼', kana: 'ひる', romaji: 'hiru', meaning: 'Buổi trưa' },
    { word: '晩', kana: 'ばん', romaji: 'ban', meaning: 'Buổi tối' },
    { word: '夜', kana: 'よる', romaji: 'yoru', meaning: 'Ban đêm' },
    { word: '今日', kana: 'きょう', romaji: 'kyou', meaning: 'Hôm nay' },
    { word: '明日', kana: 'あした', romaji: 'ashita', meaning: 'Ngày mai' },
    { word: '昨日', kana: 'きのう', romaji: 'kinou', meaning: 'Hôm qua' },
    { word: 'あさって', kana: 'あさって', romaji: 'asatte', meaning: 'Ngày kia' },
    { word: 'おととい', kana: 'おととい', romaji: 'ototoi', meaning: 'Hôm kia' },
    { word: '今朝', kana: 'けさ', romaji: 'kesa', meaning: 'Sáng nay' },
    { word: '今晩', kana: 'こんばん', romaji: 'konban', meaning: 'Tối nay' },
    { word: '休み', kana: 'やすみ', romaji: 'yasumi', meaning: 'Nghỉ ngơi, ngày nghỉ' },
    { word: '昼休み', kana: 'ひるやすみ', romaji: 'hiruyasumi', meaning: 'Nghỉ trưa' }
  ],
  'jpd113-v3-2': [
    { word: '春', kana: 'はる', romaji: 'haru', meaning: 'Mùa xuân' },
    { word: '夏', kana: 'なつ', romaji: 'natsu', meaning: 'Mùa hè' },
    { word: '秋', kana: 'あき', romaji: 'aki', meaning: 'Mùa thu' },
    { word: '冬', kana: 'ふゆ', romaji: 'fuyu', meaning: 'Mùa đông' },
    { word: '行く', kana: 'いく', romaji: 'iku', meaning: 'Đi tới' },
    { word: '来る', kana: 'くる', romaji: 'kuru', meaning: 'Đến nơi' },
    { word: '帰る', kana: 'かえる', romaji: 'kaeru', meaning: 'Trở về nhà/nước' },
    { word: '花見', kana: 'はなみ', romaji: 'hanami', meaning: 'Ngắm hoa anh đào' },
    { word: '祭り', kana: 'まつり', romaji: 'matsuri', meaning: 'Lễ hội truyền thống' },
    { word: '海', kana: 'うみ', romaji: 'umi', meaning: 'Biển' },
    { word: '山', kana: 'やま', romaji: 'yama', meaning: 'Núi' },
    { word: '雪', kana: 'ゆき', romaji: 'yuki', meaning: 'Tuyết' },
    { word: '暑い', kana: 'あつい', romaji: 'atsui', meaning: 'Nóng nực' },
    { word: '寒い', kana: 'さむい', romaji: 'samui', meaning: 'Lạnh giá' }
  ],
  'jpd113-v3-3': [
    { word: '起きる', kana: 'おきる', romaji: 'okiru', meaning: 'Thức dậy' },
    { word: '寝る', kana: 'ねる', romaji: 'neru', meaning: 'Đi ngủ' },
    { word: '働く', kana: 'はたらく', romaji: 'hataraku', meaning: 'Làm việc' },
    { word: '休む', kana: 'やすむ', romaji: 'yasumu', meaning: 'Nghỉ ngơi' },
    { word: '勉強する', kana: 'べんきょうする', romaji: 'benkyousuru', meaning: 'Học tập' },
    { word: '終わる', kana: 'おわる', romaji: 'owaru', meaning: 'Kết thúc, xong' },
    { word: '食べる', kana: 'たべる', romaji: 'taberu', meaning: 'Ăn' },
    { word: '飲む', kana: 'のむ', romaji: 'nomu', meaning: 'Uống' },
    { word: '吸う', kana: 'すう', romaji: 'suu', meaning: 'Hút (thuốc)' },
    { word: '見る', kana: 'みる', romaji: 'miru', meaning: 'Xem, nhìn' },
    { word: '聞く', kana: 'きく', romaji: 'kiku', meaning: 'Nghe, hỏi' },
    { word: '読む', kana: 'よむ', romaji: 'yomu', meaning: 'Đọc' },
    { word: '書く', kana: 'かく', romaji: 'kaku', meaning: 'Viết, vẽ' },
    { word: '買う', kana: 'かう', romaji: 'kau', meaning: 'Mua' },
    { word: '撮る', kana: 'とる', romaji: 'toru', meaning: 'Chụp (ảnh)' },
    { word: '会う', kana: 'あう', romaji: 'au', meaning: 'Gặp gỡ' }
  ]
};

// Map each unit and append new words if not already present
let addedCount = 0;
const existingWordMap = new Set(currentData.words.map(w => `${w.unitId}::${w.word}`));

Object.entries(unitVocabExtensions).forEach(([unitId, words]) => {
  const unitObj = currentData.units.find(u => u.id === unitId);
  if (!unitObj) return;

  words.forEach((w, idx) => {
    const key = `${unitId}::${w.word}`;
    if (!existingWordMap.has(key)) {
      currentData.words.push({
        id: `${unitId}-exp-${idx + 1}`,
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
console.log('Successfully expanded vocabulary! Added', addedCount, 'words. Total words now:', currentData.words.length);
