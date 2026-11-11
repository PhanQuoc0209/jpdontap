'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WukongMascot } from '@/components/WukongMascot';
import { useAuth } from '@/components/AuthContext';
import { User, Trophy, Flame, Star, Shield, Award, Settings, Bell, Volume2, Sparkles, ChevronRight, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function CaNhanPage() {
  const { user, logout } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const achievements = [
    { id: 1, title: 'Nhập Môn Tây Du', desc: 'Học trọn vẹn bảng chữ cái Hiragana', icon: '📜', completed: true },
    { id: 2, title: 'Đả Bại Xích Hỏa Long', desc: 'Chiến thắng Boss Ải 1 Núi Hoa Quả Sơn', icon: '🐉', completed: true },
    { id: 3, title: 'Hỏa Nhãn Kim Tinh', desc: 'Viết chuẩn 10 chữ Hán N5 đầu tiên', icon: '✍️', completed: true },
    { id: 4, title: 'Thất Thập Nhị Biến', desc: 'Thuộc làu 100 từ vựng giáo trình JPD', icon: '🐒', completed: false, progress: '38/100' },
    { id: 5, title: 'Đấu Chiến Thắng Phật', desc: 'Vượt qua trọn vẹn 8 Đại Ải Tây Du', icon: '👑', completed: false, progress: '1/8' }
  ];

  return (
    <div className="pt-2 pb-6 space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sound.playTap()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100/70 px-2.5 py-1 rounded-full border border-amber-300/60">
          Hồ Sơ Tu Hành
        </span>
      </div>

      {/* Hero Profile Card */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-950/70 via-stone-900 to-amber-900/50 border border-amber-600/30 p-5 shadow-2xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left text-white">
        <div className="relative">
          <WukongMascot size="lg" mood="happy" showCloud={false} />
          <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] uppercase shadow">
            Cấp 3
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Danh hiệu: {user?.name || 'Mỹ Hầu Vương'}
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              title="Đăng xuất khỏi tài khoản này"
            >
              <LogOut className="w-3 h-3" />
              <span>Đăng xuất</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-amber-100">
            {user ? user.name : 'Học Viên Tu Học Tiếng Nhật'}
          </h2>
          <p className="text-xs text-stone-300">
            {user ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã kết nối với {user.provider} ({user.account})
              </span>
            ) : (
              <>Tiếp theo: <strong className="text-amber-300">Tề Thiên Đại Thánh</strong> (Cần thêm 260 XP)</>
            )}
          </p>

          {/* Level Progress bar */}
          <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden mt-1">
            <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full w-[48%]" />
          </div>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-stone-900/80 border border-stone-800 p-3 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg">
            🔥
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Chuỗi ngày</span>
            <span className="text-base font-black text-stone-100">3 ngày</span>
          </div>
        </div>

        <div className="rounded-2xl bg-stone-900/80 border border-stone-800 p-3 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
            ⭐
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Kinh nghiệm</span>
            <span className="text-base font-black text-stone-100">240 XP</span>
          </div>
        </div>

        <div className="rounded-2xl bg-stone-900/80 border border-stone-800 p-3 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-lg">
            🍑
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Đào Tiên</span>
            <span className="text-base font-black text-stone-100">8 quả</span>
          </div>
        </div>

        <div className="rounded-2xl bg-stone-900/80 border border-stone-800 p-3 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
            🐉
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Ải Boss</span>
            <span className="text-base font-black text-stone-100">1 / 8 Ải</span>
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-stone-200 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" /> Bảng Chiến Tích & Danh Hiệu
        </h3>

        <div className="space-y-2">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 transition-colors ${
                ach.completed
                  ? 'bg-stone-900/90 border-amber-500/30'
                  : 'bg-stone-900/50 border-stone-800 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-stone-800 flex items-center justify-center text-2xl shrink-0">
                  {ach.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-100">{ach.title}</h4>
                  <p className="text-xs text-stone-400">{ach.desc}</p>
                </div>
              </div>

              {ach.completed ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">
                  Đã đạt
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-400 text-xs font-mono shrink-0">
                  {ach.progress}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Student Account Information Card (Replaces redundant login box when logged in) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-200 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" /> Thông Tin Tài Khoản Sinh Viên
          </h3>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã đăng nhập
          </span>
        </div>

        <div className="rounded-3xl bg-stone-900/80 border border-stone-800 p-5 shadow-lg space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="rounded-2xl bg-stone-950/60 border border-stone-800/80 p-3.5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Họ và Tên Học Viên
              </span>
              <span className="text-sm font-black text-amber-200 block">
                {user?.name || 'Mỹ Hầu Vương'}
              </span>
            </div>

            <div className="rounded-2xl bg-stone-950/60 border border-stone-800/80 p-3.5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Mã Số Sinh Viên (MSSV)
              </span>
              <span className="text-sm font-black text-emerald-300 font-mono block">
                {user?.mssv || 'SE18001'}
              </span>
            </div>

            <div className="rounded-2xl bg-stone-950/60 border border-stone-800/80 p-3.5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Lớp Học Hiện Tại
              </span>
              <span className="text-sm font-black text-amber-100 block">
                {user?.lop || 'JPD113 (Nhật 1 Sơ Cấp)'}
              </span>
            </div>

            <div className="rounded-2xl bg-stone-950/60 border border-stone-800/80 p-3.5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Phương Thức Đăng Nhập
              </span>
              <span className="text-sm font-bold text-stone-200 block">
                {user?.provider || 'Cổng Sinh Viên JPD'} ({user?.account || 'Tài khoản môn phái'})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/80">
            <p className="text-xs text-stone-400">
              Tiến trình học tập, điểm tu vi và boss vượt ải được lưu tự động theo tài khoản sinh viên.
            </p>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất (Khóa cổng)</span>
            </button>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-stone-200 flex items-center gap-2">
          <Settings className="w-4 h-4 text-stone-400" /> Cài Đặt Ứng Dụng
        </h3>

        <div className="rounded-2xl bg-stone-900/80 border border-stone-800 divide-y divide-stone-800">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-semibold text-stone-200">Hiệu ứng âm thanh & Phát âm</span>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span className="text-xs sm:text-sm font-semibold text-stone-200">Nhắc nhở học tập mỗi ngày</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
