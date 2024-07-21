import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['*/app/**/*.{js,jsx,ts,tsx}'],
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
    },
  },
  plugins: [],
} satisfies Config;
