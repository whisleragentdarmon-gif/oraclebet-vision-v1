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

  // --- SOUS-COMPOSANT : FICHE JOUEUR COMPLÈTE AGRANDIE ---
  const PlayerCard = ({ 
    playerKey, name, data, activeTab, setActiveTab, colorClass, opponentName 
  }: { 
    playerKey: 'p1' | 'p2', name: string, data: any, activeTab: string, setActiveTab: (t: any) => void, colorClass: string, opponentName: string 
  }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      
      {/* EN-TÊTE JOUEUR */}
      <div className="bg-neutral-950 p-6 border-b-2 border-neutral-800 flex-shrink-0">
          <div>
            <div className={`text-3xl font-black uppercase flex items-center gap-3 ${colorClass}`}>
                <span className="text-5xl">●</span> 
                <span>{name}</span>
            </div>
            <div className="flex gap-3 mt-4 flex-wrap text-base">
              <span className="inline-flex items-center gap-2 bg-black/50 px-4 py-3 rounded border border-neutral-700 text-gray-300 font-mono">
                  <Trophy size={18} className={colorClass}/> RANG: 
                  <input 
                      value={data?.rank || '0'} 
                      onChange={(e) => handleChange([playerKey, 'rank'], e.target.value)}
                      className="bg-transparent w-20 text-white outline-none font-bold text-center text-lg"
                  />
              </span>
              <span className="inline-flex items-center gap-2 bg-black/50 px-4 py-3 rounded border border-neutral-700 text-gray-300 font-mono">
                  🏆 Tournoi: 
                  <input 
                      value={data?.tournamentRank || '1/2'} 
                      onChange={(e) => handleChange([playerKey, 'tournamentRank'], e.target.value)}
                      className="bg-transparent w-20 text-white outline-none font-bold text-center text-lg"
                  />
              </span>
            </div>
          </div>
      </div>

      {/* ONGLETS */}
      <div className="flex border-b-2 border-neutral-800 bg-black/40 overflow-x-auto scrollbar-none flex-shrink-0">
          {['PROFIL', 'STATS', 'PSYCHO', 'CALENDRIER', 'H2H', 'ENJEUX'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-shrink-0 py-4 px-5 text-sm font-bold uppercase tracking-wider hover:bg-white/5 transition-colors ${activeTab === tab ? `text-white border-b-2 ${playerKey === 'p1' ? 'border-blue-500' : 'border-orange-500'} bg-white/10` : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* CONTENU */}
      <div className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-neutral-700 bg-neutral-950">
          
          {/* ONGLET PROFIL */}
          {activeTab === 'PROFIL' && (
            <>
              <div className="space-y-3">
                <div className={`text-lg font-bold uppercase flex items-center gap-2 ${playerKey === 'p1' ? 'text-blue-400' : 'text-orange-400'}`}><User size={20}/> Profil</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'Meilleur Class.', k: 'bestRank'},
                        {l: 'Main / Style', k: 'hand'},
                        {l: 'Âge / Taille', k: 'ageHeight'},
                        {l: 'Nationalité', k: 'nationality'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[35%_65%] border-b border-neutral-800 last:border-0 text-base">
                            <div className="bg-neutral-900/50 p-4 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-4 outline-none w-full font-mono text-lg"/>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-lg font-bold text-yellow-400 uppercase flex items-center gap-2"><Zap size={20}/> Condition</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'Forme (1-10)', k: 'form'},
                        {l: 'Blessures', k: 'injury'},
                        {l: 'Match Veille', k: 'previousMatch'},
                        {l: 'Fatigue', k: 'fatigue'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[35%_65%] border-b border-neutral-800 last:border-0 text-base">
                            <div className="bg-neutral-900/50 p-4 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-4 outline-none w-full font-mono text-lg"/>
                        </div>
                    ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-lg font-bold text-purple-400 uppercase flex items-center gap-2"><Activity size={20}/> vs Main</div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40">
                    {[
                        {l: 'vs Droitières', k: 'vsRightHanded'},
                        {l: 'vs Gauchers', k: 'vsLeftHanded'}
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-[35%_65%] border-b border-neutral-800 last:border-0 text-base">
                            <div className="bg-neutral-900/50 p-4 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                            <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-4 outline-none w-full font-mono text-lg"/>
                        </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* ONGLET STATS */}
          {activeTab === 'STATS' && (
              <div className="space-y-5">
                 <div className="space-y-3">
                    <div className="text-lg font-bold text-green-400 uppercase flex items-center gap-2"><TrendingUp size={20}/> Stats Clés</div>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-green-900/25 border-2 border-green-500/60 p-5 rounded flex justify-between items-center">
                            <span className="text-green-400 font-bold text-lg">HOLD % 🔑</span>
                            <input value={data?.holdPercent || '82%'} onChange={(e) => handleChange([playerKey, 'holdPercent'], e.target.value)} className="bg-transparent text-right w-24 outline-none text-white font-bold text-2xl"/>
                        </div>
                        <div className="bg-red-900/25 border-2 border-red-500/60 p-5 rounded flex justify-between items-center">
                            <span className="text-red-400 font-bold text-lg">BREAK % 🔑</span>
                            <input value={data?.breakPercent || '42%'} onChange={(e) => handleChange([playerKey, 'breakPercent'], e.target.value)} className="bg-transparent text-right w-24 outline-none text-white font-bold text-2xl"/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="text-lg font-bold text-blue-400 uppercase flex items-center gap-2"><Star size={20}/> Tendance & Sets</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-base bg-black/40">
                        {[
                            {l: 'Tendance +10', k: 'trend'},
                            {l: 'Moyenne sets', k: 'avgSets'},
                            {l: 'TB %', k: 'tbPercent'},
                            {l: '1er Set %', k: 'firstSetWin'}
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[35%_65%] border-b border-neutral-800 last:border-0 p-4">
                                <span className="text-gray-400 font-semibold">{row.l}</span>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono text-lg"/>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="text-lg font-bold text-cyan-400 uppercase">🌤️ Impact Conditions</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-base bg-black/40 grid grid-cols-2">
                        <div className="border-b-2 border-r-2 border-neutral-800 p-5">
                            <span className="text-gray-400 text-base block font-semibold">Vent Impact</span>
                            <input value={data?.windImpact || '+8%'} onChange={(e) => handleChange([playerKey, 'windImpact'], e.target.value)} className="bg-transparent text-white outline-none w-full font-bold text-2xl mt-3"/>
                        </div>
                        <div className="border-b-2 border-neutral-800 p-5">
                            <span className="text-gray-400 text-base block font-semibold">Froid Impact</span>
                            <input value={data?.coldImpact || '-10%'} onChange={(e) => handleChange([playerKey, 'coldImpact'], e.target.value)} className="bg-transparent text-white outline-none w-full font-bold text-2xl mt-3"/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="text-lg font-bold text-yellow-500 uppercase">💰 Paris</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-base bg-black/40 grid grid-cols-2">
                        {[
                            {l: 'Over 21.5 J.', k: 'over21_5'},
                            {l: 'Over 2.5 S.', k: 'over2_5'},
                            {l: 'Over Aces', k: 'overAces'},
                            {l: 'Under Aces', k: 'underAces'}
                        ].map((row, i) => (
                            <div key={i} className={`${i % 2 === 0 ? 'border-r-2' : ''} ${i < 2 ? 'border-b-2' : ''} border-neutral-800 p-5`}>
                                <span className="text-gray-400 text-base block font-semibold">{row.l}</span>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white outline-none w-full font-bold text-2xl mt-3"/>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
          )}

          {/* ONGLET PSYCHO */}
          {activeTab === 'PSYCHO' && (
              <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="text-lg font-bold text-purple-400 uppercase flex gap-2"><Activity size={20}/> Comportement</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-base bg-black/40">
                        {[
                            {l: 'Après Défaite', k: 'afterLoss'},
                            {l: 'Après Victoire', k: 'afterWin'},
                            {l: 'Relâchement?', k: 'relaxation'},
                            {l: 'Gestion Pression', k: 'pressureHandling'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[35%_65%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-4 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-4 outline-none w-full text-base"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-lg font-bold text-orange-400 uppercase flex gap-2"><Trophy size={20}/> Tournois Majeurs</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-base bg-black/40">
                        {[
                            {l: 'Grand Slams', k: 'grandSlams'},
                            {l: 'WTA 1000', k: 'wta1000'},
                            {l: 'Challengers', k: 'challengers'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[35%_65%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-4 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-4 outline-none w-full text-base"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-lg font-bold text-red-400 uppercase flex gap-2"><AlertCircle size={20}/> Favori vs Outsider</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-base bg-black/40">
                        {[
                            {l: 'Quand FAVORI', k: 'asFavorite'},
                            {l: 'Quand OUTSIDER', k: 'asOutsider'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[35%_65%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-4 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-4 outline-none w-full text-base"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-lg font-bold text-green-400 uppercase flex gap-2"><Star size={20}/> Joueur Similaire</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-base bg-black/40">
                        {[
                            {l: 'Joueur', k: 'similarPlayer'},
                            {l: 'Score', k: 'similarScore'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[35%_65%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-4 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-4 outline-none w-full text-base"/>
                            </div>
                        ))}
                    </div>
                  </div>
              </div>
          )}

          {/* ONGLET CALENDRIER */}
          {activeTab === 'CALENDRIER' && (
              <div className="space-y-3">
                  <div className="text-lg font-bold text-white uppercase flex gap-2"><Calendar size={20}/> Calendrier</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-base bg-black/40">
                      <div className="grid grid-cols-[100px_1fr_100px] bg-neutral-900 p-4 font-bold text-gray-400 border-b-2 border-neutral-700 text-base">
                          <span>Date</span><span>Tournoi</span><span>Prio</span>
                      </div>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="grid grid-cols-[100px_1fr_100px] p-4 hover:bg-white/5 border-b border-neutral-800 text-gray-300">
                            <input value={data?.[`match${i}_date`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_date`], e.target.value)} placeholder="JJ.MM" className="bg-transparent outline-none text-lg"/>
                            <input value={data?.[`match${i}_tournament`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_tournament`], e.target.value)} placeholder="Tournoi" className="bg-transparent outline-none text-lg px-4"/>
                            <input value={data?.[`match${i}_priority`] || ''} onChange={(e) => handleChange([playerKey, `match${i}_priority`], e.target.value)} placeholder="Priorité" className="bg-transparent outline-none text-right text-lg"/>
                        </div>
                      ))}
                  </div>
                  <div className="text-base text-gray-400 bg-blue-900/15 border-2 border-blue-500/30 p-4 rounded">
                    <strong className="text-blue-300">⭐ Prochain important?</strong>
                    <input value={data?.nextMatchPriority || ''} onChange={(e) => handleChange([playerKey, 'nextMatchPriority'], e.target.value)} className="bg-transparent w-full outline-none mt-3 text-lg text-white font-semibold"/>
                  </div>
              </div>
          )}

          {/* ONGLET H2H */}
          {activeTab === 'H2H' && (
              <div className="space-y-3">
                  <div className="text-lg font-bold text-orange-500 uppercase flex gap-2"><MapPin size={20}/> H2H</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-base bg-black/40">
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
                          <div key={i} className="grid grid-cols-[35%_65%] border-b border-neutral-800 last:border-0 p-4">
                              <span className="text-gray-400 font-semibold">{row.l}</span>
                              <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono text-lg"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}
          
          {/* ONGLET ENJEUX */}
          {activeTab === 'ENJEUX' && (
              <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="text-lg font-bold text-green-400 uppercase flex gap-2"><Target size={20}/> Enjeux</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-base bg-black/40">
                        {[
                            {l: 'Enjeu Tournoi', k: 'stake'},
                            {l: 'Points WTA/ATP', k: 'points'},
                            {l: 'Objectif Class.', k: 'objective'},
                            {l: 'Motivation (1-10)', k: 'motivation'},
                            {l: 'Pression', k: 'pressureLevel'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[35%_65%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-4 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-4 outline-none w-full text-base"/>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-lg font-bold text-blue-400 uppercase flex gap-2"><List size={20}/> Actualités</div>
                    <textarea 
                      value={data?.news || ''} 
                      onChange={(e) => handleChange([playerKey, 'news'], e.target.value)}
                      placeholder="Actualités..."
                      className="w-full h-32 bg-black/40 border-2 border-neutral-700 rounded p-4 text-lg text-gray-300 outline-none focus:border-orange-500/50 resize-none"
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
      <div className="bg-gradient-to-br from-neutral-900 to-black border-b-3 border-orange-500/50 p-8 flex-shrink-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_180px] gap-8">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-3 text-lg font-bold text-orange-500 uppercase tracking-widest border border-orange-500/50 px-5 py-3 rounded-full bg-orange-500/15">
                    <Trophy size={20}/> {report.identity.tournament || 'UNKNOWN'} | {report.identity.surface || 'DUR'}
                </div>
                
                <div className="text-5xl font-black flex items-center gap-5">
                    <span className="text-blue-500">{report.identity.p1Name}</span>
                    <span className="text-gray-600 text-3xl font-normal">vs</span>
                    <span className="text-orange-500">{report.identity.p2Name}</span>
                </div>

                <div className="flex flex-wrap gap-4 text-lg">
                    <div className="flex items-center gap-2 bg-white/5 px-5 py-3 rounded border border-white/10">
                        <Calendar size={18} className="text-gray-400"/> 
                        <input 
                          value={report.identity.date || '03.12.2025'} 
                          onChange={(e) => handleChange(['identity', 'date'], e.target.value)} 
                          className="bg-transparent w-32 outline-none font-mono text-lg"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-5 py-3 rounded border border-white/10">
                        <Clock size={18} className="text-gray-400"/> 
                        <input 
                          value={(report.identity as any).time || '16:40'} 
                          onChange={(e) => handleChange(['identity', 'time'], e.target.value)} 
                          className="bg-transparent w-24 outline-none font-mono text-lg"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-5 py-3 rounded border border-white/10">
                        <MapPin size={18} className="text-gray-400"/> 
                        <input 
                          value={(report.identity as any).court || 'Court Central'} 
                          onChange={(e) => handleChange(['identity', 'court'], e.target.value)} 
                          className="bg-transparent w-40 outline-none font-mono text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Météo Card */}
            <div className="bg-black/50 border-2 border-neutral-700 rounded-lg p-5 grid grid-cols-2 gap-5 text-lg">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Thermometer size={18}/> <span className="text-lg font-semibold">Temp</span>
                  </div>
                  <input 
                    value={report.conditions.temp || '14°C'} 
                    onChange={(e) => handleChange(['conditions', 'temp'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-2xl"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Wind size={18}/> <span className="text-lg font-semibold">Vent</span>
                  </div>
                  <input 
                    value={report.conditions.wind || '12 km/h Nord'} 
                    onChange={(e) => handleChange(['conditions', 'wind'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-2xl"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Droplets size={18}/> <span className="text-lg font-semibold">Humidité</span>
                  </div>
                  <input 
                    value={report.conditions.humidity || '68%'} 
                    onChange={(e) => handleChange(['conditions', 'humidity'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-2xl"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Eye size={18}/> <span className="text-lg font-semibold">Météo</span>
                  </div>
                  <input 
                    value={report.conditions.weather || 'Bonne'} 
                    onChange={(e) => handleChange(['conditions', 'weather'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-2xl"
                  />
                </div>
            </div>

            {/* STATUS MATCH */}
            <div className="bg-green-900/30 border-2 border-green-500/60 rounded-lg p-5 flex flex-col items-center justify-center h-full">
              <div className="w-5 h-5 bg-green-500 rounded-full animate-pulse mb-3"></div>
              <span className="text-base font-bold text-green-400 mb-3">EN COURS</span>
              <input 
                value={(report.identity as any).matchStatus || 'Set 1'} 
                onChange={(e) => handleChange(['identity', 'matchStatus'], e.target.value)} 
                className="bg-transparent text-green-300 outline-none text-lg font-mono text-center w-full font-bold"
              />
            </div>
          </div>
      </div>

      {/* 2. JOUEURS - GRILLE PRINCIPALE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 p-5 overflow-hidden">
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
