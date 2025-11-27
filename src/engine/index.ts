
import { MatchPredictor } from './MatchPredictor';
import { ComboGenerator } from './ComboGenerator';
import { LiveEngine } from './LiveEngine';
import { BankrollManager } from './BankrollManager';

export const OracleAI = {
  predictor: new MatchPredictor(),
  combo: new ComboGenerator(),
  live: new LiveEngine(),
  bankroll: new BankrollManager()
};
