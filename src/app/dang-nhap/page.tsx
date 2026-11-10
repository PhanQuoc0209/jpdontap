'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { SocialSignIn066 } from '@/components/SocialSignIn066';
import { WukongMascot } from '@/components/WukongMascot';
import { sound } from '@/lib/sound';

export default function DangNhapPage() {
  const [connectedAccount, setConnectedAccount] = useState<{ provider: string; account: string } | null>(null);

  const handleSuccess = (provider: string, account: string) => {
    setConnectedAccount({ provider, account });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-6 px-3 relative animate-fade-in">
      {/* Top Back Navigation */}
      <div className="w-full max-w-[380px] flex items-center justify-between mb-4">
        <Link
          href="/"
          onClick={() => sound.playTap()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-bold text-[#143521] border border-[#dce8d8] shadow-2xs transition-all hover:scale-102"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ</span>
        </Link>

        <span className="text-[11px] font-black text-[#15803d] uppercase tracking-wider bg-emerald-100/60 px-2.5 py-1 rounded-full border border-emerald-200">
          Tu Học Tiếng Nhật
        </span>
      </div>

      {/* Mascot Greeting Header */}
      <div className="w-full max-w-[380px] mb-4 text-center flex flex-col items-center">
        <div className="relative mb-2">
          <WukongMascot size="sm" mood={connectedAccount ? 'happy' : 'idle'} showCloud={false} />
          {connectedAccount && (
            <span className="absolute -top-1 -right-1 text-lg animate-bounce select-none">
              ✨
            </span>
          )}
        </div>

        <h1 className="text-lg sm:text-xl font-black text-[#143521]">
          Manabi Wukong ID
        </h1>
        <p className="text-xs text-[#597361] mt-0.5 max-w-[320px]">
          {connectedAccount
            ? `Chúc mừng bạn đã kết nối thành công với ${connectedAccount.provider}!`
            : 'Đăng nhập để đồng bộ tiến độ vượt ải và điểm tu vi trên mọi thiết bị'}
        </p>
      </div>

      {/* Prompt #066 Social Sign-In Component */}
      <div className="w-full flex justify-center">
        <SocialSignIn066
          title="Sẵn sàng tu học?"
          subtitle="Sử dụng tài khoản bạn đã có"
          onSuccess={handleSuccess}
        />
      </div>

      {/* Connected Account Banner Notification */}
      {connectedAccount && (
        <div className="mt-5 w-full max-w-[340px] rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 shadow-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-emerald-900 block truncate">
                Đã đồng bộ dữ liệu tu vi
              </span>
              <span className="text-[11px] text-emerald-700 truncate block">
                {connectedAccount.account}
              </span>
            </div>
          </div>
          <Link
            href="/ca-nhan"
            className="btn-3d-green px-3 py-1.5 rounded-full text-white text-[11px] font-black shrink-0 shadow-xs"
          >
            Vào hồ sơ
          </Link>
        </div>
      )}

      {/* Footer Terms */}
      <p className="text-[11px] text-[#718777] text-center mt-6 max-w-[300px]">
        Bằng cách tiếp tục, bạn đồng ý với Điều khoản môn phái &amp; Chính sách bảo mật tu học của Manabi Wukong.
      </p>
    </div>
  );
}
