import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#60A5FA',
        },
        secondary: {
          DEFAULT: '#1F1F1F',
          dark: '#0A0A0A',
          light: '#2A2A2A',
        },
        border: {
          DEFAULT: '#1F1F1F',
          light: '#2A2A2A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A3A3A3',
          muted: '#737373',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        none: '0',
      },
    },
  },
  plugins: [],
};

export default config;
