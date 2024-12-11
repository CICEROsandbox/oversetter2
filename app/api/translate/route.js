import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    console.log('API route started');
    
    const { text } = await request.json();
    console.log('Received text:', text);
    
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    
    console.log('Initializing Anthropic client');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    console.log('Calling Claude API');
    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Translate this Norwegian text to English. Only provide the translation, no additional comments or analysis: "${text}"`
      }]
    });

    console.log('Translation received');
    return NextResponse.json({
      translation: message.content[0].text,
    });

  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json({ 
      translation: "Translation failed: " + error.message,
      error: error.message
    }, { status: 500 });
  }
}
