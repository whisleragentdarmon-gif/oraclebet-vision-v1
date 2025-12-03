import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    // 1. INITIALISATION COMPLÈTE
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
      console.log("🔍 God Mode lancé...");

      // 2. REQUÊTES INTELLIGENTES ET STRUCTURÉES
      const searchQueries = {
        p1Profile: `${p1Name} tennis ranking stats WTA ATP age main`,
        p2Profile: `${p2Name} tennis ranking stats WTA ATP age main`,
        p1Recent: `${p1Name} tennis recent results 2024 2025 wins losses`,
        p2Recent: `${p2Name} tennis recent results 2024 2025 wins losses`,
        h2h: `${p1Name} vs ${p2Name} head to head h2h history`,
        weatherTournament: `météo weather ${tournament} ${new Date().toLocaleDateString('fr-FR')}`,
        p1Vs: `${p1Name} vs ${p2Name.split(' ')[0]} record stats`,
        p2Vs: `${p2Name} vs ${p1Name.split(' ')[0]} record stats`,
      };

      // Recherches parallèles
      const results = await Promise.all(
        Object.entries(searchQueries).map(([key, query]) =>
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          }).then(r => r.json()).catch(() => ({ results: [] }))
        )
      );

      const [p1ProfileRes, p2ProfileRes, p1RecentRes, p2RecentRes, h2hRes, weatherRes, p1VsRes, p2VsRes] = results;

      // 3. PARSING DES PROFILS JOUEUR 1
      if (p1ProfileRes?.results?.length > 0) {
        const p1Text = p1ProfileRes.results.map((r: any) => r.snippet).join(' ').toLowerCase();
        
        // Classement
        report.p1.rank = extractNumber(p1Text, /(?:rank|classement)[\s:]*(?:#)?(\d+)/i) || "100+";
        report.p1.bestRank = extractNumber(p1Text, /(?:career high|meilleur classement)[\s:]*(?:#)?(\d+)/i) || "-";
        
        // Âge et taille
        const age = extractNumber(p1Text, /(?:age|né|nee)[\s:]*(19|20)\d{2}/i);
        const height = extractNumber(p1Text, /(?:height|taille)[\s:]*(\d+(?:\.\d+)?)/i);
        report.p1.ageHeight = age || height ? `${age || "-"} / ${height ? height + "cm" : "-"}` : "- / -";
        
        // Nationalité
        const nationMatch = p1Text.match(/(?:nationality|nationalité|from|de)[\s:]*([A-Za-z\s]{2,20})/i);
        report.p1.nationality = nationMatch ? nationMatch[1].trim() : "-";
        
        // Main et style
        report.p1.hand = p1Text.includes("right") || p1Text.includes("droite") ? "Droitière" : 
                        p1Text.includes("left") || p1Text.includes("gauche") ? "Gauchère" : "-";
        report.p1.style = p1Text.includes("aggressive") || p1Text.includes("attaque") ? "Offensive" :
                         p1Text.includes("defensive") || p1Text.includes("défensive") ? "Défensive" : "Mixte";
        
        // Aces et stats
        report.p1.aces = extractNumber(p1Text, /(?:aces)[\s:]*(\d+)/i) || "-";
        report.p1.firstServe = extractNumber(p1Text, /(?:first serve)[\s:]*(\d+)%/i) ? (extractNumber(p1Text, /(?:first serve)[\s:]*(\d+)%/i) + "%") : "-";
      }

      // 4. PARSING DES PROFILS JOUEUR 2 (identique à P1)
      if (p2ProfileRes?.results?.length > 0) {
        const p2Text = p2ProfileRes.results.map((r: any) => r.snippet).join(' ').toLowerCase();
        
        report.p2.rank = extractNumber(p2Text, /(?:rank|classement)[\s:]*(?:#)?(\d+)/i) || "100+";
        report.p2.bestRank = extractNumber(p2Text, /(?:career high|meilleur classement)[\s:]*(?:#)?(\d+)/i) || "-";
        
        const age = extractNumber(p2Text, /(?:age|né|nee)[\s:]*(19|20)\d{2}/i);
        const height = extractNumber(p2Text, /(?:height|taille)[\s:]*(\d+(?:\.\d+)?)/i);
        report.p2.ageHeight = age || height ? `${age || "-"} / ${height ? height + "cm" : "-"}` : "- / -";
        
        const nationMatch = p2Text.match(/(?:nationality|nationalité|from|de)[\s:]*([A-Za-z\s]{2,20})/i);
        report.p2.nationality = nationMatch ? nationMatch[1].trim() : "-";
        
        report.p2.hand = p2Text.includes("right") || p2Text.includes("droite") ? "Droitière" : 
                        p2Text.includes("left") || p2Text.includes("gauche") ? "Gauchère" : "-";
        report.p2.style = p2Text.includes("aggressive") || p2Text.includes("attaque") ? "Offensive" :
                         p2Text.includes("defensive") || p2Text.includes("défensive") ? "Défensive" : "Mixte";
        
        report.p2.aces = extractNumber(p2Text, /(?:aces)[\s:]*(\d+)/i) || "-";
        report.p2.firstServe = extractNumber(p2Text, /(?:first serve)[\s:]*(\d+)%/i) ? (extractNumber(p2Text, /(?:first serve)[\s:]*(\d+)%/i) + "%") : "-";
      }

      // 5. PARSING RÉSULTATS RÉCENTS
      if (p1RecentRes?.results?.length > 0) {
        const recentText = p1RecentRes.results.map((r: any) => r.snippet).join(' ');
        const wMatches = (recentText.match(/won|victoire|win/gi) || []).length;
        const lMatches = (recentText.match(/lost|defeat|loss|perte/gi) || []).length;
        report.p1.winrateSeason = wMatches > 0 ? `${wMatches}-${lMatches}` : "-";
      }

      if (p2RecentRes?.results?.length > 0) {
        const recentText = p2RecentRes.results.map((r: any) => r.snippet).join(' ');
        const wMatches = (recentText.match(/won|victoire|win/gi) || []).length;
        const lMatches = (recentText.match(/lost|defeat|loss|perte/gi) || []).length;
        report.p2.winrateSeason = wMatches > 0 ? `${wMatches}-${lMatches}` : "-";
      }

      // 6. PARSING H2H
      if (h2hRes?.results?.length > 0) {
        const h2hText = h2hRes.results.map((r: any) => r.snippet).join(' ').toLowerCase();
        
        // Score global H2H
        const scoreMatch = h2hText.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.global = `${scoreMatch[1]} - ${scoreMatch[2]}`;
          report.h2h.advantage = parseInt(scoreMatch[1]) > parseInt(scoreMatch[2]) ? p1Name : p2Name;
        }
        
        // Tendance
        report.h2h.trend = h2hText.includes("won the last") || h2hText.includes("a remporté les" ) ? p1Name : 
                          h2hText.includes("record against") ? "Équilibré" : "Non trouvé";
        
        // Analysis basique
        report.h2h.analysis = h2hText.includes("first time") || h2hText.includes("première fois") ? 
                             "Première rencontre" : "Rencontre connue";
      }

      // 7. PARSING MÉTÉO
      if (weatherRes?.results?.length > 0) {
        const weatherText = weatherRes.results.map((r: any) => r.snippet).join(' ').toLowerCase();
        
        report.conditions.weather = weatherText.includes("sunny") || weatherText.includes("ensoleillé") ? "Ensoleillé" :
                                   weatherText.includes("rainy") || weatherText.includes("pluie") ? "Pluvieux" :
                                   weatherText.includes("cloudy") || weatherText.includes("nuageux") ? "Nuageux" : "Non trouvé";
        
        report.conditions.temp = extractNumber(weatherText, /(\d+)°?c?/i) ? (extractNumber(weatherText, /(\d+)°?c?/i) + "°C") : "-";
        report.conditions.wind = weatherText.includes("wind") ? "Présent" : "-";
        report.conditions.humidity = extractNumber(weatherText, /(?:humidity)[\s:]*(\d+)%/i) ? (extractNumber(weatherText, /(?:humidity)[\s:]*(\d+)%/i) + "%") : "-";
      }

      // 8. DÉTERMINATION FAVORI/OUTSIDER (pour logs)
      const p1Rank = parseInt(report.p1.rank.replace("+", "").replace(/\D/g, "")) || 200;
      const p2Rank = parseInt(report.p2.rank.replace("+", "").replace(/\D/g, "")) || 200;
      
      const isFavori = p1Rank < p2Rank;
      console.log(`📊 ${isFavori ? p1Name : p2Name} est favori(e)`);

      console.log("✅ God Mode terminé - Rapport généré");
      
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
    last5: "-",
    holdPercent: "-",
    breakPercent: "-",
    trend: "-",
    avgSets: "-",
    tbPercent: "-",
    firstSetWin: "-",
    windImpact: "-",
    coldImpact: "-",
    over21_5: "-",
    over2_5: "-",
    overAces: "-",
    underAces: "-",
    afterLoss: "-",
    afterWin: "-",
    relaxation: "-",
    pressureHandling: "-",
    grandSlams: "-",
    wta1000: "-",
    challengers: "-",
    asFavorite: "-",
    asOutsider: "-",
    similarPlayer: "-",
    similarScore: "-",
    match0_date: "-",
    match0_tournament: "-",
    match0_priority: "-",
    match1_date: "-",
    match1_tournament: "-",
    match1_priority: "-",
    match2_date: "-",
    match2_tournament: "-",
    match2_priority: "-",
    match3_date: "-",
    match3_tournament: "-",
    match3_priority: "-",
    match4_date: "-",
    match4_tournament: "-",
    match4_priority: "-",
    nextMatchPriority: "-",
    h2hMeetings: "-",
    h2hSurface: "-",
    h2hLastWin: "-",
    h2hAvgSets: "-",
    h2hTB: "-",
    h2hHold: "-",
    h2hBreak: "-",
    stake: "-",
    points: "-",
    objective: "-",
    pressureLevel: "-",
    news: ""
  };
}

function extractNumber(text: string, regex: RegExp): string | null {
  const match = text.match(regex);
  return match ? match[1] : null;
}

function extract(text: string, regex: RegExp): string | null {
  const match = text.match(regex);
  return match ? match[1] : null;
}
