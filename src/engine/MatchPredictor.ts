
import { MonteCarloSimulator } from './MonteCarlo';
import { LearningModule } from './LearningModule';
import { StatModels } from './StatModels';
import { TrapDetector } from './TrapDetector';
import { IntegrityMonitor } from './IntegrityMonitor';
import { CircuitHelper } from './CircuitHelper';
import { OddsEngine } from './OddsEngine';
import { DetailedPrediction, PlayerAttributes, PlayerStyle, Circuit } from './types';
import { Match, Player } from '../types';

/**
 * The BRAIN.
 * Orchestrates the prediction process using all modules.
 */
export class MatchPredictor {
  private mc: MonteCarloSimulator;
  public learning: LearningModule; 
  private trap: TrapDetector;
  private integrity: IntegrityMonitor;
  private oddsEngine: OddsEngine;

  constructor() {
    this.mc = new MonteCarloSimulator(10000); // 10k runs for Premium accuracy
    this.learning = new LearningModule();
    this.trap = new TrapDetector();
    this.integrity = new IntegrityMonitor();
    this.oddsEngine = new OddsEngine();
  }

  public predictMatch(player1: Player, player2: Player, surface: string = 'Hard', marketOddsP1: number = 1.90, tournamentName: string = "Unknown"): DetailedPrediction {
    // 1. Detect Circuit & Get Modifiers
    const circuit = CircuitHelper.detectCircuit(tournamentName);
    const circuitWeights = CircuitHelper.getCircuitWeights(circuit, this.learning.getWeights());
    const simModifiers = CircuitHelper.getSimulationModifiers(circuit);

    // 2. Generate Detailed Attributes (Affected by circuit)
    const p1Stats = this.simulatePlayerStats(player1, surface, circuit);
    const p2Stats = this.simulatePlayerStats(player2, surface, circuit);

    // 3. Base Probability (Logit Model) - SECTION 1: Fair Odds Engine
    // We use weighted factors adjusted by the Learning Module
    const p1Score = (p1Stats.power * 0.2) + (p1Stats.serve * 0.25) + (p1Stats.form * circuitWeights.formWeight) + (p1Stats.mental * circuitWeights.mentalWeight) - (p1Stats.fatigue * circuitWeights.fatigueFactor);
    const p2Score = (p2Stats.power * 0.2) + (p2Stats.serve * 0.25) + (p2Stats.form * circuitWeights.formWeight) + (p2Stats.mental * circuitWeights.mentalWeight) - (p2Stats.fatigue * circuitWeights.fatigueFactor);

    const baseWinProbA = p1Score / (p1Score + p2Score);

    // 4. Monte Carlo Simulation (10,000 runs) - SECTION 6
    const p1ServeGameProb = (0.50 + ((p1Stats.serve - 50) / 200)) * simModifiers.serveDominance * circuitWeights.serveDominance; 
    const p2ServeGameProb = (0.50 + ((p2Stats.serve - 50) / 200)) * simModifiers.serveDominance * circuitWeights.serveDominance;
    
    const simResult = this.mc.runSimulation(p1ServeGameProb, p2ServeGameProb, simModifiers.variance + circuitWeights.variance);

    // 5. Merge Probabilities (Base + Monte Carlo)
    const mergeFactor = (circuit === 'ITF' || circuit === 'CHALLENGER') ? 0.80 : 0.65;
    const finalProbA = (baseWinProbA * (1 - mergeFactor)) + (simResult.player1WinRate * mergeFactor);
    const finalProbB = 1 - finalProbA;
    const confidence = parseFloat((Math.max(finalProbA, finalProbB) * 100).toFixed(0));

    // 6. Fair Odds Calculation
    const fairOdds = StatModels.calculateFairOdds(finalProbA, finalProbB);
    const winnerName = finalProbA > 0.5 ? player1.name : player2.name;

    // 7. Security Modules (Trap & Integrity)
    const trapResult = this.trap.analyze(fairOdds.p1, marketOddsP1, confidence, player1.name);
    const integrityResult = this.integrity.checkIntegrity(player1, player2, p1Stats, p2Stats, circuit);

    // 8. ODDS ENGINE ANALYSIS - SECTIONS 2, 3, 4, 5
    // Create a realistic market spread for P2 based on implied P1
    const marketOddsP2 = parseFloat((1 / (1/0.95 - 1/marketOddsP1)).toFixed(2));
    const oddsAnalysis = this.oddsEngine.analyzeOdds(marketOddsP1, marketOddsP2, fairOdds.p1, fairOdds.p2);

    // 9. Determine Market Recommendation
    let recommendedBet = "";
    let marketType: any = 'WINNER';

    if (trapResult.verdict === 'Piège' || integrityResult.status === 'Danger') {
        recommendedBet = "PASSER (Risque Détecté)";
    } else {
        if (confidence > 80 && simResult.stats.setDistribution["2-0"] > 0.5) {
            recommendedBet = `${winnerName} 2-0`;
            marketType = 'SETS';
        } else if (simResult.totalGamesProj > 22.5 && Math.abs(finalProbA - 0.5) < 0.1) {
            recommendedBet = "Plus de 22.5 Jeux";
            marketType = 'GAMES';
        } else {
            if (finalProbA > 0.55) recommendedBet = `${winnerName} Gagne`;
            else recommendedBet = "No Bet (Trop Incertain)";
        }
    }

    // 10. Analysis Text - SECTION 7
    const analysis = this.generateAnalysisText(player1, player2, p1Stats, p2Stats, simResult, finalProbA, trapResult, integrityResult, circuit, recommendedBet);
    const riskLevel = confidence > 75 ? 'Safe' : (confidence < 60 ? 'Risky' : 'Moderate');

    return {
      winner: winnerName,
      winnerProbability: parseFloat((Math.max(finalProbA, finalProbB) * 100).toFixed(1)),
      winProbA: parseFloat(finalProbA.toFixed(2)),
      winProbB: parseFloat(finalProbB.toFixed(2)),
      expectedSets: simResult.mostLikelyScore,
      tieBreakProbability: parseFloat((simResult.tieBreakLikelihood * 100).toFixed(1)),
      breaks: { 
          p1: parseFloat(simResult.stats.breakDistribution.p1.toFixed(1)), 
          p2: parseFloat(simResult.stats.breakDistribution.p2.toFixed(1)) 
      },
      totalGamesProjection: parseFloat(simResult.totalGamesProj.toFixed(1)),
      fairOdds,
      confidence,
      circuit,
      marketType,
      recommendedBet,
      riskLevel,
      
      structuralAnalysis: analysis.structural,
      quantitativeAnalysis: analysis.quantitative,
      qualitativeAnalysis: analysis.qualitative,
      analysisText: analysis.qualitative,

      attributes: [p1Stats, p2Stats],
      trap: { isTrap: trapResult.verdict === 'Piège', ...trapResult },
      integrity: { isSuspicious: integrityResult.status === 'Danger', ...integrityResult },
      monteCarlo: simResult.stats,
      oddsAnalysis
    };
  }

