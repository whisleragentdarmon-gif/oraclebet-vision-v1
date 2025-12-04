'use client';

import React, { useState, CSSProperties } from 'react';

interface AnalyzerProps {
  onDataExtracted?: (data: any) => void;
}

interface ScreenshotData {
  p1Name?: string;
  p1Rank?: string;
  p1Nationality?: string;
  p1Hand?: string;
  p2Name?: string;
  p2Rank?: string;
  p2Nationality?: string;
  p2Hand?: string;
  tournament?: string;
  surface?: string;
  date?: string;
  round?: string;
  h2h?: string;
}

export default function ScreenshotAnalyzer({ onDataExtracted }: AnalyzerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [data, setData] = useState<ScreenshotData | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result;
        
        if (typeof result !== 'string') {
          setError('File read error');
          setLoading(false);
          return;
        }

        const base64 = result.split(',')[1];
        setPreview(result);

        console.log('📤 Sending image to API...');

        const response = await fetch('/api/analyze_screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });

        const result_data = await response.json();
        console.log('📥 API Response:', result_data);

        if (!response.ok) {
          throw new Error(result_data.error || 'API error');
        }

        setData(result_data.data);
        setLoading(false);

        if (onDataExtracted) {
          onDataExtracted(result_data.data);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Unknown error');
      setLoading(false);
    }
  };

  const containerStyle: CSSProperties = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    color: '#fff'
  };

  const titleStyle: CSSProperties = {
    textAlign: 'center',
    color: '#ff9500',
    marginBottom: '20px'
  };

  const uploadAreaStyle: CSSProperties = {
    padding: '20px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const hintStyle: CSSProperties = {
    fontSize: '12px',
    color: '#aaa'
  };

  const loadingStyle: CSSProperties = {
    padding: '15px',
    backgroundColor: '#333',
    borderLeft: '4px solid #ffb100',
    borderRadius: '4px',
    color: '#ffb100',
    marginBottom: '20px'
  };

  const errorStyle: CSSProperties = {
    padding: '15px',
    backgroundColor: '#5a1a1a',
    borderLeft: '4px solid #ff6b6b',
    borderRadius: '4px',
    color: '#ff6b6b',
    marginBottom: '20px'
  };

  const previewStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px'
  };

  const imgStyle: CSSProperties = {
    maxWidth: '300px',
    maxHeight: '300px',
    borderRadius: '8px'
  };

  const resultsStyle: CSSProperties = {
    padding: '15px',
    backgroundColor: '#2d5016',
    borderRadius: '8px',
    marginTop: '20px'
  };

  const dataGridStyle: CSSProperties = {
    marginTop: '15px'
  };

  const dataRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #3a7a1a',
    fontSize: '14px'
  };

  const jsonStyle: CSSProperties = {
    backgroundColor: '#1a1a1a',
    padding: '10px',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '11px'
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>📸 Analyze Tennis Match Screenshot</h2>

      <div style={uploadAreaStyle}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={loading}
          style={{ marginBottom: '10px' }}
        />
        <p style={hintStyle}>
          Upload a screenshot from ATP/WTA/Flashscore and Claude will extract the data!
        </p>
      </div>

      {loading && (
        <div style={loadingStyle}>
          ⏳ Analyzing with Claude Vision... Please wait...
        </div>
      )}

      {error && (
        <div style={errorStyle}>
          ❌ Error: {error}
        </div>
      )}

      {preview && (
        <div style={previewStyle}>
          <img
            src={preview}
            alt="preview"
            style={imgStyle}
          />
        </div>
      )}

      {data && (
        <div style={resultsStyle}>
          <h3>✅ Extracted Data:</h3>

          <div style={dataGridStyle}>
            <div style={dataRowStyle}>
              <strong>P1:</strong>
              <span>{data.p1Name} #{data.p1Rank}</span>
            </div>
            <div style={dataRowStyle}>
              <strong>P2:</strong>
              <span>{data.p2Name} #{data.p2Rank}</span>
            </div>
            <div style={dataRowStyle}>
              <strong>Tournament:</strong>
              <span>{data.tournament}</span>
            </div>
            <div style={dataRowStyle}>
              <strong>Surface:</strong>
              <span>{data.surface}</span>
            </div>
            <div style={dataRowStyle}>
              <strong>Round:</strong>
              <span>{data.round || '-'}</span>
            </div>
            <div style={dataRowStyle}>
              <strong>H2H:</strong>
              <span>{data.h2h || '-'}</span>
            </div>
          </div>

          <details style={{ marginTop: '20px' }}>
            <summary>Raw JSON</summary>
            <pre style={jsonStyle}>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
