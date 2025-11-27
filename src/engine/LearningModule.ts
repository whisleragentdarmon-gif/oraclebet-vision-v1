import { AIModelWeights, Circuit, LearningExperience, BetRecord } from './types';

/**
 * Self-Learning Engine
 * Adapts internal weights based on Pass/Fail user feedback.
 * Stores experience history to detect patterns.
 */
export class LearningModule {
  private currentWeights: AIModelWeights;
  private history: LearningExperience[];

  constructor() {
    // Default starting weights
    this.currentWeights = {
      surfaceWeight: 0.35,
      formWeight: 0.30,
      h2hWeight: 0.15,
      mentalWeight: 0.10,
      fatigueFactor: 0.10,
      momentumWeight: 0.20,
      variance: 0.05,
      serveDominance: 1.0 // Baseline
    };
    this.history = [];
  }

  public getWeights(): AIModelWeights {
    return { ...this.currentWeights };
  }

  public setWeights(weights: AIModelWeights) {
    this.currentWeights = weights;
  }

  /**
   * CORE ALGORITHM: Retrain Model from Real History
   * This replaces the need for a Python backend by running the gradient adjustment locally.
   */
  public retrainModelFromHistory(betHistory: BetRecord[]): { weights: AIModelWeights, improvement: number, log: string } {
    if (betHistory.length < 5) {
      return { 
        weights: this.currentWeights, 
        improvement: 0, 
        log: "Historique insuffisant pour le réentraînement (min 5 paris)." 
      };
    }

    const newWeights = { ...this.currentWeights };
    let errorScore = 0;
    let adjustments = 0;

    // 1. Analysis Phase
    betHistory.forEach(bet => {
        // Only analyze confirmed results
        if (bet.status === 'PENDING') return;

        const isWin = bet.status === 'WON';
        const confidence = bet.confidenceAtTime / 100; // 0.85
        
        // Calculate "Surprise Factor"
        const outcomeValue = isWin ? 1 : 0;
        const error = Math.abs(outcomeValue - confidence);
        errorScore += error;

        // 2. Weight Adjustment Logic (Gradient Descent simplified)
        const learningRate = 0.005; 

        if (!isWin && confidence > 0.75) {
            // "False Positive" - The model was too confident in stats (Form, H2H)
            // We must reduce stat reliance and increase Variance/Chaos factors
            newWeights.formWeight -= learningRate;
            newWeights.h2hWeight -= learningRate;
            newWeights.variance += learningRate * 2; // Acknowledge chaos
            newWeights.mentalWeight += learningRate; // Mental often causes upsets
            adjustments++;
        } else if (isWin && confidence < 0.60) {
            // "Underdog Win" - We underestimated a factor
            // Often implies Surface or Momentum was more important than Form
            newWeights.surfaceWeight += learningRate;
            newWeights.momentumWeight += learningRate;
            newWeights.formWeight -= learningRate;
            adjustments++;
        } else if (isWin && confidence > 0.80) {
            // "Solid Prediction" - Reinforce current bias slightly
            newWeights.formWeight += (learningRate / 2);
        }
    });

    // 3. Normalize Weights (prevent infinite growth/shrink)
    newWeights.variance = Math.max(0.01, Math.min(0.20, newWeights.variance));
    newWeights.mentalWeight = Math.max(0.05, Math.min(0.30, newWeights.mentalWeight));
    newWeights.formWeight = Math.max(0.10, Math.min(0.50, newWeights.formWeight));
    newWeights.surfaceWeight = Math.max(0.20, Math.min(0.60, newWeights.surfaceWeight));

    // Calculate theoretical improvement
    const improvement = parseFloat(((adjustments / betHistory.length) * 1.5).toFixed(2)); // Simulated gain
    this.currentWeights = newWeights;
    
    // Explicitly Save to LocalStorage to ensure persistence "model_weights.json" style
    localStorage.setItem('oracle_ai_weights', JSON.stringify(newWeights));

    return {
        weights: newWeights,
        improvement: improvement,
        log: `Retraining terminé sur ${betHistory.length} paris. ${adjustments} ajustements effectués.`
    };
  }

  /**
   * Core Learning Function triggered by User "Pass/Fail" buttons
   */
  public learnFromMatch(
    isSuccess: boolean, 
    context: { circuit: Circuit, winnerPrediction: string, totalGames: number, riskLevel: string },
    matchId: string
  ): string {
    
    // 1. Store Experience
    const experience: LearningExperience = {
      matchId,
      circuit: context.circuit,
      result: isSuccess ? 'PASS' : 'FAIL',
      weightsUsed: { ...this.currentWeights },
      timestamp: new Date().toISOString()
    };
    this.history.push(experience);

    // 2. Adjust Weights (Auto-Calibration)
    let logMessage = "";

    if (isSuccess) {
      this.reinforceWeights(context.circuit);
      logMessage = `✅ SUCCÈS: Modèle ${context.circuit} renforcé. Confiance accrue.`;
    } else {
      this.correctWeights(context.circuit, context.riskLevel);
      logMessage = `❌ ÉCHEC: Recalibrage en cours. Variance et Facteur Mental augmentés pour ${context.circuit}.`;
    }

    // Persist immediately
    localStorage.setItem('oracle_ai_weights', JSON.stringify(this.currentWeights));

    return logMessage;
  }

  private reinforceWeights(circuit: Circuit) {
     const rate = 0.005; 
     if (circuit === 'ATP') {
         this.currentWeights.formWeight += rate;
         this.currentWeights.surfaceWeight += rate;
     } else if (circuit === 'WTA') {
         this.currentWeights.mentalWeight += rate;
         this.currentWeights.momentumWeight += rate;
     } else if (circuit === 'ITF') {
         this.currentWeights.h2hWeight += rate;
     }
  }

  private correctWeights(circuit: Circuit, riskLevel: string) {
      const rate = 0.02; 

      this.currentWeights.variance += rate;

      if (circuit === 'WTA') {
          this.currentWeights.serveDominance = Math.max(0.1, this.currentWeights.serveDominance - rate); 
          this.currentWeights.mentalWeight += rate;
          this.currentWeights.formWeight -= rate; 
      } else if (circuit === 'ATP') {
          this.currentWeights.fatigueFactor += rate;
          this.currentWeights.surfaceWeight += rate;
      } else if (circuit === 'CHALLENGER' || circuit === 'ITF') {
          this.currentWeights.formWeight -= (rate * 2); 
          this.currentWeights.mentalWeight += (rate * 2); 
      }
  }

  public getLearningStats() {
      const total = this.history.length;
      const pass = this.history.filter(h => h.result === 'PASS').length;
      const accuracy = total > 0 ? (pass / total) * 100 : 0;
      return { total, pass, fail: total - pass, accuracy };
  }
}
