'use client';

import React, { useEffect } from 'react';
import { LayoutProvider, useLayout } from '@/components/LayoutContext';
import { AuthProvider, useAuth } from '@/components/AuthContext';
import { StandaloneLoginGate } from '@/components/StandaloneLoginGate';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { DesktopRightPanel } from '@/components/DesktopRightPanel';
import { TopHeader } from '@/components/TopHeader';
import { Navbar } from '@/components/Navbar';
import { PanelRightOpen } from 'lucide-react';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const {
    isSidebarCollapsed,
    isRightPanelVisible,
    toggleRightPanel,
    isMobileSidebarOpen,
    isMobilePointsOpen,
    closeAllMobileDrawers,
  } = useLayout();

  // Close mobile drawers on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllMobileDrawers();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAllMobileDrawers]);

  // 1. Loading screen while checking authentication state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0c140e] flex flex-col items-center justify-center p-4 select-none">
        <div className="w-12 h-12 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="text-xs font-black text-amber-200 mt-3 tracking-wider uppercase">
          Đang khởi tạo cổng tu học…
        </span>
      </div>
    );
  }

  // 2. Strict Authentication Gate: If not logged in, user CANNOT enter the website
  if (!isAuthenticated) {
    return <StandaloneLoginGate />;
  }

  return (
    <div className="relative z-10 w-full min-h-screen flex justify-between">
      {/* 1. Left Collapsible Navbar (Pinned to left corner) */}
      <DesktopSidebar />

      {/* 2. Main Center Content Canvas (Responsive, expanding when sidebar collapses) */}
      <div className="flex-1 min-w-0 flex flex-col items-center min-h-screen transition-all duration-300">
        <div
          className={`
            w-full min-h-screen bg-[#f3f9f1] border-x border-[#dce8d8] shadow-sm flex flex-col
            transition-all duration-300 mx-auto
            ${isSidebarCollapsed && !isRightPanelVisible ? 'max-w-[1000px]' : 'max-w-[480px] md:max-w-[720px] lg:max-w-[820px] xl:max-w-[880px]'}
          `}
        >
          {/* Top Header */}
          <TopHeader streak={7} />

          {/* Main Page Content */}
          <main className="flex-1 pb-24 lg:pb-12 px-3 sm:px-5 pt-3">
            {children}
          </main>

          {/* Mobile Bottom Navigation Bar (Visible only on < 1024px) */}
          <div className="lg:hidden">
            <Navbar />
          </div>
        </div>
      </div>

      {/* 3. Right Points & Stats Panel (Pinned to right corner) */}
      <DesktopRightPanel />

      {/* Floating Re-open Button for Right Points Panel when hidden on desktop */}
      {!isRightPanelVisible && (
        <div className="group hidden lg:block fixed right-4 bottom-6 z-40">
          <button
            onClick={toggleRightPanel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#fed7aa] shadow-lg hover:shadow-xl hover:bg-amber-50 active:scale-95 transition-all text-xs font-black text-amber-800 cursor-pointer animate-bounce group-hover:animate-none"
            aria-label="Mở Bảng Điểm & Tu Vi"
          >
            <span className="text-base">⚡</span>
            <span>Bảng Điểm &amp; Tu Vi</span>
            <PanelRightOpen className="w-4 h-4 text-amber-600" />
          </button>
          {/* Tooltip */}
          <div className="pointer-events-none absolute right-0 bottom-full mb-2 z-[110] whitespace-nowrap rounded-xl bg-[#0e2917] border border-emerald-500/40 px-3 py-1.5 text-xs text-white opacity-0 shadow-2xl -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150">
            <span className="absolute right-6 -bottom-1 w-2 h-2 bg-[#0e2917] border-r border-b border-emerald-500/40 rotate-45" />
            <div className="font-black text-amber-300">Bảng Điểm &amp; Tu Vi Bên Phải</div>
            <div className="text-[10px] text-emerald-200/80">Xem nhiệm vụ nhận điểm, chỉ số tu vi &amp; bảng vàng xếp hạng</div>
          </div>
        </div>
      )}

      {/* 4. Mobile Left Navigation Drawer (< 1024px) */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={closeAllMobileDrawers}
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] h-full bg-[#f7faf5] shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            <DesktopSidebar isMobileDrawer={true} />
          </div>
        </div>
      )}

      {/* 5. Mobile Right Points & Stats Drawer (< 1024px) */}
      {isMobilePointsOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={closeAllMobileDrawers}
          />
          {/* Drawer content */}
          <div className="relative w-80 max-w-[85vw] h-full bg-[#f7faf5] shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-200">
            <DesktopRightPanel isMobileDrawer={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <LayoutProvider>
        <AppShell>{children}</AppShell>
      </LayoutProvider>
    </AuthProvider>
  );
};
