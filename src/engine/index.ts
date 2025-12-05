import { Circuit, SimulationResult, ComboStrategy, GodModeReportV2, RefinedPrediction, PredictionSection } from './types';
import { MonteCarlo } from './MonteCarlo'; 
import { OddsEngine } from './OddsEngine'; 
import { LearningModule } from './LearningModule';
import { ScandalEngine } from './market/ScandalEngine';
import { TrapDetector } from './market/TrapDetector';
import { GeoEngine } from './market/GeoEngine';

const learningInstance = new LearningModule();

// Helper pour extraire les chiffres des textes (ex: "82% (Top)" -> 82)
const parseVal = (val: string | undefined): number => {
    if (!val) return 50;
    const match = val.toString().match(/(\d+)/);
    return match ? parseInt(match[1]) : 50;
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

      // Logique Combinés (inchangée pour l'instant, focus sur l'analyse)
      // ... (Je garde ta logique précédente pour les combinés)
      const getSmartSelection = (m: any) => {
          const winnerOdds = m.ai.winner === m.player1.name ? m.odds.p1 : m.odds.p2;
          if (winnerOdds < 1.40) return { sel: `${m.ai.winner} 2-0`, odd: parseFloat((winnerOdds * 1.55).toFixed(2)), market: "SCORE EXACT", reason: "Ultra Favori" };
          return { sel: m.ai.winner, odd: winnerOdds, market: "VAINQUEUR", reason: "Victoire sèche" };
      };

      const premiumPicks = candidates.filter((m: any) => m.ai?.godModeAnalysis && m.ai.confidence >= 70);
      if (premiumPicks.length >= 2) {
          const selections = premiumPicks.slice(0, 3).map((m: any) => {
              const s = getSmartSelection(m);
              return { matchId: m.id, player1: m.player1.name, player2: m.player2.name, selection: s.sel, odds: s.odd, confidence: m.ai.confidence, reason: s.reason, marketType: s.market };
          });
          strategies.push({ type: 'Oracle Ultra Premium', selections, combinedOdds: 3.5, successProbability: 85, riskScore: 'Low', analysis: "Ticket Elite." });
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
    
    // 🔥 LE CERVEAU ANALYTIQUE COMPLET 🔥
    refinePrediction: (report: GodModeReportV2): RefinedPrediction => {
        try {
            // 1. EXTRACTION DES DONNÉES DU TABLEAU
            const p1Rank = parseVal(report.p1.rank);
            const p2Rank = parseVal(report.p2.rank);
            const p1Form = parseVal(report.p1.form); // Sur 10
            const p2Form = parseVal(report.p2.form); // Sur 10
            const p1Serve = parseVal(report.p1.firstServe); // %
            const p2Serve = parseVal(report.p2.firstServe); // %
            const h2hScore = report.h2h.global; // ex "3 - 1"
            
            let scoreP1 = 50; // Base neutre

            // 2. PONDÉRATION AVANCÉE

            // -- Classement (Moins important si surface spécifique) --
            if (p1Rank < p2Rank) scoreP1 += 5; else scoreP1 -= 5;

            // -- Forme du moment (Critique) --
            scoreP1 += (p1Form - p2Form) * 3; 

            // -- H2H (Psychologique) --
            const [h1, h2] = h2hScore.split('-').map(s => parseInt(s) || 0);
            if (h1 > h2) scoreP1 += 5;
            if (h2 > h1) scoreP1 -= 5;

            // -- Motivation & Blessure --
            const motivP1 = report.p1.motivation.toLowerCase();
            const injuryP1 = report.p1.injury.toLowerCase();
            
            if (motivP1.includes('haute') || motivP1.includes('max')) scoreP1 += 4;
            if (motivP1.includes('faible') || motivP1.includes('low')) scoreP1 -= 6; // Tanking risk
            if (injuryP1.includes('oui') || injuryP1.includes('genou') || injuryP1.includes('dos')) scoreP1 -= 15; // Grosse pénalité

            // 3. DÉCISION DU MARCHÉ (Over, Winner, Handicap)
            let recommendedBet = "";
            let marketType = "";
            const confidence = Math.min(99, Math.max(1, Math.abs(scoreP1 - 50) * 2 + 50));
            const winner = scoreP1 >= 50 ? report.identity.p1Name : report.identity.p2Name;

            // SCÉNARIO 1 : GROS SERVEURS (Over Jeux)
            // Si les deux ont > 70% au service et surface rapide
            const isFastSurface = report.identity.surface.toLowerCase().includes('dur') || report.identity.surface.toLowerCase().includes('grass');
            if (p1Serve > 65 && p2Serve > 65 && isFastSurface && Math.abs(scoreP1 - 50) < 10) {
                recommendedBet = "Over 22.5 Jeux";
                marketType = "TOTAL JEUX";
            }
            // SCÉNARIO 2 : ULTRA FAVORI (Score Exact)
            else if (confidence > 80) {
                recommendedBet = `${winner} 2-0`;
                marketType = "SCORE EXACT";
            }
            // SCÉNARIO 3 : OUTSIDER SOLIDE (Handicap)
            else if (confidence < 55) {
                // Match trop serré -> On sécurise le favori ou l'outsider
                recommendedBet = `${winner} +1.5 Sets`;
                marketType = "HANDICAP SET";
            }
            // SCÉNARIO 4 : STANDARD
            else {
                recommendedBet = `${winner} Vainqueur`;
                marketType = "VAINQUEUR";
            }

            // ✅ 4. RETOUR COMPLET - TYPE RefinedPrediction
            const result: RefinedPrediction = {
                // Champs à la racine (pour AnalysisPage)
                confidence: Math.round(confidence),
                winner: winner,
                risk: confidence > 75 ? 'LOW' : confidence < 45 ? 'HIGH' : 'MEDIUM',
                recoWinner: recommendedBet,
                
                // Objet imbriqué (structure complète pour affichage tableau)
                updatedPredictionSection: {
                    probA: `${Math.round(scoreP1)}%`,
                    probB: `${Math.round(100 - scoreP1)}%`,
                    risk: confidence > 75 ? 'FAIBLE' : confidence < 45 ? 'ÉLEVÉ' : 'MOYEN',
                    recoWinner: recommendedBet
                }
            };

            return result;

        } catch (e) {
            console.error("Erreur calcul IA", e);
            
            // ✅ RETOUR ERROR - Même structure
            const errorResult: RefinedPrediction = {
                confidence: 50,
                winner: report.identity.p1Name,
                risk: 'HIGH',
                recoWinner: "Données insuffisantes",
                updatedPredictionSection: {
                    probA: "50%",
                    probB: "50%",
                    risk: "ÉLEVÉ",
                    recoWinner: "Analyse en attente"
                }
            };

            return errorResult;
        }
    }
  }
};
