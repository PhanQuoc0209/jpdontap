// Japanese Stroke Order Data & Calligraphy Demonstration Engine
// Supports Hiragana, Katakana, and Kanji characters

export interface StrokeStep {
  strokeNumber: number;
  name: string;
  description: string;
  direction: string;
  startPercent: { x: number; y: number }; // Starting coordinate in % (0 - 100)
  points: { x: number; y: number }[]; // Stroke path keypoints in % (0 - 100)
}

export interface CharacterStrokeData {
  char: string;
  totalStrokes: number;
  ruleHint: string;
  strokes: StrokeStep[];
}

export const STROKE_DATA_MAP: Record<string, CharacterStrokeData> = {
  // === HIRAGANA VOWELS & K-ROW ===
  'あ': {
    char: 'あ',
    totalStrokes: 3,
    ruleHint: 'Nét ngang trước, nét sổ cắt qua, nét uốn xoắn nút thắt sau cùng.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang',
        description: 'Vẽ nét ngang từ trái sang phải, hơi chếch nhẹ lên',
        direction: '→',
        startPercent: { x: 26, y: 32 },
        points: [{ x: 26, y: 32 }, { x: 50, y: 32 }, { x: 74, y: 32 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét sổ dọc',
        description: 'Kéo nét sổ từ trên xuống cắt qua nét 1, hơi cong nhẹ sang trái',
        direction: '↓',
        startPercent: { x: 50, y: 16 },
        points: [{ x: 50, y: 16 }, { x: 49, y: 46 }, { x: 44, y: 78 }]
      },
      {
        strokeNumber: 3,
        name: 'Nét uốn vòng xoắn',
        description: 'Bắt đầu từ giữa, lượn sang phải tạo nút thắt rồi lượn vòng cung lớn xuống dưới',
        direction: '⤵',
        startPercent: { x: 38, y: 44 },
        points: [{ x: 38, y: 44 }, { x: 32, y: 64 }, { x: 50, y: 82 }, { x: 78, y: 68 }, { x: 74, y: 48 }, { x: 50, y: 52 }, { x: 42, y: 72 }]
      }
    ]
  },
  'い': {
    char: 'い',
    totalStrokes: 2,
    ruleHint: 'Trái trước phải sau; nét trái dài hơn có móc nhẹ lên, nét phải ngắn hơn.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét cong trái có móc',
        description: 'Kéo nét cong từ trên xuống rồi hất nhẹ mũi móc lên',
        direction: '↓⤴',
        startPercent: { x: 32, y: 26 },
        points: [{ x: 32, y: 26 }, { x: 28, y: 56 }, { x: 32, y: 74 }, { x: 38, y: 70 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét cong phải',
        description: 'Kéo nét ngắn hơn ở bên phải hơi nghiêng',
        direction: '↘',
        startPercent: { x: 68, y: 34 },
        points: [{ x: 68, y: 34 }, { x: 72, y: 54 }, { x: 70, y: 66 }]
      }
    ]
  },
  'う': {
    char: 'う',
    totalStrokes: 2,
    ruleHint: 'Dấu phẩy ở trên trước, nét uốn cong lớn bên dưới sau.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Dấu chấm phẩy đỉnh',
        description: 'Chấm nét ngắn xiên chéo từ trái sang phải',
        direction: '↘',
        startPercent: { x: 44, y: 20 },
        points: [{ x: 44, y: 20 }, { x: 56, y: 28 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét vòng cung lớn',
        description: 'Bắt đầu từ trái, uốn vòng cung tròn sang phải rồi kéo cong xuống',
        direction: '⤵',
        startPercent: { x: 34, y: 42 },
        points: [{ x: 34, y: 42 }, { x: 62, y: 40 }, { x: 74, y: 54 }, { x: 64, y: 76 }, { x: 42, y: 84 }]
      }
    ]
  },
  'え': {
    char: 'え',
    totalStrokes: 2,
    ruleHint: 'Dấu phẩy trên trước, nét ziczac lượn sóng bên dưới liền một nét.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Dấu chấm đỉnh',
        description: 'Chấm nhẹ từ trái sang phải ở trên đỉnh',
        direction: '↘',
        startPercent: { x: 44, y: 18 },
        points: [{ x: 44, y: 18 }, { x: 56, y: 26 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét ziczac lượn sóng',
        description: 'Ngang sang phải, xiên chéo xuống trái, rồi lượn sóng ngang sang phải',
        direction: '→↙⤴',
        startPercent: { x: 32, y: 44 },
        points: [{ x: 32, y: 44 }, { x: 64, y: 40 }, { x: 36, y: 70 }, { x: 46, y: 76 }, { x: 74, y: 78 }]
      }
    ]
  },
  'お': {
    char: 'お',
    totalStrokes: 3,
    ruleHint: 'Nét ngang trước, nét sổ gập uốn tròn giữa, dấu chấm ngoài cùng sau.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang ngắn',
        description: 'Kéo ngang từ trái qua phải',
        direction: '→',
        startPercent: { x: 26, y: 32 },
        points: [{ x: 26, y: 32 }, { x: 54, y: 32 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét sổ gập lượn tròn',
        description: 'Sổ dọc xuống, gập chéo sang trái rồi lượn vòng tròn lớn sang phải',
        direction: '↓↙⤴',
        startPercent: { x: 46, y: 20 },
        points: [{ x: 46, y: 20 }, { x: 46, y: 56 }, { x: 30, y: 58 }, { x: 48, y: 84 }, { x: 74, y: 72 }, { x: 66, y: 54 }]
      },
      {
        strokeNumber: 3,
        name: 'Dấu chấm góc phải',
        description: 'Chấm nét xiên ở góc trên bên phải',
        direction: '↘',
        startPercent: { x: 72, y: 34 },
        points: [{ x: 72, y: 34 }, { x: 80, y: 42 }]
      }
    ]
  },
  'か': {
    char: 'か',
    totalStrokes: 3,
    ruleHint: 'Nét móc chính trước, nét sổ chéo ở giữa, dấu phẩy sau cùng.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang gập móc',
        description: 'Kéo ngang, gập cong xuống rồi móc ngược nhẹ vào trong',
        direction: '→↓⤴',
        startPercent: { x: 28, y: 34 },
        points: [{ x: 28, y: 34 }, { x: 56, y: 34 }, { x: 54, y: 64 }, { x: 48, y: 72 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét sổ hơi cong',
        description: 'Sổ dọc hơi cong cắt qua nét móc bên trái',
        direction: '↓',
        startPercent: { x: 38, y: 22 },
        points: [{ x: 38, y: 22 }, { x: 34, y: 54 }, { x: 28, y: 80 }]
      },
      {
        strokeNumber: 3,
        name: 'Dấu phẩy ngoài',
        description: 'Chấm phẩy ở phía trên bên phải',
        direction: '↘',
        startPercent: { x: 68, y: 30 },
        points: [{ x: 68, y: 30 }, { x: 76, y: 40 }]
      }
    ]
  },
  'き': {
    char: 'き',
    totalStrokes: 4,
    ruleHint: '2 nét ngang trên dưới trước, nét chéo xiên qua, nét uốn cong dưới cùng.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang trên',
        description: 'Ngang ngắn từ trái sang phải hơi chếch lên',
        direction: '→',
        startPercent: { x: 32, y: 28 },
        points: [{ x: 32, y: 28 }, { x: 66, y: 28 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét ngang dưới',
        description: 'Ngang dài hơn nét 1, song song bên dưới',
        direction: '→',
        startPercent: { x: 28, y: 42 },
        points: [{ x: 28, y: 42 }, { x: 72, y: 42 }]
      },
      {
        strokeNumber: 3,
        name: 'Nét chéo dọc có móc',
        description: 'Xiên chéo từ trên xuống cắt qua 2 nét ngang rồi móc nhẹ',
        direction: '↘⤴',
        startPercent: { x: 58, y: 16 },
        points: [{ x: 58, y: 16 }, { x: 50, y: 52 }, { x: 40, y: 68 }, { x: 44, y: 66 }]
      },
      {
        strokeNumber: 4,
        name: 'Nét uốn cong đáy',
        description: 'Lượn cong hình vòng cung phía dưới',
        direction: '⤵',
        startPercent: { x: 38, y: 74 },
        points: [{ x: 38, y: 74 }, { x: 56, y: 82 }, { x: 68, y: 74 }]
      }
    ]
  },
  'く': {
    char: 'く',
    totalStrokes: 1,
    ruleHint: 'Một nét liền duy nhất: xiên chéo xuống trái rồi gập góc xiên phải.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét góc gập nhọn',
        description: 'Kéo xiên chéo xuống sang trái rồi gập góc kéo xiên xuống phải',
        direction: '↙↘',
        startPercent: { x: 60, y: 24 },
        points: [{ x: 60, y: 24 }, { x: 34, y: 50 }, { x: 64, y: 78 }]
      }
    ]
  },
  'け': {
    char: 'け',
    totalStrokes: 3,
    ruleHint: 'Nét sổ móc trái trước, nét ngang giữa, nét cong phải sau cùng.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét sổ cong có móc',
        description: 'Sổ dọc bên trái hơi cong rồi móc nhẹ lên',
        direction: '↓⤴',
        startPercent: { x: 30, y: 20 },
        points: [{ x: 30, y: 20 }, { x: 28, y: 52 }, { x: 30, y: 76 }, { x: 34, y: 72 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét ngang ngắn',
        description: 'Kéo ngang ở khoảng giữa bên phải',
        direction: '→',
        startPercent: { x: 46, y: 36 },
        points: [{ x: 46, y: 36 }, { x: 74, y: 36 }]
      },
      {
        strokeNumber: 3,
        name: 'Nét sổ cong dài',
        description: 'Kéo từ trên cắt nét 2 xuống dưới uốn cong mềm mại',
        direction: '↓',
        startPercent: { x: 64, y: 18 },
        points: [{ x: 64, y: 18 }, { x: 64, y: 54 }, { x: 58, y: 82 }]
      }
    ]
  },
  'こ': {
    char: 'こ',
    totalStrokes: 2,
    ruleHint: 'Nét ngang trên móc nhẹ trước, nét ngang dưới hơi cong ngửa sau.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang trên có móc',
        description: 'Kéo ngang từ trái qua phải rồi móc nhẹ xuống',
        direction: '→⤵',
        startPercent: { x: 32, y: 32 },
        points: [{ x: 32, y: 32 }, { x: 68, y: 32 }, { x: 64, y: 38 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét cong ngửa dưới',
        description: 'Kéo từ trái qua phải hơi cong ngửa đáy lòng thuyền',
        direction: '→',
        startPercent: { x: 34, y: 68 },
        points: [{ x: 34, y: 68 }, { x: 52, y: 72 }, { x: 70, y: 66 }]
      }
    ]
  },
  'さ': {
    char: 'さ',
    totalStrokes: 3,
    ruleHint: 'Nét ngang trước, nét chéo xiên có móc, nét uốn cong đáy sau cùng.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang',
        description: 'Kéo ngang từ trái sang phải hơi xiên lên',
        direction: '→',
        startPercent: { x: 28, y: 34 },
        points: [{ x: 28, y: 34 }, { x: 72, y: 34 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét sổ xiên móc',
        description: 'Xiên từ trên xuống cắt nét ngang rồi móc nhẹ',
        direction: '↘⤴',
        startPercent: { x: 54, y: 20 },
        points: [{ x: 54, y: 20 }, { x: 48, y: 50 }, { x: 40, y: 62 }, { x: 44, y: 60 }]
      },
      {
        strokeNumber: 3,
        name: 'Nét uốn cong đáy',
        description: 'Vòng cung phía dưới hướng từ trái sang phải',
        direction: '⤵',
        startPercent: { x: 36, y: 68 },
        points: [{ x: 36, y: 68 }, { x: 54, y: 78 }, { x: 68, y: 70 }]
      }
    ]
  },
  'し': {
    char: 'し',
    totalStrokes: 1,
    ruleHint: 'Một nét lưỡi câu duy nhất: sổ dọc xuống rồi uốn cong hất lên.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét lưỡi câu',
        description: 'Kéo thẳng đứng xuống rồi uốn cong tròn hất lên trên bên phải',
        direction: '↓⤴',
        startPercent: { x: 38, y: 20 },
        points: [{ x: 38, y: 20 }, { x: 38, y: 60 }, { x: 46, y: 80 }, { x: 68, y: 66 }]
      }
    ]
  },
  'す': {
    char: 'す',
    totalStrokes: 2,
    ruleHint: 'Nét ngang dài trước, nét sổ có nút thắt tròn ở giữa sau.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang dài',
        description: 'Kéo ngang dài qua tâm từ trái sang phải',
        direction: '→',
        startPercent: { x: 24, y: 32 },
        points: [{ x: 24, y: 32 }, { x: 76, y: 32 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét sổ có nút thắt xoắn',
        description: 'Kéo sổ xuống, tạo nút thắt tròn sang trái rồi kéo thẳng mũi nhọn xuống',
        direction: '↓🔄↓',
        startPercent: { x: 54, y: 16 },
        points: [{ x: 54, y: 16 }, { x: 54, y: 48 }, { x: 38, y: 54 }, { x: 54, y: 60 }, { x: 52, y: 84 }]
      }
    ]
  },
  'せ': {
    char: 'せ',
    totalStrokes: 3,
    ruleHint: 'Nét ngang dài trước, nét sổ gập đáy, nét sổ trái sau cùng.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang',
        description: 'Kéo ngang từ trái sang phải',
        direction: '→',
        startPercent: { x: 26, y: 36 },
        points: [{ x: 26, y: 36 }, { x: 74, y: 36 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét sổ gập ngang đáy',
        description: 'Sổ dọc bên phải rồi gập ngang sang trái',
        direction: '↓→',
        startPercent: { x: 62, y: 20 },
        points: [{ x: 62, y: 20 }, { x: 62, y: 68 }, { x: 40, y: 70 }]
      },
      {
        strokeNumber: 3,
        name: 'Nét sổ trái có móc',
        description: 'Sổ dọc bên trái cắt qua nét 1 và móc nhẹ',
        direction: '↓',
        startPercent: { x: 40, y: 24 },
        points: [{ x: 40, y: 24 }, { x: 38, y: 58 }, { x: 36, y: 76 }]
      }
    ]
  },
  'そ': {
    char: 'そ',
    totalStrokes: 1,
    ruleHint: 'Một nét liền ziczac: ngang, chéo xuống, ngang, rồi uốn cong đáy.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ziczac lượn sóng',
        description: 'Ngang sang phải, xiên chéo xuống trái, ngang sang phải rồi uốn vòng cung đáy',
        direction: '→↙→⤵',
        startPercent: { x: 34, y: 24 },
        points: [{ x: 34, y: 24 }, { x: 62, y: 24 }, { x: 34, y: 48 }, { x: 64, y: 48 }, { x: 60, y: 74 }, { x: 42, y: 80 }]
      }
    ]
  },

  // === T-ROW (TA, CHI, TSU, TE, TO) ===
  'た': {
    char: 'た',
    totalStrokes: 4,
    ruleHint: 'Nét ngang trước, nét sổ cắt qua bên trái, nét ngang trên và nét cong dưới bên phải.',
    strokes: [
      { strokeNumber: 1, name: 'Nét ngang trên', description: 'Kéo ngang từ trái qua phải ở nửa trên bên trái', direction: '→', startPercent: { x: 20, y: 34 }, points: [{ x: 20, y: 34 }, { x: 50, y: 34 }] },
      { strokeNumber: 2, name: 'Nét xiên chéo', description: 'Kéo xiên chéo cắt qua nét 1', direction: '↙', startPercent: { x: 38, y: 18 }, points: [{ x: 38, y: 18 }, { x: 28, y: 74 }] },
      { strokeNumber: 3, name: 'Nét ngang ngắn phải', description: 'Nét ngang ngắn phía trên bên phải', direction: '→', startPercent: { x: 54, y: 40 }, points: [{ x: 54, y: 40 }, { x: 78, y: 40 }] },
      { strokeNumber: 4, name: 'Nét cong ngửa đáy', description: 'Nét cong ngửa hình đáy thuyền bên dưới', direction: '→⤵', startPercent: { x: 52, y: 64 }, points: [{ x: 52, y: 64 }, { x: 74, y: 64 }] }
    ]
  },
  'ち': {
    char: 'ち',
    totalStrokes: 2,
    ruleHint: 'Nét ngang trên trước, nét sổ gập uốn tròn bụng lớn sau.',
    strokes: [
      { strokeNumber: 1, name: 'Nét ngang', description: 'Kéo ngang từ trái sang phải hơi chếch lên', direction: '→', startPercent: { x: 26, y: 30 }, points: [{ x: 26, y: 30 }, { x: 74, y: 30 }] },
      { strokeNumber: 2, name: 'Nét sổ gập lượn cung', description: 'Sổ chéo xuống rồi uốn vòng cung tròn lớn như số 5', direction: '↙⤵', startPercent: { x: 50, y: 16 }, points: [{ x: 50, y: 16 }, { x: 42, y: 48 }, { x: 68, y: 48 }, { x: 72, y: 72 }, { x: 44, y: 84 }, { x: 30, y: 76 }] }
    ]
  },
  'つ': {
    char: 'つ',
    totalStrokes: 1,
    ruleHint: 'Một nét sóng lượn duy nhất: kéo chếch lên sang phải rồi uốn vòng cung lớn xuống đáy.',
    strokes: [
      { strokeNumber: 1, name: 'Nét sóng cong', description: 'Ngang xiên lên rồi lượn vòng cung tròn lớn sang trái', direction: '↗⤵', startPercent: { x: 26, y: 36 }, points: [{ x: 26, y: 36 }, { x: 68, y: 30 }, { x: 74, y: 56 }, { x: 54, y: 78 }, { x: 28, y: 76 }] }
    ]
  },
  'て': {
    char: 'て',
    totalStrokes: 1,
    ruleHint: 'Một nét liền: ngang từ trái sang phải rồi uốn vòng cung ngửa sang trái.',
    strokes: [
      { strokeNumber: 1, name: 'Nét ngang lượn cong', description: 'Kéo ngang sang phải rồi uốn vòng cung hình bán nguyệt', direction: '→⤵', startPercent: { x: 28, y: 30 }, points: [{ x: 28, y: 30 }, { x: 70, y: 30 }, { x: 62, y: 56 }, { x: 38, y: 74 }, { x: 58, y: 78 }] }
    ]
  },
  'と': {
    char: 'と',
    totalStrokes: 2,
    ruleHint: 'Nét sổ xiên ngắn trước, nét uốn cong ôm lấy sau.',
    strokes: [
      { strokeNumber: 1, name: 'Nét xiên ngắn', description: 'Kéo nét xiên chéo từ trên xuống sang phải', direction: '↘', startPercent: { x: 38, y: 22 }, points: [{ x: 38, y: 22 }, { x: 48, y: 44 }] },
      { strokeNumber: 2, name: 'Nét uốn cong ngửa', description: 'Kéo từ trên chạm nét 1 rồi lượn vòng cung ngửa lớn', direction: '⤵', startPercent: { x: 64, y: 38 }, points: [{ x: 64, y: 38 }, { x: 44, y: 48 }, { x: 44, y: 72 }, { x: 72, y: 72 }] }
    ]
  },

  // === N-ROW (NA, NI, NU, NE, NO) ===
  'な': {
    char: 'な',
    totalStrokes: 4,
    ruleHint: 'Ngang trước, sổ xiên móc, dấu chấm phải, nét sổ xoắn thắt nút sau cùng.',
    strokes: [
      { strokeNumber: 1, name: 'Nét ngang', description: 'Kéo ngang ngắn ở góc trên trái', direction: '→', startPercent: { x: 24, y: 34 }, points: [{ x: 24, y: 34 }, { x: 52, y: 34 }] },
      { strokeNumber: 2, name: 'Nét sổ xiên móc', description: 'Xiên chéo cắt nét ngang rồi móc nhẹ', direction: '↙⤴', startPercent: { x: 42, y: 20 }, points: [{ x: 42, y: 20 }, { x: 34, y: 64 }] },
      { strokeNumber: 3, name: 'Dấu phẩy phải', description: 'Chấm phẩy ở nửa trên bên phải', direction: '↘', startPercent: { x: 64, y: 32 }, points: [{ x: 64, y: 32 }, { x: 74, y: 40 }] },
      { strokeNumber: 4, name: 'Nét sổ có nút thắt', description: 'Sổ dọc bên phải tạo nút thắt tròn rồi vuốt nhọn', direction: '↓🔄', startPercent: { x: 60, y: 48 }, points: [{ x: 60, y: 48 }, { x: 60, y: 72 }, { x: 48, y: 76 }, { x: 64, y: 76 }] }
    ]
  },
  'に': {
    char: 'に',
    totalStrokes: 3,
    ruleHint: 'Nét sổ móc trái trước, 2 nét ngang song song bên phải sau.',
    strokes: [
      { strokeNumber: 1, name: 'Nét sổ móc trái', description: 'Sổ dọc bên trái rồi móc nhẹ lên', direction: '↓⤴', startPercent: { x: 30, y: 22 }, points: [{ x: 30, y: 22 }, { x: 28, y: 74 }, { x: 34, y: 70 }] },
      { strokeNumber: 2, name: 'Nét ngang trên', description: 'Kéo ngang ngắn ở nửa trên bên phải', direction: '→', startPercent: { x: 52, y: 36 }, points: [{ x: 52, y: 36 }, { x: 76, y: 36 }] },
      { strokeNumber: 3, name: 'Nét ngang dưới', description: 'Kéo ngang hơi cong ngửa ở dưới', direction: '→', startPercent: { x: 50, y: 66 }, points: [{ x: 50, y: 66 }, { x: 78, y: 66 }] }
    ]
  },
  'の': {
    char: 'の',
    totalStrokes: 1,
    ruleHint: 'Một nét cuộn tròn duy nhất: sổ chéo xuống rồi cuộn vòng cung lớn bao quanh.',
    strokes: [
      { strokeNumber: 1, name: 'Nét cuộn tròn', description: 'Xiên chéo xuống từ tâm rồi lượn vòng cung tròn lớn như vỏ ốc', direction: '↙⤴⤵', startPercent: { x: 54, y: 28 }, points: [{ x: 54, y: 28 }, { x: 38, y: 66 }, { x: 56, y: 82 }, { x: 74, y: 64 }, { x: 66, y: 36 }, { x: 42, y: 48 }] }
    ]
  },

  // === R-ROW (RA, RI, RU, RE, RO) ===
  'り': {
    char: 'り',
    totalStrokes: 2,
    ruleHint: 'Chuẩn chữ viết tay: Hai nét TÁCH RỜI nhau, nét trái ngắn có móc, nét phải dài cong nhẹ.',
    strokes: [
      { strokeNumber: 1, name: 'Nét sổ móc trái', description: 'Sổ dọc bên trái hơi cong rồi hất móc nhẹ (tách rời với nét 2)', direction: '↓⤴', startPercent: { x: 32, y: 28 }, points: [{ x: 32, y: 28 }, { x: 30, y: 56 }, { x: 36, y: 52 }] },
      { strokeNumber: 2, name: 'Nét sổ cong phải dài', description: 'Bắt đầu từ đỉnh bên phải, kéo dài xuống đáy uốn cong nhẹ sang trái', direction: '↓↙', startPercent: { x: 68, y: 18 }, points: [{ x: 68, y: 18 }, { x: 70, y: 54 }, { x: 62, y: 82 }, { x: 52, y: 80 }] }
    ]
  },
  'ふ': {
    char: 'ふ',
    totalStrokes: 4,
    ruleHint: 'Dấu phẩy đỉnh trước, nét sổ cong giữa, dấu phẩy trái, dấu mác phải sau cùng.',
    strokes: [
      { strokeNumber: 1, name: 'Dấu chấm đỉnh', description: 'Chấm nét ngắn ở đỉnh đầu', direction: '↘', startPercent: { x: 48, y: 18 }, points: [{ x: 48, y: 18 }, { x: 54, y: 26 }] },
      { strokeNumber: 2, name: 'Nét sổ cong móc giữa', description: 'Kéo từ trên xuống rồi uốn cong móc sang trái', direction: '↓⤴', startPercent: { x: 50, y: 34 }, points: [{ x: 50, y: 34 }, { x: 46, y: 58 }, { x: 38, y: 64 }] },
      { strokeNumber: 3, name: 'Dấu phẩy trái', description: 'Chấm xiên bên trái', direction: '↙', startPercent: { x: 26, y: 52 }, points: [{ x: 26, y: 52 }, { x: 20, y: 64 }] },
      { strokeNumber: 4, name: 'Dấu mác phải', description: 'Chấm xiên bên phải', direction: '↘', startPercent: { x: 72, y: 50 }, points: [{ x: 72, y: 50 }, { x: 80, y: 62 }] }
    ]
  },
  'ん': {
    char: 'ん',
    totalStrokes: 1,
    ruleHint: 'Một nét liền: Sổ xiên xuống, hất lên sang phải rồi uốn lượn hất đuôi.',
    strokes: [
      { strokeNumber: 1, name: 'Nét chữ N mềm mại', description: 'Xiên chéo xuống từ trái, hất chéo lên rồi uốn lượn hất đuôi lên trên', direction: '↙↗⤵⤴', startPercent: { x: 36, y: 24 }, points: [{ x: 36, y: 24 }, { x: 28, y: 72 }, { x: 46, y: 46 }, { x: 66, y: 46 }, { x: 62, y: 74 }, { x: 76, y: 72 }] }
    ]
  },

  // === CORE KANJI EXAMPLES ===
  '一': {
    char: '一',
    totalStrokes: 1,
    ruleHint: 'Nét ngang duy nhất: đặt bút bên trái, kéo đều tay sang phải, hơi nhấn đuôi.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang (Nhất)',
        description: 'Kéo dứt khoát từ trái sang phải, điểm dừng hơi nhấn nhẹ',
        direction: '→',
        startPercent: { x: 20, y: 50 },
        points: [{ x: 20, y: 50 }, { x: 50, y: 50 }, { x: 80, y: 50 }]
      }
    ]
  },
  '二': {
    char: '二',
    totalStrokes: 2,
    ruleHint: 'Nét trên ngắn hơn, nét dưới dài hơn làm bệ đỡ.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang trên ngắn',
        description: 'Kéo ngang ngắn ở nửa trên',
        direction: '→',
        startPercent: { x: 30, y: 35 },
        points: [{ x: 30, y: 35 }, { x: 70, y: 35 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét ngang dưới dài',
        description: 'Kéo ngang dài ở nửa dưới cân đối',
        direction: '→',
        startPercent: { x: 18, y: 65 },
        points: [{ x: 18, y: 65 }, { x: 82, y: 65 }]
      }
    ]
  },
  '三': {
    char: '三',
    totalStrokes: 3,
    ruleHint: 'Quy tắc từ trên xuống dưới: nét trên vừa, nét giữa ngắn nhất, nét đáy dài nhất.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang trên',
        description: 'Kéo ngang độ dài vừa phải ở trên',
        direction: '→',
        startPercent: { x: 28, y: 28 },
        points: [{ x: 28, y: 28 }, { x: 72, y: 28 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét ngang giữa ngắn',
        description: 'Kéo ngang ngắn nhất ở chính giữa',
        direction: '→',
        startPercent: { x: 34, y: 50 },
        points: [{ x: 34, y: 50 }, { x: 66, y: 50 }]
      },
      {
        strokeNumber: 3,
        name: 'Nét ngang đáy dài',
        description: 'Kéo ngang dài nhất vững chãi ở đáy',
        direction: '→',
        startPercent: { x: 16, y: 72 },
        points: [{ x: 16, y: 72 }, { x: 84, y: 72 }]
      }
    ]
  },
  '十': {
    char: '十',
    totalStrokes: 2,
    ruleHint: 'Quy tắc vàng thư pháp: Nét ngang trước, nét sổ sau.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang',
        description: 'Kéo ngang cân đối từ trái sang phải',
        direction: '→',
        startPercent: { x: 20, y: 48 },
        points: [{ x: 20, y: 48 }, { x: 80, y: 48 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét sổ dọc',
        description: 'Kéo sổ thẳng đứng từ trên xuống xuyên qua nét ngang',
        direction: '↓',
        startPercent: { x: 50, y: 18 },
        points: [{ x: 50, y: 18 }, { x: 50, y: 82 }]
      }
    ]
  },
  '日': {
    char: '日',
    totalStrokes: 4,
    ruleHint: 'Sổ trái trước ➔ Khung ngang gập móc ➔ Nét ngang giữa ➔ Nét đóng đáy sau cùng.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét sổ trái',
        description: 'Sổ thẳng đứng cạnh trái của khung chữ',
        direction: '↓',
        startPercent: { x: 28, y: 22 },
        points: [{ x: 28, y: 22 }, { x: 28, y: 78 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét ngang gập móc',
        description: 'Kéo ngang sang phải rồi gập vuông góc xuống cạnh phải',
        direction: '→↓',
        startPercent: { x: 28, y: 22 },
        points: [{ x: 28, y: 22 }, { x: 72, y: 22 }, { x: 72, y: 78 }]
      },
      {
        strokeNumber: 3,
        name: 'Nét ngang giữa',
        description: 'Kéo ngang bên trong ngăn đôi hình chữ nhật',
        direction: '→',
        startPercent: { x: 28, y: 50 },
        points: [{ x: 28, y: 50 }, { x: 72, y: 50 }]
      },
      {
        strokeNumber: 4,
        name: 'Nét đóng đáy',
        description: 'Đóng kín đáy khung chữ từ trái sang phải',
        direction: '→',
        startPercent: { x: 28, y: 78 },
        points: [{ x: 28, y: 78 }, { x: 72, y: 78 }]
      }
    ]
  },
  '月': {
    char: '月',
    totalStrokes: 4,
    ruleHint: 'Phẩy sổ trái ➔ Ngang gập móc ➔ Hai nét ngang bên trong.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét phẩy sổ trái',
        description: 'Kéo từ trên xuống hơi cong nhẹ sang trái',
        direction: '↓↙',
        startPercent: { x: 30, y: 18 },
        points: [{ x: 30, y: 18 }, { x: 28, y: 55 }, { x: 24, y: 82 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét ngang gập móc phải',
        description: 'Kéo ngang rồi gập vuông xuống có móc nhọn',
        direction: '→↓⤴',
        startPercent: { x: 30, y: 18 },
        points: [{ x: 30, y: 18 }, { x: 70, y: 18 }, { x: 70, y: 78 }, { x: 64, y: 72 }]
      },
      {
        strokeNumber: 3,
        name: 'Nét ngang giữa 1',
        description: 'Nét ngang trên trong bụng chữ',
        direction: '→',
        startPercent: { x: 30, y: 40 },
        points: [{ x: 30, y: 40 }, { x: 68, y: 40 }]
      },
      {
        strokeNumber: 4,
        name: 'Nét ngang giữa 2',
        description: 'Nét ngang dưới trong bụng chữ',
        direction: '→',
        startPercent: { x: 30, y: 58 },
        points: [{ x: 30, y: 58 }, { x: 68, y: 58 }]
      }
    ]
  },
  '木': {
    char: '木',
    totalStrokes: 4,
    ruleHint: 'Ngang trước ➔ Sổ dọc giữa ➔ Phẩy trái ➔ Mác phải.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét ngang',
        description: 'Kéo ngang thân cây từ trái sang phải',
        direction: '→',
        startPercent: { x: 20, y: 40 },
        points: [{ x: 20, y: 40 }, { x: 80, y: 40 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét sổ dọc móc nhẹ',
        description: 'Kéo sổ thẳng đứng làm thân cây',
        direction: '↓',
        startPercent: { x: 50, y: 18 },
        points: [{ x: 50, y: 18 }, { x: 50, y: 84 }]
      },
      {
        strokeNumber: 3,
        name: 'Nét phẩy xiên trái',
        description: 'Kéo cành cây xiên sang trái',
        direction: '↙',
        startPercent: { x: 50, y: 40 },
        points: [{ x: 50, y: 40 }, { x: 26, y: 74 }]
      },
      {
        strokeNumber: 4,
        name: 'Nét mác xiên phải',
        description: 'Kéo cành cây xiên sang phải',
        direction: '↘',
        startPercent: { x: 50, y: 40 },
        points: [{ x: 50, y: 40 }, { x: 74, y: 74 }]
      }
    ]
  },
  '人': {
    char: '人',
    totalStrokes: 2,
    ruleHint: 'Nét phẩy trái dài trước, nét mác phải tựa vào nét trái sau.',
    strokes: [
      {
        strokeNumber: 1,
        name: 'Nét phẩy trái',
        description: 'Bắt đầu từ đỉnh xiên cong sang trái',
        direction: '↙',
        startPercent: { x: 50, y: 20 },
        points: [{ x: 50, y: 20 }, { x: 44, y: 50 }, { x: 24, y: 80 }]
      },
      {
        strokeNumber: 2,
        name: 'Nét mác phải',
        description: 'Tựa vào nét 1 xiên cong sang phải tạo thế đứng',
        direction: '↘',
        startPercent: { x: 46, y: 46 },
        points: [{ x: 46, y: 46 }, { x: 58, y: 64 }, { x: 76, y: 80 }]
      }
    ]
  }
};

