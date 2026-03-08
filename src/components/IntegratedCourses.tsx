import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, CheckCircle2, Circle, Clock, Users, Star, Play, Award, Search, X } from "lucide-react";
import { toast } from "sonner";
import CourseCertificate from "@/components/CourseCertificate";
import CourseQuiz from "@/components/CourseQuiz";
import { courseQuizzes } from "@/data/courseQuizzes";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useXPReward } from "@/hooks/useXPReward";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  resourceUrl?: string;
  resourceLabel?: string;
  videoId: string;
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
    id: "anxiety", title: "Understanding Anxiety", description: "Learn to recognize and manage anxiety", fullDescription: "Comprehensive course on anxiety management.", icon: "🧠", duration: "4 weeks", students: "12.5k", rating: 4.8, color: "from-blue-500/20 to-cyan-500/20",
    lessons: [
      { id: "anxiety-1", title: "What is Anxiety?", duration: "15 min", description: "Understanding basics of anxiety.", videoId: "BVJkf0Bgq4s" },
      { id: "anxiety-2", title: "Identifying Triggers", duration: "20 min", description: "Recognize anxiety triggers.", videoId: "ZidGozDhOjg" },
      { id: "anxiety-3", title: "Breathing Techniques", duration: "15 min", description: "Calming breathing exercises.", videoId: "tEmt1Znux58" },
      { id: "anxiety-4", title: "Cognitive Restructuring", duration: "25 min", description: "CBT techniques.", videoId: "g7B3n9jobus" },
      { id: "anxiety-5", title: "Building a Coping Toolkit", duration: "20 min", description: "Personalized strategies.", videoId: "WWloIAQpMcQ" },
    ],
  },
  {
    id: "depression", title: "Overcoming Depression", description: "Evidence-based strategies", fullDescription: "Depression recovery journey.", icon: "💙", duration: "6 weeks", students: "9.2k", rating: 4.9, color: "from-indigo-500/20 to-purple-500/20",
    lessons: [
      { id: "depression-1", title: "Understanding Depression", duration: "20 min", description: "What depression is.", videoId: "z-IR48Mb3W0" },
      { id: "depression-2", title: "Mind-Body Connection", duration: "18 min", description: "Physical and mental health.", videoId: "ysYV3rJNqgg" },
      { id: "depression-3", title: "Behavioral Activation", duration: "22 min", description: "Break inactivity cycle.", videoId: "J6DykoKy1fM" },
    ],
  },
  {
    id: "mindfulness", title: "Mindfulness Essentials", description: "Present-moment awareness", fullDescription: "Core meditation practices.", icon: "🧘", duration: "3 weeks", students: "14.2k", rating: 4.9, color: "from-teal-500/20 to-cyan-500/20",
    lessons: [
      { id: "mind-1", title: "Introduction to Mindfulness", duration: "12 min", description: "Mindfulness basics.", videoId: "w6T02g5hnT4" },
      { id: "mind-2", title: "Basic Meditation", duration: "15 min", description: "Sitting meditation.", videoId: "inpok4MKVLM" },
      { id: "mind-3", title: "Mindful Breathing", duration: "10 min", description: "Breath as anchor.", videoId: "tEmt1Znux58" },
    ],
  },
  {
    id: "stress", title: "Stress Management", description: "Master techniques to handle daily stress", fullDescription: "Learn proven stress reduction strategies.", icon: "🌊", duration: "3 weeks", students: "11.3k", rating: 4.7, color: "from-emerald-500/20 to-green-500/20",
    lessons: [
      { id: "stress-1", title: "Understanding Stress", duration: "15 min", description: "How stress affects body and mind.", videoId: "hnpQrMqDoqE" },
      { id: "stress-2", title: "Progressive Muscle Relaxation", duration: "20 min", description: "Release physical tension.", videoId: "1nZEdqcGVzo" },
      { id: "stress-3", title: "Time Management", duration: "18 min", description: "Organize to reduce overwhelm.", videoId: "iONDebHX9qk" },
    ],
  },
  {
    id: "anger", title: "Anger Management", description: "Channel anger constructively", fullDescription: "Transform anger into positive action.", icon: "🔥", duration: "4 weeks", students: "7.8k", rating: 4.6, color: "from-red-500/20 to-orange-500/20",
    lessons: [
      { id: "anger-1", title: "The Nature of Anger", duration: "15 min", description: "Understanding anger as an emotion.", videoId: "BsVq5R_F6RA" },
      { id: "anger-2", title: "Trigger Identification", duration: "20 min", description: "Know your anger triggers.", videoId: "phZAoI8T0Ck" },
      { id: "anger-3", title: "De-escalation Skills", duration: "18 min", description: "Calm down in the moment.", videoId: "k5RH3BdXDOY" },
    ],
  },
  {
    id: "social-anxiety", title: "Social Anxiety", description: "Build confidence in social settings", fullDescription: "Overcome social fears step by step.", icon: "👥", duration: "5 weeks", students: "8.1k", rating: 4.8, color: "from-violet-500/20 to-pink-500/20",
    lessons: [
      { id: "social-1", title: "What is Social Anxiety?", duration: "15 min", description: "Understanding social fears.", videoId: "8fFsBAnuObA" },
      { id: "social-2", title: "Challenging Negative Thoughts", duration: "20 min", description: "CBT for social anxiety.", videoId: "mOw5FxhNUQY" },
      { id: "social-3", title: "Exposure Techniques", duration: "22 min", description: "Gradual exposure practice.", videoId: "oM3A9KaH4hg" },
    ],
  },
  {
    id: "self-esteem", title: "Building Self-Esteem", description: "Develop a healthier self-image", fullDescription: "Transform your relationship with yourself through cognitive restructuring and positive psychology.", icon: "💪", duration: "5 weeks", students: "10.4k", rating: 4.7, color: "from-rose-500/20 to-pink-500/20",
    lessons: [
      { id: "esteem-1", title: "Understanding Self-Esteem", duration: "15 min", description: "What shapes our self-image.", videoId: "uOrzmFUJtrs" },
      { id: "esteem-2", title: "Challenging the Inner Critic", duration: "20 min", description: "Identify and reframe negative self-talk.", videoId: "gGuZVuUBeiQ" },
      { id: "esteem-3", title: "Building Self-Compassion", duration: "18 min", description: "Practice kindness toward yourself.", videoId: "IvtZBUSplr4" },
      { id: "esteem-4", title: "Setting Healthy Boundaries", duration: "22 min", description: "Learn to say no and protect your energy.", videoId: "rtsHXBb0jEo" },
    ],
  },
  {
    id: "sleep", title: "Sleep & Mental Health", description: "Improve sleep for better wellness", fullDescription: "Understand the deep connection between sleep and mental health, and build better sleep habits.", icon: "🌙", duration: "2 weeks", students: "13.7k", rating: 4.8, color: "from-indigo-500/20 to-blue-500/20",
    lessons: [
      { id: "sleep-1", title: "Sleep & the Brain", duration: "15 min", description: "How sleep affects mental health.", videoId: "gedoSfZvBgE" },
      { id: "sleep-2", title: "Sleep Hygiene Basics", duration: "18 min", description: "Creating an optimal sleep environment.", videoId: "nm1TxQj9IsQ" },
      { id: "sleep-3", title: "Relaxation for Sleep", duration: "12 min", description: "Wind-down techniques for better rest.", videoId: "t0kACis_dJE" },
    ],
  },
  {
    id: "trauma", title: "Trauma & Healing", description: "Understand and process trauma", fullDescription: "Explore gentle, evidence-based approaches to understanding trauma responses and healing.", icon: "🛡️", duration: "8 weeks", students: "6.9k", rating: 4.9, color: "from-teal-500/20 to-emerald-500/20",
    lessons: [
      { id: "trauma-1", title: "Understanding Trauma", duration: "20 min", description: "What trauma is and how it affects us.", videoId: "4-tcKYx24aA" },
      { id: "trauma-2", title: "The Body Keeps the Score", duration: "25 min", description: "How trauma lives in the body.", videoId: "53RX2ESUqpI" },
      { id: "trauma-3", title: "Grounding Techniques", duration: "15 min", description: "Stay present when triggered.", videoId: "30VMIEmA114" },
      { id: "trauma-4", title: "Building Safety", duration: "18 min", description: "Creating internal and external safety.", videoId: "nmJDkzDMllc" },
    ],
  },
  {
    id: "panic", title: "Panic Attack Recovery", description: "Manage and prevent panic attacks", fullDescription: "Learn grounding techniques, breathing exercises, and cognitive strategies for panic attacks.", icon: "⚡", duration: "3 weeks", students: "9.5k", rating: 4.7, color: "from-red-500/20 to-amber-500/20",
    lessons: [
      { id: "panic-1", title: "Understanding Panic", duration: "15 min", description: "What happens during a panic attack.", videoId: "S6k6SOtMi9M" },
      { id: "panic-2", title: "Grounding in the Moment", duration: "12 min", description: "5-4-3-2-1 and other grounding methods.", videoId: "30VMIEmA114" },
      { id: "panic-3", title: "Preventing Future Attacks", duration: "20 min", description: "Long-term strategies for panic management.", videoId: "tEmt1Znux58" },
    ],
  },
  {
    id: "ocd", title: "Understanding OCD", description: "Learn about OCD and coping strategies", fullDescription: "Understand obsessive-compulsive patterns and evidence-based approaches to managing them.", icon: "🔄", duration: "5 weeks", students: "5.3k", rating: 4.6, color: "from-cyan-500/20 to-blue-500/20",
    lessons: [
      { id: "ocd-1", title: "What is OCD?", duration: "18 min", description: "Understanding obsessions and compulsions.", videoId: "I8Jofzx_8p4" },
      { id: "ocd-2", title: "ERP Therapy Basics", duration: "22 min", description: "Exposure and Response Prevention explained.", videoId: "laeYq51SYA0" },
      { id: "ocd-3", title: "Living Well with OCD", duration: "20 min", description: "Daily management strategies.", videoId: "epDVMBNXsXY" },
    ],
  },
  {
    id: "eating-disorders", title: "Eating Disorders Awareness", description: "Understand and seek help for eating disorders", fullDescription: "Learn about different eating disorders, warning signs, and paths to recovery.", icon: "🍃", duration: "4 weeks", students: "4.8k", rating: 4.8, color: "from-lime-500/20 to-green-500/20",
    lessons: [
      { id: "ed-1", title: "Types of Eating Disorders", duration: "20 min", description: "Understanding anorexia, bulimia, BED, and more.", videoId: "3Bax8ijH038" },
      { id: "ed-2", title: "Body Image & Media", duration: "18 min", description: "How media shapes our relationship with food.", videoId: "H788h4IteyM" },
      { id: "ed-3", title: "Recovery & Support", duration: "22 min", description: "Steps toward healing and finding help.", videoId: "zMkMFxBNqkM" },
    ],
  },
  {
    id: "grief", title: "Grief & Loss", description: "Navigate the grieving process", fullDescription: "Understand grief, its stages, and find healthy ways to cope with loss.", icon: "🕊️", duration: "4 weeks", students: "6.2k", rating: 4.9, color: "from-slate-500/20 to-gray-500/20",
    lessons: [
      { id: "grief-1", title: "Understanding Grief", duration: "18 min", description: "The many faces of grief and loss.", videoId: "juET61B1P98" },
      { id: "grief-2", title: "Coping with Loss", duration: "20 min", description: "Healthy strategies for processing grief.", videoId: "kyFSGKNJEuA" },
      { id: "grief-3", title: "Finding Meaning", duration: "22 min", description: "Moving forward while honoring your loss.", videoId: "khkJkR-ipfw" },
    ],
  },
];

