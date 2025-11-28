import { Match } from './types';

export const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    tournament: 'ATP Miami',
    date: '2024-03-22',
    time: '20:30',
    status: 'LIVE',
    surface: 'Hard',
    player1: { name: 'C. Alcaraz', rank: 2, country: 'ESP', form: 95, surfacePrefs: { hard: 90, clay: 95, grass: 85 } },
    player2: { name: 'J. Sinner', rank: 3, country: 'ITA', form: 98, surfacePrefs: { hard: 95, clay: 80, grass: 85 } },
    score: '6-4 4-3',
    odds: { player1: 1.85, player2: 1.95, p1: 1.85, p2: 1.95 },
    ai: {
      winner: 'J. Sinner',
      confidence: 65,
      recommendedBet: 'Sinner Vainqueur',
      riskLevel: 'MODERATE',
      marketType: 'WINNER',
      circuit: 'ATP'
    }
  },
  {
    id: '2',
    tournament: 'ATP Miami',
    date: '2024-03-22',
    time: '22:00',
    status: 'TODAY',
    surface: 'Hard',
    player1: { name: 'D. Medvedev', rank: 4, country: 'RUS', form: 88, surfacePrefs: { hard: 95, clay: 60, grass: 70 } },
    player2: { name: 'A. Zverev', rank: 6, country: 'GER', form: 85, surfacePrefs: { hard: 88, clay: 85, grass: 75 } },
    odds: { player1: 1.72, player2: 2.10, p1: 1.72, p2: 2.10 },
    ai: {
      winner: 'D. Medvedev',
      confidence: 72,
      recommendedBet: 'Medvedev',
      riskLevel: 'SAFE',
      marketType: 'WINNER',
      circuit: 'ATP'
    }
  },
  {
    id: '3',
    tournament: 'Challenger Phoenix',
    date: '2024-03-23',
    time: '14:00',
    status: 'UPCOMING',
    surface: 'Hard',
    player1: { name: 'B. Nakashima', rank: 92, country: 'USA', form: 70, surfacePrefs: { hard: 80, clay: 50, grass: 60 } },
    player2: { name: 'E. Berrettini', rank: 145, country: 'ITA', form: 60, surfacePrefs: { hard: 85, clay: 70, grass: 90 } },
    odds: { player1: 1.65, player2: 2.25, p1: 1.65, p2: 2.25 },
    ai: {
      winner: 'B. Nakashima',
      confidence: 55,
      recommendedBet: 'Nakashima',
      riskLevel: 'RISKY',
      marketType: 'WINNER',
      circuit: 'CHALLENGER',
      trap: { isTrap: true, reason: 'Berrettini return from injury' }
    }
  }
];
