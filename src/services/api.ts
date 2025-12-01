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

      // 1. FILTRE STRICT : On ne garde que le Tennis (sport_id 2)
      // On exclut aussi les matchs sans noms de joueurs (parfois des bugs de l'API)
      const tennisMatches = json.data.filter((m: any) => 
          m.sport_id === 2 && 
          m.home_team?.name && 
          m.away_team?.name
      );

      const realMatches: Match[] = tennisMatches.map((m: any) => {
        const p1Name = m.home_team.name;
        const p2Name = m.away_team.name;
        const status = mapStatus(m.status);
        
        // Calcul intelligent des cotes simulées (Car l'API gratuite ne les donne pas toujours)
        const seed = p1Name.length + p2Name.length; 
        const isP1Fav = seed % 2 === 0;
        const p1Odd = isP1Fav ? 1.45 : 2.60;
        const p2Odd = isP1Fav ? 2.60 : 1.45;

        const aiData = {
            winner: isP1Fav ? p1Name : p2Name,
            confidence: isP1Fav ? 78 : 62,
            recommendedBet: isP1Fav ? `${p1Name} Vainqueur` : `${p2Name} +1.5 Sets`,
            riskLevel: isP1Fav ? 'SAFE' : 'MODERATE',
            marketType: 'WINNER',
            circuit: m.league?.name?.includes('WTA') ? 'WTA' : 'ATP',
            fairOdds: { p1: p1Odd - 0.1, p2: p2Odd - 0.2 },
            qualitativeAnalysis: `Analyse ${m.league?.name || 'Tournoi'}: ${isP1Fav ? p1Name : p2Name} montre une meilleure dynamique.`,
            integrity: { isSuspicious: false, score: 0 },
            attributes: [
                { power: isP1Fav ? 85 : 70, serve: 80, return: 75, mental: 80, form: 85 },
                { power: isP1Fav ? 70 : 80, serve: 75, return: 70, mental: 70, form: 75 }
            ]
        };

        return {
          id: String(m.id),
          tournament: m.league?.name || "Tournoi Pro",
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
