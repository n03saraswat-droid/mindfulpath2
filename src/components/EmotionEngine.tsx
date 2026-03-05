import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Heart, Music, BookOpen, Loader2, Send, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EmotionResult {
  emotions: { name: string; score: number; color: string }[];
  dominantEmotion: string;
  recommendations: { type: string; icon: string; title: string; description: string }[];
  insight: string;
}

const EMOTION_COLORS: Record<string, string> = {
  joy: "bg-yellow-500",
  sadness: "bg-blue-500",
  anger: "bg-red-500",
  fear: "bg-purple-500",
  surprise: "bg-amber-500",
  love: "bg-pink-500",
  hope: "bg-emerald-500",
  anxiety: "bg-indigo-500",
  calm: "bg-teal-500",
  gratitude: "bg-green-500",
};

const EmotionEngine = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);

  const analyzeEmotion = async () => {
    if (!text.trim() || !user) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mental-health-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Analyze the emotions in this text and respond ONLY with valid JSON (no markdown, no code fences). Use this exact structure:
{"emotions":[{"name":"emotion_name","score":0.0to1.0}],"dominantEmotion":"name","recommendations":[{"type":"activity|music|reading|meditation","title":"title","description":"brief description"}],"insight":"one paragraph insight about the emotional state"}

Text to analyze: "${text.trim()}"`
            },
          ],
        }),
      });

      if (!response.ok) throw new Error("Analysis failed");
      
      // Read the streaming response fully
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");
      
      const decoder = new TextDecoder();
      let fullContent = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) fullContent += content;
          } catch {}
        }
      }

      // Parse the JSON response
      const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response format");
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      setResult({
        emotions: (parsed.emotions || []).map((e: any) => ({
          name: e.name,
          score: Math.round((e.score || 0) * 100),
          color: EMOTION_COLORS[e.name.toLowerCase()] || "bg-gray-500",
        })),
        dominantEmotion: parsed.dominantEmotion || "neutral",
        recommendations: (parsed.recommendations || []).map((r: any) => ({
          type: r.type,
          icon: r.type === "music" ? "🎵" : r.type === "meditation" ? "🧘" : r.type === "reading" ? "📖" : "✨",
          title: r.title,
          description: r.description,
        })),
        insight: parsed.insight || "",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ variant: "destructive", title: "Analysis Failed", description: "Please try again." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="glass-card p-8 text-center max-w-md">
          <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Emotion Engine</h3>
          <p className="text-muted-foreground">Sign in to analyze your emotions and get personalized recommendations.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Emotion Engine</h2>
        <p className="text-muted-foreground">AI-powered emotion analysis with personalized recommendations</p>
      </motion.div>

      {/* Input Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              How are you feeling?
            </CardTitle>
            <CardDescription>Write about your current emotions, thoughts, or experiences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I've been feeling... / Today I experienced... / My thoughts are..."
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{text.length}/500</span>
              <Button
                onClick={analyzeEmotion}
                disabled={!text.trim() || isAnalyzing}
                className="gradient-calm text-primary-foreground"
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Analyze Emotions</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Emotion Breakdown */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Emotion Breakdown</CardTitle>
                <CardDescription>Dominant emotion: <span className="font-medium text-foreground capitalize">{result.dominantEmotion}</span></CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.emotions.map((emotion, i) => (
                  <motion.div key={emotion.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm capitalize text-foreground">{emotion.name}</span>
                      <span className="text-sm font-medium text-foreground">{emotion.score}%</span>
                    </div>
                    <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${emotion.score}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                        className={cn("h-full rounded-full", emotion.color)}
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Insight */}
            {result.insight && (
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <Lightbulb className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">AI Insight</h4>
                      <p className="text-sm text-muted-foreground">{result.insight}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-serif text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3">
                  {result.recommendations.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{rec.icon}</span>
                        <Badge variant="secondary" className="text-xs capitalize">{rec.type}</Badge>
                      </div>
                      <h4 className="font-medium text-foreground text-sm">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmotionEngine;
