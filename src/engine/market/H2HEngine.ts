import { H2HFullProfile, HumanFactors } from '../../types';

export const H2HEngine = {
  analyzeDeeply: async (p1: string, p2: string, tournament: string): Promise<H2HFullProfile> => {
    
    // 1. STRUCTURE VIDE (Ne jamais laisser vide)
    const defaultHuman: HumanFactors = {
        mental: { state: "Non déterminé", motivation: "Standard", pressSentiment: "Neutre", scandals: [] },
        physical: { fatigue: "Inconnue", injuryStatus: "Apte", trainingObservation: "Non observé" },
        lifestyle: { recentActivity: "Focus", travelStress: "Faible" },
        social: { redditMood: "Neutre", twitterHype: "Moyenne", fanRumors: [] }
    };

    const profile: H2HFullProfile = {
      p1: { name: p1, age: "Recherche...", height: "N/A", rank: "N/A", hand: "Droitier", style: "Analyse...", nationality: "" },
      p2: { name: p2, age: "Recherche...", height: "N/A", rank: "N/A", hand: "Droitier", style: "Analyse...", nationality: "" },
      human: { p1: JSON.parse(JSON.stringify(defaultHuman)), p2: JSON.parse(JSON.stringify(defaultHuman)) },
      h2hMatches: [],
      stats: { p1: { serveRating: "-", returnRating: "-", breakPointsSaved: "-" }, p2: { serveRating: "-", returnRating: "-", breakPointsSaved: "-" } },
      context: { weather: "Scan météo...", conditions: "Outdoor", tournamentLevel: "Pro" },
      sources: []
    };

    try {
      // 2. RECHERCHES "CHIRURGICALES" (Operators avancés)
      const queries = [
        // Base Stats
        `${p1} tennis player profile stats atp wta`,
        `${p2} tennis player profile stats atp wta`,
        // H2H
        `${p1} vs ${p2} head to head tennis matchstat`,
        // Conditions
        `weather ${tournament} tennis forecast wind humidity`,
        // 🚨 HUMAN FACTOR P1 (Blessure, Social, Mental)
        `${p1} tennis injury news interview motivation training video reddit`,
        // 🚨 HUMAN FACTOR P2
        `${p2} tennis injury news interview motivation training video reddit`
      ];

      const responses = await Promise.all(
        queries.map(q => 
          fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) })
          .then(res => res.json())
        )
      );

      const [resP1, resP2, resH2H, resWeather, resHumanP1, resHumanP2] = responses;

      // 3. PARSING & DÉDUCTIONS (Logique d'enquête)
      
      // --- PROFIL P1 ---
      if (resP1.results?.[0]) {
          const txt = JSON.stringify(resP1.results).toLowerCase();
          profile.p1.rank = txt.match(/rank[:\s]+(\d+)/)?.[1] || "Top 100";
          profile.p1.age = txt.match(/(\d{2})\s?years/)?.[1] || "25";
          profile.p1.style = txt.includes("serve") ? "Gros Serveur" : txt.includes("clay") ? "Spécialiste Terre" : "Complet";
          profile.sources.push(resP1.results[0].link);
      }

      // --- PROFIL P2 ---
      if (resP2.results?.[0]) {
          const txt = JSON.stringify(resP2.results).toLowerCase();
          profile.p2.rank = txt.match(/rank[:\s]+(\d+)/)?.[1] || "Top 100";
          profile.p2.style = txt.includes("defens") ? "Défenseur" : "Attaquant";
          profile.sources.push(resP2.results[0].link);
      }

      // --- FACTEURS HUMAINS P1 (Le plus important) ---
      if (resHumanP1.results) {
          const txt = JSON.stringify(resHumanP1.results).toLowerCase();
          // Détection Blessure
          if (txt.match(/injury|withdraw|surgery|pain|medical|mto/)) {
              profile.human.p1.physical.injuryStatus = "ALERTE: Gêne possible";
              profile.human.p1.physical.fatigue = "Élevée (Risque)";
          }
          // Détection Mental/Social
          if (txt.includes("angry") || txt.includes("smash racket")) profile.human.p1.mental.state = "Instable";
          if (txt.includes("confident") || txt.includes("ready")) profile.human.p1.mental.state = "Confiant";
          if (txt.includes("reddit")) profile.human.p1.social.redditMood = "Discussions actives";
      }

      // --- FACTEURS HUMAINS P2 ---
      if (resHumanP2.results) {
          const txt = JSON.stringify(resHumanP2.results).toLowerCase();
          if (txt.match(/injury|withdraw|surgery|pain/)) {
              profile.human.p2.physical.injuryStatus = "ALERTE: Physique douteux";
          }
      }

      // --- CONDITIONS ---
      if (resWeather.results?.[0]) {
          profile.context.weather = resWeather.results[0].snippet.substring(0, 40);
          if (profile.context.weather.includes("rain")) profile.context.conditions = "Lent / Indoor probable";
      }

      // --- H2H ---
      if (resH2H.results?.[0]) {
          profile.h2hMatches.push({ date: "2024", winner: "Voir Source", score: "Check Web", surface: "N/A" });
          profile.sources.push(resH2H.results[0].link);
      }

    } catch (e) { console.error("Erreur Deep Analysis", e); }

    return profile;
  }
};
