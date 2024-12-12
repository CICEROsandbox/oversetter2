import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
export const maxDuration = 300;

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a professional translator combining expertise in:
- Climate science (IPCC/UNFCCC terminology)
- Science journalism and communication
- Academic English writing
- Translation best practices

Key Guidelines:

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
- Include credentials when they add credibility

Text to translate: ${text}

Format your response exactly as follows:

Translation:
[your translation]

Analysis:

Strengths:
1. [Technical accuracy strength]
2. [Clarity and readability strength]
3. [Register consistency strength]
4. [Language adaptation strength]
5. [Context and attribution strength]

Areas for improvement:

1. First paragraph:
- Style and word choice issues:
  - Current issue: [describe]
  - Suggested improvement: **[formal alternative]**
- Register consistency:
  - Current issue: [describe]
  - Suggested improvement: **[consistent register alternative]**
- Structural improvements:
  - Current issue: [describe]
  - Suggested improvement: **[better structure]**

2. Second paragraph:
- Style and word choice issues:
  - Current issue: [describe]
  - Suggested improvement: **[formal alternative]**
- Register consistency:
  - Current issue: [describe]
  - Suggested improvement: **[consistent register alternative]**
- Structural improvements:
  - Current issue: [describe]
  - Suggested improvement: **[better structure]**

3. Third paragraph:
- Style and word choice issues:
  - Current issue: [describe]
  - Suggested improvement: **[formal alternative]**
- Register consistency:
  - Current issue: [describe]
  - Suggested improvement: **[consistent register alternative]**
- Structural improvements:
  - Current issue: [describe]
  - Suggested improvement: **[better structure]**

4. Fourth paragraph:
- Style and word choice issues:
  - Current issue: [describe]
  - Suggested improvement: **[formal alternative]**
- Register consistency:
  - Current issue: [describe]
  - Suggested improvement: **[consistent register alternative]**
- Structural improvements:
  - Current issue: [describe]
  - Suggested improvement: **[better structure]**`
        }
      ]
    });

    const response = message.content[0].text;
    let [translation, analysis] = response.split('Analysis:');
    
    // More robust error handling and cleaning
    if (!translation || !analysis) {
      throw new Error('Invalid response format from API');
    }

    // Clean up the translation and analysis
    translation = translation.replace('Translation:', '').replace(/^["']|["']$/g, '').trim();
    analysis = analysis.trim();

    // Verify we have content before returning
    if (!translation || !analysis) {
      throw new Error('Empty translation or analysis after processing');
    }

    return NextResponse.json({
      translation,
      analysis
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
