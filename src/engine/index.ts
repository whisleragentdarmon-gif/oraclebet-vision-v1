// Fichier : src/engine/index.ts
import { Circuit, SimulationResult, ComboStrategy } from './types';

// Mock engine pour faire tourner l'interface
export const OracleAI = {
  bankroll: {
    calculateStake: (balance: number, confidence: number, odds: number, method: string) => {
      if (balance <= 0) return 0;
      const basePercentage = confidence > 70 ? 0.03 : 0.01;
      return parseFloat((balance * basePercentage).toFixed(2));
    },
    simulateFuture: (currentBalance: number, winRate: number, avgOdds: number): SimulationResult => {
      // Simulation factice pour l'affichage
      return {
        finalBankroll: parseFloat((currentBalance * 1.2).toFixed(2)),
        riskOfRuin: 5.4,
        volatility: 12.5,
        maxBankroll: parseFloat((currentBalance * 1.5).toFixed(2)),
        minBankroll: parseFloat((currentBalance * 0.8).toFixed(2)),
        paths: []
      };
    }
  },
  combo: {
    generateStrategies: (matches: any[]): ComboStrategy[] => {
      // Génère des stratégies factices si on n'a pas assez de matchs
      return [
        {
          type: 'Balanced',
          selections: matches.slice(0, 2).map(m => ({
            player1: m.player1.name,
            player2: m.player2.name,
            selection: m.ai?.winner || m.player1.name,
            odds: 1.5,
            confidence: 75,
            reason: "Forme supérieure"
          })),
          combinedOdds: 2.25,
          successProbability: 60,
          riskScore: 'Low'
        }
      ];
    }
  },
  predictor: {
    learning: {
      learnFromMatch: (isWin: boolean, data: { circuit: Circuit, winnerPrediction: string, totalGames: number, riskLevel: string }, id: string) => {
        return `Apprentissage IA : Match ${id} analysé. Résultat: ${isWin ? 'Victoire' : 'Défaite'}.`;
      }
    }
  }
};
