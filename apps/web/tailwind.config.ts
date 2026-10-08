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
      fontFamily: {
        apple: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro"', 'var(--font-inter)', 'sans-serif'],
        sans: ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro"', 'var(--font-inter)', 'sans-serif'],
        mono: ['"SF Mono"', 'SFMono-Regular', 'ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        apple: {
          blue: {
            DEFAULT: '#0071E3',
            light: '#0071E3',
            dark: '#2997FF',
          },
          green: {
            light: '#34C759',
            dark: '#30D158',
          },
          red: {
            light: '#FF3B30',
            dark: '#FF453A',
          },
          orange: {
            light: '#FF9500',
            dark: '#FF9F0A',
          },
          yellow: {
            light: '#FFCC00',
            dark: '#FFD60A',
          },
          purple: {
            light: '#AF52DE',
            dark: '#BF5AF2',
          },
          canvas: {
            light: '#FFFFFF',
            dark: '#000000',
          },
          subsurface: {
            light: '#F5F5F7',
            dark: '#1D1D1F',
          },
          card: {
            light: '#FFFFFF',
            dark: '#1C1C1E',
          },
          text: {
            primary: {
              light: '#1D1D1F',
              dark: '#F5F5F7',
            },
            secondary: {
              light: '#6E6E73',
              dark: '#86868B',
            },
            tertiary: {
              light: '#86868B',
              dark: '#6E6E73',
            },
          },
          border: {
            light: 'rgba(0, 0, 0, 0.08)',
            dark: 'rgba(255, 255, 255, 0.12)',
            focus: {
              light: '#0071E3',
              dark: '#2997FF',
            },
          },
        },
        'bg-0': 'rgb(var(--bg-0) / <alpha-value>)',
        'bg-1': 'rgb(var(--bg-1) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-hover': 'rgb(var(--surface-hover) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'text-1': 'rgb(var(--text-1) / <alpha-value>)',
        'text-2': 'rgb(var(--text-2) / <alpha-value>)',

        /* Apple System Blue Action Tokens */
        'apple-blue': {
          DEFAULT: 'var(--apple-blue)',
          btn: 'var(--apple-blue-btn)',
          hover: 'var(--apple-blue-hover)',
          fg: 'var(--apple-blue-fg)',
          muted: 'rgba(41, 151, 255, 0.12)',
        },

        /* Apple System Colors */
        'apple-green': 'var(--status-green)',
        'apple-orange': 'var(--status-orange)',
        'apple-red': 'var(--status-red)',
        'apple-purple': 'var(--status-purple)',
        'apple-indigo': 'var(--status-indigo)',

        /* Canonical Apple Surfaces */
        canvas: {
          DEFAULT: 'var(--canvas-bg)',
          elevated: 'var(--canvas-elevated)',
          surface: 'var(--canvas-surface)',
          glass: 'var(--canvas-glass)',
          nav: 'var(--canvas-glass)',
        },
        ink: {
          primary: 'var(--ink-primary)',
          secondary: 'var(--ink-secondary)',
          tertiary: 'var(--ink-tertiary)',
        },

        /* Backward Compatible Aliases Mapping to Apple Blue */
        cyan: {
          DEFAULT: 'var(--apple-blue)',
          hover: 'var(--apple-blue-hover)',
          fg: 'var(--apple-blue-fg)',
          muted: 'rgba(41, 151, 255, 0.12)',
        },
        accent: {
          DEFAULT: 'var(--apple-blue)',
          hover: 'var(--apple-blue-hover)',
          fg: 'var(--apple-blue-fg)',
          glow: 'rgba(41, 151, 255, 0.15)',
        },
        'accent-2': {
          DEFAULT: 'var(--apple-blue)',
          hover: 'var(--apple-blue-hover)',
          fg: 'var(--apple-blue-fg)',
          glow: 'rgba(41, 151, 255, 0.15)',
        },

        separator: 'var(--border-separator)',
        subtle: 'var(--border-subtle)',
      },
      borderRadius: {
        'apple-card': '18px',
        'apple-hero': '24px',
        squircle: '24px',
        pill: '9999px',
      },
      boxShadow: {
        'apple-light': '0 2px 4px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08)',
        'apple-dark': '0 0 0 1px rgba(255,255,255,0.1), 0 12px 32px rgba(0,0,0,0.4)',
      },
      maxWidth: {
        apple: '1140px',
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        apple: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
