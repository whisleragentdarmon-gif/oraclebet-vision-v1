import React, { useState } from 'react';
import { CustomMatchInput } from '../components/CustomMatchInput';
import { GodModeReportV2 } from '../engine/types';
import { GodModeTable } from '../components/GodModeTable';
import { CheckCircle, Search, Edit3 } from 'lucide-react';

export const ProgramPage: React.FC = () => {
  const [report, setReport] = useState<GodModeReportV2 | null>(null);

  const handleManualAnalysis = (dossier: GodModeReportV2) => {
    setReport(dossier);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neutral-800 rounded-full text-neon">
              <Search size={24} />
          </div>
          <div>
              <h2 className="text-2xl font-bold text-white">Recherche Manuelle</h2>
              <p className="text-sm text-gray-400">Lancez le God Mode V2 sur n'importe quel match.</p>
          </div>
      </div>

      {!report && <CustomMatchInput onAnalysisComplete={handleManualAnalysis} />}

      {report && (
          <div className="animate-fade-in">
              <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-xl flex items-center gap-3 mb-6">
                  <CheckCircle className="text-green-500" size={24} />
                  <div>
                      <h4 className="font-bold text-white">Données Récupérées !</h4>
                      {/* ✅ CORRECTION : On utilise .conditions et non .context */}
                      <p className="text-xs text-green-300">
                          Météo: {report.conditions.weather} | H2H: {report.h2h.total}
                      </p>
                  </div>
                  <button onClick={() => setReport(null)} className="ml-auto text-xs underline text-gray-400 hover:text-white">Nouvelle recherche</button>
              </div>

              <GodModeTable 
                  report={report} 
                  onUpdate={(newData) => setReport(newData)} 
              />
          </div>
      )}
    </div>
  );
};
