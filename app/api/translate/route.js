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

4. Attribution and Context
- Define organizations and roles on first mention
- Include relevant credentials for quoted experts
- Add geographic or cultural context when needed

Text to translate: ${text}

Format your response exactly as:
Translation:
[your translation]

Analysis:
A. Language Optimization
- Evaluate register consistency and appropriateness
- Assess flow and readability
- Suggest alternatives in **bold**
- Note any places where combining or separating sentences would help

B. Scientific Communication
- Evaluate technical accuracy
- Assess accessibility for general audience
- Note terminology choices
- Check whether expert credentials and context are appropriately provided

C. Translation Choices
- Explain significant departures from source text
- Highlight cultural adaptations
- Note challenging translation decisions
- Explain choices in measurement and context presentation`
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
