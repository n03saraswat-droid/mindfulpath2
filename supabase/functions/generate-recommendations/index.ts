import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are the personalization engine for Mindful Path, a mental wellness platform.
Given a user's onboarding answers and recent activity, produce a warm, practical, personalized plan.

Available platform features you can recommend (use these exact ids):
- "mood" (Mood Tracker), "emotion-engine" (AI Emotion Engine), "analytics" (Mood Analytics),
- "chat" (AI Chat), "audio" (Audio Library: Shlokas, Gita, Solfeggio frequencies),
- "xp" (XP & Medals), "community" (Community Forum),
- "courses" (Learning Courses), "resources" (Resources Library),
- "self-care" (Self Care), "meditation" (Meditation practices incl. Box Breathing, Loving Kindness),
- "gratitude" (Gratitude Journal).

Rules:
- Be warm, constructive, skill-building. NEVER mention crisis hotlines or self-harm resources.
- Tailor to the user's goals, interests, stress level, daily time budget, preferred formats.
- Keep copy concise and actionable. Use the user's name if provided.`;

const recommendationsTool = {
  type: "function",
  function: {
    name: "produce_recommendations",
    description: "Produce a personalized wellness plan with feature suggestions, content picks, and a daily plan.",
    parameters: {
      type: "object",
      properties: {
        insights: {
          type: "string",
          description: "A short (2-3 sentence) warm, personalized opening insight acknowledging their goals and situation.",
        },
        suggestedFeatures: {
          type: "array",
          description: "3-5 platform features to try, ordered by relevance.",
          items: {
            type: "object",
            properties: {
              featureId: {
                type: "string",
                enum: ["mood","emotion-engine","analytics","chat","audio","xp","community","courses","resources","self-care","meditation","gratitude"],
              },
              title: { type: "string" },
              reason: { type: "string", description: "Why this helps THIS user, tied to their answers." },
              actionLabel: { type: "string", description: "Short CTA e.g. 'Try a 5-min session'." },
            },
            required: ["featureId","title","reason","actionLabel"],
            additionalProperties: false,
          },
        },
        contentPicks: {
          type: "array",
          description: "3-5 specific content recommendations (courses, audio tracks, shlokas, articles) curated to their interests.",
          items: {
            type: "object",
            properties: {
              category: { type: "string", enum: ["course","audio","meditation","article","practice"] },
              title: { type: "string" },
              description: { type: "string" },
              featureId: {
                type: "string",
                enum: ["audio","courses","meditation","resources","self-care","gratitude"],
              },
            },
            required: ["category","title","description","featureId"],
            additionalProperties: false,
          },
        },
        dailyPlan: {
          type: "object",
          description: "A short personalized routine fitting their daily time budget.",
          properties: {
            morning: { type: "string" },
            afternoon: { type: "string" },
            evening: { type: "string" },
          },
          required: ["morning","afternoon","evening"],
          additionalProperties: false,
        },
      },
      required: ["insights","suggestedFeatures","contentPicks","dailyPlan"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load preferences + lightweight profile context + prior feedback
    const [{ data: prefs }, { data: profile }, { data: recentMoods }, { data: feedback }] = await Promise.all([
      supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
      supabase.from("mood_entries").select("mood, logged_at").eq("user_id", user.id).order("logged_at", { ascending: false }).limit(7),
      supabase.from("recommendation_feedback").select("item_section, item_label, rating").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(60),
    ]);

    if (!prefs) {
      return new Response(JSON.stringify({ error: "Please complete onboarding first." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userContext = {
      name: profile?.display_name || "friend",
      goals: prefs.goals,
      interests: prefs.interests,
      stress_level: prefs.stress_level,
      typical_mood: prefs.typical_mood,
      biggest_challenge: prefs.biggest_challenge,
      daily_minutes: prefs.daily_minutes,
      preferred_formats: prefs.preferred_formats,
      preferred_time_of_day: prefs.preferred_time_of_day,
      recent_moods: recentMoods?.map((m: any) => m.mood) || [],
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Here is the user's onboarding + context JSON. Produce their personalized plan.\n\n${JSON.stringify(userContext, null, 2)}`,
          },
        ],
        tools: [recommendationsTool],
        tool_choice: { type: "function", function: { name: "produce_recommendations" } },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests right now. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call returned:", JSON.stringify(aiJson));
      return new Response(JSON.stringify({ error: "Failed to generate recommendations." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let payload: any;
    try {
      payload = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Invalid tool args JSON:", toolCall.function.arguments);
      return new Response(JSON.stringify({ error: "AI returned malformed response." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Upsert cached recommendations
    await supabase.from("user_recommendations").upsert(
      { user_id: user.id, payload, generated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );

    return new Response(JSON.stringify({ payload }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-recommendations error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
