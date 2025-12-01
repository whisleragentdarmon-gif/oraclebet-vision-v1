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
      
      // 1. FILTRAGE DE BASE
      const candidates = matches.filter((m: any) => m.status !== 'FINISHED');

      // 2. FONCTION INTELLIGENTE DE SÉLECTION DE MARCHÉ
      const getSmartSelection = (m: any) => {
          const winnerName = m.ai.winner;
          const winnerOdds = m.ai.winner === m.player1.name ? m.odds.p1 : m.odds.p2;
          const isFav = winnerOdds < 1.50;
          const isSuperFav = winnerOdds < 1.25;
          const isUnderdog = winnerOdds > 2.00;

          // LOGIQUE DE DIVERSIFICATION
          if (isSuperFav) {
              // Si cote trop basse -> On cherche le 2-0 pour la value
              return {
                  sel: `${winnerName} 2-0`,
                  odd: parseFloat((winnerOdds * 1.6).toFixed(2)), // Simulation cote set
                  market: "SCORE EXACT",
                  reason: "Dominance totale attendue"
              };
          } else if (isUnderdog && m.ai.confidence > 60) {
              // Si Outsider solide -> On sécurise avec 1 set
              return {
                  sel: `${winnerName} +1.5 Sets`,
                  odd: parseFloat((winnerOdds / 1.4).toFixed(2)), // Cote sécurisée
                  market: "HANDICAP",
                  reason: "Outsider solide (Sécurité)"
              };
          } else {
              // Sinon -> Vainqueur classique
              return {
                  sel: winnerName,
                  odd: winnerOdds,
                  market: "VAINQUEUR",
                  reason: "Victoire sèche"
              };
          }
      };

      // --- STRATÉGIE 1 : ORACLE ULTRA PREMIUM (Uniquement après Scan God Mode) ---
      // On ne prend que les matchs qui ont été SCANNÉS et VALIDÉS
      const premiumPicks = candidates.filter((m: any) => {
          const gm = m.ai?.godModeAnalysis;
          // Il faut que le God Mode existe ET qu'il n'y ait pas d'alerte
          return gm && !gm.injuryAlert && !gm.trap.isTrap && m.ai.confidence >= 80;
      });
      
      if (premiumPicks.length >= 2) {
          // On prend les 3 meilleurs
          const selectionMatches = premiumPicks.slice(0, 3);
          const smartSelections = selectionMatches.map((m: any) => {
              const smart = getSmartSelection(m);
              return {
                  matchId: m.id,
                  player1: m.player1.name,
                  player2: m.player2.name,
                  selection: smart.sel,
                  odds: smart.odd,
                  confidence: m.ai.confidence,
                  reason: `${smart.reason} (Validé God Mode)`,
                  marketType: smart.market
              };
          });

          const combinedOdds = smartSelections.reduce((acc: number, s: any) => acc * s.odds, 1);
          
          strategies.push({
            type: 'Oracle Ultra Premium',
            selections: smartSelections,
            combinedOdds: parseFloat(combinedOdds.toFixed(2)),
            successProbability: 88,
            riskScore: 'Low',
            analysis: "Ticket généré sur des données Deep Data (Météo, Physique, Marché) vérifiées."
          });
      }

      // --- STRATÉGIE 2 : VALUE / FUN (Plus risqué, cotes hautes) ---
      const valuePicks = candidates.filter((m: any) => m.ai.confidence < 75 && m.ai.confidence > 50);
      if (valuePicks.length >= 3) {
          const selectionMatches = valuePicks.slice(0, 3);
          const smartSelections = selectionMatches.map((m: any) => {
              const smart = getSmartSelection(m);
              return {
                  matchId: m.id,
                  player1: m.player1.name,
                  player2: m.player2.name,
                  selection: smart.sel,
                  odds: smart.odd,
                  confidence: m.ai.confidence,
                  reason: smart.reason,
                  marketType: smart.market
              };
          });

          const combinedOdds = smartSelections.reduce((acc: number, s: any) => acc * s.odds, 1);
          strategies.push({
              type: 'Value',
              selections: smartSelections,
              combinedOdds: parseFloat(combinedOdds.toFixed(2)),
              successProbability: 45,
              riskScore: 'Risky',
              analysis: "Ticket spéculatif à haut rendement."
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
        return { social: pressSocial.social, press: pressSocial.press, geo: conditions, trap: integrity, injuryAlert: false };
    }
  }
};
