import { useMemo } from "react";
import { format, parseISO, subDays } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

type MoodType = "great" | "good" | "okay" | "low" | "struggling";

interface MoodEntry {
  id: string;
  mood: MoodType;
  note: string | null;
  logged_at: string;
  created_at: string;
}

interface MoodChartProps {
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

const MoodChart = ({ entries }: MoodChartProps) => {
  const chartData = useMemo(() => {
    // Create a map of dates to mood values
    const dateMap = new Map<string, number>();
    entries.forEach((entry) => {
      dateMap.set(entry.logged_at, moodValues[entry.mood]);
    });

    // Generate last 14 days of data
    const data = [];
    for (let i = 13; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      const displayDate = format(subDays(new Date(), i), "MMM d");
      data.push({
        date: displayDate,
        fullDate: date,
        value: dateMap.get(date) || null,
      });
    }
    return data;
  }, [entries]);

  const averageMood = useMemo(() => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, entry) => sum + moodValues[entry.mood], 0);
    return (total / entries.length).toFixed(1);
  }, [entries]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && payload[0].value !== null) {
      return (
        <div className="bg-card p-3 rounded-lg shadow-card border border-border">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary">
            Mood: {moodLabels[payload[0].value]}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/50 p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Entries this month</p>
          <p className="text-2xl font-serif font-bold text-foreground">{entries.length}</p>
        </div>
        <div className="bg-secondary/50 p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Average mood</p>
          <p className="text-2xl font-serif font-bold text-primary">{averageMood}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(158, 40%, 42%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(158, 40%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 88%)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(160, 10%, 45%)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(value) => moodLabels[value]?.[0] || ""}
              tick={{ fontSize: 11, fill: "hsl(160, 10%, 45%)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(158, 40%, 42%)"
              strokeWidth={2}
              fill="url(#moodGradient)"
              connectNulls={false}
              dot={{ r: 4, fill: "hsl(158, 40%, 42%)", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "hsl(158, 40%, 42%)", strokeWidth: 2, stroke: "white" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Showing your mood over the last 14 days
      </p>
    </div>
  );
};

export default MoodChart;
