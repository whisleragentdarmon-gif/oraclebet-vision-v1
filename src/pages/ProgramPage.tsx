import React, { useState } from 'react';
import { CustomMatchInput } from '../components/CustomMatchInput';
import { GodModeReportV2 } from '../engine/types';
import { GodModeTable } from '../components/GodModeTable';
import { CheckCircle, Search } from 'lucide-react';

export const ProgramPage: React.FC = () => {
  const [report, setReport] = useState<GodModeReportV2 | null>(null);

  const handleManualAnalysis = (dossier: GodModeReportV2) => {
    setReport(dossier);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <div className="p-3 bg-neutral-800 rounded-full text-neon">
              <Search size={24} />
          </div>
          <div>
              <h2 className="text-2xl font-bold text-white">Recherche Manuelle</h2>
              <p className="text-sm text-gray-400">Analysez n'importe quel match, même hors programme.</p>
          </div>
      </div>

      {/* CONTENU */}
      <div className="flex-1 overflow-hidden">
        {!report && <CustomMatchInput onAnalysisComplete={handleManualAnalysis} />}
        
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

                {/* GODMODETABLE - PREND TOUTE LA PLACE */}
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
  );
};
