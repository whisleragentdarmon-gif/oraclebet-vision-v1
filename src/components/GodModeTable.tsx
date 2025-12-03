import React, { useState } from 'react';
import { GodModeReportV2 } from '../engine/types';
// ✅ CORRECTION : Ajout des icônes manquantes (Brain, Thermometer, Droplets, Eye, Wind)
import { Save, Edit3, Trophy, Calendar, Activity, User, Globe, Clock, MapPin, Star, List, Brain, Thermometer, Droplets, Eye, Wind } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate }) => {
  
  const [tabP1, setTabP1] = useState<'PROFIL' | 'STATS' | 'PSYCHO' | 'CALENDRIER' | 'H2H' | 'ENJEUX'>('PROFIL');
  const [tabP2, setTabP2] = useState<'PROFIL' | 'STATS' | 'PSYCHO' | 'CALENDRIER' | 'H2H' | 'ENJEUX'>('PROFIL');

  const handleChange = (path: string[], value: string) => {
    const newReport = { ...report };
    let current: any = newReport;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onUpdate(newReport);
  };

  // --- SOUS-COMPOSANT : FICHE JOUEUR ---
  const PlayerCard = ({ 
    playerKey, name, data, activeTab, setActiveTab, colorClass, opponentName 
  }: { 
    // ✅ CORRECTION : Ajout explicite de opponentName et colorClass dans le type
    playerKey: 'p1' | 'p2', 
    name: string, 
    data: any, 
    activeTab: string, 
    setActiveTab: (t: any) => void, 
    colorClass: string,
    opponentName: string 
  }) => (
    <div className="bg-surface border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      
      {/* EN-TÊTE JOUEUR */}
      <div className="bg-neutral-900 p-4 border-b border-neutral-800">
          <div>
            <div className={`text-lg font-black uppercase flex items-center gap-2 ${colorClass}`}>
                <span className="text-2xl">●</span> {name}
            </div>
            <span className="inline-flex items-center gap-2 bg-black/50 px-3 py-1 rounded border border-neutral-700 text-xs text-gray-300 font-mono mt-2">
                <Trophy size={12} className="text-neon"/> RANG: 
                <input 
                    value={data.rank} 
                    onChange={(e) => handleChange([playerKey, 'rank'], e.target.value)}
                    className="bg-transparent w-12 text-white outline-none font-bold text-center"
                />
            </span>
          </div>
      </div>

      {/* ONGLETS */}
      <div className="flex border-b border-neutral-800 bg-black/20 overflow-x-auto scrollbar-none">
          {['PROFIL', 'STATS', 'PSYCHO', 'CALENDRIER', 'H2H', 'ENJEUX'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 transition-colors min-w-[70px] ${activeTab === tab ? `text-white border-b-2 ${playerKey === 'p1' ? 'border-blue-500' : 'border-orange-500'} bg-white/5` : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* CONTENU */}
      <div className="p-4 space-y-6 overflow-y-auto h-[500px] scrollbar-thin scrollbar-thumb-neutral-700 bg-[#1a1a1a]">
          
          {activeTab === 'PROFIL' && (
            <>
              <div className="space-y-2">
                <div className={`text-xs font-bold uppercase flex items-center gap-2 ${playerKey === 'p1' ? 'text-blue-400' : 'text-orange-400'}`}>📍 Profil</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/20">
                    {[
                        {l: 'Meilleur Class.', k: 'bestRank'},
                        {l: 'Main / Style', k: 'hand'},
                        {l: 'Âge / Taille', k: 'ageHeight'},
                        {l: 'Nationalité', k: 'nationality'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-xs">
                            <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data[row.k]} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono"/>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-2">⚡ Condition</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/20">
                    <div className="grid grid-cols-[40%_60%] border-b border-neutral-800 text-xs">
                        <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">Forme (1-10)</div>
                        <input value={data.form} onChange={(e) => handleChange([playerKey, 'form'], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono"/>
                    </div>
                    <div className="grid grid-cols-[40%_60%] border-b border-neutral-800 text-xs">
                        <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">Blessures</div>
                        <input value={data.injury} onChange={(e) => handleChange([playerKey, 'injury'], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono"/>
                    </div>
                    <div className="grid grid-cols-[40%_60%] text-xs">
                        <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">Fatigue</div>
                        <input value={data.fatigue} onChange={(e) => handleChange([playerKey, 'fatigue'], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono"/>
                    </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'STATS' && (
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="text-xs font-bold text-green-400 uppercase">📊 Stats Clés</div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="bg-green-900/10 border border-green-500/30 p-2 rounded flex justify-between">
                            <span className="text-green-500 font-bold">HOLD %</span>
                            <input value={data.serveStats || "0%"} onChange={(e) => handleChange([playerKey, 'serveStats'], e.target.value)} className="bg-transparent text-right w-20 outline-none text-white"/>
                        </div>
                        <div className="bg-red-900/10 border border-red-500/30 p-2 rounded flex justify-between">
                            <span className="text-red-500 font-bold">BREAK %</span>
                            <input value={data.returnStats || "0%"} onChange={(e) => handleChange([playerKey, 'returnStats'], e.target.value)} className="bg-transparent text-right w-20 outline-none text-white"/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-xs font-bold text-blue-400 uppercase">Aces & Fautes</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs">
                        <div className="grid grid-cols-2 border-b border-neutral-800 p-2">
                            <span className="text-gray-400">Aces / Match</span>
                            <input value={data.aces} onChange={(e) => handleChange([playerKey, 'aces'], e.target.value)} className="bg-transparent text-right outline-none text-white"/>
                        </div>
                        <div className="grid grid-cols-2 border-b border-neutral-800 p-2">
                            <span className="text-gray-400">Double Fautes</span>
                            <input value={data.doubleFaults} onChange={(e) => handleChange([playerKey, 'doubleFaults'], e.target.value)} className="bg-transparent text-right outline-none text-white"/>
                        </div>
                        <div className="grid grid-cols-2 p-2">
                            <span className="text-gray-400">% 1ère Balle</span>
                            <input value={data.firstServe} onChange={(e) => handleChange([playerKey, 'firstServe'], e.target.value)} className="bg-transparent text-right outline-none text-white"/>
                        </div>
                    </div>
                 </div>
              </div>
          )}

          {activeTab === 'PSYCHO' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-purple-400 uppercase flex gap-2"><Brain size={14}/> Psychologie</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/20">
                      {[
                          {l: 'Motivation', k: 'motivation'},
                          {l: 'Pression', k: 'form'},
                          {l: 'Confiance', k: 'style'},
                      ].map((row, i) => (
                          <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                              <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                              <input value={data[row.k]} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {activeTab === 'CALENDRIER' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-white uppercase">📅 Calendrier Prochain</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px]">
                      <div className="grid grid-cols-[60px_1fr_60px] bg-neutral-900 p-2 font-bold text-gray-400 border-b border-neutral-700">
                          <span>Date</span><span>Tournoi</span><span>Priorité</span>
                      </div>
                      <div className="grid grid-cols-[60px_1fr_60px] p-2 hover:bg-white/5 border-b border-neutral-800 text-gray-300">
                          <span>03.12</span>
                          <span>{report.identity.tournament}</span>
                          <span className="text-red-500 font-bold">🔥 MAX</span>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'H2H' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-orange-500 uppercase">⚔️ Historique vs Adversaire</div>
                  <div className="text-[10px] text-gray-400 border border-dashed border-neutral-700 p-3 rounded text-center">
                      Voir la section H2H globale en bas de page pour le détail complet des confrontations.
                  </div>
              </div>
          )}
          
          {activeTab === 'ENJEUX' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-green-400 uppercase">💰 Enjeux Financiers & Points</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/20">
                      <div className="grid grid-cols-[40%_60%] border-b border-neutral-800">
                          <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">Points ATP/WTA</div>
                          <input className="bg-transparent text-white p-2 outline-none" defaultValue="45 pts"/>
                      </div>
                      <div className="grid grid-cols-[40%_60%]">
                          <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">Prize Money</div>
                          <input className="bg-transparent text-white p-2 outline-none" defaultValue="12 000 €"/>
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );

  return (
    <div className="container mt-6 space-y-6 font-sans text-white">
      
      {/* 1. MATCH HEADER */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-orange-500/30 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-2xl">
          <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 uppercase tracking-widest border border-orange-500/30 px-3 py-1 rounded-full bg-orange-500/10">
                  <Trophy size={14}/> {report.identity.tournament} | {report.identity.surface}
              </div>
              <div className="text-3xl font-black flex items-center gap-4">
                  <input value={report.identity.p1Name} onChange={(e) => handleChange(['identity', 'p1Name'], e.target.value)} className="bg-transparent text-right w-full outline-none"/>
                  <span className="text-gray-600 text-lg font-normal">vs</span>
                  <input value={report.identity.p2Name} onChange={(e) => handleChange(['identity', 'p2Name'], e.target.value)} className="bg-transparent text-left w-full outline-none"/>
              </div>
              <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded border border-white/10">
                      <Calendar size={14} className="text-gray-400"/> <input value={report.identity.date} onChange={(e) => handleChange(['identity', 'date'], e.target.value)} className="bg-transparent w-24 outline-none"/>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded border border-white/10">
                      {/* ✅ CORRECTION : On accède à 'time' via 'any' pour éviter l'erreur TS */}
                      <Clock size={14} className="text-gray-400"/> <input value={(report.identity as any).time || "16:40"} onChange={(e) => handleChange(['identity', 'time'], e.target.value)} className="bg-transparent w-16 outline-none"/>
                  </div>
              </div>
          </div>

          {/* Météo Card */}
          <div className="bg-black/40 border border-neutral-700 rounded-lg p-4 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2"><Thermometer size={14} className="text-gray-500"/> <span className="text-gray-400">Temp:</span> <input value={report.conditions.temp} onChange={(e) => handleChange(['conditions', 'temp'], e.target.value)} className="bg-transparent text-white font-bold w-12 outline-none"/></div>
              <div className="flex items-center gap-2"><Wind size={14} className="text-gray-500"/> <span className="text-gray-400">Vent:</span> <input value={report.conditions.wind} onChange={(e) => handleChange(['conditions', 'wind'], e.target.value)} className="bg-transparent text-white font-bold w-20 outline-none"/></div>
              <div className="flex items-center gap-2"><Droplets size={14} className="text-gray-500"/> <span className="text-gray-400">Humidité:</span> <input value={report.conditions.humidity} onChange={(e) => handleChange(['conditions', 'humidity'], e.target.value)} className="bg-transparent text-white font-bold w-12 outline-none"/></div>
              <div className="flex items-center gap-2"><Eye size={14} className="text-gray-500"/> <span className="text-gray-400">Météo:</span> <input value={report.conditions.weather} onChange={(e) => handleChange(['conditions', 'weather'], e.target.value)} className="bg-transparent text-white font-bold w-full outline-none"/></div>
          </div>
      </div>

      {/* 2. JOUEURS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlayerCard 
            playerKey="p1" 
            name={report.identity.p1Name} 
            data={report.p1} 
            activeTab={tabP1} 
            setActiveTab={setTabP1} 
            opponentName={report.identity.p2Name}
            colorClass="text-blue-500"
          />
          <PlayerCard 
            playerKey="p2" 
            name={report.identity.p2Name} 
            data={report.p2} 
            activeTab={tabP2} 
            setActiveTab={setTabP2} 
            opponentName={report.identity.p1Name}
            colorClass="text-orange-500"
          />
      </div>

      {/* 3. BOTTOM : H2H */}
      <div className="bg-surface border border-neutral-800 rounded-xl p-5">
          <div className="text-xs font-bold text-purple-500 uppercase mb-4 border-b border-neutral-800 pb-2">⚔️ Résumé H2H</div>
          <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                  <div className="text-[10px] text-gray-500 uppercase">Score Global</div>
                  <input 
                    value={report.h2h.global} 
                    onChange={(e) => handleChange(['h2h', 'global'], e.target.value)}
                    className="text-3xl font-black text-white bg-transparent text-center w-full outline-none"
                  />
              </div>
              <div>
                  <div className="text-[10px] text-gray-500 uppercase">Sur Surface</div>
                  <input 
                    value={report.h2h.surface} 
                    onChange={(e) => handleChange(['h2h', 'surface'], e.target.value)}
                    className="text-3xl font-black text-white bg-transparent text-center w-full outline-none"
                  />
              </div>
          </div>
          <div className="mt-4 bg-black/30 p-2 rounded text-xs text-gray-400 text-center italic">
              {/* ✅ CORRECTION : lastMatch (singulier) comme dans les Types */}
              <input 
                value={report.h2h.lastMatch} 
                onChange={(e) => handleChange(['h2h', 'lastMatch'], e.target.value)}
                className="bg-transparent w-full text-center outline-none"
                placeholder="Dernier match..."
              />
          </div>
      </div>

      <div className="text-center">
         <button className="bg-neon hover:bg-neonHover text-black font-bold px-8 py-3 rounded-xl shadow-lg shadow-neon/20 transition-all transform hover:scale-105">
            <Save size={18} className="inline mr-2"/> SAUVEGARDER FICHE COMPLÈTE
         </button>
      </div>

    </div>
  );
};
