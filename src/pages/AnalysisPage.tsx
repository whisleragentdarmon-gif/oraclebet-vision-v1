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
import { TrendingUp, ShieldAlert, Siren, Globe, Cpu, Wind, Activity, Zap, FileText, Search, Newspaper, Users, BarChart2, CheckCircle2, AlertTriangle, Target } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  // On filtre pour ne garder que les matchs jouables
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  // Si null => God Mode pas encore lancé
  const [godModeData, setGodModeData] = useState<any>(null);
  
  // Stockage des infos trouvées sur le web
  const [webIntel, setWebIntel] = useState<{stats: any[], market: any[], news: any[]}>({ stats: [], market: [], news: [] });

  // Auto-sélection du premier match
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
            // 3 RECHERCHES PARALLÈLES POUR NOURRIR L'IA
            const [resStats, resMarket, resNews] = await Promise.all([
                fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: `${p1} vs ${p2} tennis h2h stats points` }) }),
                fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ query: `${p1} vs ${p2} tennis betting tips prediction` }) }),
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
    let injuryDetails = "";
    webIntel.news.forEach(n => {
        if ((n.title + n.snippet).toLowerCase().match(/injury|blessure|forfait|withdraw|pain/)) {
            injuryAlert = true;
            injuryDetails = n.title;
        }
    });

    setGodModeData({ social, geo, trap, injuryAlert, injuryDetails });
    setIsComputing(false);
  };

  // --- LOGIQUE DE PRÉDICTION AVANCÉE (SIMULATION TENNIS CODE) ---
  // Dans un vrai projet, cela viendrait du moteur Python, ici on l'intègre pour l'affichage
  const getAdvancedPredictions = () => {
      if (!selectedMatch) return null;
      const conf = selectedMatch.ai?.confidence || 50;
      const p1 = selectedMatch.player1.name;
      
      return [
          { market: "Vainqueur", sel: selectedMatch.ai?.winner, odd: selectedMatch.ai?.winner === p1 ? selectedMatch.odds.p1 : selectedMatch.odds.p2, risk: "Safe" },
          { market: "Total Jeux", sel: "Over 21.5", odd: 1.85, risk: "Moderate" }, // Logique: Match serré
          { market: "Set Betting", sel: `${selectedMatch.ai?.winner} 2-0`, odd: 2.40, risk: "Risky" },
          { market: "1er Set", sel: selectedMatch.ai?.winner, odd: 1.60, risk: "Safe" }
      ];
  };

  const advancedPreds = getAdvancedPredictions();
  const attributes = selectedMatch?.ai?.attributes;
  const radarData = attributes && attributes.length >= 2 ? [
    { subject: 'Puissance', A: attributes[0].power || 50, B: attributes[1].power || 50, fullMark: 100 },
    { subject: 'Service', A: attributes[0].serve || 50, B: attributes[1].serve || 50, fullMark: 100 },
    { subject: 'Retour', A: attributes[0].return || 50, B: attributes[1].return || 50, fullMark: 100 },
    { subject: 'Mental', A: attributes[0].mental || 50, B: attributes[1].mental || 50, fullMark: 100 },
    { subject: 'Forme', A: attributes[0].form || 50, B: attributes[1].form || 50, fullMark: 100 },
  ] : [];

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={onComputationComplete} />

      <div className="flex flex-col h-full gap-6">
        
        {/* HEADER & SÉLECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-surface border border-neutral-800 rounded-xl p-4 flex flex-col h-full">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target size={18} className="text-neon"/> SÉLECTION</h3>
                <div className="overflow-y-auto pr-2 flex-1 max-h-[300px]">
                    {activeMatches.map((match) => (
                        <div key={match.id} onClick={() => { setSelectedMatch(match); setGodModeData(null); }} className={`p-3 mb-2 rounded-lg cursor-pointer border transition-all ${selectedMatch?.id === match.id ? 'bg-neon/10 border-neon' : 'bg-black/20 border-neutral-800 hover:border-gray-600'}`}>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>{match.time}</span>
                                <span>{match.tournament}</span>
                            </div>
                            <div className="font-bold text-white text-sm">{match.player1.name}</div>
                            <div className="font-bold text-white text-sm">{match.player2.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMatch ? (
                <div className="lg:col-span-2 bg-surface border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">{selectedMatch.player1.name} <span className="text-gray-600">vs</span> {selectedMatch.player2.name}</h1>
                            <p className="text-gray-400 flex items-center gap-2"><Globe size={14}/> {selectedMatch.tournament} • {selectedMatch.surface}</p>
                        </div>
                        
                        {!godModeData && (
                            <button onClick={runGodMode} className="bg-neon hover:bg-neonHover text-black font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(255,122,0,0.3)] animate-pulse flex items-center gap-2 transition-transform hover:scale-105">
                                <Cpu size={20}/> LANCER GOD MODE
                            </button>
                        )}
                        {godModeData && (
                            <div className="bg-green-900/30 text-green-400 px-4 py-2 rounded-lg border border-green-500/30 flex items-center gap-2">
                                <CheckCircle2 size={18}/> ANALYSE TERMINÉE
                            </div>
                        )}
                    </div>

                    {/* --- TABLEAU DE BORD "GOD MODE" --- */}
                    {godModeData && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                            
                            {/* 1. CONTEXTE & ALERTES */}
                            <div className="space-y-4">
                                <div className={`p-4 rounded-xl border ${godModeData.injuryAlert ? 'bg-red-900/20 border-red-500' : 'bg-green-900/20 border-green-500'}`}>
                                    <h4 className={`font-bold text-xs uppercase mb-1 flex items-center gap-2 ${godModeData.injuryAlert ? 'text-red-400' : 'text-green-400'}`}>
                                        {godModeData.injuryAlert ? <Siren size={14}/> : <ShieldAlert size={14}/>} 
                                        SCAN PHYSIQUE
                                    </h4>
                                    <p className="text-sm text-gray-200">{godModeData.injuryAlert ? "⚠️ Alerte : Mots clés 'blessure' trouvés." : "✅ R.A.S : Aucune info inquiétante."}</p>
                                    {godModeData.injuryDetails && <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{godModeData.injuryDetails}</p>}
                                </div>

                                <div className="bg-black/40 p-4 rounded-xl border border-neutral-700">
                                    <h4 className="text-gray-500 text-xs uppercase mb-3 flex items-center gap-2"><Wind size={14}/> Conditions de Jeu</h4>
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-gray-300">Vitesse Court</span>
                                        <span className="text-white font-bold">{godModeData.geo.courtSpeedIndex > 70 ? 'RAPIDE ⚡' : 'LENT 🐢'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-300">Météo</span>
                                        <span className="text-white font-bold">{godModeData.geo.wind} km/h • {godModeData.geo.altitude}m</span>
                                    </div>
                                </div>

                                <div className="bg-black/40 p-4 rounded-xl border border-neutral-700">
                                    <h4 className="text-gray-500 text-xs uppercase mb-3 flex items-center gap-2"><Users size={14}/> Psychologie</h4>
                                    <div className="text-sm text-gray-300">
                                        Pression Mentale: <span className="text-white font-bold">{godModeData.social.mentalPressure}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-purple-500" style={{width: `${godModeData.social.mentalPressure}%`}}></div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. PRÉDICTIONS MULTIPLES (LE COEUR) */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="bg-surfaceHighlight border border-neutral-700 p-5 rounded-xl">
                                    <h3 className="text-neon font-bold mb-4 flex items-center gap-2"><Zap size={18}/> STRATÉGIES RECOMMANDÉES</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        {advancedPreds?.map((pred, i) => (
                                            <div key={i} className="bg-black/40 p-3 rounded-lg border border-neutral-700 hover:border-neon/50 transition-colors">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>{pred.market}</span>
                                                    <span className={`font-bold ${pred.risk === 'Safe' ? 'text-green-500' : 'text-orange-500'}`}>{pred.risk}</span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-white font-bold text-lg">{pred.sel}</span>
                                                    <span className="text-neon font-mono font-bold">{pred.odd?.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-neutral-700">
                                        <p className="text-gray-400 text-xs italic">
                                            <span className="text-neon font-bold">Analyse :</span> {selectedMatch.ai?.qualitativeAnalysis}
                                        </p>
                                    </div>
                                </div>

                                {/* PREUVES WEB (LES SOURCES) */}
                                <div className="bg-black/20 border border-neutral-800 p-4 rounded-xl max-h-48 overflow-y-auto">
                                    <h4 className="text-blue-400 text-xs font-bold uppercase mb-3 flex items-center gap-2"><Search size={14}/> INTELLIGENCE WEB (PREUVES)</h4>
                                    
                                    {webIntel.stats.length > 0 ? (
                                        <div className="space-y-2">
                                            {webIntel.stats.map((s, i) => (
                                                <a key={i} href={s.snippet} target="_blank" className="block p-2 rounded hover:bg-white/5 transition-colors">
                                                    <p className="text-blue-300 text-xs font-bold truncate">{s.title}</p>
                                                    <p className="text-gray-500 text-[10px] line-clamp-1">{s.snippet}</p>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-xs">Recherche en cours ou aucune donnée spécifique trouvée.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                    {!godModeData && (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-500 border border-dashed border-neutral-800 rounded-xl mt-6">
                            <Activity size={48} className="mb-4 opacity-20"/>
                            <p>En attente d'activation du God Mode...</p>
                        </div>
                    )}

                </div>
            ) : (
                <div className="lg:col-span-2 flex items-center justify-center h-full text-gray-500">
                    Sélectionnez un match dans la liste.
                </div>
            )}
        </div>
      </div>
    </>
  );
};
