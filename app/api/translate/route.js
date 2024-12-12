import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { text } = await request.json();

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

Suggestions for improvement:
- [List 2-3 specific suggestions to enhance clarity, accuracy, or style]`;

    const prompt = `${Anthropic.HUMAN_PROMPT}${systemInstructions}${Anthropic.AI_PROMPT}`;

    const completion = await anthropic.completions.create({
      model: "claude-2",
      max_tokens_to_sample: 1000,
      prompt,
      temperature: 0,
      stop_sequences: [Anthropic.HUMAN_PROMPT]
    });

    // Add safety checks for the response
    if (!completion?.completion) {
      throw new Error('No completion received from API');
    }

    const response = completion.completion;
    
    // Add better error handling for the split operation
    let translationPart = '';
    let analysisPart = '';
    
    if (response.includes('Analysis:')) {
      [translationPart, analysisPart] = response.split('Analysis:');
      translationPart = translationPart.replace('Translation:', '').trim();
      analysisPart = analysisPart.trim();
    } else {
      // If the response doesn't contain 'Analysis:', assume it's all translation
      translationPart = response.replace('Translation:', '').trim();
      analysisPart = 'No analysis provided';
    }

    // Validate that we have at least a translation
    if (!translationPart) {
      throw new Error('No translation found in response');
    }

    return NextResponse.json({
      success: true,
      translation: translationPart,
      analysis: analysisPart
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      success: false,
      error: true,
      message: 'Translation failed: ' + error.message,
      translation: '',
      analysis: '',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { 
      status: error.status || 500 
    });
  }
}
