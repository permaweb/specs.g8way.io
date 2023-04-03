import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'
import { default as defaultTheme } from 'tailwindcss/defaultTheme'

export default {
  content: ["./index.html", "./src/**/*.{svelte,js,ts}"],
  plugins: [typography, daisyui],
  theme: {
    fontFamily: {
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      mono: ['Roboto Mono', ...defaultTheme.fontFamily.mono]
    },
    extend: {

    },
  },
  purge: ["./index.html", './src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {

    },
  },
  daisyui: {
    themes: [
      {
        arweave: {
          "primary": "#FF8500",
          "secondary": "#ff72d2",
          "accent": "#e2315e",
          "neutral": "#f2f3f4",
          "base-100": "#293241",
          "info": "#81A5D5",
          "success": "#21BA82",
          "warning": "#DAA60B",
          "error": "#F16F55",
        },
      },
    ],
  }
}