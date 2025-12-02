import { H2HFullProfile, HumanFactors } from '../../types';

export const H2HEngine = {
  fetchFullProfile: async (p1: string, p2: string, tournament: string): Promise<H2HFullProfile> => {
    
    const defaultHuman: HumanFactors = {
        mental: { state: "Stable", motivation: "Standard", pressSentiment: "Neutre", scandals: [] },
        physical: { fatigue: "Normale", injuryStatus: "Apte", trainingObservation: "R.A.S" },
        lifestyle: { recentActivity: "Focus", travelStress: "Faible" },
        social: { redditMood: "Neutre", twitterHype: "Moyenne", fanRumors: [] }
    };

    const profile: H2HFullProfile = {
      p1: { name: p1, age: "N/A", height: "N/A", rank: "N/A", hand: "Droitier", style: "Analyse...", nationality: "" },
      p2: { name: p2, age: "N/A", height: "N/A", rank: "N/A", hand: "Droitier", style: "Analyse...", nationality: "" },
      human: { p1: JSON.parse(JSON.stringify(defaultHuman)), p2: JSON.parse(JSON.stringify(defaultHuman)) },
      h2hMatches: [],
      stats: { p1: { serveRating: "-", returnRating: "-", breakPointsSaved: "-" }, p2: { serveRating: "-", returnRating: "-", breakPointsSaved: "-" } },
      context: { weather: "Analyse...", conditions: "Outdoor", tournamentLevel: "Pro" },
      sources: []
    };

    try {
      const queries = [
        // Requêtes très précises pour remplir le tableau
        `${p1} tennis age height ranking`,
        `${p2} tennis age height ranking`,
        `${p1} vs ${p2} h2h tennis stats`,
        `${p1} injury news twitter`,
        `${p2} injury news twitter`,
        `weather ${tournament} tennis`
      ];

      const responses = await Promise.all(
        queries.map(q => 
          fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) })
          .then(res => res.json())
        )
      );

      const [resP1, resP2, resH2H, resInj1, resInj2, resWeather] = responses;

      // Extraction P1
      if (resP1.results?.[0]) {
          const txt = JSON.stringify(resP1.results).toLowerCase();
          profile.p1.rank = txt.match(/rank[:\s]+(\d+)/)?.[1] || "Top 100";
          profile.p1.age = txt.match(/(\d{2})\s?years/)?.[1] || "25";
          profile.p1.height = txt.match(/(\d\.\d{2})\s?m/)?.[1] || "1.85m";
          if (txt.includes('left')) profile.p1.hand = "Gaucher";
          profile.sources.push(resP1.results[0].link);
      }

      // Extraction P2
      if (resP2.results?.[0]) {
          const txt = JSON.stringify(resP2.results).toLowerCase();
          profile.p2.rank = txt.match(/rank[:\s]+(\d+)/)?.[1] || "Top 100";
          profile.p2.age = txt.match(/(\d{2})\s?years/)?.[1] || "25";
          profile.p2.height = txt.match(/(\d\.\d{2})\s?m/)?.[1] || "1.85m";
          if (txt.includes('left')) profile.p2.hand = "Gaucher";
      }

      // Blessures
      if (JSON.stringify(resInj1.results).match(/injury|withdraw/i)) profile.human.p1.physical.injuryStatus = "ALERTE BLESSURE";
      if (JSON.stringify(resInj2.results).match(/injury|withdraw/i)) profile.human.p2.physical.injuryStatus = "ALERTE BLESSURE";

      // H2H
      if (resH2H.results?.[0]) {
          profile.h2hMatches.push({ date: "Historique", winner: "Voir Web", score: "Check Source", surface: "-" });
          profile.sources.push(resH2H.results[0].link);
      }

      // Météo
      if (resWeather.results?.[0]) {
          profile.context.weather = resWeather.results[0].snippet.substring(0, 40);
      }

    } catch (e) { console.error("Erreur H2H Engine", e); }

    return profile;
  }
};
