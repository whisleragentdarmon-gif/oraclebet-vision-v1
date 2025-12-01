import React, { useState } from 'react';
import { MOCK_MATCHES } from '../constants';
import { MatchCard } from '../components/MatchCard';
import { Match } from '../types';
import { OracleReactor } from '../components/OracleReactor';
import { ScandalEngine } from '../engine/market/ScandalEngine';
import { GeoEngine } from '../engine/market/GeoEngine';
import { TrapDetector } from '../engine/market/TrapDetector';
import { TrendingUp, ShieldAlert, Siren, Globe, Cpu, Wind, Thermometer, Radio, Activity } from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(MOCK_MATCHES[0]);
  const [isComputing, setIsComputing] = useState(false);
  const [godModeData, setGodModeData] = useState<any>(null);

  const runGodMode = () => {
    setIsComputing(true);
    // Simulation du calcul pendant l'animation
  };

  const onComputationComplete = () => {
    if (!selectedMatch) return;
    // Récupération des Deep Data
    const social = ScandalEngine.analyze(selectedMatch.player1.name);
    const geo = GeoEngine.getConditions(selectedMatch.tournament);
    const trap = TrapDetector.scan(selectedMatch.odds);
    
    setGodModeData({ social, geo, trap });
    setIsComputing(false);
  };

  return (
    <>
      <OracleReactor isVisible={isComputing} onComplete={onComputationComplete} />

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Colonne Gauche : Liste */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2">Sélectionner un Match</h2>
          <div className="overflow-y-auto pr-2 space-y-3 max-h-[80vh]">
            {MOCK_MATCHES.map((match) => (
              <MatchCard key={match.id} match={match} selected={selectedMatch?.id === match.id} onClick={() => { setSelectedMatch(match); setGodModeData(null); }} compact />
            ))}
          </div>
        </div>

        {/* Colonne Droite : Analyse */}
        <div className="lg:w-2/3">
          {selectedMatch && selectedMatch.ai ? (
            <div className="bg-surface border border-neutral-800 rounded-2xl p-6 h-full shadow-2xl animate-fade-in overflow-y-auto">
              
              {/* Header Match */}
              <div className="flex justify-between items-start mb-6 border-b border-neutral-800 pb-4">
                 <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      {selectedMatch.player1.name} <span className="text-neon">vs</span> {selectedMatch.player2.name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">{selectedMatch.tournament} • {selectedMatch.surface}</p>
                 </div>
                 {!godModeData && (
                   <button onClick={runGodMode} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105">
                      <Cpu size={20} className="animate-pulse" /> LANCER GOD MODE
                   </button>
                 )}
              </div>

              {/* RÉSULTAT GOD MODE (S'affiche après animation) */}
              {godModeData && (
                <div className="mb-8 animate-fade-in space-y-4">
                    <div className="bg-purple-900/10 border border-purple-500/30 p-4 rounded-xl">
                        <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><Activity /> DEEP DATA MARKET ANALYSIS</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Météo */}
                            <div className="bg-black/40 p-3 rounded border border-purple-500/20">
                                <p className="text-gray-500 text-xs uppercase mb-1">Conditions (GeoEngine)</p>
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <Wind size={16} className="text-blue-400"/> {godModeData.geo.wind} km/h
                                </div>
                                <div className="flex items-center gap-2 text-white font-bold mt-1">
                                    <Globe size={16} className="text-green-400"/> {godModeData.geo.altitude}m Alt.
                                </div>
                            </div>

                            {/* Social */}
                            <div className="bg-black/40 p-3 rounded border border-purple-500/20">
                                <p className="text-gray-500 text-xs uppercase mb-1">Social & Mental</p>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-300">Pression Mentale</span>
                                    <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{width: `${godModeData.social.mentalPressure}%`}}></div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-300">Trend: <span className="text-neon">{godModeData.social.socialTrend}</span></p>
                            </div>

                            {/* Trap Detector */}
                            <div className="bg-black/40 p-3 rounded border border-purple-500/20">
                                <p className="text-gray-500 text-xs uppercase mb-1">Trap Detector</p>
                                {godModeData.trap.isTrap ? (
                                    <div className="text-red-500 font-bold flex items-center gap-2"><Siren size={16}/> PIÈGE DÉTECTÉ</div>
                                ) : (
                                    <div className="text-green-500 font-bold flex items-center gap-2"><ShieldAlert size={16}/> Cotes Saines</div>
                                )}
                                <p className="text-[10px] text-gray-500 mt-1">{godModeData.trap.reason}</p>
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {/* Analyse Standard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-gray-400 text-xs uppercase mb-2">Analyse Qualitative</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedMatch.ai.qualitativeAnalysis}</p>
                 </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Sélectionnez un match.</div>
          )}
        </div>
      </div>
    </>
  );
};
