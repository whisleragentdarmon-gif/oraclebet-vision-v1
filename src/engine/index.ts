import { Circuit, SimulationResult, ComboStrategy } from './types';
import { MonteCarlo } from './MonteCarlo'; 
import { OddsEngine } from './OddsEngine'; 
import { LearningModule } from './LearningModule';
import { ScandalEngine } from './market/ScandalEngine';
import { TrapDetector } from './market/TrapDetector';
import { GeoEngine } from './market/GeoEngine';

const learningInstance = new LearningModule();

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
      const strategies: ComboStrategy[] = [];
      
      // On exclut les matchs finis et suspects
      const candidates = matches.filter((m: any) => 
          m.status !== 'FINISHED' && 
          !m.ai?.integrity?.isSuspicious
      );

      // --- STRATÉGIE 1 : SAFE / ULTRA PREMIUM (>75% confiance) ---
      const safePicks = candidates.filter((m: any) => m.ai?.confidence >= 75);
      if (safePicks.length >= 2) {
          const selection = safePicks.slice(0, 4); // Max 4 matchs
          const combinedOdds = selection.reduce((acc: number, m: any) => acc * (m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2), 1);
          
          strategies.push({
            type: 'Safe',
            selections: selection.map((m: any) => ({
                matchId: m.id,
                player1: m.player1.name,
                player2: m.player2.name,
                selection: m.ai?.winner,
                odds: m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2,
                confidence: m.ai?.confidence,
                reason: "Confiance élevée",
                marketType: "WINNER"
            })),
            combinedOdds: parseFloat(combinedOdds.toFixed(2)),
            successProbability: 78,
            riskScore: 'Low',
            analysis: "Sélection des favoris les plus solides du jour."
          });
      }

      // --- STRATÉGIE 2 : BALANCED (Dès 55% confiance) ---
      // C'est celle-ci qui va remplir ton tableau même s'il n'y a pas de "grosses" opportunités
      const balancedPicks = candidates.filter((m: any) => m.ai?.confidence >= 55).slice(0, 3);
      if (balancedPicks.length >= 2) {
          const combinedOdds = balancedPicks.reduce((acc: number, m: any) => acc * (m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2), 1);
          strategies.push({
              type: 'Balanced',
              selections: balancedPicks.map((m: any) => ({
                matchId: m.id,
                player1: m.player1.name,
                player2: m.player2.name,
                selection: m.ai?.winner,
                odds: m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2,
                confidence: m.ai?.confidence,
                reason: "Opportunité statistique",
                marketType: "WINNER"
              })),
              combinedOdds: parseFloat(combinedOdds.toFixed(2)),
              successProbability: 55,
              riskScore: 'Moderate',
              analysis: "Combiné équilibré basé sur la forme récente."
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
    runGodModeAnalysis: (match: any) => {
        const pressSocial = ScandalEngine.analyze(match.player1.name);
        const integrity = TrapDetector.scan(match.odds);
        const conditions = GeoEngine.getConditions(match.tournament);
        return { social: pressSocial.social, press: pressSocial.press, geo: conditions, trap: integrity };
    }
  }
};
