"use client";
import { useState } from 'react';

export default function Home() {
  const [paragraphs, setParagraphs] = useState([
    { norwegian: '', english: '', analysis: '', isTranslating: false }
  ]);
  const [mergedTranslation, setMergedTranslation] = useState('');

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
    <div className="p-8 max-w-6xl mx-auto bg-[#F0F4F8]">
      <h1 className="text-4xl mb-8">Norsk til engelsk oversetter</h1>
      
      {paragraphs.map((paragraph, index) => (
        <div key={index} className="mb-12">
          <div className="grid grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-4">
              <textarea
                placeholder="Norsk tekst her. Tekst boks skaleres etter mengde tekst"
                value={paragraph.norwegian}
                onChange={(e) => {
                  const updated = [...paragraphs];
                  updated[index].norwegian = e.target.value;
                  setParagraphs(updated);
                }}
                className="w-full h-40 p-4 bg-gray-200 border-none rounded resize-none"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => handleTranslate(index)}
                  className="px-6 py-2 bg-white rounded shadow hover:bg-gray-50"
                >
                  Oversett
                </button>
                {index === paragraphs.length - 1 && (
                  <button
                    onClick={() => setParagraphs([...paragraphs, { norwegian: '', english: '', analysis: '' }])}
                    className="px-6 py-2 bg-white rounded shadow hover:bg-gray-50"
                  >
                    Neste avsnitt
                  </button>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <textarea
                placeholder="Oversettelse her. Redigerbart felt."
                value={paragraph.english}
                onChange={(e) => {
                  const updated = [...paragraphs];
                  updated[index].english = e.target.value;
                  setParagraphs(updated);
                }}
                className="w-full h-40 p-4 bg-gray-200 border-none rounded resize-none"
              />
              {paragraph.analysis && (
                <div className="p-4 bg-white rounded shadow text-sm">
                  {paragraph.analysis}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {paragraphs.length > 1 && (
        <div className="mt-8">
          <button
            onClick={() => {
              const merged = paragraphs.map(p => p.english).join('\n\n');
              setMergedTranslation(merged);
            }}
            className="px-6 py-2 bg-white rounded shadow hover:bg-gray-50"
          >
            Sett sammen tekst
          </button>
          
          {mergedTranslation && (
            <textarea
              value={mergedTranslation}
              onChange={(e) => setMergedTranslation(e.target.value)}
              className="mt-4 w-full h-60 p-4 bg-gray-200 border-none rounded resize-none"
            />
          )}
        </div>
      )}
    </div>
  );
}
