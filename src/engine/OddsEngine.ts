import { OddsAnalysis, BookmakerOdds, ArbitrageResult } from './types';

export const OddsEngine = {
  analyze: (p1Name: string, p2Name: string, oddsP1: number, oddsP2: number): OddsAnalysis => {
    
    // Simulation de bookmakers (dans un vrai projet, cela viendrait d'une API)
    const bookmakers: BookmakerOdds[] = [
        { name: 'Winamax', p1: oddsP1, p2: oddsP2, payout: 95, movement: 'STABLE', isTrap: false, isValue: true },
        { name: 'Unibet', p1: oddsP1 - 0.05, p2: oddsP2 + 0.05, payout: 94, movement: 'UP', isTrap: false, isValue: false },
        { name: 'Betclic', p1: oddsP1 + 0.02, p2: oddsP2 - 0.04, payout: 93, movement: 'DOWN', isTrap: false, isValue: false },
    ];

    // Trouver les meilleures cotes
    const bestP1 = Math.max(...bookmakers.map(b => b.p1));
    const bestP2 = Math.max(...bookmakers.map(b => b.p2));
    
    // Calcul de l'arbitrage (Surebet)
    const arbPercent = (1 / bestP1) + (1 / bestP2);
    const isSurebet = arbPercent < 1;
    const profit = isSurebet ? (1 / arbPercent) - 1 : 0;

    // Calcul de Kelly (Mise conseillée)
    // On estime une probabilité implicite "juste" un peu meilleure que le marché
    const impliedProb = (1 / oddsP1); 
    const estimatedRealProb = impliedProb + 0.05; // Bonus IA de 5%
    const kelly = ((estimatedRealProb * oddsP1) - 1) / (oddsP1 - 1);

    const arbitrage: ArbitrageResult = {
        isSurebet,
        profit: parseFloat((profit * 100).toFixed(2)),
        bookmakerP1: bookmakers.find(b => b.p1 === bestP1)?.name || '',
        bookmakerP2: bookmakers.find(b => b.p2 === bestP2)?.name || '',
        msg: isSurebet ? "OPPORTUNITÉ SUREBET DÉTECTÉE" : "Pas d'arbitrage disponible"
    };

    return {
      bestOdds: { 
          p1: bestP1, 
          p2: bestP2, 
          bookieP1: arbitrage.bookmakerP1, 
          bookieP2: arbitrage.bookmakerP2 
      },
      marketAverage: { p1: oddsP1, p2: oddsP2 }, // Simplifié
      recommendedBookie: 'Winamax',
      kelly: { 
          percentage: parseFloat((Math.max(0, kelly) * 100).toFixed(1)), 
          advice: kelly > 0 ? "Value détectée" : "Pas de value" 
      },
      arbitrage,
      bookmakers
    };
  }
};
