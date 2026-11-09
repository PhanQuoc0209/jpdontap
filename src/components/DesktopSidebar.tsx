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
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { WukongMascot } from '@/components/WukongMascot';
import { useLayout } from '@/components/LayoutContext';

interface DesktopSidebarProps {
  isMobileDrawer?: boolean;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ isMobileDrawer = false }) => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, closeAllMobileDrawers } = useLayout();

  // If in mobile drawer, never show collapsed mode
  const collapsed = isMobileDrawer ? false : isSidebarCollapsed;

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

  const handleLinkClick = () => {
    if (isMobileDrawer) {
      closeAllMobileDrawers();
    }
  };

  return (
    <aside
      className={`
        ${isMobileDrawer ? 'flex w-full h-full' : 'hidden lg:flex'}
        flex-col h-screen sticky top-0 bg-[#f7faf5] border-r border-[#e1ede0] select-none shadow-xs
        transition-[width] duration-300 ease-in-out z-40
        ${collapsed ? 'w-[72px] min-w-[72px] p-2.5 items-center' : 'w-64 xl:w-72 min-w-64 xl:min-w-72 p-4'}
        pb-6 overflow-y-auto overflow-x-hidden
      `}
    >
      {/* Brand Header */}
      <div className={`w-full flex items-center ${collapsed ? 'flex-col gap-3 pb-3' : 'justify-between pb-4'} border-b border-[#e1ede0]`}>
        <Link
          href="/"
          onClick={handleLinkClick}
          className={`flex items-center gap-2.5 group ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
            ⛩️
          </div>

          {!collapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <h1 className="text-sm font-black text-[#143521] tracking-tight truncate">
                MANABI WUKONG
              </h1>
              <p className="text-[10px] text-[#718777] font-semibold truncate">
                Tiếng Nhật JPD • Game RPG
              </p>
            </div>
          )}
        </Link>

        {/* Toggle Collapse/Expand Button (Desktop) or Close Button (Mobile) */}
        {isMobileDrawer ? (
          <button
            onClick={closeAllMobileDrawers}
            className="p-1.5 rounded-xl text-[#718777] hover:bg-[#eaf4e8] hover:text-[#143521] transition-all"
            title="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-xl text-[#718777] hover:bg-[#eaf4e8] hover:text-[#15803d] transition-all cursor-pointer"
            title={collapsed ? 'Mở rộng thanh menu (Ctrl+B)' : 'Thu gọn thanh menu (Ctrl+B)'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-[#15803d]" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Mascot Profile Widget */}
      {collapsed ? (
        // Compact Mascot Badge when Collapsed
        <div className="my-3 group relative flex flex-col items-center">
          <Link
            href="/tien-do"
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#fef3c7] to-[#fed7aa] border border-amber-300 flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
            title="Ngộ Không Học Giả - Tu Vi: Cấp 3 (65%)"
          >
            <span className="text-xl">🐒</span>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
          </Link>
          {/* Tooltip */}
          <div className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-xl bg-[#143521] px-3 py-1.5 text-xs text-white opacity-0 shadow-xl group-hover:opacity-100 transition-opacity">
            <span className="font-bold text-amber-300 block">Ngộ Không Học Giả</span>
            <span className="text-[10px] text-stone-300">Tu Vi Cấp 3 (Đột phá 65%)</span>
          </div>
        </div>
      ) : (
        // Full Mascot Card when Expanded
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
              <span className="text-[10px] font-bold text-[#b45309] block truncate">
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
      )}

      {/* Navigation Links */}
      <div className={`flex-1 w-full space-y-1 py-1 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        {!collapsed && (
          <span className="text-[10px] font-black uppercase text-[#889e8f] tracking-wider px-3 mb-1 block">
            Tính năng môn phái
          </span>
        )}

        {navLinks.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (collapsed) {
            // Collapsed Item: Icon only with floating hover tooltip
            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all relative ${
                    isActive
                      ? 'bg-[#e2f4e0] text-[#15803d] shadow-sm font-black'
                      : 'text-[#597361] hover:bg-[#eef6eb] hover:text-[#143521]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#15803d] stroke-[2.5]' : 'text-[#718777]'}`} />

                  {item.badge && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 ring-2 ring-[#f7faf5]" />
                  )}
                </Link>

                {/* Floating Tooltip */}
                <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-xl bg-[#143521] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-black uppercase">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Expanded Item: Icon + Label + Badge
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#e2f4e0] text-[#15803d] font-black shadow-xs'
                  : 'text-[#597361] hover:bg-[#eef6eb] hover:text-[#143521]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#15803d]' : 'text-[#718777]'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black uppercase tracking-wider shrink-0 animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Course Switcher Footer */}
      <div className={`w-full pt-3 border-t border-[#e1ede0] ${collapsed ? 'flex flex-col items-center gap-1' : 'space-y-1.5'}`}>
        {!collapsed && (
          <span className="text-[10px] font-black uppercase text-[#889e8f] tracking-wider px-2 block">
            Chương trình JPD
          </span>
        )}

        {collapsed ? (
          // Collapsed Course Switcher: Compact Pills with Tooltips
          <div className="flex flex-col gap-1 w-full items-center">
            {[
              { id: '113', name: 'JPD113', sub: 'Nhật 1' },
              { id: '123', name: 'JPD123', sub: 'Nhật 2' },
              { id: '133', name: 'JPD133', sub: 'Nhật 3' },
            ].map(c => (
              <div key={c.id} className="group relative">
                <Link
                  href={`/hoc-tap?course=jpd${c.id}`}
                  onClick={handleLinkClick}
                  className="w-10 h-7 rounded-xl bg-white border border-[#e1ede0] text-center text-[10px] font-black text-[#143521] hover:border-[#22c55e] flex items-center justify-center shadow-2xs hover:bg-emerald-50 transition-colors"
                >
                  {c.id}
                </Link>
                <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-xl bg-[#143521] px-2.5 py-1 text-[11px] font-bold text-white opacity-0 shadow-lg group-hover:opacity-100 transition-opacity">
                  {c.name} ({c.sub})
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Expanded Course Switcher: 3 Column Buttons
          <div className="grid grid-cols-3 gap-1">
            <Link
              href="/hoc-tap?course=jpd113"
              onClick={handleLinkClick}
              className="p-1.5 rounded-xl bg-white border border-[#e1ede0] text-center text-[10px] font-bold text-[#143521] hover:border-[#22c55e] hover:bg-emerald-50 shadow-2xs transition-colors"
            >
              JPD113
              <span className="block text-[8px] text-[#718777]">Nhật 1</span>
            </Link>
            <Link
              href="/hoc-tap?course=jpd123"
              onClick={handleLinkClick}
              className="p-1.5 rounded-xl bg-white border border-[#e1ede0] text-center text-[10px] font-bold text-[#143521] hover:border-[#22c55e] hover:bg-emerald-50 shadow-2xs transition-colors"
            >
              JPD123
              <span className="block text-[8px] text-[#718777]">Nhật 2</span>
            </Link>
            <Link
              href="/hoc-tap?course=jpd133"
              onClick={handleLinkClick}
              className="p-1.5 rounded-xl bg-white border border-[#e1ede0] text-center text-[10px] font-bold text-[#143521] hover:border-[#22c55e] hover:bg-emerald-50 shadow-2xs transition-colors"
            >
              JPD133
              <span className="block text-[8px] text-[#718777]">Nhật 3</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};
