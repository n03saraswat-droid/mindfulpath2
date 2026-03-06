import { useState, useEffect } from "react";
import { format, subDays, parseISO } from "date-fns";
import { Smile, Meh, Frown, Heart, TrendingDown, Plus, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import MoodChart from "@/components/MoodChart";
import { motion } from "framer-motion";
import { useXPReward } from "@/hooks/useXPReward";

type MoodType = "great" | "good" | "okay" | "low" | "struggling";

interface MoodEntry {
  id: string;
  mood: MoodType;
  note: string | null;
  logged_at: string;
  created_at: string;
}

const moods: { type: MoodType; icon: typeof Smile; label: string; color: string; value: number }[] = [
  { type: "great", icon: Heart, label: "Great", color: "bg-primary text-primary-foreground", value: 5 },
  { type: "good", icon: Smile, label: "Good", color: "bg-hope/30 text-primary", value: 4 },
  { type: "okay", icon: Meh, label: "Okay", color: "bg-serenity text-serenity-foreground", value: 3 },
  { type: "low", icon: Frown, label: "Low", color: "bg-warmth text-warmth-foreground", value: 2 },
  { type: "struggling", icon: TrendingDown, label: "Struggling", color: "bg-destructive/20 text-destructive", value: 1 },
];

const IntegratedMoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { awardXP } = useXPReward();

  useEffect(() => { if (user) fetchEntries(); }, [user]);

  const fetchEntries = async () => {
    setIsFetching(true);
    try {
      const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
      const today = format(new Date(), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .gte("logged_at", thirtyDaysAgo)
        .order("logged_at", { ascending: false });
      if (error) throw error;
      const typedData = (data || []) as MoodEntry[];
      setEntries(typedData);
      const todayEntryData = typedData.find((e) => e.logged_at === today);
      if (todayEntryData) {
        setTodayEntry(todayEntryData);
        setSelectedMood(todayEntryData.mood);
        setNote(todayEntryData.note || "");
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to load mood history." });
    } finally {
      setIsFetching(false);
    }
  };

  const handleSaveMood = async () => {
    if (!selectedMood || !user) return;
    setIsLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      if (todayEntry) {
        const { error } = await supabase.from("mood_entries").update({ mood: selectedMood, note: note.trim() || null }).eq("id", todayEntry.id);
        if (error) throw error;
        toast({ title: "Mood Updated" });
      } else {
        const { error } = await supabase.from("mood_entries").insert({ user_id: user.id, mood: selectedMood, note: note.trim() || null, logged_at: today });
        if (error) throw error;
        toast({ title: "Mood Logged", description: "Great job tracking your mood! 🎉" });
        await awardXP(10, "mood_log", "Logged daily mood");
      }
      fetchEntries();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to save mood." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="glass-card p-8 text-center max-w-md">
          <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Mood Tracker</h3>
          <p className="text-muted-foreground">Sign in to start tracking your daily mood and emotions.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Mood Tracker</h2>
        <p className="text-muted-foreground">Log how you're feeling and track your patterns</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> How are you feeling?
              </CardTitle>
              <CardDescription>{todayEntry ? "Update your mood" : "Log your mood"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-5 gap-2">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.type;
                  return (
                    <button key={mood.type} onClick={() => setSelectedMood(mood.type)} className={cn("flex flex-col items-center gap-2 p-3 rounded-xl transition-all", isSelected ? `${mood.color} shadow-soft scale-105` : "bg-secondary hover:bg-secondary/80")}>
                      <Icon className="w-7 h-7" />
                      <span className="text-[10px] font-medium">{mood.label}</span>
                    </button>
                  );
                })}
              </div>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's on your mind?" className="min-h-[80px] resize-none" maxLength={500} />
              <Button onClick={handleSaveMood} disabled={!selectedMood || isLoading} className="w-full gradient-calm text-primary-foreground">
                {isLoading ? "Saving..." : todayEntry ? "Update Mood" : <><Plus className="w-4 h-4 mr-2" /> Log Mood</>}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Mood Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                </div>
              ) : entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <p className="text-muted-foreground">Start tracking to see trends!</p>
                </div>
              ) : (
                <MoodChart entries={entries} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {entries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-serif text-xl">Recent Entries</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {entries.slice(0, 7).map((entry) => {
                const moodData = moods.find((m) => m.type === entry.mood);
                const Icon = moodData?.icon || Meh;
                return (
                  <div key={entry.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", moodData?.color || "bg-muted")}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{moodData?.label}</span>
                        <span className="text-xs text-muted-foreground">{format(parseISO(entry.logged_at), "MMM d")}</span>
                      </div>
                      {entry.note && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{entry.note}</p>}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default IntegratedMoodTracker;
