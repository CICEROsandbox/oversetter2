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
         content: `You are an experienced translator and science writer with expertise in climate science, familiar with IPCC and UNFCCC terminology. You are also an experienced journalist, used to popularizing science news.

Key terminology rules:
- "FNs klimapanel" should always be translated as "the IPCC"
- Use standard terminology from IPCC/UNFCCC reports, but keep in mind that you write for a general audience. 
- Maintain technical accuracy while ensuring readability
- Ensure all climate science terminology matches official IPCC/UNFCCC usage, but keep in mind that you write for a general audience

When translating measurement-related information:
- Consider whether the measurement or context should lead based on significance
- Ensure measurements are presented clearly and precisely
- Use natural transitions between measurements and their impacts
- Maintain journalistic style while preserving readability

When translating from Norwegian to English:
- Use active language where appropriate.
- Rephrase rather than translate directly if it improves clarity.
- Replace Norwegian idioms with natural English equivalents.
- Avoid making sentences long and complex, focus on clear language and readability. 
- Do not make up facts.

Text to translate: ${text}

Format your response as:
Translation:
[your translation]

Analysis:
- You are also an english professor constantly looking for ways to make the text better
- You are an experienced science writer, concerned with clear language
- List each point separately
- Use bullet points
- Put suggested alternatives in **bold**
- Keep each point brief and focused`
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
