import type { Metadata } from 'next';
import './globals.css';
import { TopHeader } from '@/components/TopHeader';
import { Navbar } from '@/components/Navbar';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { DesktopRightPanel } from '@/components/DesktopRightPanel';
import { AntiInspect } from '@/components/AntiInspect';

export const metadata: Metadata = {
  title: 'Manabi Wukong - Học Tiếng Nhật JPD & Game Vượt Ải Cùng Tôn Ngộ Không',
  description: 'Giao diện chuẩn Pandarin kết hợp Game Đánh Boss Vượt ải cùng Linh thú Tôn Ngộ Không và toàn bộ giáo trình tiếng Nhật Manabiman.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="light">
      <body className="min-h-screen bg-[#eef6eb] text-[#143521] antialiased selection:bg-emerald-500 selection:text-white flex justify-center">
        {/* Anti-Inspect Security Protection (Blocks F12, DevTools, Right Click, Source Clone) */}
        <AntiInspect />

        {/* Ambient Bamboo Background Decorations */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 sm:opacity-50">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-44 h-80 bg-gradient-to-tr from-emerald-600/20 to-transparent rounded-tr-full blur-xl" />
          <div className="absolute -bottom-12 -right-8 w-44 h-80 bg-gradient-to-tl from-emerald-600/20 to-transparent rounded-tl-full blur-xl" />
        </div>

        {/* Desktop Wrapper Layout (Sidebar Left + Center Stage + Dashboard Right) */}
        <div className="relative z-10 w-full flex justify-center min-h-screen">
          {/* Left Desktop Sidebar (Visible on >= 1024px) */}
          <DesktopSidebar />

          {/* Main App Canvas (Responsive: 440px on mobile, expands to 680px on desktop) */}
          <div className="w-full max-w-[440px] lg:max-w-[620px] xl:max-w-[680px] min-h-screen bg-[#f3f9f1] border-x border-[#dce8d8] shadow-2xl flex flex-col transition-all">
            <TopHeader />
            <main className="flex-1 pb-24 lg:pb-12 px-4 pt-2">
              {children}
            </main>
            {/* Bottom Navbar (Visible only on mobile/tablet < 1024px) */}
            <div className="lg:hidden">
              <Navbar />
            </div>
          </div>

          {/* Right Desktop Dashboard (Visible on >= 1280px) */}
          <DesktopRightPanel />
        </div>
      </body>
    </html>
  );
}
