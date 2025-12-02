import React from 'react';
import { H2HFullProfile } from '../engine/types';
import { User, Cloud, Activity, ExternalLink, Brain, Shield, Swords } from 'lucide-react';

interface Props {
  data: H2HFullProfile;
  p1Name: string;
  p2Name: string;
}

export const DetailedH2H: React.FC<Props> = ({ data, p1Name, p2Name }) => {
  return (
    <div className="space-y-6 animate-fade-in mt-6">
      
      {/* 1. PROFIL ATHLÉTIQUE & MAIN */}
      <div className="bg-surface border border-neutral-700 rounded-xl overflow-hidden">
        <div className="bg-neutral-900 p-3 border-b border-neutral-700 flex items-center gap-2">
           <User size={16} className="text-neon" />
           <h4 className="text-xs font-bold text-white uppercase">Identité & Physique</h4>
        </div>
        <div className="grid grid-cols-3 text-xs text-center divide-x divide-neutral-800 bg-black/20">
            <div className="p-2 font-bold text-white truncate">{p1Name}</div>
            <div className="p-2 text-gray-500 font-mono">VS</div>
            <div className="p-2 font-bold text-white truncate">{p2Name}</div>

            {/* Main */}
            <div className={`p-2 font-bold ${data.p1.hand === 'GAUCHER' ? 'text-red-400' : 'text-gray-300'}`}>{data.p1.hand}</div>
            <div className="p-2 text-gray-600">Main</div>
            <div className={`p-2 font-bold ${data.p2.hand === 'GAUCHER' ? 'text-red-400' : 'text-gray-300'}`}>{data.p2.hand}</div>

            {/* Age/Taille */}
            <div className="p-2 text-gray-300">{data.p1.age} / {data.p1.height}</div>
            <div className="p-2 text-gray-600">Age / Taille</div>
            <div className="p-2 text-gray-300">{data.p2.age} / {data.p2.height}</div>

            {/* Classement */}
            <div className="p-2 text-neon">{data.p1.rank} (Best: {data.p1.bestRank})</div>
            <div className="p-2 text-gray-600">Rank</div>
            <div className="p-2 text-neon">{data.p2.rank} (Best: {data.p2.bestRank})</div>
        </div>
      </div>

      {/* 2. MENTAL & CLUTCH (NOUVEAU) */}
      <div className="bg-surface border border-neutral-700 rounded-xl overflow-hidden">
        <div className="bg-neutral-900 p-3 border-b border-neutral-700 flex items-center gap-2">
           <Brain size={16} className="text-purple-500" />
           <h4 className="text-xs font-bold text-white uppercase">Mental & Pression</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
            <div>
                <p className="text-xs text-gray-500 mb-1 text-center">{p1Name}</p>
                <div className="bg-black/40 p-2 rounded border border-neutral-800 text-center">
                    <p className="text-[10px] text-gray-400 uppercase">Balles de Break Sauvées</p>
                    <p className="text-lg font-bold text-white">{data.stats.p1.breakPointsSaved}</p>
                </div>
                <div className="mt-2 text-xs text-center text-gray-400">
                    Comportement: <span className="text-white">{data.behavior.p1VsHand}</span>
                </div>
            </div>
            <div>
                <p className="text-xs text-gray-500 mb-1 text-center">{p2Name}</p>
                <div className="bg-black/40 p-2 rounded border border-neutral-800 text-center">
                    <p className="text-[10px] text-gray-400 uppercase">Balles de Break Sauvées</p>
                    <p className="text-lg font-bold text-white">{data.stats.p2.breakPointsSaved}</p>
                </div>
                <div className="mt-2 text-xs text-center text-gray-400">
                    Comportement: <span className="text-white">{data.behavior.p2VsHand}</span>
                </div>
            </div>
        </div>
      </div>

      {/* 3. CONTEXTE & H2H */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-neutral-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Cloud size={16} /> <span className="text-xs font-bold uppercase">Météo & Court</span>
              </div>
              <p className="text-sm text-gray-300">{data.context.weather}</p>
              <p className="text-xs text-gray-500 mt-1">Vitesse estimée : {data.context.surfaceSpeed}</p>
          </div>
          <div className="bg-surface border border-neutral-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-red-400">
                  <Swords size={16} /> <span className="text-xs font-bold uppercase">H2H Direct</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                  {data.h2hMatches.length > 0 ? data.h2hMatches.map((m, i) => (
                      <div key={i} className="flex justify-between border-b border-neutral-800 pb-1">
                          <span>{m.date}</span>
                          <span className="text-white">{m.score}</span>
                      </div>
                  )) : <span className="text-xs text-gray-500">Aucune confrontation récente trouvée.</span>}
              </div>
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
