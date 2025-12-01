import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { OracleReactor } from '../components/OracleReactor';
import { OddsComparator } from '../components/OddsComparator';
import { ScandalEngine } from '../engine/market/ScandalEngine';
import { GeoEngine } from '../engine/market/GeoEngine';
import { TrapDetector } from '../engine/market/TrapDetector';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend 
} from 'recharts';
import { TrendingUp, ShieldAlert, Siren, Globe, Cpu, Wind, Thermometer, Activity, Target, Zap, FileText } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  
  // 👇 ICI : On crée la liste filtrée (Uniquement les matchs À VENIR ou LIVE)
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [godModeData, setGodModeData] = useState<any>(null);

  // Au chargement, on sélectionne le premier match de la liste FILTRÉE
  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) {
        setSelectedMatch(activeMatches[0]);
    }
  }, [matches]);

  const runGodMode = () => {
    setIsComputing(true);
  };

  const onComputationComplete = () => {
    if (!selectedMatch) return;
    const social = ScandalEngine.analyze(selectedMatch.player1.name);
    const geo = GeoEngine.getConditions(selectedMatch.tournament);
    const trap = TrapDetector.scan(selectedMatch.odds);
    
    setGodModeData({ social, geo, trap });
    setIsComputing(false);
  };

  // Préparation des graphiques (Sécurisée)
  const winProbData = selectedMatch?.ai ? [
    { name: selectedMatch.player1.name, prob: selectedMatch.ai.winProbA || 50, fill: '#6B7280' },
    { name: selectedMatch.player2.name, prob: selectedMatch.ai.winProbB || 50, fill: '#FF7A00' }
  ] : [];

  const attributes = selectedMatch?.ai?.attributes;
  const radarData = attributes && attributes.length >= 2 ? [
    { subject: 'Puissance', A: attributes[0].power || 0, B: attributes[1].power || 0, fullMark: 100 },
    { subject: 'Service', A: attributes[0].serve || 0, B: attributes[1].serve || 0, fullMark: 100 },
    { subject: 'Retour', A: attributes[0].return || 0, B: attributes[1].return || 0, fullMark: 100 },
    { subject: 'Mental', A: attributes[0].mental || 0, B: attributes[1].mental || 0, fullMark: 100 },
    { subject: 'Forme', A: attributes[0].form || 0, B: attributes[1].form || 0, fullMark: 100 },
  ] : [];

  const getCircuitColor = (c: string) => {
    if (c.includes('WTA')) return 'text-pink-500';
    if (c.includes('CHALLENGER')) return 'text-yellow-500';
    if (c.includes('ITF')) return 'text-purple-500';
    return 'text-blue-500';
  };

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={onComputationComplete} />

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Colonne Gauche : Liste des Matchs */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2">Sélectionner un Match</h2>
          <div className="overflow-y-auto pr-2 space-y-3 max-h-[80vh]">
            
            {/* 👇 ICI : On utilise activeMatches pour l'affichage (le JSX) */}
            {activeMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                selected={selectedMatch?.id === match.id} 
                onClick={() => { setSelectedMatch(match); setGodModeData(null); }} 
                compact 
              />
            ))}
            
            {activeMatches.length === 0 && (
                <p className="text-gray-500 text-sm border border-dashed border-neutral-800 p-4 rounded text-center">
                    Aucun match à venir disponible pour l'analyse.
                </p>
            )}
          </div>
        </div>

        {/* Colonne Droite : Détail (Reste inchangé) */}
        <div className="lg:w-2/3">
          {selectedMatch && selectedMatch.ai ? (
            <div className="bg-surface border border-neutral-800 rounded-2xl p-6 h-full shadow-2xl animate-fade-in overflow-y-auto">
              
              <div className="flex justify-between items-start mb-6 border-b border-neutral-800 pb-4">
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Globe size={14} className={getCircuitColor(selectedMatch.ai.circuit)} />
                        <span className={`text-xs font-bold ${getCircuitColor(selectedMatch.ai.circuit)}`}>{selectedMatch.ai.circuit}</span>
                        <span className="text-gray-400 text-xs">| {selectedMatch.tournament}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      {selectedMatch.player1.name} <span className="text-neon">vs</span> {selectedMatch.player2.name}
                    </h2>
                 </div>
                 {!godModeData && (
                   <button onClick={runGodMode} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105">
                      <Cpu size={20} className="animate-pulse" /> LANCER GOD MODE
                   </button>
                 )}
              </div>

              {/* RÉSULTAT GOD MODE */}
              {godModeData && (
                <div className="mb-8 animate-fade-in space-y-4">
                    <div className="bg-purple-900/10 border border-purple-500/30 p-4 rounded-xl">
                        <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><Activity /> DEEP DATA MARKET ANALYSIS</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-black/40 p-3 rounded border border-purple-500/20">
                                <p className="text-gray-500 text-xs uppercase mb-1">Conditions</p>
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <Wind size={16} className="text-blue-400"/> {godModeData.geo.wind} km/h
                                </div>
                                <div className="flex items-center gap-2 text-white font-bold mt-1">
                                    <Globe size={16} className="text-green-400"/> {godModeData.geo.altitude}m Alt.
                                </div>
                            </div>
                            <div className="bg-black/40 p-3 rounded border border-purple-500/20">
                                <p className="text-gray-500 text-xs uppercase mb-1">Social & Mental</p>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-300">Pression</span>
                                    <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{width: `${godModeData.social.mentalPressure}%`}}></div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-300">Trend: <span className="text-neon">{godModeData.social.socialTrend}</span></p>
                            </div>
                            <div className="bg-black/40 p-3 rounded border border-purple-500/20">
                                <p className="text-gray-500 text-xs uppercase mb-1">Trap Detector</p>
                                {godModeData.trap.isTrap ? (
                                    <div className="text-red-500 font-bold flex items-center gap-2"><Siren size={16}/> PIÈGE DÉTECTÉ</div>
                                ) : (
                                    <div className="text-green-500 font-bold flex items-center gap-2"><ShieldAlert size={16}/> Cotes Saines</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {/* Analyse Standard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div className="bg-surfaceHighlight p-5 rounded-xl border border-neutral-800">
                    <p className="text-gray-400 text-xs uppercase mb-2">Prédiction Standard</p>
                    <p className="text-2xl font-bold text-white mb-2">{selectedMatch.ai.recommendedBet}</p>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-neon" style={{width: `${selectedMatch.ai.confidence}%`}}></div>
                        </div>
                        <span className="text-sm font-bold text-neon">{selectedMatch.ai.confidence}%</span>
                    </div>
                 </div>
                 <div className="bg-surfaceHighlight p-5 rounded-xl border border-neutral-800">
                    <p className="text-gray-400 text-xs uppercase mb-2 flex items-center gap-2"><FileText size={14}/> Analyse Qualitative</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedMatch.ai.qualitativeAnalysis}</p>
                 </div>
              </div>

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
                    <h4 className="text-gray-400 text-xs uppercase mb-2 text-center">Comparatif Attributs</h4>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#333" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name={selectedMatch.player1.name} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                          <Radar name={selectedMatch.player2.name} dataKey="B" stroke="#FF7A00" fill="#FF7A00" fillOpacity={0.5} />
                          <Legend iconSize={8} wrapperStyle={{fontSize: '10px'}} />
                          <Tooltip contentStyle={{backgroundColor: '#1F1F1F', border: '1px solid #333', color: '#fff'}} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 border border-dashed border-neutral-800 rounded-xl m-4">
                Sélectionnez un match à venir pour lancer l'analyse.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
