import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

const message = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: `You are an experienced translator and science writer with expertise in climate science, familiar with IPCC and UNFCCC terminology. 

Key terminology rules:
- "FNs klimapanel" should always be translated as "the IPCC"
- Use standard terminology from IPCC/UNFCCC reports
- Maintain technical accuracy while ensuring readability

When translating from Norwegian to English:
- Use active language where appropriate
- Rephrase rather than translate directly if it improves clarity
- Replace Norwegian idioms with natural English equivalents
- Ensure all climate science terminology matches official IPCC/UNFCCC usage

When translating from Norwegian to English:
- Use active language where appropriate
- Rephrase rather than translate directly if it improves clarity
- Replace Norwegian idioms with natural English equivalents
- Use standard terminology from IPCC/UNFCCC reports
- Maintain technical accuracy while ensuring readability

Text to translate: ${text}

Format your response as:
Translation:
[your translation]

Analysis:
[Brief analysis focusing ONLY on uncertain parts. Mark suggested replacements in **bold**.]`
    }
  ]
});
    // Split response into translation and analysis
    const response = message.content[0].text;
    let [translation, analysis] = response.split('Analysis:');
    
    // Clean up the translation and analysis
    translation = translation.replace('Translation:', '').replace(/^["']|["']$/g, '').trim();
    analysis = analysis ? analysis.trim() : '';

    return NextResponse.json({
      translation: translation,
      analysis: analysis
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      error: true,
      message: error.message
    }, { status: 500 });
  }
}
