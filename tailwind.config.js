/** Build Me Design System — Tailwind Config v1.0
 *  Drop into the root of any React/Next.js app in the Build Me ecosystem.
 *  Pairs with globals.css for CSS-variable-based dark mode.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          600: '#EA6A0C',
          700: '#C2560A',
          100: '#FFE7D3',
        },
        secondary: {
          DEFAULT: '#0F172A',
          700: '#334155',
          800: '#1E293B',
        },
        accent: '#0EA5E9',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        neutral: {
          25: '#F8FAFC',
          50: '#F1F5F9',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#0F172A',
        },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        h1: ['3.5rem', { lineHeight: '1.05', fontWeight: '700' }],
        h2: ['2.5rem', { lineHeight: '1.15', fontWeight: '700' }],
        h3: ['1.75rem', { lineHeight: '1.2', fontWeight: '600' }],
        h4: ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        h5: ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(15,23,42,0.10), 0 2px 4px -1px rgba(15,23,42,0.06)',
        lift: '0 12px 24px -8px rgba(15,23,42,0.20), 0 4px 8px -2px rgba(15,23,42,0.08)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      transitionDuration: {
        fast: '200ms',
        base: '320ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
