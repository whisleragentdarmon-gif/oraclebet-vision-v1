import { PressAnalysis, SocialSentiment } from '../types';

export const ScandalEngine = {
  analyze: (playerName: string): { press: PressAnalysis, social: SocialSentiment } => {
    // Simulation : Analyse NLP et Sentiment
    // Dans le futur, ceci connectera à une API Twitter/News
    
    const isBigStar = ['Djokovic', 'Alcaraz', 'Sinner', 'Nadal'].some(n => playerName.includes(n));
    
    return {
      press: {
        sentimentScore: isBigStar ? 85 : 50,
        scandalAlert: false,
        mentalPressureIndex: isBigStar ? 20 : 40, // Les stars gèrent mieux la pression
        recentQuotes: [
          { source: "L'Équipe", text: "Je me sens en pleine forme.", sentiment: 'POSITIVE' }
        ],
        rumors: []
      },
      social: {
        twitterHype: isBigStar ? 95 : 15,
        redditMood: 'BULLISH',
        instagramActivity: 'Normal',
        publicBettingTrend: isBigStar ? 80 : 30
      }
    };
  }
};
