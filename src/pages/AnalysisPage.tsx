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
import { TrendingUp, ShieldAlert, Siren, Globe, Cpu, Wind, Activity, Zap, FileText, Search, Newspaper, Users, BarChart2, Lock } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  // On filtre les matchs finis
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  // Si null => God Mode pas encore lancé
  const [godModeData, setGodModeData] = useState<any>(null);
  const [webIntel, setWebIntel] = useState<{stats: any[], market: any[], news: any[]}>({ stats: [], market: [], news: [] });

  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  const runGodMode = async () => {
    setIsComputing(true);
    setWebIntel({ stats: [], market: [], news: [] });

    if (selectedMatch) {
        const p1 = selectedMatch.player1.name;
        const p2 = selectedMatch.player2.name;
        try {
            const [resStats, resMarket, resNews] = await Promise.all([
                fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: `${p1} vs ${p2} h2h stats tennis` }) }),
                fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: `${p1} vs ${p2} prediction odds` }) }),
                fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: `${p1} ${p2} tennis injury news` }) })
            ]);
            setWebIntel({
                stats: (await resStats.json()).results || [],
                market: (await resMarket.json()).results || [],
                news: (await resNews.json()).results || []
            });
        } catch (e) { console.error(e); }
    }
  };

  const onComputationComplete = () => {
    if (!selectedMatch) return;
    const social = ScandalEngine.analyze(selectedMatch.player1.name);
    const geo = GeoEngine.getConditions(selectedMatch.tournament);
    const trap = TrapDetector.scan(selectedMatch.odds);
    
    // Détection blessure dans les news
    let injuryAlert = false;
    webIntel.news.forEach(n => {
        if ((n.title + n.snippet).toLowerCase().match(/injury|blessure|forfait|withdraw/)) injuryAlert = true;
    });

    setGodModeData({ social, geo, trap, injuryAlert });
    setIsComputing(false);
  };

  const winProbData = selectedMatch?.ai ? [
    { name: selectedMatch.player1.name, prob: selectedMatch.ai.winProbA || 50, fill: '#6B7280' },
    { name: selectedMatch.player2.name, prob: selectedMatch.ai.winProbB || 50, fill: '#FF7A00' }
  ] : [];

  const getCircuitColor = (c: string) => {
    if (c.includes('WTA')) return 'text-pink-500';
    if (c.includes('CHALLENGER')) return 'text-yellow-500';
    return 'text-blue-500';
  };

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={onComputationComplete} />

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="lg:w-1/3 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2">Sélectionner un Match</h2>
          <div className="overflow-y-auto pr-2 space-y-3 max-h-[80vh]">
            {activeMatches.map((match) => (
              <MatchCard key={match.id} match={match} selected={selectedMatch?.id === match.id} onClick={() => { setSelectedMatch(match); setGodModeData(null); }} compact />
            ))}
            {activeMatches.length === 0 && <p className="text-gray-500">Aucun match à venir.</p>}
          </div>
        </div>

        <div className="lg:w-2/3">
          {selectedMatch && selectedMatch.ai ? (
            <div className="bg-surface border border-neutral-800 rounded-2xl p-6 h-full shadow-2xl animate-fade-in overflow-y-auto">
              
              <div className="flex justify-between items-start mb-6 border-b border-neutral-800 pb-4">
                 <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      {selectedMatch.player1.name} <span className="text-neon">vs</span> {selectedMatch.player2.name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">{selectedMatch.tournament} • {selectedMatch.surface}</p>
                 </div>
                 {!godModeData && (
                   <button onClick={runGodMode} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 animate-pulse">
                      <Cpu size={20} /> LANCER GOD MODE
                   </button>
                 )}
              </div>

              {/* ZONE PRÉDICTION : FLOUTÉE TANT QUE GOD MODE OFF */}
              <div className="relative">
                  {!godModeData && (
                      <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center rounded-xl border border-neutral-800">
                          <Lock size={48} className="text-gray-500 mb-4" />
                          <p className="text-white font-bold text-lg">Analyse Verrouillée</p>
                          <p className="text-gray-400 text-sm">Lancez le God Mode pour débloquer la prédiction.</p>
                      </div>
                  )}

                  {/* Le contenu (flouté ou non) */}
                  <div className={!godModeData ? 'opacity-20 pointer-events-none filter blur-sm' : ''}>
                      
                      {/* Résultat God Mode */}
                      {godModeData && (
                        <div className="mb-6 grid grid-cols-3 gap-4">
                            <div className="bg-black/40 p-3 rounded border border-purple-500/20 text-center">
                                <Wind className="mx-auto text-blue-400 mb-1" size={16}/>
                                <p className="text-xs text-gray-300">{godModeData.geo.wind} km/h</p>
                            </div>
                            <div className="bg-black/40 p-3 rounded border border-purple-500/20 text-center">
                                <Activity className="mx-auto text-green-400 mb-1" size={16}/>
                                <p className="text-xs text-gray-300">{godModeData.social.socialTrend}</p>
                            </div>
                            <div className="bg-black/40 p-3 rounded border border-purple-500/20 text-center">
                                <ShieldAlert className="mx-auto text-orange-400 mb-1" size={16}/>
                                <p className="text-xs text-gray-300">{godModeData.trap.isTrap ? 'Danger' : 'Safe'}</p>
                            </div>
                        </div>
                      )}

                      <div className="bg-surfaceHighlight p-5 rounded-xl border border-neutral-800 mb-6">
                        <p className="text-gray-400 text-xs uppercase mb-2">Verdict Oracle</p>
                        <p className="text-3xl font-bold text-white mb-2">{selectedMatch.ai.recommendedBet}</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-neon" style={{width: `${selectedMatch.ai.confidence}%`}}></div>
                            </div>
                            <span className="text-sm font-bold text-neon">{selectedMatch.ai.confidence}%</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surfaceHighlight p-4 rounded-xl border border-neutral-800">
                            <h4 className="text-gray-400 text-xs uppercase mb-4 text-center">Probabilité</h4>
                            <div className="h-[150px]">
                                <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={winProbData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{fill: '#9CA3AF', fontSize: 10}} />
                                    <Bar dataKey="prob" radius={[0, 4, 4, 0]} barSize={20}>
                                        {winProbData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Bar>
                                </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {selectedMatch.ai.oddsAnalysis && (
                            <OddsComparator 
                                analysis={selectedMatch.ai.oddsAnalysis} 
                                fairOdds={selectedMatch.ai.fairOdds}
                                player1={selectedMatch.player1.name}
                                player2={selectedMatch.player2.name}
                            />
                        )}
                     </div>
                  </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 border border-dashed border-neutral-800 rounded-xl m-4">
                Sélectionnez un match.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
