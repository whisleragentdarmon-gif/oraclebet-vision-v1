import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    const report: GodModeReportV2 = {
      identity: {
        p1Name, p2Name, tournament, surface: "Dur", date: new Date().toLocaleDateString('fr-FR'),
        round: "Qualification", city: "Non trouvé", timezone: "UTC", 
        importanceP1: "Moyenne", importanceP2: "Moyenne", enjeu: "Points"
      },
      p1: createEmptyProfile(),
      p2: createEmptyProfile(),
      h2h: { 
        global: "0 - 0", surface: "0 - 0", advantage: "Neutre", lastMatches: "-", trend: "Neutre", analysis: "-" 
      },
      conditions: { 
        weather: "Non trouvé", temp: "-", wind: "-", humidity: "-", 
        courtSpeed: "Moyen", ballType: "Standard", fatigueImpact: "Faible",
        altitude: "-", advantage: "-"
      },
      bookmaker: { 
        oddA: "-", oddB: "-", spread: "-", movement: "Stable", 
        smartMoney: "Non", valueIndex: "0", trapIndex: "Non",
        specialOdds: [] 
      },
      factors: [],
      synthesis: {
        tech: "-", mental: "-", physical: "-", surface: "-", momentum: "-", xFactor: "-", risk: "-"
      },
      prediction: { 
        winner: "-", score: "-", duration: "-", volatility: "-", confidence: "-", 
        bestBet: "-", avoidBet: "-", altBet: "-",
        probA: "-", probB: "-", probOver: "-", probTieBreak: "-", probUpset: "-", risk: "-", recoWinner: "-", recoOver: "-", recoSet: "-"
      }
    };

    try {
      console.log("🔍 God Mode lancé - Recherche intensive...");

      // 20+ REQUÊTES CIBLÉES
      const queries = [
        // PROFILS
        { key: 'p1Profile', q: `${p1Name} tennis ranking current 2024 2025 WTA ATP` },
        { key: 'p2Profile', q: `${p2Name} tennis ranking current 2024 2025 WTA ATP` },
        { key: 'p1Stats', q: `${p1Name} tennis stats ace percentage first serve` },
        { key: 'p2Stats', q: `${p2Name} tennis stats ace percentage first serve` },
        
        // RÉSULTATS RÉCENTS
        { key: 'p1Recent', q: `${p1Name} tennis results wins losses 2024 2025` },
        { key: 'p2Recent', q: `${p2Name} tennis results wins losses 2024 2025` },
        { key: 'p1Injury', q: `${p1Name} tennis injury blessure status 2024` },
        { key: 'p2Injury', q: `${p2Name} tennis injury blessure status 2024` },
        
        // H2H ET COMPARAISONS
        { key: 'h2h', q: `${p1Name} vs ${p2Name} head to head matches history` },
        { key: 'h2hSurface', q: `${p1Name} vs ${p2Name} hard court dur` },
        { key: 'p1vsMains', q: `${p1Name} performance right-handers left-handers` },
        { key: 'p2vsMains', q: `${p2Name} performance right-handers left-handers` },
        
        // SURFACES ET STYLES
        { key: 'p1Surface', q: `${p1Name} tennis hard court performance` },
        { key: 'p2Surface', q: `${p2Name} tennis hard court performance` },
        { key: 'p1Style', q: `${p1Name} tennis playing style aggressive defensive` },
        { key: 'p2Style', q: `${p2Name} tennis playing style aggressive defensive` },
        
        // CONTEXTE
        { key: 'weather', q: `weather ${tournament} temperature wind humidity forecast` },
        { key: 'odds', q: `${p1Name} vs ${p2Name} tennis odds betting` },
        { key: 'p1News', q: `${p1Name} tennis news 2024 2025` },
        { key: 'p2News', q: `${p2Name} tennis news 2024 2025` },
      ];

      // Requêtes parallèles
      const responses = await Promise.all(
        queries.map(({ q }) =>
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
          }).then(r => r.json()).catch(() => ({ results: [] }))
        )
      );

      // MAP DES RÉSULTATS
      const data: any = {};
      responses.forEach((res: any, i) => {
        data[queries[i].key] = res?.results || [];
      });

      // ===== PARSING P1 =====
      if (data.p1Profile.length > 0) {
        const text = data.p1Profile.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.rank = extractNumber(text, /(?:rank|classement|#)?(\d+)/i) || "100+";
        report.p1.bestRank = extractNumber(text, /(?:career high|meilleur)[\s:]*(?:#)?(\d+)/i) || "-";
        
        const ageMatch = text.match(/(?:age|born|né)[\s:]*(\d{1,2})/i);
        const heightVal = extractNumber(text, /(\d{3})cm|(\d{5,6})ft/i);
        report.p1.ageHeight = (ageMatch || heightVal) ? `${ageMatch ? ageMatch[1] : "-"} / ${heightVal || "-"}` : "- / -";
        report.p1.nationality = extractText(text, /(?:from|nationality)[\s:]*([A-Za-z\s]{2,20})/i) || "-";
        report.p1.hand = includes(text, ["right", "droitiere"]) ? "Droitière" : includes(text, ["left", "gauche"]) ? "Gauchère" : "-";
        report.p1.style = includes(text, ["aggressive"]) ? "Offensive" : includes(text, ["defensive"]) ? "Défensive" : "Mixte";
      }

      if (data.p1Stats.length > 0) {
        const text = data.p1Stats.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.aces = extractNumber(text, /(?:aces)[\s:]*(\d+)/i) || "-";
        report.p1.firstServe = extractNumber(text, /(?:first serve)[\s:]*(\d+)/i) ? (extractNumber(text, /(?:first serve)[\s:]*(\d+)/i) + "%") : "-";
      }

      if (data.p1Recent.length > 0) {
        const text = data.p1Recent.map((r: any) => r.snippet).join(' ');
        const wCount = (text.match(/won|victoire|win|defeated/gi) || []).length;
        const lCount = (text.match(/lost|loss|defeat|perte/gi) || []).length;
        report.p1.winrateSeason = wCount > 0 ? `${wCount}-${lCount}` : "-";
        report.p1.last5 = text.substring(0, 100);
      }

      if (data.p1Injury.length > 0) {
        const text = data.p1Injury.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.injury = includes(text, ["no injury", "pas blessure", "fit", "healthy"]) ? "Non" : "Oui";
      }

      if (data.p1Surface.length > 0) {
        const text = data.p1Surface.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.winrateSurface = extractNumber(text, /(?:hard court|dur)[\s:]*(\d+)%/i) ? (extractNumber(text, /(?:hard court|dur)[\s:]*(\d+)%/i) + "%") : "-";
      }

      if (data.p1Style.length > 0) {
        const text = data.p1Style.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.style = includes(text, ["aggressive", "powerful"]) ? "Offensive" : includes(text, ["defensive", "solid"]) ? "Défensive" : "Mixte";
      }

      // ===== PARSING P2 (identique) =====
      if (data.p2Profile.length > 0) {
        const text = data.p2Profile.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.rank = extractNumber(text, /(?:rank|classement|#)?(\d+)/i) || "100+";
        report.p2.bestRank = extractNumber(text, /(?:career high|meilleur)[\s:]*(?:#)?(\d+)/i) || "-";
        
        const ageMatch = text.match(/(?:age|born|né)[\s:]*(\d{1,2})/i);
        const heightVal = extractNumber(text, /(\d{3})cm|(\d{5,6})ft/i);
        report.p2.ageHeight = (ageMatch || heightVal) ? `${ageMatch ? ageMatch[1] : "-"} / ${heightVal || "-"}` : "- / -";
        report.p2.nationality = extractText(text, /(?:from|nationality)[\s:]*([A-Za-z\s]{2,20})/i) || "-";
        report.p2.hand = includes(text, ["right", "droitiere"]) ? "Droitière" : includes(text, ["left", "gauche"]) ? "Gauchère" : "-";
        report.p2.style = includes(text, ["aggressive"]) ? "Offensive" : includes(text, ["defensive"]) ? "Défensive" : "Mixte";
      }

      if (data.p2Stats.length > 0) {
        const text = data.p2Stats.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.aces = extractNumber(text, /(?:aces)[\s:]*(\d+)/i) || "-";
        report.p2.firstServe = extractNumber(text, /(?:first serve)[\s:]*(\d+)/i) ? (extractNumber(text, /(?:first serve)[\s:]*(\d+)/i) + "%") : "-";
      }

      if (data.p2Recent.length > 0) {
        const text = data.p2Recent.map((r: any) => r.snippet).join(' ');
        const wCount = (text.match(/won|victoire|win|defeated/gi) || []).length;
        const lCount = (text.match(/lost|loss|defeat|perte/gi) || []).length;
        report.p2.winrateSeason = wCount > 0 ? `${wCount}-${lCount}` : "-";
        report.p2.last5 = text.substring(0, 100);
      }

      if (data.p2Injury.length > 0) {
        const text = data.p2Injury.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.injury = includes(text, ["no injury", "pas blessure", "fit"]) ? "Non" : "Oui";
      }

      if (data.p2Surface.length > 0) {
        const text = data.p2Surface.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.winrateSurface = extractNumber(text, /(?:hard court|dur)[\s:]*(\d+)%/i) ? (extractNumber(text, /(?:hard court|dur)[\s:]*(\d+)%/i) + "%") : "-";
      }

      // H2H
      if (data.h2h.length > 0) {
        const text = data.h2h.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = text.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.global = `${scoreMatch[1]} - ${scoreMatch[2]}`;
          report.h2h.advantage = parseInt(scoreMatch[1]) > parseInt(scoreMatch[2]) ? p1Name : p2Name;
        }
        report.h2h.trend = includes(text, ["won the last", "remporté les"]) ? p1Name : "Équilibré";
        report.h2h.analysis = includes(text, ["first time", "première fois"]) ? "Première rencontre" : "Rencontre connue";
      }

      // MÉTÉO
      if (data.weather.length > 0) {
        const text = data.weather.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.conditions.weather = includes(text, ["sunny", "ensoleillé"]) ? "Ensoleillé" :
                                   includes(text, ["rainy", "pluie"]) ? "Pluvieux" : "Nuageux";
        report.conditions.temp = extractNumber(text, /(\d+)°/i) ? (extractNumber(text, /(\d+)°/i) + "°C") : "-";
        report.conditions.wind = includes(text, ["wind", "vent"]) ? "Modéré" : "Faible";
        report.conditions.humidity = extractNumber(text, /(\d+)%/i) ? (extractNumber(text, /(\d+)%/i) + "%") : "-";
      }

      // COTES
      if (data.odds.length > 0) {
        const text = data.odds.map((r: any) => r.snippet).join(' ');
        const oddsMatch = text.match(/(\d\.\d{2})\s*vs\s*(\d\.\d{2})/);
        if (oddsMatch) {
          report.bookmaker.oddA = oddsMatch[1];
          report.bookmaker.oddB = oddsMatch[2];
        }
      }

      console.log("✅ God Mode terminé - Données enrichies!");
      
    } catch (e) {
      console.error("❌ Erreur God Mode:", e);
    }

    return report;
  }
};

// ========== FONCTIONS UTILITAIRES ==========

function createEmptyProfile() {
  return {
    rank: "-",
    bestRank: "-",
    ageHeight: "- / -",
    nationality: "-",
    hand: "-",
    style: "-",
    winrateCareer: "-",
    winrateSeason: "-",
    winrateSurface: "-",
    aces: "-",
    doubleFaults: "-",
    firstServe: "-",
    form: "-",
    confidence: "-",
    injury: "Non",
    fatigue: "Faible",
    lastMatchDate: "-",
    serveStats: "-",
    returnStats: "-",
    motivation: "-",
    social: "-",
    last5: "-"
  };
}

function extractNumber(text: string, regex: RegExp): string | null {
  const match = text.match(regex);
  return match ? match[1] : null;
}

function extractText(text: string, regex: RegExp): string | null {
  const match = text.match(regex);
  return match ? match[1] : null;
}

function includes(text: string, keywords: string[]): boolean {
  return keywords.some(k => text.includes(k.toLowerCase()));
}
