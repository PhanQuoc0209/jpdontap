'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { dataset, KanaItem } from '@/lib/dataset';
import { sound } from '@/lib/sound';
import { WukongMascot } from '@/components/WukongMascot';
import confetti from 'canvas-confetti';
import { ArrowLeft, Play, RotateCcw, Volume2, Flame, Trophy, CloudRain, Sparkles, Heart } from 'lucide-react';

interface FallingChar {
  id: number;
  glyph: string;
  romaji: string;
  x: number; // percentage (10% to 80%)
  y: number; // percentage (0% to 100%)
  speed: number;
}

export default function MuaChuPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [fallingList, setFallingList] = useState<FallingChar[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Kana pool
  const kanaPool = dataset.kanaList.length > 0 ? dataset.kanaList : [
    { glyph: 'あ', romaji: 'a' },
    { glyph: 'い', romaji: 'i' },
    { glyph: 'う', romaji: 'u' },
    { glyph: 'え', romaji: 'e' },
    { glyph: 'お', romaji: 'o' },
    { glyph: 'か', romaji: 'ka' },
    { glyph: 'き', romaji: 'ki' },
    { glyph: 'く', romaji: 'ku' },
    { glyph: 'け', romaji: 'ke' },
    { glyph: 'こ', romaji: 'ko' }
  ];

  // Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    // Spawn falling characters
    const spawnInterval = setInterval(() => {
      setFallingList(prev => {
        if (prev.length >= 6) return prev;
        const randomKana = kanaPool[Math.floor(Math.random() * kanaPool.length)];
        const newChar: FallingChar = {
          id: Date.now() + Math.random(),
          glyph: randomKana.glyph,
          romaji: randomKana.romaji,
          x: 10 + Math.random() * 75,
          y: 0,
          speed: 0.8 + Math.random() * 0.6
        };
        return [...prev, newChar];
      });
    }, 1500);

    // Gravity move down
    const moveInterval = setInterval(() => {
      setFallingList(prev => {
        const next: FallingChar[] = [];
        let hitBottomCount = 0;

        prev.forEach(item => {
          const newY = item.y + item.speed;
          if (newY >= 92) {
            // Touched ground
            hitBottomCount++;
          } else {
            next.push({ ...item, y: newY });
          }
        });

        if (hitBottomCount > 0) {
          sound.playWrong();
          setCombo(0);
          setLives(l => {
            const nextL = l - hitBottomCount;
            if (nextL <= 0) {
              setIsGameOver(true);
              setIsPlaying(false);
              return 0;
            }
            return nextL;
          });
        }

        return next;
      });
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [isPlaying, isGameOver]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setLives(3);
    setCombo(0);
    setFallingList([]);
    setInputVal('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().trim();
    setInputVal(val);

    // Check if matches any falling char
    const matchIndex = fallingList.findIndex(item => item.romaji.toLowerCase() === val);
    if (matchIndex !== -1) {
      sound.playWukongStrike();
      const matched = fallingList[matchIndex];
      sound.speakJapanese(matched.glyph);

      setFallingList(prev => prev.filter((_, idx) => idx !== matchIndex));
      setInputVal('');
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(s => s + 10 + newCombo * 5);
    }
  };

  return (
    <div className="pt-2 pb-6 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
        <div className="flex items-center gap-3">
          {/* Combo */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-950/60 border border-orange-500/40 text-xs font-bold text-orange-400">
            <Flame className="w-3.5 h-3.5 fill-current" /> Combo x{combo}
          </div>
          {/* Lives */}
          <div className="flex items-center gap-1 text-rose-500">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? 'fill-rose-500' : 'opacity-20'}`}
              />
            ))}
          </div>
          {/* Score */}
          <div className="text-sm font-black text-amber-400 font-mono">
            {score} Điểm
          </div>
        </div>
      </div>

      {/* Game Stage Area */}
      <div className="relative w-full h-[450px] sm:h-[480px] rounded-3xl overflow-hidden border-2 border-amber-900/40 bg-gradient-to-b from-slate-950 via-stone-900 to-amber-950/80 shadow-2xl p-4 flex flex-col justify-between">
        {/* Falling Rain Sky Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.15)_0%,transparent_60%)] pointer-events-none" />

        {/* Start Game Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 z-20 bg-stone-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl shadow-inner animate-bounce">
              🌧️
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-amber-200">Trò Chơi Mưa Chữ (文字の雨)</h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-sm">
                Các chữ Kana sẽ rơi từ trên xuống. Hãy nhìn mặt chữ và gõ nhanh Romaji tương ứng để Ngộ Không vung gậy Như Ý phá vỡ trước khi chạm đất!
              </p>
            </div>
            <button
              onClick={handleStartGame}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-transform active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-stone-950" /> Bắt đầu chơi ngay
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 z-20 bg-stone-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
            <div className="text-4xl">💥</div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-rose-400">Kết Thúc Lượt Chơi!</h2>
              <p className="text-sm text-stone-300">
                Tổng điểm đạt được: <strong className="text-amber-400 font-mono text-xl">{score}</strong>
              </p>
            </div>
            <button
              onClick={handleStartGame}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <RotateCcw className="w-4 h-4" /> Chơi lại lần nữa
            </button>
          </div>
        )}

        {/* Falling Character Elements */}
        {isPlaying && (
          <div className="relative flex-1 w-full overflow-hidden">
            {fallingList.map(item => (
              <div
                key={item.id}
                className="absolute transition-transform flex flex-col items-center select-none"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/90 text-stone-950 font-black text-2xl flex items-center justify-center shadow-lg border-2 border-yellow-200 jp-font animate-pulse">
                  {item.glyph}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ground Defender: Ngộ Không with input console */}
        <div className="relative z-10 flex flex-col items-center space-y-2 pt-2 border-t border-amber-900/40">
          <WukongMascot
            size="sm"
            mood={combo > 0 ? 'attack' : 'idle'}
          />

          {/* Typing input */}
          <div className="w-full max-w-xs relative">
            <input
              ref={inputRef}
              type="text"
              disabled={!isPlaying}
              value={inputVal}
              onChange={handleInputChange}
              placeholder={isPlaying ? 'Gõ Romaji (ví dụ: a, ka, shi)...' : 'Bấm bắt đầu để gõ...'}
              className="w-full bg-stone-900 border-2 border-amber-500/60 rounded-full px-4 py-2.5 text-center text-sm font-bold text-amber-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 transition-all font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
