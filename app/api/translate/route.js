import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    // Simple test response without API call
    return NextResponse.json({
      translation: `Test translation of: ${text}`,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error.message,
      translation: "Translation failed: " + error.message 
    }, { status: 500 });
  }
}
