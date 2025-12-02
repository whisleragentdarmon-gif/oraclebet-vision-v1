import { SimulationResult, WebScrapedData } from './types';

export const MonteCarlo = {
  simulateFuture: (currentBalance: number, winRate: number, avgOdds: number): SimulationResult => {
      return { finalBankroll: 0, riskOfRuin: 0, volatility: 0, maxBankroll: 0, minBankroll: 0, paths: [] };
  },

  simulateMatchup: (data: any): { p1Prob: number, p2Prob: number } => {
      // On utilise les données H2H complètes pour la simulation
      let p1Score = 50;
      
      // Facteur Physique (Critique)
      if (data.human?.p1.physical.injuryStatus.includes("ALERTE")) p1Score -= 25;
      if (data.human?.p2.physical.injuryStatus.includes("ALERTE")) p1Score += 25;

      // Facteur Mental
      if (data.human?.p1.mental.state === "Confiant") p1Score += 5;
      if (data.human?.p2.mental.state === "Instable") p1Score += 5;

      // Facteur Style
      if (data.playerProfile?.p1.style === "Gros Serveur" && data.context?.weather?.includes("Windy")) p1Score -= 5;

      // Simulation 1000 tirages avec variance
      let p1Wins = 0;
      for(let i=0; i<1000; i++) {
          const noise = (Math.random() * 20) - 10;
          if (p1Score + noise > 50) p1Wins++;
      }

      const p1Prob = (p1Wins / 1000) * 100;
      return { p1Prob: parseFloat(p1Prob.toFixed(1)), p2Prob: parseFloat((100 - p1Prob).toFixed(1)) };
  }
};
