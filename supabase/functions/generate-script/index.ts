import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, genre, tone, length, characters, additionalNotes } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    console.log('Generating script for:', { topic, genre, tone, length });

    const lengthGuide = {
      'short': '500 words',
      'medium': '1000 words',
      'long': '2000 words',
    };

    const prompt = `You are a professional Indian script writer. Generate a complete script in Hindi/Hinglish with the following details:

Topic/Story: ${topic}
Genre: ${genre}
Tone: ${tone || 'dramatic'}
Target Length: ${lengthGuide[length as keyof typeof lengthGuide] || '1000 words'}
${characters ? `Characters to include: ${characters}` : ''}
${additionalNotes ? `Additional requirements: ${additionalNotes}` : ''}

FORMAT REQUIREMENTS:
1. Start with "SCENE 1: [SCENE TITLE]"
2. Use character names in CAPS before their dialogue (e.g., NARRATOR:, HERO:, VILLAIN:)
3. Include stage directions in brackets [like this]
4. Add emotional cues in parentheses (angry), (whisper), (excited)
5. Include scene transitions like "---" or "CUT TO:"
6. Write dialogues that sound natural in Hindi/Hinglish
7. End with script metadata: word count, character count, estimated voiceover credits

Make the script engaging, dramatic, and suitable for audio/video content creation. The dialogues should be conversational and impactful.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 4096,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response received');
    
    const generatedScript = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedScript) {
      throw new Error('No script generated from AI');
    }

    return new Response(
      JSON.stringify({ script: generatedScript }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-script function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
