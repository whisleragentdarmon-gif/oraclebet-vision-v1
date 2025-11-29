import React, { useState } from 'react';
import { MOCK_MATCHES } from '../constants';
import { MatchCard } from '../components/MatchCard';
import { OddsComparator } from '../components/OddsComparator';
import { Match } from '../types';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { TrendingUp, ShieldAlert, Siren, Globe, Cpu, AlignLeft, Calculator, Lightbulb, Activity, Target } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(MOCK_MATCHES[0]);

  // SÉCURITÉ 1 : Données pour le graphique de Victoire
  const winProbData = selectedMatch?.ai ? [
    { name: selectedMatch.player1.name, prob: selectedMatch.ai.winProbA || 50, fill: '#6B7280' },
    { name: selectedMatch.player2.name, prob: selectedMatch.ai.winProbB || 50, fill: '#FF7A00' }
  ] : [];

  // SÉCURITÉ 2 : Données pour le Radar (Attributs)
  // On vérifie que 'attributes' existe ET qu'il a bien 2 éléments
  const attributes = selectedMatch?.ai?.attributes;
  const radarData = attributes && attributes.length >= 2 ? [
    { subject: 'Puissance', A: attributes[0].power || 0, B: attributes[1].power || 0, fullMark: 100 },
    { subject: 'Service', A: attributes[0].serve || 0, B: attributes[1].serve || 0, fullMark: 100 },
    { subject: 'Retour', A: attributes[0].return || 0, B: attributes[1].return || 0, fullMark: 100 },
    { subject: 'Mental', A: attributes[0].mental || 0, B: attributes[1].mental || 0, fullMark: 100 },
    { subject: 'Forme', A: attributes[0].form || 0, B: attributes[1].form || 0, fullMark: 100 },
  ] : [];

  // SÉCURITÉ 3 : Données Monte Carlo
  const monteCarlo = selectedMatch?.ai?.monteCarlo;
  const setDistData = monteCarlo ? Object.entries(monteCarlo.setDistribution).map(([score, prob]) => ({
      name: score, value: parseFloat((prob * 100).toFixed(1))
  })) : [];

  const getCircuitColor = (c: string) => {
    switch(c) {
        case 'WTA': return 'text-pink-500';
        case 'CHALLENGER': return 'text-yellow-500';
        case 'ITF': return 'text-purple-500';
        default: return 'text-blue-500';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Colonne de Gauche : Liste des Matchs */}
      <div className="lg:w-1/3 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2">Sélectionner un Match</h2>
        <div className="overflow-y-auto pr-2 space-y-3 max-h-[80vh]">
          {MOCK_MATCHES.map((match) => (
            <MatchCard 
              key={match.id} 
              match={match} 
              selected={selectedMatch?.id === match.id}
              onClick={() => setSelectedMatch(match)}
              compact
            />
          ))}
        </div>
      </div>

      {/* Colonne de Droite : Détails de l'Analyse */}
      <div className="lg:w-2/3">
        {selectedMatch && selectedMatch.ai ? (
          <div className="bg-surface border border-neutral-800 rounded-2xl p-6 h-full shadow-2xl animate-fade-in overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b border-neutral-800 pb-6">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                      <Globe size={14} className={getCircuitColor(selectedMatch.ai.circuit)} />
                      <span className={`text-xs font-bold ${getCircuitColor(selectedMatch.ai.circuit)}`}>{selectedMatch.ai.circuit} CIRCUIT</span>
                      <span className="text-gray-400 text-xs uppercase tracking-widest">| {selectedMatch.tournament}</span>
                  </div>
                  
                  <div className="text-3xl font-bold flex items-center gap-3">
                    <span className="text-white">{selectedMatch.player1.name}</span>
                    <span className="text-neon text-xl">vs</span>
                    <span className="text-white">{selectedMatch.player2.name}</span>
                  </div>
               </div>
            </div>

            {/* Bannière de Recommandation IA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               <div className="md:col-span-2 bg-gradient-to-r from-neutral-900 to-carbon border border-neon/30 p-4 rounded-xl flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10"><TrendingUp size={100} /></div>
                  <div className="w-12 h-12 bg-neon rounded-full flex items-center justify-center shrink-0 z-10">
                      <TrendingUp className="text-white" />
                  </div>
                  <div className="z-10">
                    <p className="text-gray-400 text-xs uppercase">Pari Optimal ({selectedMatch.ai.marketType})</p>
                    <p className="text-white text-xl font-bold">{selectedMatch.ai.recommendedBet}</p>
                    <p className="text-neon text-sm">{selectedMatch.ai.confidence}% de confiance</p>
                  </div>
               </div>

               {/* Score de Suspicion / Piège */}
               <div className="space-y-2">
                 {selectedMatch.ai.integrity && (
                   <div className={`p-3 rounded-lg border flex items-center gap-2 text-xs ${selectedMatch.ai.integrity.score > 50 ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-surfaceHighlight border-neutral-700 text-gray-400'}`}>
                        <Siren size={16} />
                        <div className="flex-1">
                          <div className="flex justify-between">
                              <p className="font-bold">Score Suspicion</p>
                              <p className="font-mono">{selectedMatch.ai.integrity.score}%</p>
                          </div>
                          <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1">
                              <div className="bg-red-500 h-full rounded-full" style={{width: `${selectedMatch.ai.integrity.score}%`}}></div>
                          </div>
                        </div>
                   </div>
                 )}

                 {selectedMatch.ai.trap && (
                   <div className={`p-3 rounded-lg border flex items-center gap-2 text-xs ${selectedMatch.ai.trap.isTrap ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-green-900/20 border-green-500 text-green-400'}`}>
                      <ShieldAlert size={16} />
                      <div>
                        <p className="font-bold">Scanner Bookmaker</p>
                        <p>{selectedMatch.ai.trap.verdict || (selectedMatch.ai.trap.isTrap ? 'Piège détecté' : 'Safe')}</p>
                      </div>
                   </div>
                 )}
               </div>
            </div>

            {/* Fair Odds vs Marché */}
            {selectedMatch.ai.fairOdds && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/30 rounded-xl p-4 border border-neutral-800">
                      <div className="flex items-center gap-2 mb-3">
                          <Target className="text-neon" size={18} />
                          <h3 className="font-bold text-white text-sm uppercase">Cote Réelle IA (Fair Odds)</h3>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-2">
                          <span>{selectedMatch.player1.name}</span>
                          <span className="font-mono font-bold text-neon">{selectedMatch.ai.fairOdds.p1.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span>{selectedMatch.player2.name}</span>
                          <span className="font-mono font-bold text-neon">{selectedMatch.ai.fairOdds.p2.toFixed(2)}</span>
                      </div>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 border border-neutral-800">
                      <div className="flex items-center gap-2 mb-3">
                          <Activity className="text-blue-500" size={18} />
                          <h3 className="font-bold text-white text-sm uppercase">Marché (Bookmakers)</h3>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-2">
                          <span>{selectedMatch.player1.name}</span>
                          <div className="flex gap-2">
                              <span className="font-mono text-gray-300">{selectedMatch.odds.p1.toFixed(2)}</span>
                              {selectedMatch.odds.p1 > selectedMatch.ai.fairOdds.p1 && (
                                  <span className="text-[10px] bg-green-500/20 text-green-500 px-1 rounded border border-green-500/50">VALUE</span>
                              )}
                          </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span>{selectedMatch.player2.name}</span>
                          <div className="flex gap-2">
                              <span className="font-mono text-gray-300">{selectedMatch.odds.p2.toFixed(2)}</span>
                              {selectedMatch.odds.p2 > selectedMatch.ai.fairOdds.p2 && (
                                  <span className="text-[10px] bg-green-500/20 text-green-500 px-1 rounded border border-green-500/50">VALUE</span>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
            )}
            
            {/* Comparateur de Cotes */}
            {selectedMatch.ai.oddsAnalysis && selectedMatch.ai.fairOdds && (
                <div className="mb-8">
                    <OddsComparator 
                        analysis={selectedMatch.ai.oddsAnalysis} 
                        fairOdds={selectedMatch.ai.fairOdds}
                        player1={selectedMatch.player1.name}
                        player2={selectedMatch.player2.name}
                    />
                </div>
            )}

            {/* Module Monte Carlo */}
            <div className="bg-surfaceHighlight rounded-xl p-5 border border-neutral-700 mb-8 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-neutral-700 opacity-20"><Cpu size={120} /></div>
                <div className="flex items-center gap-2 mb-4">
                    <Cpu className="text-neon" size={20} />
                    <h3 className="font-bold text-white">Simulation Monte Carlo (10,000 runs)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div>
                        <p className="text-gray-400 text-xs uppercase mb-1">Scénario le plus probable</p>
                        <p className="text-2xl font-bold text-white">{selectedMatch.ai.expectedSets || "N/A"}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Proba Tie-Break: <span className="text-white">{selectedMatch.ai.tieBreakProbability || 0}%</span>
                        </p>
                    </div>
                    {selectedMatch.ai.breaks && (
                      <div>
                          <p className="text-gray-400 text-xs uppercase mb-1">Breaks Attendus / Match</p>
                          <div className="flex justify-between text-sm mt-2">
                              <span>{selectedMatch.player1.name}</span>
                              <span className="font-mono font-bold text-neon">{selectedMatch.ai.breaks.p1}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                              <span>{selectedMatch.player2.name}</span>
                              <span className="font-mono font-bold text-neon">{selectedMatch.ai.breaks.p2}</span>
                          </div>
                      </div>
                    )}
                    <div>
                        <p className="text-gray-400 text-xs uppercase mb-2">Distribution des Scores</p>
                        <div className="h-16 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={setDistData}>
                                    <Bar dataKey="value" fill="#333" radius={[2,2,0,0]}>
                                        {setDistData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === selectedMatch.ai!.expectedSets ? '#FF7A00' : '#444'} />
                                        ))}
                                    </Bar>
                                    <Tooltip cursor={false} contentStyle={{backgroundColor: '#111', border: 'none', fontSize: '10px'}} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analyses Textuelles */}
            <div className="grid grid-cols-1 gap-4 mb-8">
               <div className="bg-black/20 p-4 rounded-lg border-l-4 border-neon">
                  <div className="flex items-center gap-2 mb-2">
                      <Lightbulb size={16} className="text-neon"/>
                      <h4 className="font-bold text-white text-sm">Analyse Qualitative & Verdict</h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {selectedMatch.ai.qualitativeAnalysis || "Analyse en cours..."}
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-surfaceHighlight p-4 rounded-lg border border-neutral-800">
                        <div className="flex items-center gap-2 mb-2">
                            <AlignLeft size={16} className="text-blue-500"/>
                            <h4 className="font-bold text-white text-sm">Analyse Structurelle</h4>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-line">
                            {selectedMatch.ai.structuralAnalysis || "Pas de données structurelles."}
                        </p>
                   </div>
                   
                   <div className="bg-surfaceHighlight p-4 rounded-lg border border-neutral-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Calculator size={16} className="text-green-500"/>
                            <h4 className="font-bold text-white text-sm">Données Quantitative</h4>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-line">
                            {selectedMatch.ai.quantitativeAnalysis || "Calculs en cours..."}
                        </p>
                   </div>
               </div>
            </div>

            {/* Graphiques Finaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-surfaceHighlight rounded-xl p-4 border border-neutral-800">
                 <h4 className="text-gray-400 text-xs uppercase mb-4 text-center">Probabilité de Victoire</h4>
                 <div className="h-[200px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={winProbData} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <Tooltip contentStyle={{backgroundColor: '#1F1F1F', border: '1px solid #333', color: '#fff'}} />
                        <Bar dataKey="prob" radius={[0, 4, 4, 0]} barSize={20}>
                          {winProbData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                        </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               <div className="bg-surfaceHighlight rounded-xl p-4 border border-neutral-800">
                  <h4 className="text-gray-400 text-xs uppercase mb-2 text-center">
