'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, PanelRightClose, PanelRightOpen, Zap, LogOut } from 'lucide-react';
import { useLayout } from '@/components/LayoutContext';
import { useAuth } from '@/components/AuthContext';

interface TopHeaderProps {
  streak?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  streak = 7
}) => {
  const { user, logout } = useAuth();
  const {
    isRightPanelVisible,
    toggleRightPanel,
    setIsMobileSidebarOpen,
    setIsMobilePointsOpen,
  } = useLayout();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#f3f9f1]/90 backdrop-blur-md pt-3 pb-2 px-3 sm:px-4 flex items-center justify-between border-b border-[#e5eee3]">
      {/* Left: Mobile Menu Trigger + Mascot Greeting */}
      <div className="flex items-center gap-2">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-[#143521] hover:bg-[#e1ede0] active:scale-95 transition-all cursor-pointer"
          title="Mở menu điều hướng"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mascot Avatar & Greeting */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-100 border-2 border-emerald-400 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center text-lg sm:text-xl overflow-hidden shrink-0">
            🐒
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm font-black text-[#143521]">
                {user ? user.name : 'Xin chào!'}
              </span>
              <span className="text-xs">👋</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#597361] font-medium hidden xs:block truncate">
              {user ? `${user.account} (${user.provider})` : 'Hôm nay cùng học tiếng Nhật nào!'}
            </p>
          </div>
        </Link>
      </div>

      {/* Right: Interactive Points Badge & Desktop Panel Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Interactive Points Pill (Tapping opens Right Points Drawer on mobile, or toggles on desktop) */}
        <div className="group relative">
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                setIsMobilePointsOpen(true);
              } else {
                toggleRightPanel();
              }
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#fff5eb] border border-[#fed7aa] text-[#c2410c] text-xs font-black shadow-xs hover:border-orange-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Xem thành tích & Bảng điểm"
          >
            <span className="text-xs sm:text-sm">🔥</span>
            <span className="text-[11px] sm:text-xs">{streak} ngày</span>
            <span className="text-[#fed7aa] font-normal">|</span>
            <span className="text-xs sm:text-sm text-amber-500">⚡</span>
            <span className="text-[11px] sm:text-xs text-amber-700 hidden sm:inline">250 XP</span>
            <span className="text-xs text-amber-700 sm:hidden">250</span>
          </button>
          {/* Tooltip */}
          <div className="pointer-events-none absolute right-0 top-full mt-2 z-[110] whitespace-nowrap rounded-xl bg-[#0e2917] border border-emerald-500/40 px-3 py-1.5 text-xs text-white opacity-0 shadow-2xl translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150">
            <span className="absolute right-4 -top-1 w-2 h-2 bg-[#0e2917] border-l border-t border-emerald-500/40 rotate-45" />
            <div className="font-black text-amber-300">Thành Tích &amp; Điểm Tu Vi</div>
            <div className="text-[10px] text-emerald-200/80">Chuỗi {streak} ngày tu học liên tục • 250 XP tích lũy</div>
          </div>
        </div>

        {/* Logout Button (Khóa cổng tu học) */}
        <div className="group relative">
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all cursor-pointer active:scale-95 shadow-2xs"
            aria-label="Đăng xuất tài khoản"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden xs:inline">Đăng xuất</span>
          </button>
          {/* Tooltip */}
          <div className="pointer-events-none absolute right-0 top-full mt-2 z-[110] whitespace-nowrap rounded-xl bg-[#0e2917] border border-rose-500/40 px-3 py-1.5 text-xs text-white opacity-0 shadow-2xl translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150">
            <span className="absolute right-4 -top-1 w-2 h-2 bg-[#0e2917] border-l border-t border-rose-500/40 rotate-45" />
            <div className="font-black text-rose-300">Đăng Xuất (Khóa Cổng)</div>
            <div className="text-[10px] text-stone-300">Lưu tiến trình và thoát tài khoản an toàn</div>
          </div>
        </div>

        {/* Desktop Toggle Button for Right Points Panel */}
        <div className="group relative hidden lg:block">
          <button
            onClick={toggleRightPanel}
            className="p-1.5 rounded-xl text-[#718777] hover:bg-[#e1ede0] hover:text-[#143521] transition-all cursor-pointer"
            aria-label={isRightPanelVisible ? 'Thu gọn bảng điểm bên phải' : 'Mở bảng điểm bên phải'}
          >
            {isRightPanelVisible ? (
              <PanelRightClose className="w-5 h-5" />
            ) : (
              <PanelRightOpen className="w-5 h-5 text-amber-600" />
            )}
          </button>
          {/* Tooltip */}
          <div className="pointer-events-none absolute right-0 top-full mt-2 z-[110] whitespace-nowrap rounded-xl bg-[#0e2917] border border-emerald-500/40 px-3 py-1.5 text-xs text-white opacity-0 shadow-2xl translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150">
            <span className="absolute right-3 -top-1 w-2 h-2 bg-[#0e2917] border-l border-t border-emerald-500/40 rotate-45" />
            <div className="font-black text-amber-300">
              {isRightPanelVisible ? 'Thu gọn Bảng Điểm & Tu Vi' : 'Mở Bảng Điểm & Tu Vi Bên Phải'}
            </div>
            <div className="text-[10px] text-emerald-200/80">
              {isRightPanelVisible ? 'Ẩn thanh công cụ theo dõi bên phải' : 'Xem nhiệm vụ ngày, tu vi & bảng vàng'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
