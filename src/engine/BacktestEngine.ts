import { Match } from '../types';
import { OracleAI } from './index';

export const BacktestEngine = {
  run: (matches: Match[]): string[] => {
    const logs: string[] = [];
    let successCount = 0;
    let totalProcessed = 0;

    matches.forEach(match => {
        if (!match.score || match.status !== 'FINISHED') return;

        // 1. Déterminer le vrai vainqueur
        const sets = match.score.split(' ');
        let p1Sets = 0, p2Sets = 0;
        
        sets.forEach(s => {
            const cleanScore = s.replace(/[()]/g, ''); 
            if (cleanScore.includes('-')) {
                const [g1, g2] = cleanScore.split('-').map(Number);
                if (!isNaN(g1) && !isNaN(g2)) {
                    if (g1 > g2) p1Sets++; else if (g2 > g1) p2Sets++;
                }
            }
        });

        if (p1Sets === p2Sets) return; // Match nul ou abandon non compté
        const actualWinner = p1Sets > p2Sets ? match.player1.name : match.player2.name;

        // 2. IA PLUS INTELLIGENTE : Utilise la confiance simulée
        // Si confiance > 70%, elle suit le favori.
        // Si confiance < 60% (match serré), elle a 40% de chance de tenter l'outsider (Simulation de risque)
        const p1IsFav = match.odds.p1 < match.odds.p2;
        const confidence = match.ai?.confidence || 60;
        
        let predictedWinner = p1IsFav ? match.player1.name : match.player2.name;

        // Simulation d'une "prise de risque" ou d'une erreur d'analyse humaine
        if (confidence < 60 && Math.random() > 0.6) {
            predictedWinner = p1IsFav ? match.player2.name : match.player1.name;
        }

        // 3. Comparaison
        const isCorrect = predictedWinner === actualWinner;
        if (isCorrect) successCount++;
        totalProcessed++;

        // Apprentissage réel
        OracleAI.predictor.learning.learnFromMatch(
            isCorrect,
            {
                circuit: match.ai?.circuit as any || 'ITF',
                winnerPrediction: predictedWinner,
                totalGames: p1Sets + p2Sets,
                riskLevel: match.ai?.riskLevel || 'MODERATE'
            },
            match.id
        );
        
        const icon = isCorrect ? '✅' : '❌';
        logs.push(`${icon} [${match.ai?.circuit}] ${match.player1.name} vs ${match.player2.name} -> IA: ${predictedWinner} (${confidence}%)`);
    });

    const accuracy = totalProcessed > 0 ? ((successCount / totalProcessed) * 100).toFixed(1) : 0;
    logs.unshift(`📊 RÉSULTAT SESSION : ${successCount} réussites / ${totalProcessed} matchs. Précision du modèle : ${accuracy}%.`);
    
    return logs;
  }
};
