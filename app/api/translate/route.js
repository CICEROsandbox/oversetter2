import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
export const maxDuration = 30;

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
[List 4-5 key strengths of the translation, using numbers]

Areas for improvement:

1. First paragraph:
- Identify style and word choice issues
- Suggest better alternatives in **bold** format
- Note any structural improvements
- Focus on register consistency

2. Second paragraph:
- Identify style and word choice issues
- Suggest better alternatives in **bold** format
- Note any structural improvements
- Focus on register consistency

3. Third paragraph:
- Identify style and word choice issues
- Suggest better alternatives in **bold** format
- Note any structural improvements
- Focus on register consistency

4. Fourth paragraph:
- Identify style and word choice issues
- Suggest better alternatives in **bold** format
- Note any structural improvements
- Focus on register consistency`
       }
     ]
   });

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
     message: 'Translation failed: ' + error.message 
   }, { 
     status: 500 
   });
 }
}
