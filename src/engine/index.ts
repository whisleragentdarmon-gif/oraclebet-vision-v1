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
    // 👇 CALCUL DE MISE INTELLIGENT (Money Management)
    calculateStake: (balance: number, strategyType: string): number => {
      if (balance <= 0) return 0;
      let percentage = 0.01; // 1% par défaut

      switch (strategyType) {
          case 'Oracle Ultra Premium': percentage = 0.05; break; // 5% (Confiance Max)
          case 'Safe': percentage = 0.03; break; // 3%
          case 'Balanced': percentage = 0.02; break; // 2%
          case 'Value': percentage = 0.015; break; // 1.5%
          case 'Lotto': percentage = 0.005; break; // 0.5% (Ticket Fun)
      }
      
      return parseFloat((balance * percentage).toFixed(2));
    },
    simulateFuture: (currentBalance: number, winRate: number, avgOdds: number): SimulationResult => {
      return MonteCarlo.simulateFuture(currentBalance, winRate, avgOdds);
    }
  },
  combo: {
    generateStrategies: (matches: any[]): ComboStrategy[] => {
      const strategies: ComboStrategy[] = [];
      const candidates = matches.filter((m: any) => m.status !== 'FINISHED');

      // ... (Tes stratégies existantes : Premium, Safe, Balanced, Value) ...
      // Je remets le code Premium pour l'exemple, assure-toi de garder les autres
      
      // 1. ULTRA PREMIUM
      const premiumPicks = candidates.filter((m: any) => m.ai?.godModeAnalysis && !m.ai.godModeAnalysis.injuryAlert && !m.ai.godModeAnalysis.trap.isTrap && m.ai.confidence >= 80);
      if (premiumPicks.length >= 2) {
          const sel = premiumPicks.slice(0, 3).map((m: any) => ({
             matchId: m.id, player1: m.player1.name, player2: m.player2.name, selection: m.ai.winner, odds: m.ai.winner === m.player1.name ? m.odds.p1 : m.odds.p2, confidence: m.ai.confidence, reason: "Validé God Mode", marketType: "WINNER"
          }));
          strategies.push({ type: 'Oracle Ultra Premium', selections: sel, combinedOdds: sel.reduce((acc:any, s:any)=>acc*s.odds,1), successProbability: 85, riskScore: 'Low', analysis: "Sélection Elite." });
      }

      // 2. VALUE (Code existant simplifié)
      const valuePicks = candidates.filter((m: any) => m.ai.confidence > 50 && m.ai.confidence < 75);
      if (valuePicks.length >= 2) {
           const sel = valuePicks.slice(0, 3).map((m: any) => ({
             matchId: m.id, player1: m.player1.name, player2: m.player2.name, selection: m.ai.winner, odds: m.ai.winner === m.player1.name ? m.odds.p1 : m.odds.p2, confidence: m.ai.confidence, reason: "Value", marketType: "WINNER"
          }));
          strategies.push({ type: 'Value', selections: sel, combinedOdds: sel.reduce((acc:any, s:any)=>acc*s.odds,1), successProbability: 45, riskScore: 'Risky', analysis: "Cotes mal ajustées." });
      }

      // 👇 3. NOUVEAU : STRATÉGIE "LOTO" (Le Ticket Millionnaire)
      // On prend BEAUCOUP de matchs (6 à 8) : mélange de favoris solides et d'outsiders "possibles"
      // On cherche une cote totale > 10 ou 20
      const lottoCandidates = candidates.filter((m: any) => !m.ai?.integrity?.isSuspicious);
      
      if (lottoCandidates.length >= 5) {
          // On prend 3 favoris (base) + 3 coups de poker
          const base = lottoCandidates.filter((m:any) => m.ai.confidence > 70).slice(0, 3);
          const poker = lottoCandidates.filter((m:any) => m.ai.confidence <= 70 && m.ai.confidence > 50).slice(0, 3);
          
          const fullSelection = [...base, ...poker];

          if (fullSelection.length >= 5) {
              const selections = fullSelection.map((m: any) => ({
                  matchId: m.id,
                  player1: m.player1.name,
                  player2: m.player2.name,
                  selection: m.ai.winner, // Ou set betting si tu veux booster encore plus
                  odds: m.ai.winner === m.player1.name ? m.odds.p1 : m.odds.p2,
                  confidence: m.ai.confidence,
                  reason: m.ai.confidence > 70 ? "Base solide" : "Coup de poker",
                  marketType: "WINNER"
              }));

              const totalOdds = selections.reduce((acc: number, s: any) => acc * s.odds, 1);

              strategies.push({
                  type: 'Lotto',
                  selections: selections,
                  combinedOdds: parseFloat(totalOdds.toFixed(2)),
                  successProbability: 15, // Faible proba, logique
                  riskScore: 'High',
                  analysis: "Ticket 'Bingo' : Petite mise, gains massifs. Mélange de bases et de surprises."
              });
          }
      }

      return strategies;
    }
  },
  // ... (Reste du code predictor identique)
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
