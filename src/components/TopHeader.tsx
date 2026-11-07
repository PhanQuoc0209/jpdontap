'use client';

import React from 'react';
import Link from 'next/link';

interface TopHeaderProps {
  streak?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  streak = 0
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#f3f9f1]/90 backdrop-blur-md pt-3 pb-2 px-4 flex items-center justify-between border-b border-[#e5eee3]">
      {/* User Greeting & Mascot Icon */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="relative w-10 h-10 rounded-full bg-amber-100 border-2 border-emerald-400 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center text-xl overflow-hidden">
          🐒
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-sm font-black text-[#143521]">Xin chào!</span>
            <span className="text-xs">👋</span>
          </div>
          <p className="text-[11px] text-[#597361] font-medium">Hôm nay cùng học tiếng Nhật nào!</p>
        </div>
      </Link>

      {/* Streak Badge (Matching Pandarin's flame badge) */}
      <Link
        href="/tien-do"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fff5eb] border border-[#fed7aa] text-[#c2410c] text-xs font-black shadow-sm hover:scale-105 active:scale-95 transition-all"
      >
        <span className="text-sm">🔥</span>
        <span>{streak} ngày</span>
      </Link>
    </header>
  );
};
