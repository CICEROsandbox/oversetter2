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
          content: `First translate this Norwegian text to English, then provide a brief analysis of any challenging terms or suggested improvements:

Text to translate: ${text}

Format your response as:
Translation:
[translation]

Analysis:
[your brief analysis]`
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
