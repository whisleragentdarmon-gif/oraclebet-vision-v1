import React, { useState } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Trophy, Calendar, Activity, User, Globe, Clock, MapPin, Star, List, Wind, Thermometer, Droplets, Eye, TrendingUp, Zap, Target, AlertCircle } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTableComplete: React.FC<Props> = ({ report, onUpdate }) => {
  
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

  // --- SOUS-COMPOSANT : FICHE JOUEUR COMPLÈTE ---
  const PlayerCard = ({ 
    playerKey, name, data, activeTab, setActiveTab, colorClass, opponentName 
  }: { 
    playerKey: 'p1' | 'p2', name: string, data: any, activeTab: string, setActiveTab: (t: any) => void, colorClass: string, opponentName: string 
  }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      
      {/* EN-TÊTE JOUEUR */}
      <div className="bg-neutral-950 p-4 border-b border-neutral-800">
          <div>
            <div className={`text-lg font-black uppercase flex items-center gap-2 ${colorClass}`}>
                <span className="text-2xl">●</span> 
                <input 
                  value={name} 
                  onChange={(e) => handleChange([playerKey, 'name'], e.target.value)}
                  className="bg-transparent outline-none font-black uppercase"
                />
            </div>
            <div className="flex gap-2 mt-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1 bg-black/50 px-2 py-1 rounded border border-neutral-700 text-gray-300 font-mono">
                  <Trophy size={11} className={colorClass}/> RANG: 
                  <input 
                      value={data.rank || '0'} 
                      onChange={(e) => handleChange([playerKey, 'rank'], e.target.value)}
                      className="bg-transparent w-10 text-white outline-none font-bold text-center"
                  />
              </span>
              <span className="inline-flex items-center gap-1 bg-black/50 px-2 py-1 rounded border border-neutral-700 text-gray-300 font-mono">
                  🏆 Tournoi: 
                  <input 
                      value={data.tournamentRank || '1/2'} 
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
                className={`flex-shrink-0 py-2 px-3 text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 transition-colors ${activeTab === tab ? `text-white border-b-2 ${playerKey === 'p1' ? 'border-blue-500' : 'border-orange-500'} bg-white/10` : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* CONTENU */}
      <div className="p-4 space-y-3 overflow-y-auto h-[700px] scrollbar-thin scrollbar-thumb-neutral-700 bg-neutral-950">
          
          {/* ONGLET PROFIL */}
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
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-[10px]">
                            <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono"/>
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
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-[10px]">
                            <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono"/>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-purple-400 uppercase flex items-center gap-1"><Activity size={13}/> Performance vs Main</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'vs Droitières', k: 'vsRightHanded'},
                        {l: 'vs Gauchers', k: 'vsLeftHanded'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 text-[10px]">
                            <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono"/>
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
                    <div className="text-xs font-bold text-green-400 uppercase flex items-center gap-1"><TrendingUp size={13}/> Stats Clés</div>
                    <div className="grid grid-cols-1 gap-2 text-[10px]">
                        <div className="bg-green-900/15 border border-green-500/40 p-2 rounded flex justify-between items-center">
                            <span className="text-green-400 font-bold">HOLD % 🔑</span>
                            <input value={data.holdPercent || '82%'} onChange={(e) => handleChange([playerKey, 'holdPercent'], e.target.value)} className="bg-transparent text-right w-16 outline-none text-white font-bold"/>
                        </div>
                        <div className="bg-red-900/15 border border-red-500/40 p-2 rounded flex justify-between items-center">
                            <span className="text-red-400 font-bold">BREAK % 🔑</span>
                            <input value={data.breakPercent || '42%'} onChange={(e) => handleChange([playerKey, 'breakPercent'], e.target.value)} className="bg-transparent text-right w-16 outline-none text-white font-bold"/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1"><Star size={13}/> Tendance & Sets</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px] bg-black/40">
                        {[
                            {l: 'Tendance +10 matchs', k: 'trend'},
                            {l: 'Moyenne sets', k: 'avgSets'},
                            {l: 'TB Gagnés %', k: 'tbPercent'},
                            {l: '1er Set Win %', k: 'firstSetWin'}
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 p-2">
                                <span className="text-gray-400 font-semibold">{row.l}</span>
                                <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono"/>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-xs font-bold text-cyan-400 uppercase">🌤️ Impact Conditions</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px] bg-black/40 grid grid-cols-2">
                        <div className="border-b border-r border-neutral-800 p-2">
                            <span className="text-gray-400 text-[9px] block">Vent Impact</span>
                            <input value={data.windImpact || '+8%'} onChange={(e) => handleChange([playerKey, 'windImpact'], e.target.value)} className="bg-transparent text-white outline-none w-full font-bold text-sm"/>
                        </div>
                        <div className="border-b border-neutral-800 p-2">
                            <span className="text-gray-400 text-[9px] block">Froid Impact</span>
                            <input value={data.coldImpact || '-10%'} onChange={(e) => handleChange([playerKey, 'coldImpact'], e.target.value)} className="bg-transparent text-white outline-none w-full font-bold text-sm"/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-xs font-bold text-yellow-500 uppercase">💰 Paris Populaires</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px] bg-black/40 grid grid-cols-2">
                        {[
                            {l: 'Over 21.5 J.', k: 'over21_5'},
                            {l: 'Over 2.5 S.', k: 'over2_5'},
                            {l: 'Over Aces', k: 'overAces'},
                            {l: 'Under Aces', k: 'underAces'}
                        ].map((row, i) => (
                            <div key={i} className={`${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''} border-neutral-800 p-2`}>
                                <span className="text-gray-400 text-[9px] block">{row.l}</span>
                                <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white outline-none w-full font-bold text-sm"/>
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
                    <div className="text-xs font-bold text-purple-400 uppercase flex gap-1"><Activity size={13}/> Comportement</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px] bg-black/40">
                        {[
                            {l: 'Après Défaite', k: 'afterLoss'},
                            {l: 'Après Victoire', k: 'afterWin'},
                            {l: 'Relâchement?', k: 'relaxation'},
                            {l: 'Gestion Pression', k: 'pressureHandling'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full text-[9px]"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-orange-400 uppercase flex gap-1"><Trophy size={13}/> Tournois Majeurs</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px] bg-black/40">
                        {[
                            {l: 'Grand Slams', k: 'grandSlams'},
                            {l: 'WTA 1000', k: 'wta1000'},
                            {l: 'Challengers', k: 'challengers'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full text-[9px]"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-red-400 uppercase flex gap-1"><AlertCircle size={13}/> Favori vs Outsider</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px] bg-black/40">
                        {[
                            {l: 'Quand FAVORI', k: 'asFavorite'},
                            {l: 'Quand OUTSIDER', k: 'asOutsider'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full text-[9px]"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-green-400 uppercase flex gap-1"><Star size={13}/> Joueur Similaire Battu</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px] bg-black/40">
                        {[
                            {l: 'Joueur Similaire', k: 'similarPlayer'},
                            {l: 'Classement vs', k: 'similarClassement'},
                            {l: 'Score Victoire', k: 'similarScore'},
                            {l: 'Conditions', k: 'similarConditions'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800 text-[9px]">{row.l}</div>
                                <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full text-[9px]"/>
                            </div>
                        ))}
                    </div>
                  </div>
              </div>
          )}

          {/* ONGLET CALENDRIER */}
          {activeTab === 'CALENDRIER' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-white uppercase flex gap-1"><Calendar size={13}/> Calendrier Prochain</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-[9px] bg-black/40">
                      <div className="grid grid-cols-[60px_1fr_60px] bg-neutral-900 p-2 font-bold text-gray-400 border-b border-neutral-700">
                          <span>Date</span><span>Tournoi</span><span>Priorité</span>
                      </div>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="grid grid-cols-[60px_1fr_60px] p-1 hover:bg-white/5 border-b border-neutral-800 text-gray-300">
                            <input value={data[`match${i}_date`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_date`], e.target.value)} placeholder="JJ.MM" className="bg-transparent outline-none text-[9px]"/>
                            <input value={data[`match${i}_tournament`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_tournament`], e.target.value)} placeholder="Tournoi" className="bg-transparent outline-none text-[9px] px-1"/>
                            <input value={data[`match${i}_priority`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_priority`], e.target.value)} placeholder="Priorité" className="bg-transparent outline-none text-right text-[9px]"/>
                        </div>
                      ))}
                  </div>
                  <div className="text-[9px] text-gray-400 bg-blue-900/10 border border-blue-500/20 p-2 rounded">
                    <strong>⭐ Prochain match important?</strong>
                    <input value={data.nextMatchPriority || ''} onChange={(e) => handleChange([playerKey, 'nextMatchPriority'], e.target.value)} className="bg-transparent w-full outline-none mt-1 text-[9px] text-white"/>
                  </div>
              </div>
          )}

          {/* ONGLET H2H */}
          {activeTab === 'H2H' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-orange-500 uppercase flex gap-1"><MapPin size={13}/> H2H vs {opponentName}</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px] bg-black/40">
                      {[
                          {l: 'Ils se sont affrontés', k: 'h2hMeetings'},
                          {l: 'Score Global', k: 'h2hScore'},
                          {l: 'Surface Dur', k: 'h2hSurface'},
                          {l: 'Dernière vic', k: 'h2hLastWin'},
                          {l: 'Sets moyens', k: 'h2hAvgSets'},
                          {l: 'TB H2H', k: 'h2hTB'},
                          {l: 'Hold % H2H', k: 'h2hHold'},
                          {l: 'Break % H2H', k: 'h2hBreak'},
                      ].map((row, i) => (
                          <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 p-2">
                              <span className="text-gray-400 font-semibold">{row.l}</span>
                              <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono text-[9px]"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}
          
          {/* ONGLET ENJEUX */}
          {activeTab === 'ENJEUX' && (
              <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-green-400 uppercase flex gap-1"><Target size={13}/> Enjeux & Motivation</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px] bg-black/40">
                        {[
                            {l: 'Enjeu Tournoi', k: 'stake'},
                            {l: 'Points WTA/ATP', k: 'points'},
                            {l: 'Objectif Class.', k: 'objective'},
                            {l: 'Motivation (1-10)', k: 'motivation'},
                            {l: 'Pression', k: 'pressureLevel'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full text-[9px]"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-blue-400 uppercase flex gap-1"><List size={13}/> Actualités Récentes</div>
                    <textarea 
                      value={data.news || ''} 
                      onChange={(e) => handleChange([playerKey, 'news'], e.target.value)}
                      placeholder="Actualités, infos récentes..."
                      className="w-full h-20 bg-black/40 border border-neutral-700 rounded p-2 text-[9px] text-gray-300 outline-none focus:border-orange-500/50 resize-none"
                    />
                  </div>
              </div>
          )}

      </div>
    </div>
  );

  return (
    <div className="mt-6 space-y-6 font-sans text-white">
      
      {/* 1. MATCH HEADER - TERRAIN/DATE/HEURE/MÉTÉO */}
      <div className="bg-gradient-to-br from-neutral-900 to-black border-2 border-orange-500/40 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 shadow-2xl">
          <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 uppercase tracking-widest border border-orange-500/40 px-3 py-2 rounded-full bg-orange-500/10">
                  <Trophy size={16}/> {report.identity.tournament || 'UNKNOWN'} | {report.identity.surface || 'DUR'}
              </div>
              
              <div className="text-2xl lg:text-3xl font-black flex flex-col lg:flex-row items-center gap-2 lg:gap-4">
                  <input 
                    value={report.identity.p1Name} 
                    onChange={(e) => handleChange(['identity', 'p1Name'], e.target.value)} 
                    className="bg-transparent text-blue-500 outline-none flex-1 text-center lg:text-right font-black uppercase"
                  />
                  <span className="text-gray-600 text-lg font-normal">vs</span>
                  <input 
                    value={report.identity.p2Name} 
                    onChange={(e) => handleChange(['identity', 'p2Name'], e.target.value)} 
                    className="bg-transparent text-orange-500 outline-none flex-1 text-center lg:text-left font-black uppercase"
                  />
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded border border-white/10">
                      <Calendar size={14} className="text-gray-400"/> 
                      <input 
                        value={report.identity.date || '03.12.2025'} 
                        onChange={(e) => handleChange(['identity', 'date'], e.target.value)} 
                        className="bg-transparent w-24 outline-none font-mono text-sm"
                      />
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded border border-white/10">
                      <Clock size={14} className="text-gray-400"/> 
                      <input 
                        value={(report.identity as any).time || '16:40'} 
                        onChange={(e) => handleChange(['identity', 'time'], e.target.value)} 
                        className="bg-transparent w-16 outline-none font-mono text-sm"
                      />
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded border border-white/10">
                      <MapPin size={14} className="text-gray-400"/> 
                      <input 
                        value={(report.identity as any).court || 'Court Central'} 
                        onChange={(e) => handleChange(['identity', 'court'], e.target.value)} 
                        className="bg-transparent w-28 outline-none font-mono text-sm"
                      />
                  </div>
              </div>
          </div>

          {/* Météo Card */}
          <div className="bg-black/40 border border-neutral-700 rounded-lg p-4 grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Thermometer size={14}/> <span className="text-[11px]">Temp</span>
                </div>
                <input 
                  value={report.conditions.temp || '14°C'} 
                  onChange={(e) => handleChange(['conditions', 'temp'], e.target.value)} 
                  className="bg-transparent text-white font-bold outline-none w-full text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Wind size={14}/> <span className="text-[11px]">Vent</span>
                </div>
                <input 
                  value={report.conditions.wind || '12 km/h Nord'} 
                  onChange={(e) => handleChange(['conditions', 'wind'], e.target.value)} 
                  className="bg-transparent text-white font-bold outline-none w-full text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Droplets size={14}/> <span className="text-[11px]">Humidité</span>
                </div>
                <input 
                  value={report.conditions.humidity || '68%'} 
                  onChange={(e) => handleChange(['conditions', 'humidity'], e.target.value)} 
                  className="bg-transparent text-white font-bold outline-none w-full text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Eye size={14}/> <span className="text-[11px]">Météo</span>
                </div>
                <input 
                  value={report.conditions.weather || 'Bonne'} 
                  onChange={(e) => handleChange(['conditions', 'weather'], e.target.value)} 
                  className="bg-transparent text-white font-bold outline-none w-full text-sm"
                />
              </div>
          </div>
      </div>

      {/* 2. STATUS MATCH */}
      <div className="bg-green-900/20 border border-green-500/40 rounded-lg p-3 flex items-center gap-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-bold text-green-400">EN COURS</span>
        <input 
          value={(report.identity as any).matchStatus || 'Set 1 - 3-2'} 
          onChange={(e) => handleChange(['identity', 'matchStatus'], e.target.value)} 
          className="bg-transparent text-green-300 outline-none flex-1 text-sm font-mono"
        />
      </div>

      {/* 3. JOUEURS */}
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

      {/* 4. COTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="text-xs font-bold text-blue-400 uppercase mb-3 border-b border-neutral-800 pb-2">💰 Cotes {report.identity.p1Name}</div>
            <div className="space-y-2 text-[11px]">
                {['BET365', 'BETMGM', 'BWIN', 'UNIBET'].map((book) => (
                  <div key={book} className="flex justify-between items-center">
                    <span className="text-gray-400">{book}:</span>
                    <input 
                      value={report.p1?.[`${book.toLowerCase()}_cote`] || '1.80'} 
                      onChange={(e) => handleChange(['p1', `${book.toLowerCase()}_cote`], e.target.value)} 
                      className="bg-transparent text-white outline-none w-16 text-right font-mono font-bold"
                    />
                  </div>
                ))}
            </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="text-xs font-bold text-orange-400 uppercase mb-3 border-b border-neutral-800 pb-2">💰 Cotes {report.identity.p2Name}</div>
            <div className="space-y-2 text-[11px]">
                {['BET365', 'BETMGM', 'BWIN', 'UNIBET'].map((book) => (
                  <div key={book} className="flex justify-between items-center">
                    <span className="text-gray-400">{book}:</span>
                    <input 
                      value={report.p2?.[`${book.toLowerCase()}_cote`] || '2.00'} 
                      onChange={(e) => handleChange(['p2', `${book.toLowerCase()}_cote`], e.target.value)} 
                      className="bg-transparent text-white outline-none w-16 text-right font-mono font-bold"
                    />
                  </div>
                ))}
            </div>
        </div>
      </div>

      {/* 5. H2H GLOBAL */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="text-xs font-bold text-purple-500 uppercase mb-4 border-b border-neutral-800 pb-2">⚔️ Résumé H2H Complet</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center mb-4">
              <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-2">Score Global</div>
                  <input 
                    value={report.h2h.global || '12-3'} 
                    onChange={(e) => handleChange(['h2h', 'global'], e.target.value)}
                    className="text-2xl font-black text-white bg-transparent text-center w-full outline-none"
                  />
              </div>
              <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-2">Surface</div>
                  <input 
                    value={report.h2h.surface || '5-1'} 
                    onChange={(e) => handleChange(['h2h', 'surface'], e.target.value)}
                    className="text-2xl font-black text-white bg-transparent text-center w-full outline-none"
                  />
              </div>
              <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-2">TB</div>
                  <input 
                    value={report.h2h.tb || '9-1'} 
                    onChange={(e) => handleChange(['h2h', 'tb'], e.target.value)}
                    className="text-2xl font-black text-white bg-transparent text-center w-full outline-none"
                  />
              </div>
              <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-2">Tendance</div>
                  <input 
                    value={report.h2h.trend || 'K gagne 4/4'} 
                    onChange={(e) => handleChange(['h2h', 'trend'], e.target.value)}
                    className="text-lg font-black text-white bg-transparent text-center w-full outline-none"
                  />
              </div>
          </div>
          <div className="bg-black/30 p-3 rounded text-xs text-gray-400">
              <div className="font-bold text-white mb-2">📋 Derniers Matchs (Scores Exacts + Dates):</div>
              <textarea 
                value={report.h2h.lastMatches || ''} 
                onChange={(e) => handleChange(['h2h', 'lastMatches'], e.target.value)}
                className="w-full h-16 bg-black/20 border border-neutral-700 rounded p-2 text-[10px] outline-none focus:border-orange-500/50 resize-none"
              />
          </div>
      </div>

      {/* 6. BOUTON SAVE */}
      <div className="text-center">
         <button className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-8 py-3 rounded-lg shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2 mx-auto">
            <Save size={18}/> SAUVEGARDER FICHE COMPLÈTE
         </button>
      </div>

    </div>
  );
};
