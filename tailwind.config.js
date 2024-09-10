import daisyui from 'daisyui';
import typography from '@tailwindcss/typography'
import { fontFamily } from 'tailwindcss/defaultTheme'
import themes from 'daisyui/src/colors/themes'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', 
  ],
  plugins: [typography, daisyui],
  theme: {
    fontFamily: {
      sans: ['Poppins', ...fontFamily.sans],
      mono: ['Roboto Mono', ...fontFamily.mono],
    },
    extend: {
    },
  },
  purge: ['./index.html', './src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        arweave: {
          ...themes["[data-theme=light]"],
          primary: "#000000",
        },
      },
    ],
  },
}

