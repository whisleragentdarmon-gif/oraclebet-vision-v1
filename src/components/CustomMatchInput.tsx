import React, { useState } from 'react';
import { PlusCircle, Search, Save, X, Loader2, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import { H2HEngine } from '../engine/market/H2HEngine';
import { FullMatchDossier } from '../engine/types';

export const CustomMatchInput: React.FC = () => {
  const { addCustomMatch } = useData();
  
  const [step, setStep] = useState<'INPUT' | 'LOADING' | 'DOSSIER'>('INPUT');
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [dossier, setDossier] = useState<FullMatchDossier | null>(null);

  const startInvestigation = async () => {
    if (!p1Name || !p2Name) return;
    setStep('LOADING');
    const result = await H2HEngine.buildDossier(p1Name, p2Name);
    setDossier(result);
    setStep('DOSSIER');
  };

  const handleFieldChange = (section: string, field: string, value: string, sub?: string) => {
      if (!dossier) return;
      const newDossier = { ...dossier };
      if (sub) newDossier[section][sub][field] = value;
      else newDossier[section][field] = value;
      setDossier(newDossier);
  };

  const finalize = () => {
      // On envoie le dossier complet au système
      // (Note: il faut adapter addCustomMatch dans DataContext pour accepter 'dossier')
      addCustomMatch({ p1: dossier?.identity.p1Name, p2: dossier?.identity.p2Name, dossier }); 
      setStep('INPUT');
      setP1Name(''); setP2Name('');
  };

  if (step === 'INPUT') {
      return (
        <div className="bg-surface border border-neon/30 p-6 rounded-xl mb-6 text-center">
            <h3 className="text-white font-bold mb-4 text-lg">NOUVELLE ENQUÊTE</h3>
            <div className="flex gap-4 mb-4">
                <input type="text" placeholder="Joueur A" value={p1Name} onChange={e=>setP1Name(e.target.value)} className="flex-1 bg-black/40 border border-neutral-700 rounded-lg p-3 text-white text-center font-bold"/>
                <span className="text-gray-500 self-center text-xl">VS</span>
                <input type="text" placeholder="Joueur B" value={p2Name} onChange={e=>setP2Name(e.target.value)} className="flex-1 bg-black/40 border border-neutral-700 rounded-lg p-3 text-white text-center font-bold"/>
            </div>
            <button onClick={startInvestigation} disabled={!p1Name || !p2Name} className="w-full bg-neon hover:bg-neonHover text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg">
                <Search size={20}/> LANCER L'INVESTIGATION WEB
            </button>
        </div>
      );
  }

  if (step === 'LOADING') {
      return (
        <div className="bg-surface border border-neutral-800 p-8 rounded-xl mb-6 flex flex-col items-center justify-center text-center">
            <Loader2 size={48} className="text-neon animate-spin mb-4"/>
            <p className="text-white font-bold text-lg">Création du Dossier Criminel...</p>
            <p className="text-sm text-gray-500">Scraping H2H, Météo, Scandales, Blessures.</p>
        </div>
      );
  }

  // --- LE DOSSIER GÉANT ---
  return (
    <div className="bg-surface border border-neutral-700 p-6 rounded-xl mb-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6 border-b border-neutral-700 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="text-neon"/> FICHE MATCH – ORACLEBET</h2>
            <button onClick={() => setStep('INPUT')}><X className="text-gray-500 hover:text-white"/></button>
        </div>

        <div className="grid grid-cols-2 gap-8">
            {/* COLONNE GAUCHE */}
            <div className="space-y-6">
                
                {/* 1. IDENTITÉ */}
                <div className="bg-black/20 p-4 rounded-lg border border-neutral-800">
                    <h4 className="text-neon text-xs font-bold mb-3 uppercase">1. Identité Match</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <input value={dossier?.identity.tournament} onChange={e=>handleFieldChange('identity','tournament',e.target.value)} className="bg-neutral-900 border-neutral-700 rounded p-1 text-xs text-white" placeholder="Tournoi"/>
                        <input value={dossier?.identity.surface} onChange={e=>handleFieldChange('identity','surface',e.target.value)} className="bg-neutral-900 border-neutral-700 rounded p-1 text-xs text-white" placeholder="Surface"/>
                    </div>
                </div>

                {/* 2. PROFILS */}
                <div className="bg-black/20 p-4 rounded-lg border border-neutral-800">
                    <h4 className="text-blue-400 text-xs font-bold mb-3 uppercase">2. Profils Joueurs</h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2 font-bold text-gray-500">
                        <span>{dossier?.identity.p1Name}</span>
                        <span>DATA</span>
                        <span>{dossier?.identity.p2Name}</span>
                    </div>
                    {['rank','age','height','style','injury','motivation'].map(field => (
                        <div key={field} className="grid grid-cols-3 gap-2 mb-2">
                            <input value={dossier?.profiles.p1[field]} onChange={e=>handleFieldChange('profiles',field,e.target.value, 'p1')} className="bg-neutral-900 border-neutral-700 rounded p-1 text-xs text-white text-center"/>
                            <span className="text-gray-600 text-[10px] uppercase self-center text-center">{field}</span>
                            <input value={dossier?.profiles.p2[field]} onChange={e=>handleFieldChange('profiles',field,e.target.value, 'p2')} className="bg-neutral-900 border-neutral-700 rounded p-1 text-xs text-white text-center"/>
                        </div>
                    ))}
                </div>

                {/* 3. H2H */}
                <div className="bg-black/20 p-4 rounded-lg border border-neutral-800">
                    <h4 className="text-purple-400 text-xs font-bold mb-3 uppercase">3. Head-to-Head</h4>
                    <textarea value={dossier?.h2h.global} onChange={e=>handleFieldChange('h2h','global',e.target.value)} className="w-full bg-neutral-900 border-neutral-700 rounded p-2 text-xs text-white h-20"/>
                </div>

            </div>

            {/* COLONNE DROITE */}
            <div className="space-y-6">
                
                {/* 4. CONDITIONS */}
                <div className="bg-black/20 p-4 rounded-lg border border-neutral-800">
                    <h4 className="text-yellow-400 text-xs font-bold mb-3 uppercase">4. Conditions Externes</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <input value={dossier?.conditions.weather} onChange={e=>handleFieldChange('conditions','weather',e.target.value)} className="bg-neutral-900 border-neutral-700 rounded p-1 text-xs text-white"/>
                        <input value={dossier?.conditions.wind} onChange={e=>handleFieldChange('conditions','wind',e.target.value)} className="bg-neutral-900 border-neutral-700 rounded p-1 text-xs text-white"/>
                    </div>
                </div>

                {/* 6. BOOKMAKERS */}
                <div className="bg-black/20 p-4 rounded-lg border border-neutral-800">
                    <h4 className="text-green-400 text-xs font-bold mb-3 uppercase">6. Analyse Bookmaker</h4>
                    <div className="grid grid-cols-2 gap-2">
                         <input value={dossier?.bookmakers.p1Odds} onChange={e=>handleFieldChange('bookmakers','p1Odds',e.target.value)} className="bg-neutral-900 border-neutral-700 rounded p-1 text-xs text-white font-mono" placeholder="Cote 1"/>
                         <input value={dossier?.bookmakers.p2Odds} onChange={e=>handleFieldChange('bookmakers','p2Odds',e.target.value)} className="bg-neutral-900 border-neutral-700 rounded p-1 text-xs text-white font-mono" placeholder="Cote 2"/>
                    </div>
                    <textarea value={dossier?.bookmakers.trapIndicator} onChange={e=>handleFieldChange('bookmakers','trapIndicator',e.target.value)} className="w-full bg-neutral-900 border-neutral-700 rounded p-2 text-xs text-red-300 mt-2 h-16" placeholder="Piège ?"/>
                </div>

                {/* 8. SYNTHÈSE */}
                <div className="bg-black/20 p-4 rounded-lg border border-neutral-800">
                    <h4 className="text-white text-xs font-bold mb-3 uppercase">8. Synthèse Factuelle</h4>
                    <input value={dossier?.synthesis.statAdvantage} onChange={e=>handleFieldChange('synthesis','statAdvantage',e.target.value)} className="w-full bg-neutral-900 border-neutral-700 rounded p-1 text-xs text-white mb-2"/>
                    <input value={dossier?.synthesis.physicalAdvantage} onChange={e=>handleFieldChange('synthesis','physicalAdvantage',e.target.value)} className="w-full bg-neutral-900 border-neutral-700 rounded p-1 text-xs text-white"/>
                </div>
            </div>
        </div>

        <button onClick={finalize} className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-xl hover:scale-[1.02] transition-transform">
            VALIDER & LANCER LE GOD MODE (PRÉDICTION)
        </button>
    </div>
  );
};
