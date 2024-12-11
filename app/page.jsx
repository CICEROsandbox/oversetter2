"use client";
import { useState } from 'react';

export default function Home() {
  const [paragraphs, setParagraphs] = useState([
    { norwegian: '', english: '', analysis: '', isTranslating: false }
  ]);
  const [mergedTranslation, setMergedTranslation] = useState('');
  const [finalAnalysis, setFinalAnalysis] = useState('');

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

  const addParagraph = () => {
    setParagraphs([...paragraphs, { norwegian: '', english: '', analysis: '', isTranslating: false }]);
  };

  const mergeTranslations = async () => {
    const merged = paragraphs.map(p => p.english).join('\n\n');
    setMergedTranslation(merged);

    // Get final analysis
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: merged })
      });
      const data = await response.json();
      setFinalAnalysis(data.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
    }
  };

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Norwegian Input Column */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Norwegian Text</h1>
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <textarea
                value={paragraph.norwegian}
                onChange={(e) => {
                  const updated = [...paragraphs];
                  updated[index].norwegian = e.target.value;
                  setParagraphs(updated);
                }}
                className="w-full p-2 border rounded min-h-[100px]"
                placeholder="Enter Norwegian text..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleTranslate(index)}
                  disabled={paragraph.isTranslating}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  {paragraph.isTranslating ? 'Translating...' : 'Translate'}
                </button>
                {index === paragraphs.length - 1 && (
                  <button
                    onClick={addParagraph}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    Add Paragraph
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* English Translation Column */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">English Translation</h1>
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <textarea
                value={paragraph.english}
                onChange={(e) => {
                  const updated = [...paragraphs];
                  updated[index].english = e.target.value;
                  setParagraphs(updated);
                }}
                className="w-full p-2 border rounded min-h-[100px]"
                placeholder="Translation will appear here..."
              />
              {paragraph.analysis && (
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  {paragraph.analysis}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {paragraphs.length > 1 && (
        <div className="mt-8 space-y-4">
          <button
            onClick={mergeTranslations}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Merge Translations
          </button>
          
          {mergedTranslation && (
            <>
              <h2 className="text-xl font-bold">Complete Translation</h2>
              <textarea
                value={mergedTranslation}
                onChange={(e) => setMergedTranslation(e.target.value)}
                className="w-full p-2 border rounded min-h-[200px]"
              />
              {finalAnalysis && (
                <div className="p-4 bg-gray-50 border rounded">
                  <h3 className="font-bold mb-2">Final Analysis</h3>
                  {finalAnalysis}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}
