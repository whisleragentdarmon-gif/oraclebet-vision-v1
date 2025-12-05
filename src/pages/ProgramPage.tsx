'use client';

import React, { useState, useRef } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { Match } from '../types';
import { GodModeTable } from '../components/GodModeTable';
import { ImageEngine } from '../engine/ImageEngine';
import { useData } from '../context/DataContext';
import { useAnalysis } from '../context/AnalysisContext';
import { CheckCircle, Search, Upload, X } from 'lucide-react';

export const ProgramPage: React.FC = () => {
  const [report, setReport] = useState<GodModeReportV2 | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ✅ Accès aux contextes
  const { addManualMatch } = useData();
  const { saveAnalysis } = useAnalysis();

  // ✅ TOAST NOTIFICATION
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // ✅ MULTI-UPLOAD
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const file = files[0];
      
      const tempMatch = {
        player1: { name: 'Player 1' },
        player2: { name: 'Player 2' },
        tournament: 'Unknown Tournament'
      };
      const report = await ImageEngine.analyzeScreenshot(file, tempMatch);
      setReport(report);
      
      // Pré-remplir les noms
      setP1Name(report.identity.p1Name);
      setP2Name(report.identity.p2Name);
    } catch (e) {
      console.error(e);
      showToast('Impossible de lire l\'image.', 'error');
    }
    setLoading(false);
  };

  // ✅ SAUVEGARDER VERS ANALYSE IA
  const handleSaveToAnalysis = () => {
    if (!report) {
      showToast('Aucun rapport à sauvegarder', 'error');
      return;
    }

    try {
      // 1️⃣ Créer un Match à partir du rapport
      const matchId = `manual_${Date.now()}`;
      
      const newMatch = {
        id: matchId,
        player1: { name: report.identity.p1Name },
        player2: { name: report.identity.p2Name },
        tournament: report.identity.tournament || 'Unknown',
        date: report.identity.date || new Date().toISOString(),
        time: (report.identity as any).time || '14:00',
        heure: (report.identity as any).time || '14:00',
        surface: report.identity.surface || 'DUR',
        odds: {
          p1: parseFloat((report.identity as any).oddA || '1.95'),
          p2: parseFloat((report.identity as any).oddB || '1.95')
        },
        cotes: {
          p1: parseFloat((report.identity as any).oddA || '1.95'),
          p2: parseFloat((report.identity as any).oddB || '1.95')
        },
        status: 'LIVE' as const,
        ai: {
          circuit: 'WTA' as const,
          predictedWinner: report.prediction.winner || report.identity.p1Name,
          confidence: parseInt(report.prediction.confidence) || 50
        }
      } as Match;

      // 2️⃣ Ajouter au DataContext
      addManualMatch(newMatch);

      // 3️⃣ Sauvegarder dans AnalysisContext
      saveAnalysis(matchId, report);

      // 4️⃣ Feedback utilisateur
      showToast(`✅ Match ${report.identity.p1Name} vs ${report.identity.p2Name} envoyé à l'Analyse IA!`, 'success');

      // 5️⃣ Réinitialiser après 2s
      setTimeout(() => {
        setReport(null);
      }, 2000);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  // ✅ ENREGISTRER LA FICHE GODMODE
  const handleSaveGodMode = () => {
    // Appelle handleSaveToAnalysis
    handleSaveToAnalysis();
  };

  // ✅ METTRE À JOUR LE RAPPORT
  const handleUpdateReport = (updatedReport: GodModeReportV2) => {
    setReport(updatedReport);
  };

  return (
    <>
      {/* INPUT CACHÉ - MULTI-UPLOAD */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        multiple
        onChange={handleFileUpload}
      />

      {/* ✅ TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg font-bold flex items-center gap-2 animate-pulse z-50 ${
          toast.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <CheckCircle size={18} />
          {toast.message}
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
            <p className="text-sm text-gray-400">Importez une capture d'écran pour analyser n'importe quel match.</p>
          </div>
        </div>

        {/* CONTENU */}
        <div className="flex-1 overflow-hidden">
          
          {/* PAS DE RAPPORT = VIDE */}
          {!report && (
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-neutral-800 rounded-xl bg-black/20">
              {loading ? (
                // ✅ LOADER FUTURISTE
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-transparent border-b-orange-500 border-l-cyan-500 rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
                    <div className="absolute inset-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white font-bold text-lg mb-2">Analyzing Screenshot...</p>
                    <p className="text-gray-400 text-sm">Claude Vision en cours d'analyse</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={64} className="text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Aucun match en cours d'analyse</h3>
                  <p className="text-gray-400 text-sm mb-6">Cliquez sur le bouton ci-dessous pour uploader une capture d'écran</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 transition-all"
                  >
                    <Upload size={18} /> Importer une capture
                  </button>
                </>
              )}
            </div>
          )}
          
          {/* RAPPORT GÉNÉRÉ */}
          {report && !loading && (
            <div className="animate-fade-in w-full h-full flex flex-col">
              
              {/* NOTIFICATION SUCCESS */}
              <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-xl flex items-center gap-3 mb-4 flex-shrink-0">
                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                <div className="flex-1">
                  <h4 className="font-bold text-white">Données Récupérées !</h4>
                  <p className="text-xs text-green-300">
                    {report.identity.p1Name} vs {report.identity.p2Name} | {report.conditions.weather}
                  </p>
                </div>
                
                {/* ✅ BOUTON NOUVELLE RECHERCHE UNIQUEMENT */}
                <button 
                  onClick={() => setReport(null)} 
                  className="ml-auto px-4 py-2 text-xs underline text-gray-400 hover:text-white rounded-lg"
                >
                  Nouvelle recherche
                </button>
              </div>

              {/* GODMODETABLE */}
              <div className="flex-1 overflow-hidden">
                <GodModeTable 
                  report={report}
                  onUpdate={handleUpdateReport}
                  onSave={handleSaveGodMode}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
