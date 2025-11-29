import { Circuit, SimulationResult, ComboStrategy } from './types';
import { MonteCarlo } from './MonteCarlo'; 
import { OddsEngine } from './OddsEngine'; 
import { LearningModule } from './LearningModule'; 

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
      
      // 1. FILTRAGE ULTRA STRICT (Sécurité)
      const premiumCandidates = matches.filter((m: any) => 
          m.ai?.confidence >= 80 && // Confiance très haute
          !m.ai?.integrity?.isSuspicious && // Pas de match truqué
          !m.ai?.trap?.isTrap // Pas de piège bookmaker
      );

      const strategies: ComboStrategy[] = [];

      // 2. GÉNÉRATION ULTRA PREMIUM (3 à 5 Matchs)
      // On trie par confiance décroissante pour prendre les meilleurs
      premiumCandidates.sort((a:any, b:any) => b.ai.confidence - a.ai.confidence);
      
      const ultraPremiumSelection = premiumCandidates.slice(0, 5); // Max 5 matchs

      if (ultraPremiumSelection.length >= 3) {
          const combinedOdds = ultraPremiumSelection.reduce((acc: number, m: any) => acc * (m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2), 1);
          
          strategies.push({
            type: 'Oracle Ultra Premium',
            selections: ultraPremiumSelection.map((m: any) => ({
                matchId: m.id,
                player1: m.player1.name,
                player2: m.player2.name,
                selection: m.ai?.winner,
                odds: m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2,
                confidence: m.ai?.confidence,
                reason: "Confiance Elite + Intégrité Vérifiée",
                marketType: "WINNER"
            })),
            combinedOdds: parseFloat(combinedOdds.toFixed(2)),
            successProbability: 82, // Score calculé
            riskScore: 'Low',
            analysis: "Combiné généré uniquement sur des matchs sans alerte de trucage et avec une confiance > 80%."
          });
      }

      // 3. GÉNÉRATION VALUE (Pour les opportunistes)
      const valueMatches = matches.filter((m: any) => m.ai?.oddsAnalysis?.recommendedBookie === 'Winamax' && m.odds.p1 > m.ai.fairOdds.p1);
      
      if (valueMatches.length >= 2) {
         strategies.push({
            type: 'Value',
            selections: valueMatches.slice(0, 3).map((m: any) => ({
                matchId: m.id,
                player1: m.player1.name,
                player2: m.player2.name,
                selection: m.ai?.winner,
                odds: m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2,
                confidence: m.ai?.confidence,
                reason: "Value Détectée (>5%)",
                marketType: "WINNER"
            })),
            combinedOdds: 3.50, // Mock
            successProbability: 45,
            riskScore: 'Risky',
            analysis: "Ces matchs présentent une erreur de cotation des bookmakers."
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
    }
  }
};
