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
  Play,
  Square,
  ListOrdered,
  Gauge
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStrokeGuide, CharacterStrokeData } from '@/lib/strokeOrderData';

type WritingCategory = 'hiragana' | 'katakana' | 'kanji';

function getSvgPathLength(d: string): number {
  if (typeof document === 'undefined') return 160;
  try {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    return Math.max(30, Math.round(p.getTotalLength() || 160));
  } catch {
    return 160;
  }
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
  const [demoStrokeProgress, setDemoStrokeProgress] = useState(0);
  const [hasDemoFinished, setHasDemoFinished] = useState(false);
  const [demoSpeed, setDemoSpeed] = useState<'normal' | 'slow'>('normal');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const undoHistoryRef = useRef<ImageData[]>([]);
  const demoAnimationRef = useRef<any>(null);

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

  // Authentic KanjiVG stroke guide data
  const strokeGuide: CharacterStrokeData = useMemo(() => {
    const totalFallback = category === 'kanji' ? (activeItem as KanjiItem)?.strokes || 4 : 3;
    const targetChar = isCompound && compoundMode === 'primary' ? primaryChar : isCompound && compoundMode === 'small' ? smallChar : displayGlyph;
    return getStrokeGuide(targetChar, totalFallback);
  }, [category, activeItem, displayGlyph, isCompound, compoundMode, primaryChar, smallChar]);

  // Pre-calculate path lengths for smooth SVG dashoffset animations
  const strokeLengths = useMemo(() => {
    const map: Record<number, number> = {};
    if (strokeGuide && strokeGuide.strokes) {
      strokeGuide.strokes.forEach(s => {
        map[s.strokeNumber] = getSvgPathLength(s.d);
      });
    }
    return map;
  }, [strokeGuide]);

  const stopStrokeDemo = () => {
    setIsDemoPlaying(false);
    setActiveDemoStroke(null);
    setDemoStrokeProgress(0);
    if (demoAnimationRef.current) {
      if (typeof demoAnimationRef.current === 'number') {
        cancelAnimationFrame(demoAnimationRef.current);
      } else {
        clearTimeout(demoAnimationRef.current);
      }
      demoAnimationRef.current = null;
    }
  };

  // Play official Japanese stroke order animation via SVG
  const handlePlayStrokeDemo = () => {
    if (isDemoPlaying) {
      stopStrokeDemo();
      return;
    }

    clearCanvas();
    setIsDemoPlaying(true);
    setHasDemoFinished(false);
    sound.playTap();

    const strokes = strokeGuide.strokes;
    if (!strokes || strokes.length === 0) return;

    let currentIdx = 0;
    setActiveDemoStroke(strokes[0].strokeNumber);
    setDemoStrokeProgress(0);

    const animateStroke = () => {
      if (currentIdx >= strokes.length) {
        setIsDemoPlaying(false);
        setActiveDemoStroke(null);
        setHasDemoFinished(true);
        sound.playVictory();
        confetti({ particleCount: 50, spread: 50 });
        return;
      }

      const currentStroke = strokes[currentIdx];
      setActiveDemoStroke(currentStroke.strokeNumber);

      // Tính toán chiều dài hình học thực tế của nét vẽ SVG
      const pathLen = strokeLengths[currentStroke.strokeNumber] || getSvgPathLength(currentStroke.d) || 160;

      // Thuật toán điều tốc thông minh: Các chữ ít nét hoặc nét uốn lượn dài (như そ, し, つ, く, ろ, る, の, あ, ぬ)
      // cần được viết chậm rãi, nắn nót để người học quan sát rõ từng khúc cua và chuyển hướng nét bút.
      let baseDuration: number;
      if (strokes.length === 1) {
        // Chữ 1 nét (そ, し, つ, く, ろ, る, の, へ): chậm rãi rõ ràng (~1.9s - 2.5s)
        baseDuration = Math.max(1900, Math.min(2600, Math.round(pathLen * 8.2)));
      } else if (strokes.length === 2) {
        // Chữ 2 nét (い, り, こ, う, 八,...): ~1.2s - 1.8s mỗi nét
        baseDuration = Math.max(1200, Math.min(1850, Math.round(500 + pathLen * 5.8)));
      } else if (strokes.length <= 4) {
        // Chữ 3-4 nét (あ, お, さ, す,...): ~900ms - 1.5s mỗi nét
        baseDuration = Math.max(900, Math.min(1550, Math.round(420 + pathLen * 4.6)));
      } else {
        // Chữ nhiều nét (Chữ Hán Kanji, Katakana phức tạp): ~700ms - 1.2s mỗi nét
        baseDuration = Math.max(700, Math.min(1250, Math.round(350 + pathLen * 3.4)));
      }

      // Áp dụng hệ số nếu người dùng bật chế độ "Tốc độ: Chậm" (1.45x)
      const speedMultiplier = demoSpeed === 'slow' ? 1.45 : 1.0;
      const duration = Math.round(baseDuration * speedMultiplier);

      let startTime: number | null = null;
      const step = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Đường cong gia tốc mượt mà chuẩn thư pháp
        const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        setDemoStrokeProgress(eased);

        if (progress < 1) {
          demoAnimationRef.current = requestAnimationFrame(step);
        } else {
          // Khoảng nghỉ tự nhiên khi nhấc bút chuyển sang nét tiếp theo (320ms)
          const pauseBetweenStrokes = Math.round(320 * speedMultiplier);
          demoAnimationRef.current = setTimeout(() => {
            currentIdx++;
            if (currentIdx < strokes.length) {
              setDemoStrokeProgress(0);
              animateStroke();
            } else {
              setIsDemoPlaying(false);
              setActiveDemoStroke(null);
              setHasDemoFinished(true);
              sound.playVictory();
              confetti({ particleCount: 50, spread: 50 });
            }
          }, pauseBetweenStrokes);
        }
      };

      demoAnimationRef.current = requestAnimationFrame(step);
    };

    animateStroke();
  };

  // Clear canvas whenever character or category changes
  useEffect(() => {
    stopStrokeDemo();
    clearCanvas();
    setHasDemoFinished(false);
    setCompoundMode('both');
  }, [category, charIndex]);

  useEffect(() => {
    return () => {
      stopStrokeDemo();
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
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#1e293b'; // Traditional deep Japanese calligraphy sumi ink
    ctx.lineWidth = isCompound && compoundMode === 'both' ? 8 : 11;
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
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setDrawnStrokeCount(prev => prev + 1);
    }
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (undoHistoryRef.current.length > 0) {
      sound.playTap();
      const previousState = undoHistoryRef.current.pop();
      if (previousState) {
        ctx.putImageData(previousState, 0, 0);
        setDrawnStrokeCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleComplete = () => {
    sound.playVictory();
    confetti({ particleCount: 75, spread: 60 });
    // Advance to next character
    if (charIndex + 1 < currentList.length) {
      setCharIndex(charIndex + 1);
    } else {
      setCharIndex(0);
    }
  };

  const handlePlaySound = () => {
    if (category === 'kanji') {
      const kj = activeItem as KanjiItem;
      sound.speakJapanese(kj.kanji);
    } else {
      const k = activeItem as KanaItem;
      sound.speakJapanese(k.glyph || k.hira || k.kata || displayGlyph);
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sound.playTap()}
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-black text-[#143521]">
          Tập viết chữ: <span className="text-emerald-700 jp-font font-bold">{displayGlyph}</span>
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (charIndex > 0) {
                sound.playTap();
                setCharIndex(charIndex - 1);
              }
            }}
            disabled={charIndex === 0}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (charIndex + 1 < currentList.length) {
                sound.playTap();
                setCharIndex(charIndex + 1);
              }
            }}
            disabled={charIndex + 1 === currentList.length}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-sm cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Main Categories Switcher Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-[#f4ece1] p-1.5 rounded-2xl border border-[#e4dac3]">
        {[
          { key: 'hiragana', label: 'あ HIRAGANA', count: hiraganaList.length },
          { key: 'katakana', label: 'ア KATAKANA', count: katakanaList.length },
          { key: 'kanji', label: '漢 CHỮ HÁN KANJI', count: kanjiList.length }
        ].map(tab => {
          const isSelected = category === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                sound.playTap();
                setCategory(tab.key as WritingCategory);
                setCharIndex(0);
              }}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                isSelected
                  ? 'bg-white text-stone-900 shadow-md ring-2 ring-emerald-500/20'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-60 font-mono">({tab.count} chữ)</span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Scroll Row of Characters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
        {currentList.map((item, idx) => {
          const isSel = idx === safeIndex;
          let label = '';
          if (category === 'hiragana') label = (item as KanaItem).hira || '';
          else if (category === 'katakana') label = (item as KanaItem).kata || (item as KanaItem).glyph || '';
          else label = (item as KanjiItem).kanji || '';

          return (
            <button
              key={idx}
              onClick={() => {
                sound.playTap();
                setCharIndex(idx);
              }}
              className={`shrink-0 w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer jp-font text-sm ${
                isSel
                  ? 'bg-emerald-600 text-white shadow-md scale-105 ring-2 ring-emerald-300 font-black'
                  : 'bg-white text-stone-700 hover:bg-emerald-50 border border-stone-200'
              }`}
            >
              {label}
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
              title="Xem hoạt họa mẫu thứ tự nét viết chuẩn sách giáo khoa"
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

            {/* Toggle Stroke Speed (Chuẩn / Chậm rãi) */}
            <button
              type="button"
              onClick={() => setDemoSpeed(prev => (prev === 'normal' ? 'slow' : 'normal'))}
              className={`px-2.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer ${
                demoSpeed === 'slow'
                  ? 'bg-amber-100/90 border-amber-300 text-amber-900 ring-1 ring-amber-300'
                  : 'bg-white border-[#e4dac3] text-stone-600 hover:bg-stone-50'
              }`}
              title="Chỉnh tốc độ viết mẫu: Chuẩn hoặc Chậm rãi"
            >
              <Gauge className="w-3.5 h-3.5 text-amber-600" />
              <span>{demoSpeed === 'slow' ? 'Tốc độ: Chậm' : 'Tốc độ: Chuẩn'}</span>
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
              title="Bật/tắt nét mờ hướng dẫn chuẩn"
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
            onClick={() => { setCompoundMode('both'); clearCanvas(); stopStrokeDemo(); }}
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
            onClick={() => { setCompoundMode('primary'); clearCanvas(); stopStrokeDemo(); }}
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
            onClick={() => { setCompoundMode('small'); clearCanvas(); stopStrokeDemo(); }}
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
            ? `✍️ Viết cả 2 chữ âm ghép: ${primaryChar} (chính bên trái) + ${smallChar} (nhỏ bên phải).`
            : isCompound && compoundMode === 'primary'
            ? `✍️ Luyện nét chữ chính ${primaryChar} vào ô chữ Mễ.`
            : isCompound && compoundMode === 'small'
            ? `✍️ Luyện nét chữ nhỏ ${smallChar} vào ô chữ Mễ.`
            : '✍️ Viết toàn bộ chữ theo nét mờ vào ô chữ Mễ bên dưới.'}
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

          {/* 1. AUTHENTIC KANJIVG GHOST STROKE TEMPLATE (Nét mờ chuẩn sách giáo khoa Nhật Bản) */}
          {showGhostGuide && (
            <svg
              viewBox="0 0 109 109"
              className="absolute inset-0 w-full h-full pointer-events-none p-3.5 select-none"
            >
              <g
                stroke="#d1d5db"
                strokeWidth="8.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.85"
              >
                {isCompound && compoundMode === 'both' ? (
                  <>
                    <g transform="translate(3, 10) scale(0.54)">
                      {strokeGuide.primaryStrokes?.map(s => (
                        <path key={s.strokeNumber} d={s.d} />
                      ))}
                    </g>
                    <g transform="translate(56, 42) scale(0.44)">
                      {strokeGuide.smallStrokes?.map(s => (
                        <path key={s.strokeNumber} d={s.d} />
                      ))}
                    </g>
                  </>
                ) : (
                  strokeGuide.strokes.map(s => (
                    <path key={s.strokeNumber} d={s.d} />
                  ))
                )}
              </g>
            </svg>
          )}

          {/* 2. CALLIGRAPHY DEMO ANIMATION (100% Khớp từng pixel với nét mờ) */}
          {(isDemoPlaying || hasDemoFinished) && (
            <svg
              viewBox="0 0 109 109"
              className="absolute inset-0 w-full h-full pointer-events-none p-3.5 select-none z-10"
            >
              {isCompound && compoundMode === 'both' ? (
                <>
                  <g transform="translate(3, 10) scale(0.54)">
                    {strokeGuide.primaryStrokes?.map(s => {
                      const isCompleted = hasDemoFinished || (activeDemoStroke !== null && s.strokeNumber < activeDemoStroke);
                      const isCurrent = isDemoPlaying && s.strokeNumber === activeDemoStroke;
                      if (!isCompleted && !isCurrent) return null;
                      const len = strokeLengths[s.strokeNumber] || 150;
                      return (
                        <path
                          key={s.strokeNumber}
                          d={s.d}
                          stroke="#f59e0b"
                          strokeWidth="9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          style={
                            isCurrent
                              ? {
                                  strokeDasharray: len,
                                  strokeDashoffset: len * (1 - demoStrokeProgress)
                                }
                              : undefined
                          }
                        />
                      );
                    })}
                  </g>
                  <g transform="translate(56, 42) scale(0.44)">
                    {strokeGuide.smallStrokes?.map(s => {
                      const isCompleted = hasDemoFinished || (activeDemoStroke !== null && s.strokeNumber < activeDemoStroke);
                      const isCurrent = isDemoPlaying && s.strokeNumber === activeDemoStroke;
                      if (!isCompleted && !isCurrent) return null;
                      const len = strokeLengths[s.strokeNumber] || 150;
                      return (
                        <path
                          key={s.strokeNumber}
                          d={s.d}
                          stroke="#f59e0b"
                          strokeWidth="9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          style={
                            isCurrent
                              ? {
                                  strokeDasharray: len,
                                  strokeDashoffset: len * (1 - demoStrokeProgress)
                                }
                              : undefined
                          }
                        />
                      );
                    })}
                  </g>
                </>
              ) : (
                strokeGuide.strokes.map(s => {
                  const isCompleted = hasDemoFinished || (activeDemoStroke !== null && s.strokeNumber < activeDemoStroke);
                  const isCurrent = isDemoPlaying && s.strokeNumber === activeDemoStroke;
                  if (!isCompleted && !isCurrent) return null;
                  const len = strokeLengths[s.strokeNumber] || 150;
                  return (
                    <path
                      key={s.strokeNumber}
                      d={s.d}
                      stroke="#f59e0b"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      style={
                        isCurrent
                          ? {
                              strokeDasharray: len,
                              strokeDashoffset: len * (1 - demoStrokeProgress)
                            }
                          : undefined
                      }
                    />
                  );
                })
              )}
            </svg>
          )}

          {/* 3. Numbered Stroke Badges (①, ②, ③...) with Arrows */}
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
                    style={{ left: `${s.percentX}%`, top: `${s.percentY}%` }}
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

          {/* 4. Interactive HTML5 Drawing Canvas (Lớp vẽ mực đen tự do của học viên) */}
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
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-30"
          />
        </div>
      </div>

      {/* Step-by-Step Stroke Order Sequence (Danh sách thứ tự từng nét) */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/80 border border-amber-200 p-3 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
          <span className="font-black text-[#143521] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Mẫu thứ tự viết ({strokeGuide.strokes.length} nét chuẩn MEXT):</span>
          </span>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
            {strokeGuide.ruleHint}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {strokeGuide.strokes.map((s) => {
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
                <span className="font-bold text-stone-800">
                  {s.name} <span className="text-amber-600 font-black">{s.direction}</span>
                </span>
                <span className="text-[10px] text-stone-500 hidden sm:inline">
                  {s.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={drawnStrokeCount === 0}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs disabled:opacity-40 transition-all cursor-pointer"
            title="Hoàn tác nét vừa vẽ"
          >
            <Undo2 className="w-3.5 h-3.5 text-stone-600" />
            <span>Nét trước</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              clearCanvas();
              setHasDemoFinished(false);
            }}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Xóa trắng để luyện lại"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
            <span>Luyện lại chữ này</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleComplete}
          className="btn-3d-green px-5 py-2 rounded-xl text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer ml-auto"
        >
          <Check className="w-4 h-4" />
          <span>HOÀN THÀNH &amp; QUA CHỮ TIẾP →</span>
        </button>
      </div>
    </div>
  );
}
