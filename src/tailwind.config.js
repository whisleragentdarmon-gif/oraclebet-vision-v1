/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // C'est ici qu'on définit tes couleurs personnalisées
        carbon: '#0D0D0D',         // Le fond très sombre
        surface: '#161616',        // Le fond des cartes
        surfaceHighlight: '#1F1F1F',
        neon: '#FF7A00',           // L'orange caractéristique de ton site
        neonHover: '#E66E00',      // L'orange un peu plus foncé au survol
        neonDim: 'rgba(255, 122, 0, 0.1)',
        success: '#10B981',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
