"use client";
import React, { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleTranslate = async () => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setTranslation(data.translation || 'Translation failed');
    } catch (error) {
      console.error('Translation error:', error);
      setTranslation('Translation failed');
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Norwegian Text</h2>
          <textarea
            className="w-full p-3 border rounded-md min-h-[100px]"
            value={text}
            onChange={handleChange}
            placeholder="Enter Norwegian text..."
          />
          <button
            onClick={handleTranslate}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Translate
          </button>
        </div>

        {translation && (
          <div>
            <h2 className="text-xl font-bold mb-2">English Translation</h2>
            <div className="p-3 border rounded-md bg-gray-50">
              {translation}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
