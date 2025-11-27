/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00f3ff',     // Cyan vif
        surface: '#111',     // Gris très foncé
        surfaceHighlight: '#1a1a1a',
        carbon: '#09090b',   // Noir profond (celui qui manquait !)
      },
    },
  },
  plugins: [],
}
```

---

### Étape 4 : Le grand final (Installation)

Puisque nous avons changé `package.json`, tu **dois** lancer cette commande pour installer les outils manquants :

1.  Coupe ton serveur (`Ctrl + C`).
2.  Lance :
    ```bash
    npm install
    ```
3.  Une fois fini, relance :
    ```bash
    npm run dev
