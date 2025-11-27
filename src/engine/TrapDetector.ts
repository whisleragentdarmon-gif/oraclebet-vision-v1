
import { DetailedPrediction } from './types';

/**
 * Module 2: Détection de Bookmakers "Traps"
 * Compare fair odds vs market odds to detect anomalies.
 */
export class TrapDetector {
  
  public analyze(fairOddsP1: number, marketOddsP1: number, confidence: number, playerName: string): { score: number, reason: string, verdict: 'Safe' | 'Méfiance' | 'Piège' } {
    const diff = marketOddsP1 - fairOddsP1;
    let score = 0;
    let reason = "Cotes cohérentes avec le modèle.";
    let verdict: 'Safe' | 'Méfiance' | 'Piège' = 'Safe';

    // Scenario 1: Trap on Favorite
    // Market odds are surprisingly high for a supposed favorite
    if (fairOddsP1 < 1.4 && diff > 0.4) {
      score = 75;
      reason = `Cote suspecte élevée pour ${playerName}. Le marché semble savoir quelque chose (blessure ?) que les stats ne montrent pas.`;
      verdict = 'Piège';
    }
    // Scenario 2: False Favorite
    // Bookmaker puts player as favorite (low odds) but AI sees high risk
    else if (marketOddsP1 < 1.5 && confidence < 60) {
      score = 85;
      reason = `Cote de favori injustifiée pour ${playerName}. Le modèle détecte un risque élevé non reflété par la cote.`;
      verdict = 'Piège';
    }
    // Scenario 3: Value Bet (Good kind of anomaly)
    else if (diff > 0.2 && confidence > 70) {
      score = 10; // Low trap score, high opportunity
      reason = `Value détectée. La cote est supérieure à l'estimation IA sans risque structurel majeur.`;
      verdict = 'Safe';
    }
    // Scenario 4: Minor discrepancies
    else if (Math.abs(diff) > 0.3) {
      score = 40;
      reason = "Écart notable entre les cotes. Prudence recommandée.";
      verdict = 'Méfiance';
    }

    return { score, reason, verdict };
  }
}
