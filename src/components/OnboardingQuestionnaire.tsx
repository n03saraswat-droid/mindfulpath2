import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Loader2, Check, ArrowRight, ArrowLeft, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const GOALS = [
  { id: "reduce_anxiety", label: "Reduce anxiety" },
  { id: "better_sleep", label: "Better sleep" },
  { id: "manage_anger", label: "Manage anger" },
  { id: "build_gratitude", label: "Build gratitude" },
  { id: "boost_focus", label: "Boost focus" },
  { id: "self_compassion", label: "Self-compassion" },
  { id: "emotional_balance", label: "Emotional balance" },
  { id: "stress_relief", label: "Stress relief" },
];

const INTERESTS = [
  { id: "meditation", label: "Meditation" },
  { id: "breathwork", label: "Breathwork" },
  { id: "journaling", label: "Journaling" },
  { id: "shlokas", label: "Shlokas & chants" },
  { id: "courses", label: "Structured courses" },
  { id: "community", label: "Community" },
  { id: "audio", label: "Calming audio" },
  { id: "gratitude", label: "Gratitude practice" },
];

const MOODS = [
  { id: "great", label: "Great" },
  { id: "good", label: "Good" },
  { id: "okay", label: "Okay" },
  { id: "low", label: "Low" },
  { id: "struggling", label: "Struggling" },
];

const FORMATS = [
  { id: "audio", label: "Audio" },
  { id: "video", label: "Video" },
  { id: "text", label: "Text" },
];

const TIMES = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
  { id: "anytime", label: "Anytime" },
];

interface Props {
  initialValues?: Partial<FormState>;
  onComplete: () => void;
  onCancel?: () => void;
  title?: string;
  submitLabel?: string;
}

interface FormState {
  goals: string[];
  interests: string[];
  stress_level: number;
  typical_mood: string;
  biggest_challenge: string;
  daily_minutes: number;
  preferred_formats: string[];
  preferred_time_of_day: string;
}

const toggle = (arr: string[], id: string) =>
  arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

const OnboardingQuestionnaire = ({ initialValues, onComplete, onCancel, title, submitLabel }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    goals: initialValues?.goals ?? [],
    interests: initialValues?.interests ?? [],
    stress_level: initialValues?.stress_level ?? 3,
    typical_mood: initialValues?.typical_mood ?? "okay",
    biggest_challenge: initialValues?.biggest_challenge ?? "",
    daily_minutes: initialValues?.daily_minutes ?? 10,
    preferred_formats: initialValues?.preferred_formats ?? [],
    preferred_time_of_day: initialValues?.preferred_time_of_day ?? "anytime",
  });

  const steps = [
    {
      key: "goals",
      heading: "What brings you here?",
      sub: "Pick the goals that matter most right now. You can choose more than one.",
      valid: () => form.goals.length > 0,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map((g) => (
            <ChipButton key={g.id} label={g.label} active={form.goals.includes(g.id)}
              onClick={() => setForm((f) => ({ ...f, goals: toggle(f.goals, g.id) }))} />
          ))}
        </div>
      ),
    },
    {
      key: "interests",
      heading: "What practices interest you?",
      sub: "We'll tailor suggestions around what feels right for you.",
      valid: () => form.interests.length > 0,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {INTERESTS.map((g) => (
            <ChipButton key={g.id} label={g.label} active={form.interests.includes(g.id)}
              onClick={() => setForm((f) => ({ ...f, interests: toggle(f.interests, g.id) }))} />
          ))}
        </div>
      ),
    },
    {
      key: "baseline",
      heading: "How are you feeling these days?",
      sub: "This stays private — it just helps us personalize your plan.",
      valid: () => true,
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Typical mood lately</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <ChipButton key={m.id} label={m.label} active={form.typical_mood === m.id}
                  onClick={() => setForm((f) => ({ ...f, typical_mood: m.id }))} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Stress level: <span className="text-foreground font-medium">{form.stress_level}/5</span>
            </p>
            <Slider
              value={[form.stress_level]}
              onValueChange={([v]) => setForm((f) => ({ ...f, stress_level: v }))}
              min={1} max={5} step={1}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Biggest challenge right now (optional)</p>
            <Textarea
              value={form.biggest_challenge}
              onChange={(e) => setForm((f) => ({ ...f, biggest_challenge: e.target.value.slice(0, 500) }))}
              placeholder="Share in your own words…"
              rows={3}
              maxLength={500}
            />
            <p className="text-[11px] text-muted-foreground mt-1">{form.biggest_challenge.length}/500</p>
          </div>
        </div>
      ),
    },
    {
      key: "availability",
      heading: "How do you like to practice?",
      sub: "We'll shape your daily plan around this.",
      valid: () => form.preferred_formats.length > 0,
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Daily time commitment: <span className="text-foreground font-medium">{form.daily_minutes} min</span>
            </p>
            <Slider
              value={[form.daily_minutes]}
              onValueChange={([v]) => setForm((f) => ({ ...f, daily_minutes: v }))}
              min={5} max={60} step={5}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">Preferred formats</p>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <ChipButton key={f.id} label={f.label} active={form.preferred_formats.includes(f.id)}
                  onClick={() => setForm((s) => ({ ...s, preferred_formats: toggle(s.preferred_formats, f.id) }))} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">Preferred time of day</p>
            <div className="flex flex-wrap gap-2">
              {TIMES.map((t) => (
                <ChipButton key={t.id} label={t.label} active={form.preferred_time_of_day === t.id}
                  onClick={() => setForm((s) => ({ ...s, preferred_time_of_day: t.id }))} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = async () => {
    if (!current.valid()) {
      toast({ variant: "destructive", title: "Please complete this step" });
      return;
    }
    if (!isLast) { setStep(step + 1); return; }

    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_preferences")
      .upsert({ user_id: user.id, ...form }, { onConflict: "user_id" });
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Couldn't save", description: error.message });
      return;
    }
    qc.invalidateQueries({ queryKey: ["user-preferences", user.id] });
    qc.invalidateQueries({ queryKey: ["user-recommendations", user.id] });
    toast({ title: "All set!", description: "Generating your personalized plan…" });
    onComplete();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="glass-card p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-accent/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{title ?? "Personalize your journey"}</span>
            </div>
            <div className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</div>
          </div>

          {/* Progress */}
          <div className="h-1 w-full bg-white/10 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full gradient-calm"
              initial={false}
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">{current.heading}</h2>
              <p className="text-muted-foreground mb-6">{current.sub}</p>
              {current.content}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 gap-3">
            <Button variant="ghost" onClick={() => (step === 0 ? onCancel?.() : setStep(step - 1))} disabled={saving}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              {step === 0 ? (onCancel ? "Cancel" : "Back") : "Back"}
            </Button>
            <Button onClick={handleNext} disabled={saving} className="gradient-calm text-primary-foreground">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isLast ? (submitLabel ?? "Finish") : "Continue"}
              {!isLast && !saving && <ArrowRight className="w-4 h-4 ml-1" />}
              {isLast && !saving && <Check className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ChipButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all text-left",
      active
        ? "bg-primary/15 border-primary/40 text-foreground shadow-soft"
        : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10",
    )}
  >
    <span className="flex items-center gap-2">
      {active && <Heart className="w-3.5 h-3.5 text-primary fill-primary" />}
      {label}
    </span>
  </button>
);

export default OnboardingQuestionnaire;
