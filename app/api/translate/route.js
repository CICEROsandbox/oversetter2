import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
export const maxDuration = 30;

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

Text to translate: ${text}

Format your response as:
Translation:
[your translation]

Analysis:
- List each point separately
- Use bullet points
- Put suggested alternatives in **bold**
- Keep each point brief and focused`
        }
      ]
    });

    return NextResponse.json({
      translation: message.content[0].text,
      analysis: message.content[1]?.text || ''
    }, {
      status: 200
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      error: true,
      message: 'Translation failed: ' + error.message 
    }, { 
      status: 500 
    });
  }
}
