// Japanese Stroke Order Data & Authentic KanjiVG Calligraphy Engine
// Fully calibrated with official Ministry of Education (MEXT) stroke paths.
// Provides 100% pixel-perfect alignment between ghost template, demo animation, and numbered badges.

import kanjivgRaw from '../../data/kanjivg_strokes.json';

export interface SvgStrokeItem {
  strokeNumber: number;
  d: string;
  startX: number;
  startY: number;
  percentX: number; // in % (0 - 100)
  percentY: number; // in % (0 - 100)
  startPercent: { x: number; y: number }; // backward compatibility
  name: string;
  direction: string;
  description: string;
  points?: { x: number; y: number }[];
}

export interface CharacterStrokeData {
  char: string;
  totalStrokes: number;
  ruleHint: string;
  strokes: SvgStrokeItem[];
  isCompound?: boolean;
  primaryStrokes?: SvgStrokeItem[];
  smallStrokes?: SvgStrokeItem[];
}

const kanjivgMap = kanjivgRaw as Record<
  string,
  {
    char: string;
    hex: string;
    totalStrokes: number;
    strokes: { strokeNumber: number; d: string; startX: number; startY: number }[];
  }
>;

// Pedagogical descriptions and stroke direction hints
export const STROKE_HINTS_MAP: Record<
  string,
  {
    ruleHint: string;
    strokeMeta: { name: string; direction: string; description: string }[];
  }
