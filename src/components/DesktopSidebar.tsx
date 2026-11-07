'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Swords,
  BookOpen,
  PenTool,
  Mic,
  Layers,
  BarChart2,
  Sparkles,
  User,
  Flame,
  Award
} from 'lucide-react';
import { WukongMascot } from '@/components/WukongMascot';

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/boss-battle', label: 'Đấu Boss Vượt Ải', icon: Swords, badge: 'Chiến' },
    { href: '/kham-pha', label: 'Khám phá từ mới', icon: BookOpen },
    { href: '/luyen-viet', label: 'Luyện viết chữ Hán', icon: PenTool },
    { href: '/phat-am', label: 'Luyện phát âm', icon: Mic },
    { href: '/flashcards', label: 'Flashcards SRS', icon: Layers },
    { href: '/tien-do', label: 'Tiến độ & Năng lực', icon: BarChart2 },
    { href: '/mua-chu', label: 'Mưa Chữ Minigame', icon: Sparkles, badge: 'Game' },
    { href: '/ca-nhan', label: 'Cá nhân & Cài đặt', icon: User }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 bg-[#f7faf5] border-r border-[#e1ede0] p-4 pb-6 overflow-y-auto z-40 select-none shadow-xs">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-2.5 pb-4 border-b border-[#e1ede0] group">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
          ⛩️
        </div>
        <div>
          <h1 className="text-sm font-black text-[#143521] tracking-tight flex items-center gap-1">
            <span>MANABI WUKONG</span>
          </h1>
          <p className="text-[10px] text-[#718777] font-semibold">
            Tiếng Nhật JPD • Game RPG
          </p>
        </div>
      </Link>

      {/* Wukong Mini Profile Card */}
      <div className="my-4 rounded-2xl bg-gradient-to-br from-[#f8f5ea] to-[#eee4d2] border border-[#e2d5bd] p-3 shadow-xs space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 shrink-0 flex items-center justify-center">
            <WukongMascot mood="happy" size="sm" showCloud={false} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-[#2e1d0f] truncate">Ngộ Không Học Giả</span>
              <span className="text-[10px]">🔥</span>
            </div>
            <span className="text-[10px] font-bold text-[#b45309] block">
              Tu Vi: Cấp 3 (JPD1 Sơ Khởi)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[9px] font-bold text-[#718777]">
            <span>Đột phá cảnh giới</span>
            <span>65%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#dfd3bc] overflow-hidden">
            <div className="h-full bg-[#22c55e] rounded-full w-[65%]" />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1 py-1">
        <span className="text-[10px] font-black uppercase text-[#889e8f] tracking-wider px-3 mb-1 block">
          Tính năng môn phái
        </span>

        {navLinks.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#e2f4e0] text-[#15803d] font-black shadow-xs'
                  : 'text-[#597361] hover:bg-[#eef6eb] hover:text-[#143521]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#15803d]' : 'text-[#718777]'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.2 rounded-md bg-red-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Course Switcher Footer */}
      <div className="pt-3 border-t border-[#e1ede0] space-y-1.5">
        <span className="text-[10px] font-black uppercase text-[#889e8f] tracking-wider px-2 block">
          Chương trình JPD
        </span>
        <div className="grid grid-cols-3 gap-1">
          <Link
            href="/hoc-tap?course=jpd113"
            className="p-1.5 rounded-xl bg-white border border-[#e1ede0] text-center text-[10px] font-bold text-[#143521] hover:border-[#22c55e] shadow-2xs"
          >
            JPD113
            <span className="block text-[8px] text-[#718777]">Nhật 1</span>
          </Link>
          <Link
            href="/hoc-tap?course=jpd123"
            className="p-1.5 rounded-xl bg-white border border-[#e1ede0] text-center text-[10px] font-bold text-[#143521] hover:border-[#22c55e] shadow-2xs"
          >
            JPD123
            <span className="block text-[8px] text-[#718777]">Nhật 2</span>
          </Link>
          <Link
            href="/hoc-tap?course=jpd133"
            className="p-1.5 rounded-xl bg-white border border-[#e1ede0] text-center text-[10px] font-bold text-[#143521] hover:border-[#22c55e] shadow-2xs"
          >
            JPD133
            <span className="block text-[8px] text-[#718777]">Nhật 3</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
