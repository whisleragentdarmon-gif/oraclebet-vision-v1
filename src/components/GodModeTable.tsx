import React from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Edit3 } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate }) => {
  
  const handleChange = (section: string, key: string, value: string, subSection?: string) => {
    const newReport = { ...report };
    if (subSection) {
        // @ts-ignore
        newReport[section][subSection][key] = value;
    } else {
        // @ts-ignore
        newReport[section][key] = value;
    }
    onUpdate(newReport);
  };

  const InputRow = ({ label, val, onChange }: { label: string, val: string, onChange: (v: string) => void }) => (
    <div className="flex border-b border-neutral-800 last:border-0">
        <div className="w-1/3 bg-neutral-900/50 p-2 text-[10px] text-gray-400 font-bold border-r border-neutral-800 flex items-center">
            {label}
        </div>
        <div className="w-2/3 p-0">
            <input 
                type="text" 
                value={val} 
                onChange={(e) => onChange(e.target.value)}
                className={`w-full bg-transparent p-2 text-xs outline-none font-mono focus:bg-neutral-800 transition-colors ${val.includes('Non trouvé') ? 'text-orange-500 italic' : 'text-white'}`}
            />
        </div>
    </div>
  );

  return (
    <div className="mt-6 bg-black border border-neutral-700 rounded-xl overflow-hidden shadow-2xl">
      
      {/* HEADER TITLE */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-3 flex justify-between items-center">
          <h3 className="text-white font-bold text-sm flex items-center gap-2"><Edit3 size={16}/> FICHE MATCH – ORACLEBET (V2)</h3>
          <button className="text-[10px] bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded flex items-center gap-1 border border-white/10">
              <Save size={10}/> Sauvegarder
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-x divide-neutral-700">
          
          {/* COLONNE GAUCHE : IDENTITÉ & JOUEUR 1 */}
          <div>
              <div className="bg-neutral-800 p-1 text-center text-[10px] text-neon font-bold uppercase">1. Identité Match</div>
              <InputRow label="Joueur 1" val={report.identity.p1Name} onChange={(v) => handleChange('identity', 'p1Name', v)} />
              <InputRow label="Joueur 2" val={report.identity.p2Name} onChange={(v) => handleChange('identity', 'p2Name', v)} />
              <InputRow label="Tournoi" val={report.identity.tournament} onChange={(v) => handleChange('identity', 'tournament', v)} />
              <InputRow label="Surface" val={report.identity.surface} onChange={(v) => handleChange('identity', 'surface', v)} />

              <div className="bg-neutral-800 p-1 text-center text-[10px] text-blue-400 font-bold uppercase mt-4">2. Profil {report.identity.p1Name}</div>
              <InputRow label="Classement" val={report.p1.rank} onChange={(v) => handleChange('p1', 'rank', v)} />
              <InputRow label="Âge / Taille" val={`${report.p1.age} / ${report.p1.height}`} onChange={(v) => handleChange('p1', 'age', v)} />
              <InputRow label="Nationalité" val={report.p1.nationality} onChange={(v) => handleChange('p1', 'nationality', v)} />
              <InputRow label="Forme (1-10)" val={report.p1.form} onChange={(v) => handleChange('p1', 'form', v)} />
              <InputRow label="Blessures" val={report.p1.injuries} onChange={(v) => handleChange('p1', 'injuries', v)} />
              <InputRow label="Derniers Matchs" val={report.p1.last5} onChange={(v) => handleChange('p1', 'last5', v)} />
          </div>

          {/* COLONNE DROITE : JOUEUR 2 & H2H */}
          <div>
              <div className="bg-neutral-800 p-1 text-center text-[10px] text-orange-400 font-bold uppercase">3. Profil {report.identity.p2Name}</div>
              <InputRow label="Classement" val={report.p2.rank} onChange={(v) => handleChange('p2', 'rank', v)} />
              <InputRow label="Âge / Taille" val={`${report.p2.age} / ${report.p2.height}`} onChange={(v) => handleChange('p2', 'age', v)} />
              <InputRow label="Nationalité" val={report.p2.nationality} onChange={(v) => handleChange('p2', 'nationality', v)} />
              <InputRow label="Forme (1-10)" val={report.p2.form} onChange={(v) => handleChange('p2', 'form', v)} />
              <InputRow label="Blessures" val={report.p2.injuries} onChange={(v) => handleChange('p2', 'injuries', v)} />
              <InputRow label="Derniers Matchs" val={report.p2.last5} onChange={(v) => handleChange('p2', 'last5', v)} />

              <div className="bg-neutral-800 p-1 text-center text-[10px] text-purple-400 font-bold uppercase mt-4">4. Head to Head</div>
              <InputRow label="H2H Global" val={report.h2h.total} onChange={(v) => handleChange('h2h', 'total', v)} />
              <InputRow label="Derniers affront." val={report.h2h.lastMatches} onChange={(v) => handleChange('h2h', 'lastMatches', v)} />
              <InputRow label="Analyse Matchup" val={report.h2h.analysis} onChange={(v) => handleChange('h2h', 'analysis', v)} />
          </div>
      </div>

      {/* BAS : CONDITIONS & SYNTHÈSE */}
      <div className="border-t border-neutral-700">
          <div className="bg-neutral-800 p-1 text-center text-[10px] text-green-400 font-bold uppercase">5. Conditions & Synthèse</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x divide-neutral-700">
             <div>
                 <InputRow label="Météo" val={report.conditions.weather} onChange={(v) => handleChange('conditions', 'weather', v)} />
                 <InputRow label="Altitude" val={report.conditions.altitude} onChange={(v) => handleChange('conditions', 'altitude', v)} />
             </div>
             <div>
                 <InputRow label="Risque Global" val={report.synthesis.risk} onChange={(v) => handleChange('synthesis', 'risk', v)} />
                 <InputRow label="Facteur X" val={report.synthesis.xFactor} onChange={(v) => handleChange('synthesis', 'xFactor', v)} />
             </div>
          </div>
      </div>

    </div>
  );
};
