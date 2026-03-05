import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Star, Award, Zap, Target, Heart, BookOpen, MessageCircle, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BADGES = [
  { id: "first-mood", label: "First Mood", icon: "😊", description: "Log your first mood", xpRequired: 0, condition: "mood_log" },
  { id: "streak-3", label: "3-Day Streak", icon: "🔥", description: "3 day activity streak", xpRequired: 0, condition: "streak_3" },
  { id: "streak-7", label: "Week Warrior", icon: "⚡", description: "7 day activity streak", xpRequired: 0, condition: "streak_7" },
  { id: "streak-30", label: "Monthly Master", icon: "🏆", description: "30 day activity streak", xpRequired: 0, condition: "streak_30" },
  { id: "xp-100", label: "Rising Star", icon: "⭐", description: "Earn 100 XP", xpRequired: 100, condition: "xp" },
  { id: "xp-500", label: "Dedicated", icon: "💎", description: "Earn 500 XP", xpRequired: 500, condition: "xp" },
  { id: "xp-1000", label: "Champion", icon: "👑", description: "Earn 1000 XP", xpRequired: 1000, condition: "xp" },
  { id: "first-gratitude", label: "Grateful Heart", icon: "💗", description: "Write first gratitude", xpRequired: 0, condition: "gratitude" },
  { id: "first-course", label: "Learner", icon: "📚", description: "Complete first lesson", xpRequired: 0, condition: "course" },
  { id: "community-post", label: "Connector", icon: "🤝", description: "First community post", xpRequired: 0, condition: "community" },
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
      const { data, error } = await supabase
        .from("user_xp")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: xpEvents = [] } = useQuery({
    queryKey: ["xp-events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("xp_events")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: earnedBadges = [] } = useQuery({
    queryKey: ["user-badges", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
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
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">XP System</h3>
          <p className="text-muted-foreground">Sign in to start earning XP, unlock badges, and climb the leaderboard!</p>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{earnedBadges.length}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{longestStreak}</p>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily Challenges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Daily Challenges
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Badges ({earnedBadges.length}/{BADGES.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {BADGES.map((badge) => {
                const earned = earnedBadgeIds.has(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all",
                      earned ? "bg-primary/10 shadow-soft" : "bg-secondary/30 opacity-50 grayscale"
                    )}
                  >
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {xpEvents.slice(0, 10).map((event: any) => (
                <div key={event.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/20">
                  <div>
                    <p className="text-sm text-foreground">{event.description || event.event_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
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
