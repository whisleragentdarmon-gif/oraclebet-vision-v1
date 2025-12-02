import React, { useState } from 'react';
import { Match } from '../types';
import { useData } from '../context/DataContext';
import { X, Trophy, Clock, Zap, Calendar, BarChart3, Map, FileText } from 'lucide-react';
import { DetailedH2H } from './DetailedH2H'; // On peut l'utiliser ici aussi si besoin, mais c'est AnalysisPage qui gère le God Mode

interface Props {
  match: Match | null;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<Props> = ({ match, onClose }) => {
  const { matches } = useData();
  const [activeTab, setActiveTab] = useState<'ANALYSIS' | 'FORM'>('ANALYSIS');

  if (!match) return null;
  const liveMatch = matches.find(m => m.id === match.id) || match;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-carbon border border-neutral-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header Simple */}
        <div className="bg-surface p-4 flex justify-between items-center border-b border-neutral-800">
           <div>
               <div className="flex items-center gap-2 text-neon mb-1">
                  <Trophy size={16} />
                  <span className="text-xs font-bold tracking-widest uppercase">{liveMatch.tournament}</span>
               </div>
               <div className="flex items-center gap-2 text-white font-bold text-lg">
                   {liveMatch.player1.name} <span className="text-gray-500 text-sm">vs</span> {liveMatch.player2.name}
               </div>
               <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                   <Clock size={12}/> {liveMatch.date} - {liveMatch.time}
               </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="text-gray-400 hover:text-white" />
           </button>
        </div>

        {/* Note : On a retiré le Scoreboard 0-0-0 inutile pour les matchs à venir */}

        {/* Onglets */}
        <div className="flex border-b border-neutral-800 bg-surface">
            <button onClick={() => setActiveTab('ANALYSIS')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 ${activeTab === 'ANALYSIS' ? 'border-neon text-white' : 'border-transparent text-gray-500'}`}>
                <Zap size={14} /> APERÇU RAPIDE
            </button>
            {/* On retire les stats live si match pas commencé */}
        </div>

        <div className="overflow-y-auto p-6 bg-carbon">
            {activeTab === 'ANALYSIS' && (
                <div className="text-center space-y-4">
                    <div className="bg-surfaceHighlight p-6 rounded-xl border border-neutral-800">
                        <FileText size={32} className="mx-auto text-gray-600 mb-4"/>
                        <h3 className="text-white font-bold mb-2">Analyse Approfondie Requise</h3>
                        <p className="text-gray-400 text-sm">
                            Pour voir le tableau complet (H2H, Météo, Mental, Blessures), 
                            veuillez utiliser le bouton <b>"Analyse IA"</b> dans le menu de gauche 
                            et lancer le <b>God Mode</b>.
                        </p>
                    </div>
                    <p className="text-xs text-gray-600">Ce modal n'est qu'un aperçu rapide.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
