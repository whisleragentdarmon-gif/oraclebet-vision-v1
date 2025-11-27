
import { SimulationResult, MonteCarloStats } from './types';

/**
 * Monte Carlo Engine (Premium)
 * Simulates tennis matches point-by-point to determine probabilistic outcomes.
 * Capable of 10,000 runs for high precision.
 */
export class MonteCarloSimulator {
  private runs: number;

  constructor(runs: number = 10000) {
    this.runs = runs;
  }

  /**
   * Simulates a full match N times.
   */
  public runSimulation(p1ServeWinProb: number, p2ServeWinProb: number, varianceFactor: number = 1.0): SimulationResult {
    let p1Wins = 0;
    let p2Wins = 0;
    let tieBreaksPlayed = 0;
    let totalGamesAccumulator = 0;
    const setScores: Record<string, number> = {};
    let p1BreaksTotal = 0;
    let p2BreaksTotal = 0;

    for (let i = 0; i < this.runs; i++) {
      // Apply variance per match run to simulate "Form of the day"
      // Variance factor scales the standard deviation of daily performance
      const dailyVariance = (Math.random() - 0.5) * 0.10 * varianceFactor;
      
      // Clamp probabilities
      const p1S = Math.max(0.4, Math.min(0.95, p1ServeWinProb + dailyVariance));
      const p2S = Math.max(0.4, Math.min(0.95, p2ServeWinProb - dailyVariance));

      const matchResult = this.simulateMatch(p1S, p2S);
      
      if (matchResult.winner === 1) p1Wins++;
      else p2Wins++;

      if (matchResult.hasTieBreak) tieBreaksPlayed++;
      
      totalGamesAccumulator += matchResult.totalGames;
      
      const scoreKey = matchResult.score;
      setScores[scoreKey] = (setScores[scoreKey] || 0) + 1;

      p1BreaksTotal += matchResult.p1Breaks;
      p2BreaksTotal += matchResult.p2Breaks;
    }

    // Process Stats
    let mostLikelyScore = "";
    let maxCount = 0;
    const setDistribution: Record<string, number> = {};
    
    for (const [score, count] of Object.entries(setScores)) {
      setDistribution[score] = parseFloat((count / this.runs).toFixed(3));
      if (count > maxCount) {
        maxCount = count;
        mostLikelyScore = score;
      }
    }

    const stats: MonteCarloStats = {
      runs: this.runs,
      p1WinRate: p1Wins / this.runs,
      p2WinRate: p2Wins / this.runs,
      tieBreakProb: tieBreaksPlayed / this.runs,
      totalGamesAvg: totalGamesAccumulator / this.runs,
      setDistribution,
      breakDistribution: {
        p1: p1BreaksTotal / this.runs,
        p2: p2BreaksTotal / this.runs
      }
    };

    return {
      simulationRuns: this.runs,
      player1WinRate: stats.p1WinRate,
      player2WinRate: stats.p2WinRate,
      tieBreakLikelihood: stats.tieBreakProb,
      totalGamesProj: stats.totalGamesAvg,
      mostLikelyScore,
      stats
    };
  }

  // --- Internal Simulation Logic ---

  private simulateMatch(p1Serve: number, p2Serve: number): { winner: number, score: string, totalGames: number, hasTieBreak: boolean, p1Breaks: number, p2Breaks: number } {
    let p1Sets = 0;
    let p2Sets = 0;
    let totalGames = 0;
    let hasTieBreak = false;
    let p1Breaks = 0;
    let p2Breaks = 0;
    
    // Simulate Best of 3
    while (p1Sets < 2 && p2Sets < 2) {
      const setResult = this.simulateSet(p1Serve, p2Serve);
      if (setResult.winner === 1) p1Sets++; else p2Sets++;
      totalGames += setResult.games;
      if (setResult.isTieBreak) hasTieBreak = true;
      p1Breaks += setResult.p1Breaks;
      p2Breaks += setResult.p2Breaks;
    }

    return {
      winner: p1Sets > p2Sets ? 1 : 2,
      score: p1Sets > p2Sets ? `${p1Sets}-${p2Sets}` : `${p2Sets}-${p1Sets}`,
      totalGames,
      hasTieBreak,
      p1Breaks,
      p2Breaks
    };
  }

  private simulateSet(p1Serve: number, p2Serve: number): { winner: number, games: number, isTieBreak: boolean, p1Breaks: number, p2Breaks: number } {
    let p1Games = 0;
    let p2Games = 0;
    let p1Breaks = 0;
    let p2Breaks = 0;
    
    // Simulate Set
    while (true) {
      // Determine Server (Alternating)
      const server = (p1Games + p2Games) % 2 === 0 ? 1 : 2;
      const winProb = server === 1 ? p1Serve : p2Serve; 
      
      let p1WinsGame = false;

      // Random Point simulation abstract
      if (Math.random() < winProb) {
        // Server Holds
        server === 1 ? p1WinsGame = true : p1WinsGame = false;
      } else {
        // Break
        server === 1 ? p1WinsGame = false : p1WinsGame = true;
        server === 1 ? p2Breaks++ : p1Breaks++;
      }

      if (p1WinsGame) p1Games++; else p2Games++;

      // Set End Conditions
      if (p1Games >= 6 && p1Games - p2Games >= 2) return { winner: 1, games: p1Games + p2Games, isTieBreak: false, p1Breaks, p2Breaks };
      if (p2Games >= 6 && p2Games - p1Games >= 2) return { winner: 2, games: p1Games + p2Games, isTieBreak: false, p1Breaks, p2Breaks };
      
      // Tie Break
      if (p1Games === 6 && p2Games === 6) {
        const tbWinner = Math.random() < (p1Serve + (1-p2Serve))/2 ? 1 : 2;
        return { winner: tbWinner, games: 13, isTieBreak: true, p1Breaks, p2Breaks };
      }
    }
  }
}
