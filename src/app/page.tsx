'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sound } from '@/lib/sound';
import { Play, ArrowRight, ChevronRight, Volume2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const [isFlying, setIsFlying] = useState(false);
  const [flyingBubbleText, setFlyingBubbleText] = useState('Bấm để ta lượn tiên cảnh! 🐵');

  const handleWukongFly = () => {
    if (isFlying) return;
    setIsFlying(true);
    sound.playCloudFly();

    // Trigger golden sparkles confetti burst
    try {
      confetti({
        particleCount: 25,
        spread: 55,
        colors: ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff'],
        origin: { x: 0.75, y: 0.35 }
      });
    } catch {}

    const flightQuotes = [
      'Cân Đẩu Vân... Vút bay! 🚀💨',
      'Lượn qua đỉnh núi tiên giới! ☁️✨',
      'Tiên cảnh bao la! Lão Tôn đây rồi! 🐵⛰️',
      'Du ngoạn 10 vạn 8 ngàn dặm! ⚡'
    ];
    const randomQuote = flightQuotes[Math.floor(Math.random() * flightQuotes.length)];
    setFlyingBubbleText(randomQuote);

    // After 2.5s approaching landing
    setTimeout(() => {
      setFlyingBubbleText('Lão Tôn đã hạ cánh! Cùng ta ôn bài nào! 🌟');
      sound.playVictory();
    }, 2600);

    // End flight animation at 3.2s
    setTimeout(() => {
      setIsFlying(false);
    }, 3300);

    // Reset speech bubble to prompt after 6.5s
    setTimeout(() => {
      setFlyingBubbleText('Bấm để ta lượn tiên cảnh! 🐵');
    }, 6500);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Hero Banner: Full-Bleed Mythical Forest Landscape + Real Floating Card (Ô Nổi) + Flying Wukong */}
      <div className="relative overflow-hidden rounded-[2rem] border border-amber-900/20 shadow-[0_16px_36px_rgba(20,53,33,0.12)] min-h-[250px] sm:min-h-[280px] flex items-center justify-between p-4 sm:p-7 w-full">
        {/* Background Image: Pure Mythical Pagoda Forest (Edge to edge full-bleed, NO baked Wukong) */}
        <img
          src="/images/home_forest_bg.jpg"
          alt="Rừng núi tiên cảnh Ngộ Không"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />

        {/* Subtle Sunlight & Atmospheric Depth Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/15 via-transparent to-amber-900/10 pointer-events-none" />

        {/* Floating Content Card (Ô Nổi Thật, không phải ảnh phẳng) */}
        <div className="relative z-10 rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 border border-white/90 shadow-[0_12px_30px_rgba(20,53,33,0.18)] max-w-[250px] sm:max-w-xs space-y-2.5 animate-fade-in shrink-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm">
            <span>NHIỆM VỤ TIẾP THEO</span>
            <span className="text-amber-200">✦</span>
          </div>

          {/* Heading */}
          <h1 className="text-base sm:text-xl font-black text-[#2e1d0f] leading-snug">
            Ôn lại 4 mục đến hạn<br />cùng Ngộ Không
          </h1>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-xs text-[#6d5b4b] leading-relaxed font-medium">
            Những mục đến hạn có nguy cơ bị quên cao nhất.
          </p>

          {/* 3D Green Button */}
          <div className="pt-1">
            <Link
              href="/flashcards"
              onClick={() => sound.playCorrect()}
              className="btn-3d-green inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs sm:text-sm font-black tracking-wide shadow-md active:scale-95 transition-transform"
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              <span>Ôn ngay</span>
            </Link>
          </div>
        </div>

        {/* Interactive 3D Wukong Flying around the Forest Banner */}
        <div
          onClick={handleWukongFly}
          className={`
            relative z-20 cursor-pointer select-none
            flex flex-col items-center justify-center shrink-0
            transition-transform duration-300
            ${isFlying ? 'animate-wukong-fly pointer-events-none' : 'hover:scale-105 active:scale-95'}
          `}
          title="Bấm vào Ngộ Không để cưỡi Cân Đẩu Vân bay lượn quanh khu rừng!"
        >
          {/* Flying Speech Bubble */}
          <div className="relative mb-1.5 max-w-[170px] sm:max-w-[210px] rounded-2xl bg-amber-50/95 backdrop-blur-xs border-2 border-amber-300 px-3 py-1.5 text-center shadow-lg transition-all animate-bounce">
            <p className="text-[10px] sm:text-xs font-black text-amber-950">
              {flyingBubbleText}
            </p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-amber-50 border-b-2 border-r-2 border-amber-300 rotate-45" />
          </div>

          {/* 3D Wukong Character with Cloud and Glow */}
          <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center">
            {/* Ambient Golden Cloud Aura */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/35 via-yellow-300/40 to-orange-400/35 blur-2xl pointer-events-none transition-all duration-300 ${
                isFlying ? 'opacity-100 scale-125 animate-pulse' : 'opacity-60'
              }`}
            />

            {/* Golden Cloud Trail when Flying */}
            {isFlying && (
              <div className="absolute -bottom-3 -left-4 w-12 h-12 bg-amber-300/80 rounded-full blur-md animate-cloud-trail pointer-events-none" />
            )}

            {/* Wukong 3D Sprite (User's Original 3D Wukong on Cân Đẩu Vân) */}
            <img
              src="/images/wukong_action.png"
              alt="Tôn Ngộ Không Cưỡi Cân Đẩu Vân"
              className={`
                w-full h-full object-contain filter drop-shadow-[0_10px_22px_rgba(245,158,11,0.5)]
                ${isFlying ? 'brightness-110 drop-shadow-[0_0_32px_rgba(245,158,11,0.95)]' : 'animate-float'}
              `}
            />

            {/* Dynamic Flying Effects */}
            {isFlying && (
              <>
                <span className="absolute -top-3 -right-2 text-2xl animate-ping select-none">✨</span>
                <span className="absolute bottom-1 -left-3 text-2xl animate-bounce select-none">💨</span>
                <span className="absolute -top-1 left-2 text-xl animate-pulse select-none">☁️</span>
              </>
            )}
          </div>

          {/* Interactive Hint Pill below Wukong (visible when idle) */}
          {!isFlying && (
            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-[10px] sm:text-[11px] font-bold text-amber-200 shadow-md flex items-center gap-1 border border-amber-400/50 hover:bg-stone-900">
              <span>☁️</span>
              <span>Bấm để Ngộ Không bay</span>
              <span>➔</span>
            </div>
          )}
        </div>
      </div>

      {/* Cổng Đăng Nhập Tu Học (Prompt #066 - Social Sign-In Portal) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#143521] via-[#1b432b] to-[#143521] border border-emerald-500/40 p-3 sm:p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            🔑
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-black text-amber-100 uppercase tracking-wide truncate">
                Cổng Đăng Nhập Tu Học
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase shadow-xs shrink-0">
                PROMPT #066
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 mt-0.5 font-medium line-clamp-1 sm:line-clamp-none">
              Đăng nhập qua Google, Kakao, Apple hoặc Email để lưu điểm tu vi &amp; bảo vệ dữ liệu.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setShowLoginGate(true);
            }}
            className="btn-3d-green px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-wider shrink-0 shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Mở Cổng</span>
          </button>

          <Link
            href="/dang-nhap"
            onClick={() => sound.playTap()}
            className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 text-xs font-bold border border-white/20 transition-all shrink-0 active:scale-95 text-center"
          >
            Trang riêng ➔
          </Link>
        </div>
      </div>

      {/* 3 Stat Cards (Matching Pandarin's soft pastel pagoda cards) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Flame: Ngày học */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#fff6f2] to-[#ffede5] border border-[#fed7aa]/60 p-2.5 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-baseline gap-1">
            <span className="text-base">🔥</span>
            <span className="text-xl font-black text-[#ea580c]">0</span>
          </div>
          <span className="text-[11px] font-semibold text-[#8c6753]">Ngày học</span>
        </div>

        {/* Book: Bài học */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#f2faf3] to-[#e4f5e7] border border-[#bbf7d0]/60 p-2.5 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-baseline gap-1">
            <span className="text-base">📖</span>
            <span className="text-xl font-black text-[#15803d]">4</span>
          </div>
          <span className="text-[11px] font-semibold text-[#54795e]">Bài học</span>
        </div>

        {/* Star: Điểm XP */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#fffdf0] to-[#fef9c3] border border-[#fef08a]/80 p-2.5 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-baseline gap-1">
            <span className="text-base">⭐</span>
            <span className="text-xl font-black text-[#d97706]">0</span>
          </div>
          <span className="text-[11px] font-semibold text-[#7d6741]">Điểm XP</span>
        </div>
      </div>

      {/* Section: Bài học hôm nay */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🐒</span>
            <h2 className="text-sm font-black text-[#143521]">Bài học hôm nay</h2>
          </div>
          <Link href="/hoc-tap" className="text-[11px] font-bold text-[#597361] hover:text-[#143521] flex items-center">
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Today Lesson Card */}
        <div className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_12px_rgba(20,53,33,0.04)]">
          <div className="flex items-center gap-3 min-w-0">
            {/* Green 3D Book Icon */}
            <div className="w-12 h-14 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#15803d] border-b-4 border-[#166534] flex items-center justify-center text-white text-xl font-black shadow-md shrink-0 jp-font">
              日
            </div>

            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-[#143521] truncate">
                BÀI 1: Bài học 1 (JPD113)
              </h3>
              <p className="text-[11px] text-[#718777] truncate mt-0.5">
                Nhiệm vụ: Ôn lại 4 mục đến hạn
              </p>
              {/* Progress bar */}
              <div className="mt-2 flex items-center gap-2">
                <div className="w-24 sm:w-32 h-1.5 rounded-full bg-[#eef4ec] overflow-hidden">
                  <div className="h-full bg-[#22c55e] rounded-full w-[0%]" />
                </div>
                <span className="text-[10px] font-bold text-[#8a9f90]">0%</span>
              </div>
            </div>
          </div>

          <Link
            href="/kham-pha"
            className="btn-3d-green px-3.5 py-1.5 rounded-full text-white text-[11px] font-black uppercase tracking-wider shrink-0"
          >
            ÔN NGAY
          </Link>
        </div>
      </div>

      {/* Section: Học nhanh (4 Pastel Buttons matching Pandarin) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🐒</span>
            <h2 className="text-sm font-black text-[#143521]">Học nhanh</h2>
          </div>
          <Link href="/hoc-tap" className="text-[11px] font-bold text-[#597361] hover:text-[#143521] flex items-center">
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* 1. Từ vựng (Pastel Pink) -> /kham-pha */}
          <Link
            href="/kham-pha"
            className="rounded-2xl bg-[#fef2f2] border border-[#fecaca] p-2.5 flex flex-col items-center text-center shadow-sm hover:scale-102 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#f87171] to-[#ef4444] text-white flex items-center justify-center font-black text-base shadow mb-1.5">
              字
            </div>
            <span className="text-[11px] font-black text-[#991b1b]">Từ vựng</span>
          </Link>

          {/* 2. Luyện viết (Pastel Blue) */}
          <Link
            href="/luyen-viet"
            className="rounded-2xl bg-[#eff6ff] border border-[#bfdbfe] p-2.5 flex flex-col items-center text-center shadow-sm hover:scale-102 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] text-white flex items-center justify-center font-black text-base shadow mb-1.5">
              永
            </div>
            <span className="text-[11px] font-black text-[#1e40af]">Luyện viết</span>
          </Link>

          {/* 3. Flashcards (Pastel Mint) */}
          <Link
            href="/flashcards"
            className="rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] p-2.5 flex flex-col items-center text-center shadow-sm hover:scale-102 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#34d399] to-[#10b981] text-white flex items-center justify-center font-black text-base shadow mb-1.5">
              学
            </div>
            <span className="text-[11px] font-black text-[#065f46]">Flashcards</span>
          </Link>

          {/* 4. Luyện nói (Pastel Yellow) */}
          <Link
            href="/phat-am"
            className="rounded-2xl bg-[#fefce8] border border-[#fef08a] p-2.5 flex flex-col items-center text-center shadow-sm hover:scale-102 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#facc15] to-[#eab308] text-white flex items-center justify-center text-lg shadow mb-1.5">
              🎤
            </div>
            <span className="text-[11px] font-black text-[#854d0e]">Luyện nói</span>
          </Link>
        </div>
      </div>

      {/* Section: Thử thách hôm nay */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🐒</span>
            <h2 className="text-sm font-black text-[#143521]">Thử thách hôm nay</h2>
          </div>
          <Link href="/tien-do" className="text-[11px] font-bold text-[#597361] hover:text-[#143521] flex items-center">
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 flex items-center justify-between gap-3 shadow-[0_4px_12px_rgba(20,53,33,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl shrink-0">
              🎯
            </div>
            <div>
              <p className="text-xs font-black text-[#143521]">Hoàn thành 10 câu hỏi</p>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="w-32 h-1.5 rounded-full bg-[#eef4ec] overflow-hidden">
                  <div className="h-full bg-[#22c55e] rounded-full w-[60%]" />
                </div>
                <span className="text-[10px] font-bold text-[#8a9f90]">6/10</span>
              </div>
            </div>
          </div>

          {/* 3D Gift Box */}
          <div className="w-10 h-10 text-2xl flex items-center justify-center shrink-0 animate-bounce">
            🎁
          </div>
        </div>
      </div>

      {/* ⛩️ CỔNG ĐĂNG NHẬP TU HỌC BAN ĐẦU (Login Interface Shown First) */}
      {showLoginGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
          {/* Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-emerald-950/40 via-transparent to-amber-950/40" />

          <div className="relative w-full max-w-[400px] flex flex-col items-center my-auto py-4">
            {/* Mascot & Gate Header */}
            <div className="text-center mb-3 flex flex-col items-center">
              <div className="relative mb-2">
                <WukongMascot size="sm" mood={connectedUser ? 'happy' : 'idle'} showCloud={false} />
                <span className="absolute -top-1 -right-2 text-xl animate-bounce select-none">
                  ⛩️
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-500/40 mb-1">
                <span>MANABI WUKONG • CỔNG NHẬP MÔN</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-amber-100 tracking-tight">
                Đăng Nhập Tu Học
              </h1>
              <p className="text-xs text-stone-300 max-w-[310px] mt-0.5 font-medium">
                Chọn phương thức đăng nhập để khởi tạo pháp hiệu và đồng bộ tiến độ vượt ải
              </p>
            </div>

            {/* Prompt #066 Social Sign-in Component */}
            <div className="w-full flex justify-center">
              <SocialSignIn066
                title="Sẵn sàng tu học?"
                subtitle="Sử dụng tài khoản bạn đã có"
                onSuccess={(provider, account) => {
                  setConnectedUser({ provider, account });
                  try {
                    confetti({
                      particleCount: 70,
                      spread: 70,
                      origin: { y: 0.6 }
                    });
                  } catch {}
                  // Auto transition after connected
                  setTimeout(() => {
                    setShowLoginGate(false);
                  }, 2000);
                }}
              />
            </div>

            {/* Actions Below Sign-In */}
            <div className="mt-4 w-full flex flex-col items-center gap-2">
              {connectedUser ? (
                <button
                  type="button"
                  onClick={() => {
                    sound.playVictory();
                    setShowLoginGate(false);
                  }}
                  className="btn-3d-green w-full max-w-[340px] py-3 rounded-2xl text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer animate-pulse"
                >
                  <span>🚀 Vào Tu Học Ngay</span>
                  <span>➔</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setShowLoginGate(false);
                  }}
                  className="text-xs font-bold text-stone-300 hover:text-white hover:underline transition-colors flex items-center gap-1 py-1 px-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 cursor-pointer"
                >
                  <span>Bỏ qua &amp; Khám phá ngay với tư cách Khách</span>
                  <span>➔</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
