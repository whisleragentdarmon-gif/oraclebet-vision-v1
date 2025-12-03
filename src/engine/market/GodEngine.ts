import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    console.log(`🔥 God Mode ULTRA lancé pour ${p1Name} vs ${p2Name}...`);

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
      // 30+ REQUÊTES ULTRA-SPÉCIFIQUES
      const queries = [
        // PROFILS DE BASE (4)
        `${p1Name} tennis ATP WTA ranking classement 2024`,
        `${p2Name} tennis ATP WTA ranking classement 2024`,
        `${p1Name} tennis profil born age taille nationality`,
        `${p2Name} tennis profil born age taille nationality`,
        
        // STATS DÉTAILLÉES (6)
        `${p1Name} tennis average sets won break point hold percentage`,
        `${p2Name} tennis average sets won break point hold percentage`,
        `${p1Name} tennis tiebreak percentage first set win rate`,
        `${p2Name} tennis tiebreak percentage first set win rate`,
        `${p1Name} tennis aces double faults service stats`,
        `${p2Name} tennis aces double faults service stats`,
        
        // MAIN & STYLE (4)
        `${p1Name} tennis right handed left handed main playing style`,
        `${p2Name} tennis right handed left handed main playing style`,
        `${p1Name} tennis aggressive baseline serve volley style`,
        `${p2Name} tennis aggressive baseline serve volley style`,
        
        // H2H DÉTAILLÉ (6)
        `${p1Name} vs ${p2Name} h2h head to head complete record history`,
        `${p1Name} vs ${p2Name} hard court surface record`,
        `${p1Name} vs ${p2Name} recent matches 2024 2023 results`,
        `${p1Name} vs ${p2Name} statistics who leads advantage`,
        `${p1Name} vs ${p2Name} first time meeting premiere rencontre`,
        `${p1Name} vs ${p2Name} tiebreak record TB percentage`,
        
        // RÉSULTATS RÉCENTS (6)
        `${p1Name} tennis results 2024 wins losses last 10 matches`,
        `${p2Name} tennis results 2024 wins losses last 10 matches`,
        `${p1Name} tennis form streak momentum recent tournament`,
        `${p2Name} tennis form streak momentum recent tournament`,
        `${p1Name} tennis calendar upcoming tournaments 2024 2025`,
        `${p2Name} tennis calendar upcoming tournaments 2024 2025`,
        
        // PSYCHOLOGIE & PERFORMANCE (4)
        `${p1Name} tennis come back after loss pressure handling`,
        `${p2Name} tennis come back after loss pressure handling`,
        `${p1Name} tennis Grand Slam performance vs WTA 1000 vs Challenger`,
        `${p2Name} tennis Grand Slam performance vs WTA 1000 vs Challenger`,
        
        // CONTEXTE MATCH (2)
        `${tournament} ${p1Name} ${p2Name} betting odds cotes`,
        `weather ${tournament} temperature wind humidity forecast`
      ];

      // Envoyer toutes les requêtes
      const responses = await Promise.all(
        queries.map(q =>
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
          })
            .then(r => r.json())
            .then(data => ({ results: data.results || [], query: q }))
            .catch(e => {
              console.error(`❌ Erreur "${q}":`, e.message);
              return { results: [], query: q };
            })
        )
      );

      console.log(`📊 ${responses.length} requêtes complétées`);

      // Parser P1
      if (responses[0].results.length > 0) {
        const text = responses[0].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.rank = extractRank(text) || "1147";
        report.p1.bestRank = extractBestRank(text) || "-";
      }

      if (responses[2].results.length > 0) {
        const text = responses[2].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.ageHeight = extractAge(text) || "- / -";
        report.p1.nationality = extractNationality(text) || "-";
      }

      if (responses[4].results.length > 0) {
        const text = responses[4].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.avgSets = extractAvgSets(text) || "-";
        report.p1.winrateSeason = extractWinrate(text) || "-";
      }

      if (responses[6].results.length > 0) {
        const text = responses[6].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.tbPercent = extractTB(text) || "-";
        report.p1.firstSetWin = extractFirstSet(text) || "-";
      }

      if (responses[8].results.length > 0) {
        const text = responses[8].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.aces = extractAces(text) || "-";
        report.p1.doubleFaults = extractDoubleFaults(text) || "-";
      }

      if (responses[10].results.length > 0) {
        const text = responses[10].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.hand = extractHand(text) || "-";
      }

      if (responses[12].results.length > 0) {
        const text = responses[12].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.style = extractStyle(text) || "Mixte";
      }

      if (responses[18].results.length > 0) {
        const text = responses[18].results.map((r: any) => r.snippet).join(' ');
        report.p1.last5 = extractLast5(text) || "-";
      }

      if (responses[20].results.length > 0) {
        const text = responses[20].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.trend = extractTrend(text) || "-";
      }

      if (responses[22].results.length > 0) {
        const text = responses[22].results.map((r: any) => r.snippet).join(' ');
        extractCalendar(text, report.p1);
      }

      if (responses[24].results.length > 0) {
        const text = responses[24].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.afterLoss = text.includes("win after loss") ? "Bonne" : text.includes("struggle") ? "Difficile" : "-";
        report.p1.pressureHandling = text.includes("pressure") ? "Bonne" : "-";
      }

      if (responses[26].results.length > 0) {
        const text = responses[26].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p1.grandSlams = extractPercentage(text, "grand slam") || "-";
        report.p1.wta1000 = extractPercentage(text, "wta 1000") || "-";
      }

      // Parser P2 (identique)
      if (responses[1].results.length > 0) {
        const text = responses[1].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.rank = extractRank(text) || "100+";
        report.p2.bestRank = extractBestRank(text) || "-";
      }

      if (responses[3].results.length > 0) {
        const text = responses[3].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.ageHeight = extractAge(text) || "- / -";
        report.p2.nationality = extractNationality(text) || "-";
      }

      if (responses[5].results.length > 0) {
        const text = responses[5].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.avgSets = extractAvgSets(text) || "-";
        report.p2.winrateSeason = extractWinrate(text) || "-";
      }

      if (responses[7].results.length > 0) {
        const text = responses[7].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.tbPercent = extractTB(text) || "-";
        report.p2.firstSetWin = extractFirstSet(text) || "-";
      }

      if (responses[9].results.length > 0) {
        const text = responses[9].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.aces = extractAces(text) || "-";
        report.p2.doubleFaults = extractDoubleFaults(text) || "-";
      }

      if (responses[11].results.length > 0) {
        const text = responses[11].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.hand = extractHand(text) || "-";
      }

      if (responses[13].results.length > 0) {
        const text = responses[13].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.style = extractStyle(text) || "Mixte";
      }

      if (responses[19].results.length > 0) {
        const text = responses[19].results.map((r: any) => r.snippet).join(' ');
        report.p2.last5 = extractLast5(text) || "-";
      }

      if (responses[21].results.length > 0) {
        const text = responses[21].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.p2.trend = extractTrend(text) || "-";
      }

      if (responses[23].results.length > 0) {
        const text = responses[23].results.map((r: any) => r.snippet).join(' ');
        extractCalendar(text, report.p2);
      }

      // H2H
      if (responses[14].results.length > 0) {
        const text = responses[14].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = text.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.global = `${scoreMatch[1]} - ${scoreMatch[2]}`;
          report.h2h.advantage = parseInt(scoreMatch[1]) > parseInt(scoreMatch[2]) ? p1Name : p2Name;
        }
        report.h2h.analysis = text.includes("first time") || text.includes("première fois") ? "Première rencontre" : "Rencontre connue";
      }

      if (responses[15].results.length > 0) {
        const text = responses[15].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = text.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.surface = `${scoreMatch[1]} - ${scoreMatch[2]}`;
        }
      }

      if (responses[17].results.length > 0) {
        const text = responses[17].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.h2h.trend = extractLeader(text, p1Name) || "Équilibré";
      }

      // Météo
      if (responses[28].results.length > 0) {
        const text = responses[28].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.conditions.weather = extractWeather(text);
        report.conditions.temp = extractTemp(text) || "-";
        report.conditions.wind = extractWind(text) || "-";
        report.conditions.humidity = extractHumidity(text) || "-";
      }

      console.log("✅ God Mode ULTRA COMPLET!");
      
    } catch (e) {
      console.error("❌ Erreur God Mode:", e);
    }

    return report;
  }
};

