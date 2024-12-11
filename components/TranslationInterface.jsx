import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TranslationInterface = () => {
  const [paragraphs, setParagraphs] = useState([
    { norwegian: '', english: '', analysis: '', isTranslating: false }
  ]);
  const [mergedTranslation, setMergedTranslation] = useState('');
  const [finalAnalysis, setFinalAnalysis] = useState('');

  const addNewParagraph = () => {
    setParagraphs([...paragraphs, { norwegian: '', english: '', analysis: '', isTranslating: false }]);
  };

  const handleNorwegianChange = (index, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].norwegian = value;
    setParagraphs(newParagraphs);
  };

  const handleEnglishEdit = (index, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].english = value;
    setParagraphs(newParagraphs);
  };

  const translateParagraph = async (index) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index].isTranslating = true;
    setParagraphs(newParagraphs);

    await new Promise(resolve => setTimeout(resolve, 1000));

    newParagraphs[index].english = `Translated text for: ${newParagraphs[index].norwegian}`;
    newParagraphs[index].analysis = 'Translation analysis: Consider reviewing terminology for technical accuracy.';
    newParagraphs[index].isTranslating = false;
    setParagraphs(newParagraphs);
  };

  const mergeParagraphs = () => {
    const merged = paragraphs.map(p => p.english).join('\n\n');
    setMergedTranslation(merged);
    setFinalAnalysis('Sample final analysis of the complete text...');
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column - Norwegian Input */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Norwegian Text</h2>
          {paragraphs.map((paragraph, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <Textarea
                  placeholder="Enter Norwegian text..."
                  value={paragraph.norwegian}
                  onChange={(e) => handleNorwegianChange(index, e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-2 mt-2">
                  <Button 
                    onClick={() => translateParagraph(index)}
                    disabled={!paragraph.norwegian || paragraph.isTranslating}
                    size="sm"
                    className="h-8 px-3 text-sm"
                  >
                    {paragraph.isTranslating ? 'Translating...' : 'Translate'}
                  </Button>
                  {index === paragraphs.length - 1 && (
                    <Button 
                      onClick={addNewParagraph}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-sm"
                    >
                      Add Next Paragraph
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column - English Translation */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">English Translation</h2>
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <Card>
                <CardContent className="pt-4">
                  <Textarea
                    placeholder="Translation will appear here..."
                    value={paragraph.english}
                    onChange={(e) => handleEnglishEdit(index, e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
              {paragraph.analysis && (
                <Alert>
                  <AlertDescription>
                    {paragraph.analysis}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}
        </div>
      </div>

      {paragraphs.length > 1 && (
        <div className="mt-8">
          <Button 
            onClick={mergeParagraphs} 
            className="mb-4 h-8 px-3 text-sm"
            size="sm"
          >
            Merge Translations
          </Button>
          
          {mergedTranslation && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">Complete Translation</h3>
                  <Textarea
                    value={mergedTranslation}
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>
              
              <Alert>
                <AlertDescription>
                  {finalAnalysis}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TranslationInterface;
