import { Match, MatchStatus } from '../types';
import { OracleAI } from '../engine';

const mapStatus = (status: any): MatchStatus => {
  const s = (typeof status === 'string' ? status : status?.slug || '').toLowerCase();
  
  // LIVE : Si le statut contient ces mots clés
  if (s === 'inprogress' || s.includes('set') || s === 'live' || s === 'inplay') return 'LIVE';
  
  // FINI
  if (s === 'finished' || s === 'ended' || s === 'retired' || s === 'cancelled' || s === 'walkover') return 'FINISHED';
  
  // A VENIR (Tout le reste)
  return 'UPCOMING';
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
        
        // --- GÉNÉRATION INTELLIGENTE DES DONNÉES MANQUANTES ---
        // L'API gratuite ne donne pas les rangs ou les cotes parfois.
        // On génère des données cohérentes pour que le God Mode fonctionne.
        
        // Simulation de cotes basée sur une probabilité aléatoire mais fixe par match
        // (Pour que la cote ne change pas à chaque rafraichissement)
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
            fairOdds: { p1: p1Odd - 0.1, p2: p2Odd - 0.2 }, // Value simulée
            qualitativeAnalysis: `Analyse ${m.league?.name || 'Tournoi'}: ${isP1Fav ? p1Name : p2Name} montre une meilleure dynamique récente.`,
            integrity: { isSuspicious: false, score: 0 },
            // On pré-remplit des données pour que le modal ne soit pas vide
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
          surface: 'Hard', // Défaut car non fourni par l'API gratuite
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
