import { GodModeReportV2 } from '../types';

export const GodEngine = {
  generateReportV2: async (p1Name: string, p2Name: string, tournament: string): Promise<GodModeReportV2> => {
    
    console.log("🚀 GodEngine V2 : Démarrage extraction...");

    // 1. Initialisation (Template Vide)
    const report: GodModeReportV2 = {
      identity: {
        p1Name, p2Name, tournament, surface: "Non trouvé", date: new Date().toLocaleDateString('fr-FR'),
        round: "Tour principal", city: "-", timezone: "UTC", 
        importanceP1: "Haute", importanceP2: "Haute", enjeu: "Qualification"
      },
      p1: createEmptyProfile(),
      p2: createEmptyProfile(),
      h2h: { 
        global: "0 - 0", surface: "0 - 0", advantage: "Inconnu", lastMatches: "Aucune confrontation récente trouvée.", trend: "Neutre", analysis: "À déterminer" 
      },
      conditions: { 
        weather: "-", temp: "-", wind: "-", humidity: "-", 
        courtSpeed: "Moyen", ballType: "Standard", fatigueImpact: "Faible",
        altitude: "-", advantage: "-"
      },
      bookmaker: { 
        oddA: "-", oddB: "-", spread: "-", movement: "Stable", 
        smartMoney: "Non", valueIndex: "5/10", trapIndex: "Non",
        specialOdds: [] 
      },
      factors: [],
      synthesis: {
        tech: "-", mental: "-", physical: "-", surface: "-", momentum: "-", xFactor: "-", risk: "-"
      },
      prediction: { 
        winner: "-", score: "-", duration: "-", volatility: "-", confidence: "-", 
        bestBet: "-", avoidBet: "-", altBet: "-",
        probA: "50", probB: "50", probOver: "-", probTieBreak: "-", probUpset: "-", risk: "-", recoWinner: "Analyse...", recoOver: "-", recoSet: "-"
      }
    };

    try {
      // 2. APPEL API TENNIS (Données Officielles)
      console.log(`📡 Appel Tennis API pour ${p1Name} et ${p2Name}...`);
      
      const [apiP1, apiP2] = await Promise.all([
        fetch('/api/tennis_search', { 
          method: 'POST', 
          headers: {'Content-Type':'application/json'}, 
          body: JSON.stringify({ query: p1Name }) 
        }).then(r => r.json()).catch(e => { console.error(`❌ P1 Error:`, e); return null; }),
        fetch('/api/tennis_search', { 
          method: 'POST', 
          headers: {'Content-Type':'application/json'}, 
          body: JSON.stringify({ query: p2Name }) 
        }).then(r => r.json()).catch(e => { console.error(`❌ P2 Error:`, e); return null; })
      ]);

      console.log(`🎾 P1 API Response:`, apiP1);
      console.log(`🎾 P2 API Response:`, apiP2);

      // --- REMPLISSAGE AVEC DONNÉES OFFICIELLES (API) ---
      if (apiP1 && apiP1.playerInfo) {
        const info = apiP1.playerInfo;
        report.p1.rank = extractRankFromString(info.Rank) || "-";
        report.p1.nationality = info.nationality || "-";
        report.p1.hand = info.plays || "-";
        if (info.birthDate) {
          const age = calculateAge(info.birthDate);
          report.p1.ageHeight = `${age} / ${info.height || "-"}`;
        }
        report.p1.winrateCareer = info.careerSinglesWL || "-";
        report.p1.winrateSeason = info.singlesWL || "-";
      }

      if (apiP2 && apiP2.playerInfo) {
        const info = apiP2.playerInfo;
        report.p2.rank = extractRankFromString(info.Rank) || "-";
        report.p2.nationality = info.nationality || "-";
        report.p2.hand = info.plays || "-";
        if (info.birthDate) {
          const age = calculateAge(info.birthDate);
          report.p2.ageHeight = `${age} / ${info.height || "-"}`;
        }
        report.p2.winrateCareer = info.careerSinglesWL || "-";
        report.p2.winrateSeason = info.singlesWL || "-";
      }

      // 3. APPEL GOOGLE SEARCH (Données Complémentaires & H2H)
      console.log("🔍 Appel Google Search...");
      
      const queries = [
        `${p1Name} tennis recent results flashscore 2024`,
        `${p2Name} tennis recent results flashscore 2024`,
        `${p1Name} vs ${p2Name} h2h tennis head to head record`,
        `weather ${tournament} tennis conditions`
      ];

      const responses = await Promise.all(
        queries.map(q => 
          fetch('/api/search', { 
            method: 'POST', 
            headers: {'Content-Type':'application/json'}, 
            body: JSON.stringify({ query: q }) 
          }).then(r => r.json()).catch(() => ({ results: [] }))
        )
      );

      // --- PARSING GOOGLE ---

      // Résultats récents P1
      if (responses[0]?.results?.[0]) {
        const snippet = responses[0].results[0].snippet;
        report.p1.last5 = snippet.substring(0, 100);
        report.p1.form = "Voir détails";
        console.log(`✅ P1 Recent: ${snippet.substring(0, 80)}`);
      }

      // Résultats récents P2
      if (responses[1]?.results?.[0]) {
        const snippet = responses[1].results[0].snippet;
        report.p2.last5 = snippet.substring(0, 100);
        report.p2.form = "Voir détails";
        console.log(`✅ P2 Recent: ${snippet.substring(0, 80)}`);
      }

      // H2H
      const h2hRes = responses[2]?.results || [];
      if (h2hRes.length > 0) {
        const title = h2hRes[0].title || "";
        const snippet = h2hRes[0].snippet || "";
        const fullText = title + " " + snippet;
        
        // Essai d'extraction du score H2H (ex: "2-1")
        const matchH2H = fullText.match(/(\d+)\s?-\s?(\d+)/);
        if (matchH2H) {
          report.h2h.global = `${matchH2H[1]} - ${matchH2H[2]}`;
          console.log(`✅ H2H Score trouvé: ${matchH2H[1]}-${matchH2H[2]}`);
        }
        
        // Mettre le snippet complet pour lecture humaine
        report.h2h.lastMatches = snippet.substring(0, 150);
        report.h2h.analysis = fullText.includes("first") || fullText.includes("première") ? "Première rencontre" : "Rencontre connue";
      }

      // Météo
      const weatherRes = responses[3]?.results || [];
      if (weatherRes.length > 0) {
        const wText = weatherRes[0].snippet || "";
        report.conditions.weather = wText.substring(0, 60);
        
        // Détection de mots clés
        if (wText.includes('rain') || wText.includes('pluie')) {
          report.conditions.weather = "PLUIE POSSIBLE";
        } else if (wText.includes('sun') || wText.includes('ensoleillé')) {
          report.conditions.weather = "ENSOLEILLÉ";
        }
        
        // Extraire température
        const tempMatch = wText.match(/(\d+)\s*°?c/i);
        if (tempMatch) report.conditions.temp = tempMatch[1] + "°C";
      }

      // Surface (Déduction si non trouvée)
      if (tournament.toLowerCase().includes('clay') || tournament.toLowerCase().includes('argile')) {
        report.identity.surface = "Terre Battue";
      } else if (tournament.toLowerCase().includes('grass') || tournament.toLowerCase().includes('gazon')) {
        report.identity.surface = "Gazon";
      } else {
        report.identity.surface = "Dur";
      }

      console.log("✅ GodEngine V2 COMPLET!");
      
    } catch (e) {
      console.error("❌ Erreur GodEngine Extraction:", e);
    }

    return report;
  }
};

// --- OUTILS ---

function extractRankFromString(rankStr: string): string | null {
  if (!rankStr) return null;
  const m = rankStr.match(/(\d+)/);
  if (m) {
    const rank = parseInt(m[1]);
    if (rank >= 1 && rank <= 2000) return m[1];
  }
  return null;
}

function calculateAge(birthDate: string): number {
  if (!birthDate) return 0;
  try {
    // Parse "December 27, 1990 (Age: 34)"
    const ageMatch = birthDate.match(/\(Age:\s*(\d+)\)/);
    if (ageMatch) return parseInt(ageMatch[1]);
    
    // Parse "December 27, 1990"
    const dateMatch = birthDate.match(/(\w+)\s*(\d+),\s*(\d{4})/);
    if (dateMatch) {
      const birth = new Date(`${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}`);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age >= 15 && age <= 75) return age;
    }
  } catch (e) {
    console.error('❌ Erreur extraction âge:', e);
  }
  return 0;
}

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
    injury: "R.A.S", 
    fatigue: "Faible", 
    lastMatchDate: "-", 
    serveStats: "-", 
    returnStats: "-", 
    motivation: "Normale", 
    social: "-", 
    last5: "En attente de données..."
  };
}
