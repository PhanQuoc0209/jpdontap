const fs = require('fs');
const path = require('path');

// 1. COMPREHENSIVE SENTENCE TRANSLATION & SCRAMBLE DATASET
const sentences = [
  // JPD113 (Sơ cấp - JPD1)
  {
    id: 's-jpd113-1',
    course: 'jpd113',
    tier: 'sơ cấp',
    title: 'Giới thiệu bản thân',
    vi: 'Tôi là sinh viên trường đại học.',
    jp: '私は大学の学生です。',
    kana: 'わたしは だいがくの がくせいです。',
    romaji: 'watashi wa daigaku no gakusei desu',
    tokens: ['私', 'は', '大学', 'の', '学生', 'です。'],
    hint: 'Chủ ngữ (私) + は + Cụm danh từ (大学の学生) + です。'
  },
  {
    id: 's-jpd113-2',
    course: 'jpd113',
    tier: 'sơ cấp',
    title: 'Hỏi đồ vật & vị trí',
    vi: 'Cái này là sách tiếng Nhật của tôi.',
    jp: 'これは私の日本語の本です。',
    kana: 'これは わたしの にほんごの ホンです。',
    romaji: 'kore wa watashi no nihongo no hon desu',
    tokens: ['これ', 'は', '私', 'の', '日本語', 'の', '本', 'です。'],
    hint: 'Chỉ từ (これ) + は + Sở hữu (私の日本語の本) + です。'
  },
  {
    id: 's-jpd113-3',
    course: 'jpd113',
    tier: 'sơ cấp',
    title: 'Thời gian & di chuyển',
    vi: 'Hàng ngày tôi đi đến trường bằng xe buýt.',
    jp: '毎日バスで学校へ行きます。',
    kana: 'まいにち バスで がっこうへ いきます。',
    romaji: 'mainichi basu de gakkou e ikimasu',
    tokens: ['毎日', 'バス', 'で', '学校', 'へ', '行きます。'],
    hint: 'Thời gian (毎日) + Phương tiện (バスで) + Điểm đến (学校へ) + Động từ (行きます)。'
  },
  {
    id: 's-jpd113-4',
    course: 'jpd113',
    tier: 'sơ cấp',
    title: 'Sở thích & ẩm thực',
    vi: 'Tôi thích ăn ramen và sushi của Nhật Bản.',
    jp: '日本のラーメンと寿司が好きです。',
    kana: 'にほんの ラーメンと すしが すきです。',
    romaji: 'nihon no raamen to sushi ga suki desu',
    tokens: ['日本', 'の', 'ラーメン', 'と', '寿司', 'が', '好きです。'],
    hint: 'Đối tượng sở thích (日本のラーメンと寿司) + が + 好きです。'
  },
  {
    id: 's-jpd113-5',
    course: 'jpd113',
    tier: 'sơ cấp',
    title: 'Mời rủ & rủ rê',
    vi: 'Trưa nay cùng ăn cơm với tôi không?',
    jp: '昼ご飯を一緒に食べませんか。',
    kana: 'ひるごはんを いっしょに たべませんか。',
    romaji: 'hirugohan o issho ni tabemasen ka',
    tokens: ['昼ご飯', 'を', '一緒に', '食べませんか。'],
    hint: 'Tân ngữ (昼ご飯を) + Cùng nhau (一緒に) + Động từ mời rủ (食べませんか)。'
  },
  {
    id: 's-jpd113-6',
    course: 'jpd113',
    tier: 'sơ cấp',
    title: 'Miêu tả địa điểm',
    vi: 'Thành phố Tokyo rất náo nhiệt và thú vị.',
    jp: '東京はとてもにぎやかで面白いです。',
    kana: 'とうきょうは とても にぎやかで おもしろいです。',
    romaji: 'toukyou wa totemo nigiyaka de omoshiroi desu',
    tokens: ['東京', 'は', 'とても', 'にぎやかで', '面白いです。'],
    hint: 'Chủ ngữ (東京は) + Phó từ (とても) + Nối tính từ (にぎやかで) + Tính từ (面白いです)。'
  },

  // JPD123 (Trung cấp - JPD2)
  {
    id: 's-jpd123-1',
    course: 'jpd123',
    tier: 'trung cấp',
    title: 'Yêu cầu lịch sự (Thể て)',
    vi: 'Xin vui lòng viết tên và địa chỉ vào đây.',
    jp: 'ここに名前と住所を書いてください。',
    kana: 'ここに なまえと じゅうしょを かいてください。',
    romaji: 'koko ni namae to juusho o kaite kudasai',
    tokens: ['ここ', 'に', '名前', 'と', '住所', 'を', '書いて', 'ください。'],
    hint: 'Vị trí (ここに) + Tân ngữ (名前と住所を) + Động từ thể て + ください。'
  },
  {
    id: 's-jpd123-2',
    course: 'jpd123',
    tier: 'trung cấp',
    title: 'Hành động liên tiếp (Thể てから)',
    vi: 'Sau khi làm bài tập xong, tôi xem phim hoạt hình.',
    jp: '宿題をしてから、アニメを見ます。',
    kana: 'しゅくだいを してから、アニメを みます。',
    romaji: 'shukudai o shite kara, anime o mimasu',
    tokens: ['宿題', 'を', 'して', 'から、', 'アニメ', 'を', '見ます。'],
    hint: 'Hành động 1 thể て + から + Hành động 2 (アニメを見ます)。'
  },
  {
    id: 's-jpd123-3',
    course: 'jpd123',
    tier: 'trung cấp',
    title: 'Cấm đoán & khuyên nhủ (Thể ない)',
    vi: 'Xin đừng chụp ảnh ở trong căn phòng này.',
    jp: 'この部屋の中で写真を撮らないでください。',
    kana: 'この へやの なかで しゃしんを とらないでください。',
    romaji: 'kono heya no naka de shashin o toranaide kudasai',
    tokens: ['この', '部屋', 'の', '中', 'で', '写真', 'を', '撮らないで', 'ください。'],
    hint: 'Địa điểm (この部屋の中で) + Tân ngữ (写真を) + Thể ない + でください。'
  },
  {
    id: 's-jpd123-4',
    course: 'jpd123',
    tier: 'trung cấp',
    title: 'Bắt buộc phải làm (なければなりません)',
    vi: 'Ngày mai tôi phải nộp báo cáo cho thầy giáo.',
    jp: '明日先生にレポートを出さなければなりません。',
    kana: 'あした せんせいに レポートを ださなければなりません。',
    romaji: 'ashita sensei ni repooto o dasanakereba narimasen',
    tokens: ['明日', '先生', 'に', 'レポート', 'を', '出さなければ', 'なりません。'],
    hint: 'Thời gian + Đối tượng + Tân ngữ + Động từ thể ない bỏ い + ければなりません。'
  },
  {
    id: 's-jpd123-5',
    course: 'jpd123',
    tier: 'trung cấp',
    title: 'Kinh nghiệm từng làm (Thể た)',
    vi: 'Tôi đã từng leo núi Phú Sĩ một lần rồi.',
    jp: '一度富士山に登ったことがあります。',
    kana: 'いちど ふじさんに のぼった ことが あります。',
    romaji: 'ichido fujisan ni nobotta koto ga arimasu',
    tokens: ['一度', '富士山', 'に', '登った', 'こと', 'が', 'あります。'],
    hint: 'Phó từ (一度) + Địa điểm (富士山に) + Động từ thể た + ことがあります。'
  },
  {
    id: 's-jpd123-6',
    course: 'jpd123',
    tier: 'trung cấp',
    title: 'Khả năng (Thể từ điển + ことができます)',
    vi: 'Tôi có thể nói tiếng Nhật và chơi đàn guitar.',
    jp: '日本語を話すことができます。',
    kana: 'にほんごを はなす ことが できます。',
    romaji: 'nihongo o hanasu koto ga dekimasu',
    tokens: ['日本語', 'を', '話す', 'こと', 'が', 'できます。'],
    hint: 'Tân ngữ (日本語を) + Động từ thể từ điển (話す) + ことができます。'
  },

  // JPD133 (Cao cấp - JPD3)
  {
    id: 's-jpd133-1',
    course: 'jpd133',
    tier: 'cao cấp',
    title: 'Bày tỏ ý kiến cá nhân (~と思います)',
    vi: 'Tôi nghĩ rằng kỳ thi tiếng Nhật ngày mai sẽ khó.',
    jp: '明日の日本語の試験は難しいと思います。',
    kana: 'あしたの にほんごの しけんは むずかしいと おもいます。',
    romaji: 'ashita no nihongo no shiken wa muzukashii to omoimasu',
    tokens: ['明日', 'の', '日本語', 'の', '試験', 'は', '難しい', 'と', '思います。'],
    hint: 'Chủ đề (明日の日本語の試験は) + Thể thông thường (難しい) + と思います。'
  },
  {
    id: 's-jpd133-2',
    course: 'jpd133',
    tier: 'cao cấp',
    title: 'Mệnh đề định ngữ bổ nghĩa danh từ',
    vi: 'Người đang đọc sách đằng kia là thầy giáo của tôi.',
    jp: 'あそこで本を読んでいる人は私の先生です。',
    kana: 'あそこで ホンを よんでいる ひとは わたしの せんせいです。',
    romaji: 'asoko de hon o yonde iru hito wa watashi no sensei desu',
    tokens: ['あそこ', 'で', '本', 'を', '読んでいる', '人', 'は', '私の', '先生', 'です。'],
    hint: 'Mệnh đề bổ ngữ (あそこで本を読んでいる) + Danh từ chính (人) + は + Vị ngữ (私の先生です)。'
  },
  {
    id: 's-jpd133-3',
    course: 'jpd133',
    tier: 'cao cấp',
    title: 'Câu điều kiện (~たら)',
    vi: 'Nếu có nhiều tiền, tôi muốn đi du lịch vòng quanh thế giới.',
    jp: 'お金がたくさんあったら、世界旅行をしたいです。',
    kana: 'おかねが たくさん あったら、せかいりょこうを したいです。',
    romaji: 'okane ga takusan attara, sekai ryokou o shitai desu',
    tokens: ['お金', 'が', 'たくさん', 'あったら、', '世界旅行', 'を', 'したいです。'],
    hint: 'Vế điều kiện (あったら) + Vế kết quả mong muốn (世界旅行をしたいです)。'
  },
  {
    id: 's-jpd133-4',
    course: 'jpd133',
    tier: 'cao cấp',
    title: 'Kính ngữ giao tiếp (Kính trọng ngữ)',
    vi: 'Thầy Tanaka đã về nhà từ lúc nãy rồi.',
    jp: '田中先生はさきほどお帰りになりました。',
    kana: 'たなかせんせいは さきほど おかえりに なりました。',
    romaji: 'tanaka sensei wa sakihodo okaeri ni narimashita',
    tokens: ['田中先生', 'は', 'さきほど', 'お帰りに', 'なりました。'],
    hint: 'Chủ ngữ tôn kính + お + Động từ bỏ ます + になりました。'
  },
  {
    id: 's-jpd133-5',
    course: 'jpd133',
    tier: 'cao cấp',
    title: 'Khiêm nhường ngữ doanh nghiệp',
    vi: 'Tôi sẽ kiểm tra tài liệu này ngay bây giờ.',
    jp: 'ただいまこの資料を拝見いたします。',
    kana: 'ただいま この しりょうを はいけんいたします。',
    romaji: 'tadaima kono shiryou o haiken itashimasu',
    tokens: ['ただいま', 'この', '資料', 'を', '拝見いたします。'],
    hint: 'Trạng từ (ただいま) + Tân ngữ + Khiêm nhường ngữ (拝見いたします)。'
  }
];

// Helper to scramble array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Ensure not identical to original if length > 1
  if (arr.length > 1 && arr.every((val, idx) => val === array[idx])) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

const enrichedSentences = sentences.map(s => ({
  ...s,
  scrambled: shuffle(s.tokens)
}));

fs.writeFileSync(
  path.join(__dirname, '../data/sentences.json'),
  JSON.stringify(enrichedSentences, null, 2),
  'utf8'
);

console.log('Saved data/sentences.json with', enrichedSentences.length, 'sentences!');
