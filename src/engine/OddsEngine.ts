
import { BookmakerOdds, BookmakerName, OddsAnalysis, ArbitrageResult } from './types';
import { BankrollManager } from './BankrollManager';

export class OddsEngine {
  
  private bookmakers: BookmakerName[] = ['Winamax', 'Betclic', 'Unibet', 'ParionsSport', 'Pinnacle', '1xBet', 'Bet365'];
  private bankrollManager = new BankrollManager();

  /**
   * Generates realistic odds variations for a match based on base market odds.
   * Simulates live API fetching for 7 bookmakers.
   */
  public analyzeOdds(baseOddsP1: number, baseOddsP2: number, fairOddsP1: number, fairOddsP2: number): OddsAnalysis {
    const bookmakerOdds: BookmakerOdds[] = [];

    // 1. Generate Odds for each bookmaker
    this.bookmakers.forEach(name => {
      // Simulate margin and variance per bookmaker
      // Pinnacle/1xBet have lower margins (higher odds), Local bookies have higher margins
      let margin = 0.05; // 5% default
      let variance = (Math.random() - 0.5) * 0.06; // +/- 0.03 spread

      if (name === 'Pinnacle' || name === '1xBet') margin = 0.025; // Sharp
      if (name === 'Winamax' || name === 'Unibet') margin = 0.045; // Good local
      if (name === 'ParionsSport') margin = 0.065; // High margin
      if (name === 'Bet365') margin = 0.05;

      // Adjust odds based on margin
      // Price = RealPrice / (1 + Margin) approx
      const rawP1 = baseOddsP1 * (1 - margin + variance);
      const rawP2 = baseOddsP2 * (1 - margin - variance);

      const p1 = parseFloat(Math.max(1.01, rawP1).toFixed(2));
      const p2 = parseFloat(Math.max(1.01, rawP2).toFixed(2));
      
      const payout = parseFloat(((1 / ((1/p1) + (1/p2))) * 100).toFixed(1));

      // Value Detection (Is Market Odds > Fair Odds?)
      const isValue = p1 > fairOddsP1 || p2 > fairOddsP2;
      const gap = p1 > fairOddsP1 ? (p1 - fairOddsP1) / fairOddsP1 : (p2 > fairOddsP2 ? (p2 - fairOddsP2) / fairOddsP2 : 0);
      
      // Simulate Odds Movement (Randomly)
      const rand = Math.random();
      let movement: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
      if (rand > 0.8) movement = 'DOWN';
      else if (rand < 0.2) movement = 'UP';

      // Trap Logic: Pinnacle (Sharp) vs Soft Bookies
      const isTrap = false; 

      bookmakerOdds.push({ 
          name, 
          p1, 
          p2, 
          payout, 
          isValue, 
          isTrap, 
          gap: parseFloat((gap * 100).toFixed(1)),
          movement
      });
    });

    // 2. Find Best Odds
    let maxP1 = 0;
    let maxP2 = 0;
    let p1Bookie: BookmakerName = 'Winamax';
    let p2Bookie: BookmakerName = 'Winamax';

    bookmakerOdds.forEach(b => {
      if (b.p1 > maxP1) { maxP1 = b.p1; p1Bookie = b.name; }
      if (b.p2 > maxP2) { maxP2 = b.p2; p2Bookie = b.name; }
    });

    // 3. Arbitrage (Surebet) Calculation
    // InvP1 + InvP2 < 1
    const impliedProb = (1 / maxP1) + (1 / maxP2);
    const isSurebet = impliedProb < 1;
    let profitPercent = 0;
    let arbMsg = "Pas d'arbitrage disponible.";

    if (isSurebet) {
      profitPercent = parseFloat(((1 / impliedProb - 1) * 100).toFixed(2));
      arbMsg = `🟢 SUREBET détecté : Profit garanti +${profitPercent}%`;
    }

    // 4. Trap Logic (Comparative)
    const sharpBookie = bookmakerOdds.find(b => b.name === 'Pinnacle');
    if (sharpBookie) {
        bookmakerOdds.forEach(b => {
            // If a bookie offers significantly higher odds than Pinnacle on a favorite (< 1.5)
            // Example: Pinnacle 1.40, SoftBookie 1.55 -> Trap
            if (sharpBookie.p1 < 1.5 && b.p1 > sharpBookie.p1 + 0.1) {
                b.isTrap = true; 
            }
        });
    }

    // 5. Calculate Kelly Criterion Advice
    // Use the best available odds for the calculation
    const isFavP1 = fairOddsP1 < fairOddsP2;
    const targetOdds = isFavP1 ? maxP1 : maxP2;
    const winProb = isFavP1 ? (1/fairOddsP1) : (1/fairOddsP2);
    
    // We limit Kelly to avoid full bankroll swings (Half Kelly strategy)
    const kelly = this.bankrollManager.calculateKellyFraction(winProb, targetOdds);

    return {
      bookmakers: bookmakerOdds,
      bestOdds: { p1: maxP1, p1Bookie, p2: maxP2, p2Bookie },
      arbitrage: {
          isSurebet,
          profitPercent,
          bookmakerP1: isSurebet ? p1Bookie : null,
          bookmakerP2: isSurebet ? p2Bookie : null,
          msg: arbMsg
      },
      recommendedBookie: isFavP1 ? p1Bookie : p2Bookie,
      marketAverage: { p1: baseOddsP1, p2: baseOddsP2 },
      kelly
    };
  }
}
