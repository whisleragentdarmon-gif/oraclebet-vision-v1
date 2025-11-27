
/**
 * Statistical Models Utility Class
 * Handles Elo calculations, Probability conversion, and Fair Odds.
 */
export class StatModels {
  
  /**
   * Calculates win probability based on Elo difference
   */
  static calculateEloWinProb(eloA: number, eloB: number): number {
    return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
  }

  /**
   * Converts a probability (0-1) to Decimal Odds
   */
  static probabilityToOdds(prob: number): number {
    if (prob <= 0) return 100.0;
    return parseFloat((1 / prob).toFixed(2));
  }

  /**
   * Calculates Fair Odds with a margin removed (True Odds)
   */
  static calculateFairOdds(probA: number, probB: number): { p1: number, p2: number } {
    return {
      p1: this.probabilityToOdds(probA),
      p2: this.probabilityToOdds(probB)
    };
  }

  /**
   * Sigmoid function to normalize stats between 0-100 to a multiplier
   */
  static sigmoid(t: number): number {
    return 1 / (1 + Math.exp(-t));
  }

  /**
   * Logit function for complex weighted probability
   */
  static logit(p: number): number {
    return Math.log(p / (1 - p));
  }
}
