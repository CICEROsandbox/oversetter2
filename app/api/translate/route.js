import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { text } = await request.json();

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    // Construct the prompt using Anthropic's required formatting.
    // Include the entire instruction plus the user text.
    const systemInstructions = `You are a professional translator combining expertise in:
- Climate science (IPCC/UNFCCC terminology)
- Science journalism and communication
- Academic English writing
- Translation best practices

Key Guidelines:
1. Do not add any comments to the translation - such as "this is my translation" or "here is the result". Just provide the translation

1. Technical Accuracy
- Translate "FNs klimapanel" as "the IPCC"
- Use standard IPCC/UNFCCC terminology
- Ensure scientific precision while maintaining accessibility

2. Translation Principles
- Lead with measurements or context based on significance
- Use active voice where it enhances clarity
- Prioritize meaning over literal translation
- Convert Norwegian idioms to natural English equivalents
- Break down complex sentences for better readability

3. Writing Style and Register
- Consider the appropriate formality level for each context
- Balance technical accuracy with journalistic clarity
- Maintain consistent register while preserving natural flow
- Consider whether informal phrases enhance or detract from the message
- Choose words that best serve the content's purpose
- Provide relevant context for international readers

Text to translate: ${text}

Format your response exactly as follows:

Translation:
[your translation]

Analysis:

Areas for improvement:

- Style and word choice issues:
  - Current issue: [describe]
  - Suggested improvement: **[formal alternative]**
- Register consistency:
  - Current issue: [describe]
  - Suggested improvement: **[consistent register alternative]**
- Structural improvements:
  - Current issue: [describe]
  - Suggested improvement: **[better structure]**;

    // Construct the final prompt. Claude expects a structure with HUMAN_PROMPT and AI_PROMPT.
    const prompt = `${Anthropic.HUMAN_PROMPT}${systemInstructions}${Anthropic.AI_PROMPT}`;

    // Call the Anthropic API using completions.create
    const completion = await anthropic.completions.create({
      model: "claude-2", // Make sure the model name is correct and available.
      max_tokens_to_sample: 1000,
      prompt,
      temperature: 0, // Optional, adjust temperature as needed.
      stop_sequences: [Anthropic.HUMAN_PROMPT]
    });

    const response = completion.completion;

    // Now parse the response into translation and analysis.
    let [translationPart, analysisPart] = response.split('Analysis:');

    if (!translationPart || !analysisPart) {
      throw new Error('Invalid response format from API');
    }

    translationPart = translationPart.replace('Translation:', '').trim();
    analysisPart = analysisPart.trim();

    if (!translationPart || !analysisPart) {
      throw new Error('Empty translation or analysis after processing');
    }

    return NextResponse.json({
      translation: translationPart,
      analysis: analysisPart
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ 
      error: true,
      message: 'Translation failed: ' + error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { 
      status: error.status || 500 
    });
  }
}
