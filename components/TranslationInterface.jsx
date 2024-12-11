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

  const translateParagraph = async (index) => {
    // ... rest of translate function
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  {paragraph.isTranslating ? 'Translating...' : 'Translate'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* ... rest of the component */}
      </div>
    </div>
  );
};

export default TranslationInterface;
