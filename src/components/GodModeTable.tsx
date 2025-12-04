'use client';
import React, { useState, useRef } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Trophy, Calendar, Activity, User, Globe, Clock, MapPin, Star, List, Wind, Thermometer, Droplets, Eye, TrendingUp, Zap, Target, AlertCircle } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
  onSave: () => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate, onSave }) => {
  
  const [tabP1, setTabP1] = useState<'PROFIL' | 'STATS' | 'PSYCHO' | 'CALENDRIER' | 'H2H' | 'ENJEUX'>('PROFIL');
  const [tabP2, setTabP2] = useState<'PROFIL' | 'STATS' | 'PSYCHO' | 'CALENDRIER' | 'H2H' | 'ENJEUX'>('PROFIL');
  const scrollP1Ref = useRef<HTMLDivElement>(null);
  const scrollP2Ref = useRef<HTMLDivElement>(null);

  const handleChange = (path: string[], value: string) => {
    const newReport = { ...report };
    let current: any = newReport;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onUpdate(newReport);
  };

  const PlayerCard = ({ 
    playerKey, name, data, activeTab, setActiveTab, colorClass, opponentName, scrollRef
  }: { 
    playerKey: 'p1' | 'p2', name: string, data: any, activeTab: string, setActiveTab: (t: any) => void, colorClass: string, opponentName: string, scrollRef: React.RefObject<HTMLDivElement>
  }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-full shadow-lg">
      
      <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex-shrink-0">
          <div>
            <div className={`text-xl font-bold uppercase flex items-center gap-2 ${colorClass}`}>
                <span className="text-2xl">●</span> 
                <span>{name}</span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1 bg-black/50 px-3 py-2 rounded border border-neutral-700 text-gray-300 font-mono">
                  <Trophy size={13} className={colorClass}/> RANG: 
                  <input 
                      value={data?.rank || '0'} 
                      onChange={(e) => handleChange([playerKey, 'rank'], e.target.value)}
                      className="bg-transparent w-12 text-white outline-none font-bold text-center"
                  />
              </span>
              <span className="inline-flex items-center gap-1 bg-black/50 px-3 py-2 rounded border border-neutral-700 text-gray-300 font-mono">
                  🏆 Tournoi: 
                  <input 
                      value={data?.tournamentRank || '1/2'} 
                      onChange={(e) => handleChange([playerKey, 'tournamentRank'], e.target.value)}
                      className="bg-transparent w-14 text-white outline-none font-bold text-center"
                  />
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-900/30 px-3 py-2 rounded border border-blue-500/40 text-blue-300 font-mono font-bold">
                  💰 Cote: 
                  <input 
                      value={data?.oddsPlayer || (playerKey === 'p1' ? report.bookmaker.oddA : report.bookmaker.oddB)} 
                      onChange={(e) => handleChange([playerKey, 'oddsPlayer'], e.target.value)}
                      className="bg-transparent w-16 text-white outline-none font-bold text-center"
                  />
              </span>
            </div>
          </div>
      </div>

      <div className="flex border-b border-neutral-800 bg-black/40 overflow-x-auto scrollbar-none flex-shrink-0">
          {['PROFIL', 'STATS', 'PSYCHO', 'CALENDRIER', 'H2H', 'ENJEUX'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-shrink-0 py-2 px-3 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors ${activeTab === tab ? `text-white border-b-2 ${playerKey === 'p1' ? 'border-blue-500' : 'border-orange-500'} bg-white/10` : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div ref={scrollRef} className="p-4 space-y-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-neutral-700 bg-neutral-950">
          
          {activeTab === 'PROFIL' && (
            <>
              <div className="space-y-2">
                <div className={`text-xs font-bold uppercase flex items-center gap-1 ${playerKey === 'p1' ? 'text-blue-400' : 'text-orange-400'}`}><User size={13}/> Profil</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'Meilleur Class.', k: 'bestRank'},
                        {l: 'Main / Style', k: 'hand'},
                        {l: 'Âge / Taille', k: 'ageHeight'},
                        {l: 'Nationalité', k: 'nationality'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-xs">
                            <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono text-xs"/>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-1"><Zap size={13}/> Condition</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'Forme (1-10)', k: 'form'},
                        {l: 'Blessures', k: 'injury'},
                        {l: 'Match Veille', k: 'previousMatch'},
                        {l: 'Fatigue', k: 'fatigue'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-xs">
                            <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono text-xs"/>
                        </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'STATS' && (
              <div className="space-y-3">
                 <div className="space-y-2">
                    <div className="text-xs font-bold text-green-400 uppercase flex items-center gap-1"><TrendingUp size={13}/> Stats Clés</div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="bg-green-900/15 border border-green-500/40 p-2 rounded flex justify-between items-center">
                            <span className="text-green-400 font-bold text-xs">HOLD %</span>
                            <input value={data?.serveStats || '82%'} onChange={(e) => handleChange([playerKey, 'serveStats'], e.target.value)} className="bg-transparent text-right w-14 outline-none text-white font-bold text-sm"/>
                        </div>
                        <div className="bg-red-900/15 border border-red-500/40 p-2 rounded flex justify-between items-center">
                            <span className="text-red-400 font-bold text-xs">BREAK %</span>
                            <input value={data?.returnStats || '42%'} onChange={(e) => handleChange([playerKey, 'returnStats'], e.target.value)} className="bg-transparent text-right w-14 outline-none text-white font-bold text-sm"/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1"><Star size={13}/> Tendance & Sets</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/40">
                        {[
                            {l: 'Tendance +10', k: 'last5'},
                            {l: 'Moyenne sets', k: 'winrateSeason'},
                            {l: 'TB %', k: 'winrateCareer'},
                            {l: '1er Set %', k: 'winrateSurface'}
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 p-2">
                                <span className="text-gray-400 font-semibold text-xs">{row.l}</span>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono text-xs"/>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
          )}

          {activeTab === 'PSYCHO' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-purple-400 uppercase flex gap-2"><Activity size={14}/> Psychologie</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/40">
                      {[
                          {l: 'Motivation', k: 'motivation'},
                          {l: 'Pression', k: 'twitter'},
                          {l: 'Confiance', k: 'instagram'},
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
                  <div className="text-xs font-bold text-white uppercase flex gap-1"><Calendar size={13}/> Calendrier</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px]">
                      <div className="grid grid-cols-[60px_1fr_60px] bg-neutral-900 p-2 font-bold text-gray-400 border-b border-neutral-700">
                          <span>Date</span><span>Tournoi</span><span>Prio</span>
                      </div>
                      <div className="grid grid-cols-[60px_1fr_60px] p-2 hover:bg-white/5 border-b border-neutral-800 text-gray-300">
                          <span>03.12</span>
                          <span>{report.identity.tournament}</span>
                          <span className="text-red-500 font-bold">MAX</span>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'H2H' && (
              <div className="space-y-3">
                  <div className="space-y-2">
                      <div className="text-xs font-bold text-orange-500 uppercase flex gap-1"><MapPin size={13}/> H2H Global</div>
                      <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/40">
                         <div className="grid grid-cols-[40%_60%] border-b border-neutral-800">
                            <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">Total</div>
                            <input value={report.h2h.global} onChange={(e) => handleChange(['h2h', 'global'], e.target.value)} className="bg-transparent text-white p-2 outline-none"/>
                         </div>
                         <div className="grid grid-cols-[40%_60%]">
                            <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">Surface</div>
                            <input value={report.h2h.surface} onChange={(e) => handleChange(['h2h', 'surface'], e.target.value)} className="bg-transparent text-white p-2 outline-none"/>
                         </div>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <div className="text-xs font-bold text-green-500 uppercase">Derniers Affrontements</div>
                      <textarea 
                        value={report.h2h.lastMatches} 
                        onChange={(e) => handleChange(['h2h', 'lastMatches'], e.target.value)}
                        className="w-full bg-black/40 border border-neutral-700 rounded p-2 text-[10px] text-gray-300 outline-none resize-none h-20 font-mono"
                        placeholder="Ex: 12/10/24 - Victoire 6-4 6-2..."
                      />
                  </div>
              </div>
          )}
          
          {activeTab === 'ENJEUX' && (
              <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-green-400 uppercase flex gap-1"><Target size={13}/> Enjeux du match</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/40">
                        <div className="grid grid-cols-[40%_60%] border-b border-neutral-800">
                            <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">Importance</div>
                            <input value={report.identity.importance || 'Haute'} onChange={(e) => handleChange(['identity', 'importance'], e.target.value)} className="bg-transparent text-white p-2 outline-none"/>
                        </div>
                        <div className="grid grid-cols-[40%_60%] border-b border-neutral-800">
                            <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">Enjeu</div>
                            <input value={report.identity.enjeu || 'Qualification'} onChange={(e) => handleChange(['identity', 'enjeu'], e.target.value)} className="bg-transparent text-white p-2 outline-none"/>
                        </div>
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
                      <Clock size={14} className="text-gray-400"/> <input value={(report.identity as any).time || "16:40"} onChange={(e) => handleChange(['identity', 'time'], e.target.value)} className="bg-transparent w-16 outline-none"/>
                  </div>
              </div>
              <div className="mt-2">
                 <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs font-bold border border-green-500/50">
                    🟢 EN COURS - Set 1
                 </span>
              </div>
          </div>

          {/* 👇 REMPLACE LE BOUTON ICI */}
          <div className="flex justify-end items-start">
            <button 
              type="button"
              onClick={onSave}
              className="text-xs bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 transition-all"
            >
                <Save size={14}/> Sauvegarder
            </button>
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
            scrollRef={scrollP1Ref}
          />
          <PlayerCard 
            playerKey="p2" 
            name={report.identity.p2Name} 
            data={report.p2} 
            activeTab={tabP2} 
            setActiveTab={setTabP2} 
            opponentName={report.identity.p1Name}
            colorClass="text-orange-500"
            scrollRef={scrollP2Ref}
          />
      </div>

      <div className="text-center pb-4">
         <button 
            type="button"
            onClick={onSave}
            className="bg-neon hover:bg-neonHover text-black font-bold px-8 py-3 rounded-xl shadow-lg shadow-neon/20 transition-all transform hover:scale-105"
         >
            <Save size={18} className="inline mr-2"/> SAUVEGARDER FICHE COMPLÈTE
         </button>
      </div>

    </div>
  );
};
