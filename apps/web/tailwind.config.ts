import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-0': '#07080B',
        'bg-1': '#0D0F14',
        surface: '#141821',
        'surface-hover': '#1B212D',
        border: '#232838',
        'text-1': '#E8EAF0',
        'text-2': '#9AA3B5',
        accent: {
          DEFAULT: '#FF9F1C',
          hover: '#E08507',
          glow: 'rgba(255, 159, 28, 0.15)',
        },
        'accent-2': {
          DEFAULT: '#38BDF8',
          hover: '#0EA5E9',
          glow: 'rgba(56, 189, 248, 0.15)',
        },
        success: '#34D399',
        danger: '#F87171',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
