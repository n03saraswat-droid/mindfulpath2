import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Clock, Users, Star, Play, ExternalLink, Award, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import CourseCertificate from "@/components/CourseCertificate";
import CourseQuiz from "@/components/CourseQuiz";
import { courseQuizzes } from "@/data/courseQuizzes";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  resourceUrl?: string;
  resourceLabel?: string;
  videoId: string; // YouTube video ID
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
      { id: "anxiety-1", title: "What is Anxiety?", duration: "15 min", description: "Understanding the basics of anxiety and how it affects your mind and body.", resourceUrl: "https://www.who.int/news-room/fact-sheets/detail/depression", resourceLabel: "WHO: Anxiety & Depression", videoId: "BVJkf0Bgq4s" },
      { id: "anxiety-2", title: "Identifying Your Triggers", duration: "20 min", description: "Learn to recognize what situations or thoughts trigger your anxiety.", resourceUrl: "https://www.apa.org/topics/anger/control", resourceLabel: "APA: Recognizing Triggers", videoId: "ZidGozDhOjg" },
      { id: "anxiety-3", title: "Breathing Techniques", duration: "15 min", description: "Master calming breathing exercises to reduce anxiety in the moment.", resourceUrl: "https://www.healthline.com/health/breathing-exercises", resourceLabel: "Breathing Exercises Guide", videoId: "tEmt1Znux58" },
      { id: "anxiety-4", title: "Cognitive Restructuring", duration: "25 min", description: "Challenge and reframe anxious thoughts using CBT techniques.", resourceUrl: "https://www.apa.org/topics/psychotherapy/understanding", resourceLabel: "APA: Types of Therapy", videoId: "g7B3n9jobus" },
      { id: "anxiety-5", title: "Building a Coping Toolkit", duration: "20 min", description: "Create your personalized set of strategies for managing anxiety.", resourceUrl: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself", resourceLabel: "Self-Help Workbooks", videoId: "WWloIAQpMcQ" },
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
      { id: "depression-1", title: "Understanding Depression", duration: "20 min", description: "Learn what depression is and isn't, and how it differs from sadness.", resourceUrl: "https://www.who.int/news-room/fact-sheets/detail/depression", resourceLabel: "WHO: Depression Facts", videoId: "z-IR48Mb3W0" },
      { id: "depression-2", title: "The Mind-Body Connection", duration: "18 min", description: "Explore how physical health impacts mental well-being.", resourceUrl: "https://www.sleepfoundation.org/sleep-hygiene", resourceLabel: "Sleep & Mental Health", videoId: "ysYV3rJNqgg" },
      { id: "depression-3", title: "Behavioral Activation", duration: "22 min", description: "Small steps to break the cycle of inactivity and low mood.", resourceUrl: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself", resourceLabel: "Self-Help Workbooks", videoId: "J6DykoKy1fM" },
      { id: "depression-4", title: "Challenging Negative Thoughts", duration: "25 min", description: "Identify and change thought patterns that fuel depression.", resourceUrl: "https://www.apa.org/topics/psychotherapy/understanding", resourceLabel: "Cognitive Therapy Guide", videoId: "g7B3n9jobus" },
      { id: "depression-5", title: "Building Social Connections", duration: "20 min", description: "Overcome isolation and rebuild meaningful relationships.", resourceUrl: "https://www.nami.org/Support-Education/Support-Groups", resourceLabel: "NAMI Support Groups", videoId: "n3Xv_g3g-mA" },
      { id: "depression-6", title: "Creating a Wellness Plan", duration: "15 min", description: "Design your personal roadmap to sustained mental wellness.", resourceUrl: "https://www.mhanational.org/finding-therapy", resourceLabel: "Finding Professional Help", videoId: "3QIfkeA6HBY" },
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
      { id: "stress-1", title: "The Science of Stress", duration: "15 min", description: "Understand how stress affects your body and mind.", resourceUrl: "https://www.apa.org/topics/anger/control", resourceLabel: "APA: Stress Response", videoId: "v-t1Z5-oPtU" },
      { id: "stress-2", title: "Time Management Essentials", duration: "20 min", description: "Organize your time to reduce overwhelm and increase productivity.", resourceUrl: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself", resourceLabel: "Self-Help Resources", videoId: "iONDebHX9qk" },
      { id: "stress-3", title: "Relaxation Techniques", duration: "18 min", description: "Progressive muscle relaxation and other calming practices.", resourceUrl: "https://www.headspace.com/meditation/techniques", resourceLabel: "Meditation Techniques", videoId: "86HUcX8ZtAk" },
      { id: "stress-4", title: "Setting Healthy Boundaries", duration: "22 min", description: "Learn to say no and protect your mental energy.", resourceUrl: "https://www.helpguide.org/articles/relationships-communication/anger-management.htm", resourceLabel: "Healthy Communication", videoId: "5U3VcgUzqiI" },
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
      { id: "anger-1", title: "Understanding Anger", duration: "18 min", description: "Explore what anger is and why we experience it.", resourceUrl: "https://www.apa.org/topics/anger/control", resourceLabel: "APA: Anger Control", videoId: "BsVq5R_F6RA" },
      { id: "anger-2", title: "Recognizing Warning Signs", duration: "15 min", description: "Identify physical and emotional cues before anger escalates.", resourceUrl: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434", resourceLabel: "Mayo Clinic: Anger Signs", videoId: "rqoxYKtEWEc" },
      { id: "anger-3", title: "Cooling Down Strategies", duration: "20 min", description: "Techniques to de-escalate anger in the moment.", resourceUrl: "https://www.helpguide.org/articles/relationships-communication/anger-management.htm", resourceLabel: "HelpGuide: Cooling Down", videoId: "tEmt1Znux58" },
      { id: "anger-4", title: "Assertive Communication", duration: "25 min", description: "Express your needs without aggression or passivity.", resourceUrl: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anger/managing-outbursts/", resourceLabel: "Mind: Communication Skills", videoId: "vlwmfiCb-vc" },
      { id: "anger-5", title: "Long-term Anger Prevention", duration: "22 min", description: "Build habits that reduce chronic anger and frustration.", resourceUrl: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself", resourceLabel: "Self-Help Workbooks", videoId: "unkIVvjZc9Y" },
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
      { id: "sleep-1", title: "Sleep Science 101", duration: "15 min", description: "Learn about sleep cycles and why they matter.", resourceUrl: "https://www.sleepfoundation.org/sleep-hygiene", resourceLabel: "Sleep Foundation: Sleep Science", videoId: "gedoSfZvBgE" },
      { id: "sleep-2", title: "Creating a Sleep Sanctuary", duration: "12 min", description: "Optimize your bedroom environment for better sleep.", resourceUrl: "https://www.sleepfoundation.org/sleep-hygiene", resourceLabel: "Sleep Hygiene Tips", videoId: "t0kACis_dJE" },
      { id: "sleep-3", title: "Wind-Down Routines", duration: "18 min", description: "Establish pre-sleep habits that signal your body it's time to rest.", resourceUrl: "https://www.headspace.com/meditation/techniques", resourceLabel: "Relaxation Meditation", videoId: "aEqlQvczMJQ" },
      { id: "sleep-4", title: "Managing Sleep Disruptors", duration: "20 min", description: "Address common issues like racing thoughts and anxiety at night.", resourceUrl: "https://www.healthline.com/health/breathing-exercises", resourceLabel: "Calming Breathing Exercises", videoId: "Hz61wJPXEVw" },
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
      { id: "esteem-1", title: "What is Self-Esteem?", duration: "15 min", description: "Understand the foundations of healthy self-worth.", resourceUrl: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself", resourceLabel: "Self-Esteem Workbook", videoId: "uOrzmFUJtrs" },
      { id: "esteem-2", title: "Challenging Your Inner Critic", duration: "22 min", description: "Recognize and reframe negative self-talk.", resourceUrl: "https://www.apa.org/topics/psychotherapy/understanding", resourceLabel: "CBT Techniques", videoId: "g7B3n9jobus" },
      { id: "esteem-3", title: "Celebrating Your Strengths", duration: "18 min", description: "Identify and appreciate your unique qualities.", resourceUrl: "https://positivepsychology.com/journaling-for-mindfulness/", resourceLabel: "Journaling for Self-Discovery", videoId: "w-HYZv6HzAs" },
      { id: "esteem-4", title: "Setting Achievable Goals", duration: "20 min", description: "Build confidence through small wins and progress.", resourceUrl: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself", resourceLabel: "Goal-Setting Workbook", videoId: "L4N1q4RNi9I" },
      { id: "esteem-5", title: "Self-Compassion Practice", duration: "25 min", description: "Treat yourself with the kindness you deserve.", resourceUrl: "https://www.headspace.com/meditation/techniques", resourceLabel: "Self-Compassion Meditation", videoId: "IvtZBUSplr4" },
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
      { id: "rel-1", title: "Communication Fundamentals", duration: "20 min", description: "Learn active listening and clear expression.", resourceUrl: "https://www.helpguide.org/articles/relationships-communication/anger-management.htm", resourceLabel: "Effective Communication", videoId: "H6n3iNh4XLI" },
      { id: "rel-2", title: "Understanding Attachment Styles", duration: "25 min", description: "How early experiences shape your relationships.", resourceUrl: "https://www.apa.org/topics/psychotherapy/understanding", resourceLabel: "Understanding Attachment", videoId: "WjOowWxOXCg" },
      { id: "rel-3", title: "Conflict Resolution", duration: "22 min", description: "Navigate disagreements constructively.", resourceUrl: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anger/managing-outbursts/", resourceLabel: "Conflict Management", videoId: "KY5TWVz5ZDU" },
      { id: "rel-4", title: "Building Trust and Intimacy", duration: "20 min", description: "Deepen connections through vulnerability and consistency.", resourceUrl: "https://www.nami.org/Support-Education/Support-Groups", resourceLabel: "Support Communities", videoId: "1Evwgu369Jw" },
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
      { id: "mind-1", title: "Introduction to Mindfulness", duration: "12 min", description: "What mindfulness is and its benefits for mental health.", resourceUrl: "https://www.headspace.com/meditation/techniques", resourceLabel: "Headspace: Mindfulness Intro", videoId: "w6T02g5hnT4" },
      { id: "mind-2", title: "Basic Meditation Practice", duration: "15 min", description: "Learn foundational sitting meditation techniques.", resourceUrl: "https://www.headspace.com/meditation/techniques", resourceLabel: "Meditation Techniques", videoId: "inpok4MKVLM" },
      { id: "mind-3", title: "Mindful Breathing", duration: "10 min", description: "Use breath as an anchor for present-moment awareness.", resourceUrl: "https://www.healthline.com/health/breathing-exercises", resourceLabel: "Breathing Exercises", videoId: "tEmt1Znux58" },
      { id: "mind-4", title: "Body Scan Meditation", duration: "20 min", description: "Release tension and connect with physical sensations.", resourceUrl: "https://www.headspace.com/meditation/techniques", resourceLabel: "Body Scan Guide", videoId: "QS2yDmWk0vs" },
      { id: "mind-5", title: "Mindfulness in Daily Life", duration: "18 min", description: "Bring awareness to everyday activities.", resourceUrl: "https://positivepsychology.com/journaling-for-mindfulness/", resourceLabel: "Mindful Journaling", videoId: "ssss7V1_eyA" },
    ],
  },
];

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLesson, setVideoLesson] = useState<Lesson | null>(null);

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
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                          🎉 Congratulations!
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          You've completed this course!
                        </p>
                      </div>
                    </div>
                    <div className="sm:ml-auto">
                      <CourseCertificate
                        courseName={selectedCourse.title}
                        courseIcon={selectedCourse.icon}
                        userName={user?.email?.split("@")[0] || "Learner"}
                        completionDate={new Date()}
                      />
                    </div>
                  </div>
                </div>
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
                        <div className="flex items-center justify-between flex-wrap gap-2">
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
                        {lesson.resourceUrl && (
                          <a
                            href={lesson.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            {lesson.resourceLabel || "Related Resource"}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="default"
                        className="gap-1.5"
                        onClick={() => setVideoLesson(lesson)}
                      >
                        <Play className="w-4 h-4" />
                        Watch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Course Quiz Section */}
          {(() => {
            const quiz = courseQuizzes.find(q => q.courseId === selectedCourse.id);
            if (!quiz) return null;
            
            return (
              <Card className="mt-8 border-2 border-dashed border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-lg">Course Assessment</h3>
                      <p className="text-sm text-muted-foreground">
                        Test your knowledge with a {quiz.questions.length}-question quiz to reinforce what you've learned.
                      </p>
                    </div>
                    <CourseQuiz 
                      quiz={quiz} 
                      courseIcon={selectedCourse.icon}
                      onComplete={(score, total) => {
                        if (score === total) {
                          toast.success("Perfect score! You've mastered this material! 🌟");
                        } else if (score >= total * 0.8) {
                          toast.success("Excellent work! You have a strong understanding! 🎉");
                        } else {
                          toast.info("Good effort! Review the lessons and try again. 📚");
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Video Player Dialog */}
          <Dialog open={!!videoLesson} onOpenChange={(open) => !open && setVideoLesson(null)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
              <DialogHeader className="p-4 pb-0">
                <DialogTitle className="flex items-center justify-between">
                  <span>{videoLesson?.title}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="aspect-video w-full">
                {videoLesson && (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoLesson.videoId}?autoplay=1&rel=0`}
                    title={videoLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className="p-4 pt-2">
                <p className="text-sm text-muted-foreground">{videoLesson?.description}</p>
                {videoLesson?.resourceUrl && (
                  <a
                    href={videoLesson.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {videoLesson.resourceLabel || "Related Resource"}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </DialogContent>
          </Dialog>
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
