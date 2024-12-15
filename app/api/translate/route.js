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
- Have a preference for direct language
- Be succinct and concise
- Rephrase if it improves the text, without changing the meaning

2. Translation Analysis Requirements
Provide a thorough analysis focusing on:
- All Norwegian idioms found in the text and their English equivalents
- Multiple alternative phrasings where the translation could be improved
- Register and formality issues
- Technical terminology accuracy
- Flow and readability of complex sentences
- Cultural adaptations needed

3. If full paragraph is in english. Supply a text analysis. Then you are not a translator, but a copy editor. 

Text to translate: ${text}

Respond in exactly this format:

Translation:
[translated text only]

Analysis:

Strengths:
- [List key strengths with specific examples]

Areas for improvement:

Issue: [Norwegian idiom or direct translation]
Suggestion: [List multiple natural English equivalents when available. Explain why. Give an assessment of how necessary the change is: Optional, Recommended, Highly recommended.]

Issue: [Review the use of numbers, to ensure that it reads well in english and is correct]
Suggestion: [Provide multiple alternative phrasings if it improves the text. Explain your suggestions. Give an assessment of how necessary the change is: Optional, Recommended, Highly recommended.]

Issue: [Another identified problem - could be terminology, flow, register, etc.]
Suggestion: [Provide multiple alternative phrasings if it improves the text. Explain your suggestions. Give an assessment of how necessary the change is: Optional, Recommended, Highly recommended.]

[Continue with additional Issue/Suggestion pairs as needed - no fixed number]`;

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
