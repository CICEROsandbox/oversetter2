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

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: paragraphs[index].norwegian })
      });

      const data = await response.json();
      
      updatedParagraphs[index] = {
        ...updatedParagraphs[index],
        english: data.translation,
        analysis: data.analysis,
        isTranslating: false
      };
      setParagraphs(updatedParagraphs);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Norsk til engelsk oversetter</h1>
      
      {paragraphs.map((paragraph, index) => (
        <div key={index} className="mb-8">
          <textarea
            className="w-full h-32 p-2 border rounded mb-2"
            placeholder="Norsk tekst her. Tekst boks skaleres etter mengde tekst"
            value={paragraph.norwegian}
            onChange={(e) => {
              const updated = [...paragraphs];
              updated[index].norwegian = e.target.value;
              setParagraphs(updated);
            }}
          />
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleTranslate(index)}
              className="px-4 py-1 border rounded hover:bg-gray-100"
              disabled={paragraph.isTranslating}
            >
              {paragraph.isTranslating ? 'Oversetter...' : 'Oversett'}
            </button>
            
            {index === paragraphs.length - 1 && (
              <button
                onClick={() => setParagraphs([...paragraphs, { norwegian: '', english: '', analysis: '' }])}
                className="px-4 py-1 border rounded hover:bg-gray-100"
              >
                Neste avsnitt
              </button>
            )}
          </div>

          <textarea
            className="w-full h-32 p-2 border rounded mb-2"
            placeholder="Oversettelse her. Redigerbart felt."
            value={paragraph.english}
            onChange={(e) => {
              const updated = [...paragraphs];
              updated[index].english = e.target.value;
              setParagraphs(updated);
            }}
            readOnly={!paragraph.english}
          />
          
          {paragraph.analysis && (
            <div className="p-2 bg-gray-50 border rounded text-sm">
              {paragraph.analysis}
            </div>
          )}
        </div>
      ))}

      {paragraphs.length > 1 && (
        <button
          onClick={() => {
            const merged = paragraphs.map(p => p.english).join('\n\n');
            // Add functionality for merging translations
          }}
          className="px-4 py-1 border rounded hover:bg-gray-100"
        >
          Sett sammen tekst
        </button>
      )}
    </div>
  );
}
