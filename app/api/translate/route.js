import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({
        translation: '',
        analysis: ''
      }, { status: 400 });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const systemInstructions = `You are a professional translator combining expertise in:
- Climate science (IPCC/UNFCCC terminology)
- Science journalism and communication
- Academic English writing
- Translation best practices

Key Guidelines:

1. Technical Accuracy
- Translate "FNs klimapanel" as "the IPCC"
- Use standard IPCC/UNFCCC terminology
- Ensure scientific precision while maintaining accessibility

2. Translation Principles
- Lead with measurements or context based on significance
- Use active voice where it enhances clarity
- Prioritize meaning over literal translation
- Convert Norwegian idioms to natural English equivalents
- Break down complex sentences for better readability

3. Writing Style
- Do not add extra text that is not in the manuscript
- Balance technical accuracy with journalistic clarity
- Provide relevant context for international readers
- Include credentials when they add credibility

Text to translate: ${text}

Format your response exactly as follows:

Translation:
[your translation]

Analysis:

Strengths:
- [List 2-3 key strengths of the translation]

Areas for improvement:
Issue: [describe issue]
Suggestion: [improvement suggestion]`;

    const prompt = `${Anthropic.HUMAN_PROMPT}${systemInstructions}${Anthropic.AI_PROMPT}`;

    const completion = await anthropic.completions.create({
      model: "claude-2",
      max_tokens_to_sample: 1000,
      prompt,
      temperature: 0,
      stop_sequences: [Anthropic.HUMAN_PROMPT]
    });

    if (!completion?.completion) {
      return NextResponse.json({
        translation: '',
        analysis: ''
      }, { status: 500 });
    }

    const response = completion.completion;
    
    let translationPart = '';
    let analysisPart = '';
    
    if (response.includes('Analysis:')) {
      const parts = response.split('Analysis:');
      translationPart = (parts[0] || '').replace('Translation:', '').trim();
      analysisPart = (parts[1] || '').trim();
    } else {
      translationPart = response.replace('Translation:', '').trim();
    }

    return NextResponse.json({
      translation: translationPart || '',
      analysis: analysisPart || ''
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      translation: '',
      analysis: ''
    }, { 
      status: error.status || 500 
    });
  }
}
