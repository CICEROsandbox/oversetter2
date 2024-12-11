"use client";
import { useState } from 'react';

export default function Home() {
  const [paragraphs, setParagraphs] = useState([
    { norwegian: '', english: '', analysis: '', isTranslating: false }
  ]);

  const handleTranslate = async (index) => {
    try {
      // Set loading state
      const updatedParagraphs = [...paragraphs];
      updatedParagraphs[index].isTranslating = true;
      setParagraphs(updatedParagraphs);

      // Show placeholder text while translating
      updatedParagraphs[index].english = "Oversetter...";
      setParagraphs([...updatedParagraphs]);

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: paragraphs[index].norwegian })
      });

      const data = await response.json();
      
      // Update with translation
      updatedParagraphs[index] = {
        ...updatedParagraphs[index],
        english: data.translation,
        analysis: data.analysis,
        isTranslating: false
      };
      setParagraphs([...updatedParagraphs]);

    } catch (error) {
      console.error('Translation error:', error);
      // Show error in the translation field
      const updatedParagraphs = [...paragraphs];
      updatedParagraphs[index].english = "Det oppstod en feil. Vennligst prøv igjen.";
      updatedParagraphs[index].isTranslating = false;
      setParagraphs(updatedParagraphs);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '24px', 
        marginBottom: '20px',
        fontFamily: 'serif'
      }}>
        Norsk til engelsk oversetter
      </h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <textarea
            style={{
              width: '100%',
              height: '150px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              padding: '10px',
              backgroundColor: '#f5f5f5'
            }}
            placeholder="Norsk tekst her. Tekst boks skaleres"
            value={paragraphs[0].norwegian}
            onChange={(e) => {
              const updated = [...paragraphs];
              updated[0].norwegian = e.target.value;
              setParagraphs(updated);
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <textarea
            style={{
              width: '100%',
              height: '150px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              padding: '10px',
              backgroundColor: paragraphs[0].isTranslating ? '#f0f0f0' : '#f5f5f5'
            }}
            placeholder="Oversettelse her. Redigerbart felt."
            value={paragraphs[0].english}
            onChange={(e) => {
              const updated = [...paragraphs];
              updated[0].english = e.target.value;
              setParagraphs(updated);
            }}
            readOnly={paragraphs[0].isTranslating}
          />
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button
          style={{
            marginRight: '10px',
            padding: '5px 15px',
            backgroundColor: paragraphs[0].isTranslating ? '#cccccc' : '#e9e9e9',
            border: '1px solid #999',
            cursor: paragraphs[0].isTranslating ? 'not-allowed' : 'pointer'
          }}
          onClick={() => handleTranslate(0)}
          disabled={paragraphs[0].isTranslating}
        >
          {paragraphs[0].isTranslating ? 'Oversetter...' : 'Oversett'}
        </button>
        <button
          style={{
            padding: '5px 15px',
            backgroundColor: '#e9e9e9',
            border: '1px solid #999',
            cursor: 'pointer'
          }}
          onClick={() => setParagraphs([...paragraphs, { norwegian: '', english: '', analysis: '' }])}
        >
          Neste avsnitt
        </button>
      </div>

      {paragraphs.length > 1 && (
        <div style={{ marginTop: '20px' }}>
          <button
            style={{
              padding: '5px 15px',
              backgroundColor: '#e9e9e9',
              border: '1px solid #999',
              cursor: 'pointer'
            }}
          >
            Sett sammen tekst
          </button>
        </div>
      )}
    </div>
  );
}
