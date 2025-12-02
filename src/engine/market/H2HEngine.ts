import { H2HFullProfile, HumanFactors } from '../../types';

export const H2HEngine = {
  fetchFullProfile: async (p1: string, p2: string, tournament: string): Promise<H2HFullProfile> => {
    
    // Structure par défaut
    const profile: H2HFullProfile = {
      p1: { name: p1, age: "", height: "", rank: "", hand: "Droitier", style: "Analyse...", nationality: "" },
      p2: { name: p2, age: "", height: "", rank: "", hand: "Droitier", style: "Analyse...", nationality: "" },
      human: { 
          p1: { mental: {state:"Stable", motivation:"Moyenne", pressSentiment:"Neutre", scandals:[]}, physical: {fatigue:"Normale", injuryStatus:"Fit", trainingObservation:"R.A.S"}, lifestyle: {recentActivity:"Focus", travelStress:"Faible"}, social: {redditMood:"Neutre", twitterHype:"Moyenne", fanRumors:[]} }, 
          p2: { mental: {state:"Stable", motivation:"Moyenne", pressSentiment:"Neutre", scandals:[]}, physical: {fatigue:"Normale", injuryStatus:"Fit", trainingObservation:"R.A.S"}, lifestyle: {recentActivity:"Focus", travelStress:"Faible"}, social: {redditMood:"Neutre", twitterHype:"Moyenne", fanRumors:[]} } 
      },
      h2hMatches: [],
      surfaceStats: { clay: {p1:"50", p2:"50"}, hard: {p1:"50", p2:"50"}, grass: {p1:"50", p2:"50"} },
      stats: { p1: { serveRating: "50", returnRating: "50", breakPointsSaved: "50" }, p2: { serveRating: "50", returnRating: "50", breakPointsSaved: "50" } },
      context: { weather: "Recherche...", conditions: "Outdoor", tournamentLevel: "Pro" },
      sources: []
    };

    try {
      const queries = [
        `${p1} tennis ranking age stats`,
        `${p2} tennis ranking age stats`,
        `${p1} vs ${p2} h2h tennis stats`,
        `${p1} tennis surface statistics win loss clay hard`, // Pour remplir les stats surface
        `${p2} tennis surface statistics win loss clay hard`
      ];

      const responses = await Promise.all(
        queries.map(q => 
          fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) })
          .then(res => res.json())
        )
      );

      const [resP1, resP2, resH2H, resStats1, resStats2] = responses;

      // Parsing P1
      if (resP1.results?.[0]) {
          const txt = JSON.stringify(resP1.results).toLowerCase();
          profile.p1.rank = txt.match(/rank[:\s]+(\d+)/)?.[1] || "100";
          profile.p1.age = txt.match(/(\d{2})\s?years/)?.[1] || "25";
          if (txt.includes('left')) profile.p1.hand = "Gaucher";
          profile.sources.push(resP1.results[0].link);
      }

      // Parsing P2
      if (resP2.results?.[0]) {
          const txt = JSON.stringify(resP2.results).toLowerCase();
          profile.p2.rank = txt.match(/rank[:\s]+(\d+)/)?.[1] || "100";
          profile.p2.age = txt.match(/(\d{2})\s?years/)?.[1] || "25";
          if (txt.includes('left')) profile.p2.hand = "Gaucher";
      }

      // Parsing Surface Stats (Simulation extraction)
      const parseSurface = (txt: string, surface: string) => {
          // Cherche des patterns comme "Clay: 60%" ou "Hard W/L 12-5"
          // Ici on simule une détection de mot clé pour ajuster une note de 0 à 100
          if (txt.includes(surface) && txt.includes("win")) return "65"; // Bon signe
          if (txt.includes(surface) && txt.includes("loss")) return "40"; // Mauvais signe
          return "50";
      };

      const txtStats1 = JSON.stringify(resStats1.results || "").toLowerCase();
      profile.surfaceStats.hard.p1 = parseSurface(txtStats1, "hard");
      profile.surfaceStats.clay.p1 = parseSurface(txtStats1, "clay");

      const txtStats2 = JSON.stringify(resStats2.results || "").toLowerCase();
      profile.surfaceStats.hard.p2 = parseSurface(txtStats2, "hard");
      profile.surfaceStats.clay.p2 = parseSurface(txtStats2, "clay");

      // H2H
      if (resH2H.results?.[0]) {
          profile.h2hMatches.push({ date: "Web", winner: "Voir Source", score: "Check", surface: "-" });
          profile.sources.push(resH2H.results[0].link);
      }

    } catch (e) { console.error(e); }

    return profile;
  }
};
