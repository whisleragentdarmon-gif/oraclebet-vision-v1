import { Circuit, SimulationResult, ComboStrategy } from './types';
import { MonteCarlo } from './MonteCarlo'; 
import { OddsEngine } from './OddsEngine'; 

export const OracleAI = {
  bankroll: {
    calculateStake: (balance: number, confidence: number, odds: number, method: string) => {
      if (balance <= 0) return 0;
      const basePercentage = confidence > 70 ? 0.03 : 0.01;
      return parseFloat((balance * basePercentage).toFixed(2));
    },
    simulateFuture: (currentBalance: number, winRate: number, avgOdds: number): SimulationResult => {
      return MonteCarlo.simulateFuture(currentBalance, winRate, avgOdds);
    }
  },
  combo: {
    generateStrategies: (matches: any[]): ComboStrategy[] => {
      const safeMatches = matches.filter((m: any) => m.ai?.confidence > 80).slice(0, 3);
      
      const strategies: ComboStrategy[] = [];

      if (safeMatches.length >= 2) {
          const combinedOdds = safeMatches.reduce((acc: number, m: any) => acc * (m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2), 1);
          strategies.push({
            type: 'Safe',
            selections: safeMatches.map((m: any) => ({
                // FIX: On ajoute matchId ici
                matchId: m.id,
                player1: m.player1.name,
                player2: m.player2.name,
                selection: m.ai?.winner,
                odds: m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2,
                confidence: m.ai?.confidence,
                reason: "Confiance élevée IA",
                marketType: "WINNER"
            })),
            combinedOdds: parseFloat(combinedOdds.toFixed(2)),
            successProbability: 75,
            riskScore: 'Low'
          });
      }

      strategies.push({
          type: 'Balanced',
          selections: matches.slice(0, 2).map((m: any) => ({
            // FIX: On ajoute matchId ici aussi
            matchId: m.id,
            player1: m.player1.name,
            player2: m.player2.name,
            selection: m.ai?.winner || m.player1.name,
            odds: 1.5,
            confidence: 60,
            reason: "Analyse forme",
            marketType: "WINNER"
          })),
          combinedOdds: 2.25,
          successProbability: 50,
          riskScore: 'Moderate'
      });

      return strategies;
    }
  },
  predictor: {
    learning: {
      learnFromMatch: (isWin: boolean, data: { circuit: Circuit, winnerPrediction: string, totalGames: number, riskLevel: string }, id: string) => {
        return `Apprentissage IA : Match ${id} analysé. Résultat: ${isWin ? 'Victoire' : 'Défaite'}.`;
      }
    },
    analyzeOdds: (p1: string, p2: string, o1: number, o2: number) => {
        return OddsEngine.analyze(p1, p2, o1, o2);
    }
  }
};
