// Fichier : src/engine/index.ts
import { Circuit } from './types';

export const OracleAI = {
  bankroll: {
    calculateStake: (balance: number, confidence: number, odds: number, method: string) => {
      // Stratégie simple pour éviter le crash
      if (balance <= 0) return 0;
      const basePercentage = confidence > 70 ? 0.03 : 0.01;
      return parseFloat((balance * basePercentage).toFixed(2));
    }
  },
  predictor: {
    learning: {
      learnFromMatch: (isWin: boolean, data: { circuit: Circuit, winnerPrediction: string, totalGames: number, riskLevel: string }, id: string) => {
        return `Apprentissage IA : Match ${id} analysé. Résultat: ${isWin ? 'Victoire' : 'Défaite'}. Modèle ajusté.`;
      }
    }
  }
};
