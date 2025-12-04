'use client';

import React, { useState } from 'react';

export default function ScreenshotAnalyzer({ onDataExtracted }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        const base64 = result.split(',')[1];

        const response = await fetch('/api/analyze_screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });

        const resultData = await response.json();

        if (!response.ok) {
          throw new Error(resultData.error || 'API error');
        }

        setData(resultData.data);
        setLoading(false);

        if (onDataExtracted) {
          onDataExtracted(resultData.data);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#FF6B00',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '3px solid #FF9500'
    }}>
      <h2 style={{ color: '#fff', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
        📸 UPLOAD SCREENSHOT ATP/WTA
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
          backgroundColor: '#fff',
          border: '2px solid #333',
          borderRadius: '4px',
          cursor: loading ? 'wait' : 'pointer'
        }}
      />

      {loading && (
        <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
          ⏳ Analyzing with Claude Vision...
        </div>
      )}

      {error && (
        <div style={{ color: '#fff', backgroundColor: '#cc0000', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
          ❌ Error: {error}
        </div>
      )}

      {data && (
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
          <h3 style={{ color: '#FF6B00', marginBottom: '10px' }}>✅ Data Extracted:</h3>
          <div style={{ fontSize: '12px', color: '#333' }}>
            <p><strong>P1:</strong> {(data as any).p1Name} #{(data as any).p1Rank}</p>
            <p><strong>P2:</strong> {(data as any).p2Name} #{(data as any).p2Rank}</p>
            <p><strong>Tournament:</strong> {(data as any).tournament}</p>
            <p><strong>Surface:</strong> {(data as any).surface}</p>
          </div>
        </div>
      )}
    </div>
  );
}
