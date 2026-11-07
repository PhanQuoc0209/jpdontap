'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { dataset, KanjiItem } from '@/lib/dataset';
import { sound } from '@/lib/sound';
import { WukongMascot } from '@/components/WukongMascot';
import { ArrowLeft, Volume2, RotateCcw, Check, ChevronLeft, ChevronRight, Sparkles, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

// Stroke guidance positions for common Kanji
const STROKE_GUIDES: Record<string, { x: string; y: string; angle: number; label: string }[]> = {
  '水': [
    { x: '50%', y: '26%', angle: 90, label: 'Nét 1: Nét sổ móc thẳng từ trên xuống' },
    { x: '35%', y: '42%', angle: -135, label: 'Nét 2: Nét ngang gập phẩy bên trái' },
    { x: '28%', y: '68%', angle: 45, label: 'Nét 3: Nét hất từ dưới lên' },
    { x: '60%', y: '45%', angle: 45, label: 'Nét 4: Nét mác sang phải' }
  ],
  '日': [
    { x: '32%', y: '30%', angle: 90, label: 'Nét 1: Nét sổ trái' },
    { x: '32%', y: '28%', angle: 0, label: 'Nét 2: Ngang gập móc' },
    { x: '35%', y: '50%', angle: 0, label: 'Nét 3: Ngang giữa' },
    { x: '32%', y: '72%', angle: 0, label: 'Nét 4: Ngang đáy đóng' }
  ],
  '木': [
    { x: '25%', y: '40%', angle: 0, label: 'Nét 1: Nét ngang dài' },
    { x: '50%', y: '22%', angle: 90, label: 'Nét 2: Nét sổ thẳng giữa' },
    { x: '45%', y: '45%', angle: -135, label: 'Nét 3: Nét phẩy trái' },
    { x: '55%', y: '45%', angle: 45, label: 'Nét 4: Nét mác phải' }
  ]
};

export default function LuyenVietPage() {
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [currentStroke, setCurrentStroke] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isAnimatingStroke, setIsAnimatingStroke] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const kanji: KanjiItem = dataset.kanji[currentKanjiIndex] || dataset.kanji[0];
  const maxStrokes = kanji.strokes || 4;
  const guideList = STROKE_GUIDES[kanji.kanji] || STROKE_GUIDES['水'];
  const activeGuide = guideList[(currentStroke - 1) % guideList.length];

  useEffect(() => {
    clearCanvas();
    setCurrentStroke(1);
  }, [currentKanjiIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
    setIsDrawing(false);
  };

  const handleNextStroke = () => {
    sound.playCorrect();
    if (currentStroke < maxStrokes) {
      setCurrentStroke(prev => prev + 1);
      clearCanvas();
    } else {
      sound.playVictory();
      confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
      setTimeout(() => {
        if (currentKanjiIndex + 1 < dataset.kanji.length) {
          setCurrentKanjiIndex(prev => prev + 1);
        } else {
          setCurrentKanjiIndex(0);
        }
      }, 1200);
    }
  };

  const handlePlaySound = () => {
    sound.speakJapanese(kanji.kanji);
  };

  return (
    <div className="space-y-4 pb-8 animate-fade-in">
      {/* Top Header matching Image 6 */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-black text-[#143521] flex items-center gap-1.5">
          <span>Viết chữ:</span>
          <span className="jp-font text-xl font-black text-[#15803d]">{kanji.kanji}</span>
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => currentKanjiIndex > 0 && setCurrentKanjiIndex(currentKanjiIndex - 1)}
            disabled={currentKanjiIndex === 0}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => currentKanjiIndex + 1 < dataset.kanji.length && setCurrentKanjiIndex(currentKanjiIndex + 1)}
            disabled={currentKanjiIndex + 1 === dataset.kanji.length}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-xs"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Card (Matching Image 6 Pixel-for-Pixel) */}
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
            LƯỢT {(currentKanjiIndex % 10) + 1}/10
          </span>
        </div>

        {/* Heading */}
        <h3 className="text-base font-black text-[#2e1d0f]">
          Viết theo nét được hướng dẫn
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
              className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 shadow-xs active:scale-95"
            >
              <Volume2 className="w-3 h-3 text-emerald-700" />
            </button>
          </div>

          <span className="px-3 py-1 rounded-full bg-white text-[#143521] text-xs font-black shadow-xs border border-[#e4dac3]">
            Nét {currentStroke}/{maxStrokes}
          </span>
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
      <div className="text-center text-xs font-bold text-[#718777]">
        Hãy viết nét {currentStroke}/{maxStrokes}.
      </div>

      {/* Tianzige Square Grid Canvas (Matching Image 6) */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-[300px] h-[300px] sm:w-[320px] sm:h-[320px] rounded-3xl overflow-hidden border-2 border-[#cbd5e1] bg-white shadow-xl">
          {/* True Tianzige 米-Grid Overlay with Dashed Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Center vertical dashed line */}
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6,4" />
            {/* Center horizontal dashed line */}
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6,4" />
            {/* Diagonal top-left to bottom-right */}
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6,4" />
            {/* Diagonal bottom-left to top-right */}
            <line x1="0" y1="100%" x2="100%" y2="0" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6,4" />
          </svg>

          {/* Light Gray Ghost Stroke in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[200px] sm:text-[220px] font-black text-stone-200 jp-font leading-none select-none">
              {kanji.kanji}
            </span>
          </div>

          {/* Guide Starting Dot & Direction Arrow (Matching Image 6) */}
          {activeGuide && (
            <div
              className="absolute pointer-events-none animate-bounce flex items-center gap-1 z-20"
              style={{ top: activeGuide.x, left: activeGuide.y, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-5 h-5 rounded-full bg-orange-500 shadow-md ring-2 ring-white flex items-center justify-center text-white text-[9px] font-bold">
                ●
              </div>
              <span
                className="text-sm text-orange-600 font-black inline-block drop-shadow"
                style={{ transform: `rotate(${activeGuide.angle}deg)` }}
              >
                ➔
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
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={clearCanvas}
          className="px-4 py-2.5 rounded-full bg-white border border-[#cbd5e1] hover:border-stone-400 text-[#718777] font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Viết lại
        </button>

        <button
          onClick={handleNextStroke}
          className="btn-3d-green px-6 py-2.5 rounded-full text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
        >
          <Check className="w-3.5 h-3.5" /> Hoàn thành nét
        </button>
      </div>

      {/* Han-Viet & Onyomi/Kunyomi Details Footer */}
      <div className="rounded-2xl bg-white border border-[#e2ece0] p-3 text-center space-y-1 shadow-xs">
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
