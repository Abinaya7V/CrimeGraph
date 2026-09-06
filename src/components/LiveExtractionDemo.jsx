import React, { useState } from 'react';

const LiveExtractionDemo = () => {
  const [text, setText] = useState(
    "On 14th August, a suspicious vehicle bearing registration TN-09-AB-4521 was seen near the central bank in Chennai. The driver, Ravi Kumar, was seen talking on his mobile 9876543210."
  );
  const [entities, setEntities] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExtract = async () => {
    setLoading(true);
    setError(null);
    setEntities(null);

    try {
      const response = await fetch("http://localhost:8000/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEntities(data);
    } catch (err) {
      setError("Backend not running — start the FastAPI server first on port 8000.");
      console.error("Extraction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getChipStyle = (type) => {
    const baseStyle = {
      display: 'inline-block',
      padding: '4px 12px',
      margin: '4px',
      borderRadius: '16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#fff',
    };
    
    switch(type) {
      case 'persons': return { ...baseStyle, backgroundColor: '#3b82f6' }; // blue
      case 'locations': return { ...baseStyle, backgroundColor: '#ec4899' }; // pink
      case 'phone_numbers': return { ...baseStyle, backgroundColor: '#22c55e' }; // green
      case 'vehicle_numbers': return { ...baseStyle, backgroundColor: '#f97316' }; // orange
      default: return { ...baseStyle, backgroundColor: '#6b7280' };
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Live Entity Extraction Demo</h2>
      <p style={{ color: '#666', marginBottom: '16px' }}>
        Test the NLP backend by entering a sample FIR report below.
      </p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: '100%',
          height: '120px',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '16px',
          fontSize: '16px',
          fontFamily: 'inherit'
        }}
      />
      
      <button 
        onClick={handleExtract} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4f46e5',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          marginBottom: '20px',
          fontWeight: 'bold',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Extracting...' : 'Extract Entities'}
      </button>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {entities && (
        <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginTop: 0 }}>Extracted Entities</h3>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>Persons:</strong>
            {entities.persons.length === 0 && <span style={{ color: '#999', marginLeft: '8px' }}>None found</span>}
            <div>
              {entities.persons.map((item, i) => (
                <span key={i} style={getChipStyle('persons')}>{item}</span>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>Locations:</strong>
            {entities.locations.length === 0 && <span style={{ color: '#999', marginLeft: '8px' }}>None found</span>}
            <div>
              {entities.locations.map((item, i) => (
                <span key={i} style={getChipStyle('locations')}>{item}</span>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>Phone Numbers:</strong>
            {entities.phone_numbers.length === 0 && <span style={{ color: '#999', marginLeft: '8px' }}>None found</span>}
            <div>
              {entities.phone_numbers.map((item, i) => (
                <span key={i} style={getChipStyle('phone_numbers')}>{item}</span>
              ))}
            </div>
          </div>
          
          <div>
            <strong>Vehicle Numbers:</strong>
            {entities.vehicle_numbers.length === 0 && <span style={{ color: '#999', marginLeft: '8px' }}>None found</span>}
            <div>
              {entities.vehicle_numbers.map((item, i) => (
                <span key={i} style={getChipStyle('vehicle_numbers')}>{item}</span>
              ))}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default LiveExtractionDemo;
