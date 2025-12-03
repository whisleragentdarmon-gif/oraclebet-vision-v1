import React from 'react';
import { GodModeReport } from '../engine/types';
import { Save, Edit3 } from 'lucide-react';

interface Props {
  report: GodModeReport;
  onUpdate: (newReport: GodModeReport) => void;
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

  // Un petit composant pour une ligne du tableau
  const Row = ({ label, val, onChange }: { label: string, val: string, onChange: (v: string) => void }) => (
    <div className="flex border-b border-neutral-700">
        <div className="w-1/3 bg-neutral-900 p-2 text-xs text-gray-400 font-bold border-r border-neutral-700 flex items-center">
            {label}
        </div>
        <div className="w-2/3 p-0">
            <input 
                type="text" 
                value={val} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent p-2 text-xs text-white focus:bg-neutral-800 outline-none font-mono"
            />
        </div>
    </div>
  );

  return (
    <div className="mt-6 bg-surface border border-neutral-700 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-3 flex justify-between items-center">
          <h3 className="text-white font-bold text-sm flex items-center gap-2"><Edit3 size={16}/> FICHE MATCH – ORACLEBET (GOD MODE)</h3>
          <button className="text-[10px] bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded flex items-center gap-1">
              <Save size={10}/> Sauvegarder Fiche
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x divide-neutral-700">
          
          {/* COLONNE GAUCHE : JOUEUR A */}
          <div>
              <div className="bg-neutral-800 p-2 text-center text-neon font-bold border-b border-neutral-700">{report.identity.p1}</div>
              <Row label="Classement" val={report.playerA.rank} onChange={(v) => handleChange('playerA', 'rank', v)} />
              <Row label="Âge / Taille" val={`${report.playerA.age} / ${report.playerA.height}`} onChange={(v) => handleChange('playerA', 'age', v)} />
              <Row label="Forme (1-10)" val={report.playerA.form} onChange={(v) => handleChange('playerA', 'form', v)} />
              <Row label="Style de jeu" val={report.playerA.style} onChange={(v) => handleChange('playerA', 'style', v)} />
              <Row label="Motivation" val={report.playerA.motivation} onChange={(v) => handleChange('playerA', 'motivation', v)} />
              <Row label="Derniers Matchs" val={report.momentum.p1.last5} onChange={(v) => handleChange('momentum', 'last5', v, 'p1')} />
              <Row label="Blessure ?" val={report.playerA.injury} onChange={(v) => handleChange('playerA', 'injury', v)} />
          </div>

          {/* COLONNE DROITE : JOUEUR B */}
          <div>
              <div className="bg-neutral-800 p-2 text-center text-white font-bold border-b border-neutral-700">{report.identity.p2}</div>
              <Row label="Classement" val={report.playerB.rank} onChange={(v) => handleChange('playerB', 'rank', v)} />
              <Row label="Âge / Taille" val={`${report.playerB.age} / ${report.playerB.height}`} onChange={(v) => handleChange('playerB', 'age', v)} />
              <Row label="Forme (1-10)" val={report.playerB.form} onChange={(v) => handleChange('playerB', 'form', v)} />
              <Row label="Style de jeu" val={report.playerB.style} onChange={(v) => handleChange('playerB', 'style', v)} />
              <Row label="Motivation" val={report.playerB.motivation} onChange={(v) => handleChange('playerB', 'motivation', v)} />
              <Row label="Derniers Matchs" val={report.momentum.p2.last5} onChange={(v) => handleChange('momentum', 'last5', v, 'p2')} />
              <Row label="Blessure ?" val={report.playerB.injury} onChange={(v) => handleChange('playerB', 'injury', v)} />
          </div>
      </div>

      {/* SECTION CENTRALE : CONTEXTE & ANALYSE */}
      <div className="border-t border-neutral-700">
          <div className="bg-neutral-800 p-1 text-center text-xs text-gray-400 font-bold">CONTEXTE & H2H</div>
          <Row label="H2H Global" val={report.h2h.global} onChange={(v) => handleChange('h2h', 'global', v)} />
          <Row label="Météo / Conditions" val={`${report.conditions.weather} / ${report.conditions.temp}`} onChange={(v) => handleChange('conditions', 'weather', v)} />
          <Row label="Surface Advantage" val={report.conditions.advantage} onChange={(v) => handleChange('conditions', 'advantage', v)} />
          <Row label="Avis Bookmaker" val={`Cote A: ${report.bookmaker.oddA} | Cote B: ${report.bookmaker.oddB}`} onChange={(v) => handleChange('bookmaker', 'oddA', v)} />
      </div>

      <div className="border-t border-neutral-700 bg-purple-900/10">
          <div className="bg-purple-900/50 p-1 text-center text-xs text-white font-bold">SYNTHÈSE GOD MODE</div>
          <div className="p-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                  <p className="text-[10px] text-purple-300 uppercase">Probabilité {report.identity.p1}</p>
                  <input className="bg-transparent text-2xl font-bold text-white text-center w-full border-b border-purple-500/30 focus:border-neon outline-none" 
                         value={report.prediction.probA} onChange={(e) => handleChange('prediction', 'probA', e.target.value)} />
              </div>
              <div className="text-center">
                   <p className="text-[10px] text-purple-300 uppercase">Probabilité {report.identity.p2}</p>
                   <input className="bg-transparent text-2xl font-bold text-white text-center w-full border-b border-purple-500/30 focus:border-neon outline-none" 
                          value={report.prediction.probB} onChange={(e) => handleChange('prediction', 'probB', e.target.value)} />
              </div>
          </div>
          <Row label="RECOMMANDATION" val={report.prediction.recoWinner} onChange={(v) => handleChange('prediction', 'recoWinner', v)} />
      </div>

    </div>
  );
};
