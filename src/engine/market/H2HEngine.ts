import { H2HFullProfile, HumanFactors } from '../../types';

export const H2HEngine = {
  fetchFullProfile: async (p1: string, p2: string, tournament: string): Promise<H2HFullProfile> => {
    
    const defaultHuman: HumanFactors = {
        mental: { state: "Stable", motivation: "Standard", pressSentiment: "Neutre", scandals: [] },
        physical: { fatigue: "Inconnue", injuryStatus: "Apte", trainingObservation: "Non observé" },
        lifestyle: { recentActivity: "Focus", travelStress: "Faible" },
        social: { redditMood: "Neutre", twitterHype: "Moyenne", fanRumors: [] }
    };

    const profile: H2HFullProfile = {
      p1: { name: p1, age: "N/A", height: "N/A", rank: "N/A", hand: "Droitier", style: "Analyse...", nationality: "" },
      p2: { name: p2, age: "N/A", height: "N/A", rank: "N/A", hand: "Droitier", style: "Analyse...", nationality: "" },
      human: { p1: JSON.parse(JSON.stringify(defaultHuman)), p2: JSON.parse(JSON.stringify(defaultHuman)) },
      h2hMatches: [],
      // On initialise avec des "?" pour montrer qu'on cherche
      stats: { p1: { serveRating: "?", returnRating: "?", breakPointsSaved: "?" }, p2: { serveRating: "?", returnRating: "?", breakPointsSaved: "?" } },
      // Ici on stockera les stats de surface trouvées sur le web (ex: "12-8")
      context: { weather: "Analyse...", conditions: "Outdoor", tournamentLevel: "Pro" },
      sources: []
    };

    try {
      const queries = [
        `${p1} tennis player profile stats age height ranking`,
        `${p2} tennis player profile stats age height ranking`,
        `${p1} vs ${p2} h2h matchstat tennis`,
        `${p1} win loss record clay hard grass 2024`, // Recherche spécifique des stats W/L
        `${p2} win loss record clay hard grass 2024`,
        `weather ${tournament || 'tennis'} forecast`
      ];

      const responses = await Promise.all(
        queries.map(q => 
          fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) })
          .then(res => res.json())
        )
      );

      const [resP1, resP2, resH2H, resStatsP1, resStatsP2, resWeather] = responses;

      // Fonction d'extraction Regex pour Age, Taille, Rang
      const extractInfo = (txt: string) => ({
          rank: txt.match(/rank[:\s]+(\d+)/i)?.[1] || "N/A",
          age: txt.match(/(\d{2})\s?years/i)?.[1] || "N/A",
          height: txt.match(/(\d\.\d{2})\s?m/i)?.[1] || "N/A",
          hand: txt.toLowerCase().includes('left') ? 'Gaucher' : 'Droitier'
      });

      // Parsing P1
      if (resP1.results?.[0]) {
          const info = extractInfo(JSON.stringify(resP1.results));
          profile.p1 = { ...profile.p1, ...info };
          profile.sources.push(resP1.results[0].link);
      }
      
      // Parsing P2
      if (resP2.results?.[0]) {
          const info = extractInfo(JSON.stringify(resP2.results));
          profile.p2 = { ...profile.p2, ...info };
          profile.sources.push(resP2.results[0].link);
      }

      // Parsing Stats Surface (Simulation d'extraction de "12-8" dans le texte)
      // Dans une vraie implémentation, il faudrait une regex complexe pour choper "12-8 on clay"
      // Ici on met des valeurs par défaut intelligentes si on trouve des mots clés
      if (JSON.stringify(resStatsP1.results).includes("clay")) profile.stats.p1.returnRating = "Fort sur Terre";
      if (JSON.stringify(resStatsP2.results).includes("hard")) profile.stats.p2.returnRating = "Fort sur Dur";

      // Météo
      if (resWeather.results?.[0]) {
          profile.context.weather = resWeather.results[0].snippet.substring(0, 40);
      }

      // H2H
      if (resH2H.results?.[0]) {
          // On ajoute une entrée fictive pour montrer qu'on a trouvé la source
          profile.h2hMatches.push({ date: "Historique", winner: "Voir Source", score: "Détails Web", surface: "-" });
          profile.sources.push(resH2H.results[0].link);
      }

    } catch (e) { console.error("Erreur H2H Engine", e); }

    return profile;
  }
};
