import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MoodAnalytics from "@/components/MoodAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  BarChart3, 
  Heart, 
  BookOpen, 
  Bookmark, 
  TrendingUp, 
  Calendar,
  Award,
  ArrowRight,
  Smile,
  Meh,
  Frown
} from "lucide-react";
import { format, subDays, differenceInDays } from "date-fns";

const moodIcons: Record<string, { icon: typeof Smile; color: string }> = {
  great: { icon: Smile, color: "text-green-500" },
  good: { icon: Smile, color: "text-emerald-500" },
  okay: { icon: Meh, color: "text-yellow-500" },
  low: { icon: Frown, color: "text-orange-500" },
  struggling: { icon: Frown, color: "text-red-500" },
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch profile
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch mood entries (fetch more for analytics)
  const { data: moodEntries = [] } = useQuery({
    queryKey: ["mood-entries", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user!.id)
        .order("logged_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch gratitude entries
  const { data: gratitudeEntries = [] } = useQuery({
    queryKey: ["gratitude-entries", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gratitude_entries")
        .select("*")
        .eq("user_id", user!.id)
        .order("logged_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch course progress
  const { data: courseProgress = [] } = useQuery({
    queryKey: ["course-progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch bookmarks
  const { data: bookmarks = [] } = useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resource_bookmarks")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Calculate gratitude streak
  const calculateGratitudeStreak = () => {
    if (gratitudeEntries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedDates = [...new Set(gratitudeEntries.map(e => e.logged_at))].sort().reverse();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const entryDate = new Date(sortedDates[i]);
      entryDate.setHours(0, 0, 0, 0);
      const expectedDate = subDays(today, i);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (differenceInDays(expectedDate, entryDate) === 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Calculate unique courses in progress
  const uniqueCourses = [...new Set(courseProgress.map(p => p.course_id))];
  const completedLessons = courseProgress.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const latestMood = moodEntries[0];
  const gratitudeStreak = calculateGratitudeStreak();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            Welcome back, {profile?.display_name || "Friend"} 👋
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your mental wellness journey
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{moodEntries.length}</p>
                <p className="text-xs text-muted-foreground">Mood Logs</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-rose-500/5 border-rose-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-lg">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{gratitudeStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedLessons}</p>
                <p className="text-xs text-muted-foreground">Lessons Done</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Bookmark className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{bookmarks.length}</p>
                <p className="text-xs text-muted-foreground">Saved Resources</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood Analytics Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <MoodAnalytics entries={moodEntries} />
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Latest Mood */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Today's Mood
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/mood-tracker")}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {latestMood ? (
                <div className="flex items-center gap-4">
                  {(() => {
                    const moodData = moodIcons[latestMood.mood];
                    const MoodIcon = moodData?.icon || Meh;
                    return (
                      <>
                        <div className={`p-3 rounded-full bg-muted ${moodData?.color || "text-muted-foreground"}`}>
                          <MoodIcon className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="font-medium capitalize text-foreground">{latestMood.mood}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(latestMood.logged_at), "MMM d, yyyy")}
                          </p>
                          {latestMood.note && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              "{latestMood.note}"
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">No mood logged yet</p>
                  <Button size="sm" onClick={() => navigate("/mood-tracker")}>
                    Log Your Mood
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gratitude Streak */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Gratitude Practice
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/gratitude")}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{gratitudeStreak}</p>
                    <p className="text-sm text-muted-foreground">Day Streak 🔥</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">{gratitudeEntries.length}</p>
                    <p className="text-sm text-muted-foreground">Total Entries</p>
                  </div>
                </div>
                {gratitudeEntries.length > 0 && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Latest entry:</p>
                    <p className="text-sm text-foreground line-clamp-2">
                      "{gratitudeEntries[0].entry_text}"
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Learning Progress
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/courses")}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {uniqueCourses.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-foreground">{uniqueCourses.length}</p>
                      <p className="text-sm text-muted-foreground">Courses Started</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">{completedLessons}</p>
                      <p className="text-sm text-muted-foreground">Lessons Completed</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {uniqueCourses.slice(0, 2).map((courseId) => {
                      const lessonsInCourse = courseProgress.filter(p => p.course_id === courseId).length;
                      return (
                        <div key={courseId} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {courseId.replace(/-/g, " ")}
                          </span>
                          <Badge variant="secondary">{lessonsInCourse} lessons</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">Start learning today!</p>
                  <Button size="sm" onClick={() => navigate("/courses")}>
                    Browse Courses
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Jump back into your wellness routine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => navigate("/mood-tracker")}
              >
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-sm">Log Mood</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => navigate("/gratitude")}
              >
                <Heart className="h-5 w-5 text-rose-500" />
                <span className="text-sm">Write Gratitude</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => navigate("/courses")}
              >
                <BookOpen className="h-5 w-5 text-amber-500" />
                <span className="text-sm">Continue Learning</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => navigate("/resources")}
              >
                <Bookmark className="h-5 w-5 text-blue-500" />
                <span className="text-sm">View Resources</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
