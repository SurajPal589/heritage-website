/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          dark: '#0c1524',
          navy: '#131f37',
          surface: '#182744',
          border: '#2a3b5e',
          ivory: '#faf7f2',
          cream: '#f4ede0',
          parchment: '#f8f4ec',
          sandstone: '#d8c4a0',
          gold: '#cba135',
          goldLight: '#e4bf5b',
          terracotta: '#bf533b',
          terracottaDark: '#993a23',
          terracottaLight: '#e0735b',
          sage: '#4a6b5d',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'heritage': '0 8px 30px rgba(12, 21, 36, 0.12)',
        'heritage-lg': '0 14px 40px rgba(12, 21, 36, 0.25)',
        'card-warm': '0 4px 20px rgba(191, 83, 59, 0.08)',
      }
    },
  },
  plugins: [],
}

