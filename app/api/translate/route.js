import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,  // Added this
      messages: [
        {
          role: "user",
          content: `Translate this Norwegian text to English: "${text}"`
        }
      ]
    });

    return NextResponse.json({
      translation: message.content[0].text
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      error: true,
      message: error.message
    }, { status: 500 });
  }
}
