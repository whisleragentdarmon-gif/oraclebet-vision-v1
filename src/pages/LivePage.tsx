import React, { useState, useEffect } from 'react';
import { MatchCard } from '../components/MatchCard';
import { MatchDetailModal } from '../components/MatchDetailModal';
import { Match } from '../types';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { MatchService } from '../services/api'; 

// ⚠️ ON N'IMPORTE PLUS LES MOCK_MATCHES POUR FORCER LA VÉRITÉ

interface LivePageProps {
  filter: 'LIVE' | 'TODAY' | 'UPCOMING';
  title: string;
}

export const LivePage: React.FC<LivePageProps> = ({ filter, title }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [debugLog, setDebugLog] = useState<string>("En attente de connexion...");

  const loadData = async () => {
    setLoading(true);
    setDebugLog("Tentative de connexion à l'API via Vercel...");
    
    try {
        const realMatches = await MatchService.getTodaysMatches();
        
        if (realMatches.length > 0) {
            setMatches(realMatches);
            setDebugLog(`✅ SUCCÈS : ${realMatches.length} matchs récupérés depuis SportScore.`);
        } else {
            setMatches([]);
            setDebugLog("⚠️ RÉPONSE VIDE : L'API a répondu correctement (200 OK) mais la liste des matchs est vide. (Peut-être aucun match à cette date ou problème de fuseau horaire).");
        }
    } catch (e: any) {
        setDebugLog(`❌ ERREUR CRITIQUE : ${e.message || "Problème de connexion"}.`);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      {/* --- ZONE DE DIAGNOSTIC (TEMPORAIRE) --- */}
      <div className={`mb-6 p-4 rounded-xl border font-mono text-xs ${debugLog.includes('SUCCÈS') ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-red-900/20 border-red-500 text-red-300'}`}>
          <h4 className="font-bold mb-2 flex items-center gap-2">
              {debugLog.includes('SUCCÈS') ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
              DIAGNOSTIC API
          </h4>
          <p>{debugLog}</p>
          <div className="mt-2 text-gray-500">
              Note : Si tu testes sur ton PC (localhost), ça peut échouer. Teste sur le lien Vercel.
          </div>
      </div>
      {/* --------------------------------------- */}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold border-l-4 border-neon pl-4 flex items-center gap-3">
                {title}
                <button onClick={loadData} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
                    <RefreshCw size={14} className={loading ? "animate-spin text-neon" : "text-gray-400"} />
                </button>
            </h2>
        </div>
      </div>

      {loading ? (
          <div className="flex justify-center items-center h-64"><RefreshCw className="animate-spin text-neon" size={40} /></div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} onClick={() => setSelectedMatch(match)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-2xl border border-neutral-800 border-dashed">
          <p className="text-gray-500">Aucun match affiché (Voir diagnostic ci-dessus).</p>
        </div>
      )}

      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
};
