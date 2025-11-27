
import { ComboStrategyResult, ComboSelection } from './types';
import { Match } from '../types';

/**
 * Premium Combo Generator
 * Selects not just winners, but optimal markets (Over/Under, Sets) based on AI confidence.
 */
export class ComboGenerator {

  public generateStrategies(matches: Match[]): ComboStrategyResult[] {
    const candidates = matches.filter(m => m.ai && m.status !== 'FINISHED' && m.ai.riskLevel !== 'Risky');

    return [
      this.generateSafeCombo(candidates),
      this.generateBalancedCombo(candidates),
      this.generateValueCombo(candidates),
      this.generateOracleUltraPremiumCombo(matches) // Uses all matches, filters internally
    ];
  }

  // Strategy 1: Safe (High Confidence Anchors)
  private generateSafeCombo(matches: Match[]): ComboStrategyResult {
    const selections: ComboSelection[] = [];
    
    // Filter for super safe bets
    // Fallback: If no >80%, take >70%
    let safeBets = matches
      .filter(m => m.ai && m.ai.confidence >= 80);
    
    if (safeBets.length < 2) {
        safeBets = matches.filter(m => m.ai && m.ai.confidence >= 70);
    }

    safeBets = safeBets.sort((a, b) => (b.ai?.confidence || 0) - (a.ai?.confidence || 0))
      .slice(0, 3);

    safeBets.forEach(m => {
        if (!m.ai) return;
        selections.push({
            matchId: m.id,
            player1: m.player1.name,
            player2: m.player2.name,
            selection: m.ai.recommendedBet, // Usually "Player Wins"
            marketType: 'WINNER',
            odds: m.ai.winner === m.player1.name ? m.odds.p1 : m.odds.p2,
            confidence: m.ai.confidence,
            reason: "Favori solide, indicateurs au vert."
        });
    });

    return this.buildResult('Safe', selections, "Sélection conservatrice sur les favoris indiscutables.");
  }

  // Strategy 2: Balanced (Mix of Winner and Over/Under)
  private generateBalancedCombo(matches: Match[]): ComboStrategyResult {
    const selections: ComboSelection[] = [];
    const balancedMatches = matches.slice(0, 3); // Take first 3 valid candidates

    balancedMatches.forEach(m => {
        if (!m.ai) return;
        
        let sel = {
            matchId: m.id,
            player1: m.player1.name,
            player2: m.player2.name,
            selection: m.ai.recommendedBet,
            marketType: 'WINNER',
            odds: m.ai.winner === m.player1.name ? m.odds.p1 : m.odds.p2,
            confidence: m.ai.confidence,
            reason: "Confiance IA modérée."
        };

        // Smart Swap: If winner is shaky (60-65%) but games projection is high, swap to Over
        if (m.ai.confidence < 70 && m.ai.totalGamesProjection > 22.5) {
            sel.selection = "Plus de 22.5 Jeux";
            sel.marketType = "GAMES";
            sel.odds = 1.85; // Simulated line
            sel.reason = "Match serré prévu, Over plus sûr que le vainqueur.";
            sel.confidence += 5; // Boost confidence for the alternative market
        }

        selections.push(sel);
    });

    return this.buildResult('Balanced', selections, "Mix intelligent : Vainqueurs et Overs jeux.");
  }

