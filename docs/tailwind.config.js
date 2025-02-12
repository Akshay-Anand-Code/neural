/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './.vitepress/**/*.{js,ts,vue}',
    './.vitepress/**/*.{js,ts,vue}',
    './**/*.md',
    '!**/node_modules/**'
  ],
  theme: {
    extend: {
      colors: {
        'terminal-cyan': '#00ffff',
        'terminal-green': '#00ffbb',
        'terminal-dark': '#001a1a',
      },
    },
  },
  plugins: [],
};