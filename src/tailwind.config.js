/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: '#0D0D0D',
        surface: '#161616',
        surfaceHighlight: '#1F1F1F',
        neon: '#FF7A00',
        neonHover: '#E66E00',
        neonDim: 'rgba(255, 122, 0, 0.1)',
        success: '#10B981',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
