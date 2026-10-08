'use client';

import { useState, useEffect } from 'react';
import { IconSun, IconMoon } from './SFSymbols';

export type ThemeMode = 'light' | 'dark';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('traic-theme') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') {
      setMode(saved);
      applyTheme(saved);
    } else {
      // Default to dark mode for TRAIC hardware theme
      setMode('dark');
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (targetMode: ThemeMode) => {
    if (targetMode === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    localStorage.setItem('traic-theme', nextMode);
    applyTheme(nextMode);
  };

  if (!mounted) {
    return (
      <div
        className="h-10 w-10 rounded-pill bg-canvas-surface/60 border border-subtle animate-pulse"
        aria-hidden="true"
      />
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-pill bg-canvas-surface border border-subtle flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:border-apple-blue/50 active:scale-95 transition-all duration-200 focus-visible:outline-apple-blue cursor-pointer shadow-sm"
        aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      >
        {mode === 'dark' ? (
          <IconMoon size={17} className="text-apple-blue transition-transform" />
        ) : (
          <IconSun size={17} className="text-[#FF9500] transition-transform" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-canvas-surface border border-subtle text-ink-secondary hover:text-ink-primary active:scale-95 transition-all duration-200 cursor-pointer shadow-sm text-[12px] font-mono"
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {mode === 'dark' ? (
        <>
          <IconMoon size={14} className="text-apple-blue" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <IconSun size={14} className="text-[#FF9500]" />
          <span>Light</span>
        </>
      )}
    </button>
  );
}
