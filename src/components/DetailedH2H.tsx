import React from 'react';
import { H2HFullProfile } from '../engine/types';
import { User, Cloud, Activity, ExternalLink, Brain, HeartPulse, MessageCircle, Trophy, Map, Wind, Thermometer, AlertTriangle } from 'lucide-react';

interface Props {
  data: H2HFullProfile;
  p1Name: string;
  p2Name: string;
}

export const DetailedH2H: React.FC<Props> = ({ data, p1Name, p2Name }) => {
  
  const StatRow = ({ label, v1, v2, color = "text-gray-300" }: { label: string, v1: string, v2: string, color?: string }) => (
    <div className="grid grid-cols-3 text-center py-2 border-b border-neutral-800 text-xs">
        <div className={`font-bold ${color}`}>{v1}</div>
        <div className="text-gray-600 uppercase tracking-tighter text-[10px] flex items-center justify-center">{label}</div>
        <div className={`font-bold ${color}`}>{v2}</div>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in mt-4">
      
      {/* 1. PROFIL & PHYSIQUE (La Base) */}
      <div className="bg-surface border border-neutral-700 rounded-xl overflow-hidden">
        <div className="bg-neutral-900 p-2 text-center flex items-center justify-center gap-2 border-b border-neutral-700">
           <User size={14} className="text-neon" />
           <span className="text-xs font-bold text-white uppercase">Identité & Physique</span>
        </div>
        <div className="grid grid-cols-3 bg-black/20 text-center py-2 text-xs font-bold text-white border-b border-neutral-800">
             <div className="truncate px-1">{p1Name}</div>
             <div className="text-gray-500">VS</div>
             <div className="truncate px-1">{p2Name}</div>
        </div>
        
        <StatRow label="Classement ATP/WTA" v1={data.p1.rank} v2={data.p2.rank} color="text-neon" />
        <StatRow label="Meilleur Class." v1={data.p1.rank.includes("Top") ? "Top 10" : "N/A"} v2={data.p2.rank.includes("Top") ? "Top 10" : "N/A"} />
        <StatRow label="Âge / Main" v1={`${data.p1.age} / ${data.p1.hand}`} v2={`${data.p2.age} / ${data.p2.hand}`} />
        <StatRow label="Taille" v1={data.p1.height} v2={data.p2.height} />
        <StatRow label="Style de Jeu" v1={data.p1.style} v2={data.p2.style} color="text-blue-300" />
      </div>

      {/* 2. STATS SURFACE & FORME (Le Sportif) */}
      <div className="bg-surface border border-neutral-700 rounded-xl overflow-hidden">
        <div className="bg-neutral-900 p-2 text-center flex items-center justify-center gap-2 border-b border-neutral-700">
           <Trophy size={14} className="text-yellow-500" />
           <span className="text-xs font-bold text-white uppercase">Performance & Surface</span>
        </div>
        <StatRow label="Winrate Surface" v1={data.surfaceStats.clay.p1 !== '-' ? data.surfaceStats.clay.p1 : "50%"} v2={data.surfaceStats.clay.p2 !== '-' ? data.surfaceStats.clay.p2 : "50%"} />
        <StatRow label="Balles Break Sauvées" v1={data.stats.p1.breakPointsSaved} v2={data.stats.p2.breakPointsSaved} />
        <StatRow label="Qualité Service" v1={data.stats.p1.serveRating} v2={data.stats.p2.serveRating} />
        <StatRow label="Qualité Retour" v1={data.stats.p1.returnRating} v2={data.stats.p2.returnRating} />
      </div>

      {/* 3. FACTEURS HUMAINS & SOCIAUX (L'Edge) */}
      <div className="grid grid-cols-2 gap-4">
          
          {/* Joueur 1 */}
          <div className="bg-surface border border-neutral-700 rounded-xl p-3 space-y-3">
              <p className="text-xs font-bold text-center text-white mb-2 truncate">{p1Name}</p>
              
              <div className={`p-2 rounded border text-center ${data.human.p1.physical.injuryStatus.includes("ALERTE") ? 'bg-red-900/20 border-red-500 text-red-300' : 'bg-green-900/10 border-green-500/30 text-green-400'}`}>
                  <div className="flex justify-center items-center gap-1 mb-1"><HeartPulse size={12}/><span className="text-[9px] uppercase font-bold">Physique</span></div>
                  <p className="text-[10px] leading-tight">{data.human.p1.physical.injuryStatus}</p>
                  <p className="text-[9px] mt-1 opacity-70">{data.human.p1.physical.fatigue}</p>
              </div>

              <div className="p-2 rounded bg-black/30 border border-neutral-800 text-center">
                  <div className="flex justify-center items-center gap-1 mb-1 text-purple-400"><Brain size={12}/><span className="text-[9px] uppercase font-bold">Mental</span></div>
                  <p className="text-[10px] text-gray-300">{data.human.p1.mental.state}</p>
                  <p className="text-[9px] mt-1 text-gray-500">Motiv: {data.human.p1.mental.motivation}</p>
              </div>

              <div className="p-2 rounded bg-black/30 border border-neutral-800 text-center">
                  <div className="flex justify-center items-center gap-1 mb-1 text-blue-400"><MessageCircle size={12}/><span className="text-[9px] uppercase font-bold">Social</span></div>
                  <p className="text-[10px] text-gray-300">{data.human.p1.social.redditMood}</p>
              </div>
          </div>

          {/* Joueur 2 */}
          <div className="bg-surface border border-neutral-700 rounded-xl p-3 space-y-3">
              <p className="text-xs font-bold text-center text-white mb-2 truncate">{p2Name}</p>
              
              <div className={`p-2 rounded border text-center ${data.human.p2.physical.injuryStatus.includes("ALERTE") ? 'bg-red-900/20 border-red-500 text-red-300' : 'bg-green-900/10 border-green-500/30 text-green-400'}`}>
                  <div className="flex justify-center items-center gap-1 mb-1"><HeartPulse size={12}/><span className="text-[9px] uppercase font-bold">Physique</span></div>
                  <p className="text-[10px] leading-tight">{data.human.p2.physical.injuryStatus}</p>
                  <p className="text-[9px] mt-1 opacity-70">{data.human.p2.physical.fatigue}</p>
              </div>

              <div className="p-2 rounded bg-black/30 border border-neutral-800 text-center">
                  <div className="flex justify-center items-center gap-1 mb-1 text-purple-400"><Brain size={12}/><span className="text-[9px] uppercase font-bold">Mental</span></div>
                  <p className="text-[10px] text-gray-300">{data.human.p2.mental.state}</p>
                  <p className="text-[9px] mt-1 text-gray-500">Motiv: {data.human.p2.mental.motivation}</p>
              </div>

              <div className="p-2 rounded bg-black/30 border border-neutral-800 text-center">
                  <div className="flex justify-center items-center gap-1 mb-1 text-blue-400"><MessageCircle size={12}/><span className="text-[9px] uppercase font-bold">Social</span></div>
                  <p className="text-[10px] text-gray-300">{data.human.p2.social.redditMood}</p>
              </div>
          </div>
      </div>

      {/* 4. CONTEXTE & MÉTÉO */}
      <div className="bg-black/40 border border-neutral-800 p-3 rounded-xl flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
              <Wind size={14}/> {data.context.weather}
          </div>
          <div className="flex items-center gap-2 text-orange-400 text-xs font-bold">
              <Map size={14}/> {data.context.conditions}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Activity size={14}/> {data.context.tournamentLevel}
          </div>
      </div>
      
      {/* 5. H2H MATCHS */}
      <div className="bg-surface border border-neutral-700 rounded-xl overflow-hidden">
         <div className="bg-neutral-900 p-2 text-center text-xs font-bold text-gray-400 border-b border-neutral-700">HISTORIQUE FACE À FACE</div>
         <div className="p-2 space-y-1">
            {data.h2hMatches.length > 0 ? data.h2hMatches.map((m, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-300 border-b border-white/5 pb-1 last:border-0">
                    <span>{m.date}</span>
                    <span className="text-white font-mono">{m.score}</span>
                </div>
            )) : <div className="text-center text-[10px] text-gray-500 py-2">Aucune confrontation directe trouvée sur le web.</div>}
         </div>
      </div>

    </div>
  );
};
