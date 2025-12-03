import { GodModeReportV2, Match } from '../../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    // 1. Initialisation vide (Template V2)
    const report: GodModeReportV2 = {
      identity: {
        p1Name, p2Name, tournament, level: "Non trouvé (modifiable)", round: "Non trouvé (modifiable)", surface: "Non trouvé (modifiable)",
        location: "Non trouvé (modifiable)", dateTime: "Non trouvé (modifiable)", timezone: "UTC", importance: "Moyenne"
      },
      p1: createEmptyProfile(),
      p2: createEmptyProfile(),
      h2h: { total: "Non trouvé (modifiable)", surface: "-", sets: "-", games: "-", lastMatches: "-", analysis: "-" },
      conditions: { weather: "Non trouvé (modifiable)", temp: "-", wind: "-", humidity: "-", altitude: "-", advantage: "-" },
      bookmaker: { oddA: "-", oddB: "-", movement: "-", valueIndex: "-", trapIndex: "-", smartMoney: "-" },
      synthesis: { tech: "-", mental: "-", physical: "-", surface: "-", momentum: "-", xFactor: "-", risk: "-" }
    };

    try {
      // 2. Recherches Web Ciblées (Deep Search)
      const queries = [
        `${p1Name} tennis player profile ranking height weight age nationality`, // 0
        `${p2Name} tennis player profile ranking height weight age nationality`, // 1
        `${p1Name} vs ${p2Name} head to head tennis stats h2h`,                 // 2
        `${p1Name} recent form last matches tennis stats`,                      // 3
        `${p2Name} recent form last matches tennis stats`,                      // 4
        `weather forecast ${tournament} tennis`                                 // 5
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

      // 3. Parsing Intelligent des Résultats Google (Snippets)

      // -- Joueur 1 --
      const resP1 = responses[0]?.results || [];
      const textP1 = JSON.stringify(resP1).toLowerCase();
      report.p1.rank = extractRegex(textP1, /(?:rank|#)\s?(\d+)/) || "Non trouvé (modifiable)";
      report.p1.age = extractRegex(textP1, /(\d{2})\s?years/) || "Non trouvé (modifiable)";
      report.p1.height = extractRegex(textP1, /(\d\.\d{2})\s?m/) || "Non trouvé (modifiable)";
      report.p1.nationality = extractRegex(textP1, /national(?:ity)?\s?:?\s?(\w+)/) || "Non trouvé (modifiable)";
      
      // -- Joueur 2 --
      const resP2 = responses[1]?.results || [];
      const textP2 = JSON.stringify(resP2).toLowerCase();
      report.p2.rank = extractRegex(textP2, /(?:rank|#)\s?(\d+)/) || "Non trouvé (modifiable)";
      report.p2.age = extractRegex(textP2, /(\d{2})\s?years/) || "Non trouvé (modifiable)";
      report.p2.height = extractRegex(textP2, /(\d\.\d{2})\s?m/) || "Non trouvé (modifiable)";
      
      // -- H2H --
      const resH2H = responses[2]?.results || [];
      if (resH2H.length > 0) {
          report.h2h.lastMatches = resH2H[0].title + " : " + resH2H[0].snippet;
          report.h2h.analysis = "Voir sources pour détail.";
      }

      // -- Forme Récente --
      const resForm1 = responses[3]?.results || [];
      if (resForm1.length > 0) report.p1.last5 = resForm1[0].snippet.substring(0, 100) + "...";
      
      const resForm2 = responses[4]?.results || [];
      if (resForm2.length > 0) report.p2.last5 = resForm2[0].snippet.substring(0, 100) + "...";

      // -- Météo --
      const resWeather = responses[5]?.results || [];
      if (resWeather.length > 0) {
          const wText = resWeather[0].snippet;
          if (wText.match(/\d+/)) {
              report.conditions.weather = wText.substring(0, 80);
          }
      }

    } catch (e) {
      console.error("Erreur GodEngine V2", e);
    }

    return report;
  }
};

function createEmptyProfile() {
    return { 
        rank: "Non trouvé (modifiable)", bestRank: "Non trouvé (modifiable)", age: "-", height: "-", weight: "-", nationality: "-", 
        style: "-", hand: "-", winrateCareer: "-", winrateSeason: "-", winrateSurface: "-", 
        aces: "-", doubleFaults: "-", serveStats: "-", returnStats: "-", 
        form: "-", injuries: "R.A.S", instagram: "-", twitter: "-", motivation: "Moyenne", fatigue: "Faible", last5: "-" 
    };
}

function extractRegex(text: string, regex: RegExp): string | null {
    const match = text.match(regex);
    return match ? match[1] : null;
}
