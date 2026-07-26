/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ee',
          100: '#dcefd7',
          200: '#bbdfb3',
          300: '#8fc784',
          400: '#5fa852',
          500: '#3d8a32',
          600: '#2e6e26',
          700: '#265720',
          800: '#114c09',
          900: '#0d3a07',
          950: '#062003',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
