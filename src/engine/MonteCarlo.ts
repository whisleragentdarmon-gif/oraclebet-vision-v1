import { SimulationResult, WebScrapedData } from './types';

export const MonteCarlo = {
  // Simulation financière (existante)
  simulateFuture: (currentBalance: number, winRate: number, avgOdds: number): SimulationResult => {
      // ... (Garde ton code existant pour la bankroll ici) ...
      return { finalBankroll: 0, riskOfRuin: 0, volatility: 0, maxBankroll: 0, minBankroll: 0, paths: [] };
  },

  // NOUVEAU : Simulation de Match (PURE DATA - NO ODDS)
  simulateMatchup: (scrapedData: WebScrapedData): { p1Prob: number, p2Prob: number } => {
      let p1Score = 50;
      let p2Score = 50;

      // 1. Impact du Style
      if (scrapedData.playerProfile.p1.style === "Gros Serveur") p1Score += 5;
      if (scrapedData.playerProfile.p2.style === "Défenseur de fond") p2Score += 2;

      // 2. Impact Fatigue (Pénalité lourde)
      if (scrapedData.context.fatigueP1 === "ALERTE PHYSIQUE") p1Score -= 30;
      if (scrapedData.context.fatigueP1 === "Fatigue Élevée") p1Score -= 10;

      // 3. Impact Météo (Vent désavantage les serveurs)
      if (scrapedData.context.weather.includes("wind") && scrapedData.playerProfile.p1.style === "Gros Serveur") {
          p1Score -= 5;
      }

      // 4. Monte Carlo (1000 tirages)
      let p1Wins = 0;
      for (let i = 0; i < 1000; i++) {
          // On ajoute une variance aléatoire de +/- 15% (Forme du jour)
          const p1DayForm = p1Score + (Math.random() * 30 - 15);
          const p2DayForm = p2Score + (Math.random() * 30 - 15);
          
          if (p1DayForm > p2DayForm) p1Wins++;
      }

      const p1Prob = (p1Wins / 1000) * 100;
      return { p1Prob: parseFloat(p1Prob.toFixed(1)), p2Prob: parseFloat((100 - p1Prob).toFixed(1)) };
  }
};
