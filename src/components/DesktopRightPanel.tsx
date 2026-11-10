'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  CheckCircle2,
  Zap,
  Target,
  PanelRightClose,
  X,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useLayout } from '@/components/LayoutContext';

interface DesktopRightPanelProps {
  isMobileDrawer?: boolean;
}

export const DesktopRightPanel: React.FC<DesktopRightPanelProps> = ({ isMobileDrawer = false }) => {
  const { isRightPanelVisible, toggleRightPanel, closeAllMobileDrawers } = useLayout();

  // If in desktop and not visible (and not in mobile drawer), do not render
  if (!isMobileDrawer && !isRightPanelVisible) {
    return null;
  }

  return (
    <aside
      className={`
        ${isMobileDrawer ? 'flex w-full h-full' : 'hidden lg:flex'}
        flex-col w-72 xl:w-80 min-w-72 xl:min-w-80 h-screen sticky top-0
        bg-[#f7faf5] border-l border-[#e1ede0] p-4 pb-6 overflow-y-auto z-40 select-none shadow-xs
        space-y-4 transition-all duration-300
      `}
    >
      {/* Header with Title and Close/Collapse Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e1ede0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-base shadow-2xs">
            ⚡
          </div>
          <div>
            <h2 className="text-xs font-black text-[#143521] uppercase tracking-wider">
              Bảng Điểm &amp; Tu Vi
            </h2>
            <p className="text-[10px] text-[#718777]">Thông số học tập thời gian thực</p>
          </div>
        </div>

        {isMobileDrawer ? (
          <button
            onClick={closeAllMobileDrawers}
            className="p-1.5 rounded-xl text-[#718777] hover:bg-[#eaf4e8] hover:text-[#143521] transition-all"
            title="Đóng bảng điểm"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={toggleRightPanel}
            className="p-1.5 rounded-xl text-[#718777] hover:bg-[#eaf4e8] hover:text-[#143521] transition-all cursor-pointer"
            title="Thu gọn bảng điểm bên phải"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Account Login Gateway Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-950 border border-emerald-500/30 p-3 text-white shadow-xs space-y-1.5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🔑</span>
            <span className="text-[11px] font-black text-amber-200">Tài khoản tu học</span>
          </div>
          <span className="px-1.5 py-0.2 rounded bg-emerald-600/80 text-white text-[9px] font-bold">
            Chưa đăng nhập
          </span>
        </div>
        <p className="text-[10px] text-stone-300 leading-snug">
          Đăng nhập qua Google/Apple/Kakao để lưu tiến độ tu vi &amp; bảng xếp hạng.
        </p>
        <Link
          href="/dang-nhap"
          className="w-full mt-1 py-1.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-[11px] font-bold text-center block shadow-xs transition-colors"
        >
          Cổng Đăng Nhập (Prompt #066) ➔
        </Link>
      </div>

      {/* 4 Quick Points & Stats Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black uppercase text-[#889e8f] tracking-wider">
            Chỉ số tu vi Đại Thánh
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Cấp 3 JPD1
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Flame / Streak */}
          <Link
            href="/tien-do"
            className="rounded-2xl bg-white border border-[#fed7aa] p-2.5 text-center shadow-2xs hover:border-orange-400 hover:shadow-xs transition-all group"
          >
            <span className="text-base block group-hover:scale-110 transition-transform">🔥</span>
            <span className="text-base font-black text-[#ea580c] block">7</span>
            <span className="text-[9px] font-bold text-[#8c6753]">Chuỗi ngày</span>
          </Link>

          {/* Peaches */}
          <div className="rounded-2xl bg-white border border-pink-200 p-2.5 text-center shadow-2xs hover:border-pink-300 transition-all group">
            <span className="text-base block group-hover:scale-110 transition-transform">🍑</span>
            <span className="text-base font-black text-pink-600 block">12</span>
            <span className="text-[9px] font-bold text-pink-800">Đào Tiên</span>
          </div>

          {/* XP */}
          <div className="rounded-2xl bg-white border border-amber-200 p-2.5 text-center shadow-2xs hover:border-amber-300 transition-all group">
            <span className="text-base block group-hover:scale-110 transition-transform">⚡</span>
            <span className="text-base font-black text-amber-600 block">250</span>
            <span className="text-[9px] font-bold text-amber-800">Điểm XP</span>
          </div>
        </div>
      </div>

      {/* Daily Point Quests Box */}
      <div className="rounded-2xl bg-white border border-[#e1ede0] p-3.5 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black text-[#143521]">Nhiệm vụ nhận điểm hôm nay</h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            2/3 xong
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-[#e2ede0] overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full w-[67%]" />
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/80 text-[#15803d]">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold line-through opacity-75 truncate">
                Khám phá 12 từ vựng mới
              </span>
            </div>
            <span className="text-[10px] font-mono font-black text-emerald-700 shrink-0 ml-1">
              +30 XP
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/80 text-[#15803d]">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold line-through opacity-75 truncate">
                Luyện viết 5 chữ Hán N5
              </span>
            </div>
            <span className="text-[10px] font-mono font-black text-emerald-700 shrink-0 ml-1">
              +30 XP
            </span>
          </div>

          <Link
            href="/boss-battle"
            className="flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Zap className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
              <span className="text-[11px] font-black truncate">
                Đánh bại 1 Trùm Cuối JPD
              </span>
            </div>
            <span className="text-[10px] font-mono font-black text-amber-700 shrink-0 ml-1">
              +100 XP
            </span>
          </Link>
        </div>
      </div>

      {/* Leaderboard: Bảng Vàng Điểm Đấu Trường */}
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
          <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-200/60">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">🥇</span>
              <div className="min-w-0 truncate">
                <span className="font-black text-[#143521] block text-[11px] truncate">
                  Tề Thiên Đại Thánh
                </span>
                <span className="text-[9px] text-[#718777]">JPD3 Cao Cấp</span>
              </div>
            </div>
            <span className="font-black text-amber-700 font-mono text-[11px] shrink-0 ml-1">
              1,450 XP
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">🥈</span>
              <div className="min-w-0 truncate">
                <span className="font-bold text-[#143521] block text-[11px] truncate">
                  Nhị Lang Thần
                </span>
                <span className="text-[9px] text-[#718777]">JPD2 Trung Cấp</span>
              </div>
            </div>
            <span className="font-black text-slate-700 font-mono text-[11px] shrink-0 ml-1">
              1,280 XP
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/30">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">🥉</span>
              <div className="min-w-0 truncate">
                <span className="font-bold text-[#143521] block text-[11px] truncate">
                  Na Tra Thái Tử
                </span>
                <span className="text-[9px] text-[#718777]">JPD2 Trung Cấp</span>
              </div>
            </div>
            <span className="font-black text-amber-800 font-mono text-[11px] shrink-0 ml-1">
              1,120 XP
            </span>
          </div>

          {/* Current User Rank */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#ecfdf5] border-2 border-emerald-400 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 text-center font-black text-emerald-800 text-[10px] shrink-0">
                #4
              </span>
              <div className="min-w-0 truncate">
                <span className="font-black text-emerald-900 block text-[11px] truncate">
                  Bạn (Học Giả Wukong)
                </span>
                <span className="text-[9px] text-emerald-700 font-semibold">
                  Đang tích điểm
                </span>
              </div>
            </div>
            <span className="font-black text-emerald-700 font-mono text-[11px] shrink-0 ml-1">
              250 XP
            </span>
          </div>
        </div>
      </div>

      {/* Points History Snippet */}
      <div className="rounded-2xl bg-white border border-[#e1ede0] p-3 shadow-2xs space-y-1.5">
        <div className="flex items-center gap-1.5 text-[#143521]">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Tích lũy gần đây
          </span>
        </div>
        <div className="space-y-1 text-[10px] text-[#597361]">
          <div className="flex justify-between">
            <span>⚡ Đấu Ải Xích Hỏa Long</span>
            <span className="font-bold text-emerald-600">+50 XP</span>
          </div>
          <div className="flex justify-between">
            <span>🎴 Học Flashcards SRS</span>
            <span className="font-bold text-emerald-600">+20 XP</span>
          </div>
          <div className="flex justify-between">
            <span>✍️ Luyện viết Kanji</span>
            <span className="font-bold text-emerald-600">+10 XP</span>
          </div>
        </div>
      </div>

      {/* Security Protection Shield */}
      <div className="rounded-2xl bg-[#1c2e22] text-white p-3 text-center space-y-1">
        <div className="flex items-center justify-center gap-1 text-amber-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bảo Hộ Bản Quyền F12</span>
        </div>
        <p className="text-[9px] text-stone-300 leading-relaxed">
          Dữ liệu bài học và thuật toán được phong ấn an toàn bởi Gậy Như Ý.
        </p>
      </div>
    </aside>
  );
};
