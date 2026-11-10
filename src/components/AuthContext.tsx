'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '@/lib/sound';

export interface AuthUser {
  provider: string;
  account: string;
  name: string;
  mssv?: string;
  lop?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider: string, account: string, name?: string, extra?: { mssv?: string; lop?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AUTH_STORAGE_KEY = 'manabi_wukong_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.account) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse auth user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (
    provider: string,
    account: string,
    name?: string,
    extra?: { mssv?: string; lop?: string }
  ) => {
    const newUser: AuthUser = {
      provider,
      account,
      name: name || (provider === 'Google' ? 'Tề Thiên Học Giả' : provider === 'Apple' ? 'Mỹ Hầu Vương' : 'Học Viên Tôn Ngộ Không'),
      mssv: extra?.mssv || (provider === 'MSSV' ? account : 'SE18001'),
      lop: extra?.lop || 'JPD113',
    };
    setUser(newUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (e) {
      console.error('Failed to save auth user', e);
    }
  };

  const logout = () => {
    sound.playTap();
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth user', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
