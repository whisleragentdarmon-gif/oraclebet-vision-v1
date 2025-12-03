import { GodModeReportV2, Match } from '../../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    // 1. Initialisation conforme au nouveau Type
    const report: GodModeReportV2 = {
      identity: {
        p1Name, p2Name, tournament, surface: "Non trouvé", date: "Aujourd'hui"
      },
      p1: createEmptyStats(),
      p2: createEmptyStats(),
      h2h: { global: "-", surface: "-", advantage: "-", total: "-", sets: "-", games: "-", lastMatches: "-", analysis: "-" },
      conditions: { weather: "-", temp: "-", wind: "-", altitude: "-", humidity: "-", advantage: "-" },
      bookmaker: { oddA: "-", oddB: "-", movement: "-", valueIndex: "-", trapIndex: "-", smartMoney: "-" },
      synthesis: { tech: "-", mental: "-", physical: "-", surface: "-", momentum: "-", xFactor: "-", risk: "-" }
    };

    try {
      const queries = [
        `${p1Name} tennis profile ranking winrate`,
        `${p2Name} tennis profile ranking winrate`,
        `${p1Name} vs ${p2Name} h2h stats tennis prediction`,
        `weather ${tournament} tennis`
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
      const textP1 = JSON.stringify(resP1).toLowerCase();
      report.p1.rank = extract(textP1, /(?:rank|#)\s?(\d+)/) || "-";
      // On combine Age et Taille pour le tableau
      const age = extract(textP1, /(\d{2})\s?years/) || "?";
      const height = extract(textP1, /(\d\.\d{2})/) || "?";
      report.p1.ageHeight = `${age} ans / ${height}m`;
      
      report.p1.nationality = extract(textP1, /nationality\s?(\w+)/) || "-";
      const p1Percents = textP1.match(/(\d{2})%/g);
      if (p1Percents) {
          report.p1.winrateSeason = p1Percents[0] || "-";
          report.p1.firstServe = p1Percents[1] || "-"; // Affectation correcte
      }

      // Parsing P2
      const resP2 = responses[1]?.results || [];
      const textP2 = JSON.stringify(resP2).toLowerCase();
      report.p2.rank = extract(textP2, /(?:rank|#)\s?(\d+)/) || "-";
      const age2 = extract(textP2, /(\d{2})\s?years/) || "?";
      const height2 = extract(textP2, /(\d\.\d{2})/) || "?";
      report.p2.ageHeight = `${age2} ans / ${height2}m`;
      
      report.p2.nationality = extract(textP2, /nationality\s?(\w+)/) || "-";
      const p2Percents = textP2.match(/(\d{2})%/g);
      if (p2Percents) {
          report.p2.winrateSeason = p2Percents[0] || "-";
          report.p2.firstServe = p2Percents[1] || "-";
      }

      // Parsing H2H & Météo
      const resH2H = responses[2]?.results || [];
      const textH2H = JSON.stringify(resH2H).toLowerCase();
      const h2hScore = textH2H.match(/(\d+)\s?-\s?(\d+)/);
      if (h2hScore) report.h2h.global = `${h2hScore[1]} - ${h2hScore[2]}`;

      const resWeather = responses[3]?.results || [];
      if (resWeather.length > 0) {
          report.conditions.weather = resWeather[0].snippet.substring(0, 50);
      }

    } catch (e) {
      console.error("Erreur GodEngine V2", e);
    }

    return report;
  }
};

function createEmptyStats() {
    return {
        rank: "N/A", bestRank: "-", ageHeight: "- / -", nationality: "-", hand: "-",
        winrateCareer: "-", winrateSeason: "-", winrateSurface: "-",
        aces: "-", doubleFaults: "-", firstServe: "-",
        style: "-", form: "-", injury: "R.A.S", motivation: "-", last5: "-"
    };
}

function extract(text: string, regex: RegExp): string | null {
    const match = text.match(regex);
    return match ? match[1] : null;
}
