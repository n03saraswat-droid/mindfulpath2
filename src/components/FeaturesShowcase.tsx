import { BarChart3, BookOpen, Music, Brain, Trophy, Sun, Heart, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from "@/components/ScrollReveal";
import featuresDashboard from "@/assets/features-dashboard.jpg";

const features = [
  { icon: BarChart3, title: "Mood Tracking", description: "Log daily moods and visualize patterns over time", color: "bg-primary/10 text-primary" },
  { icon: Brain, title: "Emotion Engine", description: "AI-powered emotional analysis and insights", color: "bg-violet-500/10 text-violet-500" },
  { icon: Music, title: "Audio Library", description: "Curated ambient sounds, mantras, and music", color: "bg-amber-500/10 text-amber-500" },
  { icon: BookOpen, title: "Learning Courses", description: "Expert-designed mental health curriculum", color: "bg-blue-500/10 text-blue-500" },
  { icon: Trophy, title: "XP & Streaks", description: "Gamified progress to keep you motivated", color: "bg-orange-500/10 text-orange-500" },
  { icon: Sun, title: "Gratitude Journal", description: "Daily gratitude practice with prompts", color: "bg-rose-500/10 text-rose-500" },
  { icon: Heart, title: "Self-Care Tools", description: "Breathing exercises and wellness routines", color: "bg-teal-500/10 text-teal-500" },
  { icon: Shield, title: "Private & Secure", description: "Your data stays safe and confidential", color: "bg-emerald-500/10 text-emerald-500" },
];

const FeaturesShowcase = () => {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Image */}
          <ScrollReveal variant="left" className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-card border border-border/50">
              <img
                src={featuresDashboard}
                alt="Mindful Path dashboard features overview"
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-serif text-2xl font-bold text-foreground drop-shadow-lg">
                  Your Complete Wellness Dashboard
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Feature grid */}
          <div className="flex-1 w-full">
            <ScrollReveal>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
                Everything You Need
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                A comprehensive toolkit for your mental wellness journey.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <ScrollReveal key={feature.title} delay={i * 60} variant="scale">
                  <Card className="border-border/50 hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5 h-full">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center flex-shrink-0`}>
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
