import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, subDays, startOfDay } from "date-fns";
import { Heart, Plus, Trash2, Sparkles, LogOut, ArrowLeft, Sun, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface GratitudeEntry {
  id: string;
  entry_text: string;
  logged_at: string;
  created_at: string;
}

const gratitudePrompts = [
  "What made you smile today?",
  "Who are you thankful for?",
  "What's a simple pleasure you enjoyed?",
  "What accomplishment are you proud of?",
  "What beautiful thing did you notice?",
  "What challenge helped you grow?",
  "What comfort do you appreciate?",
  "What skill or ability are you grateful for?",
];

const GratitudePractice = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [todayEntries, setTodayEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
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

  // Set random prompt
  useEffect(() => {
    setCurrentPrompt(gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]);
  }, []);

  // Fetch entries
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
        .from("gratitude_entries")
        .select("*")
        .gte("logged_at", thirtyDaysAgo)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const typedData = (data || []) as GratitudeEntry[];
      setEntries(typedData);

      // Filter today's entries
      const todayData = typedData.filter((e) => e.logged_at === today);
      setTodayEntries(todayData);
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your gratitude entries.",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.trim() || !user) return;

    setIsLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");

      const { error } = await supabase.from("gratitude_entries").insert({
        user_id: user.id,
        entry_text: newEntry.trim(),
        logged_at: today,
      });

      if (error) throw error;

      toast({
        title: "Gratitude Added",
        description: "Thank you for practicing gratitude today!",
      });

      setNewEntry("");
      setCurrentPrompt(gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]);
      fetchEntries();
    } catch (error) {
      console.error("Error adding entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your gratitude entry.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase.from("gratitude_entries").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Entry Deleted",
        description: "Your gratitude entry has been removed.",
      });

      fetchEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete entry.",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddEntry();
    }
  };

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = entry.logged_at;
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, GratitudeEntry[]>);

  const totalEntries = entries.length;
  const streak = calculateStreak(entries);

  function calculateStreak(entries: GratitudeEntry[]): number {
    const uniqueDates = [...new Set(entries.map((e) => e.logged_at))].sort().reverse();
    let streak = 0;
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

    // Check if there's an entry today or yesterday to start the streak
    if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
      return 0;
    }

    let currentDate = uniqueDates.includes(today) ? new Date() : subDays(new Date(), 1);

    for (let i = 0; i < 30; i++) {
      const dateStr = format(subDays(currentDate, i), "yyyy-MM-dd");
      if (uniqueDates.includes(dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

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
              <div className="w-10 h-10 rounded-full bg-warmth flex items-center justify-center">
                <Sun className="w-5 h-5 text-warmth-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">Gratitude Practice</span>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-serif font-bold text-primary">{todayEntries.length}</div>
              <p className="text-sm text-muted-foreground">Today's entries</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-serif font-bold text-primary">{streak}</div>
              <p className="text-sm text-muted-foreground">Day streak 🔥</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-serif font-bold text-primary">{totalEntries}</div>
              <p className="text-sm text-muted-foreground">Total gratitudes</p>
            </CardContent>
          </Card>
          <Card className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-serif font-bold text-primary">
                {Object.keys(groupedEntries).length}
              </div>
              <p className="text-sm text-muted-foreground">Days practiced</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Gratitude Card */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                What are you grateful for?
              </CardTitle>
              <CardDescription className="text-base italic">
                "{currentPrompt}"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="I'm grateful for..."
                  className="flex-1"
                  maxLength={300}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleAddEntry}
                  disabled={!newEntry.trim() || isLoading}
                  className="gradient-calm text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-right">{newEntry.length}/300</p>

              {/* Today's Entries */}
              {todayEntries.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="font-medium text-foreground">Today's Gratitudes</h4>
                  {todayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 p-3 bg-warmth/30 rounded-xl group"
                    >
                      <Heart className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <p className="flex-1 text-foreground">{entry.entry_text}</p>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Encouragement */}
              <div className="bg-serenity/30 p-4 rounded-xl">
                <p className="text-sm text-serenity-foreground">
                  💡 <strong>Tip:</strong> Research shows that practicing gratitude can improve sleep, 
                  reduce stress, and increase overall happiness. Try to add 3 things you're grateful for each day!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* History Card */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Your Gratitude Journey
              </CardTitle>
              <CardDescription>Reflecting on what you've been thankful for</CardDescription>
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                </div>
              ) : Object.keys(groupedEntries).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Sun className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No gratitude entries yet. Start your practice today!
                  </p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  {Object.entries(groupedEntries)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([date, dateEntries]) => (
                      <div key={date}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm font-medium text-foreground">
                            {format(parseISO(date), "EEEE, MMMM d, yyyy")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({dateEntries.length} {dateEntries.length === 1 ? "entry" : "entries"})
                          </span>
                        </div>
                        <div className="space-y-2 ml-4 pl-4 border-l-2 border-border">
                          {dateEntries.map((entry) => (
                            <div
                              key={entry.id}
                              className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg group"
                            >
                              <Heart className="w-3 h-3 text-primary mt-1.5 flex-shrink-0" />
                              <p className="flex-1 text-sm text-foreground">{entry.entry_text}</p>
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GratitudePractice;
