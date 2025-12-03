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
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      
      {/* EN-TÊTE JOUEUR */}
      <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex-shrink-0">
          <div>
            <div className={`text-2xl font-black uppercase flex items-center gap-2 ${colorClass}`}>
                <span className="text-3xl">●</span> 
                <span>{name}</span>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap text-sm">
              <span className="inline-flex items-center gap-2 bg-black/50 px-3 py-2 rounded border border-neutral-700 text-gray-300 font-mono">
                  <Trophy size={14} className={colorClass}/> RANG: 
                  <input 
                      value={data?.rank || '0'} 
                      onChange={(e) => handleChange([playerKey, 'rank'], e.target.value)}
                      className="bg-transparent w-14 text-white outline-none font-bold text-center"
                  />
              </span>
              <span className="inline-flex items-center gap-2 bg-black/50 px-3 py-2 rounded border border-neutral-700 text-gray-300 font-mono">
                  🏆 Tournoi: 
                  <input 
                      value={data?.tournamentRank || '1/2'} 
                      onChange={(e) => handleChange([playerKey, 'tournamentRank'], e.target.value)}
                      className="bg-transparent w-16 text-white outline-none font-bold text-center"
                  />
              </span>
            </div>
          </div>
      </div>

      {/* ONGLETS */}
      <div className="flex border-b border-neutral-800 bg-black/40 overflow-x-auto scrollbar-none flex-shrink-0">
          {['PROFIL', 'STATS', 'PSYCHO', 'CALENDRIER', 'H2H', 'ENJEUX'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-shrink-0 py-3 px-4 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors ${activeTab === tab ? `text-white border-b-2 ${playerKey === 'p1' ? 'border-blue-500' : 'border-orange-500'} bg-white/10` : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* CONTENU */}
      <div className="p-4 space-y-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-neutral-700 bg-neutral-950">
          
          {/* ONGLET PROFIL */}
          {activeTab === 'PROFIL' && (
            <>
              <div className="space-y-2">
                <div className={`text-sm font-bold uppercase flex items-center gap-2 ${playerKey === 'p1' ? 'text-blue-400' : 'text-orange-400'}`}><User size={16}/> Profil</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'Meilleur Class.', k: 'bestRank'},
                        {l: 'Main / Style', k: 'hand'},
                        {l: 'Âge / Taille', k: 'ageHeight'},
                        {l: 'Nationalité', k: 'nationality'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-sm">
                            <div className="bg-neutral-900/50 p-3 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-3 outline-none w-full font-mono"/>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-bold text-yellow-400 uppercase flex items-center gap-2"><Zap size={16}/> Condition</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'Forme (1-10)', k: 'form'},
                        {l: 'Blessures', k: 'injury'},
                        {l: 'Match Veille', k: 'previousMatch'},
                        {l: 'Fatigue', k: 'fatigue'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-sm">
                            <div className="bg-neutral-900/50 p-3 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-3 outline-none w-full font-mono"/>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-bold text-purple-400 uppercase flex items-center gap-2"><Activity size={16}/> vs Main</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'vs Droitières', k: 'vsRightHanded'},
                        {l: 'vs Gauchers', k: 'vsLeftHanded'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-sm">
                            <div className="bg-neutral-900/50 p-3 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-3 outline-none w-full font-mono"/>
                        </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* ONGLET STATS */}
          {activeTab === 'STATS' && (
              <div className="space-y-3">
                 <div className="space-y-2">
                    <div className="text-sm font-bold text-green-400 uppercase flex items-center gap-2"><TrendingUp size={16}/> Stats Clés</div>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="bg-green-900/20 border border-green-500/50 p-3 rounded flex justify-between items-center">
                            <span className="text-green-400 font-bold text-sm">HOLD % 🔑</span>
                            <input value={data?.holdPercent || '82%'} onChange={(e) => handleChange([playerKey, 'holdPercent'], e.target.value)} className="bg-transparent text-right w-20 outline-none text-white font-bold text-lg"/>
                        </div>
                        <div className="bg-red-900/20 border border-red-500/50 p-3 rounded flex justify-between items-center">
                            <span className="text-red-400 font-bold text-sm">BREAK % 🔑</span>
                            <input value={data?.breakPercent || '42%'} onChange={(e) => handleChange([playerKey, 'breakPercent'], e.target.value)} className="bg-transparent text-right w-20 outline-none text-white font-bold text-lg"/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-sm font-bold text-blue-400 uppercase flex items-center gap-2"><Star size={16}/> Tendance & Sets</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-sm bg-black/40">
                        {[
                            {l: 'Tendance +10', k: 'trend'},
                            {l: 'Moyenne sets', k: 'avgSets'},
                            {l: 'TB %', k: 'tbPercent'},
                            {l: '1er Set %', k: 'firstSetWin'}
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 p-3">
                                <span className="text-gray-400 font-semibold">{row.l}</span>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono text-sm"/>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-sm font-bold text-cyan-400 uppercase">🌤️ Impact Conditions</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-sm bg-black/40 grid grid-cols-2">
                        <div className="border-b border-r border-neutral-800 p-3">
                            <span className="text-gray-400 text-sm block">Vent Impact</span>
                            <input value={data?.windImpact || '+8%'} onChange={(e) => handleChange([playerKey, 'windImpact'], e.target.value)} className="bg-transparent text-white outline-none w-full font-bold text-lg mt-2"/>
                        </div>
                        <div className="border-b border-neutral-800 p-3">
                            <span className="text-gray-400 text-sm block">Froid Impact</span>
                            <input value={data?.coldImpact || '-10%'} onChange={(e) => handleChange([playerKey, 'coldImpact'], e.target.value)} className="bg-transparent text-white outline-none w-full font-bold text-lg mt-2"/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-sm font-bold text-yellow-500 uppercase">💰 Paris</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-sm bg-black/40 grid grid-cols-2">
                        {[
                            {l: 'Over 21.5 J.', k: 'over21_5'},
                            {l: 'Over 2.5 S.', k: 'over2_5'},
                            {l: 'Over Aces', k: 'overAces'},
                            {l: 'Under Aces', k: 'underAces'}
                        ].map((row, i) => (
                            <div key={i} className={`${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''} border-neutral-800 p-3`}>
                                <span className="text-gray-400 text-sm block">{row.l}</span>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white outline-none w-full font-bold text-lg mt-2"/>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
          )}

          {/* ONGLET PSYCHO */}
          {activeTab === 'PSYCHO' && (
              <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-purple-400 uppercase flex gap-2"><Activity size={16}/> Comportement</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-sm bg-black/40">
                        {[
                            {l: 'Après Défaite', k: 'afterLoss'},
                            {l: 'Après Victoire', k: 'afterWin'},
                            {l: 'Relâchement?', k: 'relaxation'},
                            {l: 'Gestion Pression', k: 'pressureHandling'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-3 text-gray-400 font-semibold border-r border-neutral-800 text-sm">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-3 outline-none w-full text-sm"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-bold text-orange-400 uppercase flex gap-2"><Trophy size={16}/> Tournois Majeurs</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-sm bg-black/40">
                        {[
                            {l: 'Grand Slams', k: 'grandSlams'},
                            {l: 'WTA 1000', k: 'wta1000'},
                            {l: 'Challengers', k: 'challengers'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-3 text-gray-400 font-semibold border-r border-neutral-800 text-sm">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-3 outline-none w-full text-sm"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-bold text-red-400 uppercase flex gap-2"><AlertCircle size={16}/> Favori vs Outsider</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-sm bg-black/40">
                        {[
                            {l: 'Quand FAVORI', k: 'asFavorite'},
                            {l: 'Quand OUTSIDER', k: 'asOutsider'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-3 text-gray-400 font-semibold border-r border-neutral-800 text-sm">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-3 outline-none w-full text-sm"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-bold text-green-400 uppercase flex gap-2"><Star size={16}/> Joueur Similaire</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-sm bg-black/40">
                        {[
                            {l: 'Joueur', k: 'similarPlayer'},
                            {l: 'Score', k: 'similarScore'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-3 text-gray-400 font-semibold border-r border-neutral-800 text-sm">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-3 outline-none w-full text-sm"/>
                            </div>
                        ))}
                    </div>
                  </div>
              </div>
          )}

          {/* ONGLET CALENDRIER */}
          {activeTab === 'CALENDRIER' && (
              <div className="space-y-2">
                  <div className="text-sm font-bold text-white uppercase flex gap-2"><Calendar size={16}/> Calendrier</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-sm bg-black/40">
                      <div className="grid grid-cols-[80px_1fr_80px] bg-neutral-900 p-3 font-bold text-gray-400 border-b border-neutral-700 text-sm">
                          <span>Date</span><span>Tournoi</span><span>Prio</span>
                      </div>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="grid grid-cols-[80px_1fr_80px] p-3 hover:bg-white/5 border-b border-neutral-800 text-gray-300">
                            <input value={data?.[`match${i}_date`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_date`], e.target.value)} placeholder="JJ.MM" className="bg-transparent outline-none text-sm"/>
                            <input value={data?.[`match${i}_tournament`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_tournament`], e.target.value)} placeholder="Tournoi" className="bg-transparent outline-none text-sm px-2"/>
                            <input value={data?.[`match${i}_priority`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_priority`], e.target.value)} placeholder="Priorité" className="bg-transparent outline-none text-right text-sm"/>
                        </div>
                      ))}
                  </div>
                  <div className="text-sm text-gray-400 bg-blue-900/10 border border-blue-500/20 p-3 rounded">
                    <strong>⭐ Prochain important?</strong>
                    <input value={data?.nextMatchPriority || ''} onChange={(e) => handleChange([playerKey, 'nextMatchPriority'], e.target.value)} className="bg-transparent w-full outline-none mt-2 text-sm text-white"/>
                  </div>
              </div>
          )}

          {/* ONGLET H2H */}
          {activeTab === 'H2H' && (
              <div className="space-y-2">
                  <div className="text-sm font-bold text-orange-500 uppercase flex gap-2"><MapPin size={16}/> H2H</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-sm bg-black/40">
                      {[
                          {l: 'Affrontés', k: 'h2hMeetings'},
                          {l: 'Score', k: 'global'},
                          {l: 'Surface', k: 'h2hSurface'},
                          {l: 'Dernière vic', k: 'h2hLastWin'},
                          {l: 'Sets moyens', k: 'h2hAvgSets'},
                          {l: 'TB H2H', k: 'h2hTB'},
                          {l: 'Hold % H2H', k: 'h2hHold'},
                          {l: 'Break % H2H', k: 'h2hBreak'},
                      ].map((row, i) => (
                          <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 p-3">
                              <span className="text-gray-400 font-semibold text-sm">{row.l}</span>
                              <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono text-sm"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}
          
          {/* ONGLET ENJEUX */}
          {activeTab === 'ENJEUX' && (
              <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-green-400 uppercase flex gap-2"><Target size={16}/> Enjeux</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-sm bg-black/40">
                        {[
                            {l: 'Enjeu Tournoi', k: 'stake'},
                            {l: 'Points WTA/ATP', k: 'points'},
                            {l: 'Objectif Class.', k: 'objective'},
                            {l: 'Motivation (1-10)', k: 'motivation'},
                            {l: 'Pression', k: 'pressureLevel'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-3 text-gray-400 font-semibold border-r border-neutral-800 text-sm">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-3 outline-none w-full text-sm"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-bold text-blue-400 uppercase flex gap-2"><List size={16}/> Actualités</div>
                    <textarea 
                      value={data?.news || ''} 
                      onChange={(e) => handleChange([playerKey, 'news'], e.target.value)}
                      placeholder="Actualités..."
                      className="w-full h-24 bg-black/40 border border-neutral-700 rounded p-3 text-sm text-gray-300 outline-none focus:border-orange-500/50 resize-none"
                    />
                  </div>
              </div>
          )}

      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 overflow-hidden">
      
      {/* 1. MATCH HEADER - TERRAIN/DATE/HEURE/MÉTÉO */}
      <div className="bg-gradient-to-br from-neutral-900 to-black border-b-2 border-orange-500/40 p-6 flex-shrink-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_160px] gap-6">
            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-base font-bold text-orange-500 uppercase tracking-widest border border-orange-500/40 px-4 py-2 rounded-full bg-orange-500/10">
                    <Trophy size={18}/> {report.identity.tournament || 'UNKNOWN'} | {report.identity.surface || 'DUR'}
                </div>
                
                <div className="text-4xl font-black flex items-center gap-4">
                    <span className="text-blue-500">{report.identity.p1Name}</span>
                    <span className="text-gray-600 text-2xl font-normal">vs</span>
                    <span className="text-orange-500">{report.identity.p2Name}</span>
                </div>

                <div className="flex flex-wrap gap-3 text-base">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/10">
                        <Calendar size={16} className="text-gray-400"/> 
                        <input 
                          value={report.identity.date || '03.12.2025'} 
                          onChange={(e) => handleChange(['identity', 'date'], e.target.value)} 
                          className="bg-transparent w-28 outline-none font-mono text-base"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/10">
                        <Clock size={16} className="text-gray-400"/> 
                        <input 
                          value={(report.identity as any).time || '16:40'} 
                          onChange={(e) => handleChange(['identity', 'time'], e.target.value)} 
                          className="bg-transparent w-20 outline-none font-mono text-base"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/10">
                        <MapPin size={16} className="text-gray-400"/> 
                        <input 
                          value={(report.identity as any).court || 'Court Central'} 
                          onChange={(e) => handleChange(['identity', 'court'], e.target.value)} 
                          className="bg-transparent w-32 outline-none font-mono text-base"
                        />
                    </div>
                </div>
            </div>

            {/* Météo Card */}
            <div className="bg-black/40 border border-neutral-700 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Thermometer size={16}/> <span className="text-base">Temp</span>
                  </div>
                  <input 
                    value={report.conditions.temp || '14°C'} 
                    onChange={(e) => handleChange(['conditions', 'temp'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-base"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Wind size={16}/> <span className="text-base">Vent</span>
                  </div>
                  <input 
                    value={report.conditions.wind || '12 km/h Nord'} 
                    onChange={(e) => handleChange(['conditions', 'wind'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-base"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Droplets size={16}/> <span className="text-base">Humidité</span>
                  </div>
                  <input 
                    value={report.conditions.humidity || '68%'} 
                    onChange={(e) => handleChange(['conditions', 'humidity'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-base"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Eye size={16}/> <span className="text-base">Météo</span>
                  </div>
                  <input 
                    value={report.conditions.weather || 'Bonne'} 
                    onChange={(e) => handleChange(['conditions', 'weather'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-base"
                  />
                </div>
            </div>

            {/* STATUS MATCH */}
            <div className="bg-green-900/20 border border-green-500/40 rounded-lg p-4 flex flex-col items-center justify-center h-full">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mb-2"></div>
              <span className="text-sm font-bold text-green-400 mb-2">EN COURS</span>
              <input 
                value={(report.identity as any).matchStatus || 'Set 1'} 
                onChange={(e) => handleChange(['identity', 'matchStatus'], e.target.value)} 
                className="bg-transparent text-green-300 outline-none text-sm font-mono text-center w-full"
              />
            </div>
          </div>
      </div>

      {/* 2. JOUEURS - GRILLE PRINCIPALE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">
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
  );
};
