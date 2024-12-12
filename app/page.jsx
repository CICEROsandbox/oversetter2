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

      const response = await fetch('/api/translate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: paragraphs[index].norwegian })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }
      
      updatedParagraphs[index] = {
        ...updatedParagraphs[index],
        english: data.translation || '',
        analysis: data.analysis || '',
        isTranslating: false
      };
      setParagraphs([...updatedParagraphs]);

    } catch (error) {
      console.error('Translation error:', error);
      const updatedParagraphs = [...paragraphs];
      updatedParagraphs[index].english = `Error: ${error.message || 'En feil oppstod. Vennligst prøv igjen.'}`;
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
    <div className="p-5">
      <h1 className="text-2xl mb-5 font-serif">
        Norsk til engelsk oversetter
      </h1>
      
      {paragraphs.map((paragraph, index) => (
        <div key={index} className="mb-5">
          <div className="flex gap-5 mb-3">
            {/* Norwegian textarea */}
            <div className="w-1/2">
              <textarea
                className="w-full h-40 border border-gray-300 p-3 bg-gray-50"
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
                className="w-full h-40 border border-gray-300 p-3 bg-gray-50"
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
                      <h3 className="text-gray-700 font-semibold mb-2">Strengths</h3>
                      <div className="space-y-2">
                        {paragraph.analysis
                          .split('Strengths:')[1]
                          ?.split('Areas for improvement:')[0]
                          ?.split('-')
                          .filter(line => line.trim())
                          .map((strength, i) => (
                            <div key={i} className="text-gray-600 ml-2">
                              • {strength.trim()}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Improvement Section */}
                    <div>
                      <h3 className="text-gray-700 font-semibold mb-2">Areas for improvement</h3>
                      <div className="space-y-4">
                        {paragraph.analysis
                          .split('Areas for improvement:')[1]
                          ?.split(/Issue:|Suggestion:/)
                          .filter(str => str.trim())
                          .reduce((acc, curr, i) => {
                            if (i % 2 === 0) {
                              acc.push({ issue: curr.trim() });
                            } else {
                              acc[acc.length - 1].suggestion = curr.trim();
                            }
                            return acc;
                          }, [])
                          .map((item, i) => (
                            <div key={i} className="mb-4">
                              <div className="text-red-600 font-semibold">Issue:</div>
                              <div className="ml-4 mb-2">{item.issue}</div>
                              <div className="text-green-600 font-semibold">Suggestion:</div>
                              <div className="ml-4">{item.suggestion}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>

          <div className="mt-3">
            <button
              className={`mr-3 px-4 py-1.5 border border-gray-400 ${
                paragraph.isTranslating ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 cursor-pointer hover:bg-gray-200'
              }`}
              onClick={() => handleTranslate(index)}
              disabled={paragraph.isTranslating}
            >
              {paragraph.isTranslating ? 'Oversetter...' : 'Oversett'}
            </button>
            {index === paragraphs.length - 1 && (
              <button
                className="px-4 py-1.5 bg-gray-100 border border-gray-400 cursor-pointer hover:bg-gray-200"
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
          className="mt-5 px-4 py-1.5 bg-gray-100 border border-gray-400 cursor-pointer hover:bg-gray-200"
          onClick={handleDownload}
        >
          Sett sammen tekst
        </button>
      )}
    </div>
  );
}
