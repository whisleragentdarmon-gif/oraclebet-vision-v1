'use client';

import React, { useState, useRef } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { GodModeTable } from '../components/GodModeTable'; // Assure-toi que l'import est bon
import { ImageEngine } from '../engine/ImageEngine';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { CheckCircle, Search, Upload, RotateCcw } from 'lucide-react';

export const ProgramPage: React.FC = () => {
  const [report, setReport] = useState<GodModeReportV2 | null>(null);
  const [loading, setLoading] = useState(false);
  
  // ✅ LA SOLUTION ANTI-MEMOIRE : Une clé unique qui change à chaque upload
  const [uploadKey, setUploadKey] = useState(0); 
  
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addManualMatch } = useData();
  const { saveAnalysis } = useAnalysis();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // ✅ UPLOAD QUI NETTOIE TOUT
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setReport(null); // On efface l'ancien rapport immédiatement
    
    // Petite pause technique
    await new Promise(r => setTimeout(r, 100));

    try {
      const file = files[0];
      
      // Analyse avec le nouveau moteur "Splitter"
      const newReport = await ImageEngine.analyzeScreenshot(file, null);
      
      setReport(newReport);
      
      // ✅ ON FORCE LA CRÉATION D'UN NOUVEAU TABLEAU
      setUploadKey(prev => prev + 1);

    } catch (e) {
      console.error(e);
      showToast('Erreur de lecture image', 'error');
    } finally {
      setLoading(false);
      // Reset de l'input pour pouvoir ré-uploader la même image si besoin
      if (event.target) event.target.value = '';
    }
  };

  const handleSaveToAnalysis = () => {
    if (!report) return;

    try {
      const matchId = `manual_${Date.now()}`;
      
      const newMatch = {
        id: matchId,
        player1: { name: report.identity.p1Name },
        player2: { name: report.identity.p2Name },
        tournament: report.identity.tournament || 'Unknown',
        date: new Date().toISOString(),
        status: 'LIVE' as const,
        ai: {
          winner: report.prediction.recoWinner,
          confidence: 50,
          riskLevel: 'MEDIUM'
        }
      } as any;

      addManualMatch(newMatch);
      saveAnalysis(matchId, report);

      showToast(`✅ Match sauvegardé !`, 'success');

    } catch (error) {
      console.error(error);
      showToast('Erreur sauvegarde', 'error');
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileUpload}
      />

      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg font-bold flex items-center gap-2 z-50 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <CheckCircle size={18} /> {toast.message}
        </div>
      )}

      <div className="w-full h-full flex flex-col space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <div className="p-3 bg-neutral-800 rounded-full text-orange-500">
            <Search size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Recherche Manuelle</h2>
            <p className="text-sm text-gray-400">Importez une capture pour une analyse rapide.</p>
          </div>
        </div>

        {/* CONTENU */}
        <div className="flex-1 overflow-hidden bg-neutral-950 border border-neutral-800 rounded-xl relative">
          
          {!report ? (
            <div className="flex flex-col items-center justify-center h-full">
              {loading ? (
                <div className="text-center animate-pulse">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-white font-bold">Lecture en cours...</p>
                </div>
              ) : (
                <>
                  <Upload size={48} className="text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Aucune analyse</h3>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 mt-4"
                  >
                    <Upload size={18} /> Importer une capture
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full">
               {/* BARRE OUTILS RAPPORT */}
               <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-black/20">
                   <div className="text-green-400 text-sm font-bold flex items-center gap-2">
                       <CheckCircle size={16}/> Analyse terminée
                   </div>
                   <button 
                     onClick={() => setReport(null)}
                     className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
                   >
                       <RotateCcw size={14}/> Nouvelle recherche
                   </button>
               </div>

               {/* TABLEAU */}
               <div className="flex-1 overflow-hidden">
                   <GodModeTable 
                     // 🛑 C'EST ICI QUE LA MAGIE OPÈRE
                     // La clé change à chaque upload -> Le tableau se réinitialise à 100%
                     key={`program-${uploadKey}`} 
                     report={report}
                     onUpdate={setReport}
                     onSave={handleSaveToAnalysis}
                   />
               </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
