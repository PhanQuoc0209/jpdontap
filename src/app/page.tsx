'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WukongMascot } from '@/components/WukongMascot';
import { sound } from '@/lib/sound';
import { Play, ArrowRight, ChevronRight, Volume2 } from 'lucide-react';

export default function HomePage() {
  const [wukongMood, setWukongMood] = useState<'idle' | 'happy'>('idle');

  const handleWukongClick = () => {
    sound.playCorrect();
    setWukongMood('happy');
    setTimeout(() => setWukongMood('idle'), 1500);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Hero Banner: Full-Bleed 3D Wukong Landscape + Interactive Floating Card (Ô Nổi) */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#e0d6c0] shadow-[0_12px_28px_rgba(20,53,33,0.09)] min-h-[220px] sm:min-h-[240px] flex items-center p-4 sm:p-6 w-full">
        {/* Background Image: Full Bleed 3D Wukong + Landscape */}
        <img
          src="/images/banner_clean_bg.jpg"
          alt="Ngộ Không nhiệm vụ tiếp theo"
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none select-none"
        />

        {/* Floating Content Card (Ô Nổi Thật, không phải ảnh phẳng) */}
        <div className="relative z-10 rounded-2xl bg-white/90 backdrop-blur-md p-4 sm:p-5 border border-white/90 shadow-[0_8px_24px_rgba(46,29,15,0.12)] max-w-[270px] sm:max-w-sm space-y-2.5 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#e78b3e] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            <span>NHIỆM VỤ TIẾP THEO</span>
            <span className="text-amber-200">✦</span>
          </div>

          {/* Heading */}
          <h1 className="text-base sm:text-lg font-black text-[#2e1d0f] leading-snug">
            Ôn lại 4 mục đến hạn<br />cùng Ngộ Không
          </h1>

          {/* Subtitle */}
          <p className="text-[11px] text-[#6d5b4b] leading-relaxed font-medium">
            Những mục đến hạn có nguy cơ bị quên cao nhất.
          </p>

          {/* 3D Green Button */}
          <div className="pt-1">
            <Link
              href="/flashcards"
              onClick={() => sound.playCorrect()}
              className="btn-3d-green inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-black tracking-wide shadow-md active:scale-95 transition-transform"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Ôn ngay</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Stat Cards (Matching Pandarin's soft pastel pagoda cards) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Flame: Ngày học */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#fff6f2] to-[#ffede5] border border-[#fed7aa]/60 p-2.5 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-baseline gap-1">
            <span className="text-base">🔥</span>
            <span className="text-xl font-black text-[#ea580c]">0</span>
          </div>
          <span className="text-[11px] font-semibold text-[#8c6753]">Ngày học</span>
        </div>

        {/* Book: Bài học */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#f2faf3] to-[#e4f5e7] border border-[#bbf7d0]/60 p-2.5 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-baseline gap-1">
            <span className="text-base">📖</span>
            <span className="text-xl font-black text-[#15803d]">4</span>
          </div>
          <span className="text-[11px] font-semibold text-[#54795e]">Bài học</span>
        </div>

        {/* Star: Điểm XP */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#fffdf0] to-[#fef9c3] border border-[#fef08a]/80 p-2.5 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-baseline gap-1">
            <span className="text-base">⭐</span>
            <span className="text-xl font-black text-[#d97706]">0</span>
          </div>
          <span className="text-[11px] font-semibold text-[#7d6741]">Điểm XP</span>
        </div>
      </div>

      {/* Section: Bài học hôm nay */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🐒</span>
            <h2 className="text-sm font-black text-[#143521]">Bài học hôm nay</h2>
          </div>
          <Link href="/hoc-tap" className="text-[11px] font-bold text-[#597361] hover:text-[#143521] flex items-center">
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Today Lesson Card */}
        <div className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_12px_rgba(20,53,33,0.04)]">
          <div className="flex items-center gap-3 min-w-0">
            {/* Green 3D Book Icon */}
            <div className="w-12 h-14 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#15803d] border-b-4 border-[#166534] flex items-center justify-center text-white text-xl font-black shadow-md shrink-0 jp-font">
              日
            </div>

            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-[#143521] truncate">
                BÀI 1: Bài học 1 (JPD113)
              </h3>
              <p className="text-[11px] text-[#718777] truncate mt-0.5">
                Nhiệm vụ: Ôn lại 4 mục đến hạn
              </p>
              {/* Progress bar */}
              <div className="mt-2 flex items-center gap-2">
                <div className="w-24 sm:w-32 h-1.5 rounded-full bg-[#eef4ec] overflow-hidden">
                  <div className="h-full bg-[#22c55e] rounded-full w-[0%]" />
                </div>
                <span className="text-[10px] font-bold text-[#8a9f90]">0%</span>
              </div>
            </div>
          </div>

          <Link
            href="/kham-pha"
            className="btn-3d-green px-3.5 py-1.5 rounded-full text-white text-[11px] font-black uppercase tracking-wider shrink-0"
          >
            ÔN NGAY
          </Link>
        </div>
      </div>

      {/* Section: Học nhanh (4 Pastel Buttons matching Pandarin) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🐒</span>
            <h2 className="text-sm font-black text-[#143521]">Học nhanh</h2>
          </div>
          <Link href="/hoc-tap" className="text-[11px] font-bold text-[#597361] hover:text-[#143521] flex items-center">
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* 1. Từ vựng (Pastel Pink) -> /kham-pha */}
          <Link
            href="/kham-pha"
            className="rounded-2xl bg-[#fef2f2] border border-[#fecaca] p-2.5 flex flex-col items-center text-center shadow-sm hover:scale-102 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#f87171] to-[#ef4444] text-white flex items-center justify-center font-black text-base shadow mb-1.5">
              字
            </div>
            <span className="text-[11px] font-black text-[#991b1b]">Từ vựng</span>
          </Link>

          {/* 2. Luyện viết (Pastel Blue) */}
          <Link
            href="/luyen-viet"
            className="rounded-2xl bg-[#eff6ff] border border-[#bfdbfe] p-2.5 flex flex-col items-center text-center shadow-sm hover:scale-102 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] text-white flex items-center justify-center font-black text-base shadow mb-1.5">
              永
            </div>
            <span className="text-[11px] font-black text-[#1e40af]">Luyện viết</span>
          </Link>

          {/* 3. Flashcards (Pastel Mint) */}
          <Link
            href="/flashcards"
            className="rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] p-2.5 flex flex-col items-center text-center shadow-sm hover:scale-102 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#34d399] to-[#10b981] text-white flex items-center justify-center font-black text-base shadow mb-1.5">
              学
            </div>
            <span className="text-[11px] font-black text-[#065f46]">Flashcards</span>
          </Link>

          {/* 4. Luyện nói (Pastel Yellow) */}
          <Link
            href="/phat-am"
            className="rounded-2xl bg-[#fefce8] border border-[#fef08a] p-2.5 flex flex-col items-center text-center shadow-sm hover:scale-102 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#facc15] to-[#eab308] text-white flex items-center justify-center text-lg shadow mb-1.5">
              🎤
            </div>
            <span className="text-[11px] font-black text-[#854d0e]">Luyện nói</span>
          </Link>
        </div>
      </div>

      {/* Section: Thử thách hôm nay */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🐒</span>
            <h2 className="text-sm font-black text-[#143521]">Thử thách hôm nay</h2>
          </div>
          <Link href="/tien-do" className="text-[11px] font-bold text-[#597361] hover:text-[#143521] flex items-center">
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_12px_rgba(20,53,33,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl shrink-0">
              🎯
            </div>
            <div>
              <p className="text-xs font-black text-[#143521]">Hoàn thành 10 câu hỏi</p>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="w-32 h-1.5 rounded-full bg-[#eef4ec] overflow-hidden">
                  <div className="h-full bg-[#22c55e] rounded-full w-[60%]" />
                </div>
                <span className="text-[10px] font-bold text-[#8a9f90]">6/10</span>
              </div>
            </div>
          </div>

          {/* 3D Gift Box */}
          <div className="w-10 h-10 text-2xl flex items-center justify-center shrink-0 animate-bounce">
            🎁
          </div>
        </div>
      </div>
    </div>
  );
}
