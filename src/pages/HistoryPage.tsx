import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MatchCard } from '../components/MatchCard';
import { History, ListChecks, BrainCircuit, CheckCircle, XCircle, Zap, Activity } from 'lucide-react';
import { useBankroll } from '../context/BankrollContext';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BacktestEngine } from '../engine/BacktestEngine'; // Import du nouveau moteur

const accuracyData = [
  { month: 'Jan', acc: 65 }, { month: 'Fev', acc: 68 }, { month: 'Mar', acc: 72 },
  { month: 'Avr', acc: 70 }, { month: 'Mai', acc: 75 }, { month: 'Juin', acc: 78.5 }
];

export const HistoryPage: React.FC = () => {
  const { state } = useBankroll();
  const { matches } = useData();
  const [backtestLogs, setBacktestLogs] = useState<string[]>([]);
  
  // Matchs finis non encore validés manuellement
  const matchesToValidate = matches.filter(m => m.status === 'FINISHED');

  // --- FONCTION SALLE DU TEMPS ---
  const runBacktest = () => {
      if (matchesToValidate.length === 0) {
          alert("Pas de matchs terminés pour l'entraînement.");
          return;
      }
      const logs = BacktestEngine.run(matchesToValidate);
      setBacktestLogs(logs);
  };

  return (
    <div className="space-y-12">
      
      {/* SECTION 1 : PERFORMANCE IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-surface border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400"><BrainCircuit size={20}/></div>
                <div>
                    <h3 className="font-bold text-lg text-white">Cerveau IA (Entraînement)</h3>
                    <p className="text-xs text-gray-500">Précision actuelle basée sur l'historique.</p>
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

         {/* BOUTON D'ENTRAÎNEMENT */}
         <div className="bg-surface border border-neutral-800 rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <Activity size={48} className="text-neon mb-4 animate-pulse"/>
            <h3 className="font-bold text-lg text-white mb-2">Salle du Temps</h3>
            <p className="text-xs text-gray-400 mb-6">
                Utiliser les {matchesToValidate.length} matchs terminés d'aujourd'hui pour entraîner l'IA sans parier.
            </p>
            <button 
                onClick={runBacktest}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
                <Zap size={18} /> LANCER L'ENTRAÎNEMENT
            </button>
         </div>
      </div>

      {/* LOGS D'ENTRAÎNEMENT */}
      {backtestLogs.length > 0 && (
          <div className="bg-black/40 border border-purple-500/30 p-4 rounded-xl max-h-60 overflow-y-auto font-mono text-xs">
              {backtestLogs.map((log, i) => (
                  <p key={i} className={`mb-1 ${i===0 ? 'text-neon font-bold text-sm mb-3' : 'text-gray-400'}`}>{log}</p>
              ))}
          </div>
      )}

      {/* --- SECTION 2 : LISTE DES MATCHS (Pour validation manuelle si besoin) --- */}
      <div>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-neutral-800 rounded-full text-neon"><ListChecks size={24} /></div>
            <div>
                <h2 className="text-2xl font-bold">Résultats du Jour ({matchesToValidate.length})</h2>
            </div>
        </div>

        {matchesToValidate.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchesToValidate.map(match => (
                <MatchCard key={match.id} match={match} />
                ))}
            </div>
        ) : (
            <div className="text-center p-8 text-gray-500 border border-dashed border-neutral-800 rounded-xl">
                <CheckCircle size={32} className="text-green-500 opacity-50 mx-auto mb-2"/>
                <p>Aucun match terminé pour l'instant.</p>
            </div>
        )}
      </div>

      {/* Historique Financier (Reste inchangé...) */}
      {/* ... */}
    </div>
  );
};
