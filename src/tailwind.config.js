/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ces couleurs correspondent à ce que j'ai vu dans ton CSS
        neon: '#00f3ff',
        surface: '#111',
        surfaceHighlight: '#1a1a1a',
      },
    },
  },
  plugins: [],
}
