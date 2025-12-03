import React, { useState } from 'react';
import { H2HEngine } from '../engine/market/H2HEngine';
import { FullMatchDossier } from '../engine/types';
import { Search, FileText, Loader } from 'lucide-react';

interface Props {
  onAnalysisComplete: (dossier: FullMatchDossier) => void;
}

export const CustomMatchInput: React.FC<Props> = ({ onAnalysisComplete }) => {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [tournament, setTournament] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!p1 || !p2) return;
    setLoading(true);
    
    try {
      // ✅ CORRECTION : On utilise la bonne fonction fetchFullProfile
      const dossier = await H2HEngine.fetchFullProfile(p1, p2, tournament || 'Unknown');
      onAnalysisComplete(dossier);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'analyse manuelle.");
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-surface border border-neutral-800 p-6 rounded-xl">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Search size={18} className="text-neon"/> Analyseur Manuel
      </h3>
      
      <div className="space-y-3">
        <input 
          type="text" placeholder="Joueur 1 (ex: Nadal)" 
          className="w-full bg-black/40 border border-neutral-700 rounded p-2 text-white"
          value={p1} onChange={e => setP1(e.target.value)}
        />
        <input 
          type="text" placeholder="Joueur 2 (ex: Federer)" 
          className="w-full bg-black/40 border border-neutral-700 rounded p-2 text-white"
          value={p2} onChange={e => setP2(e.target.value)}
        />
        <input 
          type="text" placeholder="Tournoi (Optionnel)" 
          className="w-full bg-black/40 border border-neutral-700 rounded p-2 text-white"
          value={tournament} onChange={e => setTournament(e.target.value)}
        />
        
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-neon hover:bg-neonHover text-black font-bold py-2 rounded flex justify-center items-center gap-2"
        >
          {loading ? <Loader className="animate-spin" size={18}/> : <FileText size={18}/>}
          {loading ? 'Recherche en cours...' : 'Générer Dossier H2H'}
        </button>
      </div>
    </div>
  );
};
