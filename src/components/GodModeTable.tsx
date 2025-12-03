import React from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Edit3, Thermometer, Wind, Trophy } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate }) => {
  
  const handleChange = (section: string, key: string, value: string) => {
    const newReport = { ...report };
    // @ts-ignore
    newReport[section][key] = value;
    onUpdate(newReport);
  };

  const handlePlayerChange = (player: 'p1' | 'p2', key: string, value: string) => {
    const newReport = { ...report };
    // @ts-ignore
    newReport[player][key] = value;
    onUpdate(newReport);
  };

  // --- LIGNE DU TABLEAU COMPARATIF (3 COLONNES) ---
  const CompRow = ({ label, val1, val2, field }: { label: string, val1: string, val2: string, field: string }) => (
    <div className="grid grid-cols-3 border-b border-neutral-800 hover:bg-white/5 transition-colors">
        {/* COLONNE 2 : JOUEUR 1 (Gauche) */}
        <input 
            type="text" value={val1} 
            onChange={(e) => handlePlayerChange('p1', field, e.target.value)}
            className="bg-transparent text-center p-2 text-sm text-white border-r border-neutral-800 outline-none focus:bg-neutral-800"
        />
        
        {/* COLONNE 1 : CRITÈRE (Milieu) */}
        <div className="bg-neutral-900/50 flex items-center justify-center p-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-r border-neutral-800">
            {label}
        </div>

        {/* COLONNE 3 : JOUEUR 2 (Droite) */}
        <input 
            type="text" value={val2} 
            onChange={(e) => handlePlayerChange('p2', field, e.target.value)}
            className="bg-transparent text-center p-2 text-sm text-white outline-none focus:bg-neutral-800"
        />
    </div>
  );

  return (
    <div className="mt-6 bg-black border border-neutral-700 rounded-xl overflow-hidden shadow-2xl">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 flex justify-between items-center">
          <div>
              <h3 className="text-white font-bold text-lg flex items-center gap-2"><Edit3 size={18}/> FICHE MATCH V2</h3>
              <p className="text-xs text-blue-200 opacity-80">Tableau comparatif dynamique</p>
          </div>
          <button className="text-xs bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 transition-all">
              <Save size={14}/> Sauvegarder
          </button>
      </div>

      {/* 1. IDENTITÉ MATCH */}
      <div className="bg-neutral-800/50 p-2 text-center border-b border-neutral-700">
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-300">
              <div className="flex items-center justify-center gap-2"><Trophy size={12}/> <input value={report.identity.tournament} onChange={e => handleChange('identity', 'tournament', e.target.value)} className="bg-transparent text-center w-full outline-none"/></div>
              <div className="text-neon font-bold"><input value={report.identity.surface} onChange={e => handleChange('identity', 'surface', e.target.value)} className="bg-transparent text-center w-full outline-none"/></div>
              <div><input value={report.identity.date} onChange={e => handleChange('identity', 'date', e.target.value)} className="bg-transparent text-center w-full outline-none"/></div>
          </div>
      </div>

      {/* 2. TABLEAU COMPARATIF (Le Cœur) */}
      <div className="border-b border-neutral-700">
          {/* Noms des joueurs */}
          <div className="grid grid-cols-3 bg-neutral-900 border-b border-neutral-700">
              <div className="p-3 text-center font-bold text-lg text-blue-400">{report.identity.p1Name}</div>
              <div className="p-3 text-center text-xs text-gray-600 flex items-center justify-center">VS</div>
              <div className="p-3 text-center font-bold text-lg text-orange-400">{report.identity.p2Name}</div>
          </div>

          {/* Lignes de comparaison */}
          <CompRow label="Classement" val1={report.p1.rank} val2={report.p2.rank} field="rank" />
          <CompRow label="Meilleur Class." val1={report.p1.bestRank} val2={report.p2.bestRank} field="bestRank" />
          <CompRow label="Âge / Taille" val1={report.p1.ageHeight} val2={report.p2.ageHeight} field="ageHeight" />
          <CompRow label="Nationalité" val1={report.p1.nationality} val2={report.p2.nationality} field="nationality" />
          <CompRow label="Main" val1={report.p1.hand} val2={report.p2.hand} field="hand" />
          
          <div className="h-2 bg-neutral-900 border-y border-neutral-800"></div>

          <CompRow label="% Victoire Saison" val1={report.p1.winrateSeason} val2={report.p2.winrateSeason} field="winrateSeason" />
          <CompRow label="% Victoire Surface" val1={report.p1.winrateSurface} val2={report.p2.winrateSurface} field="winrateSurface" />
          <CompRow label="Aces / Match" val1={report.p1.aces} val2={report.p2.aces} field="aces" />
          <CompRow label="Double Fautes" val1={report.p1.doubleFaults} val2={report.p2.doubleFaults} field="doubleFaults" />
          <CompRow label="% 1ère Balle" val1={report.p1.firstServe} val2={report.p2.firstServe} field="firstServe" />
          
          <div className="h-2 bg-neutral-900 border-y border-neutral-800"></div>

          <CompRow label="Forme (1-10)" val1={report.p1.form} val2={report.p2.form} field="form" />
          <CompRow label="Blessures" val1={report.p1.injury} val2={report.p2.injury} field="injury" />
          <CompRow label="Motivation" val1={report.p1.motivation} val2={report.p2.motivation} field="motivation" />
      </div>

      {/* 3. H2H & CONDITIONS */}
      <div className="grid grid-cols-2 divide-x divide-neutral-700">
          <div className="p-4">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Head to Head</h4>
              <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Global</span> <input value={report.h2h.global} onChange={e => handleChange('h2h', 'global', e.target.value)} className="bg-transparent text-white text-right w-20 outline-none"/></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Surface</span> <input value={report.h2h.surface} onChange={e => handleChange('h2h', 'surface', e.target.value)} className="bg-transparent text-white text-right w-20 outline-none"/></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Avantage</span> <input value={report.h2h.advantage} onChange={e => handleChange('h2h', 'advantage', e.target.value)} className="bg-transparent text-neon text-right w-full outline-none font-bold"/></div>
              </div>
          </div>
          <div className="p-4">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Conditions Extérieures</h4>
              <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-400 flex gap-2"><Thermometer size={14}/> Météo</span> <input value={report.conditions.weather} onChange={e => handleChange('conditions', 'weather', e.target.value)} className="bg-transparent text-white text-right w-full outline-none"/></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400 flex gap-2"><Wind size={14}/> Vent</span> <input value={report.conditions.wind} onChange={e => handleChange('conditions', 'wind', e.target.value)} className="bg-transparent text-white text-right w-20 outline-none"/></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Altitude</span> <input value={report.conditions.altitude} onChange={e => handleChange('conditions', 'altitude', e.target.value)} className="bg-transparent text-white text-right w-20 outline-none"/></div>
              </div>
          </div>
      </div>

      {/* 4. SYNTHÈSE */}
      <div className="bg-purple-900/20 border-t border-neutral-700 p-4">
          <h4 className="text-[10px] font-bold text-purple-400 uppercase mb-2">Synthèse God Mode</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-[10px] text-gray-500">Technique</p><input value={report.synthesis.tech} onChange={e => handleChange('synthesis', 'tech', e.target.value)} className="bg-transparent text-white text-center w-full font-bold outline-none"/></div>
              <div><p className="text-[10px] text-gray-500">Mental</p><input value={report.synthesis.mental} onChange={e => handleChange('synthesis', 'mental', e.target.value)} className="bg-transparent text-white text-center w-full font-bold outline-none"/></div>
              <div><p className="text-[10px] text-gray-500">Physique</p><input value={report.synthesis.physical} onChange={e => handleChange('synthesis', 'physical', e.target.value)} className="bg-transparent text-white text-center w-full font-bold outline-none"/></div>
          </div>
      </div>

    </div>
  );
};
