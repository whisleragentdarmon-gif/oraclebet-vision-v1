'use client';

import React, { useState } from 'react';

export default function ScreenshotAnalyzer({ onDataExtracted }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. REINITIALISATION TOTALE (Vital pour éviter le problème de mémoire)
    setError('');
    setData(null);
    setLoading(true);
    
    // On dit au composant parent (AnalysisPage) de tout vider aussi
    if (onDataExtracted) {
        onDataExtracted(null); 
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        // On garde le header data:image... pour que l'API puisse valider si besoin, 
        // ou on le split ici. Ton API attend du base64 pur, donc on split.
        const base64 = result.split(',')[1];

        const response = await fetch('/api/analyze_screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });

        const resultData = await response.json();

        if (!response.ok) {
          throw new Error(resultData.error || 'Erreur API');
        }

        // 2. SUCCÈS
        setData(resultData.data);
        setLoading(false);

        if (onDataExtracted) {
          onDataExtracted(resultData.data);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur d'analyse");
      setLoading(false);
    } finally {
        // 3. RESET DE L'INPUT (Pour pouvoir ré-uploader le même fichier)
        e.target.value = '';
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1a1a1a', // Changé pour faire plus pro/sombre
      borderRadius: '12px',
      marginBottom: '20px',
      border: '1px solid #333'
    }}>
      <h2 style={{ color: '#fff', marginBottom: '15px', fontSize: '16px', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'10px' }}>
        📸 ANALYSEUR FLASHSCORE (CLAUDE VISION)
      </h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={loading}
        style={{
          padding: '10px',
          marginBottom: '10px',
          width: '100%',
          backgroundColor: '#333',
          color: 'white',
          border: '1px solid #555',
          borderRadius: '6px',
          cursor: loading ? 'wait' : 'pointer'
        }}
      />

      {loading && (
        <div style={{ color: '#4ADE80', fontSize: '14px', fontWeight: 'bold', marginTop: '10px', display:'flex', alignItems:'center', gap:'8px' }}>
          <span className="animate-spin">🌀</span> Analyse IA en cours... (5-10s)
        </div>
      )}

      {error && (
        <div style={{ color: '#ff4444', backgroundColor: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
          ❌ Erreur: {error}
        </div>
      )}

      {data && (
        <div style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', marginTop: '15px', border: '1px solid #444' }}>
          <h3 style={{ color: '#4ADE80', marginBottom: '10px', fontSize:'14px' }}>✅ Données Extraites avec succès</h3>
          <div style={{ fontSize: '13px', color: '#ccc', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            <div>
                <div style={{color:'#888', fontSize:'10px'}}>JOUEUR 1</div>
                <div style={{fontWeight:'bold', color:'white'}}>{(data as any).p1Name}</div>
                <div style={{color:'#aaa'}}>Class: #{(data as any).p1Rank || '?'}</div>
            </div>
            <div>
                <div style={{color:'#888', fontSize:'10px'}}>JOUEUR 2</div>
                <div style={{fontWeight:'bold', color:'white'}}>{(data as any).p2Name}</div>
                <div style={{color:'#aaa'}}>Class: #{(data as any).p2Rank || '?'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
