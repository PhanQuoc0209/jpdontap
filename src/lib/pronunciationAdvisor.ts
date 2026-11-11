// Japanese Pronunciation Analyzer and Error Diagnosis Engine
// Analyzes spoken transcription against target Japanese words and provides
// detailed linguistic feedback, mouth shape guidance, and pitch accent corrections.

export interface PronunciationDiagnosis {
  status: 'correct' | 'incorrect' | 'silent' | 'unclear';
  score: number | null; // null if silent/not scored
  similarityPercent: number;
  expectedWord: string;
  expectedKana: string;
  expectedRomaji: string;
  heardText: string;
  verdictTitle: string;
  verdictMessage: string;
  mismatches: { expectedPart: string; heardPart: string; tip: string }[];
  mouthShapeAdvice: string;
  pitchAccentAdvice: string;
  coachingRecommendation: string;
}

// Compute Levenshtein distance between two strings
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

// Convert common Japanese kana to simplified romaji for phoneme comparison
export function kanaToRomajiSimple(text: string): string {
  if (!text) return '';
  const map: Record<string, string> = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
    'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
    'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
    'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
    'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
    'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
    'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
    'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
    'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
    'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
    'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
    'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo'
  };

  let res = text;
  // Replace compound kana first
  Object.keys(map).sort((a, b) => b.length - a.length).forEach(k => {
    res = res.split(k).join(map[k]);
  });
  return res.toLowerCase();
}

// Generate specialized linguistic mouth advice based on word characteristics
function getMouthAdviceForWord(word: string, kana: string, romaji: string): { mouth: string; pitch: string; tip: string } {
  const norm = (kana || word || '').toLowerCase();
  const rNorm = romaji.toLowerCase();

  let mouth = 'Thả lỏng cơ hàm, giữ khẩu hình ổn định và mở khẩu hình dọc tự nhiên theo 5 nguyên âm cơ bản A-I-U-E-O.';
  let pitch = 'Giữ cao độ bằng phẳng (Heiban), âm tiết đầu trầm nhẹ rồi lên giọng ở các âm sau.';
  let tip = 'Lắng nghe giọng mẫu và đọc dứt khoát từng phách âm.';

  if (rNorm.includes('shi') || norm.includes('し')) {
    mouth = 'Khép nhẹ hai hàm răng, đưa đầu lưỡi lại gần chân răng trên rồi đẩy hơi êm dịu, không chu môi thổi gió mạnh như "sh" trong tiếng Anh.';
    tip = 'Đọc nhẹ nhàng như "xi" tiếng Việt nhưng khép răng và để hơi thoát tự nhiên.';
  } else if (rNorm.includes('tsu') || norm.includes('つ')) {
    mouth = 'Đầu lưỡi chạm mặt trong chân răng cửa trên, nén hơi rồi hạ nhẹ lưỡi bật hơi tạo âm /tsu/. Tuyệt đối không đọc thành "chu" hay "su".';
    tip = 'Luyện âm "t" rồi trượt ngay sang "x", bật luồng hơi gió dứt khoát.';
  } else if (rNorm.includes('fu') || norm.includes('ふ')) {
    mouth = 'Không cắn răng vào môi dưới như âm "ph/f" tiếng Việt. Thả lỏng hai môi hơi chúm nhẹ và thổi luồng hơi tự nhiên qua khe môi.';
    tip = 'Tưởng tượng như đang thổi nhẹ tắt ngọn nến phía trước.';
  } else if (rNorm.includes('r') || /[らりるれろ]/.test(norm)) {
    mouth = 'Hàng R trong tiếng Nhật là âm vỗ (tap/flap): Uốn đầu lưỡi chạm nhanh vào nướu răng trên rồi búng nhẹ, nằm giữa âm "L" và "R" tiếng Việt.';
    tip = 'Không rung lưỡi kéo dài, chỉ búng đầu lưỡi một nhịp dứt khoát.';
  } else if (norm.includes('っ')) {
    mouth = 'Âm ngắt 「っ」: Cần ngắt hoàn toàn luồng hơi và giữ khoảng lặng trong miệng đúng 1 phách (1 nhịp nhịp tim) trước khi bật phụ âm tiếp theo.';
    tip = 'Đừng đọc lướt qua âm ngắt, hãy khựng lại một nhịp.';
  } else if (/[ああ|いい|うう|ええ|おお|ー]/.test(norm) || /([aiueo])\1/.test(rNorm)) {
    mouth = 'Trường âm (nguyên âm kéo dài): Giữ nguyên khẩu hình miệng và duy trì luồng hơi đủ 2 phách, không ngắt vội làm thay đổi ý nghĩa của từ.';
    tip = 'Đếm nhịp: 1-2 khi kéo dài nguyên âm.';
  } else if (/[きゃ|きゅ|きょ|しゃ|ちゃ|にゃ]/.test(norm)) {
    mouth = 'Âm ghép (Yōon): Không phát âm tách rời thành hai từ riêng biệt (không đọc ki-ya). Hãy uốn khẩu hình và bật trọn vẹn trong 1 phách duy nhất.';
    tip = 'Bật dứt khoát từ phụ âm chuyển nhanh sang bán nguyên âm /y/.';
  }

  // Pitch Accent heuristics
  if (rNorm === 'watashi') {
    pitch = 'Cao độ: Heiban (Bằng phẳng) — [wa] đọc ở tông thấp, [ta-shi] nâng lên tông cao và giữ đều.';
  } else if (rNorm === 'anata') {
    pitch = 'Cao độ: Nakadaka — [a] thấp, [na] cao lên rồi [ta] hạ xuống nhẹ.';
  } else if (rNorm.startsWith('o') && rNorm.length > 3) {
    pitch = 'Tiền tố kính ngữ [o-] thường đọc ở âm vực êm dịu, nhấn vào trọng âm của danh từ chính theo sau.';
  }

  return { mouth, pitch, tip };
}

