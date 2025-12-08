'use client';
import React, { useState, useRef } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Trophy, Calendar, Activity, User, Globe, Clock, MapPin, Star, List, Wind, Thermometer, Droplets, Eye, TrendingUp, Zap, Target, AlertCircle } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
  onSave?: () => void;
}

// --- SOUS-COMPOSANT : CARTE JOUEUR ---
const PlayerCard = ({ 
    playerKey, 
    name, 
    data, 
    colorClass, 
    onChange,
    opponentName 
  }: { 
    playerKey: 'p1' | 'p2', 
    name: string, 
    data: any, 
    colorClass: string, 
    onChange: (path: string[], value: string) => void,
    opponentName: string 
  }) => {

    // L'état de l'onglet actif est géré localement dans chaque carte
    const [activeTab, setActiveTab] = useState('PROFIL');
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-full shadow-lg transition-all duration-300">
      
      {/* HEADER JOUEUR */}
      <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex-shrink-0">
          <div>
            <div className={`text-xl font-bold uppercase flex items-center gap-2 ${colorClass}`}>
                <span className="text-2xl">●</span> 
                <span className="truncate max-w-[200px]" title={name}>{name}</span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1 bg-black/50 px-3 py-2 rounded border border-neutral-700 text-gray-300 font-mono">
                  <Trophy size={13} className={colorClass}/> RANG: 
                  <input 
                      value={data?.rank || ''} 
                      onChange={(e) => onChange([playerKey, 'rank'], e.target.value)}
                      className="bg-transparent w-12 text-white outline-none font-bold text-center"
                      placeholder="?"
                  />
              </span>
              <span className="inline-flex items-center gap-1 bg-black/50 px-3 py-2 rounded border border-neutral-700 text-gray-300 font-mono">
                  🏆 Tournoi: 
                  <input 
                      value={data?.tournamentRank || ''} 
                      onChange={(e) => onChange([playerKey, 'tournamentRank'], e.target.value)}
                      className="bg-transparent w-14 text-white outline-none font-bold text-center"
                      placeholder="1/2"
                  />
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-900/30 px-3 py-2 rounded border border-blue-500/40 text-blue-300 font-mono font-bold">
                  💰 Cote: 
                  <input 
                      value={data?.oddsPlayer || ''} 
                      onChange={(e) => onChange([playerKey, 'oddsPlayer'], e.target.value)}
                      className="bg-transparent w-16 text-white outline-none font-bold text-center"
                      placeholder="1.95"
                  />
              </span>
            </div>
          </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-neutral-800 bg-black/40 overflow-x-auto scrollbar-none flex-shrink-0">
          {['PROFIL', 'STATS', 'PSYCHO', 'CALENDRIER', 'H2H', 'ENJEUX', 'MATCHS', 'TERRAIN', 'BILAN', 'TITRES', 'BLESSURES', 'TENDANCE'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 py-2 px-3 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors ${activeTab === tab ? `text-white border-b-2 ${playerKey === 'p1' ? 'border-blue-500' : 'border-orange-500'} bg-white/10` : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* CONTENU SCROLLABLE */}
      <div ref={scrollRef} className="p-4 space-y-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-neutral-700 bg-neutral-950 min-h-0">
          
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
                            <input value={data?.[row.k] || ''} onChange={(e) => onChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono text-xs"/>
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
                            <input value={data?.[row.k] || ''} onChange={(e) => onChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono text-xs"/>
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
                            <input value={data?.holdPercent || ''} onChange={(e) => onChange([playerKey, 'holdPercent'], e.target.value)} className="bg-transparent text-right w-14 outline-none text-white font-bold text-sm"/>
                        </div>
                        <div className="bg-red-900/15 border border-red-500/40 p-2 rounded flex justify-between items-center">
                            <span className="text-red-400 font-bold text-xs">BREAK %</span>
                            <input value={data?.breakPercent || ''} onChange={(e) => onChange([playerKey, 'breakPercent'], e.target.value)} className="bg-transparent text-right w-14 outline-none text-white font-bold text-sm"/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1"><Star size={13}/> Tendance & Sets</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/40">
                        {[
                            {l: 'Tendance +10', k: 'trend'},
                            {l: 'Moyenne sets', k: 'avgSets'},
                            {l: 'TB %', k: 'tbPercent'},
                            {l: '1er Set %', k: 'firstSetWin'}
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 p-2">
                                <span className="text-gray-400 font-semibold text-xs">{row.l}</span>
                                <input value={data?.[row.k] || ''} onChange={(e) => onChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono text-xs"/>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
          )}

          {activeTab === 'PSYCHO' && (
              <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-purple-400 uppercase flex gap-1"><Activity size={13}/> Comportement</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/40">
                        {[
                            {l: 'Après Défaite', k: 'afterLoss'},
                            {l: 'Après Victoire', k: 'afterWin'},
                            {l: 'Relâchement?', k: 'relaxation'},
                            {l: 'Gestion Pression', k: 'pressureHandling'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => onChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full text-xs"/>
                            </div>
                        ))}
                    </div>
                  </div>
              </div>
          )}

          {activeTab === 'CALENDRIER' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-white uppercase flex gap-1"><Calendar size={13}/> Calendrier</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/40">
                      <div className="grid grid-cols-[70px_1fr_60px] bg-neutral-900 p-2 font-bold text-gray-400 border-b border-neutral-700 text-xs">
                          <span>Date</span><span>Tournoi</span><span>Prio</span>
                      </div>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="grid grid-cols-[70px_1fr_60px] p-2 hover:bg-white/5 border-b border-neutral-800 text-gray-300">
                            <input value={data?.[`match${i}_date`] || ''} onChange={(e) => onChange([playerKey, `match${i}_date`], e.target.value)} placeholder="JJ.MM" className="bg-transparent outline-none text-xs"/>
                            <input value={data?.[`match${i}_tournament`] || ''} onChange={(e) => onChange([playerKey, `match${i}_tournament`], e.target.value)} placeholder="Tournoi" className="bg-transparent outline-none text-xs px-1"/>
                            <input value={data?.[`match${i}_priority`] || ''} onChange={(e) => onChange([playerKey, `match${i}_priority`], e.target.value)} placeholder="✓" className="bg-transparent outline-none text-right text-xs"/>
                        </div>
                      ))}
                  </div>
              </div>
          )}

          {activeTab === 'H2H' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-orange-500 uppercase flex gap-1"><MapPin size={13}/> H2H</div>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/40">
                      {[
                          {l: 'Affrontés', k: 'h2hMeetings'},
                          {l: 'Score', k: 'h2hGlobal'},
                          {l: 'Surface', k: 'h2hSurface'},
                          {l: 'Dernière vic', k: 'h2hLastWin'},
                      ].map((row, i) => (
                          <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0 p-2">
                              <span className="text-gray-400 font-semibold text-xs">{row.l}</span>
                              <input value={data?.[row.k] || ''} onChange={(e) => onChange([playerKey, row.k], e.target.value)} className="bg-transparent text-right outline-none text-white font-mono text-xs"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}
          
          {activeTab === 'ENJEUX' && (
              <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-green-400 uppercase flex gap-1"><Target size={13}/> Enjeux</div>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs bg-black/40">
                        {[
                            {l: 'Enjeu Tournoi', k: 'stake'},
                            {l: 'Points WTA', k: 'points'},
                            {l: 'Motivation', k: 'motivation'},
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-[40%_60%] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-900/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data?.[row.k] || ''} onChange={(e) => onChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full text-xs"/>
                            </div>
                        ))}
                    </div>
                  </div>
              </div>
          )}

          {activeTab === 'MATCHS' && (
              <div className="space-y-2">
                  <div className="text-xs font-bold text-green-500 uppercase">🎾 100 Matchs</div>
                  <div className="border border-neutral-700 rounded-lg bg-black/40 max-h-96 overflow-y-auto">
                      {Array.from({length: 100}).map((_, i) => (
                          <div key={i} className="grid grid-cols-[60px_70px_50px_70px_50px] p-1 border-b border-neutral-800 gap-1 hover:bg-white/5 text-xs">
                              <input value={data?.[`match${i+1}_date`] || ''} onChange={(e) => onChange([playerKey, `match${i+1}_date`], e.target.value)} placeholder="JJ.MM" className="bg-transparent outline-none text-gray-300"/>
                              <input value={data?.[`match${i+1}_opponent`] || ''} onChange={(e) => onChange([playerKey, `match${i+1}_opponent`], e.target.value)} placeholder="Opp" className="bg-transparent outline-none text-gray-300"/>
                              <input value={data?.[`match${i+1}_score`] || ''} onChange={(e) => onChange([playerKey, `match${i+1}_score`], e.target.value)} placeholder="2-0" className="bg-transparent outline-none text-gray-300 text-center font-mono"/>
                              <input value={data?.[`match${i+1}_tournament`] || ''} onChange={(e) => onChange([playerKey, `match${i+1}_tournament`], e.target.value)} placeholder="Tour" className="bg-transparent outline-none text-gray-300"/>
                              <input value={data?.[`match${i+1}_time`] || ''} onChange={(e) => onChange([playerKey, `match${i+1}_time`], e.target.value)} placeholder="HH:MM" className="bg-transparent outline-none text-gray-300"/>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {activeTab === 'TERRAIN' && (
              <div className="space-y-2">
                  {['Dur', 'Argile', 'Herbe'].map((s) => (
                      <div key={s}>
                          <div className="text-xs font-bold text-orange-500 uppercase mb-1">🏟️ {s}</div>
                          <div className="border border-neutral-700 rounded-lg bg-black/40 max-h-32 overflow-y-auto">
                              {Array.from({length: 30}).map((_, i) => (
                                  <div key={i} className="grid grid-cols-[60px_70px_50px_40px] p-1 border-b border-neutral-800 gap-1 hover:bg-white/5 text-xs">
                                      <input value={data?.[`${s.toLowerCase()}Match${i+1}_date`] || ''} onChange={(e) => onChange([playerKey, `${s.toLowerCase()}Match${i+1}_date`], e.target.value)} placeholder="JJ.MM" className="bg-transparent outline-none"/>
                                      <input value={data?.[`${s.toLowerCase()}Match${i+1}_opponent`] || ''} onChange={(e) => onChange([playerKey, `${s.toLowerCase()}Match${i+1}_opponent`], e.target.value)} placeholder="Opp" className="bg-transparent outline-none"/>
                                      <input value={data?.[`${s.toLowerCase()}Match${i+1}_score`] || ''} onChange={(e) => onChange([playerKey, `${s.toLowerCase()}Match${i+1}_score`], e.target.value)} placeholder="6-4" className="bg-transparent outline-none"/>
                                      <select value={data?.[`${s.toLowerCase()}Match${i+1}_result`] || 'W'} onChange={(e) => onChange([playerKey, `${s.toLowerCase()}Match${i+1}_result`], e.target.value)} className="bg-black/40 border border-neutral-700 rounded px-1">
                                          <option>W</option><option>L</option>
                                      </select>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          )}

      </div>
    </div>
  );
};


// --- COMPOSANT PRINCIPAL GOD MODE TABLE ---
export const GodModeTable: React.FC<Props> = ({ report, onUpdate, onSave }) => {
  
  // Fonction de mise à jour sécurisée (Deep Copy)
  const handleChange = (path: string[], value: string) => {
    // 1. On clone proprement l'objet
    const newReport = JSON.parse(JSON.stringify(report));
    
    // 2. On parcourt le chemin
    let current: any = newReport;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    
    // 3. On assigne la valeur
    current[path[path.length - 1]] = value;
    
    // 4. On remonte au parent
    onUpdate(newReport);
  };

  // Clé unique pour forcer le rafraichissement quand on change de match
  const matchKey = report.identity.matchId || `match-${Date.now()}`;

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 overflow-hidden">
      
      {/* HEADER GLOBAL */}
      <div className="bg-gradient-to-br from-neutral-900 to-black border-b-2 border-orange-500/40 p-5 flex-shrink-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_140px] gap-4">
            <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 uppercase tracking-widest border border-orange-500/40 px-3 py-1 rounded-full bg-orange-500/10">
                    <Trophy size={14}/> {report.identity.tournament || 'UNKNOWN'} | {report.identity.surface || 'DUR'}
                </div>
                
                <div className="text-3xl font-black flex items-center gap-3">
                    <span className="text-blue-500">{report.identity.p1Name}</span>
                    <span className="text-gray-600 text-lg font-normal">vs</span>
                    <span className="text-orange-500">{report.identity.p2Name}</span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded border border-white/10">
                        <Calendar size={13} className="text-gray-400"/> 
                        <input 
                          value={report.identity.date || ''} 
                          onChange={(e) => handleChange(['identity', 'date'], e.target.value)} 
                          className="bg-transparent w-20 outline-none font-mono text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded border border-white/10">
                        <Clock size={13} className="text-gray-400"/> 
                        <input 
                          value={(report.identity as any).time || ''} 
                          onChange={(e) => handleChange(['identity', 'time'], e.target.value)} 
                          className="bg-transparent w-14 outline-none font-mono text-xs"
                        />
                    </div>
                </div>
            </div>

            {/* CONDITIONS MÉTÉO (Éditable) */}
            <div className="bg-black/40 border border-neutral-700 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Thermometer size={12}/> <span className="text-xs">Temp</span>
                  </div>
                  <input 
                    value={report.conditions.temp || ''} 
                    onChange={(e) => handleChange(['conditions', 'temp'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Wind size={12}/> <span className="text-xs">Vent</span>
                  </div>
                  <input 
                    value={report.conditions.wind || ''} 
                    onChange={(e) => handleChange(['conditions', 'wind'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Droplets size={12}/> <span className="text-xs">Humidité</span>
                  </div>
                  <input 
                    value={report.conditions.humidity || ''} 
                    onChange={(e) => handleChange(['conditions', 'humidity'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Eye size={12}/> <span className="text-xs">Météo</span>
                  </div>
                  <input 
                    value={report.conditions.weather || ''} 
                    onChange={(e) => handleChange(['conditions', 'weather'], e.target.value)} 
                    className="bg-transparent text-white font-bold outline-none w-full text-xs"
                  />
                </div>
            </div>

            {/* BOUTON SAUVEGARDE */}
            <div className="bg-green-900/20 border border-green-500/40 rounded-lg p-3 flex flex-col items-center justify-center h-full gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-green-400">EN COURS</span>
              <button 
                type="button"
                onClick={onSave}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded flex items-center gap-1 transition-colors"
              >
                <Save size={12}/> ENREGISTRER
              </button>
            </div>
          </div>
      </div>

      {/* ZONE PRINCIPALE - DOUBLE CARTE JOUEUR */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 overflow-hidden">
          <PlayerCard 
            key={`p1-${matchKey}`}
            playerKey="p1" 
            name={report.identity.p1Name} 
            data={report.p1} 
            colorClass="text-blue-500"
            onChange={handleChange}
            opponentName={report.identity.p2Name}
          />
          <PlayerCard 
            key={`p2-${matchKey}`}
            playerKey="p2" 
            name={report.identity.p2Name} 
            data={report.p2} 
            colorClass="text-orange-500"
            onChange={handleChange}
            opponentName={report.identity.p1Name}
          />
      </div>

    </div>
  );
};
