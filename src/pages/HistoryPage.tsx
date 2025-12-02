import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { ListChecks, BrainCircuit, CheckCircle, Activity, Zap, Search, Trophy, ChevronDown, ChevronUp, XCircle, Check } from 'lucide-react';
import { useBankroll } from '../context/BankrollContext';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BacktestEngine } from '../engine/BacktestEngine';
import { Match } from '../types';

const accuracyData = [
  { month: 'S-5', acc: 65 }, { month: 'S-4', acc: 68 }, { month: 'S-3', acc: 72 },
  { month: 'S-2', acc: 70 }, { month: 'Hier', acc: 75 }, { month: 'Auj.', acc: 78.5 }
];

export const HistoryPage: React.FC = () => {
  const { state, validateBet } = useBankroll();
  const { matches } = useData();
  const [backtestLogs, setBacktestLogs] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- LOGIQUE DE FILTRAGE ET REGROUPEMENT ---
  
  // 1. On ne garde que les matchs finis NON validés
  const matchesToValidate = matches.filter(m => 
    m.status === 'FINISHED' && 
    !state.history.some(h => h.matchId === m.id) &&
    (m.player1.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.player2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     m.tournament.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 2. On regroupe par Tournoi (C'est ça qui nettoie l'affichage)
  const matchesByTournament = useMemo(() => {
      const groups: Record<string, Match[]> = {};
      matchesToValidate.forEach(m => {
          if (!groups[m.tournament]) groups[m.tournament] = [];
          groups[m.tournament].push(m);
      });
      return groups;
  }, [matchesToValidate]);

  // --- ACTIONS ---

  const runBacktest = () => {
      if (matchesToValidate.length === 0) {
          alert("Aucun match terminé disponible pour l'entraînement.");
          return;
      }
      setIsTraining(true);
      setTimeout(() => {
          const logs = BacktestEngine.run(matchesToValidate);
          setBacktestLogs(logs);
          setIsTraining(false);
      }, 1000);
  };

  const handleManualValidate = (match: Match, isWin: boolean) => {
      const oddsPlayed = match.ai?.winner === match.player1.name ? match.odds.p1 : match.odds.p2;
      validateBet(match, match.ai?.recommendedBet || "Pari IA", oddsPlayed, isWin);
  };

  // --- COMPOSANT DE LIGNE (Compact) ---
  const MatchRow = ({ match }: { match: Match }) => (
      <div className="flex items-center justify-between p-3 border-b border-neutral-800 hover:bg-white/5 transition-colors group">
          <div className="flex items-center gap-4 flex-1">
              <div className="text-xs text-gray-500 w-12">{match.time}</div>
              <div className="flex-1">
                  <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${match.ai?.winner === match.player1.name ? 'text-neon' : 'text-white'}`}>{match.player1.name}</span>
                      <span className="text-xs text-gray-600">vs</span>
                      <span className={`font-bold text-sm ${match.ai?.winner === match.player2.name ? 'text-neon' : 'text-white'}`}>{match.player2.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                      <span>Score: <span className="text-white">{match.score}</span></span>
                      {match.ai && <span className="text-neon">• Prédiction: {match.ai.winner} ({match.ai.confidence}%)</span>}
                  </div>
              </div>
          </div>
          
          <div className="flex items-center gap-2">
              <div className="text-right mr-4 hidden md:block">
                  <div className="text-xs text-gray-400">Cote</div>
                  <div className="font-mono text-white font-bold">{(match.ai?.winner === match.player1.name ? match.odds.p1 : match.odds.p2).toFixed(2)}</div>
              </div>
              <button 
                onClick={() => handleManualValidate(match, true)}
                className="p-2 bg-green-900/20 hover:bg-green-500 text-green-500 hover:text-white rounded-lg transition-all flex items-center gap-1 border border-green-900/50"
                title="L'IA a GAGNÉ"
              >
                  <Check size={16} /> <span className="text-xs font-bold hidden sm:inline">GAGNÉ</span>
              </button>
              <button 
                onClick={() => handleManualValidate(match, false)}
                className="p-2 bg-red-900/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all flex items-center gap-1 border border-red-900/50"
                title="L'IA a PERDU"
              >
                  <XCircle size={16} /> <span className="text-xs font-bold hidden sm:inline">PERDU</span>
              </button>
          </div>
      </div>
  );

  return (
    <div className="space-y-8">
      
      {/* SECTION 1 : PERFORMANCE & ENTRAÎNEMENT (Salle du Temps) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-surface border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400"><BrainCircuit size={20}/></div>
                <div>
                    <h3 className="font-bold text-lg text-white">Cerveau IA (Précision)</h3>
                    <p className="text-xs text-gray-500">Auto-apprentissage sur les résultats validés.</p>
                </div>
            </div>
            <div className="h-[180px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={accuracyData}>
                        <defs>
                            <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" stroke="#666" fontSize={10} />
                        <Tooltip contentStyle={{backgroundColor: '#1F1F1F', border: 'none'}} />
                        <Area type="monotone" dataKey="acc" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorAcc)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {/* Fond décoratif */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-3xl rounded-full pointer-events-none"></div>
         </div>

         <div className="bg-surface border border-neutral-800 rounded-xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <Activity size={48} className="text-neon mb-4"/>
            <h3 className="font-bold text-lg text-white mb-2">Salle du Temps</h3>
            <p className="text-xs text-gray-400 mb-6">
                {matchesToValidate.length} matchs terminés en attente d'analyse rétroactive.
            </p>
            <button 
                onClick={runBacktest}
                disabled={isTraining || matchesToValidate.length === 0}
                className={`w-full font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${isTraining ? 'bg-neutral-700 text-gray-500' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105'}`}
            >
                {isTraining ? <RefreshCw size={18} className="animate-spin"/> : <Zap size={18} />} 
                {isTraining ? 'Entraînement...' : 'LANCER SIMULATION'}
            </button>
            
            {/* Logs rapides */}
            {backtestLogs.length > 0 && (
                <div className="mt-4 w-full bg-black/40 p-2 rounded text-[10px] text-gray-400 font-mono text-left max-h-24 overflow-y-auto border border-white/5">
                    {backtestLogs[0]}
                </div>
            )}
         </div>
      </div>

      {/* SECTION 2 : VALIDATION GROUPÉE (NOUVEAU DESIGN) */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-neutral-800 rounded-full text-neon"><ListChecks size={24} /></div>
                <div>
                    <h2 className="text-2xl font-bold">Validation ({matchesToValidate.length})</h2>
                    <p className="text-sm text-gray-400">Liste groupée par tournoi pour validation rapide.</p>
                </div>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Chercher un joueur..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black/30 border border-neutral-700 text-white text-sm rounded-full pl-10 pr-4 py-2 focus:border-neon outline-none w-64"
                />
            </div>
        </div>

        {Object.keys(matchesByTournament).length > 0 ? (
            <div className="space-y-6">
                {Object.entries(matchesByTournament).map(([tournament, tournamentMatches]) => (
                    <div key={tournament} className="bg-surface border border-neutral-800 rounded-xl overflow-hidden animate-fade-in">
                        {/* En-tête Tournoi */}
                        <div className="bg-surfaceHighlight px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <Trophy size={14} className="text-neon" />
                                {tournament}
                            </div>
                            <span className="text-xs text-gray-500 bg-black/30 px-2 py-0.5 rounded">{tournamentMatches.length} matchs</span>
                        </div>
                        
                        {/* Liste des matchs du tournoi */}
                        <div className="divide-y divide-neutral-800">
                            {tournamentMatches.map(match => (
                                <MatchRow key={match.id} match={match} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center p-12 text-gray-500 border border-dashed border-neutral-800 rounded-xl">
                <CheckCircle size={40} className="text-green-500 opacity-50 mx-auto mb-4"/>
                <p>Tout est propre ! Aucun résultat en attente.</p>
            </div>
        )}
      </div>

      {/* SECTION 3 : HISTORIQUE (L'ancien tableau des paris validés reste en bas) */}
      {/* ... (On peut laisser le tableau d'historique financier ici si tu veux, ou le retirer pour alléger) ... */}
    </div>
  );
};
