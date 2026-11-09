'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LayoutContextType {
  // Sidebar state (Collapsible left navbar)
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;

  // Right panel state (Points, stats, quests, rankings docked on the right)
  isRightPanelVisible: boolean;
  setIsRightPanelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  toggleRightPanel: () => void;

  // Mobile drawer states
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobilePointsOpen: boolean;
  setIsMobilePointsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeAllMobileDrawers: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isMobilePointsOpen, setIsMobilePointsOpen] = useState<boolean>(false);

  // Load user layout preferences from localStorage
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem('mw_sidebar_collapsed');
      if (savedCollapsed !== null) {
        setIsSidebarCollapsed(savedCollapsed === 'true');
      }
      const savedRight = localStorage.getItem('mw_right_panel_visible');
      if (savedRight !== null) {
        setIsRightPanelVisible(savedRight === 'true');
      }
    } catch {
      // Handle environments without localStorage access
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('mw_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const toggleRightPanel = () => {
    setIsRightPanelVisible(prev => {
      const next = !prev;
      try {
        localStorage.setItem('mw_right_panel_visible', String(next));
      } catch {}
      return next;
    });
  };

  const closeAllMobileDrawers = () => {
    setIsMobileSidebarOpen(false);
    setIsMobilePointsOpen(false);
  };

  return (
    <LayoutContext.Provider
      value={{
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        isRightPanelVisible,
        setIsRightPanelVisible,
        toggleRightPanel,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isMobilePointsOpen,
        setIsMobilePointsOpen,
        closeAllMobileDrawers,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
