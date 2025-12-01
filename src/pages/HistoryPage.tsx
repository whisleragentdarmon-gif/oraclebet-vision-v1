// ... imports
import { useData } from '../context/DataContext'; // Import useData

export const HistoryPage: React.FC = () => {
  const { state } = useBankroll();
  const { matches } = useData(); // Récupère les données API

  // 👇 FILTRE STRICT : Que les matchs finis venant de l'API
  const matchesToValidate = matches.filter(m => m.status === 'FINISHED');

  // ... (reste du code, remplace MOCK_MATCHES par matchesToValidate si besoin)
import React, { useState } from 'react';
import { MOCK_MATCHES } from '../constants';
import { MatchCard } from '../components/MatchCard';
import { History, ListChecks, BrainCircuit, CheckCircle, XCircle, Zap } from 'lucide-react';
import { useBankroll } from '../context/BankrollContext';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AutoValidator } from '../engine/AutoValidator'; // Import du moteur auto

const accuracyData = [
  { month: 'Jan', acc: 65 }, { month: 'Fev', acc: 68 }, { month: 'Mar', acc: 72 },
  { month: 'Avr', acc: 70 }, { month: 'Mai', acc: 75 }, { month: 'Juin', acc: 78.5 }
];

export const HistoryPage: React.FC = () => {
  const { state } = useBankroll();
  const [autoLogs, setAutoLogs] = useState<string[]>([]);
  
  // Matchs à valider (Finis mais en attente)
  const matchesToValidate = MOCK_MATCHES.filter(m => m.status === 'FINISHED' && m.validationResult === 'PENDING');

  // Fonction "God Mode" Auto-Validation
  const runAutoValidate = () => {
      const logs = AutoValidator.run(MOCK_MATCHES);
      if (logs.length > 0) {
          setAutoLogs(logs);
          // Efface les logs après 10 secondes pour garder propre
          setTimeout(() => setAutoLogs([]), 10000); 
      } else {
          alert("Tous les matchs terminés ont déjà été validés !");
      }
  };

  return (
    <div className="space-y-12">
      
      {/* --- SECTION 1 : PERFORMANCE NEURONALE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-surface border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400"><BrainCircuit size={20}/></div>
                <div>
                    <h3 className="font-bold text-lg text-white">Évolution Précision IA</h3>
                    <p className="text-xs text-gray-500">Apprentissage sur les 6 derniers mois</p>
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
                        <YAxis domain={[50, 100]} stroke="#666" fontSize={12} />
                        <Tooltip contentStyle={{backgroundColor: '#1F1F1F', border: 'none'}} />
                        <Area type="monotone" dataKey="acc" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-surface border border-neutral-800 rounded-xl p-6 flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-white">Derniers Ajustements</h3>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] pr-2">
                <div className="bg-black/30 p-3 rounded border-l-2 border-green-500">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>14:00</span>
                        <span className="text-green-500 font-bold">Succès</span>
                    </div>
                    <p className="text-xs text-gray-300">Modèle Terre Battue renforcé.</p>
                </div>
            </div>
         </div>
      </div>

      {/* --- SECTION 2 : VALIDATION (AVEC LE BOUTON AUTO) --- */}
      <div>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-neutral-800 rounded-full text-neon">
                    <ListChecks size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Validation des Prédictions</h2>
                    <p className="text-sm text-gray-400">Validez les matchs terminés pour entraîner l'IA.</p>
                </div>
            </div>
            
            {/* LE BOUTON AUTO-DETECT EST ICI MAINTENANT */}
            <button 
                onClick={runAutoValidate}
                className="bg-purple-900/50 hover:bg-purple-600 text-white px-4 py-2 rounded-xl border border-purple-500/50 flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20"
            >
                <Zap size={16} className="text-yellow-300" />
                <span className="font-bold text-sm">Auto-Detect & Learn</span>
            </button>
        </div>

        {/* LOGS DE L'AUTO VALIDATION */}
        {autoLogs.length > 0 && (
            <div className="mb-6 p-4 bg-purple-900/10 border border-purple-500/30 rounded-xl animate-fade-in">
                <h4 className="text-purple-400 text-xs font-bold uppercase mb-2">Rapport d'exécution automatique</h4>
                {autoLogs.map((log, i) => (
                    <p key={i} className="text-xs text-gray-300 font-mono mb-1 border-b border-white/5 pb-1 last:border-0">
                        {log}
                    </p>
                ))}
            </div>
        )}

        {matchesToValidate.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchesToValidate.map(match => (
                <MatchCard key={match.id} match={match} />
                ))}
            </div>
        ) : (
            <div className="text-center p-8 text-gray-500 border border-dashed border-neutral-800 rounded-xl flex flex-col items-center gap-2">
                <CheckCircle size={32} className="text-green-500 opacity-50"/>
                <p>Aucun match en attente. Tout est à jour !</p>
            </div>
        )}
      </div>

      {/* --- SECTION 3 : HISTORIQUE FINANCIER --- */}
      <div className="bg-surface border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-surfaceHighlight">
          <div className="flex items-center gap-3">
             <History className="text-neon" size={20} />
             <h3 className="font-bold text-lg">Journal des Paris Réels</h3>
          </div>
          <span className="text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-neutral-700">
              {state.history.length} paris enregistrés
          </span>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/20 text-gray-200 uppercase text-xs tracking-wider">
                <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Match</th>
                <th className="p-4">Sélection</th>
                <th className="p-4 text-center">Mise</th>
                <th className="p-4 text-center">Cote</th>
                <th className="p-4 text-right">Résultat</th>
                <th className="p-4 text-right">P&L</th>
                </tr>
            </thead>
            <tbody>
                {state.history.length > 0 ? state.history.map(bet => (
                <tr key={bet.id} className="border-t border-neutral-800 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs font-mono">{bet.date.split(',')[0]}</td>
                    <td className="p-4 font-medium text-white">{bet.matchTitle}</td>
                    <td className="p-4">
                        <span className="text-neon font-bold">{bet.selection}</span>
                    </td>
                    <td className="p-4 text-center">
                        {typeof bet.stake === 'number' ? bet.stake.toFixed(2) : bet.stake} €
                    </td>
                    <td className="p-4 text-center font-bold text-white">
                        {bet.odds.toFixed(2)}
                    </td>
                    <td className={`p-4 text-right font-bold text-xs`}>
                         <span className={`px-2 py-1 rounded ${bet.status === 'WON' ? 'bg-green-900/30 text-green-400' : bet.status === 'LOST' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                            {bet.status}
                         </span>
                    </td>
                    <td className={`p-4 text-right font-bold ${bet.status === 'WON' ? 'text-green-500' : bet.status === 'LOST' ? 'text-red-500' : 'text-gray-500'}`}>
                        {bet.profit > 0 ? '+' : ''}
                        {typeof bet.profit === 'number' ? bet.profit.toFixed(2) : bet.profit} €
                    </td>
                </tr>
                )) : (
                    <tr>
                        <td colSpan={7} className="p-12 text-center text-gray-600 italic">
                            Votre historique est vide. Placez des paris depuis la page "Matchs" pour remplir ce journal.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};
