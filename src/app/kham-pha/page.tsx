'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dataset, VocabWord } from '@/lib/dataset';
import { sound } from '@/lib/sound';
import { WukongMascot } from '@/components/WukongMascot';
import { ArrowLeft, BookOpen, Volume2, Timer, Sparkles, ChevronRight, Swords, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function KhamPhaPage() {
  const router = useRouter();
  const [selectedUnitId, setSelectedUnitId] = useState<string>('jpd113-v1-1');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Filter words by selected unit or fallback
  const unitWords = useMemo(() => {
    const list = dataset.words.filter(w => w.unitId === selectedUnitId);
    return list.length > 0 ? list : dataset.words.filter(w => w.course === 'jpd113');
  }, [selectedUnitId]);

  const currentWord: VocabWord = unitWords[currentIndex] || unitWords[0];
  const total = unitWords.length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  const selectedUnit = dataset.units.find(u => u.id === selectedUnitId) || dataset.units[0];

  const handleSpeak = (rate: number = 0.9) => {
    setIsSpeaking(true);
    sound.speakJapanese(currentWord.word || currentWord.kana, rate);
    setTimeout(() => setIsSpeaking(false), 1200);
  };

  const handleNextWord = () => {
    sound.playCorrect();
    setEarnedXp(prev => prev + 10);

    if (currentIndex + 1 < total) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed lesson session
      setIsCompleted(true);
      sound.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Top Bar matching Image 8 */}
      <div className="flex items-center justify-between">
        <Link
          href="/hoc-tap"
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <h1 className="text-sm sm:text-base font-black text-[#143521] truncate max-w-[180px]">
          Ải {selectedUnit.tag}: {selectedUnit.title}
        </h1>

        {/* Unit switch dropdown with all 35 units */}
        <select
          value={selectedUnitId}
          onChange={(e) => {
            setSelectedUnitId(e.target.value);
            setCurrentIndex(0);
            setIsCompleted(false);
          }}
          className="text-xs font-bold bg-white border border-[#e2ece0] text-stone-700 rounded-full px-3 py-1.5 outline-hidden shadow-xs max-w-[160px] truncate"
        >
          <optgroup label="JPD113 (Nhật 1 - Sơ Cấp)">
            {dataset.units.filter(u => u.course === 'jpd113').map(u => (
              <option key={u.id} value={u.id}>
                {u.tag} {u.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="JPD123 (Nhật 2 - Trung Cấp)">
            {dataset.units.filter(u => u.course === 'jpd123').map(u => (
              <option key={u.id} value={u.id}>
                {u.tag} {u.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="JPD133 (Nhật 3 - Cao Cấp)">
            {dataset.units.filter(u => u.course === 'jpd133').map(u => (
              <option key={u.id} value={u.id}>
                {u.tag} {u.title}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Subheader: Lantern KHÁM PHÁ + XP Badge */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-lg filter drop-shadow-xs">🏮</span>
          <span className="text-xs font-black uppercase tracking-wider text-[#b45309]">
            KHÁM PHÁ
          </span>
        </div>

        <div className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black">
          +{earnedXp} XP
        </div>
      </div>

      {/* Progress Bar + Counter (1/12) */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 rounded-full bg-[#e2ede0] overflow-hidden shadow-inner">
          <div
            className="h-full bg-[#22c55e] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-black text-[#718777] font-mono">
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* Large Vocabulary Discovery Card (Matching Image 8 Pixel-for-Pixel) */}
      <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-b from-[#fbfdfa] via-[#f7fbf5] to-[#f0f7ee] border-2 border-[#e1ece0] p-6 shadow-xl space-y-4">
        {/* Peeking Mascot Top-Right */}
        <div className="absolute top-2 right-4 pointer-events-none select-none">
          <div className="w-16 h-16 relative">
            <WukongMascot mood={isSpeaking ? 'attack' : 'happy'} size="sm" />
          </div>
        </div>

        {/* Top Tag */}
        <div>
          <span className="px-3.5 py-1 rounded-full bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
            KHÁM PHÁ
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-base font-black text-[#143521] pt-1">
          Nghe và khám phá từ mới
        </h2>

        {/* Center Green Book Icon */}
        <div className="flex justify-center pt-2">
          <div className="w-20 h-20 rounded-full bg-[#e3f4e1] border-2 border-[#cce7ca] flex items-center justify-center shadow-inner">
            <BookOpen className="w-9 h-9 text-[#15803d]" />
          </div>
        </div>

        {/* Main Japanese Word */}
        <div className="text-center space-y-1">
          <div className="text-4xl sm:text-5xl font-black text-[#143521] jp-font tracking-tight drop-shadow-xs">
            {currentWord.word}
          </div>

          {/* Reading in Red Font (Like Pandarin Image 8) */}
          <div className="text-base font-black text-red-600 font-mono">
            {currentWord.kana} {currentWord.romaji ? `(${currentWord.romaji})` : ''}
          </div>
        </div>

        {/* Meaning Pill Badge */}
        <div className="flex justify-center">
          <span className="px-4 py-1.5 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] text-sm font-black text-center shadow-xs">
            {currentWord.meaning}
          </span>
        </div>

        {/* Audio Controls (Normal & Slow Speed) */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <button
            onClick={() => handleSpeak(0.9)}
            className="py-2.5 px-3 rounded-full bg-white border border-[#cbd5e1] hover:border-[#22c55e] text-[#143521] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4 text-[#22c55e]" />
            <span>Nghe</span>
          </button>

          <button
            onClick={() => handleSpeak(0.6)}
            className="py-2.5 px-3 rounded-full bg-white border border-[#cbd5e1] hover:border-[#22c55e] text-[#143521] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Timer className="w-4 h-4 text-amber-600" />
            <span>Nghe chậm</span>
          </button>
        </div>

        {/* Primary Action Button: "Đã khám phá" */}
        <div className="pt-2">
          <button
            onClick={handleNextWord}
            className="btn-3d-green w-full py-3.5 rounded-full text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>Đã khám phá</span>
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fcfaf5] border-2 border-[#d6e5d3] rounded-[2.5rem] p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="w-24 h-24 mx-auto flex items-center justify-center">
              <WukongMascot mood="happy" size="md" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase">
                Ải đã hoàn thành!
              </span>
              <h3 className="text-xl font-black text-[#143521]">
                Xuất Sắc Lắm Đại Thánh!
              </h3>
              <p className="text-xs text-[#718777]">
                Bạn đã ghi nhớ trọn vẹn {total} từ vựng của bài học này.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-white rounded-2xl p-3 border border-[#e2ece0]">
              <div className="text-center">
                <div className="text-xs text-[#718777] font-bold">Kinh nghiệm</div>
                <div className="text-lg font-black text-amber-600">+{earnedXp} XP</div>
              </div>
              <div className="text-center border-l border-[#e2ece0]">
                <div className="text-xs text-[#718777] font-bold">Chiến lợi phẩm</div>
                <div className="text-lg font-black text-pink-600">🍑 +1 Đào Tiên</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => router.push('/boss-battle')}
                className="btn-3d-red w-full py-3 rounded-full text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" /> Khiêu chiến Boss ngay
              </button>

              <button
                onClick={() => router.push('/luyen-viet')}
                className="btn-3d-green w-full py-3 rounded-full text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-4 h-4" /> Luyện viết chữ Hán
              </button>

              <button
                onClick={handleRestart}
                className="w-full py-2.5 rounded-full bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Học lại lượt này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
