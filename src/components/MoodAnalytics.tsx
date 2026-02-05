import { useMemo, useState } from "react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart3, Lightbulb, Target } from "lucide-react";

type MoodType = "great" | "good" | "okay" | "low" | "struggling";

interface MoodEntry {
  id: string;
  mood: MoodType;
  note: string | null;
  logged_at: string;
  created_at: string;
}

interface MoodAnalyticsProps {
  entries: MoodEntry[];
}

const moodValues: Record<MoodType, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  struggling: 1,
};

const moodLabels: Record<number, string> = {
  5: "Great",
  4: "Good",
  3: "Okay",
  2: "Low",
  1: "Struggling",
};

const moodColors: Record<MoodType, string> = {
  great: "hsl(142, 76%, 36%)",
  good: "hsl(158, 64%, 52%)",
  okay: "hsl(48, 96%, 53%)",
  low: "hsl(25, 95%, 53%)",
  struggling: "hsl(0, 84%, 60%)",
};

const MoodAnalytics = ({ entries }: MoodAnalyticsProps) => {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");

  const { chartData, stats, insights, moodDistribution } = useMemo(() => {
    const now = new Date();
    const dateRange = timeframe === "week"
      ? { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
      : { start: startOfMonth(now), end: endOfMonth(now) };

    const daysInRange = eachDayOfInterval(dateRange);
    
    // Create mood map by date
    const moodMap = new Map<string, { value: number; mood: MoodType }>();
    entries.forEach((entry) => {
      const dateKey = entry.logged_at;
      moodMap.set(dateKey, { value: moodValues[entry.mood], mood: entry.mood });
    });

    // Generate chart data
    const chartData = daysInRange.map((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const moodData = moodMap.get(dateKey);
      return {
        date: format(date, timeframe === "week" ? "EEE" : "MMM d"),
        fullDate: dateKey,
        value: moodData?.value || null,
        mood: moodData?.mood || null,
      };
    });

    // Filter entries within timeframe
    const filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.logged_at);
      return entryDate >= dateRange.start && entryDate <= dateRange.end;
    });

    // Calculate statistics
    const values = filteredEntries.map((e) => moodValues[e.mood]);
    const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const highestMood = values.length > 0 ? Math.max(...values) : 0;
    const lowestMood = values.length > 0 ? Math.min(...values) : 0;
    const loggedDays = filteredEntries.length;
    const totalDays = daysInRange.length;
    const consistency = totalDays > 0 ? Math.round((loggedDays / totalDays) * 100) : 0;

    // Calculate trend (comparing first half to second half)
    const midpoint = Math.floor(filteredEntries.length / 2);
    const firstHalf = filteredEntries.slice(midpoint);
    const secondHalf = filteredEntries.slice(0, midpoint);
    
    const firstHalfAvg = firstHalf.length > 0
      ? firstHalf.reduce((sum, e) => sum + moodValues[e.mood], 0) / firstHalf.length
      : 0;
    const secondHalfAvg = secondHalf.length > 0
      ? secondHalf.reduce((sum, e) => sum + moodValues[e.mood], 0) / secondHalf.length
      : 0;
    
    const trendDiff = secondHalfAvg - firstHalfAvg;
    let trend: "improving" | "declining" | "stable" = "stable";
    if (trendDiff > 0.3) trend = "improving";
    else if (trendDiff < -0.3) trend = "declining";

    // Mood distribution
    const distribution: Record<MoodType, number> = {
      great: 0,
      good: 0,
      okay: 0,
      low: 0,
      struggling: 0,
    };
    filteredEntries.forEach((e) => {
      distribution[e.mood]++;
    });

    const moodDistribution = Object.entries(distribution).map(([mood, count]) => ({
      mood: mood as MoodType,
      count,
      percentage: filteredEntries.length > 0 ? Math.round((count / filteredEntries.length) * 100) : 0,
    })).filter(d => d.count > 0);

    // Generate insights
    const insights: string[] = [];
    
    if (filteredEntries.length === 0) {
      insights.push("Start logging your mood to see personalized insights!");
    } else {
      // Trend insight
      if (trend === "improving") {
        insights.push("🌟 Your mood has been improving! Keep up the great work.");
      } else if (trend === "declining") {
        insights.push("💙 Your mood has dipped recently. Consider taking some self-care time.");
      } else {
        insights.push("📊 Your mood has been relatively stable this period.");
      }

      // Consistency insight
      if (consistency >= 80) {
        insights.push("🎯 Excellent consistency! You've logged mood " + consistency + "% of days.");
      } else if (consistency >= 50) {
        insights.push("📝 Good effort! Try to log more consistently for better insights.");
      } else if (loggedDays > 0) {
        insights.push("⏰ Regular logging helps identify patterns. Try setting a daily reminder!");
      }

      // Dominant mood insight
      const dominantMood = moodDistribution.sort((a, b) => b.count - a.count)[0];
      if (dominantMood && dominantMood.percentage >= 40) {
        const moodEmoji: Record<MoodType, string> = {
          great: "🌈",
          good: "😊",
          okay: "😐",
          low: "☁️",
          struggling: "🌧️",
        };
        insights.push(`${moodEmoji[dominantMood.mood]} Your most common mood was "${dominantMood.mood}" (${dominantMood.percentage}% of entries).`);
      }

      // Average mood insight
      if (average >= 4) {
        insights.push("✨ Your average mood is high! You're doing great.");
      } else if (average < 2.5 && filteredEntries.length >= 3) {
        insights.push("💜 If you're consistently feeling low, consider reaching out to someone you trust.");
      }
    }

    return {
      chartData,
      stats: {
        average: average.toFixed(1),
        averageLabel: moodLabels[Math.round(average)] || "N/A",
        highest: moodLabels[highestMood] || "N/A",
        lowest: moodLabels[lowestMood] || "N/A",
        loggedDays,
        totalDays,
        consistency,
        trend,
      },
      insights,
      moodDistribution,
    };
  }, [entries, timeframe]);

  const TrendIcon = stats.trend === "improving" ? TrendingUp : stats.trend === "declining" ? TrendingDown : Minus;
  const trendColor = stats.trend === "improving" ? "text-green-500" : stats.trend === "declining" ? "text-red-500" : "text-muted-foreground";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && payload[0].value !== null) {
      return (
        <div className="bg-card p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary capitalize">
            Mood: {payload[0].payload.mood}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Mood Analytics
            </CardTitle>
            <CardDescription>Track your emotional patterns over time</CardDescription>
          </div>
          <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as "week" | "month")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-secondary/50 p-3 rounded-xl text-center">
            <p className="text-xs text-muted-foreground mb-1">Average</p>
            <p className="text-xl font-bold text-foreground">{stats.average}</p>
            <p className="text-xs text-primary">{stats.averageLabel}</p>
          </div>
          <div className="bg-secondary/50 p-3 rounded-xl text-center">
            <p className="text-xs text-muted-foreground mb-1">Trend</p>
            <div className="flex items-center justify-center gap-1">
              <TrendIcon className={`h-5 w-5 ${trendColor}`} />
              <span className={`text-sm font-medium capitalize ${trendColor}`}>
                {stats.trend}
              </span>
            </div>
          </div>
          <div className="bg-secondary/50 p-3 rounded-xl text-center">
            <p className="text-xs text-muted-foreground mb-1">Logged</p>
            <p className="text-xl font-bold text-foreground">{stats.loggedDays}/{stats.totalDays}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
          <div className="bg-secondary/50 p-3 rounded-xl text-center">
            <p className="text-xs text-muted-foreground mb-1">Consistency</p>
            <p className="text-xl font-bold text-foreground">{stats.consistency}%</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGradientAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) => moodLabels[value]?.[0] || ""}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#moodGradientAnalytics)"
                connectNulls={false}
                dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Distribution */}
        {moodDistribution.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mood Distribution
            </p>
            <div className="flex flex-wrap gap-2">
              {moodDistribution.map(({ mood, count, percentage }) => (
                <Badge
                  key={mood}
                  variant="secondary"
                  className="px-3 py-1"
                  style={{ borderLeftColor: moodColors[mood], borderLeftWidth: "3px" }}
                >
                  <span className="capitalize">{mood}</span>
                  <span className="ml-2 text-muted-foreground">{percentage}%</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Insights
          </p>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodAnalytics;
