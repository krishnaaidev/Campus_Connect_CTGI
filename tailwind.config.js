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
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bcdbff',
          300: '#8ec2ff',
          400: '#599eff',
          500: '#337bfb',
          600: '#1d5ef0',
          700: '#1747dc',
          800: '#183ab3',
          900: '#19348c',
          950: '#0f1f54',
        },
        navy: {
          800: '#0f172a',
          850: '#0b1120',
          900: '#070b14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
