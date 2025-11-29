import React, { useState } from 'react';
import { Match } from '../types';
import { Trophy, Clock, Zap, CheckCircle, XCircle } from 'lucide-react';
import { OracleAI } from '../engine';
import { useBankroll } from '../context/BankrollContext'; // 👈 IMPORT 1

interface MatchCardProps {
  match: Match;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, selected, onClick, compact }) => {
  const [validation, setValidation] = useState<'PENDING' | 'CORRECT' | 'WRONG'>(match.validationResult || 'PENDING');
  
  // 👇 IMPORT 2 : On récupère la fonction pour ajouter au journal
  const { validateBet } = useBankroll(); 

  const handleValidate = (e: React.MouseEvent, isSuccess: boolean) => {
    e.stopPropagation(); 
    
    // 1. Apprentissage IA (Cerveau)
    if (match.ai) {
        const log = OracleAI.predictor.learning.learnFromMatch(
            isSuccess,
            {
                circuit: match.ai.circuit as any,
                winnerPrediction: match.ai.winner,
                totalGames: 0,
                riskLevel: match.ai.riskLevel
            },
            match.id
        );
        // On retire l'alerte popup pour que ce soit plus fluide
        console.log(log); 
    }

    // 2. Mise à jour Bankroll (Argent) -> C'EST ICI LA CORRECTION
    // On détermine la cote qui a été jouée (celle du vainqueur prédit par l'IA)
    const oddsPlayed = match.ai?.winner === match.player1.name ? match.odds.p1 : match.odds.p2;
    
    // On enregistre le pari dans l'historique
    // Le système va calculer la mise automatiquement selon la confiance IA
    validateBet(
        match, 
        match.ai?.recommendedBet || "Pari IA", 
        oddsPlayed, 
        isSuccess
    );

    // 3. Mise à jour visuelle
    setValidation(isSuccess ? 'CORRECT' : 'WRONG');
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-surface border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-neon/50 relative overflow-hidden
        ${selected ? 'border-neon ring-1 ring-neon shadow-[0_0_15px_rgba(255,122,0,0.2)]' : 'border-neutral-800'}
        ${compact ? 'py-3' : 'py-4'}
      `}
    >
      {/* En-tête : Tournoi et Heure */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Trophy size={12} className="text-neon" />
          <span className="truncate max-w-[120px]">{match.tournament}</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs">
           {match.status === 'LIVE' ? (
             <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
               <span className="w-2 h-2 rounded-full bg-red-500"></span> LIVE
             </span>
           ) : match.status === 'FINISHED' ? (
             <span className="text-gray-500 font-bold">TERMINÉ {match.score && `(${match.score})`}</span>
           ) : (
             <span className="flex items-center gap-1 text-gray-500">
               <Clock size={12} /> {match.time}
             </span>
           )}
        </div>
      </div>

      {/* Les Joueurs */}
      <div className="space-y-2 relative z-10">
        <div className="flex justify-between items-center">
          <span className={`font-medium ${match.ai?.winner === match.player1.name ? 'text-neon' : 'text-white'}`}>
            {match.player1.name}
          </span>
          <span className="text-sm font-mono text-gray-400">{match.odds.p1.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
           <span className={`font-medium ${match.ai?.winner === match.player2.name ? 'text-neon' : 'text-white'}`}>
            {match.player2.name}
          </span>
          <span className="text-sm font-mono text-gray-400">{match.odds.p2.toFixed(2)}</span>
        </div>
      </div>

      {/* SECTION VALIDATION (Seulement si match fini et pas encore validé) */}
      {match.status === 'FINISHED' && validation === 'PENDING' && !compact && (
          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between animate-fade-in">
              <span className="text-[10px] text-gray-500 uppercase">Résultat IA ?</span>
              <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleValidate(e, true)}
                    className="p-1.5 rounded-lg bg-green-900/30 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                    title="Gagné"
                  >
                      <CheckCircle size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleValidate(e, false)}
                    className="p-1.5 rounded-lg bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    title="Perdu"
                  >
                      <XCircle size={16} />
                  </button>
              </div>
          </div>
      )}

      {/* RÉSULTAT VALIDÉ */}
      {validation !== 'PENDING' && !compact && (
          <div className={`mt-3 text-xs font-bold flex items-center gap-2 ${validation === 'CORRECT' ? 'text-green-500' : 'text-red-500'}`}>
              {validation === 'CORRECT' ? <CheckCircle size={14}/> : <XCircle size={14}/>}
              {validation === 'CORRECT' ? 'Succès IA' : 'Échec IA'}
          </div>
      )}

      {/* Badges IA (Si non fini) */}
      {!compact && match.status !== 'FINISHED' && match.ai && (
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-neon">
            <Zap size={12} />
            <span>IA: {match.ai.confidence}%</span>
          </div>
          <span className="text-[10px] bg-neutral-800 text-gray-400 px-2 py-1 rounded border border-neutral-700">
            {match.ai.riskLevel}
          </span>
        </div>
      )}
    </div>
  );
};
