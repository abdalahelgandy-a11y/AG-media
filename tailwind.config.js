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
          50: '#f0f7f9',
          100: '#daedf1',
          200: '#b8dce4',
          300: '#87c2cf',
          400: '#4da0b4',
          500: '#267f94',
          600: '#134C5C', // Official AG-media Logo Color
          700: '#10404e',
          800: '#0e343f',
          900: '#0a262e',
          950: '#06171c'
        },
        agDark: {
          950: '#0f172a',
          900: '#1e293b',
          850: '#334155',
          800: '#475569',
          700: '#64748b',
          600: '#94a3b8'
        },
        agAccent: {
          teal: '#134C5C',
          cyan: '#1cb3c8',
          amber: '#f59e0b',
          gold: '#eab308',
          emerald: '#10b981',
          rose: '#f43f5e',
          charcoal: '#222322'
        }
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'Segoe UI', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
