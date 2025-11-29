import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // C'est lui qui charge le design !

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Impossible de trouver l'élément root");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
