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
      .map(p => p.english.replace(/^["']|["']$/g, '').trim()) // Remove surrounding quotes
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
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px', fontFamily: 'serif' }}>
        Norsk til engelsk oversetter
      </h1>
      
      {paragraphs.map((paragraph, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            <textarea
              style={{
                width: '50%',
                height: '150px',
                border: '1px solid #ccc',
                padding: '10px',
                backgroundColor: '#f5f5f5'
              }}
              placeholder="Norsk tekst her. Tekst boks skaleres"
              value={paragraph.norwegian}
              onChange={(e) => {
                const updated = [...paragraphs];
                updated[index].norwegian = e.target.value;
                setParagraphs(updated);
              }}
            />
            <textarea
              style={{
                width: '50%',
                height: '150px',
                border: '1px solid #ccc',
                padding: '10px',
                backgroundColor: '#f5f5f5'
              }}
              placeholder="Oversettelse her. Redigerbart felt."
              value={paragraph.english}
              onChange={(e) => {
                const updated = [...paragraphs];
                updated[index].english = e.target.value;
                setParagraphs(updated);
              }}
            />
          </div>

{paragraph.analysis && (
  <details className="analysis-section mt-2 border rounded-lg">
    <summary className="p-3 bg-gray-50 font-medium cursor-pointer hover:bg-gray-100">
      Show Analysis
    </summary>
    <div className="p-4">
      {/* Strengths Section */}
      <div className="mb-4">
        <h3 className="text-gray-700 font-semibold mb-2">Strengths:</h3>
        <ul className="list-disc pl-5 space-y-2">
          {paragraph.analysis
            .split('Strengths:')[1]
            .split('Areas for improvement:')[0]
            .split(/\n/)
            .filter(str => str.trim() && str.startsWith('-'))
            .map((strength, i) => (
              <li key={i} className="text-gray-600">
                {strength.replace('-', '').trim()}
              </li>
            ))}
        </ul>
      </div>

      {/* Areas for Improvement */}
      <div>
        <h3 className="text-gray-700 font-semibold mb-2">Areas for improvement:</h3>
        <div className="space-y-4">
          {paragraph.analysis
            .split('Areas for improvement:')[1]
            .split(/Current issue:|Suggested improvement:/)
            .filter(str => str.trim())
            .reduce((pairs, item, i, arr) => {
              if (i % 2 === 0) {
                pairs.push({
                  issue: item.trim(),
                  suggestion: arr[i + 1]?.trim() || ''
                });
              }
              return pairs;
            }, [])
            .map((pair, i) => (
              <div key={i} className="ml-2">
                <div className="text-red-600 font-semibold">Issue:</div>
                <div className="ml-4 mb-2">{pair.issue}</div>
                <div className="text-green-600 font-semibold">Suggestion:</div>
                <div className="ml-4">{pair.suggestion}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  </details>
)}
          <div style={{ marginTop: '10px' }}>
            <button
              style={{
                marginRight: '10px',
                padding: '5px 15px',
                backgroundColor: paragraph.isTranslating ? '#cccccc' : '#e9e9e9',
                border: '1px solid #999',
                cursor: paragraph.isTranslating ? 'not-allowed' : 'pointer'
              }}
              onClick={() => handleTranslate(index)}
              disabled={paragraph.isTranslating}
            >
              {paragraph.isTranslating ? 'Oversetter...' : 'Oversett'}
            </button>
            {index === paragraphs.length - 1 && (
              <button
                style={{
                  padding: '5px 15px',
                  backgroundColor: '#e9e9e9',
                  border: '1px solid #999',
                  cursor: 'pointer'
                }}
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
          style={{
            padding: '5px 15px',
            backgroundColor: '#e9e9e9',
            border: '1px solid #999',
            cursor: 'pointer',
            marginTop: '20px'
          }}
          onClick={handleDownload}
        >
          Sett sammen tekst
        </button>
      )}
    </div>
  );
}