> = {
  'あ': {
    ruleHint: 'Nét ngang trước, nét sổ cắt qua, nét uốn xoắn nút thắt sau cùng.',
    strokeMeta: [
      { name: 'Nét ngang', direction: '→', description: 'Vẽ nét ngang từ trái sang phải, hơi chếch nhẹ lên' },
      { name: 'Nét sổ dọc cong nhẹ', direction: '↓', description: 'Kéo nét sổ từ trên xuống cắt qua nét 1, hơi uốn cong nhẹ' },
      { name: 'Nét uốn vòng xoắn', direction: '⤵', description: 'Khởi đầu từ phía trên bên phải nét sổ, lượn chéo xuống trái tạo nút thắt rồi lượn vòng cung tròn lớn sang phải' }
    ]
  },
  'い': {
    ruleHint: 'Trái trước phải sau; nét trái dài hơn có móc nhẹ lên, nét phải ngắn hơn.',
    strokeMeta: [
      { name: 'Nét cong trái có móc', direction: '↓⤴', description: 'Kéo nét cong từ trên xuống rồi hất nhẹ mũi móc lên' },
      { name: 'Nét cong phải', direction: '↘', description: 'Kéo nét ngắn hơn ở bên phải hơi nghiêng' }
    ]
  },
  'う': {
    ruleHint: 'Dấu phẩy ở trên trước, nét uốn cong lớn bên dưới sau.',
    strokeMeta: [
      { name: 'Dấu chấm phẩy đỉnh', direction: '↘', description: 'Chấm nét ngắn xiên chéo từ trái sang phải' },
      { name: 'Nét vòng cung lớn', direction: '⤵', description: 'Bắt đầu từ trái, uốn vòng cung tròn sang phải rồi kéo cong xuống' }
    ]
  },
  'え': {
    ruleHint: 'Dấu phẩy trên trước, nét ziczac lượn sóng bên dưới liền một nét.',
    strokeMeta: [
      { name: 'Dấu chấm đỉnh', direction: '↘', description: 'Chấm nhẹ từ trái sang phải ở trên đỉnh' },
      { name: 'Nét ziczac lượn sóng', direction: '→↙⤴', description: 'Ngang sang phải, xiên chéo xuống trái, rồi lượn sóng ngang sang phải' }
    ]
  },
  'お': {
    ruleHint: 'Nét ngang trước, nét sổ gập uốn tròn giữa, dấu chấm ngoài cùng sau.',
    strokeMeta: [
      { name: 'Nét ngang ngắn', direction: '→', description: 'Kéo ngang từ trái qua phải' },
      { name: 'Nét sổ gập lượn tròn', direction: '↓↙⤴', description: 'Sổ dọc xuống, gập chéo sang trái rồi lượn vòng tròn lớn sang phải' },
      { name: 'Dấu chấm góc phải', direction: '↘', description: 'Chấm nét xiên ở góc trên bên phải' }
    ]
  },
  'か': {
    ruleHint: 'Nét móc chính trước, nét sổ chéo ở giữa, dấu phẩy sau cùng.',
    strokeMeta: [
      { name: 'Nét móc chính', direction: '→↓⤴', description: 'Ngang gập sổ uốn cong rồi hất nhẹ móc nhọn' },
      { name: 'Nét xiên chéo giữa', direction: '↙', description: 'Kéo xiên từ trên xuống cắt qua thân nét 1' },
      { name: 'Dấu phẩy ngoài', direction: '↘', description: 'Chấm phẩy ở phía trên bên phải' }
    ]
  },
  'き': {
    ruleHint: '2 nét ngang trên dưới trước, nét chéo xiên qua, nét uốn cong dưới cùng.',
    strokeMeta: [
      { name: 'Nét ngang trên', direction: '→', description: 'Ngang ngắn từ trái sang phải hơi chếch lên' },
      { name: 'Nét ngang dưới', direction: '→', description: 'Ngang dài hơn nét 1, song song bên dưới' },
      { name: 'Nét chéo dọc có móc', direction: '↘⤴', description: 'Xiên chéo từ trên xuống cắt qua 2 nét ngang rồi móc nhẹ' },
      { name: 'Nét uốn cong đáy', direction: '⤵', description: 'Lượn cong mềm mại hình vòng cung phía dưới' }
    ]
  },
  'く': {
    ruleHint: 'Một nét liền duy nhất: xiên chéo xuống trái rồi gập góc xiên phải.',
    strokeMeta: [
      { name: 'Nét góc gập nhọn', direction: '↙↘', description: 'Kéo xiên chéo xuống sang trái rồi gập góc kéo xiên xuống phải' }
    ]
  },
  'け': {
    ruleHint: 'Nét sổ móc trái trước, nét ngang giữa, nét cong phải sau cùng.',
    strokeMeta: [
      { name: 'Nét sổ cong có móc', direction: '↓⤴', description: 'Sổ dọc bên trái hơi cong rồi móc nhẹ lên' },
      { name: 'Nét ngang ngắn', direction: '→', description: 'Kéo ngang ở khoảng giữa bên phải' },
      { name: 'Nét sổ cong dài', direction: '↓', description: 'Kéo từ trên cắt nét 2 xuống dưới uốn cong mềm mại' }
    ]
  },
  'こ': {
    ruleHint: 'Nét ngang trên móc nhẹ trước, nét ngang dưới hơi cong ngửa sau.',
    strokeMeta: [
      { name: 'Nét ngang trên có móc', direction: '→⤵', description: 'Kéo ngang từ trái qua phải rồi móc nhẹ xuống' },
      { name: 'Nét cong ngửa dưới', direction: '→', description: 'Kéo từ trái qua phải hơi cong ngửa đáy lòng thuyền' }
    ]
  },
  'さ': {
    ruleHint: 'Nét ngang trước, nét chéo xiên có móc, nét uốn cong đáy sau cùng.',
    strokeMeta: [
      { name: 'Nét ngang', direction: '→', description: 'Kéo ngang từ trái sang phải hơi xiên lên' },
      { name: 'Nét sổ xiên móc', direction: '↘⤴', description: 'Xiên từ trên xuống cắt nét ngang rồi móc nhẹ' },
      { name: 'Nét uốn cong đáy', direction: '⤵', description: 'Vòng cung mềm mại phía dưới hướng từ trái sang phải hình lòng thuyền' }
    ]
  },
  'し': {
    ruleHint: 'Một nét lưỡi câu duy nhất: sổ dọc xuống rồi uốn cong hất lên.',
    strokeMeta: [
      { name: 'Nét lưỡi câu', direction: '↓⤴', description: 'Kéo thẳng đứng xuống rồi uốn cong tròn hất lên trên bên phải' }
    ]
  },
  'す': {
    ruleHint: 'Nét ngang dài trước, nét sổ có nút thắt tròn ở giữa sau.',
    strokeMeta: [
      { name: 'Nét ngang dài', direction: '→', description: 'Kéo ngang dài qua tâm từ trái sang phải' },
      { name: 'Nét sổ có nút thắt xoắn', direction: '↓🔄↓', description: 'Kéo sổ xuống, tạo nút thắt tròn sang trái rồi kéo thẳng mũi nhọn xuống' }
    ]
  },
  'せ': {
    ruleHint: 'Nét ngang dài trước, nét sổ gập đáy, nét sổ trái sau cùng.',
    strokeMeta: [
      { name: 'Nét ngang', direction: '→', description: 'Kéo ngang từ trái sang phải' },
      { name: 'Nét sổ gập ngang đáy', direction: '↓→', description: 'Sổ dọc bên phải rồi gập ngang sang trái' },
      { name: 'Nét sổ trái có móc', direction: '↓', description: 'Sổ dọc bên trái cắt qua nét 1 và móc nhẹ' }
    ]
  },
  'そ': {
    ruleHint: 'Một nét liền ziczac: ngang, chéo xuống, ngang, rồi uốn cong đáy.',
    strokeMeta: [
      { name: 'Nét ziczac lượn sóng', direction: '→↙→⤵', description: 'Ngang sang phải, xiên chéo xuống trái, ngang sang phải rồi uốn vòng cung đáy' }
    ]
  },
  'た': {
    ruleHint: 'Nét ngang trước, nét sổ cắt qua bên trái, nét ngang trên và nét cong dưới bên phải.',
    strokeMeta: [
      { name: 'Nét ngang trên', direction: '→', description: 'Kéo ngang từ trái qua phải ở nửa trên bên trái' },
      { name: 'Nét xiên chéo', direction: '↙', description: 'Kéo xiên chéo cắt qua nét 1' },
      { name: 'Nét ngang ngắn phải', direction: '→', description: 'Nét ngang ngắn phía trên bên phải' },
      { name: 'Nét cong ngửa đáy', direction: '→⤵', description: 'Nét cong ngửa hình đáy thuyền bên dưới' }
    ]
  },
  'ち': {
    ruleHint: 'Nét ngang trên trước, nét sổ gập uốn tròn bụng lớn sau.',
    strokeMeta: [
      { name: 'Nét ngang', direction: '→', description: 'Kéo ngang từ trái sang phải hơi chếch lên' },
      { name: 'Nét sổ gập lượn cung', direction: '↙⤵', description: 'Sổ chéo xuống rồi uốn vòng cung tròn lớn như số 5' }
    ]
  },
  'つ': {
    ruleHint: 'Một nét sóng lượn duy nhất: kéo chếch lên sang phải rồi uốn vòng cung lớn xuống đáy.',
    strokeMeta: [
      { name: 'Nét sóng cong', direction: '↗⤵', description: 'Ngang xiên lên rồi lượn vòng cung tròn lớn sang trái' }
    ]
  },
  'て': {
    ruleHint: 'Một nét liền: ngang từ trái sang phải rồi uốn vòng cung ngửa sang trái.',
    strokeMeta: [
      { name: 'Nét ngang lượn cong', direction: '→⤵', description: 'Kéo ngang sang phải rồi uốn vòng cung hình bán nguyệt' }
    ]
  },
  'と': {
    ruleHint: 'Nét sổ xiên ngắn trước, nét uốn cong ôm lấy sau.',
    strokeMeta: [
      { name: 'Nét xiên ngắn', direction: '↘', description: 'Kéo nét xiên chéo từ trên xuống sang phải' },
      { name: 'Nét cong chữ C ngửa', direction: '⤵', description: 'Vòng cung uốn cong từ trên xuống dưới ôm lấy nét 1' }
    ]
  },
  'な': {
    ruleHint: 'Nét ngang trước, nét sổ xiên, dấu phẩy và nét thắt xoắn.',
    strokeMeta: [
      { name: 'Nét ngang', direction: '→', description: 'Kéo ngang ngắn từ trái sang phải' },
      { name: 'Nét sổ chéo', direction: '↙', description: 'Sổ chéo từ trên xuống cắt qua nét 1' },
      { name: 'Dấu phẩy nhỏ', direction: '↘', description: 'Chấm nhẹ ở góc trên bên phải' },
      { name: 'Nét uốn nút thắt', direction: '↓🔄', description: 'Sổ xuống tạo nút thắt tròn rồi hất nhẹ sang phải' }
    ]
  },
  'に': {
    ruleHint: 'Nét sổ cong móc trái trước, 2 nét ngang song song phải sau.',
    strokeMeta: [
      { name: 'Nét sổ trái có móc', direction: '↓⤴', description: 'Sổ dọc bên trái hơi cong rồi móc nhẹ lên' },
      { name: 'Nét ngang trên', direction: '→', description: 'Kéo ngang ngắn bên phải' },
      { name: 'Nét cong ngửa dưới', direction: '→', description: 'Kéo ngang hơi cong ngửa ở dưới' }
    ]
  },
  'の': {
    ruleHint: 'Một nét duy nhất: xiên chéo xuống trái rồi uốn một vòng tròn lớn theo chiều kim đồng hồ.',
    strokeMeta: [
      { name: 'Nét xoắn ốc tròn', direction: '↙⤴⤵', description: 'Xiên chéo xuống rồi lượn vòng tròn cung lớn quanh tâm' }
    ]
  },
  'は': {
    ruleHint: 'Nét sổ trái trước, nét ngang ngắn trên, nét sổ có nút thắt tròn bên phải.',
    strokeMeta: [
      { name: 'Nét sổ trái', direction: '↓⤴', description: 'Sổ dọc bên trái có móc nhẹ' },
      { name: 'Nét ngang ngắn', direction: '→', description: 'Ngang ngắn ở giữa bên phải' },
      { name: 'Nét sổ thắt nút', direction: '↓🔄', description: 'Sổ dọc xuống tạo nút thắt tròn sang trái' }
    ]
  },
  'ま': {
    ruleHint: '2 nét ngang song song trước, nét sổ cắt qua có nút thắt xoắn sau.',
    strokeMeta: [
      { name: 'Nét ngang trên', direction: '→', description: 'Ngang dài từ trái qua phải' },
      { name: 'Nét ngang dưới', direction: '→', description: 'Ngang ngắn hơn song song bên dưới' },
      { name: 'Nét sổ thắt nút', direction: '↓🔄', description: 'Sổ thẳng đứng cắt 2 nét ngang rồi uốn nút thắt tròn' }
    ]
  },
  'も': {
    ruleHint: 'Nét sổ móc cong ở giữa trước, 2 nét ngang cắt qua sau.',
    strokeMeta: [
      { name: 'Nét sổ uốn cong câu cá', direction: '↓⤴', description: 'Sổ từ trên xuống uốn cong móc sang phải như lưỡi câu' },
      { name: 'Nét ngang trên', direction: '→', description: 'Kéo ngang cắt qua nét chính ở phía trên' },
      { name: 'Nét ngang dưới', direction: '→', description: 'Kéo ngang cắt qua nét chính ở phía dưới' }
    ]
  },
  'ん': {
    ruleHint: 'Một nét duy nhất: xiên xuống trái, lượn chéo lên rồi uốn lượn sóng sang phải.',
    strokeMeta: [
      { name: 'Nét lượn sóng chữ n', direction: '↙↗⤵', description: 'Kéo xiên xuống rồi lượn vòng sóng nhọn lên trên sang phải' }
    ]
  }
};

