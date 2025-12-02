import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MatchCard } from '../components/MatchCard';
import { ListChecks, BrainCircuit, CheckCircle, Activity, Zap, RefreshCw } from 'lucide-react';
import { useBankroll } from '../context/BankrollContext';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BacktestEngine } from '../engine/BacktestEngine';

// Données de précision (Statiques pour l'instant, deviendront dynamiques plus tard)
const accuracyData = [
  { month: 'S-5', acc: 65 }, { month: 'S-4', acc: 68 }, { month: 'S-3', acc: 72 },
  { month: 'S-2', acc: 70 }, { month: 'Hier', acc: 75 }, { month: 'Auj.', acc: 78.5 }
];

export const HistoryPage: React.FC = () => {
  const { state } = useBankroll();
  const { matches } = useData();
  const [backtestLogs, setBacktestLogs] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  
  // Matchs finis (Pour l'entraînement IA)
  const finishedMatches = matches.filter(m => m.status === 'FINISHED');

  // Matchs finis NON VALIDÉS (Pour la Bankroll)
  const matchesToValidate = finishedMatches.filter(m => !state.history.some(h => h.matchId === m.id));

  const runBacktest = () => {
      if (finishedMatches.length === 0) {
          alert("Aucun match terminé disponible pour l'entraînement.");
          return;
      }
      setIsTraining(true);
      // Simulation d'un petit délai pour l'effet "Calcul"
      setTimeout(() => {
          const logs = BacktestEngine.run(finishedMatches);
          setBacktestLogs(logs);
          setIsTraining(false);
      }, 1000);
  };

  return (
    <div className="space-y-12">
      
      {/* --- ZONE D'ENTRAÎNEMENT (SALLE DU TEMPS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-surface border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400"><BrainCircuit size={20}/></div>
                <div>
                    <h3 className="font-bold text-lg text-white">Cerveau IA (Précision)</h3>
                    <p className="text-xs text-gray-500">Évolution de la précision du modèle sur les dernières sessions.</p>
                </div>
            </div>
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={accuracyData}>
                        <defs>
                            <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" stroke="#666" fontSize={12} />
                        <Tooltip contentStyle={{backgroundColor: '#1F1F1F', border: 'none'}} />
                        <Area type="monotone" dataKey="acc" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* PANNEAU DE CONTRÔLE ENTRAÎNEMENT */}
         <div className="bg-surface border border-neutral-800 rounded-xl p-6 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-purple-500/5"></div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4 text-neon">
                    <Activity size={24} />
                    <h3 className="font-bold text-lg text-white">Salle du Temps</h3>
                </div>
                
                <div className="flex-1 text-xs text-gray-400 mb-4">
                    <p>Matchs disponibles : <span className="text-white font-bold">{finishedMatches.length}</span></p>
                    <p className="mt-2">Lancez une simulation rétroactive pour calibrer les poids de l'IA sur les résultats récents.</p>
                </div>

                <button 
                    onClick={runBacktest}
                    disabled={isTraining || finishedMatches.length === 0}
                    className={`w-full font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${isTraining ? 'bg-neutral-700 text-gray-500 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105'}`}
                >
                    {isTraining ? <RefreshCw size={18} className="animate-spin"/> : <Zap size={18} />} 
                    {isTraining ? 'Calibrage...' : 'LANCER ENTRAÎNEMENT'}
                </button>
            </div>
         </div>
      </div>

      {/* LOGS D'ENTRAÎNEMENT (S'affichent après le test) */}
      {backtestLogs.length > 0 && (
          <div className="bg-black/40 border border-purple-500/30 p-4 rounded-xl max-h-60 overflow-y-auto font-mono text-xs animate-fade-in scrollbar-thin scrollbar-thumb-purple-900">
              <h4 className="text-purple-400 font-bold mb-2 sticky top-0 bg-black/80 p-1">Rapport de Session</h4>
              {backtestLogs.map((log, i) => (
                  <p key={i} className={`mb-1 border-b border-white/5 pb-1 ${i===0 ? 'text-neon font-bold text-sm mb-3 border-b-2 border-neon/50' : 'text-gray-300'}`}>{log}</p>
              ))}
          </div>
      )}

      {/* --- SECTION 3 : VALIDATION BANQUAIRE --- */}
      <div>
        <div className="flex items-center gap-3 mb-6 pt-8 border-t border-neutral-800">
            <div className="p-3 bg-green-900/20 rounded-full text-green-500"><ListChecks size={24} /></div>
            <div>
                <h2 className="text-2xl font-bold">Validation Financière</h2>
                <p className="text-sm text-gray-400">Validez les résultats réels pour mettre à jour votre Bankroll.</p>
            </div>
        </div>

        {matchesToValidate.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchesToValidate.map(match => (
                <MatchCard key={match.id} match={match} />
                ))}
            </div>
        ) : (
            <div className="text-center p-8 text-gray-500 border border-dashed border-neutral-800 rounded-xl flex flex-col items-center gap-2">
                <CheckCircle size={32} className="text-green-500 opacity-50 mx-auto mb-2"/>
                <p>Aucun match en attente de validation financière.</p>
            </div>
        )}
      </div>
    </div>
  );
};
