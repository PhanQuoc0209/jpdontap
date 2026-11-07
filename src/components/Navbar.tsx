'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Swords, Home, BarChart2, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/hoc-tap', label: 'Học tập', icon: BookOpen },
    { href: '/boss-battle', label: 'Đấu Boss', icon: Swords },
    { href: '/', label: 'Home', icon: Home, isCenter: true },
    { href: '/tien-do', label: 'Tiến độ', icon: BarChart2 },
    { href: '/ca-nhan', label: 'Cá nhân', icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 pointer-events-none">
      {/* Peeking Mascot above center button */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-auto select-none">
        <span className="text-xl filter drop-shadow">🐒</span>
      </div>

      <nav className="pointer-events-auto w-full bg-white/95 backdrop-blur-md border-t border-[#e2ece0] rounded-t-3xl shadow-[0_-4px_20px_rgba(20,53,33,0.06)] px-3 py-1.5 pb-5">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative -top-5 flex flex-col items-center group focus:outline-none"
                >
                  {/* Green leaves flanking center button */}
                  <div className="absolute inset-0 flex items-center justify-between px-0.5 -z-10 pointer-events-none text-emerald-500 text-sm">
                    <span className="-ml-2.5 -rotate-45">🌿</span>
                    <span className="-mr-2.5 rotate-45">🌿</span>
                  </div>

                  {/* Circular 3D Green Button */}
                  <div className="w-13 h-13 rounded-full bg-gradient-to-b from-[#34d399] via-[#10b981] to-[#059669] text-white flex items-center justify-center shadow-[0_6px_14px_rgba(16,185,129,0.4)] border-3 border-white transition-transform active:scale-90">
                    <Home className="w-6 h-6 stroke-[2.4]" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-1 px-2.5 transition-colors ${
                  isActive ? 'text-[#16a34a]' : 'text-[#718777] hover:text-[#143521]'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5] scale-110' : 'stroke-2'}`} />
                <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'font-bold text-[#15803d]' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
