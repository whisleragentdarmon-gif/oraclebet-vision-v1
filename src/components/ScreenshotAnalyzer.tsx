import React, { useState } from 'react';

export const ScreenshotAnalyzer = ({ onDataExtracted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [data, setData] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setLoading(true);

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result.split(',')[1];
        setPreview(event.target.result);

        console.log('📤 Sending image to API...');

        // Call our API
        const response = await fetch('/api/analyze_screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });

        const result = await response.json();
        console.log('📥 API Response:', result);

        if (!response.ok) {
          throw new Error(result.error || 'API error');
        }

        setData(result.data);
        setLoading(false);

        // Notify parent component
        if (onDataExtracted) {
          onDataExtracted(result.data);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📸 Analyze Tennis Match Screenshot</h2>

      {/* Upload Area */}
      <div style={styles.uploadArea}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={loading}
          style={{ marginBottom: '10px' }}
        />
        <p style={styles.hint}>
          Upload a screenshot from ATP/WTA/Flashscore and Claude will extract the data!
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loading}>
          ⏳ Analyzing with Claude Vision... Please wait...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={styles.error}>
          ❌ Error: {error}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div style={styles.preview}>
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '8px' }}
          />
        </div>
      )}

      {/* Results */}
      {data && (
        <div style={styles.results}>
          <h3>✅ Extracted Data:</h3>

          <div style={styles.dataGrid}>
            <div style={styles.dataRow}>
              <strong>P1:</strong>
              <span>{data.p1Name} #{data.p1Rank}</span>
            </div>
            <div style={styles.dataRow}>
              <strong>P2:</strong>
              <span>{data.p2Name} #{data.p2Rank}</span>
            </div>
            <div style={styles.dataRow}>
              <strong>Tournament:</strong>
              <span>{data.tournament}</span>
            </div>
            <div style={styles.dataRow}>
              <strong>Surface:</strong>
              <span>{data.surface}</span>
            </div>
            <div style={styles.dataRow}>
              <strong>Round:</strong>
              <span>{data.round || '-'}</span>
            </div>
            <div style={styles.dataRow}>
              <strong>H2H:</strong>
              <span>{data.h2h || '-'}</span>
            </div>
          </div>

          {/* Raw JSON for debugging */}
          <details style={{ marginTop: '20px' }}>
            <summary>Raw JSON</summary>
            <pre style={styles.json}>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    color: '#fff'
  },
  title: {
    textAlign: 'center',
    color: '#ff9500',
    marginBottom: '20px'
  },
  uploadArea: {
    padding: '20px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  hint: {
    fontSize: '12px',
    color: '#aaa'
  },
  loading: {
    padding: '15px',
    backgroundColor: '#333',
    borderLeft: '4px solid #ffb100',
    borderRadius: '4px',
    color: '#ffb100',
    marginBottom: '20px'
  },
  error: {
    padding: '15px',
    backgroundColor: '#5a1a1a',
    borderLeft: '4px solid #ff6b6b',
    borderRadius: '4px',
    color: '#ff6b6b',
    marginBottom: '20px'
  },
  preview: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  results: {
    padding: '15px',
    backgroundColor: '#2d5016',
    borderRadius: '8px',
    marginTop: '20px'
  },
  dataGrid: {
    marginTop: '15px'
  },
  dataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #3a7a1a',
    fontSize: '14px'
  },
  json: {
    backgroundColor: '#1a1a1a',
    padding: '10px',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '11px'
  }
};

export default ScreenshotAnalyzer;
