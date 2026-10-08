'use client';

import { useState, useEffect } from 'react';
import { IconSun, IconMoon, IconMonitor } from './SFSymbols';

export type ThemeMode = 'system' | 'light' | 'dark';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('traic-theme') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      setMode(saved);
      applyTheme(saved);
    } else {
      // Default to dark mode for TRAIC hardware theme
      setMode('dark');
      applyTheme('dark');
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const current = localStorage.getItem('traic-theme') as ThemeMode | null;
      if (current === 'system') {
        applyTheme('system');
      }
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (targetMode: ThemeMode) => {
    const isDark =
      targetMode === 'dark'
        ? true
        : targetMode === 'light'
        ? false
        : window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  const handleSelect = (nextMode: ThemeMode) => {
    setMode(nextMode);
    localStorage.setItem('traic-theme', nextMode);
    applyTheme(nextMode);
  };

  if (!mounted) {
    return (
      <div
        className="h-9 w-24 rounded-pill bg-canvas-surface/60 border border-subtle animate-pulse"
        aria-hidden="true"
      />
    );
  }

  if (compact) {
    const nextMode: ThemeMode = mode === 'dark' ? 'light' : mode === 'light' ? 'system' : 'dark';
    return (
      <button
        type="button"
        onClick={() => handleSelect(nextMode)}
        className="w-10 h-10 rounded-pill bg-canvas-surface border border-subtle flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:border-apple-blue/50 transition-colors focus-visible:outline-apple-blue cursor-pointer"
        aria-label={`Current appearance: ${mode}. Click to cycle appearance.`}
        title={`Appearance: ${mode.toUpperCase()} (Click to toggle)`}
      >
        {mode === 'light' ? (
          <IconSun size={17} className="text-[#FF9500]" />
        ) : mode === 'dark' ? (
          <IconMoon size={17} className="text-apple-blue" />
        ) : (
          <IconMonitor size={17} className="text-ink-secondary" />
        )}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme mode switcher"
      className="inline-flex items-center p-0.5 rounded-pill bg-canvas-surface border border-subtle text-ink-secondary shadow-sm"
    >
      <button
        type="button"
        onClick={() => handleSelect('light')}
        aria-pressed={mode === 'light'}
        className={`inline-flex items-center justify-center w-7 h-7 rounded-pill transition-all duration-200 cursor-pointer ${
          mode === 'light'
            ? 'bg-[#0071E3] text-white shadow-sm font-semibold'
            : 'hover:text-ink-primary text-ink-secondary'
        }`}
        aria-label="Light mode"
        title="Light mode"
      >
        <IconSun size={14} />
      </button>

      <button
        type="button"
        onClick={() => handleSelect('system')}
        aria-pressed={mode === 'system'}
        className={`inline-flex items-center justify-center w-7 h-7 rounded-pill transition-all duration-200 cursor-pointer ${
          mode === 'system'
            ? 'bg-[#0071E3] text-white shadow-sm font-semibold'
            : 'hover:text-ink-primary text-ink-secondary'
        }`}
        aria-label="System default mode"
        title="System default mode"
      >
        <IconMonitor size={14} />
      </button>

      <button
        type="button"
        onClick={() => handleSelect('dark')}
        aria-pressed={mode === 'dark'}
        className={`inline-flex items-center justify-center w-7 h-7 rounded-pill transition-all duration-200 cursor-pointer ${
          mode === 'dark'
            ? 'bg-[#0071E3] text-white shadow-sm font-semibold'
            : 'hover:text-ink-primary text-ink-secondary'
        }`}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <IconMoon size={14} />
      </button>
    </div>
  );
}
