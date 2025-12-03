import { H2HFullProfile } from '../types';

export const H2HEngine = {
  fetchFullProfile: async (p1: string, p2: string, tournament: string): Promise<H2HFullProfile> => {
    
    const profile: H2HFullProfile = {
      p1: { age: "N/A", height: "N/A", rank: "N/A", plays: "N/A", style: "Analyse...", nationality: "" },
      p2: { age: "N/A", height: "N/A", rank: "N/A", plays: "N/A", style: "Analyse...", nationality: "" },
      h2hMatches: [],
      surfaceStats: { clay: {p1:"-", p2:"-"}, hard: {p1:"-", p2:"-"}, grass: {p1:"-", p2:"-"} },
      context: { weather: "Non trouvé", altitude: "0m", motivation: "Neutre" },
      sources: []
    };

    try {
      const queries = [
        `${p1} tennis player ranking age height`, 
        `${p2} tennis player ranking age height`, 
        `${p1} vs ${p2} head to head tennis stats`,        
        `weather forecast ${tournament} tennis`,         
        `${p1} recent results tennis`
      ];

      const responses = await Promise.all(
        queries.map(q => 
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
          }).then(res => res.json())
        )
      );

      // --- PARSING PLUS STRICT ---

      // 1. Joueur 1
      const resP1 = responses[0]?.results || [];
      if (resP1.length > 0) {
         const text = JSON.stringify(resP1).toLowerCase();
         // On cherche un chiffre après "rank" ou "#"
         const rankMatch = text.match(/(?:rank|#)\s?(\d+)/);
         if (rankMatch) profile.p1.rank = rankMatch[1];

         // On cherche l'âge (XX years)
         const ageMatch = text.match(/(\d{2})\s?years/);
         if (ageMatch) profile.p1.age = ageMatch[1];
         
         profile.sources.push(resP1[0].link);
      }

      // 2. Joueur 2
      const resP2 = responses[1]?.results || [];
      if (resP2.length > 0) {
         const text = JSON.stringify(resP2).toLowerCase();
         const rankMatch = text.match(/(?:rank|#)\s?(\d+)/);
         if (rankMatch) profile.p2.rank = rankMatch[1];

         const ageMatch = text.match(/(\d{2})\s?years/);
         if (ageMatch) profile.p2.age = ageMatch[1];
      }

      // 3. H2H
      const resH2H = responses[2]?.results || [];
      if (resH2H.length > 0) {
          // Si on trouve un titre pertinent, on l'ajoute aux sources
          profile.h2hMatches.push({
              date: "Voir source",
              winner: "?",
              score: "Voir lien",
              surface: "N/A"
          });
          profile.sources.push(resH2H[0].link);
      }

      // 4. Météo (FILTRE STRICT)
      const resWeather = responses[3]?.results || [];
      if (resWeather.length > 0) {
          const snippet = resWeather[0].snippet;
          // On ne prend le texte que s'il contient des mots météo ou des degrés
          if (snippet.match(/\d+°|sunny|rain|wind|cloud|degre/i)) {
              profile.context.weather = snippet.substring(0, 60) + "...";
          } else {
              profile.context.weather = "Pas de données météo fiables.";
          }
      }

    } catch (e) {
      console.error("Erreur H2H Auto-Fetch", e);
    }

    return profile;
  }
};
