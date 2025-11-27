import { MonteCarloSimulator } from './MonteCarlo';
// ❌ SUPPRIMÉ : import { LearningModule } from './LearningModule';
import { StatModels } from './StatModels';
import { TrapDetector } from './TrapDetector';
import { IntegrityMonitor } from './IntegrityMonitor';
import { CircuitHelper } from './CircuitHelper';
import { OddsEngine } from './OddsEngine';
import { DetailedPrediction, PlayerAttributes, PlayerStyle, Circuit } from './types';
import { Match, Player } from '../types';

/**
 * BRAIN ENGINE without LearningModule
 */
export class MatchPredictor {
  private mc: MonteCarloSimulator;
  // ❌ this.learning removed
  private trap: TrapDetector;
  private integrity: IntegrityMonitor;
  private oddsEngine: OddsEngine;

  constructor() {
    this.mc = new MonteCarloSimulator(10000);
    // ❌ this.learning removed
    this.trap = new TrapDetector();
    this.integrity = new IntegrityMonitor();
    this.oddsEngine = new OddsEngine();
  }

  // Fausse méthode LearningModule remplacée par des poids par défaut
  private getDefaultWeights() {
    return {
      formWeight: 0.20,
      mentalWeight: 0.20,
      fatigueFactor: 0.10,
      serveDominance: 1.0,
      variance: 1.0,
    };
  }