// Diagnose speech input and evaluate pronunciation correctness
export function diagnosePronunciation(params: {
  targetWord: string;
  targetKana: string;
  targetRomaji: string;
  userSpokenText: string;
  isSilent: boolean;
  hasAudioVoice: boolean;
}): PronunciationDiagnosis {
  const { targetWord, targetKana, targetRomaji, userSpokenText, isSilent, hasAudioVoice } = params;

  const expectedWord = targetWord.trim();
  const expectedKana = targetKana ? targetKana.trim() : expectedWord;
  const expectedRomaji = targetRomaji.trim();
  const heardText = userSpokenText.trim();

  const advice = getMouthAdviceForWord(expectedWord, expectedKana, expectedRomaji);

  // 1. Case: SILENT (Không nói gì)
  if (isSilent || (!hasAudioVoice && heardText === '')) {
    return {
      status: 'silent',
      score: null, // Không chấm điểm khi im lặng!
      similarityPercent: 0,
      expectedWord,
      expectedKana,
      expectedRomaji,
      heardText: '',
      verdictTitle: 'Chưa phát hiện giọng nói!',
      verdictMessage: 'Hệ thống chưa ghi nhận được âm thanh từ bạn. Không thể chấm điểm khi micro không có tiếng.',
      mismatches: [],
      mouthShapeAdvice: advice.mouth,
      pitchAccentAdvice: advice.pitch,
      coachingRecommendation: `Hãy kiểm tra lại micro, bấm nút thu âm và nói to rõ ràng từ 「${expectedWord}」 (/${expectedRomaji}/) nhé!`
    };
  }

  // 2. Case: Audio detected, but Speech Recognition transcript is empty (Unclear speech)
  if (heardText === '') {
    return {
      status: 'unclear',
      score: null,
      similarityPercent: 0,
      expectedWord,
      expectedKana,
      expectedRomaji,
      heardText: '(Âm thanh chưa rõ lời)',
      verdictTitle: 'Chưa nghe rõ từ bạn vừa nói',
      verdictMessage: 'Đã nhận tín hiệu micro nhưng âm thanh chưa đủ rõ để nhận diện chuẩn xác âm tiết.',
      mismatches: [],
      mouthShapeAdvice: advice.mouth,
      pitchAccentAdvice: advice.pitch,
      coachingRecommendation: `Bạn hãy ghé gần micro hơn, nói to và dứt khoát từ: 「${expectedWord}」 【${expectedKana}】 để Ngộ Không nghe rõ nhé!`
    };
  }

  // 3. Compare spoken text with targets
  const targetClean = expectedWord.toLowerCase();
  const targetKanaClean = expectedKana.toLowerCase();
  const targetRomajiClean = expectedRomaji.toLowerCase().replace(/[^a-z]/g, '');

  const heardClean = heardText.toLowerCase();
  const heardRomaji = kanaToRomajiSimple(heardClean).replace(/[^a-z]/g, '');

  const isExactWord = heardClean === targetClean;
  const isExactKana = heardClean === targetKanaClean;
  const isExactRomaji = heardRomaji === targetRomajiClean;

  const kanaDist = levenshteinDistance(targetKanaClean, heardClean);
  const romajiDist = levenshteinDistance(targetRomajiClean, heardRomaji);
  const maxLen = Math.max(targetRomajiClean.length, heardRomaji.length, 1);
  const similarityRatio = Math.max(0, 1 - romajiDist / maxLen);
  const similarityPercent = Math.round(similarityRatio * 100);

  // Exact or near-exact match (>= 85% similarity)
  if (isExactWord || isExactKana || isExactRomaji || similarityPercent >= 85) {
    const computedScore = Math.min(99, Math.max(92, 90 + Math.floor(similarityPercent * 0.08)));
    return {
      status: 'correct',
      score: computedScore,
      similarityPercent: Math.max(computedScore, similarityPercent),
      expectedWord,
      expectedKana,
      expectedRomaji,
      heardText,
      verdictTitle: 'Phát âm tuyệt vời! Chuẩn xác',
      verdictMessage: `Khẩu hình và ngữ điệu của từ 「${expectedWord}」 rất tự nhiên và đúng chuẩn tiếng Nhật.`,
      mismatches: [],
      mouthShapeAdvice: advice.mouth,
      pitchAccentAdvice: advice.pitch,
      coachingRecommendation: 'Rất tốt! Hãy tiếp tục duy trì ngữ điệu trôi chảy này cho các từ vựng tiếp theo.'
    };
  }

  // 4. Incorrect pronunciation (Đọc sai)
  const computedScore = Math.max(42, Math.min(68, Math.round(similarityPercent * 0.65) + 20));
  const mismatches: { expectedPart: string; heardPart: string; tip: string }[] = [];

  mismatches.push({
    expectedPart: `${expectedKana} (/${expectedRomaji}/)`,
    heardPart: `${heardText} (/${heardRomaji || 'chưa rõ'}/)`,
    tip: advice.tip
  });

  return {
    status: 'incorrect',
    score: computedScore,
    similarityPercent,
    expectedWord,
    expectedKana,
    expectedRomaji,
    heardText,
    verdictTitle: 'Phát âm chưa chuẩn xác',
    verdictMessage: `Bạn đọc nghe như 「${heardText}」, trong khi từ mẫu chuẩn là 「${expectedWord}」 【${expectedKana}】.`,
    mismatches,
    mouthShapeAdvice: advice.mouth,
    pitchAccentAdvice: advice.pitch,
    coachingRecommendation: `Hãy đối chiếu lại khẩu hình: ${advice.mouth} Bấm nút "Nghe giọng mẫu" rồi thử thu âm lại nhé!`
  };
}