// ========== FONCTIONS D'EXTRACTION ULTRA ==========

function extractRank(text: string): string | null {
  const m = text.match(/(?:rank|classement|#)\s*(?:no\.?\s*)?(\d+)/i);
  return m ? m[1] : null;
}

function extractBestRank(text: string): string | null {
  const m = text.match(/(?:career high|meilleur|best rank)\s*(?:no\.?\s*)?(\d+)/i);
  return m ? m[1] : null;
}

function extractAge(text: string): string {
  const m = text.match(/(?:born|né)\s*(?:in\s*)?(\d{4})/i);
  if (m) {
    const age = new Date().getFullYear() - parseInt(m[1]);
    return age > 0 ? `${age} / -` : "- / -";
  }
  return "- / -";
}

function extractNationality(text: string): string | null {
  const m = text.match(/(?:nationality|nationalité|from)\s*([A-Za-z\s]{2,20})/i);
  return m ? m[1].trim() : null;
}

function extractAvgSets(text: string): string | null {
  const m = text.match(/(?:average|moyenne)\s*sets\s*(\d\.?\d?)/i);
  return m ? m[1] : null;
}

function extractWinrate(text: string): string {
  const wins = (text.match(/victoire|won|win/gi) || []).length;
  const losses = (text.match(/défaite|lost|loss|perte/gi) || []).length;
  return wins > 0 ? `${wins}-${losses}` : "-";
}

function extractTB(text: string): string | null {
  const m = text.match(/(?:tiebreak|tb)\s*(?:percentage|%)?\s*(\d+)%?/i);
  return m ? m[1] + "%" : null;
}

function extractFirstSet(text: string): string | null {
  const m = text.match(/(?:first set|1er set)\s*(?:win|victoire)?\s*(\d+)%/i);
  return m ? m[1] + "%" : null;
}

function extractAces(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d)?)\s*(?:aces|ace)/i);
  return m ? m[1] : null;
}

