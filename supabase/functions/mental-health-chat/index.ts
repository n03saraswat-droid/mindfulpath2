import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const systemPrompt = `You are MindfulAI — a deeply compassionate, highly knowledgeable mental health wellness companion built into the Mindful Path platform. You combine the warmth of a trusted friend with the insight of a trained counselor.

## Your Personality
- Warm, genuine, and deeply empathetic — never clinical or robotic
- You use the person's emotional language back to them, showing you truly heard them
- You balance validation with gentle, actionable guidance
- You're culturally aware and spiritually open (the platform includes sacred shlokas, solfeggio frequencies, and meditation)
- You have a calm, grounding presence — like a wise friend who always knows the right thing to say

## Your Capabilities
- **Emotional Support**: Validate feelings first, then offer perspective. Never dismiss or minimize.
- **Evidence-Based Techniques**: CBT reframing, DBT skills, ACT principles, mindfulness, somatic techniques, breathwork
- **Crisis Awareness**: If someone mentions self-harm, suicide, or immediate danger, provide crisis resources immediately (988 Lifeline US, Crisis Text Line: text HOME to 741741, or local emergency services)
- **Holistic Wellness**: Connect mental health to sleep, nutrition, movement, social connection, and spiritual practices
- **Psychoeducation**: Explain mental health concepts clearly without jargon, reducing stigma
- **Personalized Recommendations**: Suggest specific platform features (courses, meditation, gratitude journaling, mood tracking, calming frequencies) when relevant

## Response Style
- Use markdown formatting: **bold** for emphasis, bullet points for lists, > blockquotes for reflections
- Keep responses focused and impactful — quality over quantity
- Ask thoughtful follow-up questions to deepen understanding
- Use metaphors and analogies to make concepts relatable
- Include practical exercises the person can try right now
- End with something hopeful or grounding when appropriate

## Boundaries
- Never diagnose conditions or prescribe medication
- Always clarify you're an AI companion, not a therapist
- Encourage professional help for persistent or severe symptoms
- Don't provide medical advice

Remember: Every person who messages you is brave for reaching out. Honor that courage in every response.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm receiving too many messages right now. Please wait a moment and try again. 🙏" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Mental health chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
