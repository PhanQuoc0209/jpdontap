// Lucian UX/UI Prompt #066 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#066
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sound } from '@/lib/sound';

export interface SocialSignIn066Props {
  title?: string;
  subtitle?: string;
  onSuccess?: (provider: string, account: string) => void;
  className?: string;
}

interface ProviderItem {
  id: string;
  name: string;
  label: string;
  account: string;
  userDisplayName: string;
  badge?: string;
  styleVars: {
    bg: string;
    fg: string;
    bd?: string;
  };
  iconSvg: React.ReactNode;
}

const PROVIDERS: ProviderItem[] = [
  {
    id: 'kakao',
    name: 'Kakao',
    label: 'Tiếp tục với Kakao',
    account: 'wukong.tuhoctiengnhat@kakao.com',
    userDisplayName: 'Học Viên Tôn Ngộ Không',
    styleVars: {
      bg: '#FEE500',
      fg: '#191600',
    },
    iconSvg: (
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path
          d="M12 4C7 4 3 7.1 3 11c0 2.5 1.7 4.7 4.2 6l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.3 0 .7.1 1 .1 5 0 9-3.1 9-7S17 4 12 4z"
          fill="#191600"
        />
      </svg>
    ),
  },
  {
    id: 'google',
    name: 'Google',
    label: 'Tiếp tục với Google',
    account: 'hocvien.jpd@gmail.com',
    userDisplayName: 'Tề Thiên Học Giả',
    badge: 'Dùng gần đây',
    styleVars: {
      bg: 'var(--ux-surface)',
      fg: 'var(--ux-ink)',
      bd: 'inset 0 0 0 1.5px var(--ux-line-2)',
    },
    iconSvg: (
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path
          d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"
          fill="#4285F4"
        />
        <path
          d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"
          fill="#34A853"
        />
        <path
          d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.6z"
          fill="#FBBC05"
        />
        <path
          d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  {
    id: 'apple',
    name: 'Apple',
    label: 'Tiếp tục với Apple',
    account: 'wukong.jpd@icloud.com',
    userDisplayName: 'Mỹ Hầu Vương',
    styleVars: {
      bg: 'var(--ux-ink)',
      fg: 'var(--ux-page)',
    },
    iconSvg: (
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path
          d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5a4.3 4.3 0 0 0-3.4-1.8c-1.4-.1-2.8.9-3.5.9s-1.9-.9-3.1-.8a4.6 4.6 0 0 0-3.9 2.4c-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 2.9 2.4s1.6-.8 3-.8 1.8.8 3 .7 2-1.1 2.8-2.3a9.6 9.6 0 0 0 1.3-2.6c-.1 0-2.3-.9-2.3-4.1zM14.1 5.8a3.9 3.9 0 0 0 .9-2.8 4 4 0 0 0-2.6 1.4 3.7 3.7 0 0 0-.9 2.7 3.3 3.3 0 0 0 2.6-1.3z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export const SocialSignIn066: React.FC<SocialSignIn066Props> = ({
  title = 'Sẵn sàng tu học?',
  subtitle = 'Đăng nhập tài khoản Manabi Wukong',
  onSuccess,
  className = '',
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'busy' | 'ok'>('idle');
  const [msg, setMsg] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const firstButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleProviderClick = (index: number) => {
    if (status === 'busy' || status === 'ok') return;

    sound.playTap();
    setSelectedIdx(index);
    setStatus('busy');

    const provider = PROVIDERS[index];
    setMsg(`Đang kết nối ${provider.name}…`);

    const rm =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = rm ? 300 : 1500;

    timerRef.current = setTimeout(() => {
      setStatus('ok');
      setMsg(`Tài khoản ${provider.name} đã kết nối`);
      sound.playVictory();
      if (onSuccess) {
        onSuccess(provider.name, provider.account);
      }
    }, delay);
  };

  const handleBackClick = () => {
    sound.playTap();
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelectedIdx(null);
    setStatus('idle');
    setMsg('');

    // Restore focus to first button
    setTimeout(() => {
      firstButtonRef.current?.focus({ preventScroll: true });
    }, 50);
  };

  const handleEmailClick = () => {
    sound.playTap();
    setMsg('Đang mở màn hình đăng nhập Email…');
  };

  const isPick = selectedIdx !== null;
  const isDone = status === 'ok';

  return (
    <div className={`u066-wrapper ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .u066-wrapper {
          color-scheme: light;
          --ux-page: #eef6eb;
          --ux-surface: #FFFFFF;
          --ux-surface-2: #F4F9F2;
          --ux-surface-3: #E1EDE0;
          --ux-ink: #143521;
          --ux-ink-2: #41604a;
          --ux-ink-3: #718777;
          --ux-line: rgba(20,53,33,.09);
          --ux-line-2: rgba(20,53,33,.17);
          --ux-accent: #15803d;
          --ux-accent-2: #22c55e;
          --ux-accent-soft: rgba(34,197,94,.12);
          --ux-accent-ink: #FFFFFF;
          --ux-mint: #15803d;
          --ux-warn: #d97706;
          --ux-danger: #ef4444;
          --ux-glass: rgba(255,255,255,.58);
          --ux-glass-line: rgba(255,255,255,.85);
          --ux-shadow: rgba(20,53,33,.14);
          --ux-shadow-strong: rgba(20,53,33,.3);
          --ux-grad: linear-gradient(120deg,#22c55e,#15803d 55%,#f59e0b);
          --ux-ease: cubic-bezier(.2,.8,.2,1);
          --ux-spring: cubic-bezier(.34,1.45,.64,1);
        }

        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .u066-wrapper,
          .dark .u066-wrapper {
            color-scheme: dark;
            --ux-page: #0c140e;
            --ux-surface: #141d16;
            --ux-surface-2: #1c261e;
            --ux-surface-3: #263429;
            --ux-ink: #eef6eb;
            --ux-ink-2: rgba(238,246,235,.72);
            --ux-ink-3: rgba(238,246,235,.45);
            --ux-line: rgba(255,255,255,.08);
            --ux-line-2: rgba(255,255,255,.16);
            --ux-accent: #4ade80;
            --ux-accent-2: #fbbf24;
            --ux-accent-soft: rgba(74,222,128,.15);
            --ux-accent-ink: #0c140e;
            --ux-mint: #4ade80;
            --ux-warn: #fbbf24;
            --ux-danger: #f87171;
            --ux-glass: rgba(255,255,255,.07);
            --ux-glass-line: rgba(255,255,255,.18);
            --ux-shadow: rgba(0,0,0,.45);
            --ux-shadow-strong: rgba(0,0,0,.72);
            --ux-grad: linear-gradient(120deg,#4ade80,#fbbf24 55%,#34d399);
          }
        }

        :root[data-theme="dark"] .u066-wrapper {
          color-scheme: dark;
          --ux-page: #0c140e;
          --ux-surface: #141d16;
          --ux-surface-2: #1c261e;
          --ux-surface-3: #263429;
          --ux-ink: #eef6eb;
          --ux-ink-2: rgba(238,246,235,.72);
          --ux-ink-3: rgba(238,246,235,.45);
          --ux-line: rgba(255,255,255,.08);
          --ux-line-2: rgba(255,255,255,.16);
          --ux-accent: #4ade80;
          --ux-accent-2: #fbbf24;
          --ux-accent-soft: rgba(74,222,128,.15);
          --ux-accent-ink: #0c140e;
          --ux-mint: #4ade80;
          --ux-warn: #fbbf24;
          --ux-danger: #f87171;
          --ux-glass: rgba(255,255,255,.07);
          --ux-glass-line: rgba(255,255,255,.18);
          --ux-shadow: rgba(0,0,0,.45);
          --ux-shadow-strong: rgba(0,0,0,.72);
          --ux-grad: linear-gradient(120deg,#4ade80,#fbbf24 55%,#34d399);
        }

        .u066-wrapper .ux,
        .u066-wrapper .ux *,
        .u066-wrapper .ux *::before,
        .u066-wrapper .ux *::after {
          box-sizing: border-box;
        }

        .u066-wrapper .ux {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: var(--ux-ink);
          -webkit-font-smoothing: antialiased;
          letter-spacing: -.01em;
          -webkit-tap-highlight-color: transparent;
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        :where(.u066-wrapper .ux) :is(button,input,textarea,select) {
          font: inherit;
          color: inherit;
        }

        :where(.u066-wrapper .ux) button {
          cursor: pointer;
        }

        .u066-wrapper .ux :focus-visible {
          outline: 2px solid var(--ux-accent);
          outline-offset: 3px;
        }

        .u066-wrapper .ux [hidden] {
          display: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .u066-wrapper .ux,
          .u066-wrapper .ux *,
          .u066-wrapper .ux *::before,
          .u066-wrapper .ux *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
            scroll-behavior: auto !important;
          }
        }

        .u066 {
          position: relative;
          width: 340px;
          max-width: 100%;
          height: 420px;
          display: flex;
          flex-direction: column;
          padding: 28px 24px 24px;
          border-radius: 30px;
          background: var(--ux-surface);
          box-shadow: 0 0 0 1px var(--ux-line), 0 30px 60px -36px var(--ux-shadow-strong);
          overflow: hidden;
          margin: 0 auto;
        }

        .u066 h3 {
          margin: 0;
          font-size: 23px;
          font-weight: 850;
          letter-spacing: -.045em;
          color: var(--ux-ink);
        }

        .u066 > p {
          margin: 6px 0 20px;
          font-size: 13.5px;
          color: var(--ux-ink-3);
        }

        .u066-list {
          display: flex;
          flex-direction: column;
        }

        .u066-it {
          display: grid;
          grid-template-rows: 1fr;
          opacity: 1;
          transition: grid-template-rows .45s var(--ux-ease), opacity .3s, margin .45s var(--ux-ease);
          margin-bottom: 10px;
        }

        .u066-it > div {
          min-height: 0;
          overflow: hidden;
          padding: 2px;
        }

        .u066-it.gone {
          grid-template-rows: 0fr;
          opacity: 0;
          margin-bottom: 0;
          transition-delay: calc(var(--i) * 40ms);
        }

        .u066-b {
          position: relative;
          width: 100%;
          height: 54px;
          border: 0;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          background: var(--bg);
          color: var(--fg);
          font-size: 15px;
          font-weight: 720;
          text-align: left;
          box-shadow: var(--bd, none);
          transition: transform .3s var(--ux-spring), height .45s var(--ux-ease), border-radius .45s;
        }

        .u066-b:hover {
          transform: translateY(-1px);
        }

        .u066-b:active {
          transform: scale(.98);
        }

        .u066-b:focus-visible {
          outline: 2px solid var(--ux-accent);
          outline-offset: 2px;
        }

        .u066-ic {
          width: 24px;
          height: 24px;
          flex: none;
          display: grid;
          place-items: center;
        }

        .u066-ic svg {
          width: 22px;
          height: 22px;
        }

        .u066-tx {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .u066-tx small {
          display: block;
          font-size: 12px;
          font-weight: 600;
          opacity: .7;
        }

        .u066-recent {
          height: 22px;
          padding: 0 8px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          background: var(--ux-accent-soft);
          color: var(--ux-accent);
          font-size: 11px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .u066-st {
          width: 0;
          height: 22px;
          flex: none;
          position: relative;
          margin-left: -12px;
          transition: width .3s, margin .3s;
        }

        .u066-b.busy .u066-st,
        .u066-b.ok .u066-st {
          width: 22px;
          margin-left: 0;
        }

        .u066-b.busy .u066-recent,
        .u066-b.ok .u066-recent {
          display: none;
        }

        .u066-st i {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2.5px solid currentColor;
          border-right-color: transparent;
          opacity: 0;
          animation: u066-spin .7s linear infinite;
        }

        .u066-st svg {
          position: absolute;
          inset: 0;
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .u066-st path {
          stroke-dasharray: 22;
          stroke-dashoffset: 22;
          transition: stroke-dashoffset .4s var(--ux-ease);
        }

        .u066-b.busy .u066-st i {
          opacity: 1;
        }

        .u066-b.ok .u066-st path {
          stroke-dashoffset: 0;
        }

        .u066-b.ok {
          height: 72px;
          border-radius: 20px;
        }

        @keyframes u066-spin {
          to { transform: rotate(360deg); }
        }

        .u066-or {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 8px 0 14px;
          font-size: 12px;
          font-weight: 700;
          color: var(--ux-ink-3);
          transition: opacity .3s;
        }

        .u066-or::before,
        .u066-or::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--ux-line-2);
        }

        .u066-mail {
          height: 50px;
          border: 0;
          border-radius: 15px;
          background: var(--ux-surface-2);
          color: var(--ux-ink);
          font-size: 14.5px;
          font-weight: 700;
          transition: opacity .3s, transform .3s var(--ux-spring);
        }

        .u066-mail:focus-visible,
        .u066-back:focus-visible {
          outline: 2px solid var(--ux-accent);
          outline-offset: 2px;
        }

        .u066.is-pick .u066-or,
        .u066.is-pick .u066-mail {
          opacity: 0;
          pointer-events: none;
        }

        .u066-back {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 24px;
          height: 46px;
          border: 0;
          border-radius: 15px;
          background: none;
          box-shadow: inset 0 0 0 1.5px var(--ux-line-2);
          color: var(--ux-ink-2);
          font-size: 14px;
          font-weight: 700;
          opacity: 0;
          transform: translateY(12px);
          pointer-events: none;
          transition: opacity .3s, transform .4s var(--ux-spring);
        }

        .u066.is-done .u066-back {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }

        .u066-msg:empty {
          min-height: 0;
          margin: 0;
        }

        .u066-msg {
          margin: 0 0 4px;
          font-size: 13px;
          font-weight: 650;
          color: var(--ux-ink-3);
          text-align: center;
          min-height: 20px;
          transition: transform .45s var(--ux-ease);
        }
      ` }} />

      <div className={`ux u066 ${isPick ? 'is-pick' : ''} ${isDone ? 'is-done' : ''}`}>
        <h3>{title}</h3>
        <p>{subtitle}</p>

        <div className="u066-list">
          {PROVIDERS.map((provider, i) => {
            const isThisPicked = selectedIdx === i;
            const isGone = isPick && !isThisPicked;
            const isBusy = isThisPicked && status === 'busy';
            const isOk = isThisPicked && status === 'ok';

            const buttonStyle: Record<string, string> = {
              '--bg': provider.styleVars.bg,
              '--fg': provider.styleVars.fg,
            };
            if (provider.styleVars.bd) {
              buttonStyle['--bd'] = provider.styleVars.bd;
            }

            const itemStyle: Record<string, string | number> = {
              '--i': i,
            };

            return (
              <div
                key={provider.id}
                className={`u066-it ${isGone ? 'gone' : ''}`}
                style={itemStyle as React.CSSProperties}
              >
                <div>
                  <button
                    ref={i === 0 ? firstButtonRef : undefined}
                    className={`u066-b ${isBusy ? 'busy' : ''} ${isOk ? 'ok' : ''}`}
                    type="button"
                    style={buttonStyle as React.CSSProperties}
                    tabIndex={isGone ? -1 : 0}
                    aria-busy={isBusy ? 'true' : undefined}
                    onClick={() => handleProviderClick(i)}
                  >
                    <span className="u066-ic" aria-hidden="true">
                      {provider.iconSvg}
                    </span>

                    <span className="u066-tx">
                      {isOk ? (
                        <>
                          Tiếp tục với vai trò {provider.userDisplayName}
                          <small>{provider.account}</small>
                        </>
                      ) : (
                        <>
                          {provider.label}
                          {provider.badge && (
                            <small>{provider.badge}</small>
                          )}
                        </>
                      )}
                    </span>

                    <span className="u066-st" aria-hidden="true">
                      <i />
                      <svg viewBox="0 0 22 22">
                        <path d="M5 11.5l4 4L17 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="u066-msg" aria-live="polite">
          {msg}
        </p>

        <div className="u066-or">hoặc</div>

        <button
          className="u066-mail"
          type="button"
          tabIndex={isPick ? -1 : 0}
          onClick={handleEmailClick}
        >
          Tiếp tục với Email
        </button>

        <button
          className="u066-back"
          type="button"
          tabIndex={isDone ? 0 : -1}
          onClick={handleBackClick}
        >
          Dùng phương thức khác
        </button>
      </div>
    </div>
  );
};

export default SocialSignIn066;
