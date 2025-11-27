
import { Circuit, AIModelWeights } from './types';

export class CircuitHelper {
  
  /**
   * Detects the circuit based on the tournament string.
   */
  static detectCircuit(tournament: string): Circuit {
    const t = tournament.toUpperCase();
    if (t.includes('WTA') || t.includes('WOMEN') || t.includes('FED CUP') || t.includes('BJK')) {
      return 'WTA';
    }
    if (t.includes('CHALLENGER')) {
      return 'CHALLENGER';
    }
    if (t.includes('ITF') || t.includes('M15') || t.includes('W15') || t.includes('M25') || t.includes('W25') || t.includes('FUTURES')) {
      return 'ITF';
    }
    return 'ATP'; // Default
  }

  /**
   * Returns adjusted model weights based on the circuit.
   */
  static getCircuitWeights(circuit: Circuit, baseWeights: AIModelWeights): AIModelWeights {
    const w = { ...baseWeights };

    switch (circuit) {
      case 'WTA':
        // WTA: Momentum is key, Serve is less dominant, Mental is crucial
        w.mentalWeight += 0.10;
        w.formWeight += 0.05;
        w.surfaceWeight -= 0.05;
        break;
      
      case 'CHALLENGER':
        // Challenger: High fatigue impact, erratic form
        w.fatigueFactor += 0.15;
        w.formWeight -= 0.10; // Form is less reliable
        break;

      case 'ITF':
        // ITF: Pure chaos, relies heavily on raw H2H if available, or just random variance
        w.h2hWeight += 0.20;
        w.mentalWeight += 0.20; // Mental collapses are frequent
        w.surfaceWeight += 0.05;
        break;
      
      case 'ATP':
      default:
        // ATP: Standard balanced weights
        break;
    }
    return w;
  }

  /**
   * Modifiers for simulation physics
   */
  static getSimulationModifiers(circuit: Circuit) {
    switch (circuit) {
      case 'WTA':
        return {
          serveDominance: 0.7, // Serve is 30% less effective than ATP baseline
          breakProbability: 1.4, // 40% more breaks
          variance: 1.2 // Higher score swings
        };
      case 'CHALLENGER':
        return {
          serveDominance: 0.9,
          breakProbability: 1.1,
          variance: 1.3 // High variance due to inconsistency
        };
      case 'ITF':
        return {
          serveDominance: 0.85,
          breakProbability: 1.2,
          variance: 1.5 // Maximum Chaos
        };
      case 'ATP':
      default:
        return {
          serveDominance: 1.0,
          breakProbability: 1.0,
          variance: 1.0
        };
    }
  }

  static getCircuitLabel(circuit: Circuit): string {
    switch(circuit) {
        case 'ATP': return "ATP Tour";
        case 'WTA': return "WTA Tour";
        case 'CHALLENGER': return "ATP Challenger";
        case 'ITF': return "ITF Futures";
    }
  }
}
