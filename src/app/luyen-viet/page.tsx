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
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

type WritingCategory = 'hiragana' | 'katakana' | 'kanji';

export default function LuyenVietPage() {
  const [category, setCategory] = useState<WritingCategory>('hiragana');
  const [charIndex, setCharIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [drawnStrokeCount, setDrawnStrokeCount] = useState(0);
  const [showGhostGuide, setShowGhostGuide] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const undoHistoryRef = useRef<ImageData[]>([]);

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

  // Clear canvas whenever character or category changes
  useEffect(() => {
    clearCanvas();
  }, [category, charIndex]);

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
    ctx.lineWidth = 14;
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
          <span className="jp-font text-2xl font-black text-[#15803d]">{displayGlyph}</span>
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
              className={`min-w-[40px] h-9 rounded-xl font-black jp-font text-sm flex items-center justify-center transition-all cursor-pointer shrink-0 ${
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

        {/* Toggle ghost guide */}
        <div className="pt-1 flex items-center justify-between border-t border-[#e4dac3]/80">
          <span className="text-[11px] text-stone-500 font-semibold">
            Viết xong là qua ngay hoặc luyện lại tùy ý
          </span>
          <button
            onClick={() => setShowGhostGuide(!showGhostGuide)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-stone-50 border border-[#e4dac3] text-stone-600 text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
            title="Bật/tắt chữ mờ hướng dẫn"
          >
            {showGhostGuide ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-stone-400" />}
            <span>{showGhostGuide ? 'Nét mờ: Bật' : 'Nét mờ: Tắt'}</span>
          </button>
        </div>
      </div>

      {/* Instructional text below card */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-[#718777]">
        <span>✍️ Viết toàn bộ chữ vào ô chữ Mễ bên dưới.</span>
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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-300">
              <span className="text-[200px] sm:text-[220px] font-black text-stone-200/90 jp-font leading-none select-none">
                {displayGlyph}
              </span>
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