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

      // --- MOTEUR DE DIVERSIFICATION DES PARIS ---
      const getSmartSelection = (m: any) => {
          const winnerName = m.ai.winner;
          const winnerOdds = m.ai.winner === m.player1.name ? m.odds.p1 : m.odds.p2;
          
          // Simulation mathématique des marchés annexes
          // Si super favori (< 1.40) -> On joue le 2-0 pour avoir une cote décente
          if (winnerOdds < 1.40) {
              return {
                  sel: `${winnerName} gagne 2-0`,
                  odd: parseFloat((winnerOdds * 1.55).toFixed(2)),
                  market: "SCORE EXACT",
                  reason: "Ultra Favori (Boost Cote)"
              };
          } 
          // Si outsider (> 2.10) -> On sécurise avec le set handicap
          else if (winnerOdds > 2.10) {
              return {
                  sel: `${winnerName} +1.5 Sets`,
                  odd: parseFloat((winnerOdds / 1.5).toFixed(2)),
                  market: "HANDICAP SET",
                  reason: "Outsider Sécurisé"
              };
          } 
          // Si match équilibré (entre 1.70 et 2.10) -> On joue l'Over jeux
          else if (winnerOdds >= 1.70 && winnerOdds <= 2.10) {
              return {
                  sel: "Over 21.5 Jeux",
                  odd: 1.85, // Cote standard over
                  market: "TOTAL JEUX",
                  reason: "Match serré prévu"
              };
          }
          // Sinon Vainqueur simple
          return {
              sel: winnerName,
              odd: winnerOdds,
              market: "VAINQUEUR",
              reason: "Victoire sèche"
          };
      };

      // 1. ULTRA PREMIUM (Seuil abaissé à 70% pour avoir plus de résultats)
      const premiumPicks = candidates.filter((m: any) => {
          const gm = m.ai?.godModeAnalysis;
          // Doit avoir été scanné, pas d'alerte, et confiance correcte
          return gm && !gm.injuryAlert && !gm.trap.isTrap && m.ai.confidence >= 70;
      });

      if (premiumPicks.length >= 1) { // Dès 1 match on propose
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
                  reason: smart.reason,
                  marketType: smart.market
              };
          });

          const combinedOdds = smartSelections.reduce((acc: number, s: any) => acc * s.odds, 1);
          
          strategies.push({
            type: 'Oracle Ultra Premium',
            selections: smartSelections,
            combinedOdds: parseFloat(combinedOdds.toFixed(2)),
            successProbability: 85,
            riskScore: 'Low',
            analysis: `Ticket Elite généré sur ${smartSelections.length} matchs validés par le God Mode.`
          });
      }

      // 2. VALUE (Diversifié aussi)
      const valuePicks = candidates.filter((m: any) => m.ai.confidence > 50 && m.ai.confidence < 75);
      if (valuePicks.length >= 2) {
           const sel = valuePicks.slice(0, 3).map((m: any) => {
             const smart = getSmartSelection(m);
             return {
                matchId: m.id, player1: m.player1.name, player2: m.player2.name, 
                selection: smart.sel, odds: smart.odd, confidence: m.ai.confidence, 
                reason: "Value", marketType: smart.market
             };
          });
          strategies.push({ type: 'Value', selections: sel, combinedOdds: sel.reduce((acc:any, s:any)=>acc*s.odds,1), successProbability: 45, riskScore: 'Risky', analysis: "Cotes mal ajustées." });
      }

      // 3. LOTO (Melange tout)
      const lottoCandidates = candidates.slice(0, 6); // On prend 6 matchs
      if (lottoCandidates.length >= 4) {
          const selections = lottoCandidates.map((m: any) => {
              const smart = getSmartSelection(m);
              return {
                  matchId: m.id, player1: m.player1.name, player2: m.player2.name,
                  selection: smart.sel, odds: smart.odd, confidence: m.ai.confidence,
                  reason: "Ticket Loto", marketType: smart.market
              };
          });
          const totalOdds = selections.reduce((acc: number, s: any) => acc * s.odds, 1);
          strategies.push({ type: 'Lotto', selections: selections, combinedOdds: parseFloat(totalOdds.toFixed(2)), successProbability: 10, riskScore: 'High', analysis: "Jackpot." });
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
