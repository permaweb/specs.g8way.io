import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';
import themes from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  plugins: [typography, daisyui],
  theme: {
    fontFamily: {
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      mono: ['Roboto Mono', ...defaultTheme.fontFamily.mono],
    },
    extend: {},
  },
  variants: {},
  daisyui: {
    themes: [
      {
        arweave: {
          ...themes['[data-theme=light]'],
          primary: '#000000',
          'primary-content': '#FFFFFF',
        },
      },
    ],
  },
};

export default config;
