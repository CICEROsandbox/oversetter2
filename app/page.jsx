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
      <h1 className="text-2xl font-serif mb-6 pb-2 border-b">
        Norsk til engelsk oversetter
      </h1>
      
      {paragraphs.map((paragraph, index) => (
        <div key={index} className="mb-5">
          <div className="flex gap-5 mb-3">
            {/* Norwegian textarea */}
            <div className="w-1/2">
              <textarea
                className="w-full h-40 p-3 border border-gray-300 rounded-md bg-gray-50 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
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
                className="w-full h-40 p-3 border border-gray-300 rounded-md bg-gray-50 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                placeholder="Oversettelse her. Redigerbart felt."
                value={paragraph.english}
                onChange={(e) => {
                  const updated = [...paragraphs];
                  updated[index].english = e.target.value;
                  setParagraphs(updated);
                }}
              />

              {paragraph.analysis && (
                <details className="analysis-section mt-2 border rounded-lg shadow-sm hover:shadow transition-shadow duration-200">
                  <summary className="p-3 bg-gray-50 font-medium cursor-pointer hover:bg-gray-100 flex justify-between items-center">
                    <span>Show Analysis</span>
                    <span className="text-gray-400 text-sm">(Click to expand)</span>
                  </summary>
                  <div className="p-4">
                    {/* Strengths Section */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-md">
                      <h3 className="text-gray-800 font-semibold mb-3">Strengths</h3>
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

                    {/* Improvement Section */}
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-gray-800 font-semibold mb-3">Areas for improvement</h3>
                      <div className="space-y-4">
                        {paragraph.analysis
                          .split('Areas for improvement:')[1]
                          .split('Issue:')
                          .filter(str => str.trim())
                          .map((section, i) => {
                            const parts = section.split('Suggestion:');
                            if (parts.length !== 2) return null;
                            return (
                              <div key={i} className="bg-white p-3 rounded-md shadow-sm">
                                <div className="text-red-600 font-semibold">Issue:</div>
                                <div className="ml-4 mb-2 text-gray-700">{parts[0].trim()}</div>
                                <div className="text-green-600 font-semibold">Suggestion:</div>
                                <div className="ml-4 text-gray-700">{parts[1].trim()}</div>
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
              className="px-4 py-2 mr-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              onClick={() => handleTranslate(index)}
              disabled={paragraph.isTranslating}
            >
              {paragraph.isTranslating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Oversetter...
                </span>
              ) : 'Oversett'}
            </button>
            {index === paragraphs.length - 1 && (
              <button
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
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
          className="px-4 py-2 mt-5 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          onClick={handleDownload}
        >
          Sett sammen tekst
        </button>
      )}
    </div>
  );
}
