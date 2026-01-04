import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { script } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    console.log('Analyzing script, length:', script?.length);

    const prompt = `You are a script analysis expert. Analyze the following script and extract character information for voiceover generation.

SCRIPT:
${script}

Analyze and return a JSON response with:
{
  "characters": [
    {
      "name": "Character name (e.g., NARRATOR, HERO, etc.)",
      "dialogueCount": number of dialogues by this character,
      "dialogues": ["first few words of each dialogue..."],
      "suggestedVoice": "male-deep" | "male-young" | "female-soft" | "female-energetic" | "male-narrator" | "female-narrator",
      "emotionalTone": "primary emotional tone (dramatic, calm, angry, etc.)"
    }
  ],
  "totalDialogues": total number of dialogue lines,
  "estimatedDuration": "estimated audio duration in minutes",
  "estimatedCredits": estimated credits (calculate as: totalDialogues * 5),
  "scriptSummary": "brief 1-2 line summary of the script"
}

Rules:
1. Identify ALL speaking characters
2. Character names should be in UPPERCASE
3. Include NARRATOR if present
4. Suggest appropriate voice based on character type
5. Calculate credits as 5 per dialogue line

Return ONLY valid JSON, no markdown.`;

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
            temperature: 0.3,
            maxOutputTokens: 2048,
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
    console.log('Script analysis complete');
    
    let analysisContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!analysisContent) {
      throw new Error('No analysis generated');
    }

    // Clean up the response
    analysisContent = analysisContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const analysisData = JSON.parse(analysisContent);

    return new Response(
      JSON.stringify(analysisData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in analyze-script function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
