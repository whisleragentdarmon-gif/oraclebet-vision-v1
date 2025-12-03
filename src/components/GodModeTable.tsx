import React, { useState } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Edit3, Trophy, Calendar, Activity, User, Globe, Clock } from 'lucide-react';

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
      <div className="bg-neutral-900 p-4 border-b border-neutral-800">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {playerKey === 'p1' ? <span className="text-blue-500">blob</span> : <span className="text-orange-500">blob</span>} 
                    {name}
                </h3>
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    <span className="bg-black/30 px-2 py-1 rounded border border-neutral-700">#{data.rank} WTA</span>
                    <span className="bg-black/30 px-2 py-1 rounded border border-neutral-700">{data.ageHeight.split('/')[0]}</span>
                    <span className="bg-black/30 px-2 py-1 rounded border border-neutral-700">{data.nationality}</span>
                </div>
            </div>
            <User size={32} className="text-neutral-700" />
        </div>
      </div>

      {/* ONGLETS */}
      <div className="flex border-b border-neutral-800 bg-black/20 text-[10px] font-bold uppercase tracking-wider">
          {['RESUME', 'ACTU', 'RESULTATS', 'CALENDRIER'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 hover:bg-white/5 transition-colors ${activeTab === tab ? 'text-white border-b-2 border-neon' : 'text-gray-500'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* CONTENU */}
      <div className="p-4 space-y-6 overflow-y-auto">
          
          {/* ON AFFICHE LE RÉSUMÉ EN PRIORITÉ */}
          {activeTab === 'RESUME' && (
              <>
                {/* TABLEAU 1 : RÉSUMÉ */}
                <div>
                    <h4 className="text-xs font-bold text-white mb-2 uppercase border-l-2 border-neon pl-2">Résumé</h4>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-xs">
                        <div className="grid grid-cols-2 border-b border-neutral-700 bg-neutral-800/50 p-2 font-bold text-gray-400">
                            <span>Info</span><span>Détail</span>
                        </div>
                        {[
                            { l: 'Classement Actuel', k: 'rank' },
                            { l: 'Meilleur Class.', k: 'bestRank' },
                            { l: 'Age / Taille', k: 'ageHeight' },
                            { l: 'Nationalité', k: 'nationality' },
                            { l: 'Main', k: 'hand' },
                            { l: 'Forme', k: 'form' },
                        ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-2 border-b border-neutral-800 p-2 hover:bg-white/5">
                                <span className="text-gray-400">{row.l}</span>
                                <input 
                                    value={data[row.k]} 
                                    onChange={(e) => handleChange([playerKey, row.k], e.target.value)}
                                    className="bg-transparent text-white outline-none w-full font-mono"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* TABLEAU 2 : MATCH DU JOUR */}
                <div>
                    <h4 className="text-xs font-bold text-white mb-2 uppercase border-l-2 border-blue-500 pl-2">Match du Jour</h4>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500">{report.identity.tournament}</span>
                            <span className="text-green-500 font-bold animate-pulse">● En cours</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-white text-sm">
                            <span>{name}</span>
                            <span className="text-gray-600">vs</span>
                            <span>{opponentName}</span>
                        </div>
                    </div>
                </div>

                {/* TABLEAU 3 : DERNIERS RÉSULTATS (Flashscore Style) */}
                <div>
                    <h4 className="text-xs font-bold text-white mb-2 uppercase border-l-2 border-orange-500 pl-2">Derniers Résultats</h4>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px]">
                        <div className="grid grid-cols-[60px_1fr_1fr_40px_30px] bg-neutral-800/50 p-2 font-bold text-gray-400 border-b border-neutral-700">
                            <span>Date</span><span>Tournoi</span><span>Adv.</span><span>Sc.</span><span>R</span>
                        </div>
                        {/* On simule 5 lignes modifiables car l'API ne donne qu'un string pour l'instant */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="grid grid-cols-[60px_1fr_1fr_40px_30px] border-b border-neutral-800 p-2 hover:bg-white/5 items-center">
                                <input className="bg-transparent text-gray-400 w-full outline-none" placeholder="Date" defaultValue={i===1 ? "Hier" : "-"} />
                                <input className="bg-transparent text-gray-300 w-full outline-none truncate" placeholder="Tournoi" defaultValue={i===1 ? report.identity.tournament : "-"} />
                                <input className="bg-transparent text-white w-full outline-none font-bold truncate" placeholder="Adversaire" />
                                <input className="bg-transparent text-white w-full outline-none text-center" placeholder="Score" defaultValue="-"/>
                                <input className="bg-transparent text-center w-full outline-none font-bold cursor-pointer" placeholder="V/D" />
                            </div>
                        ))}
                        <div className="p-2 text-gray-500 italic bg-neutral-900">
                            Données brutes : {data.last5 ? data.last5.substring(0, 50) + "..." : "Non trouvé"}
                        </div>
                    </div>
                </div>

                {/* TABLEAU 4 : HISTORIQUE SAISON */}
                <div>
                    <h4 className="text-xs font-bold text-white mb-2 uppercase border-l-2 border-purple-500 pl-2">Historique Saison</h4>
                    <div className="border border-neutral-700 rounded-lg overflow-hidden text-[10px]">
                        <div className="grid grid-cols-4 bg-neutral-800/50 p-2 font-bold text-gray-400 border-b border-neutral-700 text-center">
                            <span>Année</span><span>W-L</span><span>Dur</span><span>Terre</span>
                        </div>
                        <div className="grid grid-cols-4 p-2 border-b border-neutral-800 text-center text-white">
                            <span>2025</span>
                            <input value={data.winrateSeason} onChange={(e) => handleChange([playerKey, 'winrateSeason'], e.target.value)} className="bg-transparent text-center w-full outline-none" />
                            <input value={data.winrateSurface} onChange={(e) => handleChange([playerKey, 'winrateSurface'], e.target.value)} className="bg-transparent text-center w-full outline-none" />
                            <span>-</span>
                        </div>
                        <div className="grid grid-cols-4 p-2 border-b border-neutral-800 text-center text-gray-500">
                            <span>Carrière</span>
                            <input value={data.winrateCareer} onChange={(e) => handleChange([playerKey, 'winrateCareer'], e.target.value)} className="bg-transparent text-center w-full outline-none" />
                            <span>-</span>
                            <span>-</span>
                        </div>
                    </div>
                </div>
              </>
          )}

          {activeTab !== 'RESUME' && (
              <div className="h-32 flex items-center justify-center text-gray-500 border border-dashed border-neutral-800 rounded-xl">
                  Contenu {activeTab} à venir via API
              </div>
          )}
      </div>
    </div>
  );

  return (
    <div className="mt-6 space-y-6">
      
      {/* 1. EN-TÊTE DU MATCH */}
      <div className="bg-black border border-neutral-700 rounded-xl p-4 flex justify-between items-center">
          <div>
              <div className="flex items-center gap-2 mb-1">
                  <Trophy size={14} className="text-neon"/>
                  <span className="text-xs font-bold text-neon uppercase tracking-widest">{report.identity.tournament}</span>
                  <span className="text-[10px] text-gray-500 bg-neutral-900 px-2 rounded border border-neutral-800">{report.identity.surface}</span>
              </div>
              <div className="text-2xl font-bold text-white">
                  {report.identity.p1Name} <span className="text-gray-600 text-lg">vs</span> {report.identity.p2Name}
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {report.identity.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12}/> {report.identity.time || "Horaire inconnu"}</span>
                  <span className="flex items-center gap-1"><Globe size={12}/> {report.conditions.weather}</span>
              </div>
          </div>
          <button className="text-xs bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 transition-all">
              <Save size={14}/> Sauvegarder Fiche
          </button>
      </div>

      {/* 2. LES DEUX FICHES JOUEURS CÔTE À CÔTE */}
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

      {/* 3. SECTION HEAD TO HEAD COMMUNE */}
      <div className="bg-surface border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-neutral-800 pb-4">
              <Activity size={20} className="text-purple-500"/>
              <h3 className="font-bold text-white">HEAD TO HEAD</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-black/30 p-4 rounded-lg border border-neutral-800">
                  <p className="text-[10px] text-gray-500 uppercase mb-1">H2H Global</p>
                  <input 
                    value={report.h2h.total} 
                    onChange={(e) => handleChange(['h2h', 'total'], e.target.value)}
                    className="text-2xl font-bold text-white bg-transparent text-center w-full outline-none"
                  />
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-neutral-800">
                   <p className="text-[10px] text-gray-500 uppercase mb-1">Sur Surface</p>
                   <input 
                    value={report.h2h.surface} 
                    onChange={(e) => handleChange(['h2h', 'surface'], e.target.value)}
                    className="text-2xl font-bold text-white bg-transparent text-center w-full outline-none"
                  />
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-neutral-800">
                   <p className="text-[10px] text-gray-500 uppercase mb-1">Avantage</p>
                   <input 
                    value={report.h2h.advantage} 
                    onChange={(e) => handleChange(['h2h', 'advantage'], e.target.value)}
                    className="text-xl font-bold text-neon bg-transparent text-center w-full outline-none"
                  />
              </div>
          </div>
          <div className="mt-4 p-3 bg-neutral-900/50 rounded text-xs text-gray-400 border border-neutral-800">
              <p className="mb-1 font-bold text-white">Dernières confrontations :</p>
              <input 
                value={report.h2h.lastMatches} 
                onChange={(e) => handleChange(['h2h', 'lastMatches'], e.target.value)}
                className="bg-transparent text-gray-400 w-full outline-none italic"
              />
          </div>
      </div>

    </div>
  );
};
