"use client";
import { useState } from 'react';

export default function Home() {
  const [paragraphs, setParagraphs] = useState([
    { norwegian: '', english: '', analysis: '', isTranslating: false }
  ]);

  const handleTranslate = async (index) => {
    try {
      console.log('Starting translation...'); // Debug log
      const updatedParagraphs = [...paragraphs];
      updatedParagraphs[index].isTranslating = true;
      setParagraphs(updatedParagraphs);

      const response = await fetch('/api/translate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: paragraphs[index].norwegian })
      });

      console.log('Response status:', response.status); // Debug log
      const data = await response.json();
      console.log('Response data:', data); // Debug log
      
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
    <div className="p-5" style={{ padding: '20px' }}>
      <h1 className="text-2xl mb-5 font-serif" style={{ fontSize: '24px', marginBottom: '20px', fontFamily: 'serif' }}>
        Norsk til engelsk oversetter
      </h1>
      
      {paragraphs.map((paragraph, index) => (
        <div key={index} className="mb-5" style={{ marginBottom: '20px' }}>
          <div className="flex gap-5 mb-3" style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            {/* Norwegian textarea */}
            <div className="w-1/2" style={{ width: '50%' }}>
              <textarea
                className="w-full h-40 border border-gray-300 p-3 bg-gray-50"
                style={{
                  width: '100%',
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
            </div>

            {/* English textarea and analysis */}
            <div className="w-1/2" style={{ width: '50%' }}>
              <textarea
                className="w-full h-40 border border-gray-300 p-3 bg-gray-50"
                style={{
                  width: '100%',
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

              {paragraph.analysis && (
                <details 
                  className="mt-2 border rounded-lg" 
                  style={{ marginTop: '8px', border: '1px solid #ccc', borderRadius: '8px' }}
                >
                  <summary 
                    className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    style={{ 
                      padding: '12px', 
                      backgroundColor: '#f5f5f5', 
                      cursor: 'pointer' 
                    }}
                  >
                    Show Analysis
                  </summary>
                  <div className="p-4" style={{ padding: '16px' }}>
                    <div className="mb-4" style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Strengths</h3>
                      <div>
                        {paragraph.analysis
                          .split('Strengths:')[1]
                          ?.split('Areas for improvement:')[0]
                          ?.split('-')
                          .filter(line => line.trim())
                          .map((strength, i) => (
                            <div key={i} style={{ marginLeft: '8px', color: '#4B5563' }}>
                              • {strength.trim()}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Areas for improvement</h3>
                      <div>
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
                            <div key={i} style={{ marginBottom: '16px' }}>
                              <div style={{ color: '#DC2626', fontWeight: '600' }}>Issue:</div>
                              <div style={{ marginLeft: '16px', marginBottom: '8px' }}>{item.issue}</div>
                              <div style={{ color: '#059669', fontWeight: '600' }}>Suggestion:</div>
                              <div style={{ marginLeft: '16px' }}>{item.suggestion}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>

          <div className="mt-3" style={{ marginTop: '12px' }}>
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
            marginTop: '20px',
            padding: '5px 15px',
            backgroundColor: '#e9e9e9',
            border: '1px solid #999',
            cursor: 'pointer'
          }}
          onClick={handleDownload}
        >
          Sett sammen tekst
        </button>
      )}
    </div>
  );
}
