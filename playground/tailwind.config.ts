import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Geist', ...fontFamily.sans],
      mono: ['"Geist Mono"', ...fontFamily.mono],
      serif: [...fontFamily.serif],
    },
    extend: {
      borderRadius: {
        '4xl': '32px',
        '5xl': '40px',
      },
      colors: {
        dark: "#1a1b1e"
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
