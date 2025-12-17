import { BookOpen, Users, Brain, Heart, Shield, Flame } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const resources = [
  {
    icon: Flame,
    title: "Anger Management",
    description: "Learn to understand and manage anger effectively",
    items: [
      "Recognizing anger triggers",
      "Healthy expression techniques",
      "Cooling down strategies",
      "Communication skills"
    ],
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Brain,
    title: "Understanding Mental Health",
    description: "Learn about common conditions and treatments",
    items: [
      "Anxiety & Depression",
      "PTSD & Trauma",
      "Bipolar Disorder",
      "OCD & Related Disorders"
    ],
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Support Communities",
    description: "Connect with others who understand",
    items: [
      "Peer support groups",
      "Online communities",
      "Family support resources",
      "Caregiver networks"
    ],
    color: "bg-serenity text-serenity-foreground",
  },
  {
    icon: BookOpen,
    title: "Educational Resources",
    description: "Evidence-based information and guides",
    items: [
      "Self-help workbooks",
      "Research articles",
      "Video courses",
      "Podcasts & audiobooks"
    ],
    color: "bg-warmth text-warmth-foreground",
  },
  {
    icon: Heart,
    title: "Self-Care Tools",
    description: "Practical techniques for daily wellness",
    items: [
      "Meditation guides",
      "Breathing exercises",
      "Journaling prompts",
      "Sleep hygiene tips"
    ],
    color: "bg-hope/20 text-primary",
  },
  {
    icon: Shield,
    title: "Professional Help",
    description: "Finding the right care for you",
    items: [
      "Finding a therapist",
      "Types of therapy",
      "What to expect",
      "Insurance & costs"
    ],
    color: "bg-accent text-accent-foreground",
  },
];

const ResourcesSection = () => {
  return (
    <section id="resources" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Mental Health Resources
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of resources designed to support your mental health journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Card
              key={resource.title}
              className="bg-card border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${resource.color} flex items-center justify-center mb-4`}>
                  <resource.icon className="w-6 h-6" />
                </div>
                <CardTitle className="font-serif text-xl">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {resource.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
