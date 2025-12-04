'use client';

import React, { useState, useRef } from 'react';
import { GodModeReportV2 } from '../engine/types';
import { GodModeTable } from '../components/GodModeTable';
import { GodEngine } from '../engine/market/GodEngine';
import { ImageEngine } from '../engine/ImageEngine';
import { CheckCircle, Search, Upload, Cpu, Loader } from 'lucide-react';

export const ProgramPage: React.FC = () => {
  const [report, setReport] = useState<GodModeReportV2 | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ SCAN WEB
  const handleScanWeb = async () => {
    setLoading(true);
    try {
      const report = await GodEngine.generateReportV2('Player 1', 'Player 2', 'Unknown Tournament');
      setReport(report);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // ✅ SCREENSHOT
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const tempMatch = {
        player1: { name: 'Player 1' },
        player2: { name: 'Player 2' },
        tournament: 'Unknown Tournament'
      };
      const report = await ImageEngine.analyzeScreenshot(file, tempMatch);
      setReport(report);
    } catch (e) {
      console.error(e);
      alert("Impossible de lire l'image.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* INPUT CACHÉ */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileUpload}
      />

      <div className="w-full h-full flex flex-col space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <div className="p-3 bg-neutral-800 rounded-full text-orange-500">
            <Search size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Recherche Manuelle</h2>
            <p className="text-sm text-gray-400">Analysez n'importe quel match, même hors programme.</p>
          </div>
          
          {/* ✅ BOUTONS */}
          <div className="flex gap-2 flex-shrink-0">
            <button 
              onClick={handleScanWeb}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <Cpu size={18} />}
              SCAN WEB
            </button>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <Upload size={18} />}
              SCREENSHOT
            </button>
          </div>
        </div>

        {/* CONTENU */}
        <div className="flex-1 overflow-hidden">
          
          {/* PAS DE RAPPORT = VIDE */}
          {!report && (
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-neutral-800 rounded-xl bg-black/20">
              <Search size={64} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aucun match en cours d'analyse</h3>
              <p className="text-gray-400 text-sm mb-6">Cliquez sur SCREENSHOT ou SCAN WEB pour commencer</p>
            </div>
          )}
          
          {/* RAPPORT GÉNÉRÉ */}
          {report && (
            <div className="animate-fade-in w-full h-full flex flex-col">
              
              {/* NOTIFICATION SUCCESS */}
              <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-xl flex items-center gap-3 mb-4 flex-shrink-0">
                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                <div className="flex-1">
                  <h4 className="font-bold text-white">Données Récupérées !</h4>
                  <p className="text-xs text-green-300">
                    Météo: {report.conditions.weather} | H2H: {report.h2h.global}
                  </p>
                </div>
                <button 
                  onClick={() => setReport(null)} 
                  className="ml-auto text-xs underline text-gray-400 hover:text-white flex-shrink-0"
                >
                  Nouvelle recherche
                </button>
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
