import { H2HFullProfile } from '../types'; // Correction du chemin

export const H2HEngine = {
  fetchFullProfile: async (p1: string, p2: string, tournament: string): Promise<H2HFullProfile> => {
    
    const profile: H2HFullProfile = {
      p1: { age: "N/A", height: "N/A", rank: "N/A", plays: "N/A", style: "Analyse...", nationality: "" },
      p2: { age: "N/A", height: "N/A", rank: "N/A", plays: "N/A", style: "Analyse...", nationality: "" },
      h2hMatches: [],
      surfaceStats: { clay: {p1:"-", p2:"-"}, hard: {p1:"-", p2:"-"}, grass: {p1:"-", p2:"-"} },
      context: { weather: "N/A", altitude: "N/A", motivation: "Neutre" },
      sources: []
    };

    try {
      const queries = [
        `${p1} tennis player profile ranking height`,
        `${p2} tennis player profile ranking height`,
        `${p1} vs ${p2} h2h stats tennis`,
        `weather ${tournament} tennis forecast`
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

      // Parsing P1
      const resP1 = responses[0]?.results || [];
      if (resP1.length > 0) {
         const text = JSON.stringify(resP1).toLowerCase();
         profile.p1.rank = text.match(/rank[:\s]+(\d+)/)?.[1] || "Top 100";
         profile.p1.age = text.match(/(\d{2})\s?years/)?.[1] || "25";
         profile.sources.push(resP1[0].link);
      }

      // Parsing P2
      const resP2 = responses[1]?.results || [];
      if (resP2.length > 0) {
         const text = JSON.stringify(resP2).toLowerCase();
         profile.p2.rank = text.match(/rank[:\s]+(\d+)/)?.[1] || "Top 100";
         profile.p2.age = text.match(/(\d{2})\s?years/)?.[1] || "25";
      }

      // Parsing Météo (Correction de l'erreur TS2353)
      const resWeather = responses[3]?.results || [];
      if (resWeather.length > 0) {
          profile.context.weather = resWeather[0].snippet.substring(0, 40);
      }

    } catch (e) {
      console.error("Erreur H2H Auto-Fetch", e);
    }

    return profile;
  }
};
