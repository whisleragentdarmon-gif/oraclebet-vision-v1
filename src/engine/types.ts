import { Circuit, SimulationResult, ComboStrategy, GodModeReportV2 } from './types';
import { MonteCarlo } from './MonteCarlo'; 
import { OddsEngine } from './OddsEngine'; 
import { LearningModule } from './LearningModule';
import { ScandalEngine } from './market/ScandalEngine';
import { TrapDetector } from './market/TrapDetector';
import { GeoEngine } from './market/GeoEngine';

const learningInstance = new LearningModule();

// Helper pour extraire un chiffre d'un texte (ex: "8/10" -> 8)
const parseScore = (val: string | undefined): number => {
    if (!val) return 5;
    const match = val.toString().match(/(\d+)/);
    return match ? parseInt(match[1]) : 5;
};

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
          
          if (winnerOdds < 1.40) return { sel: `${winnerName} 2-0`, odd: parseFloat((winnerOdds * 1.55).toFixed(2)), market: "SCORE EXACT", reason: "Ultra Favori" };
          if (winnerOdds > 2.10) return { sel: `${winnerName} +1.5 Sets`, odd: parseFloat((winnerOdds / 1.5).toFixed(2)), market: "HANDICAP", reason: "Outsider Sécurisé" };
          return { sel: winnerName, odd: winnerOdds, market: "VAINQUEUR", reason: "Victoire sèche" };
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
          strategies.push({ type: 'Oracle Ultra Premium', selections, combinedOdds: parseFloat(odds.toFixed(2)), successProbability: 85, riskScore: 'Low', analysis: "Ticket Elite." });
      }

      // 2. VALUE
      const valuePicks = candidates.filter((m: any) => m.ai.confidence > 50 && m.ai.confidence < 75);
      if (valuePicks.length >= 2) {
           const selections = valuePicks.slice(0, 3).map((m: any) => {
             const s = getSmartSelection(m);
             return { matchId: m.id, player1: m.player1.name, player2: m.player2.name, selection: s.sel, odds: s.odd, confidence: m.ai.confidence, reason: "Value", marketType: s.market };
          });
          const odds = selections.reduce((acc: number, s: any) => acc * s.odds, 1);
          strategies.push({ type: 'Value', selections, combinedOdds: parseFloat(odds.toFixed(2)), successProbability: 45, riskScore: 'Risky', analysis: "Opportunités." });
      }

      // 3. LOTTO
      const lottoCandidates = candidates.slice(0, 6);
      if (lottoCandidates.length >= 4) {
          const selections = lottoCandidates.map((m: any) => {
              const s = getSmartSelection(m);
              return { matchId: m.id, player1: m.player1.name, player2: m.player2.name, selection: s.sel, odds: s.odd, confidence: m.ai.confidence, reason: "Loto", marketType: s.market };
          });
          const odds = selections.reduce((acc: number, s: any) => acc * s.odds, 1);
          strategies.push({ type: 'Lotto', selections, combinedOdds: parseFloat(odds.toFixed(2)), successProbability: 10, riskScore: 'High', analysis: "Jackpot." });
      }

      return strategies;
    }
  },
  predictor: {
    learning: {
      learnFromMatch: (isWin: boolean, data: any, id: string) => learningInstance.learnFromMatch(isWin, data, id),
      getStats: () => learningInstance.getLearningStats(),
      retrain: (history: any[]) => learningInstance.retrainModelFromHistory(history)
    },
    analyzeOdds: (p1: string, p2: string, o1: number, o2: number) => OddsEngine.analyze(p1, p2, o1, o2),
    runGodModeAnalysis: (match: any) => {
        const pressSocial = ScandalEngine.analyze(match.player1.name);
        const integrity = TrapDetector.scan(match.odds);
        const conditions = GeoEngine.getConditions(match.tournament);
        return { social: pressSocial.social, press: pressSocial.press, geo: conditions, trap: integrity, injuryAlert: false };
    },
    // 👇 C'EST ICI LA CORRECTION POUR CORRESPONDRE À AnalysisPage.tsx
    refinePrediction: (report: GodModeReportV2) => {
        try {
            const p1Form = parseScore(report.p1.form);
            const p2Form = parseScore(report.p2.form);
            const motivText = (report.p1.motivation || "").toLowerCase();
            const injuryText = (report.p1.injury || "").toLowerCase();

            let score = 50;
            score += (p1Form - p2Form) * 4;

            if (motivText.includes('haute') || motivText.includes('high')) score += 5;
            if (injuryText.match(/oui|yes|genou|dos/i)) score -= 15;

            const confidence = Math.min(99, Math.max(1, Math.abs(score - 50) * 2 + 50));
            const winner = score >= 50 ? report.identity.p1Name : report.identity.p2Name;
            
            // On renvoie l'objet plat attendu par AnalysisPage
            return {
                winner,
                confidence: Math.round(confidence),
                risk: confidence > 80 ? 'LOW' : 'MEDIUM',
                recoWinner: `${winner} ${confidence > 75 ? 'Vainqueur' : ''}`,
                // On laisse updatedPredictionSection pour la compatibilité arrière si besoin
                updatedPredictionSection: {
                    winner,
                    confidence: `${Math.round(confidence)}%`,
                    risk: confidence > 80 ? 'LOW' : 'MEDIUM',
                    probA: `${Math.round(score)}%`,
                    probB: `${Math.round(100 - score)}%`,
                    bestBet: `${winner}`,
                    recoWinner: `${winner}`
                }
            };
        } catch (e) {
            console.error("Erreur refinePrediction", e);
            return { 
                winner: report.identity.p1Name, 
                confidence: 50, 
                risk: 'HIGH', 
                recoWinner: "Erreur Analyse",
                updatedPredictionSection: {} 
            };
        }
    }
  }
};
