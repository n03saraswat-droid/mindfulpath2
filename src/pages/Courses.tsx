import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Clock, Users, Star, Play } from "lucide-react";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  icon: string;
  duration: string;
  students: string;
  rating: number;
  color: string;
  lessons: Lesson[];
}

const courses: Course[] = [
  {
    id: "anxiety",
    title: "Understanding Anxiety",
    description: "Learn to recognize and manage anxiety symptoms",
    fullDescription: "This comprehensive course helps you understand the root causes of anxiety, recognize triggers, and develop effective coping mechanisms. You'll learn evidence-based techniques used by mental health professionals worldwide.",
    icon: "🧠",
    duration: "4 weeks",
    students: "12.5k",
    rating: 4.8,
    color: "from-blue-500/20 to-cyan-500/20",
    lessons: [
      { id: "anxiety-1", title: "What is Anxiety?", duration: "15 min", description: "Understanding the basics of anxiety and how it affects your mind and body." },
      { id: "anxiety-2", title: "Identifying Your Triggers", duration: "20 min", description: "Learn to recognize what situations or thoughts trigger your anxiety." },
      { id: "anxiety-3", title: "Breathing Techniques", duration: "15 min", description: "Master calming breathing exercises to reduce anxiety in the moment." },
      { id: "anxiety-4", title: "Cognitive Restructuring", duration: "25 min", description: "Challenge and reframe anxious thoughts using CBT techniques." },
      { id: "anxiety-5", title: "Building a Coping Toolkit", duration: "20 min", description: "Create your personalized set of strategies for managing anxiety." },
    ],
  },
  {
    id: "depression",
    title: "Overcoming Depression",
    description: "Evidence-based strategies for depression recovery",
    fullDescription: "A supportive journey through understanding depression and building resilience. Learn practical tools from cognitive behavioral therapy and positive psychology to lift your mood and regain motivation.",
    icon: "💙",
    duration: "6 weeks",
    students: "9.2k",
    rating: 4.9,
    color: "from-indigo-500/20 to-purple-500/20",
    lessons: [
      { id: "depression-1", title: "Understanding Depression", duration: "20 min", description: "Learn what depression is and isn't, and how it differs from sadness." },
      { id: "depression-2", title: "The Mind-Body Connection", duration: "18 min", description: "Explore how physical health impacts mental well-being." },
      { id: "depression-3", title: "Behavioral Activation", duration: "22 min", description: "Small steps to break the cycle of inactivity and low mood." },
      { id: "depression-4", title: "Challenging Negative Thoughts", duration: "25 min", description: "Identify and change thought patterns that fuel depression." },
      { id: "depression-5", title: "Building Social Connections", duration: "20 min", description: "Overcome isolation and rebuild meaningful relationships." },
      { id: "depression-6", title: "Creating a Wellness Plan", duration: "15 min", description: "Design your personal roadmap to sustained mental wellness." },
    ],
  },
  {
    id: "stress",
    title: "Stress Management",
    description: "Master techniques to reduce daily stress",
    fullDescription: "Modern life brings constant stress. This course teaches you proven methods to reduce stress, improve work-life balance, and build resilience against future challenges.",
    icon: "🌿",
    duration: "3 weeks",
    students: "15.8k",
    rating: 4.7,
    color: "from-green-500/20 to-emerald-500/20",
    lessons: [
      { id: "stress-1", title: "The Science of Stress", duration: "15 min", description: "Understand how stress affects your body and mind." },
      { id: "stress-2", title: "Time Management Essentials", duration: "20 min", description: "Organize your time to reduce overwhelm and increase productivity." },
      { id: "stress-3", title: "Relaxation Techniques", duration: "18 min", description: "Progressive muscle relaxation and other calming practices." },
      { id: "stress-4", title: "Setting Healthy Boundaries", duration: "22 min", description: "Learn to say no and protect your mental energy." },
    ],
  },
  {
    id: "anger",
    title: "Anger Management",
    description: "Transform anger into healthy expression",
    fullDescription: "Anger is a natural emotion, but when uncontrolled, it can damage relationships and health. Learn to understand your anger, express it healthily, and develop emotional regulation skills.",
    icon: "🔥",
    duration: "4 weeks",
    students: "7.3k",
    rating: 4.6,
    color: "from-orange-500/20 to-red-500/20",
    lessons: [
      { id: "anger-1", title: "Understanding Anger", duration: "18 min", description: "Explore what anger is and why we experience it." },
      { id: "anger-2", title: "Recognizing Warning Signs", duration: "15 min", description: "Identify physical and emotional cues before anger escalates." },
      { id: "anger-3", title: "Cooling Down Strategies", duration: "20 min", description: "Techniques to de-escalate anger in the moment." },
      { id: "anger-4", title: "Assertive Communication", duration: "25 min", description: "Express your needs without aggression or passivity." },
      { id: "anger-5", title: "Long-term Anger Prevention", duration: "22 min", description: "Build habits that reduce chronic anger and frustration." },
    ],
  },
  {
    id: "sleep",
    title: "Better Sleep Habits",
    description: "Improve your sleep quality naturally",
    fullDescription: "Quality sleep is essential for mental health. This course covers sleep science, common disorders, and practical techniques to help you fall asleep faster and wake up refreshed.",
    icon: "🌙",
    duration: "2 weeks",
    students: "11.1k",
    rating: 4.8,
    color: "from-violet-500/20 to-indigo-500/20",
    lessons: [
      { id: "sleep-1", title: "Sleep Science 101", duration: "15 min", description: "Learn about sleep cycles and why they matter." },
      { id: "sleep-2", title: "Creating a Sleep Sanctuary", duration: "12 min", description: "Optimize your bedroom environment for better sleep." },
      { id: "sleep-3", title: "Wind-Down Routines", duration: "18 min", description: "Establish pre-sleep habits that signal your body it's time to rest." },
      { id: "sleep-4", title: "Managing Sleep Disruptors", duration: "20 min", description: "Address common issues like racing thoughts and anxiety at night." },
    ],
  },
  {
    id: "self-esteem",
    title: "Building Self-Esteem",
    description: "Develop confidence and self-worth",
    fullDescription: "Self-esteem impacts every area of life. Learn to challenge negative self-talk, recognize your strengths, and build lasting confidence from the inside out.",
    icon: "⭐",
    duration: "5 weeks",
    students: "8.9k",
    rating: 4.7,
    color: "from-yellow-500/20 to-amber-500/20",
    lessons: [
      { id: "esteem-1", title: "What is Self-Esteem?", duration: "15 min", description: "Understand the foundations of healthy self-worth." },
      { id: "esteem-2", title: "Challenging Your Inner Critic", duration: "22 min", description: "Recognize and reframe negative self-talk." },
      { id: "esteem-3", title: "Celebrating Your Strengths", duration: "18 min", description: "Identify and appreciate your unique qualities." },
      { id: "esteem-4", title: "Setting Achievable Goals", duration: "20 min", description: "Build confidence through small wins and progress." },
      { id: "esteem-5", title: "Self-Compassion Practice", duration: "25 min", description: "Treat yourself with the kindness you deserve." },
    ],
  },
  {
    id: "relationships",
    title: "Healthy Relationships",
    description: "Build stronger connections with others",
    fullDescription: "Healthy relationships are crucial for mental well-being. Learn communication skills, boundary setting, and how to nurture meaningful connections in all areas of life.",
    icon: "💕",
    duration: "4 weeks",
    students: "6.7k",
    rating: 4.8,
    color: "from-pink-500/20 to-rose-500/20",
    lessons: [
      { id: "rel-1", title: "Communication Fundamentals", duration: "20 min", description: "Learn active listening and clear expression." },
      { id: "rel-2", title: "Understanding Attachment Styles", duration: "25 min", description: "How early experiences shape your relationships." },
      { id: "rel-3", title: "Conflict Resolution", duration: "22 min", description: "Navigate disagreements constructively." },
      { id: "rel-4", title: "Building Trust and Intimacy", duration: "20 min", description: "Deepen connections through vulnerability and consistency." },
    ],
  },
  {
    id: "mindfulness",
    title: "Mindfulness Essentials",
    description: "Practice present-moment awareness",
    fullDescription: "Mindfulness reduces stress, improves focus, and enhances emotional regulation. This course introduces core meditation practices and ways to bring mindfulness into daily life.",
    icon: "🧘",
    duration: "3 weeks",
    students: "14.2k",
    rating: 4.9,
    color: "from-teal-500/20 to-cyan-500/20",
    lessons: [
      { id: "mind-1", title: "Introduction to Mindfulness", duration: "12 min", description: "What mindfulness is and its benefits for mental health." },
      { id: "mind-2", title: "Basic Meditation Practice", duration: "15 min", description: "Learn foundational sitting meditation techniques." },
      { id: "mind-3", title: "Mindful Breathing", duration: "10 min", description: "Use breath as an anchor for present-moment awareness." },
      { id: "mind-4", title: "Body Scan Meditation", duration: "20 min", description: "Release tension and connect with physical sensations." },
      { id: "mind-5", title: "Mindfulness in Daily Life", duration: "18 min", description: "Bring awareness to everyday activities." },
    ],
  },
];

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("course_progress")
        .select("lesson_id")
        .eq("user_id", user.id);

      if (error) throw error;

      const completed = new Set(data?.map((p) => p.lesson_id) || []);
      setCompletedLessons(completed);
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLessonComplete = async (courseId: string, lessonId: string) => {
    if (!user) {
      toast.error("Please sign in to track your progress");
      navigate("/auth");
      return;
    }

    const isCompleted = completedLessons.has(lessonId);

    try {
      if (isCompleted) {
        const { error } = await supabase
          .from("course_progress")
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId);

        if (error) throw error;

        setCompletedLessons((prev) => {
          const newSet = new Set(prev);
          newSet.delete(lessonId);
          return newSet;
        });
        toast.success("Lesson unmarked");
      } else {
        const { error } = await supabase
          .from("course_progress")
          .insert({ user_id: user.id, course_id: courseId, lesson_id: lessonId });

        if (error) throw error;

        setCompletedLessons((prev) => new Set([...prev, lessonId]));
        toast.success("Lesson completed! 🎉");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const getCourseProgress = (course: Course) => {
    const completed = course.lessons.filter((l) => completedLessons.has(l.id)).length;
    return Math.round((completed / course.lessons.length) * 100);
  };

  if (selectedCourse) {
    const progress = getCourseProgress(selectedCourse);
    const completedCount = selectedCourse.lessons.filter((l) => completedLessons.has(l.id)).length;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedCourse(null)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <div className={`rounded-2xl bg-gradient-to-br ${selectedCourse.color} p-8 mb-8`}>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{selectedCourse.icon}</span>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {selectedCourse.title}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {selectedCourse.fullDescription}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedCourse.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedCourse.students} students
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {selectedCourse.rating}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedCount} of {selectedCourse.lessons.length} lessons
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              {progress === 100 && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Course completed! Great job!
                </p>
              )}
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4">Course Lessons</h2>
          <div className="space-y-3">
            {selectedCourse.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id);
              return (
                <Card
                  key={lesson.id}
                  className={`transition-all ${isCompleted ? "bg-primary/5 border-primary/20" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleLessonComplete(selectedCourse.id, lesson.id)}
                        className="mt-1 transition-transform hover:scale-110"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                            Lesson {index + 1}: {lesson.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {lesson.description}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mental Health Learning Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Evidence-based courses to help you understand and improve your mental well-being.
            Track your progress and learn at your own pace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => {
            const progress = getCourseProgress(course);
            const completedCount = course.lessons.filter((l) => completedLessons.has(l.id)).length;

            return (
              <Card
                key={course.id}
                className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => setSelectedCourse(course)}
              >
                <CardHeader className={`rounded-t-lg bg-gradient-to-br ${course.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{course.icon}</span>
                    {progress > 0 && (
                      <Badge variant={progress === 100 ? "default" : "secondary"}>
                        {progress}%
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-4">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons.length} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                  </div>
                  {user && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{completedCount} completed</span>
                        <span>{course.lessons.length - completedCount} remaining</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      {course.rating}
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{course.students} students</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Courses;
