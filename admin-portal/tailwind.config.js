/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060608',
          900: '#0C0C0E',
          850: '#111115',
          800: '#17171C',
          700: '#23232A',
        },
        brand: {
          pink: '#B600A8',
          purple: '#7621B0',
          orange: '#BE4C00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
