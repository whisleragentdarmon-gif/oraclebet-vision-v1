import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { OracleReactor } from '../components/OracleReactor';
import { OddsComparator } from '../components/OddsComparator';

// IMPORTS DES MOTEURS
import { ScandalEngine } from '../engine/market/ScandalEngine';
import { GeoEngine } from '../engine/market/GeoEngine';
import { TrapDetector } from '../engine/market/TrapDetector';
import { H2HEngine } from '../engine/market/H2HEngine'; // ✅ NOUVEAU

// IMPORTS DES COMPOSANTS VISUELS
import { DetailedH2H } from '../components/DetailedH2H'; // ✅ NOUVEAU
import { 
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend 
} from 'recharts';
import { TrendingUp, ShieldAlert, Siren, Globe, Cpu, Wind, Activity, Zap, FileText, Search, ExternalLink, Calendar, Lock, CheckCircle2 } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { matches } = useData();
  const { saveAnalysis, getAnalysis } = useAnalysis();
  
  const activeMatches = matches.filter(m => m.status !== 'FINISHED');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  
  // Données débloquées (contient tout : H2H, Météo, Alertes...)
  const [currentData, setCurrentData] = useState<any>(null);

  // Auto-sélection du premier match
  useEffect(() => {
    if (activeMatches.length > 0 && !selectedMatch) setSelectedMatch(activeMatches[0]);
  }, [matches]);

  // Chargement de la mémoire si on revient sur un match déjà analysé
  useEffect(() => {
    if (selectedMatch) {
        const saved = getAnalysis(selectedMatch.id);
        setCurrentData(saved || null);
    }
  }, [selectedMatch]);

  // --- FONCTION PRINCIPALE : LE GOD MODE ---
  const runGodMode = async () => {
    setIsComputing(true);
    if (selectedMatch) {
        const p1 = selectedMatch.player1.name;
        const p2 = selectedMatch.player2.name;
        
        try {
            // 1. APPEL AU NOUVEAU MOTEUR H2H (Il fait les recherches Google pour nous)
            const h2hProfile = await H2HEngine.fetchFullProfile(p1, p2, selectedMatch.tournament);

            // 2. APPEL AUX MOTEURS EXISTANTS (Interne)
            const social = ScandalEngine.analyze(p1);
            const geo = GeoEngine.getConditions(selectedMatch.tournament);
            const trap = TrapDetector.scan(selectedMatch.odds);
            
            // 3. RECHERCHE SPÉCIFIQUE BLESSURE (Sécurité supplémentaire)
            let injuryAlert = false;
            let injuryDetails = "";
            try {
                const resNews = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: `${p1} ${p2} tennis injury news` })
                });
                const webNews = (await resNews.json()).results || [];
                
                webNews.forEach((n: any) => {
                    if ((n.title + n.snippet).toLowerCase().match(/injury|blessure|forfait|withdraw/)) {
                        injuryAlert = true;
                        injuryDetails = n.title;
                    }
                });
            } catch (err) { console.error("Erreur News", err); }

            // 4. ON RASSEMBLE TOUT
            const newData = { 
                social, 
                geo, 
                trap, 
                injuryAlert, 
                injuryDetails,
                h2hProfile // ✅ On ajoute le profil complet
            };
            
            // 5. SAUVEGARDE
            saveAnalysis(selectedMatch.id, newData);
            setCurrentData(newData);

        } catch (e) { console.error(e); }
    }
    setIsComputing(false);
  };

  // Préparation graphiques (inchangée)
  const winProbData = selectedMatch?.ai ? [
    { name: selectedMatch.player1.name, prob: selectedMatch.ai.winProbA || 50, fill: '#6B7280' },
    { name: selectedMatch.player2.name, prob: selectedMatch.ai.winProbB || 50, fill: '#FF7A00' }
  ] : [];

  const attributes = selectedMatch?.ai?.attributes;
  const radarData = attributes && attributes.length >= 2 ? [
    { subject: 'Puissance', A: attributes[0].power || 0, B: attributes[1].power || 0, fullMark: 100 },
    { subject: 'Service', A: attributes[0].serve || 0, B: attributes[1].serve || 0, fullMark: 100 },
    { subject: 'Mental', A: attributes[0].mental || 0, B: attributes[1].mental || 0, fullMark: 100 },
  ] : [];

  const getCircuitColor = (c: string) => {
    if (c.includes('WTA')) return 'text-pink-500';
    if (c.includes('CHALLENGER')) return 'text-yellow-500';
    return 'text-blue-500';
  };

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={() => setIsComputing(false)} />

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        
        {/* COLONNE GAUCHE : LISTE */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2">Sélectionner un Match</h2>
          <div className="overflow-y-auto pr-2 space-y-3 max-h-[80vh]">
            {activeMatches.map((match) => (
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

        {/* COLONNE DROITE : ANALYSE */}
        <div className="lg:w-2/3">
          {selectedMatch && selectedMatch.ai ? (
            <div className="bg-surface border border-neutral-800 rounded-2xl p-6 h-full shadow-2xl animate-fade-in overflow-y-auto relative">
              
              {/* EN-TÊTE */}
              <div className="flex justify-between items-start mb-4 border-b border-neutral-800 pb-4">
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
                 
                 {!currentData ? (
                   <button onClick={runGodMode} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105 animate-pulse">
                      <Cpu size={20} /> LANCER GOD MODE
                   </button>
                 ) : (
                     <div className="px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold flex items-center gap-2">
                         <Zap size={14} /> ANALYSE TERMINÉE
                     </div>
                 )}
              </div>

              {/* 🔒 ECRAN DE VERROUILLAGE */}
              {!currentData && (
                  <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-neutral-800 rounded-xl bg-black/20 mt-8">
                      <div className="relative">
                          <div className="absolute inset-0 bg-neon/20 blur-xl rounded-full"></div>
                          <Lock size={64} className="text-neon relative z-10" />
                      </div>
                      <h3 className="text-xl font-bold text-white mt-6">ANALYSE VERROUILLÉE</h3>
                      <p className="text-gray-400 text-sm mt-2 text-center max-w-md">
                          Lancez le God Mode pour scanner le web, récupérer le H2H, la météo et les alertes blessure.
                      </p>
                  </div>
              )}

              {/* 🔓 CONTENU DÉVERROUILLÉ */}
              {currentData && (
                <div className="animate-fade-in space-y-8">
                    
                    {/* ✅ NOUVEAU : TABLEAU H2H AUTO-REMPLI */}
                    {currentData.h2hProfile && (
                        <DetailedH2H 
                            data={currentData.h2hProfile} 
                            p1Name={selectedMatch.player1.name} 
                            p2Name={selectedMatch.player2.name} 
                        />
                    )}

                    {/* ALERTE PHYSIQUE */}
                    <div className={`p-4 rounded-xl border flex items-center gap-4 ${currentData.injuryAlert ? 'bg-red-900/20 border-red-500' : 'bg-green-900/20 border-green-500'}`}>
                        {currentData.injuryAlert ? <Siren className="text-red-500" size={24}/> : <ShieldAlert className="text-green-500" size={24}/>}
                        <div>
                            <p className={`text-xs uppercase font-bold ${currentData.injuryAlert ? 'text-red-400' : 'text-green-400'}`}>
                                {currentData.injuryAlert ? "ALERTE BLESSURE DÉTECTÉE" : "PHYSIQUE R.A.S"}
                            </p>
                            {currentData.injuryDetails && <p className="text-xs text-gray-300 mt-1">{currentData.injuryDetails}</p>}
                        </div>
                    </div>

                    {/* PRÉDICTION & COTES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-surfaceHighlight p-5 rounded-xl border border-neutral-800">
                            <p className="text-gray-400 text-xs uppercase mb-2">Verdict Oracle</p>
                            <p className="text-3xl font-bold text-white mb-2">{selectedMatch.ai.recommendedBet}</p>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-neon" style={{width: `${selectedMatch.ai.confidence}%`}}></div>
                                </div>
                                <span className="text-sm font-bold text-neon">{selectedMatch.ai.confidence}%</span>
                            </div>
                        </div>
                        {selectedMatch.ai.oddsAnalysis && selectedMatch.ai.fairOdds && (
                            <OddsComparator 
                                analysis={selectedMatch.ai.oddsAnalysis} 
                                fairOdds={selectedMatch.ai.fairOdds}
                                player1={selectedMatch.player1.name}
                                player2={selectedMatch.player2.name}
                            />
                        )}
                    </div>

                    {/* GRAPHIQUES */}
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
              )}

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 border border-dashed border-neutral-800 rounded-xl m-4">
                Sélectionnez un match pour commencer.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
