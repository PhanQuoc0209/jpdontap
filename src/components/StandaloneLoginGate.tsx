'use client';

import React, { useState } from 'react';
import { SocialSignIn066 } from '@/components/SocialSignIn066';
import { WukongMascot } from '@/components/WukongMascot';
import { useAuth } from '@/components/AuthContext';
import { sound } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { ShieldCheck, Lock, User, GraduationCap, Hash, Mail, KeyRound, ArrowRight } from 'lucide-react';

export const StandaloneLoginGate: React.FC = () => {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'student_id' | 'social'>('student_id');

  // Form states for Student ID Login & Register
  const [fullName, setFullName] = useState('');
  const [mssv, setMssv] = useState('');
  const [lop, setLop] = useState('JPD113');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');

  // Handle Student Login (Họ tên, Lớp, MSSV)
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên sinh viên');
      sound.playWrong();
      return;
    }
    if (!mssv.trim()) {
      setErrorMsg('Vui lòng nhập Mã số sinh viên (MSSV)');
      sound.playWrong();
      return;
    }

    setErrorMsg('');
    setIsSuccess(true);
    setWelcomeText(`Học viên ${fullName.trim()} (MSSV: ${mssv.trim()} • Lớp ${lop})`);

    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#f59e0b', '#fbbf24', '#ffffff'],
      });
    } catch {}

    sound.playVictory();

    setTimeout(() => {
      login('SinhVien', mssv.trim(), fullName.trim(), {
        mssv: mssv.trim(),
        lop: lop.trim(),
      });
    }, 1500);
  };

  // Handle Student Registration
  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên để đăng ký');
      sound.playWrong();
      return;
    }
    if (!mssv.trim()) {
      setErrorMsg('Vui lòng nhập Mã số sinh viên (MSSV)');
      sound.playWrong();
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ Email hợp lệ');
      sound.playWrong();
      return;
    }

    setErrorMsg('');
    setIsSuccess(true);
    setWelcomeText(`Đã khởi tạo tài khoản cho ${fullName.trim()} (MSSV: ${mssv.trim()})`);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ffffff'],
      });
    } catch {}

    sound.playVictory();

    setTimeout(() => {
      login('DangKy', email.trim(), fullName.trim(), {
        mssv: mssv.trim(),
        lop: lop.trim(),
      });
    }, 1500);
  };

  // Handle Social Login (Prompt #066)
  const handleSocialSuccess = (provider: string, account: string) => {
    setIsSuccess(true);
    const displayName =
      provider === 'Google'
        ? 'Tề Thiên Học Giả'
        : provider === 'Apple'
        ? 'Mỹ Hầu Vương'
        : 'Học Viên Tôn Ngộ Không';

    setWelcomeText(`${displayName} (${account})`);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#f59e0b', '#fbbf24', '#ffffff'],
      });
    } catch {}

    sound.playVictory();

    setTimeout(() => {
      login(provider, account, displayName, {
        mssv: 'SE18001',
        lop: 'JPD113',
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] min-h-screen w-full bg-[#0c140e] flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
      {/* Ambient Forest & Golden Light Background */}
      <div className="fixed inset-0 pointer-events-none opacity-35 overflow-hidden">
        <img
          src="/images/home_forest_bg.jpg"
          alt="Bối cảnh tiên giới"
          className="w-full h-full object-cover filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c140e] via-[#0c140e]/90 to-[#0c140e]" />
      </div>

      {/* Decorative Golden Orbs */}
      <div className="fixed -top-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card Wrapper */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center my-auto py-5 animate-fade-in">
        {/* Brand & Gate Header */}
        <div className="text-center mb-3 flex flex-col items-center">
          <div className="relative mb-2">
            <WukongMascot
              size="sm"
              mood={isSuccess ? 'happy' : 'idle'}
              showCloud={false}
            />
            <span className="absolute -top-1 -right-2 text-xl animate-bounce select-none">
              ⛩️
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-emerald-500/30 mb-1.5 shadow-xs">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>CỔNG NHẬP MÔN • YÊU CẦU ĐĂNG NHẬP</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight">
            Manabi Wukong
          </h1>
          <p className="text-xs text-stone-300 max-w-[340px] mt-0.5 font-medium leading-relaxed">
            {isSuccess
              ? `Chào mừng ${welcomeText}! Đang mở cổng tu học…`
              : 'Đăng nhập hoặc đăng ký thông tin sinh viên để mở khóa toàn bộ giáo trình JPD và ải Boss.'}
          </p>
        </div>

        {/* Primary Auth Mode Switcher: [ ĐĂNG NHẬP ] vs [ ĐĂNG KÝ ] */}
        <div className="w-full flex rounded-2xl bg-stone-900/90 border border-stone-800 p-1 mb-3.5 shadow-md">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setAuthMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setAuthMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="w-full mb-3 px-3.5 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold text-center animate-shake">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* TAB 1: ĐĂNG NHẬP (Sign In) */}
        {authMode === 'login' && (
          <div className="w-full space-y-3">
            {/* Sub-method switcher: Sinh viên (Tên/Lớp/MSSV) vs Mạng xã hội (#066) */}
            <div className="flex items-center justify-center gap-2 p-1 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setLoginMethod('student_id');
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                  loginMethod === 'student_id'
                    ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Nhập Tên, Lớp, MSSV
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setLoginMethod('social');
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                  loginMethod === 'social'
                    ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Mạng Xã Hội (Prompt #066)
              </button>
            </div>

            {/* Sub-method 1: Student Credentials Form */}
            {loginMethod === 'student_id' && (
              <form
                onSubmit={handleStudentLogin}
                className="w-full rounded-3xl bg-[#141d16] border border-emerald-500/30 p-5 shadow-2xl space-y-3.5"
              >
                <div className="text-center pb-1">
                  <h3 className="text-base font-black text-amber-100">
                    Đăng Nhập Sinh Viên JPD
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Nhập thông tin khóa học để lưu kết quả và xếp hạng
                  </p>
                </div>

                {/* Họ và tên */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Họ và tên sinh viên</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Phan Văn Quốc"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors"
                    required
                  />
                </div>

                {/* Lớp học */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lớp học / Khóa JPD</span>
                  </label>
                  <select
                    value={lop}
                    onChange={(e) => setLop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    <option value="JPD113">JPD113 - Tiếng Nhật Sơ Cấp 1</option>
                    <option value="JPD123">JPD123 - Tiếng Nhật Sơ Cấp 2</option>
                    <option value="JPD133">JPD133 - Tiếng Nhật Trung Cấp 1</option>
                    <option value="SE1801">Lớp SE1801</option>
                    <option value="SE1802">Lớp SE1802</option>
                    <option value="IA1801">Lớp IA1801</option>
                  </select>
                </div>

                {/* Mã số sinh viên */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mã số sinh viên (MSSV)</span>
                  </label>
                  <input
                    type="text"
                    value={mssv}
                    onChange={(e) => setMssv(e.target.value.toUpperCase())}
                    placeholder="Ví dụ: SE181234"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs uppercase placeholder:normal-case placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors font-mono tracking-wide"
                    required
                  />
                </div>

                {/* Submit 3D Button */}
                <button
                  type="submit"
                  className="btn-3d-green w-full py-3 rounded-2xl text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-2"
                >
                  <span>▶ Đăng Nhập Tu Học</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Sub-method 2: Prompt #066 Social Sign-in Component */}
            {loginMethod === 'social' && (
              <div className="w-full flex justify-center">
                <SocialSignIn066
                  title="Sẵn sàng tu học?"
                  subtitle="Sử dụng tài khoản mạng xã hội"
                  onSuccess={handleSocialSuccess}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ĐĂNG KÝ (Sign Up / Nhập Môn) */}
        {authMode === 'register' && (
          <form
            onSubmit={handleStudentRegister}
            className="w-full rounded-3xl bg-[#141d16] border border-emerald-500/30 p-5 shadow-2xl space-y-3"
          >
            <div className="text-center pb-1">
              <h3 className="text-base font-black text-amber-100">
                Đăng Ký Nhập Môn Tu Học
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Điền đầy đủ thông tin để cấp thẻ học viên Manabi Wukong
              </p>
            </div>

            {/* Họ và tên */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Họ và tên sinh viên</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập đầy đủ họ và tên"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors"
                required
              />
            </div>

            {/* Lớp học & MSSV trong 2 cột */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-emerald-400" />
                  <span>Lớp học</span>
                </label>
                <select
                  value={lop}
                  onChange={(e) => setLop(e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="JPD113">JPD113</option>
                  <option value="JPD123">JPD123</option>
                  <option value="JPD133">JPD133</option>
                  <option value="SE1801">SE1801</option>
                  <option value="SE1802">SE1802</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-emerald-400" />
                  <span>MSSV</span>
                </label>
                <input
                  type="text"
                  value={mssv}
                  onChange={(e) => setMssv(e.target.value.toUpperCase())}
                  placeholder="SE18..."
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs uppercase font-mono"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email sinh viên</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sinhvien@fpt.edu.vn"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors"
                required
              />
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mật khẩu bảo mật</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs placeholder:text-stone-500 focus:outline-none focus:border-emerald-400 transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-3d-green w-full py-3 rounded-2xl text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer mt-3"
            >
              <span>⛩️ Đăng Ký &amp; Khởi Tạo Tu Vi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Security / System Footer Note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bảo mật tiến độ học theo Họ Tên, Lớp &amp; MSSV của sinh viên</span>
        </div>
      </div>
    </div>
  );
};

export default StandaloneLoginGate;
