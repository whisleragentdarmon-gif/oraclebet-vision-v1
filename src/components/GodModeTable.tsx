import React, { useState } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Edit3, Trophy, Calendar, Activity, User, Globe, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate }) => {
  
  // États pour les onglets de chaque joueur
  const [tabP1, setTabP1] = useState<'RESUME' | 'ACTU' | 'RESULTATS' | 'CALENDRIER'>('RESUME');
  const [tabP2, setTabP2] = useState<'RESUME' | 'ACTU' | 'RESULTATS' | 'CALENDRIER'>('RESUME');

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
    playerKey, 
    name, 
    data, 
    activeTab, 
    setActiveTab, 
    opponentName 
  }: { 
    playerKey: 'p1' | 'p2', 
    name: string, 
    data: any, 
    activeTab: string, 
    setActiveTab: (t: any) => void,
    opponentName: string
  }) => (
    <div className="bg-surface border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-full">
      
      {/* EN-TÊTE JOUEUR */}
      <div className="bg-neutral-900 p-4 border-b border-neutral-800 relative overflow-hidden">
        {/* Drapeau en fond (simulé) */}
        <div className="absolute right-0 top-0 text-neutral-800 opacity-20 transform translate-x-4 -translate-y-2">
            <Globe size={100} />
        </div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
                        {playerKey === 'p1' ? <span className="text-blue-500">●</span> : <span className="text-orange-500">●</span>} 
                        {name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-mono">
                        <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-neutral-700">
                            <Trophy size={10} className="text-neon"/> #{data.rank}
                        </span>
                        <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-neutral-700">
                            <User size={10}/> {data.ageHeight}
                        </span>
                        <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-neutral-700">
                            <Globe size={10}/> {data.nationality}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* ONGLETS FLASHSCORE STYLE */}
      <div className="flex border-b border-neutral-800 bg-black/40 text-[10px] font-bold uppercase tracking-wider">
          {['RESUME', 'ACTU', 'RESULTATS', 'CALENDRIER'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 hover:bg-white/5 transition-colors ${activeTab === tab ? 'text-white border-b-2 border-neon bg-white/5' : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* CONTENU */}
      <div className="p-4 space-y-6 overflow-y-auto h-[500px] scrollbar-thin scrollbar-thumb-neutral-700">
          
          {activeTab === 'RESUME' && (
              <>
                {/* 1. RÉSUMÉ PROFIL */}
                <div>
                    <h4 className="text-xs font-bold text-neon mb-2 uppercase flex items-center gap-2">
                        <User size={14}/> Profil & Palmarès
                    </h4>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs">
                        {[
                            { l: 'Classement Actuel', k: 'rank' },
                            { l: 'Meilleur Class.', k: 'bestRank' },
                            { l: 'Âge / Taille', k: 'ageHeight' },
                            { l: 'Nationalité', k: 'nationality' },
                            { l: 'Main', k: 'hand' },
                            { l: 'Style / Titres', k: 'style' }, // On utilise 'style' pour les titres/palmarès
                        ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-[120px_1fr] border-b border-neutral-800 last:border-0">
                                <div className="bg-neutral-800/50 p-2 text-gray-400 font-semibold border-r border-neutral-800 flex items-center">
                                    {row.l}
                                </div>
                                <input 
                                    value={data[row.k]} 
                                    onChange={(e) => handleChange([playerKey, row.k], e.target.value)}
                                    className="bg-transparent text-white p-2 outline-none w-full font-mono focus:bg-white/5 transition-colors"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. MATCH DU JOUR */}
                <div>
                    <h4 className="text-xs font-bold text-blue-400 mb-2 uppercase flex items-center gap-2">
                        <Activity size={14}/> Match du Jour
                    </h4>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs shadow-lg">
                        <div className="flex justify-between items-center mb-3 border-b border-neutral-800 pb-2">
                            <span className="text-gray-400 font-bold">{report.identity.tournament}</span>
                            <span className="text-green-500 font-bold animate-pulse flex items-center gap-1">
                                ● EN COURS
                            </span>
                        </div>
                        <div className="grid grid-cols-3 items-center text-center">
                            <span className="font-bold text-white">{name}</span>
                            <span className="text-gray-600 text-[10px]">VS</span>
                            <span className="font-bold text-white">{opponentName}</span>
                        </div>
                    </div>
                </div>

                {/* 3. DERNIERS RÉSULTATS (TABLEAU FLASHSCORE) */}
                <div>
                    <h4 className="text-xs font-bold text-orange-500 mb-2 uppercase flex items-center gap-2">
                        <Trophy size={14}/> Derniers Résultats
                    </h4>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px]">
                        {/* En-têtes */}
                        <div className="grid grid-cols-[50px_1fr_1fr_40px_30px] bg-neutral-800 p-2 font-bold text-gray-400 border-b border-neutral-700">
                            <span>Date</span><span>Tournoi</span><span>Adv.</span><span>Sc.</span><span>R</span>
                        </div>
                        
                        {/* Lignes (Simulées pour l'édition manuelle, car l'API donne un bloc texte) */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="grid grid-cols-[50px_1fr_1fr_40px_30px] border-b border-neutral-800 p-1 hover:bg-white/5 items-center group">
                                <input className="bg-transparent text-gray-500 w-full outline-none text-center" defaultValue={i===1 ? "01.12" : "-"} />
                                <input className="bg-transparent text-gray-300 w-full outline-none truncate font-bold" defaultValue={i===1 ? "Angers" : "-"} />
                                <input className="bg-transparent text-white w-full outline-none truncate" placeholder="Adversaire..." />
                                <input className="bg-transparent text-neon w-full outline-none text-center font-mono" placeholder="0-0" />
                                <div className="flex justify-center">
                                    <span className="w-4 h-4 rounded bg-neutral-700 group-hover:bg-neutral-600 cursor-pointer flex items-center justify-center text-white font-bold">?</span>
                                </div>
                            </div>
                        ))}
                        
                        {/* Zone de texte brut (Source) */}
                        <div className="p-2 bg-black/30 border-t border-neutral-800">
                            <p className="text-[9px] text-gray-600 mb-1 uppercase">Données brutes (Source Web) :</p>
                            <textarea 
                                className="w-full bg-transparent text-gray-400 text-[10px] outline-none resize-none h-12"
                                value={data.last5}
                                onChange={(e) => handleChange([playerKey, 'last5'], e.target.value)}
                            />
                        </div>
                    </div>
                </div>
              </>
          )}

          {activeTab !== 'RESUME' && (
              <div className="h-48 flex flex-col items-center justify-center text-gray-500 border border-dashed border-neutral-800 rounded-xl bg-black/20">
                  <Clock size={24} className="mb-2 opacity-50"/>
                  <p>Données {activeTab} en cours d'intégration.</p>
              </div>
          )}
      </div>
    </div>
  );

  return (
    <div className="mt-6 space-y-6">
      
      {/* 1. BANDEAU MATCH (Identité) */}
      <div className="bg-black border border-neutral-700 rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
          <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-neon">
                  <MapPin size={14}/>
                  <input 
                    value={report.identity.tournament} 
                    onChange={(e) => handleChange(['identity', 'tournament'], e.target.value)}
                    className="bg-transparent text-sm font-bold text-neon uppercase tracking-widest outline-none w-64"
                  />
              </div>
              <div className="flex items-center gap-4 text-white text-3xl font-black tracking-tighter">
                  <input value={report.identity.p1Name} onChange={(e) => handleChange(['identity', 'p1Name'], e.target.value)} className="bg-transparent text-right w-full outline-none"/>
                  <span className="text-gray-700 text-xl italic">VS</span>
                  <input value={report.identity.p2Name} onChange={(e) => handleChange(['identity', 'p2Name'], e.target.value)} className="bg-transparent text-left w-full outline-none"/>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded"><Calendar size={12}/> {report.identity.date}</span>
                  <span className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded"><Globe size={12}/> {report.conditions.weather}</span>
                  <span className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded border border-neutral-700 text-white font-bold">{report.identity.surface}</span>
              </div>
          </div>
          
          <button className="bg-neon hover:bg-neonHover text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-neon/20 transition-all transform hover:scale-105">
              <Save size={18}/> SAUVEGARDER FICHE
          </button>
      </div>

      {/* 2. LES DEUX FICHES CÔTE À CÔTE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlayerCard 
            playerKey="p1" 
            name={report.identity.p1Name} 
            data={report.p1} 
            activeTab={tabP1} 
            setActiveTab={setTabP1}
            opponentName={report.identity.p2Name}
          />
          <PlayerCard 
            playerKey="p2" 
            name={report.identity.p2Name} 
            data={report.p2} 
            activeTab={tabP2} 
            setActiveTab={setTabP2}
            opponentName={report.identity.p1Name}
          />
      </div>

      {/* 3. SECTION HEAD TO HEAD (Bas de page) */}
      <div className="bg-surface border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-neutral-800 pb-4">
              <Activity size={20} className="text-purple-500"/>
              <h3 className="font-bold text-white">CONFRONTATIONS DIRECTES (H2H)</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/30 p-4 rounded-lg border border-neutral-800 text-center">
                  <p className="text-[10px] text-gray-500 uppercase mb-1">Score Global</p>
                  <input 
                    value={report.h2h.total} 
                    onChange={(e) => handleChange(['h2h', 'total'], e.target.value)}
                    className="text-3xl font-black text-white bg-transparent text-center w-full outline-none"
                  />
              </div>
              <div className="col-span-2 bg-black/30 p-4 rounded-lg border border-neutral-800">
                  <p className="text-[10px] text-gray-500 uppercase mb-1">Analyse Matchup & Surface</p>
                  <input 
                    value={report.h2h.surface} 
                    onChange={(e) => handleChange(['h2h', 'surface'], e.target.value)}
                    className="text-sm text-gray-300 bg-transparent w-full outline-none border-b border-neutral-700 pb-1 mb-2"
                    placeholder="Stats sur surface..."
                  />
                   <input 
                    value={report.h2h.lastMatches} 
                    onChange={(e) => handleChange(['h2h', 'lastMatches'], e.target.value)}
                    className="text-xs text-gray-500 bg-transparent w-full outline-none italic"
                    placeholder="Derniers scores..."
                  />
              </div>
          </div>
      </div>

    </div>
  );
};
