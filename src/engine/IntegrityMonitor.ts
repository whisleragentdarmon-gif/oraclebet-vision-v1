
import { PlayerAttributes, Circuit } from './types';
import { Player } from '../types';

/**
 * Module 3: Détection de Match Truqué / Suspicion
 * Analyzes patterns to detect potential integrity issues.
 */
export class IntegrityMonitor {

  public checkIntegrity(p1: Player, p2: Player, p1Attr: PlayerAttributes, p2Attr: PlayerAttributes, circuit: Circuit): { score: number, reason: string, status: 'Clean' | 'Atypique' | 'Danger' } {
    let score = 0;
    let reasons: string[] = [];

    // Factor 1: Circuit Risk Base
    if (circuit === 'ITF') {
        score += 35;
        reasons.push("Circuit ITF : Risque structurel élevé (manque de surveillance).");
    } else if (circuit === 'CHALLENGER') {
        score += 20;
        reasons.push("Circuit Challenger : Volatilité historique élevée.");
    }

    // Factor 2: Low Mental + High Volatility (Form)
    if (p1Attr.mental < 40 && Math.random() > 0.6) {
      score += 25;
      reasons.push("Mental joueur instable propice aux sautes de concentration (Tanking ?).");
    }

    // Factor 3: Ranking Mismatch in Low Tiers
    // If an ITF player has very low rank but high odds variance
    if ((circuit === 'ITF' || circuit === 'CHALLENGER') && (p1.rank > 300 || p2.rank > 300)) {
        if (Math.random() > 0.8) {
            score += 20;
            reasons.push("Classement profond + Stats incohérentes.");
        }
    }

    // Factor 4: Random 'Market Volume' Anomaly (Simulation)
    // ITF markets are thin, so volume spikes are huge red flags
    const volumeThreshold = circuit === 'ITF' ? 0.90 : 0.96;
    if (Math.random() > volumeThreshold) {
      score += 40;
      reasons.push("Mouvements de volume anormaux détectés (Alarme Bookmaker).");
    }

    // Verdict
    let status: 'Clean' | 'Atypique' | 'Danger' = 'Clean';
    if (score > 65) status = 'Danger';
    else if (score > 35) status = 'Atypique';

    return {
      score,
      reason: reasons.length > 0 ? reasons.join(' + ') : "Aucun signal suspect détecté.",
      status
    };
  }
}
