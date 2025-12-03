import React from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Edit3, Activity, TrendingUp, Zap } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate }) => {
  
  // Fonction générique pour mettre à jour n'importe quel champ
  const update = (player: 'p1' | 'p2', key: string, val: string) => {
    const newReport = { ...report };
    // @ts-ignore
    newReport[player][key] = val;
    onUpdate(newReport);
  };

  // --- COMPOSANT LIGNE (La structure 3 colonnes parfaite) ---
  const StatRow = ({ label, val1, val2, field }: { label: string, val1: string, val2: string, field: string }) => (
    <div className="grid grid-cols-[1fr_160px_1fr] border-b border-neutral-800 hover:bg-white/5 transition-colors items-center h-10">
        {/* JOUEUR 1 (Aligné Droite) */}
        <input 
            type="text" 
            value={val1} 
            onChange={(e) => update('p1', field, e.target.value)}
            className="bg-transparent text-right pr-4 text-sm text-white font-mono font-bold outline-none w-full focus:text-neon"
        />
        
        {/* CRITÈRE (Centré, Fond sombre) */}
        <div className="bg-black/40 h-full flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase tracking-widest border-x border-neutral-800">
            {label}
        </div>

        {/* JOUEUR 2 (Aligné Gauche) */}
        <input 
            type="text" 
            value={val2} 
            onChange={(e) => update('p2', field, e.target.value)}
            className="bg-transparent text-left pl-4 text-sm text-white font-mono font-bold outline-none w-full focus:text-neon"
        />
    </div>
  );

  const SectionTitle = ({ title, icon: Icon }: { title: string, icon: any }) => (
      <div className="bg-surfaceHighlight p-2 flex items-center justify-center gap-2 border-y border-neutral-700 mt-4 first:mt-0">
          <Icon size={14} className="text-neon"/>
          <span className="text-xs font-black text-white uppercase tracking-widest">{title}</span>
      </div>
  );

  return (
    <div className="mt-6 bg-black border border-neutral-700 rounded-xl overflow-hidden shadow-2xl">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-3 flex justify-between items-center border-b border-neutral-700">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Edit3 size={16} className="text-neon"/> FICHE MATCH V2 (GOD MODE)
          </h3>
          <div className="flex gap-4 text-xs">
             <span className="text-blue-400 font-bold">{report.identity.p1Name}</span>
             <span className="text-gray-600">VS</span>
             <span className="text-orange-400 font-bold">{report.identity.p2Name}</span>
          </div>
      </div>

      {/* 1. PROFILS COMPARATIFS */}
      <SectionTitle title="Profils Comparatifs" icon={TrendingUp} />
      
      <StatRow label="Classement" val1={report.p1.rank} val2={report.p2.rank} field="rank" />
      <StatRow label="Meilleur Class." val1={report.p1.bestRank} val2={report.p2.bestRank} field="bestRank" />
      <StatRow label="Âge / Taille" val1={report.p1.ageHeight} val2={report.p2.ageHeight} field="ageHeight" />
      <StatRow label="Nationalité" val1={report.p1.nationality} val2={report.p2.nationality} field="nationality" />
      <StatRow label="Main" val1={report.p1.hand} val2={report.p2.hand} field="hand" />
      <div className="h-1 bg-neutral-800"></div>
      <StatRow label="Winrate Saison" val1={report.p1.winrateSeason} val2={report.p2.winrateSeason} field="winrateSeason" />
      <StatRow label="Winrate Surface" val1={report.p1.winrateSurface} val2={report.p2.winrateSurface} field="winrateSurface" />
      <StatRow label="Aces / Match" val1={report.p1.aces} val2={report.p2.aces} field="aces" />
      <StatRow label="Doubles Fautes" val1={report.p1.doubleFaults} val2={report.p2.doubleFaults} field="doubleFaults" />
      <StatRow label="% 1ère Balle" val1={report.p1.firstServe} val2={report.p2.firstServe} field="firstServe" />
      <div className="h-1 bg-neutral-800"></div>
      <StatRow label="Forme (1-10)" val1={report.p1.form} val2={report.p2.form} field="form" />
      <StatRow label="Blessures" val1={report.p1.injury} val2={report.p2.injury} field="injury" />
      <StatRow label="Motivation" val1={report.p1.motivation} val2={report.p2.motivation} field="motivation" />

      {/* 2. STATISTIQUES LIVE (STRUCTURE PRÊTE) */}
      {/* Pour l'instant on utilise les champs libres 'serveStats' et 'returnStats' pour simuler */}
      
      <SectionTitle title="Statistiques Service (Live/Simu)" icon={Activity} />
      <StatRow label="Aces" val1={report.p1.aces} val2={report.p2.aces} field="aces" />
      <StatRow label="% Pts 1er Serv." val1={report.p1.serveStats || "-"} val2={report.p2.serveStats || "-"} field="serveStats" />
      <StatRow label="Jeux Service Gagnés" val1="-" val2="-" field="temp" />

      <SectionTitle title="Statistiques Retour (Live/Simu)" icon={Zap} />
      <StatRow label="Pts Retour Gagnés" val1={report.p1.returnStats || "-"} val2={report.p2.returnStats || "-"} field="returnStats" />
      <StatRow label="Breaks Convertis" val1="-" val2="-" field="temp" />

      {/* FOOTER */}
      <div className="p-2 bg-neutral-900 text-center border-t border-neutral-700">
          <p className="text-[10px] text-gray-500">Toutes les données sont modifiables en cliquant dessus.</p>
      </div>

    </div>
  );
};
