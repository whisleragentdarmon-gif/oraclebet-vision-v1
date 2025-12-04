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
      
      const candidates = matches.filter((m: any) => 
          m.status !== 'FINISHED' && 
          !m.id.startsWith('mock-')
      );

      const getSmartSelection = (m: any) => {
          const winnerOdds = m.ai.winner === m.player1.name ? m.odds.p1 : m.odds.p2;
          if (winnerOdds < 1.40) return { sel: `${m.ai.winner} 2-0`, odd: parseFloat((winnerOdds * 1.55).toFixed(2)), market: "SCORE EXACT", reason: "Ultra Favori" };
          if (winnerOdds > 2.10) return { sel: `${m.ai.winner} +1.5 Sets`, odd: parseFloat((winnerOdds / 1.5).toFixed(2)), market: "HANDICAP", reason: "Sécurité Outsider" };
          return { sel: m.ai.winner, odd: winnerOdds, market: "VAINQUEUR", reason: "Victoire sèche" };
      };

      // 1. ULTRA PREMIUM
      const premiumPicks = candidates.filter((m: any) => m.ai?.godModeAnalysis && !m.ai.godModeAnalysis.injuryAlert && !m.ai.godModeAnalysis.trap.isTrap && m.ai.confidence >= 70);
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
    
    // ✅ NOUVELLE FONCTION: Recalculer la prédiction selon les modifications du tableau
    refinePrediction: (report: any) => {
      if (!report || !report.p1 || !report.p2) return null;

      const p1 = report.p1;
      const p2 = report.p2;
      const h2h = report.h2h || {};

      // Extraire les données modifiées
      const p1Form = parseInt(p1.form?.toString().replace('/10', '') || '5') || 5;
      const p2Form = parseInt(p2.form?.toString().replace('/10', '') || '5') || 5;
      const p1Conf = p1.confidence || 'Moyenne';
      const p2Conf = p2.confidence || 'Moyenne';
      const p1Injury = p1.injury || 'R.A.S';
      const p2Injury = p2.injury || 'R.A.S';
      const p1Fatigue = p1.fatigue || 'Aucune';
      const p2Fatigue = p2.fatigue || 'Aucune';

      // Calcul du score P1 (base 50)
      let p1Score = 50;

      // 📊 Impact Forme
      p1Score += (p1Form - p2Form) * 2;

      // 💪 Impact Confiance
      if (p1Conf.includes('Très haute')) p1Score += 8;
      else if (p1Conf.includes('Haute')) p1Score += 4;
      else if (p1Conf.includes('Basse')) p1Score -= 4;

      if (p2Conf.includes('Très haute')) p1Score -= 8;
      else if (p2Conf.includes('Haute')) p1Score -= 4;
      else if (p2Conf.includes('Basse')) p1Score += 4;

      // 🏥 Impact Blessures (MAJEUR)
      if (p1Injury && !p1Injury.includes('R.A.S') && !p1Injury.includes('Aucune')) p1Score -= 15;
      if (p2Injury && !p2Injury.includes('R.A.S') && !p2Injury.includes('Aucune')) p1Score += 15;

      // 😴 Impact Fatigue
      if (p1Fatigue.includes('Légère')) p1Score -= 3;
      else if (p1Fatigue.includes('Modérée')) p1Score -= 6;
      else if (p1Fatigue.includes('Importante')) p1Score -= 12;

      if (p2Fatigue.includes('Légère')) p1Score += 3;
      else if (p2Fatigue.includes('Modérée')) p1Score += 6;
      else if (p2Fatigue.includes('Importante')) p1Score += 12;

      // 🎾 Impact H2H
      const h2hGlobal = h2h.h2hGlobal || h2h.global || '0-0';
      const h2hParts = h2hGlobal.split('-');
      if (h2hParts.length === 2) {
        const p1Wins = parseInt(h2hParts[0]) || 0;
        const p2Wins = parseInt(h2hParts[1]) || 0;
        p1Score += (p1Wins - p2Wins) * 3;
      }

      // Clamp entre 0-100
      p1Score = Math.max(0, Math.min(100, p1Score));
      const p2Score = 100 - p1Score;

      // Confiance IA (plus l'écart est grand, plus on est confiant)
      const ecart = Math.abs(p1Score - 50);
      const confidence = 50 + (ecart * 0.8);
      const finalConfidence = Math.round(confidence);

      // Déterminer le vainqueur
      const winner = p1Score > 50 ? report.identity.p1Name : report.identity.p2Name;

      return {
        winner,
        confidence: finalConfidence,
        updatedPredictionSection: {
          winner,
          confidence: `${finalConfidence}%`,
          probA: `${Math.round(p1Score)}%`,
          probB: `${Math.round(p2Score)}%`,
          risk: finalConfidence > 80 ? 'FAIBLE' : finalConfidence > 65 ? 'MOYEN' : 'ÉLEVÉ'
        }
      };
    }
  }
};