  private simulatePlayerStats(p: Player, surface: string, circuit: Circuit): PlayerAttributes {
    const baseSkill = 100 - (p.rank * 0.5); 
    const varianceRange = (circuit === 'ITF' || circuit === 'CHALLENGER') ? 15 : 5;
    const variance = () => (Math.random() * (varianceRange * 2)) - varianceRange;
    
    const styles: PlayerStyle[] = ['Agressif', 'Servebot', 'Grinder', 'Complet', 'Contre-Attaquant'];
    const styleIndex = p.name.charCodeAt(0) % styles.length;

    let fatigue = Math.random() * 30;
    if (circuit === 'WTA') fatigue += 10;
    if (circuit === 'CHALLENGER') fatigue += 15;

    let mental = Math.min(99, Math.max(40, baseSkill + variance()));
    if (circuit === 'ITF') mental -= 15;

    return {
      power: Math.min(99, Math.max(50, baseSkill + variance())),
      serve: Math.min(99, Math.max(50, baseSkill + variance() - (surface === 'Clay' ? 10 : 0))),
      return: Math.min(99, Math.max(50, baseSkill + variance())),
      mental: mental,
      form: Math.min(99, Math.max(50, baseSkill + (Math.random() * 20) - 10)),
      fatigue: fatigue,
      style: styles[styleIndex]
    };
  }

  private generateAnalysisText(p1: Player, p2: Player, s1: PlayerAttributes, s2: PlayerAttributes, sim: any, probA: number, trap: any, integrity: any, circuit: Circuit, recommendation: string) {
    const winner = probA > 0.5 ? p1.name : p2.name;
    const circuitLabel = CircuitHelper.getCircuitLabel(circuit);
    const winPercent = (Math.max(probA, 1-probA)*100).toFixed(1);

    // 1. Structural Analysis
    let structural = `CONTEXTE ${circuitLabel}: Duel de styles. ${p1.name} (${s1.style}) affronte ${p2.name} (${s2.style}). `;
    structural += Math.abs(s1.form - s2.form) > 15 ? `\n\n📈 Avantage de forme net pour le joueur le plus en confiance (+${Math.abs(s1.form - s2.form).toFixed(0)} pts).` : `\n\n⚖️ Formes du moment équivalentes.`;
    if (circuit === 'WTA') structural += `\nFacteur Clé: La capacité à tenir son service sera déterminante (WTA variance).`;
    
    // 2. Quantitative Analysis
    let quantitative = `SIMULATION 10 000 RUNS (Monte Carlo):\n`;
    quantitative += `• Scénario probable : ${sim.mostLikelyScore} (${(sim.stats.setDistribution[sim.mostLikelyScore]*100).toFixed(0)}%)\n`;
    quantitative += `• Espérance de gain : ${winPercent}% pour ${winner}.\n`;
    quantitative += `• Durée estimée : ${sim.totalGamesProj > 23 ? 'Longue (Over 22.5)' : 'Courte'}.\n`;
    quantitative += `• Risque Tie-Break : ${(sim.tieBreakLikelihood*100).toFixed(0)}%.`;

    // 3. Qualitative Analysis
    let qualitative = `ANALYSE IA AVANCÉE:\n`;
    qualitative += `- Service : ${s1.serve > s2.serve ? p1.name : p2.name} domine (+${Math.abs(s1.serve - s2.serve).toFixed(0)}%).\n`;
    qualitative += `- Retour : ${s1.return > s2.return ? p1.name : p2.name} plus performant (+${Math.abs(s1.return - s2.return).toFixed(0)}%).\n`;
    qualitative += `- Fatigue : ${s1.fatigue < s2.fatigue ? 'Avantage ' + p1.name : 'Avantage ' + p2.name}.\n`;
    
    if (trap.verdict === 'Piège') qualitative += `\n⚠️ ALERTE PIÈGE BOOKMAKER: ${trap.reason}\n`;
    if (integrity.status === 'Danger') qualitative += `\n🚨 SUSPICION: ${integrity.reason}\n`;
    
    qualitative += `\n🎯 RECOMMANDATION : ${recommendation.toUpperCase()}`;

    return { structural, quantitative, qualitative };
  }
}
