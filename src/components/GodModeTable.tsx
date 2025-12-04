'use client';
import React, { useState } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Trophy, Calendar, Activity, User, Clock, MapPin, TrendingUp, Zap, Target, AlertCircle, Zap as Heart, Flame } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate }) => {
  
  const [tabP1, setTabP1] = useState<'PROFIL' | 'STATS' | 'PSYCHO' | 'CALENDRIER' | 'H2H' | 'ENJEUX' | 'MATCHS' | 'TERRAIN' | 'BILAN' | 'TITRES' | 'BLESSURES' | 'TENDANCE'>('PROFIL');
  const [tabP2, setTabP2] = useState<'PROFIL' | 'STATS' | 'PSYCHO' | 'CALENDRIER' | 'H2H' | 'ENJEUX' | 'MATCHS' | 'TERRAIN' | 'BILAN' | 'TITRES' | 'BLESSURES' | 'TENDANCE'>('PROFIL');

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

  const TABS = ['PROFIL', 'STATS', 'PSYCHO', 'CALENDRIER', 'H2H', 'ENJEUX', 'MATCHS', 'TERRAIN', 'BILAN', 'TITRES', 'BLESSURES', 'TENDANCE'];

  const PlayerCard = ({ 
    playerKey, name, data, activeTab, setActiveTab, colorClass
  }: { 
    playerKey: 'p1' | 'p2', name: string, data: any, activeTab: string, setActiveTab: (t: any) => void, colorClass: string
  }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-full shadow-lg">
      
      <div className="bg-neutral-950 p-3 border-b border-neutral-800 flex-shrink-0">
          <div className={`text-lg font-bold uppercase flex items-center gap-2 ${colorClass}`}>
              <span className="text-xl">●</span> 
              <span>{name}</span>
              <span className="inline-flex items-center gap-1 bg-blue-900/30 px-2 py-1 rounded border border-blue-500/40 text-blue-300 font-mono text-xs ml-auto">
                  💰 {data?.oddsPlayer || '1.95'}
              </span>
          </div>
      </div>

      <div className="flex border-b border-neutral-800 bg-black/40 overflow-x-auto scrollbar-none flex-shrink-0">
          {TABS.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-shrink-0 py-2 px-2 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors ${activeTab === tab ? `text-white border-b-2 ${playerKey === 'p1' ? 'border-blue-500' : 'border-orange-500'} bg-white/10` : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div className="p-3 space-y-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-neutral-700 bg-neutral-950 text-xs">
          
          {/* ONGLET MATCHS - 100 derniers */}
          {activeTab === 'MATCHS' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-green-500 uppercase">🎾 Derniers 100 Matchs</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-[70px_80px_60px_80px_60px] bg-neutral-900 p-2 font-bold text-gray-400 border-b border-neutral-700 gap-1 sticky top-0 text-xs">
                          <span>Date</span><span>Adversaire</span><span>Score</span><span>Tournoi</span><span>Heure</span>
                      </div>
                      {Array.from({length: 100}).map((_, i) => (
                          <div key={i} className="grid grid-cols-[70px_80px_60px_80px_60px] p-1 border-b border-neutral-800 gap-1 hover:bg-white/5">
                              <input value={data?.[`match${i+1}_date`] || ''} onChange={(e) => handleChange([playerKey, `match${i+1}_date`], e.target.value)} placeholder="JJ.MM.AA" className="bg-transparent outline-none text-xs font-mono text-gray-300"/>
                              <input value={data?.[`match${i+1}_opponent`] || ''} onChange={(e) => handleChange([playerKey, `match${i+1}_opponent`], e.target.value)} placeholder="Joueur" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`match${i+1}_score`] || ''} onChange={(e) => handleChange([playerKey, `match${i+1}_score`], e.target.value)} placeholder="2-0" className="bg-transparent outline-none text-xs font-mono text-gray-300"/>
                              <input value={data?.[`match${i+1}_tournament`] || ''} onChange={(e) => handleChange([playerKey, `match${i+1}_tournament`], e.target.value)} placeholder="Tournoi" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`match${i+1}_time`] || ''} onChange={(e) => handleChange([playerKey, `match${i+1}_time`], e.target.value)} placeholder="14:00" className="bg-transparent outline-none text-xs font-mono text-gray-300"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* ONGLET TERRAIN */}
          {activeTab === 'TERRAIN' && (
              <div className="space-y-2">
                  {['Dur', 'Argile', 'Herbe'].map((surface) => (
                      <div key={surface}>
                          <div className="text-xs font-bold text-orange-500 uppercase mb-1">🏟️ {surface}</div>
                          <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40 max-h-40 overflow-y-auto">
                              <div className="grid grid-cols-[70px_80px_60px_50px] bg-neutral-900 p-1 font-bold text-gray-400 border-b border-neutral-700 gap-1 sticky top-0 text-xs">
                                  <span>Date</span><span>Adversaire</span><span>Score</span><span>W/L</span>
                              </div>
                              {Array.from({length: 30}).map((_, i) => (
                                  <div key={i} className="grid grid-cols-[70px_80px_60px_50px] p-1 border-b border-neutral-800 gap-1 hover:bg-white/5">
                                      <input value={data?.[`${surface.toLowerCase()}Match${i+1}_date`] || ''} onChange={(e) => handleChange([playerKey, `${surface.toLowerCase()}Match${i+1}_date`], e.target.value)} placeholder="JJ.MM" className="bg-transparent outline-none text-xs text-gray-300"/>
                                      <input value={data?.[`${surface.toLowerCase()}Match${i+1}_opponent`] || ''} onChange={(e) => handleChange([playerKey, `${surface.toLowerCase()}Match${i+1}_opponent`], e.target.value)} placeholder="Opp" className="bg-transparent outline-none text-xs text-gray-300"/>
                                      <input value={data?.[`${surface.toLowerCase()}Match${i+1}_score`] || ''} onChange={(e) => handleChange([playerKey, `${surface.toLowerCase()}Match${i+1}_score`], e.target.value)} placeholder="6-4" className="bg-transparent outline-none text-xs text-gray-300"/>
                                      <select value={data?.[`${surface.toLowerCase()}Match${i+1}_result`] || 'W'} onChange={(e) => handleChange([playerKey, `${surface.toLowerCase()}Match${i+1}_result`], e.target.value)} className="bg-black/40 outline-none text-xs text-gray-300 border border-neutral-700 rounded px-1">
                                          <option>W</option>
                                          <option>L</option>
                                      </select>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {/* ONGLET BILAN */}
          {activeTab === 'BILAN' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-blue-500 uppercase">📊 Bilan de Saison (20 ans)</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-[60px_60px_60px_60px_60px_60px_60px] bg-neutral-900 p-1 font-bold text-gray-400 border-b border-neutral-700 gap-1 sticky top-0 text-xs">
                          <span>Année</span><span>Rang</span><span>Titres</span><span>Total</span><span>Dur</span><span>Argile</span><span>Herbe</span>
                      </div>
                      {Array.from({length: 20}).map((_, i) => (
                          <div key={i} className="grid grid-cols-[60px_60px_60px_60px_60px_60px_60px] p-1 border-b border-neutral-800 gap-1 hover:bg-white/5">
                              <input value={data?.[`season${i+1}_year`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_year`], e.target.value)} placeholder="2024" className="bg-transparent outline-none text-xs text-gray-300" disabled/>
                              <input value={data?.[`season${i+1}_rank`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_rank`], e.target.value)} placeholder="1" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`season${i+1}_titles`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_titles`], e.target.value)} placeholder="3" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`season${i+1}_allMatches`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_allMatches`], e.target.value)} placeholder="75" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`season${i+1}_hardCourt`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_hardCourt`], e.target.value)} placeholder="40" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`season${i+1}_clay`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_clay`], e.target.value)} placeholder="20" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`season${i+1}_grass`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_grass`], e.target.value)} placeholder="15" className="bg-transparent outline-none text-xs text-gray-300"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* ONGLET TITRES */}
          {activeTab === 'TITRES' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-yellow-500 uppercase">🏆 Tournois Gagnés</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-[120px_60px_80px_100px] bg-neutral-900 p-1 font-bold text-gray-400 border-b border-neutral-700 gap-1 sticky top-0 text-xs">
                          <span>Tournoi</span><span>Année</span><span>Surface</span><span>Gains</span>
                      </div>
                      {Array.from({length: 20}).map((_, i) => (
                          <div key={i} className="grid grid-cols-[120px_60px_80px_100px] p-1 border-b border-neutral-800 gap-1 hover:bg-white/5">
                              <input value={data?.[`title${i+1}_tournament`] || ''} onChange={(e) => handleChange([playerKey, `title${i+1}_tournament`], e.target.value)} placeholder="Tournoi" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`title${i+1}_year`] || ''} onChange={(e) => handleChange([playerKey, `title${i+1}_year`], e.target.value)} placeholder="2024" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`title${i+1}_surface`] || ''} onChange={(e) => handleChange([playerKey, `title${i+1}_surface`], e.target.value)} placeholder="Dur" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`title${i+1}_prize`] || ''} onChange={(e) => handleChange([playerKey, `title${i+1}_prize`], e.target.value)} placeholder="$2M" className="bg-transparent outline-none text-xs text-gray-300"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* ONGLET BLESSURES */}
          {activeTab === 'BLESSURES' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-red-500 uppercase">🏥 Antécédents Blessures</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden bg-black/40 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-[100px_100px_120px] bg-neutral-900 p-1 font-bold text-gray-400 border-b border-neutral-700 gap-1 sticky top-0 text-xs">
                          <span>Depuis</span><span>Jusqu'à</span><span>Blessure</span>
                      </div>
                      {Array.from({length: 10}).map((_, i) => (
                          <div key={i} className="grid grid-cols-[100px_100px_120px] p-1 border-b border-neutral-800 gap-1 hover:bg-white/5">
                              <input value={data?.[`injury${i+1}_since`] || ''} onChange={(e) => handleChange([playerKey, `injury${i+1}_since`], e.target.value)} placeholder="DD.MM.YYYY" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`injury${i+1}_until`] || ''} onChange={(e) => handleChange([playerKey, `injury${i+1}_until`], e.target.value)} placeholder="DD.MM.YYYY" className="bg-transparent outline-none text-xs text-gray-300"/>
                              <input value={data?.[`injury${i+1}_name`] || ''} onChange={(e) => handleChange([playerKey, `injury${i+1}_name`], e.target.value)} placeholder="Blessure" className="bg-transparent outline-none text-xs text-gray-300"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* ONGLET TENDANCE - 5 derniers matchs */}
          {activeTab === 'TENDANCE' && (
              <div className="space-y-4">
                  <div className="text-xs font-bold text-purple-500 uppercase">📈 Ratio 5 Derniers Matchs</div>
                  <div className="flex gap-2 justify-center">
                      {['match1', 'match2', 'match3', 'match4', 'match5'].map((m, i) => (
                          <select 
                              key={i}
                              value={data?.[`last5_${m}`] || 'W'} 
                              onChange={(e) => handleChange([playerKey, `last5_${m}`], e.target.value)}
                              className="bg-black/40 border border-neutral-700 rounded px-3 py-2 text-white font-bold outline-none text-sm hover:border-blue-500"
                          >
                              <option className="bg-neutral-900">W</option>
                              <option className="bg-neutral-900">L</option>
                          </select>
                      ))}
                  </div>
                  <div className="text-center">
                      <div className="text-xs text-gray-400 mt-2">
                          {data?.last5_match1 || 'W'}-{data?.last5_match2 || 'W'}-{data?.last5_match3 || 'W'}-{data?.last5_match4 || 'W'}-{data?.last5_match5 || 'W'}
                      </div>
                  </div>
              </div>
          )}

          {/* AUTRES ONGLETS (PROFIL, STATS, etc.) - Simplifié */}
          {(activeTab === 'PROFIL' || activeTab === 'STATS' || activeTab === 'PSYCHO' || activeTab === 'CALENDRIER' || activeTab === 'H2H' || activeTab === 'ENJEUX') && (
              <div className="text-center text-gray-400 py-4">
                  <span className="text-xs">Voir onglet complet pour {activeTab}</span>
              </div>
          )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 overflow-hidden">
      
      {/* HEADER MATCH */}
      <div className="bg-gradient-to-br from-neutral-900 to-black border-b-2 border-orange-500/40 p-4 flex-shrink-0">
          <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 uppercase tracking-widest border border-orange-500/40 px-3 py-1 rounded-full bg-orange-500/10">
                  <Trophy size={14}/> {report.identity.tournament} | {report.identity.tournamentLevel || 'ATP'} | {report.identity.surface}
              </div>
              
              <div className="text-2xl font-black flex items-center gap-2 flex-wrap">
                  <input 
                    value={report.identity.p1Name} 
                    onChange={(e) => handleChange(['identity', 'p1Name'], e.target.value)} 
                    className="bg-blue-900/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded font-bold outline-none focus:border-blue-400 text-lg"
                  />
                  <span className="text-gray-600 text-lg">vs</span>
                  <input 
                    value={report.identity.p2Name} 
                    onChange={(e) => handleChange(['identity', 'p2Name'], e.target.value)} 
                    className="bg-orange-900/20 border border-orange-500/40 text-orange-400 px-3 py-1 rounded font-bold outline-none focus:border-orange-400 text-lg"
                  />
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded border border-white/10">
                      <Calendar size={12}/> 
                      <input 
                        value={report.identity.date || '03.12.2025'} 
                        onChange={(e) => handleChange(['identity', 'date'], e.target.value)} 
                        className="bg-transparent w-20 outline-none font-mono text-xs"
                      />
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded border border-white/10">
                      <Clock size={12}/> 
                      <input 
                        value={(report.identity as any).time || '16:40'} 
                        onChange={(e) => handleChange(['identity', 'time'], e.target.value)} 
                        className="bg-transparent w-14 outline-none font-mono text-xs"
                      />
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded border border-white/10">
                      <MapPin size={12}/> 
                      <input 
                        value={(report.identity as any).court || 'Court'} 
                        onChange={(e) => handleChange(['identity', 'court'], e.target.value)} 
                        className="bg-transparent w-20 outline-none font-mono text-xs"
                      />
                  </div>
              </div>
          </div>
      </div>

      {/* JOUEURS */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 overflow-hidden">
          <PlayerCard 
            playerKey="p1" 
            name={report.identity.p1Name} 
            data={report.p1} 
            activeTab={tabP1} 
            setActiveTab={setTabP1}
            colorClass="text-blue-500"
          />
          <PlayerCard 
            playerKey="p2" 
            name={report.identity.p2Name} 
            data={report.p2} 
            activeTab={tabP2} 
            setActiveTab={setTabP2}
            colorClass="text-orange-500"
          />
      </div>

    </div>
  );
};
