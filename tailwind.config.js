import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'
import { fontFamily } from 'tailwindcss/defaultTheme'
import themes from 'daisyui/src/theming/themes'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  plugins: [typography, daisyui],
  theme: {
    fontFamily: {
      sans: ['Poppins', ...fontFamily.sans],
      mono: ['Roboto Mono', ...fontFamily.mono]
    },
    extend: {
    }
  },
  variants: {

  },
  daisyui: {
    themes: [
      {
        arweave: {
          ...themes['[data-theme=light]'],
          primary: '#000000',
          'primary-content': '#FFFFFF'
        }
      }
    ]
  }
}
