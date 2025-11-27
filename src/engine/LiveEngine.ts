
import { DetailedPrediction, LivePredictionResult, LiveUpdatePayload } from './types';

/**
 * Live Engine
 * Adjusts pre-match predictions based on real-time events.
 */
export class LiveEngine {
  
  public updatePrediction(basePrediction: DetailedPrediction, update: LiveUpdatePayload): LivePredictionResult {
    let confidenceModifier = 0;
    const keyEvents: string[] = [];

    // Analyze Momentum
    if (update.momentum > 20) {
        confidenceModifier += 10;
        keyEvents.push(`${update.serverName} a un momentum fort (+20%)`);
    } else if (update.momentum < -20) {
        confidenceModifier -= 15;
        keyEvents.push(`${update.serverName} perd sa concentration (-20% momentum)`);
    }

    // Analyze Score Context (Simple example)
    if (update.currentScore.includes("6-0") || update.currentScore.includes("6-1")) {
        confidenceModifier += 15;
        keyEvents.push("Performance dominante au 1er set confirmée");
    }

    const newConfidence = Math.min(99, Math.max(10, basePrediction.confidence + confidenceModifier));

    return {
      liveWinner: basePrediction.winner,
      updatedConfidence: newConfidence,
      keyEvents
    };
  }
}
