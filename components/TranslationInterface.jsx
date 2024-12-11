"use client";
import React, { useState } from 'react';

const TranslationInterface = () => {
  const [paragraphs, setParagraphs] = useState([
    { norwegian: '', english: '', analysis: '', isTranslating: false }
  ]);

  const handleNorwegianChange = (index, e) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].norwegian = e.target.value;
    setParagraphs(newParagraphs);
  };

  const handleEnglishEdit = (index, e) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].english = e.target.value;
    setParagraphs(newParagraphs);
  };

  const addNewParagraph = () => {
    setParagraphs([...paragraphs, { norwegian: '', english: '', analysis: '', isTranslating: false }]);
  };

  const translateParagraph = async (index) => {
    console.log('Starting translation for:', paragraphs[index].norwegian);
    
    const newParagraphs = [...paragraphs];
    newParagraphs[index].isTranslating = true;
    setParagraphs(newParagraphs);

    try {
      console.log('Making API request...');
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newParagraphs[index].norwegian
        })
      });

      console.log('Response received:', response.status);
      const data = await response.json();
      console.log('Data:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      newParagraphs[index].english = data.translation;
      newParagraphs[index].analysis = data.analysis;
    } catch (error) {
      console.error('Translation failed:', error);
      newParagraphs[index].analysis = 'Translation failed: ' + error.message;
    } finally {
      newParagraphs[index].isTranslating = false;
      setParagraphs(newParagraphs);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column - Norwegian Input */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Norwegian Text</h2>
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="border rounded p-4">
              <textarea
                value={paragraph.norwegian}
                onChange={(e) => handleNorwegianChange(index, e)}
                placeholder="Enter Norwegian text..."
                className="w-full min-h-[100px] p-2 border rounded resize-y"
                style={{ minHeight: '100px' }}
              />
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => translateParagraph(index)}
                  disabled={!paragraph.norwegian || paragraph.isTranslating}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
                >
                  {paragraph.isTranslating ? 'Translating...' : 'Translate'}
                </button>
                {index === paragraphs.length - 1 && (
                  <button 
                    onClick={addNewParagraph}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  >
                    Add Next Paragraph
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - English Translation */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">English Translation</h2>
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <div className="border rounded p-4">
                <textarea
                  value={paragraph.english}
                  onChange={(e) => handleEnglishEdit(index, e)}
                  placeholder="Translation will appear here..."
                  className="w-full min-h-[100px] p-2 border rounded resize-y"
                  style={{ minHeight: '100px' }}
                />
              </div>
              {paragraph.analysis && (
                <div className="bg-blue-50 border-blue-200 border rounded p-2 text-sm">
                  {paragraph.analysis}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranslationInterface;
