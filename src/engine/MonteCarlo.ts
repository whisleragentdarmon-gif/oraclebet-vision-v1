import { SimulationResult } from './types';

export const MonteCarlo = {
  simulateFuture: (currentBalance: number, winRate: number, avgOdds: number, iterations: number = 1000): SimulationResult => {
    const paths: { x: number; y: number }[][] = [];
    const finalBalances: number[] = [];
    const minBalances: number[] = [];
    const maxBalances: number[] = [];
    let ruinCount = 0;

    // On lance 50 scénarios (chemins) pour le graphique
    for (let i = 0; i < 50; i++) {
      const path = [{ x: 0, y: currentBalance }];
      let balance = currentBalance;
      let minBal = currentBalance;
      let maxBal = currentBalance;
      let isRuined = false;

      // Simulation sur 100 paris
      for (let bet = 1; bet <= 100; bet++) {
        // Mise fixe de 2% (Gestion prudente)
        const stake = balance * 0.02; 
        const isWin = Math.random() * 100 < winRate;
        
        if (isWin) {
          balance += stake * (avgOdds - 1);
        } else {
          balance -= stake;
        }

        if (balance < minBal) minBal = balance;
        if (balance > maxBal) maxBal = balance;

        // Si la bankroll tombe sous 1€, c'est la ruine
        if (balance < 1 && !isRuined) {
            isRuined = true;
            ruinCount++;
        }

        path.push({ x: bet, y: parseFloat(balance.toFixed(2)) });
      }

      paths.push(path);
      finalBalances.push(balance);
      minBalances.push(minBal);
      maxBalances.push(maxBal);
    }

    // Calcul des statistiques
    finalBalances.sort((a, b) => a - b);
    const medianBalance = finalBalances[Math.floor(finalBalances.length / 2)];
    
    // Écart type pour la volatilité
    const mean = finalBalances.reduce((a, b) => a + b, 0) / finalBalances.length;
    const variance = finalBalances.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / finalBalances.length;
    const volatility = Math.sqrt(variance);

    return {
      finalBankroll: parseFloat(medianBalance.toFixed(2)),
      riskOfRuin: parseFloat(((ruinCount / 50) * 100).toFixed(1)),
      volatility: parseFloat(volatility.toFixed(2)),
      maxBankroll: parseFloat(Math.max(...maxBalances).toFixed(2)),
      minBankroll: parseFloat(Math.min(...minBalances).toFixed(2)),
      paths: paths
    };
  }
};
