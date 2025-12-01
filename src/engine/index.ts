import { Circuit, SimulationResult, ComboStrategy } from './types';
import { MonteCarlo } from './MonteCarlo'; 
import { OddsEngine } from './OddsEngine'; 
import { LearningModule } from './LearningModule';
// Imports des nouveaux modules de marché
import { ScandalEngine } from './market/ScandalEngine';
import { TrapDetector } from './market/TrapDetector';
import { GeoEngine } from './market/GeoEngine';

// Instance unique de l'apprentissage
const learningInstance = new LearningModule();

// LE VOILÀ : L'EXPORT QUE TOUT LE MONDE CHERCHE
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
      // Stratégie simplifiée pour éviter les erreurs de type pour l'instant
      const strategies: ComboStrategy[] = [];
      
      // On simule une stratégie Safe si on a des matchs
      if (matches.length > 0) {
          strategies.push({
            type: 'Safe',
            selections: matches.slice(0, 2).map((m: any) => ({
                matchId: m.id,
                player1: m.player1.name,
                player2: m.player2.name,
                selection: m.ai?.winner || "Pari",
                odds: 1.5,
                confidence: 80,
                reason: "Sécurité",
                marketType: "WINNER"
            })),
            combinedOdds: 2.25,
            successProbability: 75,
            riskScore: 'Low'
          });
      }
      return strategies;
    }
  },
  predictor: {
    learning: {
      learnFromMatch: (isWin: boolean, data: { circuit: Circuit, winnerPrediction: string, totalGames: number, riskLevel: string }, id: string) => {
        return learningInstance.learnFromMatch(isWin, data, id);
      },
      getStats: () => learningInstance.getLearningStats(),
      retrain: (history: any[]) => learningInstance.retrainModelFromHistory(history)
    },
    analyzeOdds: (p1: string, p2: string, o1: number, o2: number) => {
        return OddsEngine.analyze(p1, p2, o1, o2);
    },
    // Fonction GOD MODE utilisée par AnalysisPage
    runGodModeAnalysis: (match: any) => {
        const pressSocial = ScandalEngine.analyze(match.player1.name);
        const integrity = TrapDetector.scan(match.odds); // Utilise bien .scan()
        const conditions = GeoEngine.getConditions(match.tournament);
  
        return {
          social: pressSocial.social,
          press: pressSocial.press,
          geo: conditions,
          trap: integrity
        };
    }
  }
};
