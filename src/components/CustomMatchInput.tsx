'use client';

import React, { useState, useRef } from 'react';
import { GodEngine } from '../engine/market/GodEngine';
import { ImageEngine } from '../engine/ImageEngine';
import { GodModeReportV2 } from '../engine/types';
import { Search, FileText, Loader, Upload } from 'lucide-react';

interface Props {
  onAnalysisComplete: (report: GodModeReportV2) => void;
}

export const CustomMatchInput: React.FC<Props> = ({ onAnalysisComplete }) => {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [tournament, setTournament] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ✅ Référence pour l'upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ ANALYSE MANUELLE (Web Search)
  const handleAnalyze = async () => {
    if (!p1 || !p2) return;
    setLoading(true);
    try {
      const report = await GodEngine.generateReportV2(p1, p2, tournament || 'Unknown');
      onAnalysisComplete(report);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // ✅ ANALYSE VIA SCREENSHOT
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      // Créer un match temporaire pour ImageEngine
      const tempMatch = {
        player1: { name: p1 || 'Player 1' },
        player2: { name: p2 || 'Player 2' },
        tournament: tournament || 'Unknown Tournament'
      };

      // Analyser l'image
      const report = await ImageEngine.analyzeScreenshot(file, tempMatch);
      onAnalysisComplete(report);
    } catch (e) {
      console.error("Erreur lecture image", e);
      alert("Impossible de lire l'image.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* ✅ INPUT CACHÉ POUR L'UPLOAD */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileUpload}
      />

      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Search size={18} className="text-orange-500" /> Analyseur Manuel
        </h3>
        
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Joueur 1" 
            className="w-full bg-black/40 border border-neutral-700 rounded p-2 text-white placeholder-gray-500 outline-none focus:border-orange-500/50" 
            value={p1} 
            onChange={e => setP1(e.target.value)} 
          />
          
          <input 
            type="text" 
            placeholder="Joueur 2" 
            className="w-full bg-black/40 border border-neutral-700 rounded p-2 text-white placeholder-gray-500 outline-none focus:border-orange-500/50" 
            value={p2} 
            onChange={e => setP2(e.target.value)} 
          />
          
          <input 
            type="text" 
            placeholder="Tournoi" 
            className="w-full bg-black/40 border border-neutral-700 rounded p-2 text-white placeholder-gray-500 outline-none focus:border-orange-500/50" 
            value={tournament} 
            onChange={e => setTournament(e.target.value)} 
          />

          {/* BOUTONS */}
          <div className="flex gap-2">
            {/* BOUTON 1: SCAN WEB */}
            <button 
              onClick={handleAnalyze} 
              disabled={loading || (!p1 && !p2)} 
              className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white font-bold py-2 rounded flex justify-center items-center gap-2 transition-all"
            >
              {loading ? <Loader className="animate-spin" size={18}/> : <FileText size={18}/>}
              {loading ? 'Analyse...' : 'Scan Web'}
            </button>

            {/* BOUTON 2: SCREENSHOT */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-bold py-2 rounded flex justify-center items-center gap-2 transition-all"
            >
              {loading ? <Loader className="animate-spin" size={18}/> : <Upload size={18}/>}
              {loading ? 'Traitement...' : 'Screenshot'}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-2">
            Analysez manuellement ou uploadez une capture d'écran
          </p>
        </div>
      </div>
    </>
  );
};
