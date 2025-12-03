import React from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Save, Edit3, Trophy, Activity, Thermometer, DollarSign, Zap, AlertTriangle, TrendingUp } from 'lucide-react';

interface Props {
  report: GodModeReportV2;
  onUpdate: (newReport: GodModeReportV2) => void;
}

export const GodModeTable: React.FC<Props> = ({ report, onUpdate }) => {
  
  const updateNested = (path: string[], val: string) => {
    const newReport = { ...report };
    let current: any = newReport;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = val;
    onUpdate(newReport);
  };

  const SectionHeader = ({ title, icon: Icon, color }: { title: string, icon: any, color: string }) => (
      <div className={`p-2 flex items-center justify-center gap-2 bg-neutral-950 border-y border-neutral-800 mt-4 ${color}`}>
          <Icon size={14} />
          <span className="text-xs font-black uppercase tracking-widest">{title}</span>
      </div>
  );

  const CompRow = ({ label, val1, val2, path1, path2 }: any) => (
    <div className="grid grid-cols-[1fr_140px_1fr] border-b border-neutral-800 hover:bg-white/5 h-8">
        <input value={val1} onChange={(e) => updateNested(path1, e.target.value)} className="bg-transparent text-right pr-3 text-xs text-white font-bold outline-none w-full"/>
        <div className="bg-neutral-900/80 flex items-center justify-center text-[9px] font-bold text-gray-500 uppercase border-x border-neutral-800">{label}</div>
        <input value={val2} onChange={(e) => updateNested(path2, e.target.value)} className="bg-transparent text-left pl-3 text-xs text-white font-bold outline-none w-full"/>
    </div>
  );

  const SimpleRow = ({ label, val, path }: any) => (
    <div className="flex border-b border-neutral-800 h-8">
        <div className="w-32 bg-neutral-900/50 flex items-center px-3 text-[9px] font-bold text-gray-400 uppercase border-r border-neutral-800">{label}</div>
        <input value={val} onChange={(e) => updateNested(path, e.target.value)} className="flex-1 bg-transparent px-3 text-xs text-white outline-none"/>
    </div>
  );

  return (
    <div className="mt-6 bg-black border border-neutral-700 rounded-xl overflow-hidden shadow-2xl font-sans">
      
      {/* 1. HEADER */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-3 flex justify-between items-center">
          <h3 className="text-white font-bold text-sm flex items-center gap-2"><Edit3 size={14} className="text-neon"/> FICHE MATCH V2</h3>
          <button className="text-[10px] bg-black/40 text-white px-3 py-1 rounded border border-white/10 flex gap-1"><Save size={10}/> Sauver</button>
      </div>

      {/* 2. IDENTITÉ */}
      <div className="grid grid-cols-2 divide-x divide-neutral-800 border-b border-neutral-800">
          <div>
              <SimpleRow label="Tournoi" val={report.identity.tournament} path={['identity', 'tournament']} />
              <SimpleRow label="Surface" val={report.identity.surface} path={['identity', 'surface']} />
              <SimpleRow label="Date/Heure" val={report.identity.date} path={['identity', 'date']} />
          </div>
          <div>
              <SimpleRow label="Ville" val={report.identity.city} path={['identity', 'city']} />
              <SimpleRow label="Enjeu" val={report.identity.enjeu} path={['identity', 'enjeu']} />
              <SimpleRow label="Round" val={report.identity.round} path={['identity', 'round']} />
          </div>
      </div>

      {/* 3. PROFILS COMPARATIFS */}
      <SectionHeader title="Profils Joueurs" icon={Trophy} color="text-blue-400" />
      <CompRow label="Classement" val1={report.p1.rank} val2={report.p2.rank} path1={['p1', 'rank']} path2={['p2', 'rank']} />
      <CompRow label="Meilleur Class." val1={report.p1.bestRank} val2={report.p2.bestRank} path1={['p1', 'bestRank']} path2={['p2', 'bestRank']} />
      <CompRow label="Age" val1={report.p1.age} val2={report.p2.age} path1={['p1', 'age']} path2={['p2', 'age']} />
      <CompRow label="Nationalité" val1={report.p1.nationality} val2={report.p2.nationality} path1={['p1', 'nationality']} path2={['p2', 'nationality']} />
      <div className="h-1 bg-neutral-800"></div>
      <CompRow label="Winrate Année" val1={report.p1.winrateYear} val2={report.p2.winrateYear} path1={['p1', 'winrateYear']} path2={['p2', 'winrateYear']} />
      <CompRow label="Winrate Surface" val1={report.p1.winrateSurface} val2={report.p2.winrateSurface} path1={['p1', 'winrateSurface']} path2={['p2', 'winrateSurface']} />
      <CompRow label="Forme (1-10)" val1={report.p1.form} val2={report.p2.form} path1={['p1', 'form']} path2={['p2', 'form']} />
      <CompRow label="Blessures" val1={report.p1.injury} val2={report.p2.injury} path1={['p1', 'injury']} path2={['p2', 'injury']} />
      <CompRow label="Motivation" val1={report.p1.motivation} val2={report.p2.motivation} path1={['p1', 'motivation']} path2={['p2', 'motivation']} />

      {/* 4. CONDITIONS & BOOKMAKER */}
      <SectionHeader title="Conditions & Cotes" icon={Thermometer} color="text-orange-400" />
      <div className="grid grid-cols-2 divide-x divide-neutral-800">
          <div>
              <SimpleRow label="Météo" val={report.conditions.weather} path={['conditions', 'weather']} />
              <SimpleRow label="Vent" val={report.conditions.wind} path={['conditions', 'wind']} />
              <SimpleRow label="Vitesse Court" val={report.conditions.courtSpeed} path={['conditions', 'courtSpeed']} />
          </div>
          <div>
              <SimpleRow label="Cotes" val={`J1: ${report.bookmaker.p1Odd} | J2: ${report.bookmaker.p2Odd}`} path={['bookmaker', 'p1Odd']} />
              <SimpleRow label="Mouvement" val={report.bookmaker.movement} path={['bookmaker', 'movement']} />
              <SimpleRow label="Smart Money" val={report.bookmaker.smartMoney} path={['bookmaker', 'smartMoney']} />
          </div>
      </div>

      {/* 5. FACTEURS CRITIQUES */}
      <SectionHeader title="Facteurs Critiques" icon={AlertTriangle} color="text-red-400" />
      {report.factors.map((f, i) => (
          <div key={i} className="flex border-b border-neutral-800 h-8 items-center px-2 bg-neutral-900/30">
              <span className="text-[10px] font-bold text-red-400 w-24">{f.importance}</span>
              <span className="text-xs text-white flex-1">{f.factor}</span>
              <span className="text-[10px] font-bold text-green-400">{f.impact}</span>
          </div>
      ))}

      {/* 6. PRÉDICTION */}
      <SectionHeader title="Prédiction IA" icon={Zap} color="text-neon" />
      <div className="p-4 bg-neutral-900/50">
          <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-xs">Gagnant</span>
              <span className="text-neon font-bold">{report.prediction.winner} ({report.prediction.confidence})</span>
          </div>
          <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-xs">Meilleur Pari</span>
              <span className="text-white font-bold">{report.prediction.bestBet}</span>
          </div>
          <div className="flex justify-between">
              <span className="text-gray-400 text-xs">À éviter</span>
              <span className="text-red-400 font-bold">{report.prediction.avoidBet}</span>
          </div>
      </div>

    </div>
  );
};
