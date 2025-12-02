import React, { useState } from 'react';
import { Match } from '../types';
import { Trophy, Clock, Zap, CheckCircle, XCircle, Calendar, Flag } from 'lucide-react';
import { OracleAI } from '../engine';
import { useBankroll } from '../context/BankrollContext';
import { useData } from '../context/DataContext'; // 👈 Import pour marquer comme fini

interface MatchCardProps {
  match: Match;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, selected, onClick, compact }) => {
  const [validation, setValidation] = useState<'PENDING' | 'CORRECT' | 'WRONG'>(match.validationResult || 'PENDING');
  const { validateBet } = useBankroll(); 
  const { markAsFinished } = useData(); // 👈 Fonction manuelle

  const handleValidate = (e: React.MouseEvent, isSuccess: boolean) => {
    e.stopPropagation(); 
    if (match.ai) {
        OracleAI.predictor.learning.learnFromMatch(isSuccess, { circuit: match.ai.circuit as any, winnerPrediction: match.ai.winner, totalGames: 0, riskLevel: match.ai.riskLevel }, match.id);
    }
    const oddsPlayed = match.ai?.winner === match.player1.name ? match.odds.p1 : match.odds.p2;
    validateBet(match, match.ai?.recommendedBet || "Pari IA", oddsPlayed, isSuccess);
    setValidation(isSuccess ? 'CORRECT' : 'WRONG');
  };

  // Fonction pour forcer la fin du match (Passage en Résultats)
  const handleManualFinish = (e: React.MouseEvent) => {
      e.stopPropagation();
      const score = prompt("Score final du match ? (ex: 6-4 6-3)", "Terminé");
      if (score) {
          markAsFinished(match.id, score);
      }
  };

  return (
    <div onClick={onClick} className={`bg-surface border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-neon/50 relative overflow-hidden ${selected ? 'border-neon ring-1 ring-neon shadow-[0_0_15px_rgba(255,122,0,0.2)]' : 'border-neutral-800'} ${compact ? 'py-3' : 'py-4'}`}>
      
      {/* En-tête : Tournoi et Date/Heure + BOUTON FINIR */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Trophy size={12} className="text-neon" />
          <span className="truncate max-w-[120px]">{match.tournament}</span>
        </div>
        
        <div className="flex items-center gap-2">
           {/* Bouton Terminer (Seulement si pas fini et pas compact) */}
           {match.status !== 'FINISHED' && !compact && (
               <button 
                  onClick={handleManualFinish}
                  className="p-1 bg-neutral-800 rounded hover:bg-red-900/50 text-gray-500 hover:text-red-400 transition-colors"
                  title="Marquer comme terminé (Vers Résultats)"
               >
                   <Flag size={10} />
               </button>
           )}

           {/* Statut */}
           <div className="text-xs">
               {match.status === 'LIVE' ? (
                 <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse"><span className="w-2 h-2 rounded-full bg-red-500"></span> LIVE</span>
               ) : match.status === 'FINISHED' ? (
                 <span className="text-gray-500 font-bold">TERMINÉ {match.score && `(${match.score})`}</span>
               ) : (
                 <span classNa
