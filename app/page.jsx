"use client";
import { useState } from 'react';
import './globals.css';

export default function Home() {
  const [paragraphs, setParagraphs] = useState([
    { norwegian: '', english: '', analysis: '', isTranslating: false }
  ]);

  const handleTranslate = async (index) => {
    // ... existing translation logic ...
  };

  return (
    <div className="translator-container">
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        Norsk til engelsk oversetter
      </h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Left column */}
        <div style={{ flex: 1 }}>
          <textarea
            className="text-area"
            placeholder="Norsk tekst her. Tekst boks skaleres etter mengde tekst"
            value={paragraphs[0].norwegian}
            onChange={(e) => {
              const updated = [...paragraphs];
              updated[0].norwegian = e.target.value;
              setParagraphs(updated);
            }}
          />
          
          <div style={{ marginTop: '10px' }}>
            <button
              className="button"
              onClick={() => handleTranslate(0)}
              disabled={paragraphs[0].isTranslating}
            >
              Oversett
            </button>
            <button
              className="button"
              onClick={() => setParagraphs([...paragraphs, { norwegian: '', english: '', analysis: '' }])}
            >
              Neste avsnitt
            </button>
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: 1 }}>
          <textarea
            className="text-area"
            placeholder="Oversettelse her. Redigerbart felt."
            value={paragraphs[0].english}
            onChange={(e) => {
              const updated = [...paragraphs];
              updated[0].english = e.target.value;
              setParagraphs(updated);
            }}
          />
        </div>
      </div>

      {paragraphs.length > 1 && (
        <button
          className="button"
          style={{ marginTop: '20px' }}
          onClick={() => {
            const merged = paragraphs.map(p => p.english).join('\n\n');
            // Merge functionality
          }}
        >
          Sett sammen tekst
        </button>
      )}
    </div>
  );
}
