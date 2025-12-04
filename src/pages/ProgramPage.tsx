'use client';

import React, { useState, useRef } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { GodModeTable } from '../components/GodModeTable';
import { ImageEngine } from '../engine/ImageEngine';
import { CheckCircle, Search, Upload, X } from 'lucide-react';

export const ProgramPage: React.FC = () => {
  const router = useRouter();
  const [report, setReport] = useState<GodModeReportV2 | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // ✅ ENREGISTRER MATCH
  const handleSaveMatch = () => {
    if (report) {
      // Mettre à jour les noms dans le report
      report.identity.p1Name = p1Name;
      report.identity.p2Name = p2Name;
      
      setShowModal(false);
      showToast(`Match ${p1Name} vs ${p2Name} enregistré avec succès! 🎉`);
      
      // Redirection après 1s
      setTimeout(() => {
        window.location.href = '/analysis';
      }, 1500);
    }
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

      {/* ✅ MODAL POUR MODIFIER LES NOMS */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-96 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Vérifier les noms</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Joueur 1</label>
                <input 
                  type="text" 
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  className="w-full bg-black/40 border border-neutral-700 rounded p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Joueur 2</label>
                <input 
                  type="text" 
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  className="w-full bg-black/40 border border-neutral-700 rounded p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-bold transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSaveMatch}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
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
              
              {/* NOTIFICATION SUCCESS + BOUTON ENREGISTRER */}
              <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-xl flex items-center gap-3 mb-4 flex-shrink-0">
                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                <div className="flex-1">
                  <h4 className="font-bold text-white">Données Récupérées !</h4>
                  <p className="text-xs text-green-300">
                    {report.identity.p1Name} vs {report.identity.p2Name} | {report.conditions.weather}
                  </p>
                </div>
                
                {/* ✅ BOUTONS ACTIONS */}
                <div className="flex gap-2 flex-shrink-0">
                  <button 
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-sm transition-all"
                  >
                    Enregistrer Match
                  </button>
                  <button 
                    onClick={() => setReport(null)} 
                    className="px-4 py-2 text-xs underline text-gray-400 hover:text-white rounded-lg"
                  >
                    Nouvelle recherche
                  </button>
                </div>
              </div>

              {/* GODMODETABLE */}
              <div className="flex-1 overflow-hidden">
                <GodModeTable 
                  report={report} 
                  onUpdate={(newData) => setReport(newData)} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
