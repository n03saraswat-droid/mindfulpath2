import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, Minus, Calendar, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const MOOD_VALUES: Record<string, number> = { great: 5, good: 4, okay: 3, low: 2, struggling: 1 };
const MOOD_COLORS: Record<string, string> = {
  great: "#22c55e", good: "#10b981", okay: "#eab308", low: "#f97316", struggling: "#ef4444",
};
const MOOD_LABELS: Record<number, string> = { 5: "Great", 4: "Good", 3: "Okay", 2: "Low", 1: "Struggling" };

const RealMoodAnalytics = () => {
  const { user } = useAuth();

  const { data: entries = [] } = useQuery({
    queryKey: ["mood-entries-analytics", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user!.id)
        .order("logged_at", { ascending: true })
        .limit(90);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const trendData = useMemo(() => {
    const last30 = entries.filter((e: any) => new Date(e.logged_at) >= subDays(new Date(), 30));
    const days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });
    return days.map(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      const entry = last30.find((e: any) => e.logged_at === dayStr);
      return {
        date: format(day, "MMM d"),
        value: entry ? MOOD_VALUES[entry.mood] : null,
        mood: entry?.mood || null,
      };
    });
  }, [entries]);

  const distribution = useMemo(() => {
    const counts: Record<string, number> = { great: 0, good: 0, okay: 0, low: 0, struggling: 0 };
    entries.forEach((e: any) => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
    return Object.entries(counts).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
      color: MOOD_COLORS[mood],
    })).filter(d => d.value > 0);
  }, [entries]);

  const weeklyAvg = useMemo(() => {
    const weeks: Record<string, number[]> = {};
    entries.forEach((e: any) => {
      const weekStart = format(startOfWeek(new Date(e.logged_at)), "MMM d");
      if (!weeks[weekStart]) weeks[weekStart] = [];
      weeks[weekStart].push(MOOD_VALUES[e.mood]);
    });
    return Object.entries(weeks).slice(-8).map(([week, values]) => ({
      week,
      avg: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
    }));
  }, [entries]);

  const stats = useMemo(() => {
    if (entries.length === 0) return null;
    const values = entries.map((e: any) => MOOD_VALUES[e.mood]);
    const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
    const recent = values.slice(-7);
    const older = values.slice(-14, -7);
    const recentAvg = recent.length ? recent.reduce((a: number, b: number) => a + b, 0) / recent.length : 0;
    const olderAvg = older.length ? older.reduce((a: number, b: number) => a + b, 0) / older.length : 0;
    const trend = recentAvg > olderAvg + 0.3 ? "improving" : recentAvg < olderAvg - 0.3 ? "declining" : "stable";
    return { avg: Math.round(avg * 10) / 10, trend, totalEntries: entries.length, recentAvg: Math.round(recentAvg * 10) / 10 };
  }, [entries]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="glass-card p-8 text-center max-w-md">
          <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Mood Analytics</h3>
          <p className="text-muted-foreground">Sign in to view your real mood data and analytics charts.</p>
        </Card>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="glass-card p-8 text-center max-w-md">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">No Data Yet</h3>
          <p className="text-muted-foreground">Start logging your mood to see analytics and charts here.</p>
        </Card>
      </div>
    );
  }

  const TrendIcon = stats?.trend === "improving" ? TrendingUp : stats?.trend === "declining" ? TrendingDown : Minus;
  const trendColor = stats?.trend === "improving" ? "text-green-500" : stats?.trend === "declining" ? "text-red-500" : "text-yellow-500";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Mood Analytics</h2>
        <p className="text-muted-foreground">Real data from your mood tracking journey</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Average Mood", value: MOOD_LABELS[Math.round(stats?.avg || 3)] || "Okay", sub: `${stats?.avg}/5` },
          { label: "Trend", value: stats?.trend || "—", sub: "", icon: TrendIcon, iconColor: trendColor },
          { label: "Total Entries", value: stats?.totalEntries || 0, sub: "mood logs" },
          { label: "Recent Avg", value: stats?.recentAvg || "—", sub: "last 7 days" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                {s.icon && <s.icon className={`w-6 h-6 mx-auto mb-1 ${s.iconColor}`} />}
                <p className="text-xl font-bold text-foreground capitalize">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                {s.sub && <p className="text-[10px] text-muted-foreground mt-1">{s.sub}</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 30-Day Trend Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-serif text-xl">30-Day Mood Trend</CardTitle>
            <CardDescription>Your emotional journey over the past month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(158, 40%, 42%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(158, 40%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 88%)" strokeOpacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(160, 10%, 45%)" }} interval="preserveStartEnd" />
                <YAxis domain={[0.5, 5.5]} ticks={[1, 2, 3, 4, 5]} tickFormatter={(v) => MOOD_LABELS[v] || ""} tick={{ fontSize: 10, fill: "hsl(160, 10%, 45%)" }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]?.payload) return null;
                    const d = payload[0].payload;
                    return d.value ? (
                      <div className="glass-card rounded-lg p-2 text-xs shadow-lg border border-border/50">
                        <p className="font-medium">{d.date}</p>
                        <p className="capitalize text-primary">{d.mood}</p>
                      </div>
                    ) : null;
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(158, 40%, 42%)" strokeWidth={2} fill="url(#moodGradient)" connectNulls dot={{ r: 3, fill: "hsl(158, 40%, 42%)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Distribution Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Mood Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {distribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Average Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Weekly Averages</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={weeklyAvg} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 88%)" strokeOpacity={0.3} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(160, 10%, 45%)" }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: "hsl(160, 10%, 45%)" }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      return (
                        <div className="glass-card rounded-lg p-2 text-xs shadow-lg border border-border/50">
                          <p className="font-medium">{payload[0].payload.week}</p>
                          <p className="text-primary">Avg: {payload[0].value}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="avg" radius={[6, 6, 0, 0]} fill="hsl(158, 40%, 42%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RealMoodAnalytics;
