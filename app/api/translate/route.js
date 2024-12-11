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
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Translate this Norwegian text to English. Provide only the direct translation without quotation marks or any additional commentary: ${text}`
        }
      ]
    });

    // Clean the response of any quotes
    const cleanTranslation = message.content[0].text.replace(/^["']|["']$/g, '').trim();

    return NextResponse.json({
      translation: cleanTranslation
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      error: true,
      message: error.message
    }, { status: 500 });
  }
}
