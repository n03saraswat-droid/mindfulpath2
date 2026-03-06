import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Star, Award, Zap, Target, Heart, BookOpen, MessageCircle, Sun, Medal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BADGES = [
  { id: "first-mood", label: "First Mood", icon: "😊", description: "Log your first mood" },
  { id: "streak-3", label: "3-Day Streak", icon: "🔥", description: "3 day activity streak" },
  { id: "streak-7", label: "Week Warrior", icon: "⚡", description: "7 day activity streak" },
  { id: "streak-30", label: "Monthly Master", icon: "🏆", description: "30 day activity streak" },
  { id: "xp-100", label: "Rising Star", icon: "⭐", description: "Earn 100 XP" },
  { id: "xp-500", label: "Dedicated", icon: "💎", description: "Earn 500 XP" },
  { id: "xp-1000", label: "Champion", icon: "👑", description: "Earn 1000 XP" },
  { id: "first-gratitude", label: "Grateful Heart", icon: "💗", description: "Write first gratitude" },
  { id: "first-course", label: "Learner", icon: "📚", description: "Complete first lesson" },
  { id: "community-post", label: "Connector", icon: "🤝", description: "First community post" },
];

const MEDALS = [
  { id: "bronze", label: "Bronze Medal", icon: "🥉", description: "Reach Level 3", levelRequired: 3, color: "from-amber-700/30 to-amber-600/20" },
  { id: "silver", label: "Silver Medal", icon: "🥈", description: "Reach Level 5", levelRequired: 5, color: "from-gray-400/30 to-gray-300/20" },
  { id: "gold", label: "Gold Medal", icon: "🥇", description: "Reach Level 10", levelRequired: 10, color: "from-yellow-500/30 to-yellow-400/20" },
  { id: "platinum", label: "Platinum Medal", icon: "💠", description: "Reach Level 20", levelRequired: 20, color: "from-cyan-400/30 to-blue-300/20" },
  { id: "diamond", label: "Diamond Medal", icon: "💎", description: "Reach Level 50", levelRequired: 50, color: "from-violet-400/30 to-purple-300/20" },
];

const XP_PER_LEVEL = 100;
const getLevelFromXP = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;
const getXPProgress = (xp: number) => (xp % XP_PER_LEVEL);

const DAILY_CHALLENGES = [
  { id: "log-mood", label: "Log your mood today", xp: 10, icon: Target },
  { id: "write-gratitude", label: "Write 3 gratitude entries", xp: 15, icon: Heart },
  { id: "complete-lesson", label: "Complete a course lesson", xp: 20, icon: BookOpen },
  { id: "chat-ai", label: "Have an AI conversation", xp: 10, icon: MessageCircle },
  { id: "community-engage", label: "Engage in the community", xp: 10, icon: Sun },
];

const XPSystem = () => {
  const { user } = useAuth();

  const { data: userXP } = useQuery({
    queryKey: ["user-xp", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_xp").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: xpEvents = [] } = useQuery({
    queryKey: ["xp-events", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("xp_events").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(20);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: earnedBadges = [] } = useQuery({
    queryKey: ["user-badges", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_badges").select("*").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const totalXP = userXP?.xp_total || 0;
  const level = getLevelFromXP(totalXP);
  const xpProgress = getXPProgress(totalXP);
  const streak = userXP?.streak_days || 0;
  const longestStreak = userXP?.longest_streak || 0;
  const earnedBadgeIds = new Set(earnedBadges.map((b: any) => b.badge_id));

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="glass-card p-8 text-center max-w-md">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">XP & Medals</h3>
          <p className="text-muted-foreground">Sign in to start earning XP, unlock badges and medals!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Level & XP Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card overflow-hidden">
          <div className="gradient-calm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Your Level</p>
                <h2 className="text-5xl font-serif font-bold text-primary-foreground">{level}</h2>
              </div>
              <div className="text-right">
                <p className="text-primary-foreground/80 text-sm font-medium">Total XP</p>
                <h3 className="text-3xl font-bold text-primary-foreground">{totalXP}</h3>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-primary-foreground/70 mb-1">
                <span>Level {level}</span>
                <span>{xpProgress}/{XP_PER_LEVEL} XP</span>
                <span>Level {level + 1}</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(xpProgress / XP_PER_LEVEL) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-white/90 rounded-full"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Flame, value: streak, label: "Day Streak", color: "text-orange-500" },
          { icon: Star, value: earnedBadges.length, label: "Badges", color: "text-yellow-500" },
          { icon: Zap, value: longestStreak, label: "Best Streak", color: "text-primary" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Medals */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-500" />
              Medals
            </CardTitle>
            <CardDescription>Earn medals by reaching higher levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {MEDALS.map((medal) => {
                const earned = level >= medal.levelRequired;
                return (
                  <div
                    key={medal.id}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all border",
                      earned
                        ? `bg-gradient-to-br ${medal.color} border-primary/20 shadow-soft`
                        : "bg-secondary/30 border-transparent opacity-40 grayscale"
                    )}
                  >
                    <span className="text-3xl">{medal.icon}</span>
                    <p className="text-xs font-semibold text-foreground">{medal.label}</p>
                    <p className="text-[10px] text-muted-foreground">{medal.description}</p>
                    {earned && <Badge variant="secondary" className="text-[9px]">Earned!</Badge>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Challenges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Daily Challenges
            </CardTitle>
            <CardDescription>Complete challenges to earn bonus XP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {DAILY_CHALLENGES.map((challenge) => (
              <div key={challenge.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <challenge.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <span className="flex-1 text-sm text-foreground">{challenge.label}</span>
                <Badge variant="secondary" className="text-xs">+{challenge.xp} XP</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" /> Badges ({earnedBadges.length}/{BADGES.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {BADGES.map((badge) => {
                const earned = earnedBadgeIds.has(badge.id);
                return (
                  <div key={badge.id} className={cn("flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all", earned ? "bg-primary/10 shadow-soft" : "bg-secondary/30 opacity-50 grayscale")}>
                    <span className="text-2xl">{badge.icon}</span>
                    <p className="text-xs font-medium text-foreground">{badge.label}</p>
                    <p className="text-[10px] text-muted-foreground">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent XP Activity */}
      {xpEvents.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-serif text-xl">Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {xpEvents.slice(0, 10).map((event: any) => (
                <div key={event.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/20">
                  <div>
                    <p className="text-sm text-foreground">{event.description || event.event_type}</p>
                    <p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className="gradient-calm text-primary-foreground">+{event.xp_earned} XP</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default XPSystem;
