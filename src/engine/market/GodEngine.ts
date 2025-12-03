import { GodModeReportV2, Match } from '../../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    // 1. Initialisation (Valeurs par défaut propres)
    const report: GodModeReportV2 = {
      identity: {
        p1Name, p2Name, tournament, surface: "Non trouvé", date: "Aujourd'hui"
      },
      p1: createEmptyStats(),
      p2: createEmptyStats(),
      h2h: { global: "-", surface: "-", advantage: "-" },
      conditions: { weather: "-", temp: "-", wind: "-", altitude: "-" },
      synthesis: { tech: "-", mental: "-", physical: "-", surface: "-", momentum: "-", xFactor: "-" }
    };

    try {
      // 2. Recherches Ciblées (3 flux parallèles)
      const queries = [
        // Profil & Stats P1
        `${p1Name} tennis profile ranking winrate aces stats`,
        // Profil & Stats P2
        `${p2Name} tennis profile ranking winrate aces stats`,
        // H2H & Contexte
        `${p1Name} vs ${p2Name} h2h tennis stats prediction weather ${tournament}`
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

      // 3. Parsing P1
      const resP1 = responses[0]?.results || [];
      const textP1 = JSON.stringify(resP1).toLowerCase();
      report.p1.rank = extract(textP1, /(?:rank|#)\s?(\d+)/) || "-";
      report.p1.ageHeight = `${extract(textP1, /(\d{2})\s?years/) || "? ans"} / ${extract(textP1, /(\d\.\d{2})/) || "? m"}`;
      report.p1.nationality = extract(textP1, /nationality\s?(\w+)/) || "-";
      // On cherche des pourcentages pour les winrates
      const p1Percents = textP1.match(/(\d{2})%/g);
      if (p1Percents) {
          report.p1.winrateSeason = p1Percents[0] || "-";
          report.p1.firstServe = p1Percents[1] || "-";
      }

      // 4. Parsing P2
      const resP2 = responses[1]?.results || [];
      const textP2 = JSON.stringify(resP2).toLowerCase();
      report.p2.rank = extract(textP2, /(?:rank|#)\s?(\d+)/) || "-";
      report.p2.ageHeight = `${extract(textP2, /(\d{2})\s?years/) || "? ans"} / ${extract(textP2, /(\d\.\d{2})/) || "? m"}`;
      report.p2.nationality = extract(textP2, /nationality\s?(\w+)/) || "-";
      const p2Percents = textP2.match(/(\d{2})%/g);
      if (p2Percents) {
          report.p2.winrateSeason = p2Percents[0] || "-";
          report.p2.firstServe = p2Percents[1] || "-";
      }

      // 5. Parsing H2H & Conditions
      const resH2H = responses[2]?.results || [];
      const textH2H = JSON.stringify(resH2H).toLowerCase();
      
      // H2H score (ex: 3-1)
      const h2hScore = textH2H.match(/(\d+)\s?-\s?(\d+)/);
      if (h2hScore) report.h2h.global = `${h2hScore[1]} - ${h2hScore[2]}`;
      else report.h2h.global = "0 - 0";

      // Météo
      if (textH2H.includes('rain')) report.conditions.weather = "Pluie";
      else if (textH2H.includes('sunny')) report.conditions.weather = "Ensoleillé";
      else if (textH2H.includes('cloud')) report.conditions.weather = "Nuageux";

      // Altitude (Déduction simple)
      if (tournament.toLowerCase().includes('bogota') || tournament.toLowerCase().includes('gstaad')) {
          report.conditions.altitude = "Haute";
      } else {
          report.conditions.altitude = "Basse";
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
        style: "-", form: "-", injury: "R.A.S", motivation: "-"
    };
}

function extract(text: string, regex: RegExp): string | null {
    const match = text.match(regex);
    return match ? match[1] : null;
}
