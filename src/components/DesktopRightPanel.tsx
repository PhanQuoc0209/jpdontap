'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Trophy, Award, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';

export const DesktopRightPanel: React.FC = () => {
  return (
    <aside className="hidden xl:flex flex-col w-72 h-screen sticky top-0 bg-[#f7faf5] border-l border-[#e1ede0] p-4 pb-6 overflow-y-auto z-40 select-none shadow-xs space-y-4">
      {/* 3 Quick Stats Widgets */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase text-[#889e8f] tracking-wider px-1 block">
          Chỉ số tu vi Đại Thánh
        </span>

        <div className="grid grid-cols-3 gap-2">
          {/* Flame */}
          <div className="rounded-2xl bg-white border border-[#fed7aa] p-2.5 text-center shadow-2xs">
            <span className="text-base block">🔥</span>
            <span className="text-base font-black text-[#ea580c] block">7</span>
            <span className="text-[9px] font-bold text-[#8c6753]">Ngày</span>
          </div>

          {/* Peaches */}
          <div className="rounded-2xl bg-white border border-pink-200 p-2.5 text-center shadow-2xs">
            <span className="text-base block">🍑</span>
            <span className="text-base font-black text-pink-600 block">12</span>
            <span className="text-[9px] font-bold text-pink-800">Đào Tiên</span>
          </div>

          {/* XP */}
          <div className="rounded-2xl bg-white border border-amber-200 p-2.5 text-center shadow-2xs">
            <span className="text-base block">⚡</span>
            <span className="text-base font-black text-amber-600 block">250</span>
            <span className="text-[9px] font-bold text-amber-800">Kinh nghiệm</span>
          </div>
        </div>
      </div>

      {/* Daily Quests Box */}
      <div className="rounded-2xl bg-white border border-[#e1ede0] p-3.5 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black text-[#143521]">Nhiệm vụ hôm nay</h3>
          </div>
          <span className="text-[10px] font-bold text-[#718777]">2/3 xong</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-emerald-50 text-[#15803d]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold line-through opacity-70">
              Khám phá 12 từ vựng mới
            </span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-emerald-50 text-[#15803d]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold line-through opacity-70">
              Luyện viết 5 chữ Hán N5
            </span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
            <Zap className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
            <span className="text-[11px] font-black">
              Đánh bại 1 Trùm Cuối JPD
            </span>
          </div>
        </div>
      </div>

      {/* Leaderboard: Bảng Vàng Đại Thánh */}
      <div className="rounded-2xl bg-white border border-[#e1ede0] p-3.5 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-black text-[#143521]">Bảng Vàng Đấu Trường</h3>
          </div>
          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Hôm nay
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 border border-amber-200/50">
            <div className="flex items-center gap-2">
              <span className="text-base">🥇</span>
              <div>
                <span className="font-black text-[#143521] block text-[11px]">Tề Thiên Đại Thánh</span>
                <span className="text-[9px] text-[#718777]">JPD3 Cao Cấp</span>
              </div>
            </div>
            <span className="font-black text-amber-700 font-mono text-[11px]">1,450 XP</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="text-base">🥈</span>
              <div>
                <span className="font-bold text-[#143521] block text-[11px]">Nhị Lang Thần</span>
                <span className="text-[9px] text-[#718777]">JPD2 Trung Cấp</span>
              </div>
            </div>
            <span className="font-black text-slate-700 font-mono text-[11px]">1,280 XP</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/30">
            <div className="flex items-center gap-2">
              <span className="text-base">🥉</span>
              <div>
                <span className="font-bold text-[#143521] block text-[11px]">Na Tra Thái Tử</span>
                <span className="text-[9px] text-[#718777]">JPD2 Trung Cấp</span>
              </div>
            </div>
            <span className="font-black text-amber-800 font-mono text-[11px]">1,120 XP</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#ecfdf5] border border-emerald-300">
            <div className="flex items-center gap-2">
              <span className="w-5 text-center font-black text-emerald-800 text-[10px]">#4</span>
              <div>
                <span className="font-black text-emerald-900 block text-[11px]">Bạn (Học Giả Wukong)</span>
                <span className="text-[9px] text-emerald-700 font-semibold">Đang tu luyện</span>
              </div>
            </div>
            <span className="font-black text-emerald-700 font-mono text-[11px]">250 XP</span>
          </div>
        </div>
      </div>

      {/* Security Shield Badge */}
      <div className="rounded-2xl bg-stone-900 text-white p-3 text-center space-y-1">
        <div className="text-base">🛡️</div>
        <div className="text-[11px] font-black text-amber-300">
          Chống Clone &amp; Niệm Chú F12
        </div>
        <p className="text-[9px] text-stone-400 leading-relaxed">
          Toàn bộ tài nguyên, từ vựng và thuật toán được Tôn Ngộ Không bảo vệ toàn diện.
        </p>
      </div>
    </aside>
  );
};
