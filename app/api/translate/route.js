import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({
        error: 'No text provided',
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
- Flag any technical terms that might need clarification

2. Translation Principles
- Lead with measurements or context based on significance
- Use active voice where it enhances clarity
- Prioritize meaning over literal translation
- Identify and appropriately translate Norwegian idioms
- Break down complex sentences for better readability

3. Writing Style
- Provide ONLY the translation without any introductory text or explanations
- Balance technical accuracy with journalistic clarity
- Include credentials when they add credibility

Text to translate: ${text}

Respond in exactly this format:

Translation:
[translated text only]

Analysis:

Strengths:
- [Provide 3-4 specific strengths, mentioning exact phrases and why they work well]

Areas for improvement:
Issue: [Identify specific issues with idioms, formality level, or flow]
Suggestion: [Provide alternative phrasings and explain why they might work better]

Issue: [Point out any technical terminology that could be more precise]
Suggestion: [Offer industry-standard alternatives with explanation]

Issue: [Note any Norwegian constructions that could sound more natural in English]
Suggestion: [Show how to rephrase for better flow]`;

    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: systemInstructions
      }],
      temperature: 0
    });

    if (!completion?.content?.[0]?.text) {
      return NextResponse.json({
        error: 'Failed to get translation',
        translation: '',
        analysis: ''
      }, { status: 500 });
    }

    const response = completion.content[0].text;
    
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
      error: error.message || 'Translation failed',
      translation: '',
      analysis: ''
    }, { 
      status: error.status || 500 
    });
  }
}
