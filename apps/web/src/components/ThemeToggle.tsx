'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const applyTheme = useCallback((targetTheme: 'dark' | 'light', notify = true) => {
    setTheme(targetTheme);
    try {
      localStorage.setItem('traic_theme', targetTheme);
    } catch (_) {}

    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(targetTheme);
    root.setAttribute('data-theme', targetTheme);

    if (document.body) {
      document.body.classList.remove('dark', 'light');
      document.body.classList.add(targetTheme);
    }

    if (notify) {
      window.dispatchEvent(
        new CustomEvent('traic-theme-change', { detail: { theme: targetTheme } })
      );
    }
  }, []);

  useEffect(() => {
    let currentTheme: 'dark' | 'light' = 'dark';
    try {
      const stored = localStorage.getItem('traic_theme') as 'dark' | 'light' | null;
      if (stored === 'light' || stored === 'dark') {
        currentTheme = stored;
      } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        currentTheme = 'light';
      }
    } catch (_) {}

    applyTheme(currentTheme, false);

    // Cross-instance and cross-tab synchronization listener
    const onThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: 'dark' | 'light' }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'traic_theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme(e.newValue, false);
      }
    };

    window.addEventListener('traic-theme-change', onThemeChange);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('traic-theme-change', onThemeChange);
      window.removeEventListener('storage', onStorage);
    };
  }, [applyTheme]);

  return (
    <div
      className="flex items-center rounded-full border border-border/90 bg-surface p-1 shadow-md font-mono text-[11px] backdrop-blur-md"
      role="group"
      aria-label="Theme switcher"
    >
      <button
        type="button"
        onClick={() => applyTheme('dark')}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-all ${
          theme === 'dark'
            ? 'bg-bg-1 text-accent-2 border border-accent-2/50 shadow-sm'
            : 'text-text-2 hover:text-text-1'
        }`}
        title="Activate Dark Obsidian Theme"
      >
        <Moon className="h-3.5 w-3.5" />
        <span>DARK</span>
      </button>

      <button
        type="button"
        onClick={() => applyTheme('light')}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-all ${
          theme === 'light'
            ? 'bg-accent text-bg-0 border border-accent font-bold shadow-sm'
            : 'text-text-2 hover:text-text-1'
        }`}
        title="Activate Light Stone Theme"
      >
        <Sun className="h-3.5 w-3.5" />
        <span>LIGHT</span>
      </button>
    </div>
  );
}

