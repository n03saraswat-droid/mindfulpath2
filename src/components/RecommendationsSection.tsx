import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Loader2, Sunrise, Sun, Moon, ArrowRight, SlidersHorizontal, BookOpen, Music, Wind, Leaf, Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import OnboardingQuestionnaire from "./OnboardingQuestionnaire";
import { formatDistanceToNow } from "date-fns";

interface RecommendationsSectionProps {
  onNavigateSection: (id: string) => void;
}

interface Payload {
  insights: string;
  suggestedFeatures: { featureId: string; title: string; reason: string; actionLabel: string }[];
  contentPicks: { category: string; title: string; description: string; featureId: string }[];
  dailyPlan: { morning: string; afternoon: string; evening: string };
}

const categoryIcon: Record<string, any> = {
  course: BookOpen,
  audio: Music,
  meditation: Wind,
  article: BookOpen,
  practice: Leaf,
};

const RecommendationsSection = ({ onNavigateSection }: RecommendationsSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);

  const { data: prefs, isLoading: prefsLoading } = useQuery({
    queryKey: ["user-preferences", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_preferences").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: recs, isLoading: recsLoading } = useQuery({
    queryKey: ["user-recommendations", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_recommendations").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: feedbackRows } = useQuery({
    queryKey: ["recommendation-feedback", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("recommendation_feedback")
        .select("item_key, rating")
        .eq("user_id", user!.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const feedbackMap: Record<string, number> = {};
  (feedbackRows ?? []).forEach((r: any) => { feedbackMap[r.item_key] = r.rating; });

  const submitFeedback = async (itemKey: string, section: string, label: string, rating: 1 | -1) => {
    if (!user) return;
    const current = feedbackMap[itemKey];
    try {
      if (current === rating) {
        // toggle off
        await supabase.from("recommendation_feedback").delete().eq("user_id", user.id).eq("item_key", itemKey);
      } else {
        await supabase.from("recommendation_feedback").upsert(
          { user_id: user.id, item_key: itemKey, item_section: section, item_label: label, rating },
          { onConflict: "user_id,item_key" },
        );
      }
      qc.invalidateQueries({ queryKey: ["recommendation-feedback", user.id] });
      if (rating === -1 && current !== -1) {
        toast({ title: "Got it — we'll suggest fewer like this", description: "Hit Refresh plan to update your recommendations." });
      } else if (rating === 1 && current !== 1) {
        toast({ title: "Saved — we'll suggest more like this" });
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Couldn't save feedback", description: e?.message });
    }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-recommendations", { body: {} });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      qc.invalidateQueries({ queryKey: ["user-recommendations", user?.id] });
      toast({ title: "Your plan is ready" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Couldn't generate", description: e?.message || "Please try again." });
    } finally {
      setGenerating(false);
    }
  };

  // Auto-generate the first time if prefs exist but no recs yet
  useEffect(() => {
    if (prefs && !recs && !recsLoading && !generating) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs, recs, recsLoading]);

  if (prefsLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (editing) {
    return (
      <OnboardingQuestionnaire
        title="Update your preferences"
        submitLabel="Save & refresh plan"
        initialValues={prefs ?? undefined}
        onCancel={() => setEditing(false)}
        onComplete={async () => {
          setEditing(false);
          await generate();
        }}
      />
    );
  }

  if (!prefs) {
    return (
      <Card className="glass-card p-8 text-center">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-serif text-2xl font-bold mb-2">Let's personalize your plan</h3>
        <p className="text-muted-foreground mb-6">Answer a few questions and we'll build recommendations just for you.</p>
        <Button className="gradient-calm text-primary-foreground" onClick={() => setEditing(true)}>Start questionnaire</Button>
      </Card>
    );
  }

  const payload = recs?.payload as unknown as Payload | undefined;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-10"
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">AI Recommendations</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Your personalized plan</h2>
              {payload?.insights && (
                <p className="text-muted-foreground md:text-lg max-w-2xl">{payload.insights}</p>
              )}
              {recs?.generated_at && (
                <p className="text-xs text-muted-foreground mt-3">
                  Updated {formatDistanceToNow(new Date(recs.generated_at), { addSuffix: true })}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={generate} disabled={generating} variant="default" className="gradient-calm text-primary-foreground">
                {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                {generating ? "Refreshing…" : "Refresh plan"}
              </Button>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <SlidersHorizontal className="w-4 h-4 mr-2" /> Edit preferences
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {generating && !payload && (
        <Card className="glass-card p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Crafting recommendations tailored to you…</p>
        </Card>
      )}

      {payload && (
        <>
          {/* Daily Plan */}
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-serif text-xl flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Your daily plan
            </CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <DailyBlock icon={Sunrise} label="Morning" body={payload.dailyPlan.morning} tint="from-amber-500/10" />
              <DailyBlock icon={Sun} label="Afternoon" body={payload.dailyPlan.afternoon} tint="from-sky-500/10" />
              <DailyBlock icon={Moon} label="Evening" body={payload.dailyPlan.evening} tint="from-indigo-500/10" />
            </CardContent>
          </Card>

          {/* Suggested features */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Features to try
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {payload.suggestedFeatures.map((s, i) => {
                const key = `feature:${s.featureId}:${s.title}`;
                return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="glass-card h-full">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">{s.title}</h4>
                        <Badge variant="secondary" className="shrink-0">{s.featureId}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{s.reason}</p>
                      <div className="mt-auto flex items-center justify-between gap-3">
                        <Button size="sm" variant="outline" onClick={() => onNavigateSection(s.featureId)}>
                          {s.actionLabel} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                        <FeedbackButtons
                          rating={feedbackMap[key]}
                          onRate={(r) => submitFeedback(key, "feature", s.title, r)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                );
              })}
            </div>
          </div>

          {/* Content picks */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Content picks for you
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {payload.contentPicks.map((c, i) => {
                const Icon = categoryIcon[c.category] || BookOpen;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="glass-card h-full cursor-pointer hover:border-primary/40 transition-colors" onClick={() => onNavigateSection(c.featureId)}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-primary/10"><Icon className="w-4 h-4 text-primary" /></div>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">{c.category}</Badge>
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">{c.title}</h4>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const DailyBlock = ({ icon: Icon, label, body, tint }: { icon: any; label: string; body: string; tint: string }) => (
  <div className={`relative rounded-2xl p-4 bg-gradient-to-br ${tint} to-transparent border border-white/10`}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
  </div>
);

export default RecommendationsSection;
