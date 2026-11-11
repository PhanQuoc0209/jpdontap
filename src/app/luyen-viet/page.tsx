'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { dataset, KanaItem, KanjiItem } from '@/lib/dataset';
import { sound } from '@/lib/sound';
import { WukongMascot } from '@/components/WukongMascot';
import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Undo2,
  Eye,
  EyeOff,
  BookOpen,
  Play,
  Square,
  ListOrdered
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStrokeGuide, CharacterStrokeData } from '@/lib/strokeOrderData';

type WritingCategory = 'hiragana' | 'katakana' | 'kanji';

// Catmull-Rom Spline Curve Generator for natural Japanese calligraphy
function generateSmoothCalligraphyPath(
  points: { x: number; y: number }[],
  stepsPerSpan: number = 24
): { x: number; y: number }[] {
  if (points.length <= 1) return points;
  if (points.length === 2) {
    const res: { x: number; y: number }[] = [];
    for (let i = 0; i <= stepsPerSpan; i++) {
      const t = i / stepsPerSpan;
      res.push({
        x: points[0].x + (points[1].x - points[0].x) * t,
        y: points[0].y + (points[1].y - points[0].y) * t
      });
    }
    return res;
  }

  // Extend endpoints so spline passes smoothly through endpoints
  const p = [
    { x: 2 * points[0].x - points[1].x, y: 2 * points[0].y - points[1].y },
    ...points,
    { x: 2 * points[points.length - 1].x - points[points.length - 2].x, y: 2 * points[points.length - 1].y - points[points.length - 2].y }
  ];

  const result: { x: number; y: number }[] = [];

  for (let i = 0; i < p.length - 3; i++) {
    const p0 = p[i];
    const p1 = p[i + 1];
    const p2 = p[i + 2];
    const p3 = p[i + 3];

    for (let j = 0; j < stepsPerSpan; j++) {
      const t = j / stepsPerSpan;
      const t2 = t * t;
      const t3 = t2 * t;

      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );

      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );

      result.push({ x, y });
    }
  }

  result.push(points[points.length - 1]);
  return result;
}

