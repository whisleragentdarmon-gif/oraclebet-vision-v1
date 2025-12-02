import { H2HFullProfile, WebScrapedData } from '../types';

export const H2HEngine = {
  // C'est cette fonction qui va prendre du temps (le "Loading" du God Mode)
  analyzeDeeply: async (p1: string, p2: string, tournament: string): Promise<WebScrapedData> => {
    
    const data: WebScrapedData = {
      playerProfile: { p1: { style: "Polyvalent", strengths: "N/A", weaknesses: "N/A", mental: "Stable" }, p2: { style: "Polyvalent", strengths: "N/A", weaknesses: "N/A", mental: "Stable" } },
      h2hReal: { totalMatches: 0, p1Wins: 0, p2Wins: 0, lastMeeting: "Aucune", surfaceFavorite: "Neutre" },
      surfaceStats: { p1WinRate: 50, p2WinRate: 50, trend: "Inconnue" },
      context: { weather: "Non définie", fatigueP1: "Inconnue", fatigueP2: "Inconnue", scandal: null },
      social: { sentimentP1: 'NEUTRAL', sentimentP2: 'NEUTRAL' }
    };

    try {
      // 1. Lancement des Sondes (Requêtes API Search)
      const q1 = `${p1} tennis playing style strengths weaknesses`;
      const q2 = `${p2} tennis playing style strengths weaknesses`;
      const q3 = `${p1} vs ${p2} head to head statistics ATP WTA`;
      const q4 = `${p1} recent form last 10 matches injury`;
      const q5 = `weather ${tournament} tennis conditions`;

      const [resP1, resP2, resH2H, resForm, resWeather] = await Promise.all([
        fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: q1 }) }).then(r => r.json()),
        fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: q2 }) }).then(r => r.json()),
        fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: q3 }) }).then(r => r.json()),
        fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: q4 }) }).then(r => r.json()),
        fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: q5 }) }).then(r => r.json())
      ]);

      // 2. Analyse Sémantique (Parsing des résultats Google)
      
      // -> Style de jeu (Détection de mots clés dans les snippets)
      const analyzeStyle = (results: any[]) => {
          const text = JSON.stringify(results).toLowerCase();
          let style = "Complet";
          if (text.includes("serve") || text.includes("ace")) style = "Gros Serveur";
          if (text.includes("baseline") || text.includes("defens")) style = "Défenseur de fond";
          if (text.includes("net") || text.includes("volley")) style = "Offensif";
          return style;
      };
      data.playerProfile.p1.style = analyzeStyle(resP1.results);
      data.playerProfile.p2.style = analyzeStyle(resP2.results);

      // -> Fatigue & Blessure (Forme)
      const textForm = JSON.stringify(resForm.results).toLowerCase();
      if (textForm.includes("withdraw") || textForm.includes("retired") || textForm.includes("injury")) {
          data.context.fatigueP1 = "ALERTE PHYSIQUE";
      } else if (textForm.includes("tired") || textForm.includes("marathon")) {
          data.context.fatigueP1 = "Fatigue Élevée";
      } else {
          data.context.fatigueP1 = "Frais";
      }

      // -> Météo
      if (resWeather.results && resWeather.results.length > 0) {
          data.context.weather = resWeather.results[0].snippet || "Conditions normales";
      }

      // -> H2H (Extraction simplifiée des chiffres)
      const textH2H = JSON.stringify(resH2H.results).toLowerCase();
      // On cherche des patterns comme "3-1" ou "leads 2-0"
      if (textH2H.includes("leads")) {
          data.h2hReal.lastMeeting = "Avantage historique détecté";
      }

    } catch (e) {
      console.error("Erreur Deep Analysis Web", e);
    }

    return data;
  },

  // Garde l'ancienne fonction pour compatibilité si besoin, ou laisse la vide
  fetchFullProfile: async (p1: string, p2: string, tournament: string): Promise<H2HFullProfile> => {
      // Version simplifiée qui retourne l'objet H2HFullProfile pour l'affichage tableau
      // On utilise des valeurs par défaut "Donnée indisponible" comme demandé
      return {
        p1: { age: "Recherche...", height: "Recherche...", rank: "Top 100", plays: "R", style: "Analyse...", nationality: "" },
        p2: { age: "Recherche...", height: "Recherche...", rank: "Top 100", plays: "R", style: "Analyse...", nationality: "" },
        h2hMatches: [],
        surfaceStats: { clay: {p1:"-", p2:"-"}, hard: {p1:"-", p2:"-"}, grass: {p1:"-", p2:"-"} },
        context: { weather: "En cours...", altitude: "-", motivation: "-" },
        sources: []
      };
  }
};