// Fallback Generator: Generates standard stroke guide for any character
export function getStrokeGuide(char: string, totalStrokesFallback: number = 3): CharacterStrokeData {
  if (STROKE_DATA_MAP[char]) {
    return STROKE_DATA_MAP[char];
  }

  // Generate generic stroke sequence based on character's stroke count
  const count = Math.max(1, Math.min(totalStrokesFallback || 3, 8));
  const generatedStrokes: StrokeStep[] = [];

  const genericDirs = ['→', '↓', '↙', '↘', '→↓', '⤵', '⤴', '→'];
  const genericNames = [
    'Nét 1 (Ngang/Khởi đầu)',
    'Nét 2 (Sổ/Cắt ngang)',
    'Nét 3 (Nội bộ/Uốn lượn)',
    'Nét 4 (Bao quanh/Đáy)',
    'Nét 5 (Chi tiết trong)',
    'Nét 6 (Chốt khung)',
    'Nét 7 (Điểm xuyết)',
    'Nét 8 (Đóng đáy hoàn chỉnh)'
  ];

  for (let i = 0; i < count; i++) {
    const yStep = 25 + Math.round((i * 50) / Math.max(count - 1, 1));
    const xStep = 25 + (i % 3) * 20;

    generatedStrokes.push({
      strokeNumber: i + 1,
      name: genericNames[i] || `Nét ${i + 1}`,
      description: `Quy tắc thư pháp chuẩn Nhật: Nét thứ ${i + 1}/${count}`,
      direction: genericDirs[i % genericDirs.length],
      startPercent: { x: xStep, y: yStep },
      points: [
        { x: xStep, y: yStep },
        { x: Math.min(80, xStep + 25), y: Math.min(80, yStep + 10) }
      ]
    });
  }

  return {
    char,
    totalStrokes: count,
    ruleHint: 'Quy tắc chuẩn Nhật: Từ trên xuống dưới, từ trái sang phải, nét ngang trước nét sổ sau.',
    strokes: generatedStrokes
  };
}
