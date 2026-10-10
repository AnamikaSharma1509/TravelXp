/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          midnight: '#102A43',
          heritage: '#174A7E',
          ocean: '#246BCE',
          sky: '#D9EAF7',
          ivory: '#FAF7F0',
          gold: '#C89B3C',
          terracotta: '#B86B4B',
          forest: '#347A55',
          slate: '#526477',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
        heritage: ['"Cinzel Decorative"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(16, 42, 67, 0.06)',
        'premium': '0 10px 30px -5px rgba(16, 42, 67, 0.12), 0 4px 6px -2px rgba(16, 42, 67, 0.05)',
        'gold': '0 4px 20px rgba(200, 155, 60, 0.25)',
      }
    },
  },
  plugins: [],
}
