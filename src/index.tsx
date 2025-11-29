import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// On cherche l'élément HTML "root" qu'on a vu dans ton index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("ERREUR CRITIQUE : Impossible de trouver la div avec id='root' dans index.html");
}

// On démarre l'application React à l'intérieur
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
