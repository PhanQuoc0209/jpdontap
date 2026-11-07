'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { dataset, KanaItem, VocabWord, KanjiItem, GrammarItem } from '@/lib/dataset';
import { sound } from '@/lib/sound';
import { WukongMascot } from '@/components/WukongMascot';
import { BookOpen, Bell, Play, Map, ChevronRight, PenTool, Mic, Layers, Dumbbell, Sparkles, Volume2, Search, ArrowLeft, Lock } from 'lucide-react';

export default function HocTapPage() {
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'library'>('main');

  return (
    <div className="space-y-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-black text-[#143521]">Học tập</h1>
            <p className="text-[10px] text-[#718777]">Bản đồ ải và luyện kỹ năng</p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-[#e4ede1] p-1 rounded-full text-xs font-bold">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-3 py-1 rounded-full transition-all ${
              activeTab === 'main' ? 'bg-white text-[#143521] shadow-sm' : 'text-[#718777]'
            }`}
          >
            Luyện Ải
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1 rounded-full transition-all ${
              activeTab === 'library' ? 'bg-white text-[#143521] shadow-sm' : 'text-[#718777]'
            }`}
          >
            Kho Từ Điển
          </button>
        </div>
      </div>

      {activeTab === 'main' ? (
        <>
          {/* Hero Card: VÙNG 1 • BÀI 1 (Matching Image 5) */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8f5ea] via-[#f5efe2] to-[#ecdfc8] border border-[#e4dac3] p-4 sm:p-5 shadow-[0_8px_20px_rgba(20,53,33,0.06)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                VÙNG 1 • BÀI 1
              </span>
              <span className="text-[11px] font-mono text-[#8c6753]">0/0 ải</span>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#2e1d0f]">Bài học 1 (JPD113)</h2>
              <p className="text-xs text-[#15803d] font-bold mt-0.5">
                Mục tiêu kế tiếp: <strong className="text-[#15803d]">Sẵn sàng đánh Boss</strong>
              </p>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#e3d7be] overflow-hidden mt-2">
                <div className="h-full bg-[#22c55e] rounded-full w-[10%]" />
              </div>
            </div>

            {/* Mascot advice box */}
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[#e2d5bd] p-3 flex items-center gap-3">
              <span className="text-2xl shrink-0">🐒</span>
              <p className="text-[11px] text-[#5c4939] leading-relaxed">
                Ngộ Không đã đánh dấu ải phù hợp nhất với tiến độ hiện tại của bạn.
              </p>
            </div>

            {/* 2 Primary Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                href="/kham-pha"
                className="btn-3d-green flex-1 py-2.5 px-4 rounded-full text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> TIẾP TỤC
              </Link>
              <button
                onClick={() => setShowRoadmap(true)}
                className="py-2.5 px-4 rounded-full bg-white border border-[#22c55e] text-[#15803d] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:bg-emerald-50 active:scale-95 transition-all"
              >
                🗺️ LỘ TRÌNH HỌC
              </button>
            </div>
          </div>

          {/* SRS Alert Banner (Matching Image 5) */}
          <div className="rounded-2xl bg-gradient-to-r from-[#fff7ed] to-[#ffedd5] border border-[#fed7aa] p-3 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-lg shrink-0">
                🔔
              </div>
              <div>
                <h4 className="text-xs font-black text-[#143521]">Cần ôn tập 4 mục hôm nay</h4>
                <p className="text-[10px] text-[#718777]">Củng cố trí nhớ ngắt quãng (Spaced Repetition)</p>
              </div>
            </div>
            <Link
              href="/flashcards"
              className="btn-3d-red px-3.5 py-1.5 rounded-full text-white text-[11px] font-black shrink-0"
            >
              Ôn ngay &gt;
            </Link>
          </div>

          {/* Section: Luyện kỹ năng nhanh (2x2 Grid Matching Image 5) */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-[#143521] uppercase tracking-wider">
              | Luyện kỹ năng nhanh
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Viết chữ Hán */}
              <Link
                href="/luyen-viet"
                className="rounded-2xl bg-white border border-[#e2ece0] p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(20,53,33,0.03)] hover:border-[#22c55e] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                  ✍️
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#143521]">Viết chữ Hán</h4>
                  <p className="text-[10px] text-[#718777]">Bộ thủ &amp; nét</p>
                </div>
              </Link>

              {/* 2. Luyện phát âm */}
              <Link
                href="/phat-am"
                className="rounded-2xl bg-white border border-[#e2ece0] p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(20,53,33,0.03)] hover:border-[#22c55e] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg shrink-0">
                  🗣️
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#143521]">Luyện phát âm</h4>
                  <p className="text-[10px] text-[#718777]">Thanh điệu chuẩn</p>
                </div>
              </Link>

              {/* 3. Flashcards */}
              <Link
                href="/flashcards"
                className="rounded-2xl bg-white border border-[#e2ece0] p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(20,53,33,0.03)] hover:border-[#22c55e] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
                  🗂️
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#143521]">Flashcards</h4>
                  <p className="text-[10px] text-[#718777]">Ghi nhớ từ vựng</p>
                </div>
              </Link>

              {/* 4. Luyện tập chung */}
              <Link
                href="/boss-battle"
                className="rounded-2xl bg-white border border-[#e2ece0] p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(20,53,33,0.03)] hover:border-[#22c55e] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg shrink-0">
                  ⚔️
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#143521]">Luyện tập chung</h4>
                  <p className="text-[10px] text-[#718777]">Các dạng bài tập</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Section: Chuyên đề & mở rộng */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-[#143521] uppercase tracking-wider">
              | Chuyên đề &amp; mở rộng
            </h3>

            <div className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(20,53,33,0.03)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center text-xl font-black shadow shrink-0 jp-font">
                  詞
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#143521]">Bản đồ thế giới &amp; JLPT</h4>
                  <p className="text-[10px] text-[#718777]">Khám phá thế giới, các vùng đất và bài học JLPT</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
            </div>
          </div>
        </>
      ) : (
        /* Tab: Kho Từ Điển & Toàn bộ Giáo trình */
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-[#e2ece0] p-3 space-y-2">
            <span className="text-xs font-black text-[#143521]">
              35 Bài Học Giáo Trình Chuẩn JPD ({dataset.words.length} Từ Vựng &bull; {dataset.kanji.length} Hán Tự)
            </span>
            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {dataset.units.map((u) => (
                <div
                  key={u.id}
                  className="p-3 rounded-xl bg-[#f8faf7] border border-[#e2ece0] flex items-center justify-between gap-2 hover:bg-emerald-50 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                      {u.course.toUpperCase()} • {u.tag}
                    </span>
                    <h4 className="text-xs font-bold text-[#143521] mt-1">{u.title}</h4>
                    <p className="text-[10px] text-[#718777]">{u.desc}</p>
                  </div>
                  <Link
                    href={`/flashcards?filter=${u.course}`}
                    className="btn-3d-green px-3 py-1 rounded-full text-white text-[10px] font-black uppercase shrink-0"
                  >
                    Ôn từ
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lộ Trình Học Tập Modal / Drawer (Matching Image 3) */}
      {showRoadmap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#f3f9f1] w-full max-w-[430px] max-h-[85vh] rounded-t-3xl sm:rounded-3xl border border-[#dce8d8] p-5 overflow-y-auto shadow-2xl space-y-4 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e2ece0] pb-3">
              <button
                onClick={() => setShowRoadmap(false)}
                className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-base font-black text-[#143521]">Lộ trình học tập</h3>
              <div className="w-8" />
            </div>

            {/* Banner (Matching Image 3) */}
            <div className="rounded-2xl bg-gradient-to-br from-[#f8f5ea] to-[#ece3cf] border border-[#e2d5bd] p-4 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-wider">
                    BẢN ĐỒ CURRICULUM
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#718777] text-[10px] font-bold border border-[#e2d5bd]">
                    Dữ liệu thật
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#2e1d0f]">Chọn vùng đất tiếp theo</h4>
                <p className="text-[10px] text-[#6d5b4b]">
                  Mỗi phần là một vùng phiêu lưu. Hoàn thành Unit và Boss để mở đường sang vùng kế tiếp.
                </p>
                <span className="text-[10px] font-black text-[#15803d]">0/8 phần</span>
              </div>
              <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                <WukongMascot mood="attack" size="sm" />
              </div>
            </div>

            {/* Vertical Road Stepper (Matching Image 3) */}
            <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#cbd5e1]">
              {/* Stage 1 (Active) */}
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border-3 border-[#22c55e] text-[#15803d] font-black text-sm flex items-center justify-center shadow-md z-10 shrink-0">
                  1
                </div>
                <div className="flex-1 rounded-2xl bg-white border-2 border-[#22c55e] p-3.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#718777]">PHẦN 1</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#22c55e] text-white text-[10px] font-black">
                      Đang học ▶
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#143521] mt-0.5">Chặng 1 (JPD113 - Khởi hành)</h4>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#718777]">
                    <div className="w-32 h-1.5 rounded-full bg-[#eef4ec] overflow-hidden">
                      <div className="h-full bg-[#22c55e] w-[10%]" />
                    </div>
                    <span>0/10 bài</span>
                  </div>
                </div>
              </div>

              {/* Stage 2 (Locked) */}
              <div className="relative flex items-start gap-4 opacity-75">
                <div className="w-10 h-10 rounded-full bg-stone-200 border-2 border-stone-300 text-stone-500 font-black text-xs flex items-center justify-center z-10 shrink-0">
                  2 <Lock className="w-2.5 h-2.5 ml-0.5" />
                </div>
                <div className="flex-1 rounded-2xl bg-white border border-[#e2ece0] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#718777]">PHẦN 2</span>
                    <span className="text-[10px] font-mono text-[#718777]">0/30 bài</span>
                  </div>
                  <h4 className="text-sm font-black text-[#143521] mt-0.5">Chặng 2 (Hoàng Phong Lĩnh - JPD123)</h4>
                  <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                    🔒 Thắng Boss cuối Phần 1 để mở
                  </p>
                </div>
              </div>

              {/* Stage 3 (Locked) */}
              <div className="relative flex items-start gap-4 opacity-75">
                <div className="w-10 h-10 rounded-full bg-stone-200 border-2 border-stone-300 text-stone-500 font-black text-xs flex items-center justify-center z-10 shrink-0">
                  3 <Lock className="w-2.5 h-2.5 ml-0.5" />
                </div>
                <div className="flex-1 rounded-2xl bg-white border border-[#e2ece0] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#718777]">PHẦN 3</span>
                    <span className="text-[10px] font-mono text-[#718777]">0/30 bài</span>
                  </div>
                  <h4 className="text-sm font-black text-[#143521] mt-0.5">Chặng 3 (Bạch Cốt Động - JPD133)</h4>
                  <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                    🔒 Thắng Boss cuối Phần 2 để mở
                  </p>
                </div>
              </div>

              {/* Stage 4 (Locked) */}
              <div className="relative flex items-start gap-4 opacity-75">
                <div className="w-10 h-10 rounded-full bg-stone-200 border-2 border-stone-300 text-stone-500 font-black text-xs flex items-center justify-center z-10 shrink-0">
                  4 <Lock className="w-2.5 h-2.5 ml-0.5" />
                </div>
                <div className="flex-1 rounded-2xl bg-white border border-[#e2ece0] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#718777]">PHẦN 4</span>
                    <span className="text-[10px] font-mono text-[#718777]">0/60 bài</span>
                  </div>
                  <h4 className="text-sm font-black text-[#143521] mt-0.5">Chặng 4 (Hỏa Diệm Sơn - JLPT N2)</h4>
                  <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                    🔒 Thắng Boss cuối Phần 3 để mở
                  </p>
                </div>
              </div>

              {/* Stage 5 (Locked) */}
              <div className="relative flex items-start gap-4 opacity-75">
                <div className="w-10 h-10 rounded-full bg-stone-200 border-2 border-stone-300 text-stone-500 font-black text-xs flex items-center justify-center z-10 shrink-0">
                  5 <Lock className="w-2.5 h-2.5 ml-0.5" />
                </div>
                <div className="flex-1 rounded-2xl bg-white border border-[#e2ece0] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#718777]">PHẦN 5</span>
                    <span className="text-[10px] font-mono text-[#718777]">0/51 bài</span>
                  </div>
                  <h4 className="text-sm font-black text-[#143521] mt-0.5">Chặng 5 (Linh Sơn Cực Lạc - JLPT N1)</h4>
                  <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                    🔒 Thắng Boss cuối Phần 4 để mở
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowRoadmap(false)}
              className="w-full py-2.5 rounded-full bg-[#143521] text-white text-xs font-black uppercase tracking-wider"
            >
              Đóng lộ trình
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
