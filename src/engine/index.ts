import { MatchPredictor } from './MatchPredictor';
import { ComboGenerator } from './ComboGenerator';
import { LiveEngine } from './LiveEngine';
import { BankrollManager } from './BankrollManager';

// 👉 Ajout essentiel
import { MOCK_MATCHES } from '../constants';

export const OracleAI = {
  predictor: new MatchPredictor(),
  combo: new ComboGenerator(),
  live: new LiveEngine(),
  bankroll: new BankrollManager(),

  // 👉 Export pour faciliter l'accès global
  mocks: MOCK_MATCHES
};
