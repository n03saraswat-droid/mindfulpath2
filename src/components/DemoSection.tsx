import { Play, MessageCircle, Wind, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import demoAiChat from "@/assets/demo-ai-chat.jpg";
import demoMeditation from "@/assets/demo-meditation.jpg";
import { useState } from "react";

const demos = [
  {
    id: "ai-chat",
    title: "AI Mental Health Companion",
    description:
      "Meet MindfulAI — your compassionate 24/7 companion that listens, guides, and supports you through tough moments. Powered by advanced AI trained in mental health awareness.",
    image: demoAiChat,
    icon: MessageCircle,
    features: ["Empathetic conversations", "Coping strategies", "Crisis resource links", "Mood-aware responses"],
    color: "from-primary to-accent",
    videoPlaceholder: true,
  },
  {
    id: "meditation",
    title: "Guided Meditation & Breathing",
    description:
      "From box breathing to chakra meditation — explore 8 guided meditation types with beautiful animations, ambient soundscapes, and real-time progress tracking.",
    image: demoMeditation,
    icon: Wind,
    features: ["8 meditation styles", "Breathing visualizations", "Ambient soundscapes", "Session stats & streaks"],
    color: "from-violet-500 to-indigo-500",
    videoPlaceholder: true,
  },
];

const DemoSection = () => {
  const navigate = useNavigate();
  const [hoveredDemo, setHoveredDemo] = useState<string | null>(null);

  return (
    <section id="demos" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Play className="w-3 h-3 mr-1" /> Feature Demos
          </Badge>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            See It in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our core features that make mental wellness accessible, personal, and engaging.
          </p>
        </ScrollReveal>

        <div className="space-y-24">
          {demos.map((demo, index) => (
            <ScrollReveal
              key={demo.id}
              variant={index % 2 === 0 ? "left" : "right"}
            >
              <div
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 lg:gap-16 items-center`}
              >
                {/* Image / Video Preview */}
                <div
                  className="flex-1 w-full"
                  onMouseEnter={() => setHoveredDemo(demo.id)}
                  onMouseLeave={() => setHoveredDemo(null)}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-card group cursor-pointer border border-border/50">
                    <img
                      src={demo.image}
                      alt={`${demo.title} demo preview`}
                      className="w-full h-auto aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Play overlay */}
                    <div
                      className={`absolute inset-0 bg-foreground/30 flex items-center justify-center transition-opacity duration-300 ${
                        hoveredDemo === demo.id ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      <div
                        className={`w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-glow transition-transform duration-300 ${
                          hoveredDemo === demo.id ? "scale-110" : "scale-100"
                        }`}
                      >
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-card/80 backdrop-blur-sm text-foreground border-0 shadow-soft">
                        <demo.icon className="w-3 h-3 mr-1" />
                        Demo Preview
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 w-full space-y-6">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${demo.color} text-primary-foreground text-sm font-medium`}
                  >
                    <demo.icon className="w-4 h-4" />
                    {demo.title}
                  </div>

                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                    {demo.title}
                  </h3>

                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {demo.description}
                  </p>

                  <ul className="grid grid-cols-2 gap-3">
                    {demo.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="gradient-calm text-primary-foreground hover:opacity-90 shadow-soft"
                  >
                    Try It Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
