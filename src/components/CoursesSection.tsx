import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Users, ChevronRight, Brain, Heart, Frown, Zap, Moon, AlertTriangle, Flame, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const courses = [
  {
    id: 1,
    title: "Understanding Anxiety",
    description: "Learn to recognize anxiety triggers, understand your body's response, and develop effective coping strategies.",
    icon: Zap,
    duration: "4 weeks",
    lessons: 12,
    level: "Beginner",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: 2,
    title: "Managing Depression",
    description: "Explore evidence-based techniques to manage depressive symptoms and build resilience for better mental health.",
    icon: Frown,
    duration: "6 weeks",
    lessons: 18,
    level: "Beginner",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 3,
    title: "Stress Management Mastery",
    description: "Master practical stress-reduction techniques including mindfulness, time management, and relaxation methods.",
    icon: Brain,
    duration: "3 weeks",
    lessons: 9,
    level: "All Levels",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 4,
    title: "Building Self-Esteem",
    description: "Develop a healthier self-image through cognitive restructuring and positive psychology practices.",
    icon: Heart,
    duration: "5 weeks",
    lessons: 15,
    level: "Beginner",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    id: 5,
    title: "Sleep & Mental Health",
    description: "Understand the connection between sleep and mental wellness, and learn techniques for better sleep hygiene.",
    icon: Moon,
    duration: "2 weeks",
    lessons: 6,
    level: "Beginner",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    id: 6,
    title: "Anger Management",
    description: "Learn to identify anger triggers, develop healthy expression techniques, and build emotional regulation skills.",
    icon: Flame,
    duration: "4 weeks",
    lessons: 12,
    level: "Intermediate",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 7,
    title: "Trauma & Healing",
    description: "Understand trauma responses and explore gentle, evidence-based approaches to processing and healing.",
    icon: Shield,
    duration: "8 weeks",
    lessons: 24,
    level: "Intermediate",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    id: 8,
    title: "Panic Attack Recovery",
    description: "Learn grounding techniques, breathing exercises, and cognitive strategies to manage and prevent panic attacks.",
    icon: AlertTriangle,
    duration: "3 weeks",
    lessons: 9,
    level: "All Levels",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

const CoursesSection = () => {
  const navigate = useNavigate();
  
  return (
    <section id="courses" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Learning Courses
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mental Health Learning Paths
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Self-paced courses designed by mental health professionals to help you understand and manage various mental health challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${course.bgColor} flex items-center justify-center mb-3`}>
                  <course.icon className={`w-6 h-6 ${course.color}`} />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {course.lessons} lessons
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs group-hover:text-primary"
                    onClick={() => navigate("/courses")}
                  >
                    Start Course
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground mb-4">
            All courses are free and designed for self-paced learning
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ learners</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>105+ lessons</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
