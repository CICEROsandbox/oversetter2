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
      setParagraphs([...updatedParagraphs]);

    } catch (error) {
      console.error('Translation error:', error);
      const updatedParagraphs = [...paragraphs];
      updatedParagraphs[index].english = "Det oppstod en feil. Vennligst prøv igjen.";
      updatedParagraphs[index].isTranslating = false;
      setParagraphs(updatedParagraphs);
    }
  };

  const handleDownload = () => {
    try {
      const mergedText = paragraphs
        .map(p => p.english.replace(/^["']|["']$/g, '').trim())
        .filter(text => text && text.trim() !== '')
        .join('\n\n');

      const blob = new Blob([mergedText], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `translated-text-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

return (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-serif mb-6">
      Norsk til engelsk oversetter
    </h1>
    
    {paragraphs.map((paragraph, index) => (
      <div key={index} className="mb-5">
        <div className="flex gap-5 mb-3">
          {/* Norwegian textarea */}
          <div className="w-1/2">
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-md bg-gray-50"
              placeholder="Norsk tekst her. Tekst boks skaleres"
              value={paragraph.norwegian}
              onChange={(e) => {
                const updated = [...paragraphs];
                updated[index].norwegian = e.target.value;
                setParagraphs(updated);
              }}
            />
          </div>

          {/* English textarea and analysis */}
          <div className="w-1/2">
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-md bg-gray-50"
              placeholder="Oversettelse her. Redigerbart felt."
              value={paragraph.english}
              onChange={(e) => {
                const updated = [...paragraphs];
                updated[index].english = e.target.value;
                setParagraphs(updated);
              }}
            />
            
            {paragraph.analysis && (
              <details className="analysis-section mt-2 border rounded-lg">
                <summary className="p-3 bg-gray-50 font-medium cursor-pointer hover:bg-gray-100">
                  Show Analysis
                </summary>
                <div className="p-4">
                  {/* Strengths Section */}
                  <div className="mb-4">
                    <h3 className="text-gray-700 font-semibold mb-2">Strengths:</h3>
                    <div className="space-y-2">
                      {paragraph.analysis
                        .split('Strengths:')[1]
                        .split('Areas for improvement:')[0]
                        .split('\n')
                        .filter(line => line.trim())
                        .map((strength, i) => (
                          <div key={i} className="text-gray-600 ml-2">
                            {strength.trim()}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Improvements Section */}
                  <div>
                    <h3 className="text-gray-700 font-semibold mb-2">Areas for improvement:</h3>
                    <div className="space-y-4">
                      {paragraph.analysis
                        .split('Areas for improvement:')[1]
                        .split('Issue:')
                        .filter(str => str.trim())
                        .map((section, i) => {
                          const parts = section.split('Suggestion:');
                          if (parts.length !== 2) return null;
                          return (
                            <div key={i} className="mb-4">
                              <div className="text-red-600 font-semibold">Issue:</div>
                              <div className="ml-4 mb-2">{parts[0].trim()}</div>
                              <div className="text-green-600 font-semibold">Suggestion:</div>
                              <div className="ml-4">{parts[1].trim()}</div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>

        <div className="mt-3">
          <button
            className="px-4 py-2 mr-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => handleTranslate(index)}
            disabled={paragraph.isTranslating}
          >
            {paragraph.isTranslating ? 'Oversetter...' : 'Oversett'}
          </button>
          {index === paragraphs.length - 1 && (
            <button
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              onClick={() => setParagraphs([...paragraphs, { norwegian: '', english: '', analysis: '', isTranslating: false }])}
            >
              Neste avsnitt
            </button>
          )}
        </div>
      </div>
    ))}

    {paragraphs.length > 1 && (
      <button
        className="px-4 py-2 mt-5 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        onClick={handleDownload}
      >
        Sett sammen tekst
      </button>
    )}
  </div>
);
