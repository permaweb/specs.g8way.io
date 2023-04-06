import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';
import { default as defaultTheme } from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  plugins: [typography, daisyui],
  theme: {
    fontFamily: {
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      mono: ['Roboto Mono', ...defaultTheme.fontFamily.mono],
    },
    extend: {},
  },
  purge: ['./index.html', './src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        arweave: {
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#ffffff',
          neutral: '#ffffff',
          '#ffffff': '#ffffff',
          info: '#000000',
          success: '#21BA82',
          warning: '#DAA60B',
          error: '#F16F55',
        },
      },
    ],
  },
};
