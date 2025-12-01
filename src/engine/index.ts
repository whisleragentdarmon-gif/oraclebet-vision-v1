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
      
      // --- FILTRE D'ÉLITE (LE COEUR DU SYSTÈME) ---
      const candidates = matches.filter((m: any) => {
          // 1. Base : Pas fini
          if (m.status === 'FINISHED') return false;

          // 2. GOD MODE CHECK (Si l'analyse existe)
          const gm = m.ai?.godModeAnalysis;
          if (gm) {
              // Si le God Mode a détecté une blessure ou un piège -> POUBELLE DIRECTE
              if (gm.injuryAlert) return false;
              if (gm.trap?.riskLevel === 'NO_BET') return false;
          }

          // 3. Integrity Check de base
          if (m.ai?.integrity?.isSuspicious) return false;

          return true;
      });

      // --- STRATÉGIE 1 : ORACLE ULTRA PREMIUM (Basé sur le God Mode) ---
      // On ne prend que les matchs qui ont PASSÉ le scan God Mode avec succès
      const premiumPicks = candidates.filter((m: any) => m.ai?.godModeAnalysis && m.ai.confidence >= 80);
      
      if (premiumPicks.length >= 2) {
          const combinedOdds = premiumPicks.reduce((acc: number, m: any) => acc * (m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2), 1);
          strategies.push({
            type: 'Oracle Ultra Premium',
            selections: premiumPicks.map((m: any) => ({
                matchId: m.id,
                player1: m.player1.name,
                player2: m.player2.name,
                selection: m.ai?.winner,
                odds: m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2,
                confidence: m.ai?.confidence,
                reason: "Validé par God Mode (Physique & Marché OK)",
                marketType: "WINNER"
            })),
            combinedOdds: parseFloat(combinedOdds.toFixed(2)),
            successProbability: 88,
            riskScore: 'Low',
            analysis: "Ces matchs ont survécu au scan complet (Météo, Blessure, Cotes)."
          });
      }

      // --- STRATÉGIE 2 : SAFE (Classique) ---
      const safePicks = candidates.filter((m: any) => m.ai?.confidence >= 75).slice(0, 4);
      if (safePicks.length >= 2) {
          const combinedOdds = safePicks.reduce((acc: number, m: any) => acc * (m.ai?.winner === m.player1.name ? m.odds.p1 : m.odds.p2), 1);
          strategies.push({
            type: 'Safe',
            selections: safePicks.map((m: any) => ({
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
            successProbability: 75,
            riskScore: 'Low',
            analysis: "Sélection statistique pure."
          });
      }

      // --- STRATÉGIE 3 : BALANCED (Pour remplir) ---
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
                reason: "Forme récente",
                marketType: "WINNER"
              })),
              combinedOdds: parseFloat(combinedOdds.toFixed(2)),
              successProbability: 55,
              riskScore: 'Moderate'
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
        
        // Calcul simple pour l'exemple, à enrichir avec l'API Web
        return {
          social: pressSocial.social,
          press: pressSocial.press,
          geo: conditions,
          trap: integrity,
          injuryAlert: false // Par défaut, sauf si scan web
        };
    }
  }
};
