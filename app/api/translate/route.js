import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { text } = await request.json();

    // Input validation
    if (!text || typeof text !== 'string') {
      return NextResponse.json({
        error: 'Invalid input: Text is required and must be a string',
        translation: '',
        analysis: ''
      }, { status: 400 });
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Missing Anthropic API key');
      return NextResponse.json({
        error: 'Configuration error',
        translation: '',
        analysis: ''
      }, { status: 500 });
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
- Provide ONLY the translation without any introductory text or explanations
- Do not include phrases like "Here is my translation" or "Here's the English version"
- Start directly with the translated text
- Balance technical accuracy with journalistic clarity
- Include credentials when they add credibility

Text to translate: ${text}

Respond in exactly this format:

Translation:
[translated text only]

Analysis:

Strengths:
- [List 2-3 key strengths of the translation]

Areas for improvement:
Issue: [describe issue]
Suggestion: [improvement suggestion]`;

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
      console.error('Empty response from Anthropic API');
      return NextResponse.json({
        error: 'Empty translation response',
        translation: '',
        analysis: ''
      }, { status: 500 });
    }

    const response = completion.content[0].text;
    
    let translationPart = '';
    let analysisPart = '';
    
    // More robust parsing
    if (response.includes('Analysis:')) {
      const [translationSection, analysisSection] = response.split('Analysis:');
      translationPart = translationSection.replace('Translation:', '').trim();
      analysisPart = analysisSection.trim();
    } else {
      translationPart = response.replace('Translation:', '').trim();
    }

    if (!translationPart) {
      console.error('Failed to parse translation from response');
      return NextResponse.json({
        error: 'Failed to parse translation',
        translation: '',
        analysis: ''
      }, { status: 500 });
    }

    return NextResponse.json({
      translation: translationPart,
      analysis: analysisPart
    });

  } catch (error) {
    console.error('Translation error:', error);
    
    // More specific error handling
    if (error.status === 401) {
      return NextResponse.json({
        error: 'Authentication failed',
        translation: '',
        analysis: ''
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      translation: '',
      analysis: ''
    }, { 
      status: error.status || 500 
    });
  }
}
