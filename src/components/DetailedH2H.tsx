import React from 'react';
import { H2HFullProfile } from '../engine/types';
import { User, Map, Trophy, Cloud, Activity, ExternalLink, Edit3 } from 'lucide-react';

interface Props {
  data: H2HFullProfile;
  p1Name: string;
  p2Name: string;
}

export const DetailedH2H: React.FC<Props> = ({ data, p1Name, p2Name }) => {
  return (
    <div className="space-y-6 animate-fade-in mt-6">
      
      {/* Section 1: Comparatif Physique */}
      <div className="bg-surface border border-neutral-700 rounded-xl overflow-hidden">
        <div className="bg-neutral-900 p-3 border-b border-neutral-700 flex items-center gap-2">
           <User size={16} className="text-neon" />
           <h4 className="text-sm font-bold text-white uppercase">Profil Athlétique</h4>
        </div>
        <div className="grid grid-cols-3 text-sm text-center divide-x divide-neutral-800 text-gray-300">
            <div className="p-3 font-bold text-white">{p1Name}</div>
            <div className="p-3 text-gray-500 text-xs bg-neutral-900/50">VS</div>
            <div className="p-3 font-bold text-white">{p2Name}</div>

            <div className="p-3 border-t border-neutral-800">{data.p1.rank || "N/A"}</div>
            <div className="p-3 text-gray-500 text-xs border-t border-neutral-800">Rang</div>
            <div className="p-3 border-t border-neutral-800">{data.p2.rank || "N/A"}</div>

            <div className="p-3 border-t border-neutral-800">{data.p1.age}</div>
            <div className="p-3 text-gray-500 text-xs border-t border-neutral-800">Age</div>
            <div className="p-3 border-t border-neutral-800">{data.p2.age}</div>

            <div className="p-3 border-t border-neutral-800">{data.p1.height}</div>
            <div className="p-3 text-gray-500 text-xs border-t border-neutral-800">Taille</div>
            <div className="p-3 border-t border-neutral-800">{data.p2.height}</div>
        </div>
      </div>

      {/* Section 2: Contexte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-neutral-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Cloud size={16} /> <span className="text-xs font-bold uppercase">Météo & Conditions</span>
              </div>
              {/* CORRECTION : on utilise context, pas conditions */}
              <p className="text-sm text-gray-300">{data.context?.weather || "Non défini"}</p>
              <p className="text-xs text-gray-500 mt-1">Altitude: {data.context?.altitude || "-"}</p>
          </div>
          <div className="bg-surface border border-neutral-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                  <Activity size={16} /> <span className="text-xs font-bold uppercase">Derniers H2H</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1 max-h-32 overflow-y-auto">
                  {data.h2hMatches.map((m, i) => (
                      <div key={i} className="flex justify-between border-b border-neutral-800 pb-1 last:border-0">
                          <span className="text-xs text-gray-500">{m.date}</span>
                          <span className="text-white font-mono text-xs">{m.score}</span>
                      </div>
                  ))}
                  {data.h2hMatches.length === 0 && <span className="text-xs text-gray-500">Aucune donnée directe trouvée.</span>}
              </div>
          </div>
      </div>
      
      {/* Zone Manuelle (Human) */}
      {data.human && (
        <div className="bg-yellow-900/10 border border-yellow-500/30 p-3 rounded-xl flex items-start gap-3">
            <Edit3 size={16} className="text-yellow-500 mt-1" />
            <div>
                <h5 className="text-xs font-bold text-yellow-500 uppercase">Note Personnelle</h5>
                <p className="text-sm text-gray-300">{data.human.note}</p>
            </div>
        </div>
      )}

      {/* Sources */}
      <div className="text-[10px] text-gray-600 flex flex-wrap gap-2">
          <span>Sources :</span>
          {data.sources.map((s, i) => (
              <a key={i} href={s} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                  Lien {i+1} <ExternalLink size={8}/>
              </a>
          ))}
      </div>

    </div>
  );
};
