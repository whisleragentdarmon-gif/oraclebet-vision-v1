import { Match } from '../types';
import { OracleAI } from './index';

export const BacktestEngine = {
  run: (matches: Match[]): string[] => {
    const logs: string[] = [];
    let successCount = 0;

    matches.forEach(match => {
        if (!match.score) return;

        // 1. Simuler la prédiction (comme si le match n'était pas joué)
        // On utilise les cotes et les rangs pour que l'IA "devine"
        // (Dans la vraie vie, elle utiliserait aussi le God Mode Web, mais ici on fait rapide)
        const p1Win = match.odds.p1 < match.odds.p2; // Logique de base IA pour l'exemple
        const predictedWinner = p1Win ? match.player1.name : match.player2.name;

        // 2. Vérifier le vrai résultat via le score
        // Ex score: "6-4 6-2" -> P1 gagne
        // Ex score: "1-6 4-6" -> P2 gagne
        let actualWinner = null;
        
        // Parsing simple du score pour trouver le vainqueur
        const sets = match.score.split(' ');
        let p1Sets = 0; 
        let p2Sets = 0;
        
        sets.forEach(s => {
            const p = s.split('-');
            if (p.length === 2) {
                if (parseInt(p[0]) > parseInt(p[1])) p1Sets++;
                else if (parseInt(p[1]) > parseInt(p[0])) p2Sets++;
            }
        });

        if (p1Sets > p2Sets) actualWinner = match.player1.name;
        else if (p2Sets > p1Sets) actualWinner = match.player2.name;

        // 3. Apprentissage
        if (actualWinner) {
            const isCorrect = predictedWinner === actualWinner;
            if (isCorrect) successCount++;

            // On injecte l'expérience dans le cerveau
            OracleAI.predictor.learning.learnFromMatch(
                isCorrect,
                {
                    circuit: match.ai?.circuit as any || 'ATP',
                    winnerPrediction: predictedWinner,
                    totalGames: 0,
                    riskLevel: 'MODERATE'
                },
                match.id
            );
            
            logs.push(`Match ${match.player1.name} vs ${match.player2.name} : IA avait dit ${predictedWinner}. Résultat : ${isCorrect ? 'BRAVO' : 'RATÉ'}.`);
        }
    });

    logs.unshift(`SESSION TERMINÉE : ${successCount} prédictions correctes sur ${matches.length} matchs simulés.`);
    return logs;
  }
};
