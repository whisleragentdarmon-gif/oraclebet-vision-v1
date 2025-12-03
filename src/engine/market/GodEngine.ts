import { GodModeReport, Match } from '../../types';

export const GodEngine = {
  generateReport: async (match: Match): Promise<GodModeReport> => {
    const p1 = match.player1.name;
    const p2 = match.player2.name;

    // 1. Initialisation du tableau vide (Template)
    const report: GodModeReport = {
      identity: {
        p1, p2, tournament: match.tournament, category: "ATP/WTA/Challenger", surface: match.surface, format: "Bo3", time: match.time
      },
      playerA: createEmptyProfile(),
      playerB: createEmptyProfile(),
      h2h: { global: "Non trouvé", surface: "Non trouvé", sets: "-", games: "-", context: "Analyse requise", styleMatchup: "À définir" },
      conditions: { weather: "Recherche...", temp: "-", wind: "-", humidity: "-", altitude: "-", speed: "-", indoor: "-", advantage: "-" },
      momentum: { p1: createEmptyMomentum(), p2: createEmptyMomentum() },
      bookmaker: { oddA: match.odds.p1.toString(), oddB: match.odds.p2.toString(), value: "Analyse en cours", movement: "Stable", trap: "Non", volume: "Inconnu" },
      psychology: { p1: "Non déterminé", p2: "Non déterminé" },
      synthesis: { stat: "-", mental: "-", physical: "-", surface: "-", momentum: "-" },
      prediction: { probA: "-", probB: "-", probOver: "-", probTieBreak: "-", probUpset: "-", risk: "-", recoWinner: "-", recoOver: "-", recoSet: "-" }
    };

    try {
      // 2. Lancement des Agents de Recherche
      const queries = [
        `${p1} tennis player profile ranking height age style`, // 0
        `${p2} tennis player profile ranking height age style`, // 1
        `${p1} vs ${p2} h2h stats tennis head to head`,        // 2
        `weather ${match.tournament} tennis forecast`,         // 3
        `${p1} recent form last matches tennis`,               // 4
        `${p2} recent form last matches tennis`                // 5
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

      // 3. Remplissage Automatique (Parsing basique des résultats)
      
      // -- Joueur A --
      const resP1 = responses[0]?.results || [];
      if (resP1.length > 0) {
          const text = JSON.stringify(resP1).toLowerCase();
          report.playerA.rank = text.match(/rank[:\s]+(\d+)/)?.[1] || "Non trouvé";
          report.playerA.age = text.match(/(\d{2})\s?years/)?.[1] || "Non trouvé";
          report.playerA.height = text.match(/(\d\.\d{2})\s?m/)?.[1] || "Non trouvé";
      }

      // -- Joueur B --
      const resP2 = responses[1]?.results || [];
      if (resP2.length > 0) {
          const text = JSON.stringify(resP2).toLowerCase();
          report.playerB.rank = text.match(/rank[:\s]+(\d+)/)?.[1] || "Non trouvé";
          report.playerB.age = text.match(/(\d{2})\s?years/)?.[1] || "Non trouvé";
      }

      // -- H2H --
      const resH2H = responses[2]?.results || [];
      if (resH2H.length > 0) {
          report.h2h.context = `Sources trouvées: ${resH2H[0].title}`;
          // Ici on extrait sommairement
          if (JSON.stringify(resH2H).includes(p1)) report.h2h.global = "Données disponibles via source";
      }

      // -- Météo --
      const resWeather = responses[3]?.results || [];
      if (resWeather.length > 0) {
          report.conditions.weather = resWeather[0].snippet;
      }

      // -- Synthèse Pré-calculée --
      report.synthesis.surface = `Avantage ${match.surface === 'Clay' ? 'Terre' : 'Dur'}`;
      report.prediction.recoWinner = match.ai?.recommendedBet || "À définir";

    } catch (e) {
      console.error("Erreur GodEngine", e);
    }

    return report;
  }
};

function createEmptyProfile() {
    return { rank: "Non trouvé", bestRank: "Non trouvé", age: "-", height: "-", style: "Modifiable", hand: "D", strength: "-", weakness: "-", injury: "Non", form: "5/10", matchesCount: "-", timeOnCourt: "-", winSeason: "-", winCareer: "-", winSurface: "-", tieBreak: "-", vsTop10: "-", motivation: "-", social: "-" };
}

function createEmptyMomentum() {
    return { last5: "V-D-V...", results: "-", fatigue: "Moyenne", pointsToDefend: "-", motivation: "Haute" };
}
