// ... Imports existants ...
import { ScandalEngine } from './market/ScandalEngine';
import { TrapDetector } from './market/TrapDetector';
import { GeoEngine } from './market/GeoEngine';

// ... (Dans OracleAI) ...

  predictor: {
    // ... existant ...

    // NOUVELLE FONCTION GOD MODE
    runGodModeAnalysis: (match: any) => {
      // 1. Récupération des infos marché
      const pressSocial = ScandalEngine.analyze(match.player1.name);
      const integrity = TrapDetector.checkIntegrity(match.ai?.oddsAnalysis?.bookmakers || []);
      const conditions = GeoEngine.getConditions(match.tournament);

      // 2. Calcul des impacts (Logique floue simplifiée)
      let godConfidence = match.ai.confidence;
      
      // Si altitude et bon serveur -> Bonus
      if (conditions.altitude > 1000 && match.player1.surfacePrefs.hard > 80) {
          godConfidence += 5; 
      }

      // Si scandale ou pression -> Malus
      if (pressSocial.press.scandalAlert) {
          godConfidence -= 20;
      }

      // Si NO BET détecté
      if (integrity.riskLevel === 'NO_BET') {
          godConfidence = 0; // Annulation
      }

      return {
        ...match.ai,
        godModeAnalysis: {
            press: pressSocial.press,
            social: pressSocial.social,
            conditions: conditions,
            globalConfidence: Math.min(99, Math.max(1, godConfidence)),
            noBetReason: integrity.reason
        }
      };
    }
  }
