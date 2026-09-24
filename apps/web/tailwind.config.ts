import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-0': 'rgb(var(--bg-0) / <alpha-value>)',
        'bg-1': 'rgb(var(--bg-1) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-hover': 'rgb(var(--surface-hover) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'text-1': 'rgb(var(--text-1) / <alpha-value>)',
        'text-2': 'rgb(var(--text-2) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)',
          glow: 'rgba(var(--accent) / 0.15)',
        },
        'accent-2': {
          DEFAULT: 'rgb(var(--accent-2) / <alpha-value>)',
          hover: 'rgb(var(--accent-2-hover) / <alpha-value>)',
          fg: 'rgb(var(--accent-2-fg) / <alpha-value>)',
          glow: 'rgba(var(--accent-2) / 0.15)',
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
