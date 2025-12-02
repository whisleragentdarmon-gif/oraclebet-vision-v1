import React from 'react';
import { H2HFullProfile } from '../engine/types';
import { User, Cloud, Activity, ExternalLink, Brain, Trophy, TrendingUp } from 'lucide-react';

interface Props {
  data: H2HFullProfile;
  p1Name: string;
  p2Name: string;
}

export const DetailedH2H: React.FC<Props> = ({ data, p1Name, p2Name }) => {
  
  // Composant de ligne comparative
  const StatRow = ({ label, v1, v2, highlight = false }: { label: string, v1: string, v2: string, highlight?: boolean }) => (
    <div className={`grid grid-cols-3 text-center py-2 border-b border-neutral-800 ${highlight ? 'bg-white/5' : ''}`}>
        <div className={`font-bold ${highlight ? 'text-neon' : 'text-gray-300'}`}>{v1}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider flex items-center justify-center">{label}</div>
        <div className={`font-bold ${highlight ? 'text-neon' : 'text-gray-300'}`}>{v2}</div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in mt-4">
      
      {/* EN-TÊTE JOUEURS */}
      <div className="flex justify-between items-center px-4">
          <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-lg font-bold text-white mb-2 shadow-lg shadow-blue-500/20 mx-auto">
                  {p1Name.charAt(0)}
              </div>
              <p className="font-bold text-white text-sm">{p1Name}</p>
          </div>
          <div className="text-xs font-bold text-gray-500 bg-black/40 px-3 py-1 rounded-full">VS</div>
          <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-orange-900 flex items-center justify-center text-lg font-bold text-white mb-2 shadow-lg shadow-orange-500/20 mx-auto">
                  {p2Name.charAt(0)}
              </div>
              <p className="font-bold text-white text-sm">{p2Name}</p>
          </div>
      </div>

      {/* TABLEAU COMPARATIF STYLE "TENNIS TONIC" */}
      <div className="bg-surface border border-neutral-700 rounded-xl overflow-hidden">
        <div className="bg-neutral-900 p-2 text-center text-xs font-bold text-gray-400 border-b border-neutral-700">PROFIL ATHLÉTIQUE</div>
        
        <StatRow label="Classement ATP" v1={data.p1.rank} v2={data.p2.rank} highlight />
        <StatRow label="Âge" v1={data.p1.age} v2={data.p2.age} />
        <StatRow label="Taille" v1={data.p1.height} v2={data.p2.height} />
        <StatRow label="Main" v1={data.p1.hand} v2={data.p2.hand} />
        
        <div className="bg-neutral-900 p-2 text-center text-xs font-bold text-gray-400 border-y border-neutral-700 mt-2">STATS SURFACE (Est. 2024)</div>
        <StatRow label="Terre Battue" v1={data.p1.style.includes('Terre') ? 'Expert' : '-'} v2={data.p2.style.includes('Terre') ? 'Expert' : '-'} />
        <StatRow label="Dur / Indoor" v1={data.p1.style.includes('Serveur') ? 'Expert' : '-'} v2={data.p2.style.includes('Serveur') ? 'Expert' : '-'} />

        <div className="bg-neutral-900 p-2 text-center text-xs font-bold text-gray-400 border-y border-neutral-700 mt-2">FACTEURS HUMAINS</div>
        <div className="grid grid-cols-2 divide-x divide-neutral-800">
            <div className="p-3 text-center">
                <p className={`text-xs font-bold mb-1 ${data.human.p1.physical.injuryStatus.includes('ALERTE') ? 'text-red-500' : 'text-green-500'}`}>
                    {data.human.p1.physical.injuryStatus}
                </p>
                <p className="text-[10px] text-gray-500">État Physique</p>
            </div>
            <div className="p-3 text-center">
                <p className={`text-xs font-bold mb-1 ${data.human.p2.physical.injuryStatus.includes('ALERTE') ? 'text-red-500' : 'text-green-500'}`}>
                    {data.human.p2.physical.injuryStatus}
                </p>
                <p className="text-[10px] text-gray-500">État Physique</p>
            </div>
        </div>
      </div>

      {/* CONTEXTE */}
      <div className="bg-black/30 border border-neutral-800 rounded-lg p-3 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
              <Cloud size={14} className="text-blue-400"/> {data.context.weather}
          </div>
          <div className="flex items-center gap-2">
              <Trophy size={14} className="text-yellow-400"/> {data.context.tournamentLevel || "Tournoi"}
          </div>
      </div>

      {/* SOURCES */}
      <div className="text-[10px] text-gray-600 flex flex-wrap gap-2 justify-center">
          {data.sources.map((s, i) => (
              <a key={i} href={s} target="_blank" className="text-blue-600 hover:text-blue-400 underline">Source {i+1}</a>
          ))}
      </div>
    </div>
  );
};
