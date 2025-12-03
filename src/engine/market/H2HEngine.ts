import { GodModeReportV2 } from '../../types'; // On utilise le type V2

export const H2HEngine = {
  // On change le type de retour pour qu'il corresponde au nouveau standard
  fetchFullProfile: async (p1: string, p2: string, tournament: string): Promise<GodModeReportV2> => {
    
    // 1. Initialisation du Template V2 (Le même que GodEngine)
    const report: GodModeReportV2 = {
      identity: {
        p1Name: p1, p2Name: p2, tournament, surface: "Non trouvé", date: "Aujourd'hui",
        level: "-", round: "-", location: "-", dateTime: "-", timezone: "-", importance: "-"
      },
      p1: createEmptyStats(),
      p2: createEmptyStats(),
      h2h: { global: "-", surface: "-", advantage: "-", total: "-", sets: "-", games: "-", lastMatches: "-", analysis: "-" },
      conditions: { weather: "-", temp: "-", wind: "-", altitude: "-", humidity: "-", advantage: "-", speed: "-", indoor: "-" },
      bookmaker: { oddA: "-", oddB: "-", movement: "-", valueIndex: "-", trapIndex: "-", smartMoney: "-" },
      synthesis: { tech: "-", mental: "-", physical: "-", surface: "-", momentum: "-", xFactor: "-", risk: "-" }
    };

    try {
      const queries = [
        `${p1} tennis profile ranking height`,
        `${p2} tennis profile ranking height`,
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

      // --- Parsing Simplifié pour V2 ---

      // Joueur 1
      const resP1 = responses[0]?.results || [];
      const textP1 = JSON.stringify(resP1).toLowerCase();
      report.p1.rank = extract(textP1, /(?:rank|#)\s?(\d+)/) || "Non trouvé";
      report.p1.ageHeight = extract(textP1, /(\d{2})\s?years/) + " ans / " + (extract(textP1, /(\d\.\d{2})/) || "?") + "m";
      
      // Joueur 2
      const resP2 = responses[1]?.results || [];
      const textP2 = JSON.stringify(resP2).toLowerCase();
      report.p2.rank = extract(textP2, /(?:rank|#)\s?(\d+)/) || "Non trouvé";
      report.p2.ageHeight = extract(textP2, /(\d{2})\s?years/) + " ans / " + (extract(textP2, /(\d\.\d{2})/) || "?") + "m";

      // H2H
      const resH2H = responses[2]?.results || [];
      if (resH2H.length > 0) {
          report.h2h.global = "Voir sources";
          report.h2h.lastMatches = resH2H[0].title;
      }

      // Météo
      const resWeather = responses[3]?.results || [];
      if (resWeather.length > 0) {
          report.conditions.weather = resWeather[0].snippet.substring(0, 50);
      }

    } catch (e) {
      console.error("Erreur H2HEngine", e);
    }

    return report;
  }
};

// Helpers V2
function createEmptyStats() {
    return {
        rank: "N/A", bestRank: "-", ageHeight: "- / -", nationality: "-", hand: "-",
        winrateCareer: "-", winrateSeason: "-", winrateSurface: "-",
        aces: "-", doubleFaults: "-", firstServe: "-",
        style: "-", form: "-", injury: "R.A.S", motivation: "-", last5: "-",
        age: "-", height: "-", weight: "-", serveStats: "-", returnStats: "-", injuries: "-", instagram: "-", twitter: "-"
    };
}

function extract(text: string, regex: RegExp): string | null {
    const match = text.match(regex);
    return match ? match[1] : null;
}
