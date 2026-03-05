import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Heart, BookOpen, Bookmark, Trophy, Flame, TrendingUp, Smile, Meh, Frown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, differenceInDays } from "date-fns";

const moodIcons: Record<string, { icon: typeof Smile; color: string }> = {
  great: { icon: Smile, color: "text-green-500" },
  good: { icon: Smile, color: "text-emerald-500" },
  okay: { icon: Meh, color: "text-yellow-500" },
  low: { icon: Frown, color: "text-orange-500" },
  struggling: { icon: Frown, color: "text-red-500" },
};

const IntegratedDashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: moodEntries = [] } = useQuery({
    queryKey: ["mood-entries", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("mood_entries").select("*").eq("user_id", user!.id).order("logged_at", { ascending: false }).limit(60);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: gratitudeEntries = [] } = useQuery({
    queryKey: ["gratitude-entries", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("gratitude_entries").select("*").eq("user_id", user!.id).order("logged_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: courseProgress = [] } = useQuery({
    queryKey: ["course-progress", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("course_progress").select("*").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("resource_bookmarks").select("*").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: userXP } = useQuery({
    queryKey: ["user-xp", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_xp").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const calculateStreak = () => {
    if (gratitudeEntries.length === 0) return 0;
    let streak = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const sortedDates = [...new Set(gratitudeEntries.map((e: any) => e.logged_at))].sort().reverse();
    for (let i = 0; i < sortedDates.length; i++) {
      const d = new Date(sortedDates[i]); d.setHours(0, 0, 0, 0);
      const expected = subDays(today, i); expected.setHours(0, 0, 0, 0);
      if (differenceInDays(expected, d) === 0) streak++; else break;
    }
    return streak;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="glass-card p-8 text-center max-w-md">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Your Dashboard</h3>
          <p className="text-muted-foreground">Sign in to see your personalized wellness overview.</p>
        </Card>
      </div>
    );
  }

  const latestMood = moodEntries[0] as any;
  const streak = calculateStreak();
  const xp = userXP?.xp_total || 0;
  const level = Math.floor(xp / 100) + 1;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-1">
          Welcome back, {profile?.display_name || "Friend"} 👋
        </h2>
        <p className="text-muted-foreground">Your mental wellness at a glance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Level", value: level, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "XP", value: xp, icon: Sparkles, color: "text-primary", bg: "bg-primary/10" },
          { label: "Mood Logs", value: moodEntries.length, icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Streak", value: `${streak}🔥`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Lessons", value: courseProgress.length, icon: BookOpen, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Saved", value: bookmarks.length, icon: Bookmark, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card">
              <CardContent className="p-3 flex flex-col items-center gap-1">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Today's Mood + Gratitude */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Today's Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestMood ? (() => {
                const md = moodIcons[latestMood.mood];
                const MIcon = md?.icon || Meh;
                return (
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full bg-muted ${md?.color}`}><MIcon className="w-8 h-8" /></div>
                    <div>
                      <p className="font-medium capitalize text-foreground">{latestMood.mood}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(latestMood.logged_at), "MMM d, yyyy")}</p>
                      {latestMood.note && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">"{latestMood.note}"</p>}
                    </div>
                  </div>
                );
              })() : <p className="text-muted-foreground text-sm">No mood logged yet today</p>}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="glass-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" /> Gratitude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-foreground">{streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{gratitudeEntries.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
              {gratitudeEntries.length > 0 && (
                <div className="bg-secondary/30 p-3 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Latest:</p>
                  <p className="text-sm text-foreground line-clamp-2">"{(gratitudeEntries[0] as any).entry_text}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default IntegratedDashboard;
