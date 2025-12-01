import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { OracleReactor } from '../components/OracleReactor';
import { OddsComparator } from '../components/OddsComparator';
import { GeoEngine } from '../engine/market/GeoEngine';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend 
} from 'recharts';
import { TrendingUp, ShieldAlert, Siren, Globe, Cpu, Wind, Activity, Zap, FileText, Search, Newspaper, Users, BarChart2 } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [godModeData, setGodModeData] = useState<any>(null);
  
  // Intelligence Web classée par catégorie
  const [webIntel, setWebIntel] = useState<{
    stats: {title: string, snippet: string}[],
    market: {title: string, snippet: string}[],
    news: {title: string, snippet: string}[]
  }>({ stats: [], market: [], news: [] });

  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  const runGodMode = async () => {
    setIsComputing(true);
    setWebIntel({ stats: [], market: [], news: [] }); // Reset

    if (selectedMatch) {
        const p1 = selectedMatch.player1.name;
        const p2 = selectedMatch.player2.name;

        // 🚀 STRATÉGIE MULTI-AGENTS : 3 RECHERCHES PARALLÈLES
        try {
            // Agent 1 : Stats & H2H (Cible les sites de stats)
            const qStats = `${p1} vs ${p2} h2h stats tennisexplorer flashscore head to head`;
            
            // Agent 2 : Marché & Cotes (Cible les forums et comparateurs)
            const qMarket = `${p1} vs ${p2} betting odds prediction forum discussion tipsters`;
            
            // Agent 3 : News & Physique (Cible les blessures)
            const qNews = `${p1} ${p2} tennis injury news interview fitness update`;

            // On lance tout en même temps
            const [resStats, resMarket, resNews] = await Promise.all([
                fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: qStats }) }),
                fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: qMarket }) }),
                fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: qNews }) })
            ]);

            const dataStats = await resStats.json();
            const dataMarket = await resMarket.json();
            const dataNews = await resNews.json();

            setWebIntel({
                stats: dataStats.results || [],
                market: dataMarket.results || [],
                news: dataNews.results || []
            });

        } catch (e) {
            console.error("Erreur Web Search Agents", e);
        }
    }
  };

  const onComputationComplete = () => {
    if (!selectedMatch) return;
    
    // Analyse des mots clés pour les alertes
    let injuryAlert = false;
    webIntel.news.forEach(n => {
        const t = (n.title + " " + n.snippet).toLowerCase();
        if (t.includes('injury') || t.includes('withdraw') || t.includes('blessure') || t.includes('abandon')) injuryAlert = true;
    });

    const geo = GeoEngine.getConditions(selectedMatch.tournament);
    
    setGodModeData({ geo, injuryAlert });
    setIsComputing(false);
  };

  // --- Graphiques et Utils ---
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
        {/* Colonne Gauche */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2">Sélectionner un Match</h2>
          <div className="overflow-y-auto pr-2 space-y-3 max-h-[80vh]">
            {activeMatches.map((match) => (
              <MatchCard key={match.id} match={match} selected={selectedMatch?.id === match.id} onClick={() => { setSelectedMatch(match); setGodModeData(null); }} compact />
            ))}
            {activeMatches.length === 0 && <p className="text-gray-500 text-sm p-4 border border-dashed border-neutral-800 rounded">Aucun match disponible.</p>}
          </div>
        </div>

        {/* Colonne Droite */}
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
                      <Search size={20} className="animate-pulse" /> LANCER GOD MODE ULTIME
                   </button>
                 )}
              </div>

              {/* --- RÉSULTAT GOD MODE ULTIME --- */}
              {godModeData && (
                <div className="mb-8 animate-fade-in space-y-4">
                    
                    {/* ALERTE BLESSURE */}
                    {godModeData.injuryAlert ? (
                        <div className="bg-red-900/40 border border-red-500 p-4 rounded-xl flex items-center gap-4 animate-pulse">
                            <Siren size={32} className="text-red-500"/>
                            <div>
                                <h3 className="text-red-400 font-bold uppercase">Alerte Physique / News</h3>
                                <p className="text-white text-sm">Le scan Web a détecté des mentions de blessure ou forfait récent.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-xl flex items-center gap-3">
                            <ShieldAlert size={20} className="text-green-500"/>
                            <p className="text-green-400 text-sm font-bold">R.A.S : Aucune info inquiétante détectée (Blessure/Forfait).</p>
                        </div>
                    )}

                    {/* MÉTÉO */}
                    <div className="bg-black/40 border border-neutral-800 p-3 rounded-xl flex gap-6 items-center">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm"><Wind size={16}/> {godModeData.geo.wind} km/h (Vent)</div>
                        <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm"><Globe size={16}/> {godModeData.geo.altitude}m (Altitude)</div>
                    </div>

                    {/* GRILLE INTELLIGENCE WEB (3 COLONNES) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* 1. STATS & H2H */}
                        <div className="bg-surfaceHighlight p-3 rounded-xl border border-neutral-700">
                            <h4 className="text-blue-400 text-xs font-bold uppercase mb-2 flex items-center gap-2"><BarChart2 size={12}/> Stats & H2H Web</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {webIntel.stats.length > 0 ? webIntel.stats.map((item, i) => (
                                    <a key={i} href={item.snippet} target="_blank" className="block text-[10px] text-gray-300 hover:text-white border-b border-white/5 pb-1 last:border-0">
                                        <span className="font-bold text-blue-300 block truncate">{item.title}</span>
                                        <span className="opacity-70 line-clamp-2">{item.snippet}</span>
                                    </a>
                                )) : <p className="text-[10px] text-gray-500">Rien trouvé.</p>}
                            </div>
                        </div>

                        {/* 2. MARCHÉ & COTES */}
                        <div className="bg-surfaceHighlight p-3 rounded-xl border border-neutral-700">
                            <h4 className="text-green-400 text-xs font-bold uppercase mb-2 flex items-center gap-2"><Users size={12}/> Avis Marché & Cotes</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {webIntel.market.length > 0 ? webIntel.market.map((item, i) => (
                                    <div key={i} className="text-[10px] text-gray-300 border-b border-white/5 pb-1 last:border-0">
                                        <span className="font-bold text-green-300 block truncate">{item.title}</span>
                                        <span className="opacity-70 line-clamp-2">{item.snippet}</span>
                                    </div>
                                )) : <p className="text-[10px] text-gray-500">Rien trouvé.</p>}
                            </div>
                        </div>

                        {/* 3. NEWS & RUMEURS */}
                        <div className="bg-surfaceHighlight p-3 rounded-xl border border-neutral-700">
                            <h4 className="text-orange-400 text-xs font-bold uppercase mb-2 flex items-center gap-2"><Newspaper size={12}/> News & Rumeurs</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {webIntel.news.length > 0 ? webIntel.news.map((item, i) => (
                                    <div key={i} className="text-[10px] text-gray-300 border-b border-white/5 pb-1 last:border-0">
                                        <span className="font-bold text-orange-300 block truncate">{item.title}</span>
                                        <span className="opacity-70 line-clamp-2">{item.snippet}</span>
                                    </div>
                                )) : <p className="text-[10px] text-gray-500">Rien trouvé.</p>}
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
                Sélectionnez un match pour voir l'analyse.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
