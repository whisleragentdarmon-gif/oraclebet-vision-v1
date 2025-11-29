import { AIModelWeights, Circuit, LearningExperience, BetRecord } from './types';

/**
 * Moteur d'Auto-Apprentissage
 * Adapte les poids internes en fonction des résultats PASS/FAIL (Succès/Échec).
 */
export class LearningModule {
  private currentWeights: AIModelWeights;
  private history: LearningExperience[];

  constructor() {
    // Poids par défaut
    this.currentWeights = {
      surfaceWeight: 0.35,
      formWeight: 0.30,
      h2hWeight: 0.15,
      mentalWeight: 0.10,
      fatigueFactor: 0.10,
      momentumWeight: 0.20,
      variance: 0.05,
      serveDominance: 1.0 
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
   * ALGORITHME CENTRAL : Ré-entraînement basé sur l'historique réel
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
    // Initialisation sécurisée des poids optionnels pour les calculs
    newWeights.formWeight = newWeights.formWeight || 0.3;
    newWeights.h2hWeight = newWeights.h2hWeight || 0.15;
    newWeights.variance = newWeights.variance || 0.05;
    newWeights.mentalWeight = newWeights.mentalWeight || 0.1;
    newWeights.surfaceWeight = newWeights.surfaceWeight || 0.35;
    newWeights.momentumWeight = newWeights.momentumWeight || 0.2;

    let errorScore = 0;
    let adjustments = 0;

    // 1. Phase d'Analyse
    betHistory.forEach(bet => {
        if (bet.status === 'PENDING') return;

        const isWin = bet.status === 'WON';
        const confidence = bet.confidenceAtTime / 100;
        
        const outcomeValue = isWin ? 1 : 0;
        const error = Math.abs(outcomeValue - confidence);
        errorScore += error;

        // 2. Logique d'Ajustement (Descente de gradient simplifiée)
        const learningRate = 0.005; 

        if (!isWin && confidence > 0.75) {
            // "Faux Positif" : Trop confiant sur les stats
            newWeights.formWeight -= learningRate;
            newWeights.h2hWeight -= learningRate;
            newWeights.variance += learningRate * 2;
            newWeights.mentalWeight += learningRate;
            adjustments++;
        } else if (isWin && confidence < 0.60) {
            // "Victoire Surprise" : On a sous-estimé la surface ou le momentum
            newWeights.surfaceWeight += learningRate;
            newWeights.momentumWeight += learningRate;
            newWeights.formWeight -= learningRate;
            adjustments++;
        } else if (isWin && confidence > 0.80) {
            // "Prédiction Solide" : On renforce le biais actuel
            newWeights.formWeight += (learningRate / 2);
        }
    });

    // 3. Normalisation (Évite les valeurs extrêmes)
    newWeights.variance = Math.max(0.01, Math.min(0.20, newWeights.variance));
    newWeights.mentalWeight = Math.max(0.05, Math.min(0.30, newWeights.mentalWeight));
    newWeights.formWeight = Math.max(0.10, Math.min(0.50, newWeights.formWeight));
    newWeights.surfaceWeight = Math.max(0.20, Math.min(0.60, newWeights.surfaceWeight));

    const improvement = parseFloat(((adjustments / betHistory.length) * 1.5).toFixed(2));
    this.currentWeights = newWeights;
    
    // Sauvegarde persistante
    if (typeof window !== 'undefined') {
        localStorage.setItem('oracle_ai_weights', JSON.stringify(newWeights));
    }

    return {
        weights: newWeights,
        improvement: improvement,
        log: `Retraining terminé sur ${betHistory.length} paris. ${adjustments} ajustements effectués.`
    };
  }

  /**
   * Fonction d'apprentissage déclenchée par les boutons utilisateur PASS/FAIL
   */
  public learnFromMatch(
    isSuccess: boolean, 
    context: { circuit: Circuit, winnerPrediction: string, totalGames: number, riskLevel: string },
    matchId: string
  ): string {
    
    // 1. Enregistrer l'expérience
    const experience: LearningExperience = {
      matchId,
      circuit: context.circuit,
      prediction: context.winnerPrediction,
      outcome: isSuccess ? 'WIN' : 'LOSS', // Adapte au type WIN/LOSS
      adjustments: isSuccess ? 'Reinforcement' : 'Correction',
      result: isSuccess ? 'PASS' : 'FAIL', // Propriété supplémentaire pour l'affichage
      weightsUsed: { ...this.currentWeights },
      timestamp: Date.now() // CORRECTION: Utilise un nombre (timestamp) et non une string
    };
    this.history.push(experience);

    // 2. Ajuster les poids
    let logMessage = "";

    if (isSuccess) {
      this.reinforceWeights(context.circuit);
      logMessage = `✅ SUCCÈS: Modèle ${context.circuit} renforcé. Confiance accrue.`;
    } else {
      this.correctWeights(context.circuit, context.riskLevel);
      logMessage = `❌ ÉCHEC: Recalibrage en cours. Variance et Facteur Mental augmentés pour ${context.circuit}.`;
    }

    // Sauvegarde immédiate
    if (typeof window !== 'undefined') {
        localStorage.setItem('oracle_ai_weights', JSON.stringify(this.currentWeights));
    }

    return logMessage;
  }

  private reinforceWeights(circuit: Circuit) {
     const rate = 0.005; 
     if (circuit === 'ATP') {
         this.currentWeights.formWeight = (this.currentWeights.formWeight || 0.3) + rate;
         this.currentWeights.surfaceWeight = (this.currentWeights.surfaceWeight || 0.35) + rate;
     } else if (circuit === 'WTA') {
         this.currentWeights.mentalWeight = (this.currentWeights.mentalWeight || 0.1) + rate;
         this.currentWeights.momentumWeight = (this.currentWeights.momentumWeight || 0.2) + rate;
     } else if (circuit === 'ITF') {
         this.currentWeights.h2hWeight = (this.currentWeights.h2hWeight || 0.15) + rate;
     }
  }

  private correctWeights(circuit: Circuit, riskLevel: string) {
      const rate = 0.02; 

      this.currentWeights.variance = (this.currentWeights.variance || 0.05) + rate;

      if (circuit === 'WTA') {
          // Utilisation de || 1.0 pour éviter undefined sur serveDominance
          this.currentWeights.serveDominance = Math.max(0.1, (this.currentWeights.serveDominance || 1.0) - rate); 
          this.currentWeights.mentalWeight = (this.currentWeights.mentalWeight || 0.1) + rate;
          this.currentWeights.formWeight = (this.currentWeights.formWeight || 0.3) - rate; 
      } else if (circuit === 'ATP') {
          this.currentWeights.fatigueFactor = (this.currentWeights.fatigueFactor || 0.1) + rate;
          this.currentWeights.surfaceWeight = (this.currentWeights.surfaceWeight || 0.35) + rate;
      } else if (circuit === 'CHALLENGER' || circuit === 'ITF') {
          this.currentWeights.formWeight = (this.currentWeights.formWeight || 0.3) - (rate * 2); 
          this.currentWeights.mentalWeight = (this.currentWeights.mentalWeight || 0.1) + (rate * 2); 
      }
  }

  public getLearningStats() {
      const total = this.history.length;
      const pass = this.history.filter(h => h.result === 'PASS').length;
      const accuracy = total > 0 ? (pass / total) * 100 : 0;
      return { total, pass, fail: total - pass, accuracy };
  }
}
