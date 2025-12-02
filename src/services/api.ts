import { Match, MatchStatus } from '../types';
import { OracleAI } from '../engine';

const mapStatus = (status: any): MatchStatus => {
  const s = (typeof status === 'string' ? status : status?.slug || '').toLowerCase();
  if (s === 'inprogress' || s.includes('set') || s === 'live' || s === 'inplay') return 'LIVE';
  if (s === 'finished' || s === 'ended' || s === 'retired' || s === 'cancelled' || s === 'walkover') return 'FINISHED';
  if (s === 'notstarted' || s === 'scheduled') return 'UPCOMING';
  return 'SCHEDULED';
};

export const MatchService = {
  getTodaysMatches: async (): Promise<Match[]> => {
    try {
      const response = await fetch('/api/matches');
      const json = await response.json();
      if (!json.data) return [];

      const realMatches: Match[] = json.data.map((m: any) => {
        const p1Name = m.home_team?.name || "TBA";
        const p2Name = m.away_team?.name || "TBA";
        const status = mapStatus(m.status);
        
        // --- SIMULATION DE COTES VARIÉES (POUR API GRATUITE) ---
        // On utilise le hachage du nom pour que la cote soit constante pour un match donné
        const hash = (p1Name + p2Name).length;
        const randomFactor = (hash % 10) / 10; // Donne un chiffre entre 0 et 0.9

        let p1Odd, p2Odd, isP1Fav;

        if (randomFactor < 0.3) {
            // CAS 1 : GRAND FAVORI (P1) -> Doit déclencher "2-0"
            p1Odd = 1.20 + (randomFactor / 2);
            p2Odd = 4.50 + randomFactor;
            isP1Fav = true;
        } else if (randomFactor > 0.7) {
            // CAS 2 : GRAND FAVORI (P2) -> Doit déclencher "2-0"
            p1Odd = 3.80 + randomFactor;
            p2Odd = 1.25 + (randomFactor / 2);
            isP1Fav = false;
        } else {
            // CAS 3 : MATCH SERRÉ -> Doit déclencher "Vainqueur" ou "Over"
            p1Odd = 1.75 + (randomFactor / 2);
            p2Odd = 1.85 + (randomFactor / 2);
            isP1Fav = p1Odd < p2Odd;
        }

        const aiData = {
            winner: isP1Fav ? p1Name : p2Name,
            confidence: isP1Fav ? (p1Odd < 1.30 ? 85 : 70) : 60,
            // Note: recommendedBet sera recalculé intelligemment par le moteur Combo
            recommendedBet: "Analyse...",
            riskLevel: isP1Fav ? 'SAFE' : 'MODERATE',
            marketType: 'WINNER',
            circuit: m.league?.name?.includes('WTA') ? 'WTA' : 'ATP',
            fairOdds: { p1: p1Odd - 0.05, p2: p2Odd - 0.1 },
            qualitativeAnalysis: `Oracle détecte un avantage pour ${isP1Fav ? p1Name : p2Name} basé sur la dynamique.`,
            integrity: { isSuspicious: false, score: 0 },
            attributes: [
                { power: 80, serve: 75, return: 70, mental: 80, form: 80 },
                { power: 70, serve: 70, return: 75, mental: 70, form: 75 }
            ]
        };

        return {
          id: String(m.id),
          tournament: m.league?.name || "Tournoi",
          date: m.start_at ? new Date(m.start_at).toLocaleDateString() : "Auj.",
          time: m.start_at ? new Date(m.start_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "00:00",
          status: status,
          surface: 'Hard', 
          score: m.home_score?.display ? `${m.home_score.display}-${m.away_score.display}` : undefined,
          player1: { name: p1Name, rank: 0, country: m.home_team?.country_code || 'WLD', form: 50, surfacePrefs: { hard: 50, clay: 50, grass: 50 } },
          player2: { name: p2Name, rank: 0, country: m.away_team?.country_code || 'WLD', form: 50, surfacePrefs: { hard: 50, clay: 50, grass: 50 } },
          odds: { player1: p1Odd, player2: p2Odd, p1: p1Odd, p2: p2Odd },
          ai: aiData as any
        };
      });

      return realMatches;
    } catch (e) {
      console.error("Erreur API:", e);
      return [];
    }
  }
};
