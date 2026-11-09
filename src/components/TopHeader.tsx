'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, PanelRightClose, PanelRightOpen, Zap } from 'lucide-react';
import { useLayout } from '@/components/LayoutContext';

interface TopHeaderProps {
  streak?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  streak = 7
}) => {
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
              <span className="text-xs sm:text-sm font-black text-[#143521]">Xin chào!</span>
              <span className="text-xs">👋</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#597361] font-medium hidden xs:block truncate">
              Hôm nay cùng học tiếng Nhật nào!
            </p>
          </div>
        </Link>
      </div>

      {/* Right: Interactive Points Badge & Desktop Panel Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Interactive Points Pill (Tapping opens Right Points Drawer on mobile, or toggles on desktop) */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              setIsMobilePointsOpen(true);
            } else {
              toggleRightPanel();
            }
          }}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#fff5eb] border border-[#fed7aa] text-[#c2410c] text-xs font-black shadow-xs hover:border-orange-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Bấm để xem chi tiết Bảng Điểm, Nhiệm Vụ & Xếp Hạng"
        >
          <span className="text-xs sm:text-sm">🔥</span>
          <span className="text-[11px] sm:text-xs">{streak} ngày</span>
          <span className="text-[#fed7aa] font-normal">|</span>
          <span className="text-xs sm:text-sm text-amber-500">⚡</span>
          <span className="text-[11px] sm:text-xs text-amber-700 hidden sm:inline">250 XP</span>
          <span className="text-xs text-amber-700 sm:hidden">250</span>
        </button>

        {/* Desktop Toggle Button for Right Points Panel */}
        <button
          onClick={toggleRightPanel}
          className="hidden lg:flex p-1.5 rounded-xl text-[#718777] hover:bg-[#e1ede0] hover:text-[#143521] transition-all cursor-pointer"
          title={isRightPanelVisible ? 'Thu gọn bảng điểm bên phải' : 'Mở bảng điểm bên phải'}
        >
          {isRightPanelVisible ? (
            <PanelRightClose className="w-5 h-5" />
          ) : (
            <PanelRightOpen className="w-5 h-5 text-amber-600" />
          )}
        </button>
      </div>
    </header>
  );
};