export default function LuyenVietPage() {
  const [category, setCategory] = useState<WritingCategory>('hiragana');
  const [charIndex, setCharIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [drawnStrokeCount, setDrawnStrokeCount] = useState(0);
  const [showGhostGuide, setShowGhostGuide] = useState(true);
  const [compoundMode, setCompoundMode] = useState<'both' | 'primary' | 'small'>('both');
  const [showStrokeOrder, setShowStrokeOrder] = useState(true);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [activeDemoStroke, setActiveDemoStroke] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const undoHistoryRef = useRef<ImageData[]>([]);
  const animationTimerRef = useRef<any>(null);

  // 3 Distinct Datasets for Hiragana, Katakana, and Kanji
  const hiraganaList = useMemo(() => {
    return dataset.kanaList.filter(k => k.hira);
  }, []);

  const katakanaList = useMemo(() => {
    return dataset.kanaList.filter(k => k.kata);
  }, []);

  const kanjiList = useMemo(() => {
    return dataset.kanji;
  }, []);

  const currentList = useMemo(() => {
    if (category === 'hiragana') return hiraganaList;
    if (category === 'katakana') return katakanaList;
    return kanjiList;
  }, [category, hiraganaList, katakanaList, kanjiList]);

  const safeIndex = charIndex >= currentList.length ? 0 : charIndex;
  const activeItem = currentList[safeIndex];

  // Derive display values based on active category
  let displayGlyph = '';
  let subTitle = '';
  let detailInfo = '';
  let hintText = '';

  if (category === 'hiragana') {
    const k = activeItem as KanaItem;
    displayGlyph = k?.hira || 'あ';
    subTitle = `Phiên âm: /${k?.romaji || 'a'}/`;
    detailInfo = k?.kata ? `Katakana tương ứng: ${k.kata}` : '';
    hintText = k?.mnemonic?.hint || k?.mnemonic?.keywordVi || 'Tập nét uốn mềm mại chuẩn Hiragana';
  } else if (category === 'katakana') {
    const k = activeItem as KanaItem;
    displayGlyph = k?.kata || k?.glyph || 'ア';
    subTitle = `Phiên âm: /${k?.romaji || 'a'}/`;
    detailInfo = k?.hira ? `Hiragana tương ứng: ${k.hira}` : '';
    hintText = k?.mnemonic?.hint || k?.mnemonic?.keywordVi || 'Tập nét dứt khoát góc cạnh Katakana';
  } else {
    const kj = activeItem as KanjiItem;
    displayGlyph = kj?.kanji || '一';
    subTitle = `Hán-Việt: ${kj?.hanViet?.toUpperCase() || ''} (${kj?.meaning || ''})`;
    detailInfo = `Onyomi: ${kj?.onyomi || ''} | Kunyomi: ${kj?.kunyomi || ''}`;
    hintText = `Số nét chuẩn: ${kj?.strokes || 1} nét • Cấp độ: ${kj?.level || 'N5'}`;
  }

  // Âm ghép (yōon - e.g. きゃ, キャ, etc.)
  const isCompound = displayGlyph.length > 1;
  const primaryChar = isCompound ? displayGlyph[0] : displayGlyph;
  const smallChar = isCompound ? displayGlyph.slice(1) : '';

  // Stroke guide data for active glyph
  const strokeGuide: CharacterStrokeData = useMemo(() => {
    const totalFallback = category === 'kanji' ? (activeItem as KanjiItem)?.strokes || 4 : 3;
    const targetChar = isCompound && compoundMode === 'primary' ? primaryChar : isCompound && compoundMode === 'small' ? smallChar : displayGlyph;
    return getStrokeGuide(targetChar, totalFallback);
  }, [category, activeItem, displayGlyph, isCompound, compoundMode, primaryChar, smallChar]);

  const stopStrokeDemo = () => {
    setIsDemoPlaying(false);
    setActiveDemoStroke(null);
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
  };

  const handlePlayStrokeDemo = () => {
    if (isDemoPlaying) {
      stopStrokeDemo();
      return;
    }

    clearCanvas();
    setIsDemoPlaying(true);
    setActiveDemoStroke(1);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    sound.playTap();

    let strokeIdx = 0;
    const strokes = strokeGuide.strokes;

    const drawNextStroke = () => {
      if (strokeIdx >= strokes.length) {
        setIsDemoPlaying(false);
        setActiveDemoStroke(null);
        sound.playVictory();
        return;
      }

      const currentStroke = strokes[strokeIdx];
      setActiveDemoStroke(currentStroke.strokeNumber);

      const pts = currentStroke.points;
      if (pts.length < 2) {
        strokeIdx++;
        drawNextStroke();
        return;
      }

      const scaleX = canvas.width / 100;
      const scaleY = canvas.height / 100;

      // Generate silky-smooth calligraphic curve path via Catmull-Rom spline
      const smoothPath = generateSmoothCalligraphyPath(pts, 28);
      if (smoothPath.length < 2) {
        strokeIdx++;
        drawNextStroke();
        return;
      }

      let stepIdx = 0;
      const strokeWidth = isCompound && compoundMode === 'both' ? 10 : 13.5;

      const interval = setInterval(() => {
        // Advance 2 points per tick for organic, fluid 60fps brush motion
        const nextIdx = Math.min(stepIdx + 2, smoothPath.length - 1);

        ctx.beginPath();
        ctx.moveTo(smoothPath[stepIdx].x * scaleX, smoothPath[stepIdx].y * scaleY);
        for (let k = stepIdx + 1; k <= nextIdx; k++) {
          ctx.lineTo(smoothPath[k].x * scaleX, smoothPath[k].y * scaleY);
        }
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        stepIdx = nextIdx;

        if (stepIdx >= smoothPath.length - 1) {
          clearInterval(interval);
          setDrawnStrokeCount(strokeIdx + 1);
          setHasDrawn(true);
          strokeIdx++;
          animationTimerRef.current = setTimeout(drawNextStroke, 240);
        }
      }, 18);
    };

    drawNextStroke();
  };

  // Clear canvas whenever character or category changes
  useEffect(() => {
    stopStrokeDemo();
    clearCanvas();
    setCompoundMode('both');
  }, [category, charIndex]);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setDrawnStrokeCount(0);
    undoHistoryRef.current = [];
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save canvas snapshot before this stroke for undo
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoHistoryRef.current.push(snapshot);

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = isCompound && compoundMode === 'both' ? 10 : 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setDrawnStrokeCount(prev => prev + 1);
    }
  };

  // Undo last drawn stroke
  const handleUndoLastStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas || undoHistoryRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousSnapshot = undoHistoryRef.current.pop();
    if (previousSnapshot) {
      ctx.putImageData(previousSnapshot, 0, 0);
      setDrawnStrokeCount(prev => Math.max(0, prev - 1));
      if (undoHistoryRef.current.length === 0) {
        setHasDrawn(false);
      }
    }
  };

  // "lúc luyện viết nếu viết xong là qua" -> Hoàn thành & Qua chữ tiếp theo
  const handleCompleteAndNext = () => {
    sound.playVictory();
    confetti({ particleCount: 85, spread: 65, origin: { y: 0.6 } });

    setTimeout(() => {
      if (safeIndex + 1 < currentList.length) {
        setCharIndex(prev => prev + 1);
      } else {
        setCharIndex(0);
      }
      clearCanvas();
    }, 400);
  };

  // "hoặc cho luyện lại ko bắt viết đi lại nhiều net" -> Xóa để viết lại chữ này
  const handleRetryCurrent = () => {
    sound.playTap();
    clearCanvas();
  };

  const handlePlaySound = () => {
    sound.speakJapanese(displayGlyph);
  };

  return (
    <div className="space-y-4 pb-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
          title="Quay lại trang chủ"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-black text-[#143521] flex items-center gap-1.5">
          <span>Tập viết chữ:</span>
          <span className="jp-font jp-textbook text-2xl font-bold text-[#15803d]">{displayGlyph}</span>
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => safeIndex > 0 && setCharIndex(safeIndex - 1)}
            disabled={safeIndex === 0}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-xs cursor-pointer"
            title="Chữ trước"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => safeIndex + 1 < currentList.length && setCharIndex(safeIndex + 1)}
            disabled={safeIndex + 1 === currentList.length}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-xs cursor-pointer"
            title="Chữ tiếp theo"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Main Category Tabs: HIRAGANA, KATAKANA, KANJI */}
      <div className="flex items-center gap-1.5 bg-[#e4ede1] p-1 rounded-2xl text-xs font-black shadow-xs">
        {[
          { key: 'hiragana', label: 'あ HIRAGANA', count: hiraganaList.length },
          { key: 'katakana', label: 'ア KATAKANA', count: katakanaList.length },
          { key: 'kanji', label: '漢 CHỮ HÁN KANJI', count: kanjiList.length }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => {
              setCategory(t.key as WritingCategory);
              setCharIndex(0);
              sound.playTap();
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all font-black text-xs cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
              category === t.key
                ? 'bg-white text-[#143521] shadow-sm scale-101 ring-1 ring-emerald-500/20'
                : 'text-[#718777] hover:text-[#143521]'
            }`}
          >
            <span>{t.label}</span>
            <span className="text-[10px] font-normal opacity-70 font-mono">({t.count} chữ)</span>
          </button>
        ))}
      </div>

      {/* Horizontal Scrollable Character Picker Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar bg-white/70 backdrop-blur-xs p-1.5 rounded-2xl border border-[#e4dac3]">
        {currentList.map((item, idx) => {
          const glyph = category === 'hiragana'
            ? (item as KanaItem).hira
            : category === 'katakana'
            ? (item as KanaItem).kata || (item as KanaItem).glyph
            : (item as KanjiItem).kanji;

          const isSelected = idx === safeIndex;

          return (
            <button
              key={idx}
              onClick={() => {
                setCharIndex(idx);
                sound.playTap();
              }}
              className={`min-w-[40px] h-9 rounded-xl font-bold jp-font jp-textbook text-sm flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md scale-110 ring-2 ring-emerald-300'
                  : 'bg-white text-stone-700 hover:bg-emerald-50 border border-stone-200'
              }`}
            >
              {glyph}
            </button>
          );
        })}
      </div>

      {/* Character Profile Card */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8f5ea] via-[#f5efe2] to-[#ecdfc8] border border-[#e4dac3] p-4 shadow-md space-y-2.5">
        {/* Peeking Mascot Top-Right */}
        <div className="absolute top-2 right-4 pointer-events-none select-none">
          <div className="w-14 h-14 relative">
            <WukongMascot mood="happy" size="sm" />
          </div>
        </div>

        {/* Lượt pill tag */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            {category === 'hiragana' ? 'BẢNG HIRAGANA' : category === 'katakana' ? 'BẢNG KATAKANA' : 'CHỮ HÁN KANJI'} • {safeIndex + 1}/{currentList.length}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white text-[#718777] text-[10px] font-bold border border-[#e4dac3]">
            {category === 'kanji' ? `${(activeItem as KanjiItem).strokes || 4} nét chuẩn` : 'Viết tự do cả chữ'}
          </span>
        </div>

        {/* Heading & Meaning */}
        <div>
          <h3 className="text-base font-black text-[#2e1d0f] flex items-center gap-2">
            <span>{subTitle}</span>
            <button
              onClick={handlePlaySound}
              className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 shadow-xs active:scale-95 cursor-pointer"
              title="Nghe phát âm chuẩn"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            </button>
          </h3>
          {detailInfo && (
            <span className="text-xs text-stone-600 font-medium block mt-0.5">
              {detailInfo}
            </span>
          )}
          {hintText && (
            <p className="text-[11px] text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-lg border border-amber-200/80 mt-1.5 inline-block">
              💡 {hintText}
            </p>
          )}
        </div>

        {/* Toggle ghost guide & stroke order demo */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#e4dac3]/80">
          <span className="text-[11px] text-stone-500 font-semibold hidden sm:inline">
            Viết xong là qua ngay hoặc luyện lại tùy ý
          </span>
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
            {/* Play Stroke Demo Button */}
            <button
              type="button"
              onClick={handlePlayStrokeDemo}
              className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                isDemoPlaying
                  ? 'bg-amber-600 text-white animate-pulse ring-2 ring-amber-300'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white active:scale-95'
              }`}
              title="Xem hoạt họa mẫu thứ tự nét viết"
            >
              {isDemoPlaying ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Dừng mẫu ({activeDemoStroke}/{strokeGuide.strokes.length})</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-amber-100" />
                  <span>Xem mẫu thứ tự viết</span>
                </>
              )}
            </button>

            {/* Toggle Numbered Stroke Order Badges */}
            <button
              type="button"
              onClick={() => setShowStrokeOrder(!showStrokeOrder)}
              className={`px-2.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer ${
                showStrokeOrder
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white border-[#e4dac3] text-stone-500 hover:bg-stone-50'
              }`}
              title="Bật/tắt số thứ tự nét 1, 2, 3"
            >
              <ListOrdered className="w-3.5 h-3.5 text-amber-600" />
              <span>{showStrokeOrder ? 'Số nét: Bật' : 'Số nét: Tắt'}</span>
            </button>

            {/* Toggle Ghost Guide */}
            <button
              type="button"
              onClick={() => setShowGhostGuide(!showGhostGuide)}
              className="px-2.5 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-[#e4dac3] text-stone-600 text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              title="Bật/tắt chữ mờ hướng dẫn"
            >
              {showGhostGuide ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
              <span>{showGhostGuide ? 'Nét mờ: Bật' : 'Nét mờ: Tắt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Âm ghép (Combination kana) Sub-selector */}
      {isCompound && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-amber-50/90 border border-amber-200 rounded-2xl shadow-xs animate-fade-in">
          <span className="text-[11px] font-bold text-amber-900 px-1">Luyện âm ghép:</span>
          <button
            type="button"
            onClick={() => { setCompoundMode('both'); clearCanvas(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              compoundMode === 'both'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-emerald-50 border border-stone-200'
            }`}
          >
            Cả cặp: {displayGlyph}
          </button>
          <button
            type="button"
            onClick={() => { setCompoundMode('primary'); clearCanvas(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              compoundMode === 'primary'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-emerald-50 border border-stone-200'
            }`}
          >
            Chữ chính: {primaryChar}
          </button>
          <button
            type="button"
            onClick={() => { setCompoundMode('small'); clearCanvas(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              compoundMode === 'small'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-emerald-50 border border-stone-200'
            }`}
          >
            Chữ nhỏ: {smallChar}
          </button>
        </div>
      )}

      {/* Instructional text below card */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-[#718777]">
        <span>
          {isCompound && compoundMode === 'both'
            ? `✍️ Viết cả 2 chữ âm ghép: ${primaryChar} + ${smallChar} (nhỏ ở góc phải).`
            : isCompound && compoundMode === 'primary'
            ? `✍️ Luyện nét chữ chính ${primaryChar} vào ô chữ Mễ.`
            : isCompound && compoundMode === 'small'
            ? `✍️ Luyện nét chữ nhỏ ${smallChar} vào ô chữ Mễ.`
            : '✍️ Viết toàn bộ chữ vào ô chữ Mễ bên dưới.'}
        </span>
        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          Đã vẽ: {drawnStrokeCount} nét
        </span>
      </div>

      {/* Tianzige Square Grid Canvas */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-[300px] h-[300px] sm:w-[320px] sm:h-[320px] rounded-3xl overflow-hidden border-2 border-[#cbd5e1] bg-white shadow-xl">
          {/* True Tianzige 米-Grid Overlay with Dashed Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6,4" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6,4" />
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6,4" />
            <line x1="0" y1="100%" x2="100%" y2="0" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6,4" />
          </svg>

          {/* Light Gray Ghost Stroke in Background (Can toggle) */}
          {showGhostGuide && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300 px-3">
              {isCompound && compoundMode === 'both' ? (
                <div className="flex items-center justify-center gap-1.5 leading-none">
                  {/* Primary Kana (e.g. き / キ) */}
                  <span className="text-[120px] sm:text-[135px] font-semibold text-stone-300/90 jp-font jp-textbook select-none">
                    {primaryChar}
                  </span>
                  {/* Small Kana (e.g. ゃ / ャ) positioned lower-right */}
                  <span className="text-[80px] sm:text-[90px] font-semibold text-stone-300/90 jp-font jp-textbook select-none self-end pb-3 sm:pb-4">
                    {smallChar}
                  </span>
                </div>
              ) : isCompound && compoundMode === 'primary' ? (
                <span className="text-[200px] sm:text-[220px] font-semibold text-stone-300/90 jp-font jp-textbook leading-none select-none">
                  {primaryChar}
                </span>
              ) : isCompound && compoundMode === 'small' ? (
                <span className="text-[160px] sm:text-[180px] font-semibold text-stone-300/90 jp-font jp-textbook leading-none select-none">
                  {smallChar}
                </span>
              ) : (
                <span className="text-[200px] sm:text-[220px] font-semibold text-stone-300/90 jp-font jp-textbook leading-none select-none">
                  {displayGlyph}
                </span>
              )}
            </div>
          )}

          {/* Numbered Stroke Order Badges (①, ②, ③...) with Arrows */}
          {showStrokeOrder && (
            <div className="absolute inset-0 pointer-events-none select-none z-20">
              {strokeGuide.strokes.map((s, idx) => {
                const colorPalette = [
                  'bg-red-600 border-red-200 text-white',
                  'bg-amber-600 border-amber-200 text-white',
                  'bg-emerald-600 border-emerald-200 text-white',
                  'bg-blue-600 border-blue-200 text-white',
                  'bg-purple-600 border-purple-200 text-white',
                  'bg-pink-600 border-pink-200 text-white',
                  'bg-teal-600 border-teal-200 text-white',
                  'bg-stone-800 border-stone-300 text-white'
                ];
                const badgeColor = colorPalette[idx % colorPalette.length];
                const isActive = activeDemoStroke === s.strokeNumber;

                return (
                  <div
                    key={s.strokeNumber}
                    style={{ left: `${s.startPercent.x}%`, top: `${s.startPercent.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-all duration-200 ${
                      isActive ? 'scale-125 z-30 ring-4 ring-amber-300 shadow-xl' : 'scale-100 shadow-md'
                    }`}
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-1.5 flex items-center justify-center text-[10px] sm:text-xs font-black ${badgeColor}`}>
                      {s.strokeNumber}
                    </div>
                    {s.direction && (
                      <span className="text-[10px] font-black text-amber-900 bg-white/95 px-1 py-0.2 rounded-md shadow-xs border border-amber-300/80">
                        {s.direction}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive HTML5 Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
          />
        </div>
      </div>

      {/* Step-by-Step Stroke Order Sequence (Danh sách thứ tự từng nét) */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/80 border border-amber-200 p-3 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
          <span className="font-black text-[#143521] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Mẫu thứ tự viết ({strokeGuide.strokes.length} nét):</span>
          </span>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
            {strokeGuide.ruleHint}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {strokeGuide.strokes.map((s, idx) => {
            const isActive = activeDemoStroke === s.strokeNumber;
            return (
              <div
                key={s.strokeNumber}
                className={`shrink-0 px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs transition-all ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102 font-black ring-2 ring-amber-300'
                    : 'bg-white text-stone-700 border-stone-200 shadow-2xs hover:border-amber-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  {s.strokeNumber}
                </span>
                <div className="leading-tight">
                  <div className="font-bold flex items-center gap-1">
                    <span>{s.name}</span>
                    <span className="text-amber-600 font-black">{s.direction}</span>
                  </div>
                  <div className="text-[10px] opacity-75">{s.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
        {/* Undo Button */}
        <button
          onClick={handleUndoLastStroke}
          disabled={!hasDrawn || undoHistoryRef.current.length === 0}
          className="px-3.5 py-2.5 rounded-full bg-white border border-[#cbd5e1] hover:border-stone-400 text-[#718777] font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
          title="Xóa nét vừa vẽ"
        >
          <Undo2 className="w-3.5 h-3.5" /> Nét trước
        </button>

        {/* Retry Current Character Button */}
        <button
          onClick={handleRetryCurrent}
          className="px-4 py-2.5 rounded-full bg-white border-2 border-amber-300 hover:border-amber-400 text-amber-800 font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
          title="Xóa canvas để luyện viết lại chữ này"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> Luyện lại chữ này
        </button>

        {/* Complete & Advance */}
        <button
          onClick={handleCompleteAndNext}
          className="btn-3d-green px-6 py-2.5 rounded-full text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          title="Hoàn thành và chuyển sang chữ tiếp theo"
        >
          <Check className="w-4 h-4" /> Hoàn thành & Qua chữ tiếp ➔
        </button>
      </div>

      {/* Quick category jump footer */}
      <div className="rounded-2xl bg-white border border-[#e2ece0] p-3 text-center space-y-1 shadow-xs">
        <div className="text-xs font-black text-[#143521]">
          Đang luyện: <span className="text-[#ea580c] uppercase">{category === 'hiragana' ? 'Bảng chữ Hiragana' : category === 'katakana' ? 'Bảng chữ Katakana' : 'Chữ Hán Kanji N5/N4'}</span>
        </div>
        <p className="text-[11px] text-[#718777]">
          Chạm vào các chữ cái trên thanh cuộn ngang để chuyển nhanh chữ cần luyện tập.
        </p>
      </div>
    </div>
  );
}