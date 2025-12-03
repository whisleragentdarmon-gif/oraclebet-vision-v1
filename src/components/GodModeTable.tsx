import React, { useState } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Trophy, Calendar, Activity, User, Globe, Clock, MapPin, Star, List } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate }) => {
  
  const [tabP1, setTabP1] = useState<'RESUME' | 'RESULTATS' | 'CALENDRIER'>('RESUME');
  const [tabP2, setTabP2] = useState<'RESUME' | 'RESULTATS' | 'CALENDRIER'>('RESUME');

  const handleChange = (path: string[], value: string) => {
    const newReport = { ...report };
    let current: any = newReport;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onUpdate(newReport);
  };

  // --- COMPOSANT INTERNE : FICHE JOUEUR ---
  const PlayerCard = ({ 
    playerKey, name, data, activeTab, setActiveTab, opponentName 
  }: { 
    playerKey: 'p1' | 'p2', name: string, data: any, activeTab: string, setActiveTab: (t: any) => void, opponentName: string
  }) => (
    <div className="bg-surface border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      
      {/* EN-TÊTE JOUEUR (DESIGN FLASHSCORE) */}
      <div className="bg-neutral-900 p-4 border-b border-neutral-800 relative">
        <div className="absolute right-0 top-0 text-neutral-800 opacity-10 p-2"><User size={80}/></div>
        <div className="relative z-10">
            <h3 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
                {playerKey === 'p1' ? <span className="text-blue-500">●</span> : <span className="text-orange-500">●</span>} 
                {name}
            </h3>
            <div className="flex flex-wrap gap-2 mt-2 text-[10px] font-bold text-gray-400 uppercase">
                <span className="bg-black/50 px-2 py-1 rounded border border-neutral-700 flex items-center gap-1"><Globe size={10}/> {data.nationality}</span>
                <span className="bg-black/50 px-2 py-1 rounded border border-neutral-700 flex items-center gap-1"><Trophy size={10}/> Rang: {data.rank}</span>
                <span className="bg-black/50 px-2 py-1 rounded border border-neutral-700">{data.ageHeight}</span>
            </div>
        </div>
      </div>

      {/* NAVIGATION ONGLETS */}
      <div className="flex border-b border-neutral-800 bg-black/20 text-[10px] font-bold uppercase">
          {['RESUME', 'RESULTATS', 'CALENDRIER'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 transition-all ${activeTab === tab ? 'text-white border-b-2 border-neon bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* CONTENU DYNAMIQUE */}
      <div className="p-4 space-y-6 overflow-y-auto h-[500px] scrollbar-thin scrollbar-thumb-neutral-700">
          
          {/* --- ONGLET 1 : RÉSUMÉ (PROFIL + MATCH DU JOUR + HISTORIQUE) --- */}
          {activeTab === 'RESUME' && (
              <>
                {/* INFO CLÉS */}
                <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-neon uppercase flex items-center gap-2"><User size={12}/> Profil & Palmarès</h4>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs">
                        {[
                            { l: 'Meilleur Class.', k: 'bestRank' },
                            { l: 'Main / Style', k: 'hand' }, // On combine pour gagner de la place
                            { l: 'Titres / Tournois', k: 'style' }, // Utilisation du champ style pour les titres
                        ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-[100px_1fr] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-800/50 p-2 text-gray-400 font-semibold border-r border-neutral-800">{row.l}</div>
                                <input value={data[row.k]} onChange={(e) => handleChange([playerKey, row.k], e.target.value)} className="bg-transparent text-white p-2 outline-none w-full font-mono focus:bg-white/5"/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MATCH DU JOUR */}
                <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-2"><Activity size={12}/> Match du Jour</h4>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs">
                        <div className="flex justify-between mb-1 text-gray-500 text-[10px] uppercase">
                            <span>{report.identity.tournament}</span>
                            <span className="text-green-500 font-bold">En cours</span>
                        </div>
                        <div className="flex justify-between font-bold text-white">
                            <span>{name}</span>
                            <span className="text-gray-600">vs</span>
                            <span>{opponentName}</span>
                        </div>
                    </div>
                </div>

                {/* HISTORIQUE SAISON (TABLEAU FLASHSCORE) */}
                <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-2"><List size={12}/> Historique Saison</h4>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px]">
                        <div className="grid grid-cols-4 bg-neutral-800 p-2 font-bold text-gray-400 border-b border-neutral-700 text-center">
                            <span>Année</span><span>W-L</span><span>Dur</span><span>Terre</span>
                        </div>
                        <div className="grid grid-cols-4 p-2 border-b border-neutral-800 text-center text-white items-center hover:bg-white/5">
                            <span className="font-bold">2025</span>
                            <input value={data.winrateSeason} onChange={(e) => handleChange([playerKey, 'winrateSeason'], e.target.value)} className="bg-transparent text-center w-full outline-none"/>
                            <input value={data.winrateSurface} onChange={(e) => handleChange([playerKey, 'winrateSurface'], e.target.value)} className="bg-transparent text-center w-full outline-none"/>
                            <span>-</span>
                        </div>
                        <div className="grid grid-cols-4 p-2 text-center text-gray-500 items-center hover:bg-white/5">
                            <span>Carrière</span>
                            <input value={data.winrateCareer} onChange={(e) => handleChange([playerKey, 'winrateCareer'], e.target.value)} className="bg-transparent text-center w-full outline-none"/>
                            <span>-</span>
                            <span>-</span>
                        </div>
                    </div>
                </div>
              </>
          )}

          {/* --- ONGLET 2 : RÉSULTATS (TABLEAU DÉTAILLÉ) --- */}
          {activeTab === 'RESULTATS' && (
              <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-orange-500 uppercase flex items-center gap-2"><Trophy size={12}/> Derniers Matchs</h4>
                  
                  {/* Zone de texte brut pour copier-coller rapide */}
                  <textarea 
                      className="w-full bg-black/30 border border-neutral-800 rounded p-2 text-[10px] text-gray-400 outline-none resize-none h-16 mb-2"
                      placeholder="Collez ici les résultats bruts trouvés par l'IA ou sur le web..."
                      value={data.last5}
                      onChange={(e) => handleChange([playerKey, 'last5'], e.target.value)}
                  />

                  {/* Tableau Structuré */}
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px]">
                      <div className="grid grid-cols-[50px_1fr_1fr_40px_30px] bg-neutral-800 p-2 font-bold text-gray-400 border-b border-neutral-700">
                          <span>Date</span><span>Tournoi</span><span>Adv.</span><span>Sc.</span><span>R</span>
                      </div>
                      {/* 5 Lignes éditables */}
                      {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="grid grid-cols-[50px_1fr_1fr_40px_30px] border-b border-neutral-800 p-1 hover:bg-white/5 items-center group">
                              <input className="bg-transparent text-gray-500 w-full outline-none text-center" placeholder="Date" defaultValue={i===1 ? "01.12" : ""} />
                              <input className="bg-transparent text-gray-300 w-full outline-none truncate" placeholder="Tournoi..." />
                              <input className="bg-transparent text-white w-full outline-none truncate font-bold" placeholder="Adversaire..." />
                              <input className="bg-transparent text-neon w-full outline-none text-center" placeholder="0-0" />
                              <input className="bg-transparent w-full outline-none text-center font-bold cursor-pointer hover:text-white text-gray-500" placeholder="?" />
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* --- ONGLET 3 : CALENDRIER --- */}
          {activeTab === 'CALENDRIER' && (
              <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-white uppercase mb-2">Prochains Matchs</h4>
                  <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px]">
                      <div className="grid grid-cols-[60px_1fr_1fr] bg-neutral-800 p-2 font-bold text-gray-400 border-b border-neutral-700">
                          <span>Date</span><span>Tournoi</span><span>Enjeu</span>
                      </div>
                      <div className="grid grid-cols-[60px_1fr_1fr] p-2 border-b border-neutral-800 text-gray-300 hover:bg-white/5">
                          <input className="bg-transparent w-full outline-none" defaultValue="Demain"/>
                          <span>{report.identity.tournament}</span>
                          <span>1/4 Finale</span>
                      </div>
                      <div className="p-4 text-center text-gray-600 italic">Aucun autre match prévu.</div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );

  return (
    <div className="mt-6 space-y-6 font-sans">
      
      {/* BANDEAU PRINCIPAL */}
      <div className="bg-black border border-neutral-700 rounded-xl p-4 flex justify-between items-center shadow-2xl">
          <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-neon text-xs font-black uppercase tracking-widest">
                  <MapPin size={12}/> {report.identity.tournament} <span className="text-gray-600">|</span> {report.identity.surface}
              </div>
              <div className="flex items-center gap-4 text-white text-2xl font-black">
                  <input value={report.identity.p1Name} onChange={(e) => handleChange(['identity', 'p1Name'], e.target.value)} className="bg-transparent text-right w-full outline-none"/>
                  <span className="text-gray-600 text-sm">VS</span>
                  <input value={report.identity.p2Name} onChange={(e) => handleChange(['identity', 'p2Name'], e.target.value)} className="bg-transparent text-left w-full outline-none"/>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={10}/> {report.identity.date}</span>
                  <span className="flex items-center gap-1"><Globe size={10}/> {report.conditions.weather}</span>
              </div>
          </div>
          <button className="bg-neon hover:bg-neonHover text-black text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-neon/20 transition-all">
              <Save size={14}/> ENREGISTRER
          </button>
      </div>

      {/* GRILLE JOUEURS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlayerCard playerKey="p1" name={report.identity.p1Name} data={report.p1} activeTab={tabP1} setActiveTab={setTabP1} opponentName={report.identity.p2Name} />
          <PlayerCard playerKey="p2" name={report.identity.p2Name} data={report.p2} activeTab={tabP2} setActiveTab={setTabP2} opponentName={report.identity.p1Name} />
      </div>

      {/* H2H FOOTER */}
      <div className="bg-surface border border-neutral-800 rounded-xl p-4 flex flex-col items-center text-center">
          <div className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Activity size={14}/> Confrontations Directes (H2H)
          </div>
          <div className="flex items-center gap-8">
              <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase">Global</p>
                  <input value={report.h2h.total} onChange={(e) => handleChange(['h2h', 'total'], e.target.value)} className="text-2xl font-black text-white bg-transparent text-center w-20 outline-none"/>
              </div>
              <div className="h-8 w-px bg-neutral-700"></div>
              <div className="text-left">
                  <p className="text-[10px] text-gray-500 uppercase">Surface</p>
                  <input value={report.h2h.surface} onChange={(e) => handleChange(['h2h', 'surface'], e.target.value)} className="text-2xl font-black text-white bg-transparent text-center w-20 outline-none"/>
              </div>
          </div>
          <input value={report.h2h.lastMatches} onChange={(e) => handleChange(['h2h', 'lastMatches'], e.target.value)} className="text-xs text-gray-500 bg-transparent w-full outline-none text-center mt-2 italic" placeholder="Détail des derniers matchs..."/>
      </div>

    </div>
  );
};