  public predictMatch(
    player1: Player,
    player2: Player,
    surface: string = 'Hard',
    marketOddsP1: number = 1.90,
    tournamentName: string = "Unknown"
  ): DetailedPrediction {
    
    // 1. CIRCUIT DETECTION + DEFAULT WEIGHTS
    const circuit = CircuitHelper.detectCircuit(tournamentName);
    const weights = this.getDefaultWeights(); // ⬅️ instead of learning.getWeights()
    const circuitWeights = CircuitHelper.getCircuitWeights(circuit, weights);
    const simModifiers = CircuitHelper.getSimulationModifiers(circuit);

    // 2. Player Stats Simulation
    const p1Stats = this.simulatePlayerStats(player1, surface, circuit);
    const p2Stats = this.simulatePlayerStats(player2, surface, circuit);

    // 3. Probability Model
    const p1Score =
      p1Stats.power * 0.2 +
      p1Stats.serve * 0.25 +
      p1Stats.form * circuitWeights.formWeight +
      p1Stats.mental * circuitWeights.mentalWeight -
      p1Stats.fatigue * circuitWeights.fatigueFactor;

    const p2Score =
      p2Stats.power * 0.2 +
      p2Stats.serve * 0.25 +
      p2Stats.form * circuitWeights.formWeight +
      p2Stats.mental * circuitWeights.mentalWeight -
      p2Stats.fatigue * circuitWeights.fatigueFactor;

    const baseWinProbA = p1Score / (p1Score + p2Score);

    // 4. Monte Carlo
    const p1ServeGameProb =
      (0.50 + (p1Stats.serve - 50) / 200) *
      simModifiers.serveDominance *
      circuitWeights.serveDominance;

    const p2ServeGameProb =
      (0.50 + (p2Stats.serve - 50) / 200) *
      simModifiers.serveDominance *
      circuitWeights.serveDominance;

    const simResult = this.mc.runSimulation(
      p1ServeGameProb,
      p2ServeGameProb,
      simModifiers.variance + circuitWeights.variance
    );

    // 5. Merge probabilities
    const mergeFactor = circuit === 'ITF' || circuit === 'CHALLENGER' ? 0.8 : 0.65;
    const finalProbA =
      baseWinProbA * (1 - mergeFactor) +
      simResult.player1WinRate * mergeFactor;

    const finalProbB = 1 - finalProbA;
    const confidence = parseFloat(
      (Math.max(finalProbA, finalProbB) * 100).toFixed(0)
    );

    // 6. Fair odds
    const fairOdds = StatModels.calculateFairOdds(finalProbA, finalProbB);
    const winnerName = finalProbA > 0.5 ? player1.name : player2.name;

    // 7. Trap + Integrity
    const trapResult = this.trap.analyze(
      fairOdds.p1,
      marketOddsP1,
      confidence,
      player1.name
    );

    const integrityResult = this.integrity.checkIntegrity(
      player1,
      player2,
      p1Stats,
      p2Stats,
      circuit
    );

    // 8. Odds Engine
    const marketOddsP2 = parseFloat(
      (1 / (1 / 0.95 - 1 / marketOddsP1)).toFixed(2)
    );
    const oddsAnalysis = this.oddsEngine.analyzeOdds(
      marketOddsP1,
      marketOddsP2,
      fairOdds.p1,
      fairOdds.p2
    );

    // 9. Recommendation
    let recommendedBet = "";
    let marketType: any = "WINNER";

    if (trapResult.verdict === "Piège" || integrityResult.status === "Danger") {
      recommendedBet = "PASSER (Risque Détecté)";
    } else {
      if (confidence > 80 && simResult.stats.setDistribution["2-0"] > 0.5) {
        recommendedBet = `${winnerName} 2-0`;
        marketType = "SETS";
      } else if (
        simResult.totalGamesProj > 22.5 &&
        Math.abs(finalProbA - 0.5) < 0.1
      ) {
        recommendedBet = "Plus de 22.5 Jeux";
        marketType = "GAMES";
      } else {
        recommendedBet = finalProbA > 0.55 ? `${winnerName} Gagne` : "No Bet (Trop Incertain)";
      }
    }

    // 10. Return
    return {
      winner: winnerName,
      winnerProbability: parseFloat(
        (Math.max(finalProbA, finalProbB) * 100).toFixed(1)
      ),
      winProbA: parseFloat(finalProbA.toFixed(2)),
      winProbB: parseFloat(finalProbB.toFixed(2)),
      expectedSets: simResult.mostLikelyScore,
      tieBreakProbability: parseFloat(
        (simResult.tieBreakLikelihood * 100).toFixed(1)
      ),
      breaks: {
        p1: parseFloat(simResult.stats.breakDistribution.p1.toFixed(1)),
        p2: parseFloat(simResult.stats.breakDistribution.p2.toFixed(1)),
      },
      totalGamesProjection: parseFloat(
        simResult.totalGamesProj.toFixed(1)
      ),
      fairOdds,
      confidence,
      circuit,
      marketType,
      recommendedBet,
      riskLevel: confidence > 75 ? "Safe" : confidence < 60 ? "Risky" : "Moderate",
      attributes: [p1Stats, p2Stats],
      trap: {
        isTrap: trapResult.verdict === "Piège",
        ...trapResult,
      },
      integrity: {
        isSuspicious: integrityResult.status === "Danger",
        ...integrityResult,
      },
      monteCarlo: simResult.stats,
      oddsAnalysis,
    };
  }

  private simulatePlayerStats(
    p: Player,
    surface: string,
    circuit: Circuit
  ): PlayerAttributes {
    const baseSkill = 100 - p.rank * 0.5;
    const varianceRange = circuit === "ITF" || circuit === "CHALLENGER" ? 15 : 5;
    const variance = () => Math.random() * varianceRange * 2 - varianceRange;

    const styles: PlayerStyle[] = [
      "Agressif",
      "Servebot",
      "Grinder",
      "Complet",
      "Contre-Attaquant",
    ];
    const styleIndex = p.name.charCodeAt(0) % styles.length;

    let fatigue = Math.random() * 30;
    if (circuit === "WTA") fatigue += 10;
    if (circuit === "CHALLENGER") fatigue += 15;

    let mental = Math.min(99, Math.max(40, baseSkill + variance()));
    if (circuit === "ITF") mental -= 15;

    return {
      power: Math.min(99, Math.max(50, baseSkill + variance())),
      serve: Math.min(
        99,
        Math.max(50, baseSkill + variance() - (surface === "Clay" ? 10 : 0))
      ),
      return: Math.min(99, Math.max(50, baseSkill + variance())),
      mental,
      form: Math.min(
        99,
        Math.max(50, baseSkill + Math.random() * 20 - 10)
      ),
      fatigue,
      style: styles[styleIndex],
    };
  }
}

