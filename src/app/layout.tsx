import type { Metadata } from 'next';
import './globals.css';
import { AntiInspect } from '@/components/AntiInspect';
import { AppLayout } from '@/components/AppLayout';

export const metadata: Metadata = {
  title: 'Manabi Wukong - Học Tiếng Nhật JPD & Game Vượt Ải Cùng Tôn Ngộ Không',
  description: 'Giao diện chuẩn Pandarin kết hợp Game Đánh Boss Vượt Ải cùng Linh thú Tôn Ngộ Không và toàn bộ giáo trình tiếng Nhật Manabiman.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="light">
      <body className="min-h-screen bg-[#eef6eb] text-[#143521] antialiased selection:bg-emerald-500 selection:text-white">
        {/* Anti-Inspect Security Protection (Blocks F12, DevTools, Right Click, Source Clone) */}
        <AntiInspect />

        {/* Ambient Bamboo Background Decorations */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 sm:opacity-50">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-44 h-80 bg-gradient-to-tr from-emerald-600/20 to-transparent rounded-tr-full blur-xl" />
          <div className="absolute -bottom-12 -right-8 w-44 h-80 bg-gradient-to-tl from-emerald-600/20 to-transparent rounded-tl-full blur-xl" />
        </div>

        {/* Responsive App Layout Shell with Collapsible Left Navbar & Right Points Bar */}
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
