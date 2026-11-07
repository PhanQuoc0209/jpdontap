'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { dataset, VocabWord } from '@/lib/dataset';
import { sound } from '@/lib/sound';
import { WukongMascot } from '@/components/WukongMascot';
import { ArrowLeft, BarChart2, Settings, Zap, RotateCw, Volume2, ChevronRight, Play, Shuffle, BookOpen, Check, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FlashcardsPage() {
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'jpd113' | 'jpd123' | 'jpd133'>('jpd113');
  const [selectedUnitId, setSelectedUnitId] = useState<string | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'unit'>('all');

  // Study session state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Active deck calculation based on chosen level & unit
  const activeDeck = useMemo(() => {
    let list: VocabWord[] = [];
    if (selectedUnitId === 'all') {
      list = dataset.words.filter(w => w.course === selectedLevel);
    } else {
      list = dataset.words.filter(w => w.unitId === selectedUnitId);
    }

    if (list.length === 0) {
      list = dataset.words.filter(w => w.course === selectedLevel);
    }

    if (isShuffled) {
      return [...list].sort(() => 0.5 - Math.random());
    }
    return list;
  }, [selectedLevel, selectedUnitId, isShuffled]);

  const currentCard: VocabWord = activeDeck[currentIndex] || activeDeck[0];
  const levelWords = dataset.words.filter(w => w.course === selectedLevel);
  const levelUnits = dataset.units.filter(u => u.course === selectedLevel);

  // Active unit metadata
  const currentUnitMeta = useMemo(() => {
    if (selectedUnitId === 'all') {
      return { title: `Toàn bộ ${selectedLevel.toUpperCase()}`, tag: 'ALL' };
    }
    return dataset.units.find(u => u.id === selectedUnitId) || { title: 'Bài học', tag: 'UNIT' };
  }, [selectedUnitId, selectedLevel]);

  const handleStartStudy = (unitId: string | 'all' = 'all') => {
    sound.playTap();
    setSelectedUnitId(unitId);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    setReviewCount(0);
    setIsStudyMode(true);
  };

  const handleFlip = () => {
    sound.playTap();
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    sound.speakJapanese(text);
  };

  const handleRate = (status: 'again' | 'good' | 'easy') => {
    if (status === 'easy' || status === 'good') {
      sound.playCorrect();
      setKnownCount(prev => prev + 1);
    } else {
      sound.playWrong();
      setReviewCount(prev => prev + 1);
    }

    if (currentIndex + 1 < activeDeck.length) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      sound.playVictory();
      confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
      setIsStudyMode(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-black text-[#143521]">Học Flashcard SRS</h1>
        <div className="flex items-center gap-1.5">
          <Link href="/tien-do" className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs shadow-sm">
            <BarChart2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs shadow-sm transition-colors ${
              isShuffled ? 'bg-[#22c55e] text-white border-[#22c55e]' : 'bg-white text-stone-700 border-stone-300'
            }`}
            title="Xáo trộn ngẫu nhiên thẻ"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isStudyMode ? (
        <>
          {/* Hero SRS Card (Matching Image 9) */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8f5ea] via-[#f5efe2] to-[#ecdfc8] border border-[#e4dac3] p-4 sm:p-5 shadow-[0_8px_20px_rgba(20,53,33,0.06)] space-y-3">
            {/* Mascot Peeking */}
            <div className="absolute top-2 right-4 select-none">
              <div className="w-14 h-14 relative">
                <WukongMascot mood="happy" size="sm" showCloud={false} />
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-wider">
              HÔM NAY
            </span>

            <div>
              <h2 className="text-lg font-black text-[#2e1d0f]">
                {levelWords.length} Thẻ từ vựng {selectedLevel.toUpperCase()}
              </h2>
              <p className="text-xs text-[#ea580c] font-bold mt-0.5 flex items-center gap-1">
                🔥 Chuỗi học 7 ngày liên tiếp • Đã sẵn sàng ôn tập
              </p>
            </div>

            {/* 4 Stats Grid (Matching Image 9) */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="bg-white rounded-2xl p-2.5 text-center shadow-xs">
                <span className="text-[10px] text-[#718777] block font-bold">⏰ Đến hạn</span>
                <span className="text-base font-black text-[#143521]">12</span>
              </div>
              <div className="bg-white rounded-2xl p-2.5 text-center shadow-xs">
                <span className="text-[10px] text-[#718777] block font-bold">🆕 Thẻ mới</span>
                <span className="text-base font-black text-[#143521]">{levelWords.length}</span>
              </div>
              <div className="bg-white rounded-2xl p-2.5 text-center shadow-xs">
                <span className="text-[10px] text-[#718777] block font-bold">🔄 Đang học</span>
                <span className="text-base font-black text-[#143521]">35</span>
              </div>
              <div className="bg-white rounded-2xl p-2.5 text-center shadow-xs">
                <span className="text-[10px] text-[#718777] block font-bold">✅ Đã nhớ</span>
                <span className="text-base font-black text-[#143521]">84</span>
              </div>
            </div>

            {/* Big Green 3D Button: Học Toàn Bộ Thẻ Của Khóa Học */}
            <button
              onClick={() => handleStartStudy('all')}
              className="btn-3d-green w-full py-3.5 rounded-2xl text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap className="w-4 h-4 fill-white" />
              Học toàn bộ thẻ {selectedLevel.toUpperCase()} ({levelWords.length} từ)
            </button>
          </div>

          {/* Level Filter Pills (JPD113, JPD123, JPD133) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { key: 'jpd113', label: 'JPD113 (Nhật 1 - Sơ Cấp)', count: dataset.words.filter(w => w.course === 'jpd113').length },
              { key: 'jpd123', label: 'JPD123 (Nhật 2 - Trung Cấp)', count: dataset.words.filter(w => w.course === 'jpd123').length },
              { key: 'jpd133', label: 'JPD133 (Nhật 3 - Cao Cấp)', count: dataset.words.filter(w => w.course === 'jpd133').length }
            ].map(lvl => (
              <button
                key={lvl.key}
                onClick={() => {
                  setSelectedLevel(lvl.key as any);
                  setSelectedUnitId('all');
                }}
                className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedLevel === lvl.key
                    ? 'bg-[#22c55e] text-white shadow-md'
                    : 'bg-white text-[#718777] border border-[#e2ece0] hover:border-[#22c55e]'
                }`}
              >
                <span>{lvl.label}</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                  selectedLevel === lvl.key ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {lvl.count}
                </span>
              </button>
            ))}
          </div>

          {/* Header of Lesson List */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 font-bold text-[#143521]">
              <span>🐒</span>
              <span className="font-black">{selectedLevel.toUpperCase()} • Đầy đủ {levelUnits.length} Bài học ({levelWords.length} từ)</span>
            </div>
            <button
              onClick={() => handleStartStudy('all')}
              className="text-[#15803d] font-black hover:underline text-xs"
            >
              Học tất cả &gt;
            </button>
          </div>

          {/* Complete Lesson List (All units of the selected course, not truncated) */}
          <div className="space-y-2.5">
            {levelUnits.map((unit) => {
              const unitWordsCount = dataset.words.filter(w => w.unitId === unit.id).length;

              return (
                <div
                  key={unit.id}
                  className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_12px_rgba(20,53,33,0.03)] hover:border-[#22c55e] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-green-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0 font-mono shadow-2xs">
                      {unit.tag}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-[#143521] truncate">
                        {unit.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-[#15803d]">
                          {unitWordsCount} thẻ từ vựng
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase">
                          Chuẩn JPD
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartStudy(unit.id)}
                    className="btn-3d-green px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Học
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Active Study Flashcard Mode */
        <div className="space-y-4 animate-fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setIsStudyMode(false)}
              className="text-[#15803d] font-black flex items-center gap-1 hover:underline"
            >
              ← Thoát phiên học
            </button>
            <span className="font-bold text-[#718777]">
              {currentUnitMeta.title}: Thẻ {currentIndex + 1} / {activeDeck.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-[#e2ede0] overflow-hidden">
            <div
              className="h-full bg-[#22c55e] rounded-full transition-all duration-300"
              style={{ width: `${Math.round(((currentIndex + 1) / activeDeck.length) * 100)}%` }}
            />
          </div>

          {/* Flashcard 3D Card */}
          {currentCard && (
            <div
              onClick={handleFlip}
              className="cursor-pointer select-none rounded-[2.2rem] bg-gradient-to-br from-[#fcfaf5] via-[#f8f5eb] to-[#eee5d3] border-2 border-[#e4dac3] p-6 sm:p-8 min-h-[340px] flex flex-col justify-between items-center text-center shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              {/* Top Hint */}
              <div className="flex items-center justify-between w-full">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  {currentCard.unitTag || 'JPD'}
                </span>
                <span className="text-[11px] font-black text-[#8c6753]">
                  {isFlipped ? 'Mặt sau (Nghĩa)' : 'Chạm để lật thẻ ↻'}
                </span>
              </div>

              {/* Card Face: Front (Word + Reading) vs Back (Meaning + Details) */}
              {!isFlipped ? (
                <div className="space-y-3 my-auto animate-fade-in flex flex-col items-center">
                  <h2 className="text-5xl sm:text-6xl font-black text-[#143521] jp-font tracking-tight drop-shadow-xs">
                    {currentCard.word}
                  </h2>
                  <p className="text-base font-black text-red-600 font-mono">
                    {currentCard.kana} {currentCard.romaji ? `(${currentCard.romaji})` : ''}
                  </p>
                  <button
                    onClick={(e) => handleSpeak(e, currentCard.word)}
                    className="w-11 h-11 rounded-full bg-white border border-[#cbd5e1] text-[#15803d] hover:bg-emerald-50 flex items-center justify-center shadow-md active:scale-90 transition-all mt-2"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3 my-auto animate-fade-in flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-[#143521] jp-font">
                    {currentCard.word}
                  </span>
                  <div className="px-5 py-2.5 rounded-2xl bg-white border border-[#fed7aa] text-lg sm:text-xl font-black text-[#b45309] shadow-xs">
                    {currentCard.meaning}
                  </div>
                  <p className="text-xs font-mono text-[#718777]">
                    Phiên âm: {currentCard.kana} • {currentCard.romaji}
                  </p>
                  <button
                    onClick={(e) => handleSpeak(e, currentCard.word)}
                    className="w-10 h-10 rounded-full bg-white border border-[#cbd5e1] text-[#15803d] hover:bg-emerald-50 flex items-center justify-center shadow-md active:scale-90 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bottom Instructions */}
              <span className="text-[11px] text-[#718777] font-semibold">
                {isFlipped ? 'Đánh giá mức độ ghi nhớ để thuật toán xếp lịch' : 'Chạm vào thẻ để xem đáp án tiếng Việt'}
              </span>
            </div>
          )}

          {/* Rating Control Buttons */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={() => handleRate('again')}
              className="py-3 px-2 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-black text-xs flex flex-col items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <X className="w-4 h-4 text-rose-600" />
              <span>Chưa thuộc (1 ngày)</span>
            </button>

            <button
              onClick={() => handleRate('good')}
              className="py-3 px-2 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 font-black text-xs flex flex-col items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <RotateCw className="w-4 h-4 text-amber-600" />
              <span>Tạm nhớ (3 ngày)</span>
            </button>

            <button
              onClick={() => handleRate('easy')}
              className="btn-3d-green py-3 px-2 rounded-2xl text-white font-black text-xs flex flex-col items-center gap-1 shadow-md active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Đã thuộc (7 ngày)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
