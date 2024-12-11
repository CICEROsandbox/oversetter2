import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  try {
    // Log the request
    console.log('Translation request received');
    
    const { text } = await request.json();
    console.log('Text to translate:', text);

    // Mock translation for testing
    const translation = `Translated: ${text}`;
    
    return NextResponse.json({
      translation: translation,
      analysis: "Test analysis"
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
