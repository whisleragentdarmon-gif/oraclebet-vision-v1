import React from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Edit3, Trophy, Zap, Activity, Thermometer, TrendingUp, Brain, AlertTriangle } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate }) => {
  
  const update = (player: 'p1' | 'p2', key: string, val: string) => {
    const newReport = { ...report };
    // @ts-ignore
    newReport[player][key] = val;
    onUpdate(newReport);
  };

  const updateNested = (section: string, key: string, val: string) => {
    const newReport = { ...report };
    // @ts-ignore
    newReport[section][key] = val;
    onUpdate(newReport);
  };

  // --- COMPOSANT : LIGNE COMPARATIVE 3 COLONNES ---
  const CompRow = ({ label, val1, val2, field }: { label: string, val1: string, val2: string, field: string }) => (
    <div className="grid grid-cols-[1fr_140px_1fr] border-b border-neutral-800 hover:bg-white/5 transition-colors h-9">
        <input 
            value={val1} onChange={(e) => update('p1', field, e.target.value)}
            className="bg-transparent text-right pr-3 text-sm text-white font-bold outline-none focus:text-neon focus:bg-black/50"
            placeholder="-"
        />
        <div className="bg-neutral-900/80 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase tracking-wider border-x border-neutral-800">
            {label}
        </div>
        <input 
            value={val2} onChange={(e) => update('p2', field, e.target.value)}
            className="bg-transparent text-left pl-3 text-sm text-white font-bold outline-none focus:text-neon focus:bg-black/50"
            placeholder="-"
        />
    </div>
  );

  // --- COMPOSANT : LIGNE SIMPLE ---
  const SimpleRow = ({ label, val, section, field }: { label: string, val: string, section: string, field: string }) => (
    <div className="flex border-b border-neutral-800 h-9">
        <div className="w-32 bg-neutral-900/50 flex items-center px-3 text-[10px] font-bold text-gray-400 uppercase border-r border-neutral-800">
            {label}
        </div>
        <input 
            value={val} onChange={(e) => updateNested(section, field, e.target.value)}
            className="flex-1 bg-transparent px-3 text-sm text-white outline-none focus:text-neon"
        />
    </div>
  );

  const SectionHeader = ({ title, icon: Icon, color }: { title: string, icon: any, color: string }) => (
      <div className={`p-2 flex items-center justify-center gap-2 bg-neutral-950 border-y border-neutral-800 mt-6 first:mt-0 ${color}`}>
          <Icon size={14} />
          <span className="text-xs font-black uppercase tracking-widest">{title}</span>
      </div>
  );

  return (
    <div className="mt-6 bg-black border border-neutral-700 rounded-xl overflow-hidden shadow-2xl font-sans">
      
      {/* 1. HEADER MATCH */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-4 border-b border-neutral-700">
          <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-neon"/>
                  <span className="text-xs font-bold text-neon uppercase">{report.identity.tournament}</span>
              </div>
              <button className="text-[10px] bg-black/40 hover:bg-black/60 text-white px-3 py-1 rounded border border-white/10 flex gap-1 items-center">
                  <Save size={10}/> Sauvegarder
              </button>
          </div>
          <div className="grid grid-cols-3 items-center text-center">
              <input value={report.identity.p1Name} onChange={e => updateNested('identity', 'p1Name', e.target.value)} className="bg-transparent text-right text-xl font-bold text-white outline-none w-full"/>
              <span className="text-xs text-gray-600 font-bold">VS</span>
              <input value={report.identity.p2Name} onChange={e => updateNested('identity', 'p2Name', e.target.value)} className="bg-transparent text-left text-xl font-bold text-white outline-none w-full"/>
          </div>
          <div className="text-center mt-1">
              <input value={report.identity.date} onChange={e => updateNested('identity', 'date', e.target.value)} className="bg-transparent text-center text-xs text-gray-400 outline-none w-full"/>
          </div>
      </div>

      {/* 2. PROFILS COMPARATIFS (Le Cœur) */}
      <SectionHeader title="Profils Comparatifs" icon={TrendingUp} color="text-blue-400" />
      
      <CompRow label="Classement" val1={report.p1.rank} val2={report.p2.rank} field="rank" />
      <CompRow label="Meilleur Class." val1={report.p1.bestRank} val2={report.p2.bestRank} field="bestRank" />
      <CompRow label="Âge / Taille" val1={report.p1.ageHeight} val2={report.p2.ageHeight} field="ageHeight" />
      <CompRow label="Nationalité" val1={report.p1.nationality} val2={report.p2.nationality} field="nationality" />
      <CompRow label="Main" val1={report.p1.hand} val2={report.p2.hand} field="hand" />
      <div className="h-1 bg-neutral-900 border-y border-neutral-800"></div>
      <CompRow label="Winrate Saison" val1={report.p1.winrateSeason} val2={report.p2.winrateSeason} field="winrateSeason" />
      <CompRow label="Winrate Surface" val1={report.p1.winrateSurface} val2={report.p2.winrateSurface} field="winrateSurface" />
      <CompRow label="Aces / Match" val1={report.p1.aces} val2={report.p2.aces} field="aces" />
      <CompRow label="Doubles Fautes" val1={report.p1.doubleFaults} val2={report.p2.doubleFaults} field="doubleFaults" />
      <CompRow label="% 1ère Balle" val1={report.p1.firstServe} val2={report.p2.firstServe} field="firstServe" />
      <div className="h-1 bg-neutral-900 border-y border-neutral-800"></div>
      <CompRow label="Forme (1-10)" val1={report.p1.form} val2={report.p2.form} field="form" />
      <CompRow label="Blessures" val1={report.p1.injury} val2={report.p2.injury} field="injury" />
      <CompRow label="Motivation" val1={report.p1.motivation} val2={report.p2.motivation} field="motivation" />

      {/* 3. STATISTIQUES LIVE (Structure prête pour les chiffres) */}
      <SectionHeader title="Statistiques Live (Set 1)" icon={Activity} color="text-neon" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-neutral-800 border-b border-neutral-800">
          <div>
             <div className="bg-neutral-900/30 p-1 text-center text-[10px] text-gray-500 font-bold">SERVICE</div>
             <CompRow label="Aces" val1={report.p1.aces} val2={report.p2.aces} field="aces" />
             <CompRow label="% 1er Serv." val1={report.p1.firstServe} val2={report.p2.firstServe} field="firstServe" />
             <CompRow label="Pts Gagnés Serv." val1="-" val2="-" field="temp" />
          </div>
          <div>
             <div className="bg-neutral-900/30 p-1 text-center text-[10px] text-gray-500 font-bold">RETOUR</div>
             <CompRow label="Pts Retour" val1="-" val2="-" field="temp" />
             <CompRow label="Breaks" val1="-" val2="-" field="temp" />
             <CompRow label="Total Points" val1="-" val2="-" field="temp" />
          </div>
      </div>

      {/* 4. ANALYSE PROFONDE (Météo, Bookmaker, H2H) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-neutral-800 border-t border-neutral-700">
          
          {/* GAUCHE : CONDITIONS & BOOKMAKER */}
          <div>
              <SectionHeader title="Conditions & Cotes" icon={Thermometer} color="text-orange-400" />
              <SimpleRow label="Météo" val={report.conditions.weather} section="conditions" field="weather" />
              <SimpleRow label="Vent / Alt." val={`${report.conditions.wind} / ${report.conditions.altitude}`} section="conditions" field="wind" />
              <SimpleRow label="Cotes Live" val={`J1: ${report.bookmaker.oddA} | J2: ${report.bookmaker.oddB}`} section="bookmaker" field="oddA" />
              <SimpleRow label="Mouvement" val={report.bookmaker.movement || "-"} section="bookmaker" field="movement" />
              <SimpleRow label="Smart Money" val={report.bookmaker.smartMoney || "-"} section="bookmaker" field="smartMoney" />
          </div>

          {/* DROITE : H2H & SYNTHÈSE */}
          <div>
              <SectionHeader title="H2H & Synthèse" icon={Brain} color="text-purple-400" />
              <SimpleRow label="H2H Global" val={report.h2h.global} section="h2h" field="global" />
              <SimpleRow label="Sur Surface" val={report.h2h.surface} section="h2h" field="surface" />
              <SimpleRow label="Mental" val={report.synthesis.mental} section="synthesis" field="mental" />
              <SimpleRow label="Risque" val={report.synthesis.risk} section="synthesis" field="risk" />
              <div className="flex border-b border-neutral-800 h-9 bg-red-900/10">
                 <div className="w-32 bg-neutral-900/50 flex items-center px-3 text-[10px] font-bold text-red-400 uppercase border-r border-neutral-800">
                    <AlertTriangle size={12} className="mr-2"/> Facteur X
                 </div>
                 <input 
                    value={report.synthesis.xFactor} 
                    onChange={(e) => updateNested('synthesis', 'xFactor', e.target.value)}
                    className="flex-1 bg-transparent px-3 text-sm text-red-300 outline-none font-bold"
                 />
              </div>
          </div>
      </div>

      <div className="p-2 bg-neutral-950 text-center border-t border-neutral-800">
          <p className="text-[10px] text-gray-600">Données "God Mode" récupérées via Web Scraping. Modifiables manuellement.</p>
      </div>

    </div>
  );
};
