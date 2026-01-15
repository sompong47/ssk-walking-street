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
    <button
      type="button"
      aria-label="Toggle color theme"
      className="theme-toggle"
      onClick={toggle}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
