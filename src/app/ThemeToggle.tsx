"use client";

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      // Prefer the pre-set attribute (from server/inline script) if present
      const attr = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' | null;
      const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
      if (attr === 'dark' || attr === 'light') {
        setTheme(attr);
        return;
      }
      if (saved) {
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
        return;
      }

      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      const initial = prefersLight ? 'light' : 'dark';
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
    } catch (e) {
      // ignore
    }
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    } catch (e) {}
  };

  return (
    <>
      <style jsx>{`
        .theme-toggle {
          position: relative;
          width: 44px;
          height: 44px;
          background: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
          border: 1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'};
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .theme-toggle:hover {
          background: ${theme === 'dark' ? '#4b5563' : '#e5e7eb'};
          transform: translateY(-1px);
        }

        .theme-toggle:active {
          transform: translateY(0);
        }

        .icon {
          width: 20px;
          height: 20px;
          color: ${theme === 'dark' ? '#fbbf24' : '#6b7280'};
          transition: all 0.2s ease;
        }

        .theme-toggle:hover .icon {
          transform: scale(1.1);
          color: ${theme === 'dark' ? '#fcd34d' : '#374151'};
        }

        /* Sun Icon */
        .sun-icon {
          display: ${theme === 'light' ? 'block' : 'none'};
        }

        /* Moon Icon */
        .moon-icon {
          display: ${theme === 'dark' ? 'block' : 'none'};
        }
      `}</style>

      <button
        type="button"
        aria-label="Toggle color theme"
        className="theme-toggle"
        onClick={toggle}
      >
        {/* Sun Icon */}
        <svg className="icon sun-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        {/* Moon Icon */}
        <svg className="icon moon-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </>
  );
}