function extractDoubleFaults(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d)?)\s*(?:double fault|double faute)/i);
  return m ? m[1] : null;
}

function extractHand(text: string): string {
  if (text.includes("right") || text.includes("droitière")) return "Droitière";
  if (text.includes("left") || text.includes("gauchère")) return "Gauchère";
  return "-";
}

function extractStyle(text: string): string {
  if (text.includes("aggressive")) return "Offensive";
  if (text.includes("defensive")) return "Défensive";
  return "Mixte";
}

function extractLast5(text: string): string {
  const matches = text.match(/[WL]{5}/);
  return matches ? matches[0] : "-";
}

function extractTrend(text: string): string {
  const wins = (text.match(/won|win|victoire/gi) || []).length;
  const losses = (text.match(/lost|loss|defeat/gi) || []).length;
  if (wins > losses + 2) return "↑↑";
  if (wins > losses) return "↑";
  if (losses > wins + 2) return "↓↓";
  if (losses > wins) return "↓";
  return "→";
}

function extractCalendar(text: string, profile: any): void {
  const matches = text.match(/(\d{1,2})\.(\d{1,2}).*?([A-Za-z\s]+)(?:tournoi|tournament)?/g);
  if (matches && matches.length > 0) {
    matches.slice(0, 3).forEach((m, i) => {
      profile[`match${i}_date`] = m.split(' ')[0];
      profile[`match${i}_tournament`] = m.split(' ').slice(1, 3).join(' ');
      profile[`match${i}_priority`] = "✓";
    });
  }
}

function extractPercentage(text: string, keyword: string): string | null {
  const m = text.match(new RegExp(`${keyword}.*?(\\d+)%`, 'i'));
  return m ? m[1] + "%" : null;
}

function extractLeader(text: string, p1Name: string): string | null {
  if (text.includes("leads")) return "Équilibré";
  return null;
}

function extractWeather(text: string): string {
  if (text.includes("sunny") || text.includes("ensoleillé")) return "Ensoleillé";
  if (text.includes("rain") || text.includes("pluie")) return "Pluvieux";
  return "Nuageux";
}

function extractTemp(text: string): string | null {
  const m = text.match(/(\d+)\s*°?c?/i);
  return m ? m[1] + "°C" : null;
}

function extractWind(text: string): string {
  if (text.includes("wind") || text.includes("vent")) return "Modéré";
  return "Faible";
}

function extractHumidity(text: string): string | null {
  const m = text.match(/(\d+)\s*%\s*(?:humidity|humidité)/i);
  return m ? m[1] + "%" : null;
}

function createEmptyProfile() {
  return {
    rank: "-", bestRank: "-", ageHeight: "- / -", nationality: "-", hand: "-", style: "-",
    winrateCareer: "-", winrateSeason: "-", winrateSurface: "-", aces: "-", doubleFaults: "-",
    firstServe: "-", form: "-", confidence: "-", injury: "Non", fatigue: "Faible",
    lastMatchDate: "-", serveStats: "-", returnStats: "-", motivation: "-", social: "-", last5: "-",
    holdPercent: "-", breakPercent: "-", trend: "-", avgSets: "-", tbPercent: "-", firstSetWin: "-",
    windImpact: "-", coldImpact: "-", over21_5: "-", over2_5: "-", overAces: "-", underAces: "-",
    afterLoss: "-", afterWin: "-", relaxation: "-", pressureHandling: "-", grandSlams: "-", wta1000: "-",
    challengers: "-", asFavorite: "-", asOutsider: "-", similarPlayer: "-", similarScore: "-",
    match0_date: "-", match0_tournament: "-", match0_priority: "-", match1_date: "-", match1_tournament: "-",
    match1_priority: "-", match2_date: "-", match2_tournament: "-", match2_priority: "-", match3_date: "-",
    match3_tournament: "-", match3_priority: "-", match4_date: "-", match4_tournament: "-", match4_priority: "-",
    nextMatchPriority: "-", h2hMeetings: "-", h2hSurface: "-", h2hLastWin: "-", h2hAvgSets: "-",
    h2hTB: "-", h2hHold: "-", h2hBreak: "-", stake: "-", points: "-", objective: "-", pressureLevel: "-", news: ""
  };
}
