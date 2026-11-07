'use client';

import React, { useEffect, useState } from 'react';

export const AntiInspect: React.FC = () => {
  const [warningToast, setWarningToast] = useState<string | null>(null);

  const showSecurityWarning = (msg: string) => {
    setWarningToast(msg);
    setTimeout(() => {
      setWarningToast(null);
    }, 3000);
  };

  useEffect(() => {
    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showSecurityWarning('🛡️ Tôn Ngộ Không bảo hộ: Không phận sự miễn vào! Mã nguồn đã được niệm chú bảo mật.');
      return false;
    };

    // 2. Block Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityWarning('🚫 Phím F12 đã bị phong ấn bởi Gậy Như Ý! Không thể mở công cụ phát triển.');
        return false;
      }

      // Ctrl + Shift + I (DevTools)
      // Ctrl + Shift + J (Console)
      // Ctrl + Shift + C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityWarning('🚫 Tổ hợp phím mở DevTools đã bị vô hiệu hóa.');
        return false;
      }

      // Cmd + Option + I (Mac DevTools)
      if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityWarning('🚫 DevTools đã bị vô hiệu hóa.');
        return false;
      }

      // Ctrl + U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityWarning('🚫 Xem mã nguồn trang đã bị chặn.');
        return false;
      }

      // Ctrl + S (Save Page)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityWarning('🚫 Không thể lưu trang về máy.');
        return false;
      }
    };

    // 3. Clear Console and print Wukong Banner
    console.clear();
    console.log(
      '%c🐒 TÔN NGỘ KHÔNG ĐẠI THÁNH ⛩️\n%cHệ thống học tiếng Nhật JPD Manabi Wukong đã được bảo vệ bản quyền nghiêm ngặt. Nghiêm cấm sao chép, trích xuất mã nguồn trái phép!',
      'color: #ea580c; font-size: 20px; font-weight: bold; text-shadow: 2px 2px #000;',
      'color: #15803d; font-size: 14px; font-weight: bold;'
    );

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!warningToast) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none animate-bounce">
      <div className="bg-stone-900/95 border-2 border-red-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-md">
        <span className="text-2xl shrink-0">🐒</span>
        <div className="text-xs font-bold leading-relaxed text-amber-200">
          {warningToast}
        </div>
      </div>
    </div>
  );
};