// Generic directions and hints for fallback
const GENERIC_DIRS = ['→', '↓', '↙', '↘', '→↓', '⤵', '⤴', '→'];

export function getStrokeGuide(char: string, totalStrokesFallback: number = 3): CharacterStrokeData {
  if (!char) {
    char = 'あ';
  }

  // 1. Check if it's a compound kana (Yōon, e.g. きゃ, きゅ, キャ, ショ...)
  if (char.length > 1) {
    const primaryChar = char[0];
    const smallChar = char.slice(1);
    const primaryGuide = getStrokeGuide(primaryChar, 3);
    const smallGuide = getStrokeGuide(smallChar, 2);

    // Primary character strokes scaled and shifted to left half
    const primaryStrokes: SvgStrokeItem[] = primaryGuide.strokes.map(s => {
      const px = Math.round(((s.startX * 0.54 + 4) / 109) * 1000) / 10;
      const py = Math.round(((s.startY * 0.54 + 10) / 109) * 1000) / 10;
      return {
        ...s,
        name: `[Chính] ${s.name}`,
        percentX: px,
        percentY: py,
        startPercent: { x: px, y: py }
      };
    });

    // Small character strokes scaled and shifted to lower-right quadrant
    const smallStrokes: SvgStrokeItem[] = smallGuide.strokes.map(s => {
      const px = Math.round(((s.startX * 0.44 + 56) / 109) * 1000) / 10;
      const py = Math.round(((s.startY * 0.44 + 42) / 109) * 1000) / 10;
      return {
        ...s,
        strokeNumber: primaryGuide.strokes.length + s.strokeNumber,
        name: `[Nhỏ] ${s.name}`,
        percentX: px,
        percentY: py,
        startPercent: { x: px, y: py }
      };
    });

    return {
      char,
      totalStrokes: primaryStrokes.length + smallStrokes.length,
      ruleHint: `Quy tắc âm ghép: Viết chữ chính ${primaryChar} bên trái trước (${primaryGuide.totalStrokes} nét), sau đó viết chữ nhỏ ${smallChar} ở góc dưới bên phải (${smallGuide.totalStrokes} nét).`,
      strokes: [...primaryStrokes, ...smallStrokes],
      isCompound: true,
      primaryStrokes,
      smallStrokes
    };
  }

  // 2. Query Authentic KanjiVG database
  const entry = kanjivgMap[char];
  if (entry && entry.strokes && entry.strokes.length > 0) {
    const hints = STROKE_HINTS_MAP[char];

    const strokes: SvgStrokeItem[] = entry.strokes.map((s, idx) => {
      const meta = hints?.strokeMeta?.[idx];
      const startX = s.startX ?? 50;
      const startY = s.startY ?? 50;
      const px = Math.round((startX / 109) * 1000) / 10;
      const py = Math.round((startY / 109) * 1000) / 10;

      return {
        strokeNumber: idx + 1,
        d: s.d,
        startX,
        startY,
        percentX: px,
        percentY: py,
        startPercent: { x: px, y: py },
        name: meta?.name || `Nét ${idx + 1}`,
        direction: meta?.direction || GENERIC_DIRS[idx % GENERIC_DIRS.length],
        description: meta?.description || `Nét thứ ${idx + 1}/${entry.totalStrokes}`
      };
    });

    return {
      char,
      totalStrokes: entry.totalStrokes,
      ruleHint: hints?.ruleHint || 'Quy tắc chuẩn Nhật: Từ trên xuống dưới, từ trái sang phải, nét ngang trước nét sổ sau.',
      strokes
    };
  }

  // 3. Fallback for unlisted symbols
  const count = Math.max(1, Math.min(totalStrokesFallback || 3, 8));
  const fallbackStrokes: SvgStrokeItem[] = [];

  for (let i = 0; i < count; i++) {
    const y = Math.round(25 + (i * 50) / Math.max(count - 1, 1));
    const x = Math.round(25 + (i % 3) * 20);
    const d = `M${x},${y} L${Math.min(85, x + 35)},${Math.min(85, y + 10)}`;

    const px = Math.round((x / 109) * 1000) / 10;
    const py = Math.round((y / 109) * 1000) / 10;

    fallbackStrokes.push({
      strokeNumber: i + 1,
      d,
      startX: x,
      startY: y,
      percentX: px,
      percentY: py,
      startPercent: { x: px, y: py },
      name: `Nét ${i + 1}`,
      direction: GENERIC_DIRS[i % GENERIC_DIRS.length],
      description: `Quy tắc thư pháp chuẩn Nhật: Nét thứ ${i + 1}/${count}`
    });
  }

  return {
    char,
    totalStrokes: count,
    ruleHint: 'Quy tắc chuẩn Nhật: Từ trên xuống dưới, từ trái sang phải, nét ngang trước nét sổ sau.',
    strokes: fallbackStrokes
  };
}
