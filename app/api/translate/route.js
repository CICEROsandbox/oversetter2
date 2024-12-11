import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { text } = await request.json();

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Translate this Norwegian text to English. Include any technical terms accurately: "${text}". 
                  After the translation, provide a brief analysis highlighting any technical terms or challenging portions.`
      }]
    });

    return NextResponse.json({
      translation: message.content[0].text,
      analysis: "Analysis: " + message.content[1].text
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
