import { Match } from '../types';
import { OracleAI } from './index';

export const AutoValidator = {
  /**
   * Fonction à appeler au chargement de l'appli (ex: dans App.tsx)
   * Elle vérifie les matchs finis non validés et lance l'apprentissage.
   */
  run: (matches: Match[]): string[] => {
    const logs: string[] = [];
    
    // On ne garde que les matchs FINIS et qui n'ont PAS encore été validés
    const pendingMatches = matches.filter(m => m.status === 'FINISHED' && m.validationResult === 'PENDING');

    pendingMatches.forEach(match => {
        if (!match.score || !match.ai) return;

        // 1. Déterminer le vrai gagnant à partir du score (Logique simplifiée)
        // Ex score: "6-4 2-6 6-4" -> On compte les sets
        const sets = match.score.split(' ');
        let p1Sets = 0;
        let p2Sets = 0;

        sets.forEach(set => {
            if (set.includes('-')) { // Sécurité
                const [g1, g2] = set.split('-').map(Number);
                if (g1 > g2) p1Sets++;
                else if (g2 > g1) p2Sets++;
            }
        });

        // Qui a gagné ?
        const realWinner = p1Sets > p2Sets ? match.player1.name : match.player2.name;
        
        // 2. Est-ce que l'IA avait raison ?
        const iaPredictedWinner = match.ai.winner; // On suppose que l'IA prédit le winner
        const isIaCorrect = realWinner === iaPredictedWinner;

        // 3. Déclencher l'apprentissage
        const log = OracleAI.predictor.learning.learnFromMatch(
            isIaCorrect,
            {
                circuit: match.ai.circuit as any,
                winnerPrediction: match.ai.winner,
                totalGames: 0, // Pas utilisé pour l'instant
                riskLevel: match.ai.riskLevel
            },
            match.id
        );

        // 4. Marquer le match comme validé (En mémoire locale pour l'instant)
        // Note: Dans une vraie app, on ferait un appel API pour update la BDD
        match.validationResult = isIaCorrect ? 'CORRECT' : 'WRONG';
        
        logs.push(`[AUTO-VALIDATE] Match ${match.player1.name} vs ${match.player2.name} -> IA ${isIaCorrect ? 'GAGNANTE' : 'PERDANTE'}. ${log}`);
    });

    return logs;
  }
};
