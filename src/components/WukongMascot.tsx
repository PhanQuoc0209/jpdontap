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
  showCloud = true
}) => {
  const currentMood = expression || mood;
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48'
  };

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Speech Bubble */}
      {speechBubble && (
        <div className="relative mb-2 max-w-[220px] rounded-2xl bg-amber-50 border-2 border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-950 shadow-md animate-bounce">
          {speechBubble}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-50 border-b-2 border-r-2 border-amber-300 rotate-45" />
        </div>
      )}

      {/* SVG Mascot Character */}
      <div className={`relative ${sizeMap[size]} transition-transform duration-300 ${currentMood === 'attack' ? 'scale-110 translate-x-2' : ''} ${currentMood === 'happy' ? 'animate-bounce' : ''}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="staffGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="15%" stopColor="#eab308" />
              <stop offset="16%" stopColor="#dc2626" />
              <stop offset="84%" stopColor="#dc2626" />
              <stop offset="85%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
            <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
          </defs>

          {/* Cân Đẩu Vân (Floating Nimbus Cloud) */}
          {showCloud && (
            <g className="animate-pulse">
              <path
                d="M40 170 C20 170 15 150 30 142 C25 130 45 120 60 128 C70 115 100 115 110 128 C125 118 150 125 150 140 C165 145 165 165 150 170 C140 175 60 175 40 170 Z"
                fill="url(#cloudGrad)"
                stroke="#fef08a"
                strokeWidth="2"
                opacity="0.9"
              />
              <path d="M45 155 Q60 148 75 154" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M95 152 Q115 146 135 153" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
          )}

          {/* Monkey Body */}
          {/* Red Scarf & Robe */}
          <path d="M85 120 L115 120 L125 155 L75 155 Z" fill="#b91c1c" />
          {/* Golden Armor Chestplate */}
          <path d="M88 122 L112 122 L116 142 L84 142 Z" fill="url(#goldGrad)" stroke="#854d0e" strokeWidth="1.5" />
          <circle cx="100" cy="132" r="4" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />

          {/* Scarf Ends Flowing */}
          <path d="M78 122 C65 128 55 140 60 150 C62 145 70 135 80 128 Z" fill="#dc2626" />
          <path d="M122 122 C135 128 145 138 140 150 C138 144 130 134 120 128 Z" fill="#dc2626" />

          {/* Arms */}
          {mood === 'attack' ? (
            <>
              {/* Lunging strike arm */}
              <path d="M82 125 L50 110 L45 100" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
              <path d="M118 125 L150 100 L165 90" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
            </>
          ) : mood === 'happy' ? (
            <>
              {/* Arms raised in celebration */}
              <path d="M82 125 L65 95 L55 80" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
              <path d="M118 125 L135 95 L145 80" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
              {/* Mythical Peach in hand */}
              <text x="145" y="75" fontSize="24">🍑</text>
            </>
          ) : (
            <>
              {/* Normal standing */}
              <path d="M82 125 L70 140 L65 148" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
              <path d="M118 125 L130 138 L140 130" stroke="#d97706" strokeWidth="10" strokeLinecap="round" />
            </>
          )}

          {/* Như Ý Kim Cô Bổng (Staff) */}
          {mood === 'attack' ? (
            <line x1="20" y1="130" x2="185" y2="70" stroke="url(#staffGrad)" strokeWidth="8" strokeLinecap="round" />
          ) : (
            <line x1="135" y1="65" x2="145" y2="165" stroke="url(#staffGrad)" strokeWidth="7" strokeLinecap="round" />
          )}

          {/* Ears */}
          <circle cx="58" cy="88" r="16" fill="#d97706" stroke="#92400e" strokeWidth="2" />
          <circle cx="58" cy="88" r="10" fill="#fbcfe8" />
          <circle cx="142" cy="88" r="16" fill="#d97706" stroke="#92400e" strokeWidth="2" />
          <circle cx="142" cy="88" r="10" fill="#fbcfe8" />

          {/* Head & Fur */}
          <circle cx="100" cy="85" r="38" fill="#d97706" stroke="#92400e" strokeWidth="2.5" />
          {/* Peach-heart face patch (Mặt quả đào đặc trưng Tôn Ngộ Không) */}
          <path
            d="M100 68 C80 50 68 70 72 88 C76 102 92 110 100 112 C108 110 124 102 128 88 C132 70 120 50 100 68 Z"
            fill="#fef3c7"
          />

          {/* Golden Headband (Vòng Kim Cô) */}
          <path
            d="M66 70 C75 58 125 58 134 70 C125 65 75 65 66 70 Z"
            fill="url(#goldGrad)"
            stroke="#854d0e"
            strokeWidth="2.5"
          />
          {/* Front Golden Peak / Curvature */}
          <path
            d="M93 64 C97 54 100 52 100 52 C100 52 103 54 107 64 C102 61 98 61 93 64 Z"
            fill="url(#goldGrad)"
            stroke="#854d0e"
            strokeWidth="1.5"
          />
          <circle cx="100" cy="62" r="3" fill="#dc2626" />

          {/* Fiery Golden Eyes (Hỏa Nhãn Kim Tinh) */}
          {currentMood === 'hurt' ? (
            <>
              {/* Spiral or X eyes */}
              <text x="82" y="90" fontSize="16" fontWeight="bold" fill="#78350f">X</text>
              <text x="108" y="90" fontSize="16" fontWeight="bold" fill="#78350f">X</text>
            </>
          ) : currentMood === 'happy' ? (
            <>
              {/* Crescent smiling eyes */}
              <path d="M82 86 Q88 78 94 86" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <path d="M106 86 Q112 78 118 86" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Glowing Eyes */}
              <ellipse cx="88" cy="85" rx="6" ry="7" fill="url(#eyeGlow)" stroke="#78350f" strokeWidth="1.5" />
              <ellipse cx="112" cy="85" rx="6" ry="7" fill="url(#eyeGlow)" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="89" cy="84" r="2.5" fill="#ffffff" />
              <circle cx="113" cy="84" r="2.5" fill="#ffffff" />
            </>
          )}

          {/* Cute Nose */}
          <ellipse cx="100" cy="94" rx="3.5" ry="2.5" fill="#92400e" />

          {/* Mouth */}
          {currentMood === 'happy' ? (
            <path d="M92 98 Q100 110 108 98" fill="#ef4444" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          ) : currentMood === 'hurt' ? (
            <path d="M93 103 Q100 97 107 103" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : currentMood === 'attack' ? (
            <path d="M92 98 Q100 108 108 98 Z" fill="#991b1b" stroke="#78350f" strokeWidth="1.5" />
          ) : (
            <path d="M93 99 Q100 105 107 99" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}

          {/* Rosy Cheeks */}
          <circle cx="77" cy="94" r="4" fill="#f43f5e" opacity="0.4" />
          <circle cx="123" cy="94" r="4" fill="#f43f5e" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
};

export default WukongMascot;