  // Strategy 3: Value (Only mispriced odds)
  private generateValueCombo(matches: Match[]): ComboStrategyResult {
    const selections: ComboSelection[] = [];
    
    matches.forEach(m => {
       if (!m.ai) return;
       const isP1 = m.ai.winner === m.player1.name;
       const marketOdds = isP1 ? m.odds.p1 : m.odds.p2;
       const fairOdds = isP1 ? m.ai.fairOdds.p1 : m.ai.fairOdds.p2;

       // Significant value > 10%
       if (marketOdds > fairOdds * 1.10) {
           selections.push({
               matchId: m.id,
               player1: m.player1.name,
               player2: m.player2.name,
               selection: m.ai.recommendedBet,
               marketType: 'WINNER',
               odds: marketOdds,
               confidence: m.ai.confidence,
               reason: `Value massive: Cote ${marketOdds} vs Juste ${fairOdds}`,
               valueScore: marketOdds - fairOdds
           });
       }
    });

    // If no big values, pick small values
    if (selections.length === 0) {
        matches.forEach(m => {
            if (!m.ai) return;
            const isP1 = m.ai.winner === m.player1.name;
            const marketOdds = isP1 ? m.odds.p1 : m.odds.p2;
            const fairOdds = isP1 ? m.ai.fairOdds.p1 : m.ai.fairOdds.p2;
            if (marketOdds > fairOdds) {
                selections.push({
                    matchId: m.id,
                    player1: m.player1.name,
                    player2: m.player2.name,
                    selection: m.ai.recommendedBet,
                    marketType: 'WINNER',
                    odds: marketOdds,
                    confidence: m.ai.confidence,
                    reason: "Petite value détectée.",
                    valueScore: marketOdds - fairOdds
                });
            }
        });
    }

    // Sort by value score and take top 3
    selections.sort((a,b) => (b.valueScore || 0) - (a.valueScore || 0));

    return this.buildResult('Value', selections.slice(0, 3), "Exploitation des erreurs de pricing bookmaker.");
  }

  // Strategy 4: Oracle Ultra Premium (Aggressive + Sets)
  private generateOracleUltraPremiumCombo(matches: Match[]): ComboStrategyResult {
    const selections: ComboSelection[] = [];
    
    // 1. Find the "Lock of the day" for Exact Score (2-0)
    // Filter matches where 2-0 prob is > 60%
    const dominator = matches.find(m => m.ai && m.ai.monteCarlo.setDistribution["2-0"] > 0.60);
    
    if (dominator && dominator.ai) {
        selections.push({
            matchId: dominator.id,
            player1: dominator.player1.name,
            player2: dominator.player2.name,
            selection: `${dominator.ai.winner} 2-0`,
            marketType: 'SETS',
            odds: dominator.ai.winner === dominator.player1.name ? dominator.odds.p1 * 2.1 : dominator.odds.p2 * 2.1, 
            confidence: 75,
            reason: "Victoire sèche (2-0) très probable selon Monte Carlo (60%+)."
        });
    }

    // 2. Fill with Best Value Bets (from Strategy 3)
    const values = this.generateValueCombo(matches).selections;
    
    values.forEach(v => {
        if (selections.length < 3 && !selections.find(s => s.matchId === v.matchId)) {
            selections.push(v);
        }
    });

    // 3. Fallback if empty (Pick best confidence match)
    if (selections.length === 0) {
         const best = matches.sort((a, b) => (b.ai?.confidence || 0) - (a.ai?.confidence || 0))[0];
         if (best && best.ai) {
             selections.push({
                matchId: best.id,
                player1: best.player1.name,
                player2: best.player2.name,
                selection: best.ai.recommendedBet,
                marketType: 'WINNER',
                odds: best.ai.winner === best.player1.name ? best.odds.p1 : best.odds.p2,
                confidence: best.ai.confidence,
                reason: "Meilleure confiance disponible."
             });
         }
    }

    return this.buildResult('Oracle Ultra Premium', selections, "Risque élevé : Scores exacts et Value Bets.");
  }

  private buildResult(type: 'Safe' | 'Balanced' | 'Value' | 'Oracle Ultra Premium', selections: ComboSelection[], analysis: string): ComboStrategyResult {
    const combinedOdds = selections.reduce((acc, curr) => acc * curr.odds, 1);
    // Rough probability estimation
    const successProb = selections.reduce((acc, curr) => acc * (curr.confidence / 100), 1) * 100;

    let riskScore = "High";
    if (successProb > 50) riskScore = "Low";
    else if (successProb > 25) riskScore = "Medium";

    return {
      type,
      selections,
      combinedOdds: parseFloat(combinedOdds.toFixed(2)),
      successProbability: parseFloat(successProb.toFixed(1)),
      expectedRoi: parseFloat(((combinedOdds * (successProb/100)) - 1).toFixed(2)),
      riskScore,
      analysis
    };
  }
}
