/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chat: {
          bg: '#343541',
          sidebar: '#202123',
          input: '#40414f',
          user: '#343541',
          ai: '#444654',
          text: '#ececf1',
          border: '#d9d9e3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
