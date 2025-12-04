// 👇 AJOUTE JUSTE CETTE FONCTION DANS AnalysisPage.tsx après handleReportUpdate:

// Gestion de la mise à jour manuelle du tableau
const handleReportUpdate = (newReport: GodModeReport) => {
    setCurrentReport(newReport);
    if (selectedMatch) {
        saveAnalysis(selectedMatch.id, newReport); // Sauvegarde à chaque frappe
    }
};

// ✅ NOUVELLE FONCTION : Quand on clique "Enregistrer"
const handleManualSave = () => {
  if (!currentReport) {
    alert('Aucune donnée à sauvegarder');
    return;
  }

  try {
    // 1️⃣ L'IA relit le tableau modifié
    const refinedPrediction = OracleAI.predictor.refinePrediction(currentReport);

    if (!refinedPrediction) {
      console.error('Erreur lors du calcul IA');
      alert('Erreur de calcul IA');
      return;
    }

    // 2️⃣ Mettre à jour le rapport avec la nouvelle prédiction
    const finalReport = {
      ...currentReport,
      prediction: {
        ...currentReport.prediction,
        ...refinedPrediction.updatedPredictionSection
      }
    };

    // 3️⃣ Sauvegarder dans le contexte
    if (selectedMatch) {
      saveAnalysis(selectedMatch.id, finalReport);
    }

    setCurrentReport(finalReport);

    // 4️⃣ Feedback utilisateur
    alert(`✅ Analyse mise à jour!\nConfiance IA: ${refinedPrediction.confidence}%\nVainqueur: ${refinedPrediction.winner}`);
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
    alert('❌ Erreur lors de la sauvegarde');
  }
};

// 👇 ET PASSE LA FONCTION AU COMPOSANT:
{currentReport && (
    <div className="animate-fade-in flex-1 overflow-hidden">
        <GodModeTable 
            report={currentReport} 
            onUpdate={handleReportUpdate}
            onSave={handleManualSave}  // ✅ ICI
        />
        
        <div className="mt-2 text-center pb-2 flex-shrink-0">
            <p className="text-[10px] text-gray-500 uppercase">Toutes les données sont modifiables manuellement pour affiner la prédiction.</p>
        </div>
    </div>
)}
