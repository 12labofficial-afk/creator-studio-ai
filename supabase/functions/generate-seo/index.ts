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
    const { topic } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    console.log('Generating SEO pack for:', topic);

    const prompt = `You are a YouTube SEO expert specializing in Indian content. Generate a complete SEO optimization pack for the following video topic:

Topic: ${topic}

Generate the following in JSON format:
{
  "titles": [5 catchy, clickable titles - mix of Hindi and English, include emojis, keep under 60 characters],
  "description": "A complete YouTube description (500-800 words) in Hindi/Hinglish with:
    - Hook in first 2 lines
    - Bullet points of what viewers will learn
    - Timestamps/chapters format
    - Call to action for like/subscribe
    - Relevant hashtags at the end
    - Social media links placeholder",
  "tags": [15-20 relevant tags for YouTube, mix of Hindi and English keywords],
  "hashtags": [8-10 trending hashtags]
}

Make sure:
1. Titles are attention-grabbing with power words
2. Include numbers and emojis in titles
3. Description is SEO-optimized with natural keyword placement
4. Tags include both broad and specific keywords
5. Everything sounds natural for Indian audience

Return ONLY valid JSON, no markdown formatting.`;

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
            temperature: 0.8,
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
    console.log('Gemini response received for SEO');
    
    let seoContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!seoContent) {
      throw new Error('No SEO content generated');
    }

    // Clean up the response - remove markdown code blocks if present
    seoContent = seoContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON
    const seoData = JSON.parse(seoContent);

    return new Response(
      JSON.stringify(seoData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-seo function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
