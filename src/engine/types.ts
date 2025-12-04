import { Circuit, SimulationResult, ComboStrategy, GodModeReportV2 } from './types';
import { MonteCarlo } from './MonteCarlo'; 
import { OddsEngine } from './OddsEngine'; 
import { LearningModule } from './LearningModule';
import { ScandalEngine } from './market/ScandalEngine';
import { TrapDetector } from './market/TrapDetector';
import { GeoEngine } from './market/GeoEngine';

const learningInstance = new LearningModule();

export const OracleAI = {
  bankroll: {
    calculateStake: (balance: number, strategyType: string): number => {
      if (balance <= 0) return 0;
      let percentage = 0.01;
      switch (strategyType) {
          case 'Oracle Ultra Premium': percentage = 0.05; break;
          case 'Safe': percentage = 0.03; break;
          case 'Balanced': percentage = 0.02; break;
          case 'Value': percentage = 0.015; break;
          case 'Lotto': percentage = 0.005; break;
          case 'HighConf': percentage = 0.025; break;
          default: percentage = 0.01;
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

      const getSmartSelection = (m: any) => {
          const winnerName = m.ai.winner;
          const winnerOdds = m.ai.winner === m.player1.name ? m.odds.p1 : m.odds.p2;
          
          if (winnerOdds < 1.40) {
              return { sel: `${winnerName} 2-0`, odd: parseFloat((winnerOdds * 1.55).toFixed(2)), market: "SCORE EXACT", reason: "Ultra Favori" };
          } else if (winnerOdds > 2.10) {
              return { sel: `${winnerName} +1.5 Sets`, odd: parseFloat((winnerOdds / 1.5).toFixed(2)), market: "HANDICAP", reason: "Outsider Sécurisé" };
          } else {
              return { sel: winnerName, odd: winnerOdds, market: "VAINQUEUR", reason: "Victoire sèche" };
          }
      };

      // 1. ULTRA PREMIUM
      const premiumPicks = candidates.filter((m: any) => {
          const gm = m.ai?.godModeAnalysis;
          return gm && !gm.injuryAlert && !gm.trap.isTrap && m.ai.confidence >= 70;
      });

      if (premiumPicks.length >= 1) {
          const selections = premiumPicks.slice(0, 3).map((m: any) => {
              const s = getSmartSelection(m);
              return { matchId: m.id, player1: m.player1.name, player2: m.player2.name, selection: s.sel, odds: s.odd, confidence: m.ai.confidence, reason: s.reason, marketType: s.market };
          });
          const odds = selections.reduce((acc: number, s: any) => acc * s.odds, 1);
          strategies.push({ type: 'Oracle Ultra Premium', selections, combinedOdds: parseFloat(odds.toFixed(2)), successProbability: 85, riskScore: 'Low', analysis: "Ticket Elite Validé God Mode." });
      }

      // 2. VALUE
      const valuePicks = candidates.filter((m: any) => m.ai.confidence > 50 && m.ai.confidence < 75);
      if (valuePicks.length >= 2) {
           const selections = valuePicks.slice(0, 3).map((m: any) => {
             const s = getSmartSelection(m);
             return { matchId: m.id, player1: m.player1.name, player2: m.player2.name, selection: s.sel, odds: s.odd, confidence: m.ai.confidence, reason: "Value", marketType: s.market };
          });
          const odds = selections.reduce((acc: number, s: any) => acc * s.odds, 1);
          strategies.push({ type: 'Value', selections, combinedOdds: parseFloat(odds.toFixed(2)), successProbability: 45, riskScore: 'Risky', analysis: "Opportunités de marché." });
      }

      // 3. LOTTO
      const lottoCandidates = candidates.slice(0, 6);
      if (lottoCandidates.length >= 4) {
          const selections = lottoCandidates.map((m: any) => {
              const s = getSmartSelection(m);
              return { matchId: m.id, player1: m.player1.name, player2: m.player2.name, selection: s.sel, odds: s.odd, confidence: m.ai.confidence, reason: "Loto", marketType: s.market };
          });
          const odds = selections.reduce((acc: number, s: any) => acc * s.odds, 1);
          strategies.push({ type: 'Lotto', selections, combinedOdds: parseFloat(odds.toFixed(2)), successProbability: 10, riskScore: 'High', analysis: "Ticket Jackpot." });
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
    },

    // 👇 C'EST ICI LA NOUVELLE FONCTION POUR LE TABLEAU V2
    refinePrediction: (report: GodModeReportV2) => {
        // On lit les valeurs que tu as pu modifier manuellement
        const p1Form = parseInt(report.p1.form) || 5;
        const p2Form = parseInt(report.p2.form) || 5;
        
        // Calcul du score de base (50 = égalité)
        let score = 50;

        // Impact Forme (Très important)
        score += (p1Form - p2Form) * 4;

        // Impact Motivation (Si détecté)
        if (report.p1.motivation.toLowerCase().includes('haute')) score += 5;
        if (report.p2.motivation.toLowerCase().includes('haute')) score -= 5;

        // Impact Blessure
        if (report.p1.injury.toLowerCase().includes('oui') || report.p1.injury.toLowerCase().includes('genou')) score -= 15;
        if (report.p2.injury.toLowerCase().includes('oui') || report.p2.injury.toLowerCase().includes('genou')) score += 15;

        // Résultat
        const winner = score >= 50 ? report.identity.p1Name : report.identity.p2Name;
        const confidence = Math.min(99, Math.max(1, Math.abs(score - 50) * 2 + 50));
        
        return {
            winner,
            confidence: Math.round(confidence),
            risk: confidence > 80 ? 'LOW' : 'MEDIUM',
            // On génère le texte pour mettre à jour le bas du tableau
            recoWinner: `${winner} ${confidence > 75 ? '2-0' : ''}`
        };
    }
  }
};
