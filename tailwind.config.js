import daisyui from 'daisyui'
import { default as defaultTheme } from 'tailwindcss/defaultTheme'

export default {
  content: ["./index.html", "./src/**/*.{svelte,js,ts}"],
  plugins: [daisyui],
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
  }
}