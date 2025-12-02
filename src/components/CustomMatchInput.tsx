import React, { useState } from 'react';
import { PlusCircle, Search, Save, X, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { H2HEngine } from '../engine/market/H2HEngine';

export const CustomMatchInput: React.FC = () => {
  const { addCustomMatch } = useData();
  
  const [step, setStep] = useState<'INPUT' | 'LOADING' | 'EDIT'>('INPUT');
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  
  // Les données scrappées qu'on va éditer
  const [draftData, setDraftData] = useState<any>(null);

  const startScan = async () => {
    if (!p1Name || !p2Name) return;
    setStep('LOADING');
    
    // On lance le scraper
    const profile = await H2HEngine.fetchFullProfile(p1Name, p2Name, "Tournoi Inconnu");
    
    // On prépare les données pour le formulaire
    setDraftData({
        p1: { name: p1Name, rank: profile.p1.rank, clay: profile.surfaceStats.clay.p1, hard: profile.surfaceStats.hard.p1 },
        p2: { name: p2Name, rank: profile.p2.rank, clay: profile.surfaceStats.clay.p2, hard: profile.surfaceStats.hard.p2 },
        context: { weather: "Ensoleillé", surface: "Clay" }
    });
    
    setStep('EDIT');
  };

  const handleFinalize = () => {
      // On envoie tout à la fonction de création
      addCustomMatch(draftData);
      reset();
  };

  const reset = () => {
      setStep('INPUT');
      setP1Name('');
      setP2Name('');
      setDraftData(null);
  };

  if (step === 'INPUT') {
      return (
        <div className="bg-surface border border-neon/30 p-4 rounded-xl animate-fade-in mb-6">
            <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2"><PlusCircle size={16}/> Ajout & Scan Intelligent</h3>
            <div className="flex gap-2">
                <input type="text" placeholder="Joueur 1" value={p1Name} onChange={e=>setP1Name(e.target.value)} className="flex-1 bg-black/40 border border-neutral-700 rounded p-2 text-white text-sm"/>
                <span className="text-gray-500 self-center">vs</span>
                <input type="text" placeholder="Joueur 2" value={p2Name} onChange={e=>setP2Name(e.target.value)} className="flex-1 bg-black/40 border border-neutral-700 rounded p-2 text-white text-sm"/>
            </div>
            <button onClick={startScan} disabled={!p1Name || !p2Name} className="w-full mt-3 bg-neon hover:bg-neonHover text-black font-bold py-2 rounded text-sm flex items-center justify-center gap-2">
                <Search size={16}/> Scanner & Pré-remplir
            </button>
        </div>
      );
  }

  if (step === 'LOADING') {
      return (
        <div className="bg-surface border border-neutral-800 p-6 rounded-xl mb-6 flex flex-col items-center justify-center text-center">
            <Loader2 size={32} className="text-neon animate-spin mb-2"/>
            <p className="text-white font-bold">L'Oracle scanne le web...</p>
            <p className="text-xs text-gray-500">Récupération Rankings, Stats Surface, H2H...</p>
        </div>
      );
  }

  // STEP EDIT : On affiche le formulaire pour corriger/compléter
  return (
    <div className="bg-surface border border-blue-500/30 p-4 rounded-xl animate-fade-in mb-6">
        <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
            <h3 className="text-blue-400 font-bold text-sm">Vérification des Données</h3>
            <button onClick={reset}><X size={16} className="text-gray-500 hover:text-white"/></button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            {/* JOUEUR 1 */}
            <div className="space-y-2">
                <p className="font-bold text-white text-center">{draftData.p1.name}</p>
                <div className="flex gap-2">
                    <input type="text" value={draftData.p1.rank} onChange={e => setDraftData({...draftData, p1: {...draftData.p1, rank: e.target.value}})} className="w-1/2 bg-black/40 border border-neutral-700 rounded p-1 text-xs text-center" placeholder="Rang"/>
                    <div className="text-gray-500 text-xs self-center">ATP</div>
                </div>
                <p className="text-[10px] text-gray-400 uppercase">Winrate Surface (%)</p>
                <div className="flex gap-1">
                    <input type="number" value={draftData.p1.clay} onChange={e => setDraftData({...draftData, p1: {...draftData.p1, clay: e.target.value}})} className="w-1/2 bg-black/40 border border-orange-900 rounded p-1 text-xs text-center text-orange-400" placeholder="Terre"/>
                    <input type="number" value={draftData.p1.hard} onChange={e => setDraftData({...draftData, p1: {...draftData.p1, hard: e.target.value}})} className="w-1/2 bg-black/40 border border-blue-900 rounded p-1 text-xs text-center text-blue-400" placeholder="Dur"/>
                </div>
            </div>

            {/* JOUEUR 2 */}
            <div className="space-y-2">
                <p className="font-bold text-white text-center">{draftData.p2.name}</p>
                <div className="flex gap-2">
                    <input type="text" value={draftData.p2.rank} onChange={e => setDraftData({...draftData, p2: {...draftData.p2, rank: e.target.value}})} className="w-1/2 bg-black/40 border border-neutral-700 rounded p-1 text-xs text-center" placeholder="Rang"/>
                    <div className="text-gray-500 text-xs self-center">ATP</div>
                </div>
                <p className="text-[10px] text-gray-400 uppercase">Winrate Surface (%)</p>
                <div className="flex gap-1">
                    <input type="number" value={draftData.p2.clay} onChange={e => setDraftData({...draftData, p2: {...draftData.p2, clay: e.target.value}})} className="w-1/2 bg-black/40 border border-orange-900 rounded p-1 text-xs text-center text-orange-400" placeholder="Terre"/>
                    <input type="number" value={draftData.p2.hard} onChange={e => setDraftData({...draftData, p2: {...draftData.p2, hard: e.target.value}})} className="w-1/2 bg-black/40 border border-blue-900 rounded p-1 text-xs text-center text-blue-400" placeholder="Dur"/>
                </div>
            </div>
        </div>

        {/* CONTEXTE */}
        <div className="bg-black/20 p-2 rounded mb-4 flex gap-4">
            <select value={draftData.context.surface} onChange={e => setDraftData({...draftData, context: {...draftData.context, surface: e.target.value}})} className="bg-neutral-800 text-white text-xs p-1 rounded border border-neutral-700">
                <option value="Clay">Terre Battue</option>
                <option value="Hard">Dur</option>
                <option value="Grass">Gazon</option>
            </select>
             <input type="text" value={draftData.context.weather} onChange={e => setDraftData({...draftData, context: {...draftData.context, weather: e.target.value}})} className="flex-1 bg-neutral-800 border border-neutral-700 rounded p-1 text-xs text-white" placeholder="Météo (ex: Vent fort)"/>
        </div>

        <button onClick={handleFinalize} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg">
            <Save size={16}/> VALIDER & ANALYSER
        </button>
    </div>
  );
};
