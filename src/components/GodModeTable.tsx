'use client';
import React, { useState } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Trophy, Calendar, Activity, User, Clock, MapPin, TrendingUp, Zap, Target, AlertCircle, List, Wind, Thermometer, Droplets, Eye, Star } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate }) => {
  const [tabP1, setTabP1] = useState<'PROFIL' | 'STATS' | 'PSYCHO' | 'CALENDRIER' | 'H2H' | 'ENJEUX' | 'MATCHS' | 'TERRAIN' | 'BILAN' | 'TITRES' | 'BLESSURES' | 'TENDANCE'>('PROFIL');
  const [tabP2, setTabP2] = useState<'PROFIL' | 'STATS' | 'PSYCHO' | 'CALENDRIER' | 'H2H' | 'ENJEUX' | 'MATCHS' | 'TERRAIN' | 'BILAN' | 'TITRES' | 'BLESSURES' | 'TENDANCE'>('PROFIL');
  const [scrollPos, setScrollPos] = useState(0);

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
    playerKey, name, data, activeTab, setActiveTab, colorClass, opponentName 
  }: { 
    playerKey: 'p1' | 'p2', name: string, data: any, activeTab: string, setActiveTab: (t: any) => void, colorClass: string, opponentName: string 
  }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-full shadow-lg">
      <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex-shrink-0">
          <div className={`text-xl font-bold uppercase flex items-center gap-2 ${colorClass}`}>
              <span className="text-2xl">●</span> 
              <span>{name}</span>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1 bg-black/50 px-3 py-2 rounded border border-neutral-700 text-gray-300 font-mono">
                <Trophy size={13} className={colorClass}/> {data?.rank || '0'}
            </span>
            <span className="inline-flex items-center gap-1 bg-blue-900/30 px-3 py-2 rounded border border-blue-500/40 text-blue-300 font-mono font-bold">
                💰 {data?.oddsPlayer || '1.95'}
            </span>
          </div>
      </div>

      <div className="flex border-b border-neutral-800 bg-black/40 overflow-x-auto scrollbar-none flex-shrink-0">
          {['PROFIL', 'STATS', 'PSYCHO', 'CALENDRIER', 'H2H', 'ENJEUX', 'MATCHS', 'TERRAIN', 'BILAN', 'TITRES', 'BLESSURES', 'TENDANCE'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-shrink-0 py-2 px-2 text-xs font-bold uppercase ${activeTab === tab ? `text-white border-b-2 ${playerKey === 'p1' ? 'border-blue-500' : 'border-orange-500'}` : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div className="p-3 space-y-2 overflow-y-auto flex-1 bg-neutral-950 text-xs">
          
          {/* MATCHS - 100 avec scroll */}
          {activeTab === 'MATCHS' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-green-500">🎾 100 MATCHS</div>
                  <div className="border border-neutral-700 rounded bg-black/40 max-h-96 overflow-y-auto">
                      {Array.from({length: 100}).map((_, i) => (
                          <div key={i} className="grid grid-cols-[60px_70px_50px_60px_40px] p-1 border-b border-neutral-800 gap-1 hover:bg-white/5">
                              <input value={data?.[`match${i+1}_date`] || ''} onChange={(e) => handleChange([playerKey, `match${i+1}_date`], e.target.value)} placeholder="DD.MM" className="bg-transparent outline-none text-gray-300 border-b border-neutral-700 px-1"/>
                              <input value={data?.[`match${i+1}_opponent`] || ''} onChange={(e) => handleChange([playerKey, `match${i+1}_opponent`], e.target.value)} placeholder="Opp" className="bg-transparent outline-none text-gray-300"/>
                              <input value={data?.[`match${i+1}_score`] || ''} onChange={(e) => handleChange([playerKey, `match${i+1}_score`], e.target.value)} placeholder="2-0" className="bg-transparent outline-none text-gray-300 text-center font-mono"/>
                              <input value={data?.[`match${i+1}_tournament`] || ''} onChange={(e) => handleChange([playerKey, `match${i+1}_tournament`], e.target.value)} placeholder="Tournoi" className="bg-transparent outline-none text-gray-300"/>
                              <input value={data?.[`match${i+1}_time`] || ''} onChange={(e) => handleChange([playerKey, `match${i+1}_time`], e.target.value)} placeholder="HH:MM" className="bg-transparent outline-none text-gray-300"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* TERRAIN */}
          {activeTab === 'TERRAIN' && (
              <div className="space-y-2">
                  {['Dur', 'Argile', 'Herbe'].map((s) => (
                      <div key={s}>
                          <div className="text-xs font-bold text-orange-500 mb-1">🏟️ {s}</div>
                          <div className="border border-neutral-700 rounded bg-black/40 max-h-40 overflow-y-auto">
                              {Array.from({length: 20}).map((_, i) => (
                                  <div key={i} className="grid grid-cols-[60px_70px_50px_40px] p-1 border-b border-neutral-800 gap-1 text-xs">
                                      <input value={data?.[`${s.toLowerCase()}Match${i+1}_date`] || ''} onChange={(e) => handleChange([playerKey, `${s.toLowerCase()}Match${i+1}_date`], e.target.value)} placeholder="DD.MM" className="bg-transparent outline-none"/>
                                      <input value={data?.[`${s.toLowerCase()}Match${i+1}_opponent`] || ''} onChange={(e) => handleChange([playerKey, `${s.toLowerCase()}Match${i+1}_opponent`], e.target.value)} placeholder="Opp" className="bg-transparent outline-none"/>
                                      <input value={data?.[`${s.toLowerCase()}Match${i+1}_score`] || ''} onChange={(e) => handleChange([playerKey, `${s.toLowerCase()}Match${i+1}_score`], e.target.value)} placeholder="6-4" className="bg-transparent outline-none"/>
                                      <select value={data?.[`${s.toLowerCase()}Match${i+1}_result`] || 'W'} onChange={(e) => handleChange([playerKey, `${s.toLowerCase()}Match${i+1}_result`], e.target.value)} className="bg-black/40 border border-neutral-700 rounded px-1">
                                          <option>W</option><option>L</option>
                                      </select>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {/* BILAN */}
          {activeTab === 'BILAN' && (
              <div className="border border-neutral-700 rounded bg-black/40 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-[50px_50px_50px_50px_50px_50px_50px] bg-neutral-900 p-1 font-bold border-b gap-1 sticky top-0 text-xs">
                      <span>Année</span><span>Rang</span><span>Titres</span><span>Total</span><span>Dur</span><span>Argile</span><span>Herbe</span>
                  </div>
                  {Array.from({length: 20}).map((_, i) => (
                      <div key={i} className="grid grid-cols-[50px_50px_50px_50px_50px_50px_50px] p-1 border-b border-neutral-800 gap-1">
                          <input disabled value={data?.[`season${i+1}_year`] || 2025-i} className="bg-transparent text-right"/>
                          <input value={data?.[`season${i+1}_rank`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_rank`], e.target.value)} className="bg-transparent text-right"/>
                          <input value={data?.[`season${i+1}_titles`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_titles`], e.target.value)} className="bg-transparent text-right"/>
                          <input value={data?.[`season${i+1}_allMatches`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_allMatches`], e.target.value)} className="bg-transparent text-right"/>
                          <input value={data?.[`season${i+1}_hardCourt`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_hardCourt`], e.target.value)} className="bg-transparent text-right"/>
                          <input value={data?.[`season${i+1}_clay`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_clay`], e.target.value)} className="bg-transparent text-right"/>
                          <input value={data?.[`season${i+1}_grass`] || ''} onChange={(e) => handleChange([playerKey, `season${i+1}_grass`], e.target.value)} className="bg-transparent text-right"/>
                      </div>
                  ))}
              </div>
          )}

          {/* TITRES */}
          {activeTab === 'TITRES' && (
              <div className="border border-neutral-700 rounded bg-black/40 max-h-96 overflow-y-auto">
                  {Array.from({length: 20}).map((_, i) => (
                      <div key={i} className="grid grid-cols-[100px_50px_60px_80px] p-1 border-b border-neutral-800 gap-1">
                          <input value={data?.[`title${i+1}_tournament`] || ''} onChange={(e) => handleChange([playerKey, `title${i+1}_tournament`], e.target.value)} placeholder="Tournoi" className="bg-transparent outline-none text-xs"/>
                          <input value={data?.[`title${i+1}_year`] || ''} onChange={(e) => handleChange([playerKey, `title${i+1}_year`], e.target.value)} placeholder="2024" className="bg-transparent outline-none text-xs"/>
                          <input value={data?.[`title${i+1}_surface`] || ''} onChange={(e) => handleChange([playerKey, `title${i+1}_surface`], e.target.value)} placeholder="Dur" className="bg-transparent outline-none text-xs"/>
                          <input value={data?.[`title${i+1}_prize`] || ''} onChange={(e) => handleChange([playerKey, `title${i+1}_prize`], e.target.value)} placeholder="$" className="bg-transparent outline-none text-xs"/>
                      </div>
                  ))}
              </div>
          )}

          {/* BLESSURES */}
          {activeTab === 'BLESSURES' && (
              <div className="border border-neutral-700 rounded bg-black/40 max-h-96 overflow-y-auto">
                  {Array.from({length: 10}).map((_, i) => (
                      <div key={i} className="grid grid-cols-[90px_90px_100px] p-1 border-b border-neutral-800 gap-1 text-xs">
                          <input value={data?.[`injury${i+1}_since`] || ''} onChange={(e) => handleChange([playerKey, `injury${i+1}_since`], e.target.value)} placeholder="DD.MM" className="bg-transparent outline-none"/>
                          <input value={data?.[`injury${i+1}_until`] || ''} onChange={(e) => handleChange([playerKey, `injury${i+1}_until`], e.target.value)} placeholder="DD.MM" className="bg-transparent outline-none"/>
                          <input value={data?.[`injury${i+1}_name`] || ''} onChange={(e) => handleChange([playerKey, `injury${i+1}_name`], e.target.value)} placeholder="Type" className="bg-transparent outline-none"/>
                      </div>
                  ))}
              </div>
          )}

          {/* TENDANCE */}
          {activeTab === 'TENDANCE' && (
              <div className="space-y-3 text-center">
                  <div className="text-xs font-bold text-purple-500">📈 5 DERNIERS</div>
                  <div className="flex gap-2 justify-center">
                      {['match1', 'match2', 'match3', 'match4', 'match5'].map((m, i) => (
                          <select 
                              key={i}
                              value={data?.[`last5_${m}`] || 'W'} 
                              onChange={(e) => handleChange([playerKey, `last5_${m}`], e.target.value)}
                              className="bg-black/40 border border-neutral-700 rounded px-2 py-1 text-white font-bold text-sm"
                          >
                              <option>W</option>
                              <option>L</option>
                          </select>
                      ))}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                      {data?.last5_match1}-{data?.last5_match2}-{data?.last5_match3}-{data?.last5_match4}-{data?.last5_match5}
                  </div>
              </div>
          )}

          {/* AUTRES ONGLETS - VIDES POUR L'INSTANT */}
          {!['MATCHS', 'TERRAIN', 'BILAN', 'TITRES', 'BLESSURES', 'TENDANCE'].includes(activeTab) && (
              <div className="text-center text-gray-500 py-4">Voir GodModeTable ancien pour {activeTab}</div>
          )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 overflow-hidden">
      <div className="bg-gradient-to-br from-neutral-900 to-black border-b-2 border-orange-500/40 p-5 flex-shrink-0">
          <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 uppercase px-3 py-1 rounded-full bg-orange-500/10">
                  <Trophy size={14}/> {report.identity.tournament} | {(report.identity as any).level || 'ATP'} | {report.identity.surface}
              </div>
              <div className="text-2xl font-black flex items-center gap-3 flex-wrap">
                  <input 
                    value={report.identity.p1Name} 
                    onChange={(e) => handleChange(['identity', 'p1Name'], e.target.value)} 
                    className="bg-blue-900/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded font-bold outline-none"
                  />
                  <span className="text-gray-600">vs</span>
                  <input 
                    value={report.identity.p2Name} 
                    onChange={(e) => handleChange(['identity', 'p2Name'], e.target.value)} 
                    className="bg-orange-900/20 border border-orange-500/40 text-orange-400 px-3 py-1 rounded font-bold outline-none"
                  />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                  <input 
                    value={report.identity.date || ''} 
                    onChange={(e) => handleChange(['identity', 'date'], e.target.value)} 
                    className="bg-white/5 px-2 py-1 rounded outline-none"
                  />
                  <input 
                    value={(report.identity as any).time || ''} 
                    onChange={(e) => handleChange(['identity', 'time'], e.target.value)} 
                    className="bg-white/5 px-2 py-1 rounded outline-none"
                  />
              </div>
          </div>
      </div>

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
  );
};