const IntegratedCourses = () => {
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [videoLesson, setVideoLesson] = useState<Lesson | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [newlyUnlocked, setNewlyUnlocked] = useState<Set<string>>(new Set());
  const { awardXP } = useXPReward();

  useEffect(() => {
    if (user) {
      fetchProgress();
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("display_name, email").eq("id", user.id).maybeSingle();
    setDisplayName(data?.display_name || data?.email || user.email || "Student");
  };

  const fetchProgress = async () => {
    if (!user) return;
    const { data } = await supabase.from("course_progress").select("lesson_id").eq("user_id", user.id);
    setCompletedLessons(new Set(data?.map(p => p.lesson_id) || []));
  };

  const toggleLesson = async (courseId: string, lessonId: string) => {
    if (!user) { toast.error("Please sign in"); return; }
    const isCompleted = completedLessons.has(lessonId);
    try {
      if (isCompleted) {
        await supabase.from("course_progress").delete().eq("user_id", user.id).eq("lesson_id", lessonId);
        setCompletedLessons(prev => { const n = new Set(prev); n.delete(lessonId); return n; });
      } else {
        await supabase.from("course_progress").insert({ user_id: user.id, course_id: courseId, lesson_id: lessonId });
        setCompletedLessons(prev => new Set([...prev, lessonId]));
        toast.success("Lesson completed! 🎉");
        await awardXP(20, "course_lesson", `Completed lesson: ${lessonId}`);

        // Mark the next lesson as newly unlocked for animation
        const course = courses.find(c => c.id === courseId);
        if (course) {
          const idx = course.lessons.findIndex(l => l.id === lessonId);
          if (idx >= 0 && idx < course.lessons.length - 1) {
            const nextLessonId = course.lessons[idx + 1].id;
            setNewlyUnlocked(prev => new Set([...prev, nextLessonId]));
            // Clear animation after it plays
            setTimeout(() => {
              setNewlyUnlocked(prev => { const n = new Set(prev); n.delete(nextLessonId); return n; });
            }, 2000);
          }

          const allDone = course.lessons.every(l => l.id === lessonId || completedLessons.has(l.id));
          if (allDone) {
            await awardXP(50, "course_complete", `Completed course: ${course.title}`);
            toast.success("🏆 Course completed! +50 bonus XP");
          }
        }
      }
    } catch { toast.error("Failed to update"); }
  };

  const getProgress = (course: Course) => {
    const completed = course.lessons.filter(l => completedLessons.has(l.id)).length;
    return { completed, total: course.lessons.length, percent: Math.round((completed / course.lessons.length) * 100) };
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Courses</h2>
        <p className="text-muted-foreground">Learn evidence-based mental health techniques</p>
      </motion.div>

      <Dialog open={!!videoLesson} onOpenChange={() => setVideoLesson(null)}>
        <DialogContent className="max-w-3xl glass-card">
          <DialogHeader><DialogTitle className="font-serif">{videoLesson?.title}</DialogTitle></DialogHeader>
          {videoLesson && (
            <div className="aspect-video">
              <iframe src={`https://www.youtube.com/embed/${videoLesson.videoId}`} className="w-full h-full rounded-xl" allowFullScreen />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {selectedCourse ? (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="text-muted-foreground">← Back</Button>
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCourse.icon}</span>
                <div>
                  <CardTitle className="font-serif text-2xl">{selectedCourse.title}</CardTitle>
                  <CardDescription>{selectedCourse.fullDescription}</CardDescription>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{selectedCourse.duration}</Badge>
                <Badge variant="secondary"><Users className="w-3 h-3 mr-1" />{selectedCourse.students}</Badge>
                <Badge variant="secondary"><Star className="w-3 h-3 mr-1" />{selectedCourse.rating}</Badge>
              </div>
              <div className="mt-3">
                <Progress value={getProgress(selectedCourse).percent} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{getProgress(selectedCourse).completed}/{getProgress(selectedCourse).total} lessons</p>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {selectedCourse.lessons.map((lesson, idx) => {
                  const isUnlocked = idx === 0 || completedLessons.has(selectedCourse.lessons[idx - 1].id);
                  return (
                    <motion.div
                      key={lesson.id}
                      initial={newlyUnlocked.has(lesson.id) ? { scale: 0.95, opacity: 0.5 } : false}
                      animate={newlyUnlocked.has(lesson.id) ? { scale: 1, opacity: 1 } : {}}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                    <AccordionItem key={lesson.id} value={lesson.id} disabled={!isUnlocked} className={cn(
                      newlyUnlocked.has(lesson.id) && "ring-2 ring-primary/50 rounded-lg shadow-[0_0_15px_hsl(var(--primary)/0.3)] transition-shadow duration-1000"
                    )}>
                      <AccordionTrigger className={cn("hover:no-underline", !isUnlocked && "opacity-50 cursor-not-allowed")}>
                        <div className="flex items-center gap-3 text-left">
                          {!isUnlocked ? (
                            <span className="w-5 h-5 text-muted-foreground">🔒</span>
                          ) : newlyUnlocked.has(lesson.id) ? (
                            <motion.span
                              initial={{ rotate: -20, scale: 1.3 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              className="w-5 h-5 inline-block"
                            >
                              🔓
                            </motion.span>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); toggleLesson(selectedCourse.id, lesson.id); }}>
                              {completedLessons.has(lesson.id) ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-foreground">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {lesson.duration}
                              {!isUnlocked ? " · Complete previous lesson to unlock" : ""}
                              {newlyUnlocked.has(lesson.id) ? " · 🎉 Unlocked!" : ""}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      {isUnlocked && (
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                          <Button size="sm" onClick={() => setVideoLesson(lesson)} className="gradient-calm text-primary-foreground">
                            <Play className="w-3 h-3 mr-1" /> Watch
                          </Button>
                        </AccordionContent>
                      )}
                    </AccordionItem>
                    </motion.div>
                  );
                })}
              </Accordion>

              {/* Quiz and Certificate section */}
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border">
                {courseQuizzes.find(q => q.courseId === selectedCourse.id) && (
                  <CourseQuiz
                    quiz={courseQuizzes.find(q => q.courseId === selectedCourse.id)!}
                    courseIcon={selectedCourse.icon}
                    onComplete={(score, total) => {
                      if (score >= total * 0.8) {
                        awardXP(30, "quiz_complete", `Passed quiz: ${selectedCourse.title}`);
                      }
                    }}
                  />
                )}
                {getProgress(selectedCourse).percent === 100 && (
                  <CourseCertificate
                    courseName={selectedCourse.title}
                    courseIcon={selectedCourse.icon}
                    userName={displayName}
                    completionDate={new Date()}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, i) => {
            const progress = getProgress(course);
            return (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass-card cursor-pointer hover:shadow-soft transition-all" onClick={() => setSelectedCourse(course)}>
                  <CardContent className="p-5">
                    <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl mb-3", course.color)}>
                      {course.icon}
                    </div>
                    <h3 className="font-serif font-semibold text-foreground mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary" className="text-[10px]"><Clock className="w-3 h-3 mr-1" />{course.duration}</Badge>
                      <Badge variant="secondary" className="text-[10px]"><Star className="w-3 h-3 mr-1" />{course.rating}</Badge>
                    </div>
                    {progress.completed > 0 && (
                      <div>
                        <Progress value={progress.percent} className="h-1.5" />
                        <p className="text-[10px] text-muted-foreground mt-1">{progress.percent}% complete</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IntegratedCourses;
