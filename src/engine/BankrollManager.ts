
import { BankrollState, BankrollSimulationMetric } from './types';

export class BankrollManager {
  
  /**
   * Calculates the recommended stake based on bankroll and risk appetite.
   * Strategy: Modified Kelly Criterion for "Normal" and "Aggressive".
   */
  public calculateStake(bankroll: number, confidence: number, odds: number, strategy: 'Conservative' | 'Normal' | 'Aggressive'): number {
    const p = confidence / 100;
    const q = 1 - p;
    const b = odds - 1;
    
    // Full Kelly Formula: f = (bp - q) / b
    let kelly = (b * p - q) / b;
    
    // Protect against negative kelly (don't bet)
    if (kelly <= 0) return 0;

    let fraction = 0.01; // Default 1% flat for conservative

    if (strategy === 'Aggressive') fraction = kelly * 0.5; // Half Kelly
    else if (strategy === 'Normal') fraction = kelly * 0.25; // Quarter Kelly
    else fraction = 0.02; // Flat 2% limit

    const stake = bankroll * fraction;
    return parseFloat(stake.toFixed(2));
  }

  /**
   * Pure Kelly Fraction Calculation for Analysis
   */
  public calculateKellyFraction(trueProbability: number, odds: number): { fraction: number, stakePercent: number, advice: string } {
      const b = odds - 1;
      const p = trueProbability;
      const q = 1 - p;

      const f = (b * p - q) / b;

      if (f <= 0) {
          return { fraction: 0, stakePercent: 0, advice: "No Bet (Espérance Négative)" };
      }

      // Fractional Kelly for safety (1/4 Kelly)
      const safeF = f * 0.25; 
      
      return { 
          fraction: safeF, 
          stakePercent: parseFloat((safeF * 100).toFixed(2)), 
          advice: `Mise recommandée : ${parseFloat((safeF * 100).toFixed(2))}% de Bankroll (Kelly 1/4)` 
      };
  }

  /**
   * Updates the bankroll state after a bet result.
   */
  public processBetResult(currentState: BankrollState, stake: number, odds: number, isWin: boolean): BankrollState {
    const profit = isWin ? (stake * odds) - stake : -stake;
    const returned = isWin ? stake * odds : 0;
    
    const newBalance = currentState.currentBalance + profit;
    const totalInvested = currentState.totalInvested + stake;
    const totalReturned = currentState.totalReturned + returned;
    
    // Recalculate ROI: (Total Returned - Total Invested) / Total Invested
    const roi = totalInvested > 0 ? ((totalReturned - totalInvested) / totalInvested) * 100 : 0;

    return {
      ...currentState,
      currentBalance: parseFloat(newBalance.toFixed(2)),
      totalBets: currentState.totalBets + 1,
      wins: currentState.wins + (isWin ? 1 : 0),
      losses: currentState.losses + (isWin ? 0 : 1),
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      totalReturned: parseFloat(totalReturned.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
    };
  }

  /**
   * Simulates future bankroll performance using Monte Carlo.
   * Runs 1000 simulations of N bets.
   */
  public simulateFuture(startBankroll: number, winRate: number, avgOdds: number, numBets: number = 100): BankrollSimulationMetric {
    const simulations = 1000;
    const results: number[] = [];
    let ruins = 0;
    const stakePct = 0.05; // Assume 5% flat stake for simulation simplicity

    for (let i = 0; i < simulations; i++) {
      let balance = startBankroll;
      let minBal = startBankroll;

      for (let j = 0; j < numBets; j++) {
        const stake = balance * stakePct;
        if (Math.random() < (winRate / 100)) {
          balance += (stake * avgOdds) - stake;
        } else {
          balance -= stake;
        }
        if (balance < minBal) minBal = balance;
        if (balance <= 0) {
          ruins++;
          break;
        }
      }
      results.push(balance);
    }

    results.sort((a, b) => a - b);
    const median = results[Math.floor(results.length / 2)];
    const min = results[0];
    const max = results[results.length - 1];

    let volatility = "Faible";
    if (ruins > 100) volatility = "Extrême";
    else if (ruins > 10) volatility = "Élevée";

    return {
      finalBankroll: parseFloat(median.toFixed(2)),
      riskOfRuin: parseFloat(((ruins / simulations) * 100).toFixed(1)),
      minBankroll: parseFloat(min.toFixed(2)),
      maxBankroll: parseFloat(max.toFixed(2)),
      volatility
    };
  }
}
