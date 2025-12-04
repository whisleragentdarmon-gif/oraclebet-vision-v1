import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    console.log(`🚀 God Mode HYBRID lancé - Tennis API + Serper...`);

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
      // ===== PHASE 1: TENNIS API via /api/tennis_search =====
      console.log("📡 Phase 1: Tennis API via serveur...");

      const p1Response = await fetch('/api/tennis_search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: p1Name })
      }).then(r => r.json()).catch(e => {
        console.error(`❌ P1 Error:`, e);
        return null;
      });

      console.log(`🎾 P1 Data:`, p1Response);

      const p2Response = await fetch('/api/tennis_search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: p2Name })
      }).then(r => r.json()).catch(e => {
        console.error(`❌ P2 Error:`, e);
        return null;
      });

      console.log(`🎾 P2 Data:`, p2Response);

      // Parse P1
      if (p1Response?.playerInfo) {
        const info = p1Response.playerInfo;
        report.p1.rank = extractRankFromString(info.Rank) || "-";
        report.p1.nationality = info.nationality || "-";
        report.p1.hand = info.plays || "-";
        report.p1.ageHeight = `${extractAgeFromBirthDate(info.birthDate)} / ${info.height || "-"}`;
        report.p1.winrateSeason = info.singlesWL || "-";
        report.p1.winrateCareer = info.careerSinglesWL || "-";
      }

      if (p1Response?.stats && p1Response.stats.length > 0) {
        const currentYear = new Date().getFullYear();
        const yearStats = p1Response.stats.find((s: any) => parseInt(s.year) === currentYear);
        if (yearStats) {
          report.p1.form = calculateFormFromWL(yearStats.singlesWL);
          report.p1.motivation = calculateMotivationFromPrize(yearStats.prizeMoney);
        }
      }

      // Parse P2
      if (p2Response?.playerInfo) {
        const info = p2Response.playerInfo;
        report.p2.rank = extractRankFromString(info.Rank) || "-";
        report.p2.nationality = info.nationality || "-";
        report.p2.hand = info.plays || "-";
        report.p2.ageHeight = `${extractAgeFromBirthDate(info.birthDate)} / ${info.height || "-"}`;
        report.p2.winrateSeason = info.singlesWL || "-";
        report.p2.winrateCareer = info.careerSinglesWL || "-";
      }

      if (p2Response?.stats && p2Response.stats.length > 0) {
        const currentYear = new Date().getFullYear();
        const yearStats = p2Response.stats.find((s: any) => parseInt(s.year) === currentYear);
        if (yearStats) {
          report.p2.form = calculateFormFromWL(yearStats.singlesWL);
          report.p2.motivation = calculateMotivationFromPrize(yearStats.prizeMoney);
        }
      }

      console.log("✅ Phase 1 Tennis API complétée");

      // ===== PHASE 2: SERPER pour H2H, Météo, Cotes =====
      console.log("🔍 Phase 2: Serper...");

      const serperQueries = [
        `${p1Name} vs ${p2Name} h2h head to head record`,
        `weather ${tournament} temperature humidity wind`,
        `${p1Name} vs ${p2Name} betting odds cotes`,
      ];

      const serperResponses = await Promise.all(
        serperQueries.map(q =>
          fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
          })
            .then(r => r.json())
            .then(data => ({ results: data.results || [] }))
            .catch(() => ({ results: [] }))
        )
      );

      console.log("✅ Phase 2 Serper complétée");

      // Parse Serper - H2H
      if (serperResponses[0].results.length > 0) {
        const h2hText = serperResponses[0].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        const scoreMatch = h2hText.match(/(\d+)[:\s-]+(\d+)/);
        if (scoreMatch) {
          report.h2h.global = `${scoreMatch[1]} - ${scoreMatch[2]}`;
          report.h2h.advantage = parseInt(scoreMatch[1]) > parseInt(scoreMatch[2]) ? p1Name : p2Name;
        }
      }

      // Parse Serper - Météo
      if (serperResponses[1].results.length > 0) {
        const weatherText = serperResponses[1].results.map((r: any) => r.snippet).join(' ').toLowerCase();
        report.conditions.weather = extractWeather(weatherText) || "Ensoleillé";
        report.conditions.temp = extractTemp(weatherText) || "-";
        report.conditions.wind = extractWind(weatherText) || "-";
        report.conditions.humidity = extractHumidity(weatherText) || "-";
      }

      // Parse Serper - Cotes
      if (serperResponses[2].results.length > 0) {
        const oddsText = serperResponses[2].results.map((r: any) => r.snippet).join(' ');
        const oddsMatch = oddsText.match(/(\d\.\d{2})\s*(?:vs|-)\s*(\d\.\d{2})/);
        if (oddsMatch) {
          report.bookmaker.oddA = oddsMatch[1];
          report.bookmaker.oddB = oddsMatch[2];
        }
      }

      console.log("✅ God Mode HYBRID COMPLET!");
      
    } catch (e) {
      console.error("❌ Erreur God Mode:", e);
    }

    return report;
  }
};

// ========== FONCTIONS D'EXTRACTION ==========

function extractRankFromString(rankStr: string): string | null {
  if (!rankStr) return null;
  const m = rankStr.match(/(\d+)/);
  if (m) {
    const rank = parseInt(m[1]);
    if (rank >= 1 && rank <= 2000) return m[1];
  }
  return null;
}

function extractAgeFromBirthDate(birthDate: string): number {
  if (!birthDate) return 0;
  try {
    const dateMatch = birthDate.match(/(\w+)\s*(\d+),\s*(\d{4})/);
    if (dateMatch) {
      const birth = new Date(`${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}`);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age >= 15 && age <= 75) return age;
    }
  } catch (e) {
    console.error('Erreur extraction âge:', e);
  }
  return 0;
}

function calculateFormFromWL(wlStr: string): string {
  if (!wlStr || wlStr === "0-0") return "Faible";
  const [wins, losses] = wlStr.split('-').map(Number);
  const total = wins + losses;
  if (total === 0) return "Faible";
  const winRate = wins / total;
  if (winRate >= 0.7) return "Excellente";
  if (winRate >= 0.5) return "Bonne";
  return "Faible";
}

function calculateMotivationFromPrize(prizeStr: string): string {
  if (!prizeStr) return "6/10";
  const prize = parseInt(prizeStr.replace(/[^0-9]/g, '')) || 0;
  if (prize > 1000000) return "9/10";
  if (prize > 500000) return "8/10";
  if (prize > 100000) return "7/10";
  return "6/10";
}

function extractWeather(text: string): string {
  if (text.includes("sunny") || text.includes("ensoleillé")) return "Ensoleillé";
  if (text.includes("rain") || text.includes("pluie")) return "Pluvieux";
  if (text.includes("cloud") || text.includes("nuageux")) return "Nuageux";
  return "Ensoleillé";
}

function extractTemp(text: string): string | null {
  const m = text.match(/(\d{1,2})\s*°?\s*c/i);
  return m ? m[1] + "°C" : null;
}

function extractWind(text: string): string {
  const m = text.match(/(\d+)\s*(?:km\/h|mph|knots)/i);
  return m ? m[1] + " km/h" : "Faible";
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
    serveStats: "-", returnStats: "-", motivation: "-", last5: "-"
  };
}
