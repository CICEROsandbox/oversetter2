import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    console.log('API route started');
    
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Missing Anthropic API key');
    }

    const { text } = await request.json();
    console.log('Received text:', text);
    
    // Create new client instance for each request
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
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
      translation: `Error: ${error.message}`,
      error: true 
    }, { status: 500 });
  }
}
