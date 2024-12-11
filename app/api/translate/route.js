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
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Translate this Norwegian text to English and provide a brief analysis of the translation, focusing on any challenging terms or suggestions for improvement:

Text to translate: "${text}"

Please format your response as:
Translation: [your translation]
Analysis: [your analysis]`
        }
      ]
    });

    // Parse the response to separate translation and analysis
    const response = message.content[0].text;
    const [translation, analysis] = response.split('Analysis:');

    return NextResponse.json({
      translation: translation.replace('Translation:', '').trim(),
      analysis: analysis ? analysis.trim() : ''
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      error: true,
      message: error.message
    }, { status: 500 });
  }
}
