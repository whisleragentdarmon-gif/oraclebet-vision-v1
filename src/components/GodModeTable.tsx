import React, { useState } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Trophy, Calendar, Activity, User, Globe, Clock, MapPin, Star, List, Wind, Thermometer, Droplets, Eye, TrendingUp, Zap, Target, AlertCircle } from 'lucide-react';

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
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onUpdate(newReport);
  };

  // --- SOUS-COMPOSANT : FICHE JOUEUR COMPLÈTE ---
  const PlayerCard = ({ 
    playerKey, name, data, activeTab, setActiveTab, colorClass, opponentName 
  }: { 
    playerKey: 'p1' | 'p2', name: string, data: any, activeTab: string, setActiveTab: (t: any) => void, colorClass: string, opponentName: string 
  }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-full shadow-lg">
      
      {/* EN-TÊTE JOUEUR */}
      <div className="bg-neutral-950 p-3 border-b border-neutral-800">
          <div>
            <div className={`text-base font-black uppercase flex items-center gap-2 ${colorClass}`}>
                <span className="text-xl">●</span> 
                <span>{name}</span>
            </div>
            <div className="flex gap-2 mt-1 flex-wrap text-[11px]">
              <span className="inline-flex items-center gap-1 bg-black/50 px-2 py-1 rounded border border-neutral-700 text-gray-300 font-mono">
                  <Trophy size={10} className={colorClass}/> RANG: 
                  <input 
                      value={data?.rank || '0'} 
                      onChange={(e) => handleChange([playerKey, 'rank'], e.target.value)}
                      className="bg-transparent w-10 text-white outline-none font-bold text-center"
                  />
              </span>
              <span className="inline-flex items-center gap-1 bg-black/50 px-2 py-1 rounded border border-neutral-700 text-gray-300 font-mono">
                  🏆 Tournoi: 
                  <input 
                      value={data?.tournamentRank || '1/2'} 
                      onChange={(e) => handleChange([playerKey, 'tournamentRank'], e.target.value)}
                      className="bg-transparent w-12 text-white outline-none font-bold text-center"
                  />
              </span>
            </div>
          </div>
      </div>

      {/* ONGLETS */}
      <div className="flex border-b border-neutral-800 bg-black/40 overflow-x-auto scrollbar-none">
          {['PROFIL', 'STATS', 'PSYCHO', 'CALENDRIER', 'H2H', 'ENJEUX'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-shrink-0 py-2 px-2 text-[9px] font-bold uppercase tracking-wider hover:bg-white/5 transition-colors ${activeTab === tab ? `text-white border-b-2 ${playerKey === 'p1' ? 'border-blue-500' : 'border-orange-500'} bg-white/10` : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* CONTENU */}
      <div className="p-3 space-y-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-neutral-700 bg-neutral-950">
          
          {/* ONGLET PROFIL */}
          {activeTab === 'PROFIL' && (
            <>
              <div className="space-y-1">
                <div className={`text-[10px] font-bold uppercase flex items-center gap-1 ${playerKey === 'p1' ? 'text-blue-400' : 'text-orange-400'}`}><User size={11}/> Profil</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'Meilleur Class.', k: 'bestRank'},
                        {l: 'Main / Style', k: 'hand'},
                        {l: 'Âge / Taille', k: 'ageHeight'},
                        {l: 'Nationalité', k: 'nationality'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-[9px]">
                            <div className="bg-neutral-900/50 p-1 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-1 outline-none w-full font-mono text-[8px]"/>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-yellow-400 uppercase flex items-center gap-1"><Zap size={11}/> Condition</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'Forme (1-10)', k: 'form'},
                        {l: 'Blessures', k: 'injury'},
                        {l: 'Match Veille', k: 'previousMatch'},
                        {l: 'Fatigue', k: 'fatigue'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-[9px]">
                            <div className="bg-neutral-900/50 p-1 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-1 outline-none w-full font-mono text-[8px]"/>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-1"><Activity size={11}/> vs Main</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'vs Droitières', k: 'vsRightHanded'},
                        {l: 'vs Gauchers', k: 'vsLeftHanded'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-[9px]">
                            <div className="bg-neutral-900/50 p-1 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-1 outline-none w-full font-mono text-[8px]"/>
                        </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* ONGLET STATS */}
          {activeTab === 'STATS' && (
              <div className="space-y-2">
                 <div className="space-y-1">
                    <div className="text-[10px] font-bold text-green-400 uppercase flex items-center gap-1"><TrendingUp size={11}/> Stats Clés</div>
                    <div className="grid grid-cols-1 gap-1 text-[9px]">
                        <div className="bg-green-900/15 border border-green-500/40 p-1 rounded flex justify-between items-center">
                            <span className="text-green-400 font-bold">HOLD % 🔑</span>
                            <input value={data?.holdPercent || '82%'} onChange={(e) => handleChange([playerKey, 'holdPercent'], e.target.value)} className="bg-transparent text-right w-14 outline-none text-white font-bold text-[8px]"/>
                        </div>
                        <div className="bg-red-900/15 border border-red-500/40 p-1 rounded flex justify-between items-center">
                            <span className="text-red-400 font-bold">BREAK % 🔑</span>
                            <input value={data?.breakPercent || '42%'} onChange={(e) => handleChange([playerKey, 'breakPercent'], e.target.value)} className="bg-transparent text-right w-14 outline-none text-white font-bold text-[8px]"/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <div className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1"><Star size={11}/> Tendance & Sets</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[9px] bg-black/40">
                        {[
                            {l: 'Tendance +10', k: 'trend'},
                            {l: 'Moyenne sets', k: 'avgSets'},
                            {l: 'TB %', k: 'tbPercent'},
                            {l: '1er Set %', k: 'firstSetWin'}
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 p-1">
                                <span className="text-gray-400 font-semibold text-[8px]">{row.l}</span>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono text-[8px]"/>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
          )}

          {/* ONGLET PSYCHO */}
          {activeTab === 'PSYCHO' && (
              <div className="space-y-1">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-purple-400 uppercase flex gap-1"><Activity size={11}/> Comportement</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[9px] bg-black/40">
                        {[
                            {l: 'Après Défaite', k: 'afterLoss'},
                            {l: 'Après Victoire', k: 'afterWin'},
                            {l: 'Relâchement?', k: 'relaxation'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-1 text-gray-400 font-semibold border-r border-neutral-800 text-[8px]">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-1 outline-none w-full text-[8px]"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-green-400 uppercase flex gap-1"><Star size={11}/> Joueur Similaire</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[9px] bg-black/40">
                        {[
                            {l: 'Joueur', k: 'similarPlayer'},
                            {l: 'Score', k: 'similarScore'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-1 text-gray-400 font-semibold border-r border-neutral-800 text-[8px]">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-1 outline-none w-full text-[8px]"/>
                            </div>
                        ))}
                    </div>
                  </div>
              </div>
          )}

          {/* ONGLET CALENDRIER */}
          {activeTab === 'CALENDRIER' && (
              <div className="space-y-1">
                  <div className="text-[10px] font-bold text-white uppercase flex gap-1"><Calendar size={11}/> Calendrier</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-[8px] bg-black/40">
                      <div className="grid grid-cols-[60px_1fr_50px] bg-neutral-900 p-1 font-bold text-gray-400 border-b border-neutral-700 text-[8px]">
                          <span>Date</span><span>Tournoi</span><span>Prio</span>
                      </div>
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="grid grid-cols-[60px_1fr_50px] p-1 hover:bg-white/5 border-b border-neutral-800 text-gray-300">
                            <input value={data?.[`match${i}_date`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_date`], e.target.value)} placeholder="JJ.MM" className="bg-transparent outline-none text-[7px]"/>
                            <input value={data?.[`match${i}_tournament`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_tournament`], e.target.value)} placeholder="Tournoi" className="bg-transparent outline-none text-[7px] px-1"/>
                            <input value={data?.[`match${i}_priority`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_priority`], e.target.value)} placeholder="✓" className="bg-transparent outline-none text-right text-[7px]"/>
                        </div>
                      ))}
                  </div>
              </div>
          )}

          {/* ONGLET H2H */}
          {activeTab === 'H2H' && (
              <div className="space-y-1">
                  <div className="text-[10px] font-bold text-orange-500 uppercase flex gap-1"><MapPin size={11}/> H2H</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-[9px] bg-black/40">
                      {[
                          {l: 'Affrontés', k: 'h2hMeetings'},
                          {l: 'Score', k: 'global'},
                          {l: 'Surface', k: 'h2hSurface'},
                          {l: 'Hold % H2H', k: 'h2hHold'},
                          {l: 'Break % H2H', k: 'h2hBreak'},
                      ].map((row, i) => (
                          <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 p-1">
                              <span className="text-gray-400 font-semibold text-[8px]">{row.l}</span>
                              <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono text-[8px]"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}
          
          {/* ONGLET ENJEUX */}
          {activeTab === 'ENJEUX' && (
              <div className="space-y-1">
                  <div className="text-[10px] font-bold text-green-400 uppercase flex gap-1"><Target size={11}/> Enjeux</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-[9px] bg-black/40">
                      {[
                          {l: 'Enjeu', k: 'stake'},
                          {l: 'Points WTA', k: 'points'},
                          {l: 'Objectif', k: 'objective'},
                          {l: 'Motivation', k: 'motivation'},
                      ].map((row, i) => (
                          <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                              <div className="bg-neutral-900/50 p-1 text-gray-400 font-semibold border-r border-neutral-800 text-[8px]">{row.l}</div>
                              <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-1 outline-none w-full text-[8px]"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}

      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-950 via-black to-neutral-950 font-sans text-white overflow-hidden">
      <div className="h-screen flex flex-col">
      
      {/* 1. MATCH HEADER - TERRAIN/DATE/HEURE/MÉTÉO */}
      <div className="bg-gradient-to-br from-neutral-900 to-black border-2 border-orange-500/40 rounded-lg p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 shadow-2xl mx-3 mt-3">
          <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold text-orange-500 uppercase tracking-widest border border-orange-500/40 px-3 py-1 rounded-full bg-orange-500/10">
                  <Trophy size={13}/> {report.identity.tournament || 'UNKNOWN'} | {report.identity.surface || 'DUR'}
              </div>
              
              <div className="text-2xl font-black flex items-center gap-2">
                  <span className="text-blue-500 text-lg">{report.identity.p1Name}</span>
                  <span className="text-gray-600 text-sm font-normal">vs</span>
                  <span className="text-orange-500 text-lg">{report.identity.p2Name}</span>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px]">
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10">
                      <Calendar size={12} className="text-gray-400"/> 
                      <input 
                        value={report.identity.date || '03.12.2025'} 
                        onChange={(e) => handleChange(['identity', 'date'], e.target.value)} 
                        className="bg-transparent w-20 outline-none font-mono text-[9px]"
                      />
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10">
                      <Clock size={12} className="text-gray-400"/> 
                      <input 
                        value={(report.identity as any).time || '16:40'} 
                        onChange={(e) => handleChange(['identity', 'time'], e.target.value)} 
                        className="bg-transparent w-14 outline-none font-mono text-[9px]"
                      />
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10">
                      <MapPin size={12} className="text-gray-400"/> 
                      <input 
                        value={(report.identity as any).court || 'Court Central'} 
                        onChange={(e) => handleChange(['identity', 'court'], e.target.value)} 
                        className="bg-transparent w-24 outline-none font-mono text-[9px]"
                      />
                  </div>
              </div>
          </div>

          {/* Météo Card */}
          <div className="bg-black/40 border border-neutral-700 rounded-lg p-3 grid grid-cols-2 gap-2 text-[9px]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-gray-400">
                  <Thermometer size={11}/> <span className="text-[9px]">Temp</span>
                </div>
                <input 
                  value={report.conditions.temp || '14°C'} 
                  onChange={(e) => handleChange(['conditions', 'temp'], e.target.value)} 
                  className="bg-transparent text-white font-bold outline-none w-full text-[10px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-gray-400">
                  <Wind size={11}/> <span className="text-[9px]">Vent</span>
                </div>
                <input 
                  value={report.conditions.wind || '12 km/h Nord'} 
                  onChange={(e) => handleChange(['conditions', 'wind'], e.target.value)} 
                  className="bg-transparent text-white font-bold outline-none w-full text-[10px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-gray-400">
                  <Droplets size={11}/> <span className="text-[9px]">Humidité</span>
                </div>
                <input 
                  value={report.conditions.humidity || '68%'} 
                  onChange={(e) => handleChange(['conditions', 'humidity'], e.target.value)} 
                  className="bg-transparent text-white font-bold outline-none w-full text-[10px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-gray-400">
                  <Eye size={11}/> <span className="text-[9px]">Météo</span>
                </div>
                <input 
                  value={report.conditions.weather || 'Bonne'} 
                  onChange={(e) => handleChange(['conditions', 'weather'], e.target.value)} 
                  className="bg-transparent text-white font-bold outline-none w-full text-[10px]"
                />
              </div>
          </div>
      </div>

      {/* 2. STATUS MATCH */}
      <div className="bg-green-900/20 border border-green-500/40 rounded-lg p-2 flex items-center gap-2 mx-3 mt-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-bold text-green-400">EN COURS</span>
        <input 
          value={(report.identity as any).matchStatus || 'Set 1 - 3-2'} 
          onChange={(e) => handleChange(['identity', 'matchStatus'], e.target.value)} 
          className="bg-transparent text-green-300 outline-none flex-1 text-[10px] font-mono"
        />
      </div>

      {/* 3. JOUEURS - FLEX LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 overflow-hidden">
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

      </div>
    </div>
  );
};
