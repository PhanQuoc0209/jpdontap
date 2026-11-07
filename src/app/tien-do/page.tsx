'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart2, TrendingUp, Zap, Flame, Target, Trophy, ChevronRight } from 'lucide-react';
import { WukongMascot } from '@/components/WukongMascot';

export default function TienDoPage() {
  const weeklyDays = [
    { day: 'T7', height: 'h-1.5', active: true, color: 'bg-emerald-500' },
    { day: 'CN', height: 'h-1.5', active: true, color: 'bg-emerald-500' },
    { day: 'T2', height: 'h-1.5', active: true, color: 'bg-emerald-500' },
    { day: 'T3', height: 'h-1.5', active: true, color: 'bg-emerald-500' },
    { day: 'T4', height: 'h-1.5', active: true, color: 'bg-emerald-500' },
    { day: 'T5', height: 'h-1.5', active: true, color: 'bg-emerald-500' },
    { day: 'T6', height: 'h-1.5', active: false, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-black text-[#143521]">Tiến độ</h1>
            <p className="text-[10px] text-[#718777]">Năng lực và lịch sử kinh nghiệm</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fff5eb] border border-[#fed7aa] text-[#c2410c] text-xs font-black">
          <span>🔥</span>
          <span>0 ngày</span>
        </div>
      </div>

      {/* Hero Card: SỔ HÀNH TRÌNH (Matching Image 1) */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8f5ea] via-[#f5efe2] to-[#ecdfc8] border border-[#e4dac3] p-4 sm:p-5 shadow-[0_8px_20px_rgba(20,53,33,0.06)] space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-wider">
            SỔ HÀNH TRÌNH
          </span>
          <span className="text-[10px] text-[#718777] font-semibold">
            Ngày khởi đầu
          </span>
        </div>

        <div>
          <h2 className="text-lg font-black text-[#2e1d0f]">Năng lực đang ở mức 57%</h2>
          <p className="text-[11px] text-[#6d5b4b] mt-0.5 leading-relaxed max-w-[280px]">
            Hoàn thành một ải để biểu đồ, mastery và lịch sử phản ánh đúng năng lực của bạn.
          </p>

          {/* Progress bar */}
          <div className="mt-2 space-y-1">
            <div className="w-full h-2.5 rounded-full bg-[#e3d7be] overflow-hidden">
              <div className="h-full bg-[#22c55e] rounded-full w-[57%]" />
            </div>
            <span className="text-[10px] font-bold text-[#15803d]">57% mastery</span>
          </div>
        </div>

        <div className="flex items-end justify-between pt-1">
          <button className="btn-3d-green px-4 py-2 rounded-full text-white text-xs font-black tracking-wide">
            Xem lịch sử học
          </button>

          {/* Peeking Mascot (Matching Image 1) */}
          <div className="select-none -mb-3 -mr-2">
            <span className="text-5xl filter drop-shadow">🐒</span>
          </div>
        </div>
      </div>

      {/* 4 Grid Stats Cards (Matching Image 1) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* XP Hôm nay */}
        <div className="rounded-2xl bg-white border border-[#e2ece0] p-3 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718777] uppercase tracking-wider">
            <span className="text-amber-500">⚡</span> XP HÔM NAY
          </div>
          <p className="text-base font-black text-[#143521]">+0 XP</p>
        </div>

        {/* Chuỗi ngày */}
        <div className="rounded-2xl bg-white border border-[#e2ece0] p-3 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718777] uppercase tracking-wider">
            <span className="text-orange-500">🔥</span> CHUỖI NGÀY
          </div>
          <p className="text-base font-black text-[#143521]">0 ngày</p>
        </div>

        {/* Thành thạo */}
        <div className="rounded-2xl bg-white border border-[#e2ece0] p-3 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718777] uppercase tracking-wider">
            <span className="text-red-500">🎯</span> THÀNH THẠO
          </div>
          <p className="text-base font-black text-[#143521]">57%</p>
        </div>

        {/* Tổng tích lũy */}
        <div className="rounded-2xl bg-white border border-[#e2ece0] p-3 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#718777] uppercase tracking-wider">
            <span className="text-amber-500">🏆</span> TỔNG TÍCH LŨY
          </div>
          <p className="text-base font-black text-[#143521]">75 XP</p>
        </div>
      </div>

      {/* Section: Hoạt động 7 ngày gần nhất (Matching Image 1) */}
      <div className="rounded-2xl bg-white border border-[#e2ece0] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#143521] uppercase tracking-wider flex items-center gap-1.5">
            | Hoạt động 7 ngày gần nhất
          </h3>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>

        {/* 7 Days Bar Grid */}
        <div className="flex items-end justify-between px-2 pt-4">
          {weeklyDays.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-6 rounded-full ${d.color} ${d.height}`} />
              <span className={`text-[10px] font-bold ${d.day === 'T6' ? 'text-red-500' : 'text-[#718777]'}`}>
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Kỹ năng & độ thành thạo */}
      <div className="rounded-2xl bg-white border border-[#e2ece0] p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-black text-[#143521] uppercase tracking-wider">
          | Kỹ năng &amp; độ thành thạo
        </h3>

        <div className="space-y-3">
          {/* Từ vựng */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-[#143521]">
              <span>Từ vựng (Vocabulary)</span>
              <span>100%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#eef4ec] overflow-hidden">
              <div className="h-full bg-emerald-500 w-full" />
            </div>
          </div>

          {/* Luyện nói */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-[#143521]">
              <span>Luyện nói (Speaking)</span>
              <span className="text-stone-400">0%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#eef4ec] overflow-hidden">
              <div className="h-full bg-emerald-500 w-0" />
            </div>
          </div>

          {/* Chữ Hán */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-[#143521]">
              <span>Chữ Hán (Kanji Writing)</span>
              <span>25%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#eef4ec] overflow-hidden">
              <div className="h-full bg-amber-500 w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
