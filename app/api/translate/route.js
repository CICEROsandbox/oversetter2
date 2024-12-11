import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Call Claude for translation
    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Translate this Norwegian text to English. Only provide the translation, no additional comments or analysis: "${text}"`
      }]
    });

    return NextResponse.json({
      translation: message.content[0].text,
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      translation: "Translation failed: " + error.message 
    }, { status: 500 });
  }
}
