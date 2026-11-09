'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { dataset, KanjiItem } from '@/lib/dataset';
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
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LuyenVietPage() {
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [drawnStrokeCount, setDrawnStrokeCount] = useState(0);
  const [showGhostGuide, setShowGhostGuide] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const undoHistoryRef = useRef<ImageData[]>([]);

  const kanji: KanjiItem = dataset.kanji[currentKanjiIndex] || dataset.kanji[0];
  const maxStrokes = kanji.strokes || 4;

  useEffect(() => {
    clearCanvas();
  }, [currentKanjiIndex]);

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

    // Save canvas snapshot for undo
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
    confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });

    setTimeout(() => {
      if (currentKanjiIndex + 1 < dataset.kanji.length) {
        setCurrentKanjiIndex(prev => prev + 1);
      } else {
        setCurrentKanjiIndex(0);
      }
    }, 600);
  };

  // "hoặc cho luyện lại ko bắt viết đi lại nhiều net" -> Xóa để viết lại chữ này
  const handleRetryCurrent = () => {
    sound.playTap();
    clearCanvas();
  };

  const handlePlaySound = () => {
    sound.speakJapanese(kanji.kanji);
  };

  return (
    <div className="space-y-4 pb-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-black text-[#143521] flex items-center gap-1.5">
          <span>Tập viết chữ:</span>
          <span className="jp-font text-2xl font-black text-[#15803d]">{kanji.kanji}</span>
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => currentKanjiIndex > 0 && setCurrentKanjiIndex(currentKanjiIndex - 1)}
            disabled={currentKanjiIndex === 0}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-xs cursor-pointer"
            title="Chữ trước"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => currentKanjiIndex + 1 < dataset.kanji.length && setCurrentKanjiIndex(currentKanjiIndex + 1)}
            disabled={currentKanjiIndex + 1 === dataset.kanji.length}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-xs cursor-pointer"
            title="Chữ tiếp theo"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Card: Kanji Profile */}
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
            CHỮ SỐ {(currentKanjiIndex % dataset.kanji.length) + 1}/{dataset.kanji.length}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white text-[#718777] text-[10px] font-bold border border-[#e4dac3]">
            {maxStrokes} nét chuẩn
          </span>
        </div>

        {/* Heading */}
        <h3 className="text-base font-black text-[#2e1d0f]">
          Viết tự do cả chữ • Viết xong là qua ngay
        </h3>

        {/* Word Info Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-red-600 font-mono">
              {kanji.kunyomi.split(',')[0] || kanji.onyomi.split(',')[0]}
            </span>
            <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              {kanji.meaning}
            </span>
            <button
              onClick={handlePlaySound}
              className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 shadow-xs active:scale-95 cursor-pointer"
              title="Nghe phát âm"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
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

        {/* 10 Stepper Dots */}
        <div className="flex items-center gap-1.5 pt-1">
          {Array.from({ length: 10 }).map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentKanjiIndex % 10
                  ? 'bg-[#22c55e] scale-125 ring-2 ring-emerald-300'
                  : 'bg-[#cbd5e1]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Instructional text below card */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-[#718777]">
        <span>✍️ Bạn có thể vẽ thoải mái toàn bộ chữ vào ô bên dưới.</span>
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
                {kanji.kanji}
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

        {/* Retry Current Kanji Button: "cho luyện lại ko bắt viết đi lại nhiều net" */}
        <button
          onClick={handleRetryCurrent}
          className="px-4 py-2.5 rounded-full bg-white border-2 border-amber-300 hover:border-amber-400 text-amber-800 font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
          title="Xóa canvas để luyện viết lại chữ này"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> Luyện lại chữ này
        </button>

        {/* Complete & Advance: "viết xong là qua" */}
        <button
          onClick={handleCompleteAndNext}
          className="btn-3d-green px-6 py-2.5 rounded-full text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          title="Hoàn thành và chuyển sang chữ tiếp theo"
        >
          <Check className="w-4 h-4" /> Hoàn thành & Qua chữ tiếp ➔
        </button>
      </div>

      {/* Han-Viet & Onyomi/Kunyomi Details Footer */}
      <div className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 text-center space-y-1 shadow-xs">
        <div className="text-xs font-black text-[#143521]">
          Hán-Việt: <span className="text-[#ea580c] uppercase">{kanji.hanViet}</span> • Cấp độ: <span className="text-emerald-700">{kanji.level}</span>
        </div>
        <p className="text-[11px] text-[#718777]">
          Onyomi: {kanji.onyomi} | Kunyomi: {kanji.kunyomi}
        </p>
      </div>
    </div>
  );
}
