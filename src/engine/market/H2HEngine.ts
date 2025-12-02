import { FullMatchDossier, PlayerProfileData, MomentumData, PsychData } from '../../types';

export const H2HEngine = {
  buildDossier: async (p1: string, p2: string): Promise<FullMatchDossier> => {
    
    // Initialisation vide (Template)
    const emptyProfile: PlayerProfileData = { rank: "Non trouvé", bestRank: "Non trouvé", age: "Non trouvé", height: "Non trouvé", style: "Non trouvé", hand: "Non trouvé", strength: "Non trouvé", weakness: "Non trouvé", injury: "Non trouvé", formScore: "Non trouvé", matches10days: "Non trouvé", timeOnCourt7days: "Non trouvé", seasonWinRate: "Non trouvé", careerWinRate: "Non trouvé", surfaceWinRate: "Non trouvé", tieBreakWinRate: "Non trouvé", vsTop10: "Non trouvé", vsTop50: "Non trouvé", motivation: "Non trouvé", socialSignal: "Non trouvé" };
    const emptyMomentum: MomentumData = { last5Matches: "Non trouvé", results: "Non trouvé", fatigue: "Non trouvé", pointsToDefend: "Non trouvé", motivation: "Non trouvé" };
    const emptyPsych: PsychData = { confidence: "Non trouvé", serenity: "Non trouvé", scandals: "Non trouvé", interviews: "Non trouvé" };

    const dossier: FullMatchDossier = {
      identity: { p1Name: p1, p2Name: p2, tournament: "Recherche...", category: "Recherche...", surface: "Recherche...", format: "Bo3", localTime: "Recherche...", userTime: "Recherche..." },
      profiles: { p1: { ...emptyProfile }, p2: { ...emptyProfile } },
      h2h: { global: "Non trouvé", surface: "Non trouvé", setsWon: "Non trouvé", gamesWon: "Non trouvé", lastDuelContext: "Non trouvé", matchupStyle: "Non trouvé" },
      conditions: { weather: "Non trouvé", temp: "Non trouvé", wind: "Non trouvé", humidity: "Non trouvé", altitude: "Non trouvé", courtSpeed: "Non trouvé", indoorOutdoor: "Non trouvé", surfaceAdvantage: "Non trouvé" },
      momentum: { p1: { ...emptyMomentum }, p2: { ...emptyMomentum } },
      bookmakers: { p1Odds: "Non trouvé", p2Odds: "Non trouvé", value: "Calcul...", movement24h: "Non trouvé", trapIndicator: "Non trouvé", publicVolume: "Non trouvé" },
      psychology: { p1: { ...emptyPsych }, p2: { ...emptyPsych } },
      synthesis: { statAdvantage: "Analyse...", mentalAdvantage: "Analyse...", physicalAdvantage: "Analyse...", surfaceAdvantage: "Analyse...", momentumAdvantage: "Analyse..." },
      sources: []
    };

    try {
      // --- LANCE LES SATELLITES (RECHERCHES) ---
      const queries = [
        `${p1} tennis profile ranking age height style`,
        `${p2} tennis profile ranking age height style`,
        `${p1} vs ${p2} h2h stats tennis`,
        `${p1} recent form last 10 matches injury`,
        `${p2} recent form last 10 matches injury`,
        `weather tennis forecast today`,
        `${p1} interview controversy news`,
        `${p2} interview controversy news`
      ];

      const responses = await Promise.all(
        queries.map(q => 
          fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) })
          .then(res => res.json())
        )
      );

      // --- REMPLISSAGE INTELLIGENT ---
      const [resP1, resP2, resH2H, resForm1, resForm2, resWeather, resPsy1, resPsy2] = responses;

      // Helper d'extraction
      const extract = (results: any, regex: RegExp, def: string = "Non trouvé (modifiable)") => {
          const txt = JSON.stringify(results || []).toLowerCase();
          const match = txt.match(regex);
          return match ? match[1] : def;
      };

      // 1. Profils
      dossier.profiles.p1.rank = extract(resP1.results, /rank[:\s]+(\d+)/, "100");
      dossier.profiles.p1.age = extract(resP1.results, /(\d{2})\s?years/, "25");
      dossier.profiles.p2.rank = extract(resP2.results, /rank[:\s]+(\d+)/, "100");
      dossier.profiles.p2.age = extract(resP2.results, /(\d{2})\s?years/, "25");

      // 2. H2H
      const txtH2H = JSON.stringify(resH2H.results || "");
      if (txtH2H.includes("Head-to-head")) {
          dossier.h2h.global = "Données trouvées (Voir source)";
          dossier.sources.push(resH2H.results[0].link);
      }

      // 3. Forme & Blessure
      if (JSON.stringify(resForm1.results).includes("injury")) dossier.profiles.p1.injury = "ALERTE WEB";
      if (JSON.stringify(resForm2.results).includes("injury")) dossier.profiles.p2.injury = "ALERTE WEB";

      // 4. Météo
      if (resWeather.results?.[0]) {
          dossier.conditions.weather = resWeather.results[0].snippet.substring(0, 30);
      }

      // 5. Synthèse Pré-Calculée
      dossier.synthesis.statAdvantage = parseInt(dossier.profiles.p1.rank) < parseInt(dossier.profiles.p2.rank) ? p1 : p2;

    } catch (e) { console.error("Erreur Dossier Engine", e); }

    return dossier;
  }
};
