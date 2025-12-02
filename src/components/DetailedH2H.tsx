import React from 'react';
import { H2HFullProfile } from '../engine/types';
import { User, Cloud, Activity, ExternalLink, Brain, HeartPulse, MessageCircle, Eye } from 'lucide-react';

interface Props {
  data: H2HFullProfile;
  p1Name: string;
  p2Name: string;
}

export const DetailedH2H: React.FC<Props> = ({ data, p1Name, p2Name }) => {
  return (
    <div className="space-y-6 animate-fade-in mt-6">
      
      {/* 1. PROFIL & PHYSIQUE */}
      <div className="bg-surface border border-neutral-700 rounded-xl overflow-hidden">
        <div className="bg-neutral-900 p-3 border-b border-neutral-700 flex items-center gap-2">
           <User size={16} className="text-neon" />
           <h4 className="text-xs font-bold text-white uppercase">Identité & Profil</h4>
        </div>
        <div className="grid grid-cols-3 text-xs text-center divide-x divide-neutral-800 bg-black/20">
            <div className="p-2 font-bold text-white truncate">{p1Name}</div>
            <div className="p-2 text-gray-500">VS</div>
            <div className="p-2 font-bold text-white truncate">{p2Name}</div>

            <div className="p-2 text-neon">{data.p1.rank}</div>
            <div className="p-2 text-gray-600">Classement</div>
            <div className="p-2 text-neon">{data.p2.rank}</div>

            <div className="p-2 text-gray-300">{data.p1.style}</div>
            <div className="p-2 text-gray-600">Style</div>
            <div className="p-2 text-gray-300">{data.p2.style}</div>
        </div>
      </div>

      {/* 2. FACTEURS HUMAINS (Mental, Blessures, Social) */}
      <div className="bg-surface border border-neutral-700 rounded-xl overflow-hidden">
         <div className="bg-neutral-900 p-3 border-b border-neutral-700 flex items-center gap-2">
            <Eye size={16} className="text-purple-500" />
            <h4 className="text-xs font-bold text-white uppercase">Analyse Humaine & Sociale (Deep Web)</h4>
         </div>
         
         <div className="grid grid-cols-2 divide-x divide-neutral-800">
             {/* P1 */}
             <div className="p-3 space-y-3">
                 <p className="text-xs font-bold text-center mb-2 text-gray-400">{p1Name}</p>
                 
                 <div className={`p-2 rounded border ${data.human.p1.physical.injuryStatus.includes("ALERTE") ? 'bg-red-900/20 border-red-500/50 text-red-300' : 'bg-green-900/10 border-green-500/30 text-green-400'}`}>
                     <div className="flex items-center gap-2 mb-1"><HeartPulse size={12}/> <span className="text-[10px] font-bold uppercase">Physique</span></div>
                     <p className="text-xs">{data.human.p1.physical.injuryStatus}</p>
                 </div>

                 <div className="p-2 rounded bg-black/30 border border-neutral-700">
                     <div className="flex items-center gap-2 mb-1 text-blue-400"><Brain size={12}/> <span className="text-[10px] font-bold uppercase">Mental</span></div>
                     <p className="text-xs text-gray-300">{data.human.p1.mental.state}</p>
                 </div>

                 <div className="p-2 rounded bg-black/30 border border-neutral-700">
                     <div className="flex items-center gap-2 mb-1 text-orange-400"><MessageCircle size={12}/> <span className="text-[10px] font-bold uppercase">Social / Hype</span></div>
                     <p className="text-xs text-gray-300">{data.human.p1.social.redditMood}</p>
                 </div>
             </div>

             {/* P2 */}
             <div className="p-3 space-y-3">
                 <p className="text-xs font-bold text-center mb-2 text-gray-400">{p2Name}</p>
                 
                 <div className={`p-2 rounded border ${data.human.p2.physical.injuryStatus.includes("ALERTE") ? 'bg-red-900/20 border-red-500/50 text-red-300' : 'bg-green-900/10 border-green-500/30 text-green-400'}`}>
                     <div className="flex items-center gap-2 mb-1"><HeartPulse size={12}/> <span className="text-[10px] font-bold uppercase">Physique</span></div>
                     <p className="text-xs">{data.human.p2.physical.injuryStatus}</p>
                 </div>

                 <div className="p-2 rounded bg-black/30 border border-neutral-700">
                     <div className="flex items-center gap-2 mb-1 text-blue-400"><Brain size={12}/> <span className="text-[10px] font-bold uppercase">Mental</span></div>
                     <p className="text-xs text-gray-300">{data.human.p2.mental.state}</p>
                 </div>

                 <div className="p-2 rounded bg-black/30 border border-neutral-700">
                     <div className="flex items-center gap-2 mb-1 text-orange-400"><MessageCircle size={12}/> <span className="text-[10px] font-bold uppercase">Social / Hype</span></div>
                     <p className="text-xs text-gray-300">{data.human.p2.social.redditMood}</p>
                 </div>
             </div>
         </div>
      </div>

      {/* 3. CONTEXTE */}
      <div className="bg-surface border border-neutral-700 rounded-xl p-4 flex items-center justify-between">
          <div>
              <div className="flex items-center gap-2 mb-1 text-blue-400">
                  <Cloud size={16} /> <span className="text-xs font-bold uppercase">Conditions de Jeu</span>
              </div>
              <p className="text-sm text-gray-300">{data.context.weather}</p>
          </div>
          <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase">Type Balle / Court</p>
              <p className="text-xs text-white font-bold">{data.context.conditions}</p>
          </div>
      </div>

      <div className="text-[10px] text-gray-600 flex flex-wrap gap-2 justify-center">
          {data.sources.map((s, i) => (
              <a key={i} href={s} target="_blank" className="text-blue-500 hover:underline flex items-center gap-1">
                  Source {i+1} <ExternalLink size={8}/>
              </a>
          ))}
      </div>
    </div>
  );
};
