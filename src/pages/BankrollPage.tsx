import React, { useState } from 'react';
import { useBankroll } from '../context/BankrollContext';
import { useConfig } from '../context/ConfigContext'; // On récupère la config IA
import { OracleAI } from '../engine';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, PlayCircle, RefreshCcw, Settings, Save, RefreshCw, CheckCircle, Brain } from 'lucide-react';

// Mock Data pour le ROI (En attendant l'historique réel)
const roiData = [
  { day: 'Lundi', roi: 5 }, { day: 'Mardi', roi: 8 }, { day: 'Mercredi', roi: -2 },
  { day: 'Jeudi', roi: 12 }, { day: 'Vendredi', roi: 15 }, { day: 'Samedi', roi: 10 }, { day: 'Dimanche', roi: 18 }
];

export const BankrollPage: React.FC = () => {
  const { state, resetBankroll, lastLearningLog } = useBankroll();
  const { aiWeights, updateWeights, saveConfig, retrainAI } = useConfig(); // Outils Admin
  const [newBudget, setNewBudget] = useState(20);
  const [simResults, setSimResults] = useState<any>(null);
  const [trainingStatus, setTrainingStatus] = useState<{msg: string, type: 'idle'|'loading'|'success'}>({ msg: '', type: 'idle'});

  // Gestion Sliders IA
  const handleSliderChange = (key: keyof typeof aiWeights, val: string) => {
    updateWeights({ ...aiWeights, [key]: parseFloat(val) / 100 });
  };

  // Ré-entraînement manuel
  const handleRetrain = () => {
    setTrainingStatus({ msg: 'Analyse de l\'historique en cours...', type: 'loading' });
    setTimeout(() => {
        const res = retrainAI(state.history);
        setTrainingStatus({ msg: `🔥 Retraining terminé ! Gain précision: +${res.improvement}%`, type: 'success' });
    }, 1500);
  };

  const runSimulation = () => {
    const winRate = state.totalBets > 0 ? (state.wins / state.totalBets) * 100 : 60;
    const avgOdds = 1.85; 
    const results = OracleAI.bankroll.simulateFuture(state.currentBalance, winRate, avgOdds);
    setSimResults(results);
  };

  const balanceCurve = state.history.length > 0 ? state.history.map((bet, i) => ({
      name: `Bet ${i+1}`, 
      balance: state.startBalance + (typeof bet.profit === 'number' ? bet.profit : 0) // Simplifié
  })) : [{name: 'Start', balance: state.startBalance}];

  return (
    <div className="space-y-8">
      
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-neutral-800 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={48}/></div>
              <p className="text-gray-500 text-xs uppercase font-bold">Solde Actuel</p>
              <p className={`text-3xl font-mono font-bold mt-2 ${state.currentBalance >= state.startBalance ? 'text-green-500' : 'text-red-500'}`}>
                  {state.currentBalance.toFixed(2)} €
              </p>
          </div>
          <div className="bg-surface border border-neutral-800 p-6 rounded-xl">
              <p className="text-gray-500 text-xs uppercase font-bold">ROI Global</p>
              <p className={`text-3xl font-mono font-bold mt-2 ${state.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {state.roi > 0 ? '+' : ''}{state.roi}%
              </p>
          </div>
          <div className="bg-surface border border-neutral-800 p-6 rounded-xl">
              <p className="text-gray-500 text-xs uppercase font-bold">Paris Gagnés</p>
              <p className="text-3xl font-mono font-bold mt-2 text-white">
                  {state.wins} <span className="text-sm text-gray-500 font-normal">/ {state.totalBets}</span>
              </p>
          </div>
          <div className="bg-surface border border-neutral-800 p-6 rounded-xl relative">
              <button onClick={() => resetBankroll(newBudget)} className="absolute top-2 right-2 text-gray-600 hover:text-white"><RefreshCcw size={14}/></button>
              <p className="text-gray-500 text-xs uppercase font-bold">Dernier Apprentissage</p>
              <p className="text-xs text-neon mt-3 italic leading-relaxed">
                  {lastLearningLog || "En attente de validation..."}
              </p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. Graphiques Financiers */}
          <div className="lg:col-span-2 space-y-8">
             {/* Courbe Bankroll */}
             <div className="bg-surface border border-neutral-800 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Wallet size={18} className="text-neon"/> Évolution du Capital</h3>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={balanceCurve}>
                            <defs>
                                <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#FF7A00" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <Tooltip contentStyle={{backgroundColor: '#1F1F1F', border: 'none'}} />
                            <Area type="monotone" dataKey="balance" stroke="#FF7A00" fillOpacity={1} fill="url(#colorBal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
             </div>

             {/* Courbe ROI (Recupérée de l'admin) */}
             <div className="bg-surface border border-neutral-800 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-blue-500"/> Performance ROI (7 jours)</h3>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={roiData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="day" stroke="#666" fontSize={12} />
                        <Tooltip contentStyle={{backgroundColor: '#1F1F1F', border: 'none'}} />
                        <Line type="monotone" dataKey="roi" stroke="#3B82F6" strokeWidth={3} dot={{fill: '#3B82F6'}} />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* 3. Colonne de Droite : CONFIG & SIMULATION */}
          <div className="space-y-8">
              
              {/* Cerveau IA (Configuration) */}
              <div className="bg-surfaceHighlight border border-neutral-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Brain className="text-purple-500" /> Cerveau IA</h3>
                      <button onClick={saveConfig} className="text-xs text-neon hover:underline flex items-center gap-1"><Save size={12}/> Sauver</button>
                  </div>

                  <div className="space-y-5">
                    {Object.entries(aiWeights).map(([key, val]) => (
                        <div key={key}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400 capitalize">{key.replace('Weight', '').replace('Factor', '')}</span>
                                <span className="text-white font-mono">{Math.round((val as number) * 100)}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" 
                                value={Math.round((val as number) * 100)} 
                                onChange={(e) => handleSliderChange(key as any, e.target.value)}
                                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-neutral-700">
                      {trainingStatus.msg && (
                        <div className={`p-3 rounded-lg border text-xs mb-4 flex items-center gap-2 ${trainingStatus.type === 'success' ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-neutral-800 border-neutral-600 text-gray-300'}`}>
                            {trainingStatus.type === 'success' ? <CheckCircle size={14}/> : <RefreshCw size={14} className="animate-spin"/>}
                            {trainingStatus.msg}
                        </div>
                      )}
                      <button 
                        onClick={handleRetrain}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <RefreshCw size={16} /> Forcer Ré-entraînement
                      </button>
                  </div>
              </div>

              {/* Simulation Monte Carlo */}
              <div className="bg-surface border border-neutral-800 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <PlayCircle className="text-neon" /> Simulation
                  </h3>
                  <button 
                    onClick={runSimulation}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-lg mb-4 transition-colors text-sm"
                  >
                      Lancer Projection Future
                  </button>

                  {simResults && (
                      <div className="space-y-3 animate-fade-in">
                          <div className="flex justify-between text-sm border-b border-neutral-800 pb-2">
                              <span className="text-gray-500">Bankroll Finale</span>
                              <span className="font-bold text-white">{simResults.finalBankroll} €</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Risque Ruine</span>
                              <span className={`font-bold ${simResults.riskOfRuin > 5 ? 'text-red-500' : 'text-green-500'}`}>
                                  {simResults.riskOfRuin}%
                              </span>
                          </div>
                      </div>
                  )}
              </div>

          </div>
      </div>
    </div>
  );
};

// Import nécessaire pour l'icône manquante dans le code ci-dessus
import { TrendingUp } from 'lucide-react';
