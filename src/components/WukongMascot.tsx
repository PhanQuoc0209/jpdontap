'use client';

import React from 'react';

export type WukongMood = 'idle' | 'attack' | 'happy' | 'hurt' | 'thinking';

interface WukongMascotProps {
  mood?: WukongMood;
  expression?: WukongMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  className?: string;
  showCloud?: boolean;
}

export const WukongMascot: React.FC<WukongMascotProps> = ({
  mood = 'idle',
  expression,
  size = 'md',
  speechBubble,
  className = '',
}) => {
  const currentMood = expression || mood;
  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    xl: 'w-48 h-48 sm:w-56 sm:h-56'
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {speechBubble && (
        <div className="relative mb-2 max-w-[220px] rounded-2xl bg-amber-50 border-2 border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-950 shadow-md animate-bounce z-20 whitespace-nowrap">
          {speechBubble}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-50 border-b-2 border-r-2 border-amber-300 rotate-45" />
        </div>
      )}

      {/* 3D Wukong Character Avatar */}
      <div
        className={`relative ${sizeMap[size]} transition-all duration-300 ease-out flex items-center justify-center ${
          currentMood === 'attack'
            ? 'scale-115 -rotate-6'
            : currentMood === 'hurt'
            ? 'scale-90 animate-shake'
            : currentMood === 'happy'
            ? 'animate-bounce'
            : 'animate-float'
        }`}
      >
        {/* Glowing Aura for Attack Mode */}
        {currentMood === 'attack' && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/40 via-yellow-300/50 to-orange-500/40 blur-xl animate-pulse pointer-events-none" />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/wukong_action.png"
          alt="Tôn Ngộ Không"
          className={`w-full h-full object-contain filter drop-shadow-[0_8px_18px_rgba(245,158,11,0.35)] transition-all duration-300 ${
            currentMood === 'attack'
              ? 'brightness-120 drop-shadow-[0_0_28px_rgba(245,158,11,0.9)]'
              : currentMood === 'hurt'
              ? 'brightness-75 hue-rotate-330 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]'
              : ''
          }`}
        />

        {/* Dynamic Staff Slash Aura when Attacking */}
        {currentMood === 'attack' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Spinning Slash Trail */}
            <div className="absolute -top-3 -right-3 w-[110%] h-[110%] border-4 border-t-yellow-300 border-r-amber-400 border-b-transparent border-l-transparent rounded-full animate-spin filter drop-shadow-[0_0_15px_#f59e0b]" />
            <span className="absolute -top-4 -right-2 text-2xl animate-ping select-none">💥</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WukongMascot;
