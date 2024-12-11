"use client";
import React, { useState } from 'react';

const TranslationInterface = () => {
  const [paragraphs, setParagraphs] = useState([
    { norwegian: '', english: '', analysis: '', isTranslating: false }
  ]);

  const translateParagraph = async (index) => {
    console.log('Starting translation for:', paragraphs[index].norwegian); // Debug log
    
    const newParagraphs = [...paragraphs];
    newParagraphs[index].isTranslating = true;
    setParagraphs(newParagraphs);

    try {
      console.log('Making API request...'); // Debug log
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newParagraphs[index].norwegian
        })
      });

      console.log('Response received:', response.status); // Debug log
      const data = await response.json();
      console.log('Data:', data); // Debug log

      if (data.error) {
        throw new Error(data.error);
      }

      newParagraphs[index].english = data.translation;
      newParagraphs[index].analysis = data.analysis;
    } catch (error) {
      console.error('Translation failed:', error); // More detailed error log
      newParagraphs[index].analysis = 'Translation failed: ' + error.message;
    } finally {
      newParagraphs[index].isTranslating = false;
      setParagraphs(newParagraphs);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Norwegian Text</h2>
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="border rounded p-4">
              <textarea
                placeholder="Enter Norwegian text..."
                value={paragraph.norwegian}
                onChange={(e) => handleNorwegianChange(index, e.target.value)}
                className="w-full min-h-[100px] p-2 border rounded"
              />
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => translateParagraph(index)}
                  disabled={!paragraph.norwegian || paragraph.isTranslating}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
                >
                  {paragraph.isTranslating ? 'Translating...' : 'Translate'}
                </button>
                {/* ... rest of the buttons */}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* ... rest of the component */}
        </div>
      </div>
    </div>
  );
};

export default TranslationInterface;
