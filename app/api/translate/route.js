import { NextResponse } from 'next/server';

export async function POST(request) {
  return NextResponse.json({
    translation: "Test response",
    analysis: "Test analysis"
  });
}
