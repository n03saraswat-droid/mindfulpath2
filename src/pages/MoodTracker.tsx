import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, subDays, startOfDay, parseISO } from "date-fns";
import { Smile, Meh, Frown, Heart, TrendingDown, Plus, Calendar, BarChart3, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import MoodChart from "@/components/MoodChart";

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

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch mood entries
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

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

      // Check if there's an entry for today
      const todayEntryData = typedData.find((e) => e.logged_at === today);
      if (todayEntryData) {
        setTodayEntry(todayEntryData);
        setSelectedMood(todayEntryData.mood);
        setNote(todayEntryData.note || "");
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your mood history.",
      });
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
        // Update existing entry
        const { error } = await supabase
          .from("mood_entries")
          .update({ mood: selectedMood, note: note.trim() || null })
          .eq("id", todayEntry.id);

        if (error) throw error;

        toast({
          title: "Mood Updated",
          description: "Your mood for today has been updated.",
        });
      } else {
        // Create new entry
        const { error } = await supabase.from("mood_entries").insert({
          user_id: user.id,
          mood: selectedMood,
          note: note.trim() || null,
          logged_at: today,
        });

        if (error) throw error;

        toast({
          title: "Mood Logged",
          description: "Great job tracking your mood today!",
        });
      }

      fetchEntries();
    } catch (error) {
      console.error("Error saving mood:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your mood. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-calm flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">Mood Tracker</span>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Log Mood Card */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                How are you feeling today?
              </CardTitle>
              <CardDescription>
                {todayEntry
                  ? "Update your mood entry for today"
                  : "Log your current emotional state"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-5 gap-2">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.type;
                  return (
                    <button
                      key={mood.type}
                      onClick={() => setSelectedMood(mood.type)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl transition-all",
                        isSelected
                          ? `${mood.color} shadow-soft scale-105`
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      <Icon className="w-8 h-8" />
                      <span className="text-xs font-medium">{mood.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Add a note (optional)
                </label>
                <Textarea
                  placeholder="What's on your mind today? Any thoughts or reflections..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {note.length}/500
                </p>
              </div>

              <Button
                onClick={handleSaveMood}
                disabled={!selectedMood || isLoading}
                className="w-full gradient-calm text-primary-foreground"
              >
                {isLoading ? (
                  "Saving..."
                ) : todayEntry ? (
                  "Update Today's Mood"
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Log Today's Mood
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                Your Mood Trends
              </CardTitle>
              <CardDescription>Track your emotional patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                </div>
              ) : entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No mood entries yet. Start tracking your mood to see trends!
                  </p>
                </div>
              ) : (
                <MoodChart entries={entries} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries List */}
        {entries.length > 0 && (
          <Card className="mt-8 shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Recent Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entries.slice(0, 7).map((entry) => {
                  const moodData = moods.find((m) => m.type === entry.mood);
                  const Icon = moodData?.icon || Meh;
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl"
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          moodData?.color || "bg-muted"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {moodData?.label}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {format(parseISO(entry.logged_at), "MMM d, yyyy")}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
