import { BookmakerOdds } from '../types';

export const TrapDetector = {
  checkIntegrity: (bookmakers: BookmakerOdds[]): { isTrap: boolean, reason?: string, riskLevel: 'SAFE' | 'RISKY' | 'NO_BET' } => {
    if (!bookmakers || bookmakers.length === 0) return { isTrap: false, riskLevel: 'SAFE' };

    // Détection de chute brutale ("Crash")
    const crash = bookmakers.find(b => b.movement === 'CRASH');
    
    if (crash) {
      return {
        isTrap: true,
        riskLevel: 'NO_BET',
        reason: `ALERTE ROUGE : Chute anormale de cote chez ${crash.name}. Possible blessure cachée ou match arrangé.`
      };
    }

    // Détection d'écart suspect (Arbitrage > 5% souvent signe d'erreur)
    // ... logique d'arbitrage ...

    return { isTrap: false, riskLevel: 'SAFE' };
  }
};
