'use client';

import React, { useState } from 'react';
import { SocialSignIn066 } from '@/components/SocialSignIn066';
import { WukongMascot } from '@/components/WukongMascot';
import { useAuth } from '@/components/AuthContext';
import { sound } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { Sparkles, ShieldCheck, Lock } from 'lucide-react';

export const StandaloneLoginGate: React.FC = () => {
  const { login } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');

  const handleLoginSuccess = (provider: string, account: string) => {
    setIsSuccess(true);
    const displayName =
      provider === 'Google'
        ? 'Tề Thiên Học Giả'
        : provider === 'Apple'
        ? 'Mỹ Hầu Vương'
        : 'Học Viên Tôn Ngộ Không';

    setWelcomeName(displayName);

    // Burst golden celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#f59e0b', '#fbbf24', '#ffffff'],
      });
    } catch {}

    sound.playVictory();

    // Unlock and grant access after celebration
    setTimeout(() => {
      login(provider, account, displayName);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] min-h-screen w-full bg-[#0c140e] flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
      {/* Ambient Forest & Golden Light Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden">
        <img
          src="/images/home_forest_bg.jpg"
          alt="Bối cảnh tiên giới"
          className="w-full h-full object-cover filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c140e] via-[#0c140e]/85 to-[#0c140e]/95" />
      </div>

      {/* Decorative Golden Orbs */}
      <div className="fixed -top-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card Wrapper */}
      <div className="relative z-10 w-full max-w-[390px] flex flex-col items-center my-auto py-6 animate-fade-in">
        {/* Brand & Gate Header */}
        <div className="text-center mb-4 flex flex-col items-center">
          <div className="relative mb-2.5">
            <WukongMascot
              size="sm"
              mood={isSuccess ? 'happy' : 'idle'}
              showCloud={false}
            />
            <span className="absolute -top-1 -right-2 text-xl animate-bounce select-none">
              ⛩️
            </span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-emerald-500/30 mb-2 shadow-xs">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>CỔNG NHẬP MÔN • YÊU CẦU ĐĂNG NHẬP</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight">
            Manabi Wukong
          </h1>
          <p className="text-xs sm:text-[13px] text-stone-300 max-w-[320px] mt-1 font-medium leading-relaxed">
            {isSuccess
              ? `Chào mừng ${welcomeName} đã gia nhập môn phái! Đang mở cổng tu học…`
              : 'Vui lòng đăng nhập tài khoản để mở khóa toàn bộ giáo trình tiếng Nhật và bảng ải Boss.'}
          </p>
        </div>

        {/* Prompt #066 Social Sign-in Component */}
        <div className="w-full flex justify-center">
          <SocialSignIn066
            title="Đăng nhập môn phái"
            subtitle="Chọn tài khoản để mở cổng tu học"
            onSuccess={handleLoginSuccess}
          />
        </div>

        {/* Security / System Footer Note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bảo mật tiến độ học &amp; Điểm kinh nghiệm tu vi theo tài khoản</span>
        </div>
      </div>
    </div>
  );
};

export default StandaloneLoginGate;
