"use client";
import { useState } from 'react';

export default function Home() {
  const [paragraphs, setParagraphs] = useState([
    { norwegian: '', english: '', analysis: '', isTranslating: false }
  ]);

  const handleTranslate = async (index) => {
    try {
      const updatedParagraphs = [...paragraphs];
      updatedParagraphs[index].isTranslating = true;
      setParagraphs(updatedParagraphs);

      updatedParagraphs[index].english = "Oversetter...";
      setParagraphs([...updatedParagraphs]);

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: paragraphs[index].norwegian })
      });

      const data = await response.json();
      
      updatedParagraphs[index] = {
        ...updatedParagraphs[index],
        english: data.translation,
        analysis: data.analysis || 'Analysis will appear here.',
        isTranslating: false
      };
      setParagraphs([...updatedParagraphs]);

    } catch (error) {
      console.error('Translation error:', error);
      const updatedParagraphs = [...paragraphs];
      updatedParagraphs[index].english = "Det oppstod en feil. Vennligst prøv igjen.";
      updatedParagraphs[index].isTranslating = false;
      setParagraphs(updatedParagraphs);
    }
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, { norwegian: '', english: '', analysis: '', isTranslating: false }]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px', fontFamily: 'serif' }}>
        Norsk til engelsk oversetter
      </h1>
      
      {paragraphs.map((paragraph, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            <textarea
              style={{
                width: '50%',
                height: '150px',
                border: '1px solid #ccc',
                padding: '10px',
                backgroundColor: '#f5f5f5'
              }}
              placeholder="Norsk tekst her. Tekst boks skaleres"
              value={paragraph.norwegian}
              onChange={(e) => {
                const updated = [...paragraphs];
                updated[index].norwegian = e.target.value;
                setParagraphs(updated);
              }}
            />

            <textarea
              style={{
                width: '50%',
                height: '150px',
                border: '1px solid #ccc',
                padding: '10px',
                backgroundColor: paragraph.isTranslating ? '#f0f0f0' : '#f5f5f5'
              }}
              placeholder="Oversettelse her. Redigerbart felt."
              value={paragraph.english}
              onChange={(e) => {
                const updated = [...paragraphs];
                updated[index].english = e.target.value;
                setParagraphs(updated);
              }}
              readOnly={paragraph.isTranslating}
            />
          </div>

          {paragraph.analysis && (
            <div style={{ 
              marginLeft: '50%', 
              paddingLeft: '20px', 
              marginBottom: '10px',
              color: '#666',
              fontSize: '14px'
            }}>
              {paragraph.analysis}
            </div>
          )}

{paragraphs.length > 1 && (
  <button
    style={{
      padding: '5px 15px',
      backgroundColor: '#e9e9e9',
      border: '1px solid #999',
      cursor: 'pointer',
      marginTop: '20px'
    }}
    onClick={() => {
      // Combine all translated paragraphs with line breaks between them
      const mergedText = paragraphs
        .map(p => p.english)
        .filter(text => text && text.trim() !== '') // Remove empty translations
        .join('\n\n');

      // Create blob and download link
      const blob = new Blob([mergedText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translated-text.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }}
  >
    Sett sammen tekst
  </button>
)}
    </div>
  );
}
