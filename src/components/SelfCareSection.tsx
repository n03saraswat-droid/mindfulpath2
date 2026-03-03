import { useState } from "react";
import { Wind, Leaf, Moon, Sun, Coffee, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ScrollReveal from "@/components/ScrollReveal";

const breathingExercise = {
  inhale: 4,
  hold: 7,
  exhale: 8,
};

const selfCareTips = [
  {
    icon: Moon,
    title: "Quality Sleep",
    description: "Aim for 7-9 hours of sleep. Create a calming bedtime routine and limit screen time before bed.",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: Sun,
    title: "Morning Routine",
    description: "Start your day with intention. Try journaling, stretching, or a few minutes of mindfulness.",
    color: "bg-warmth text-warmth-foreground",
  },
  {
    icon: Coffee,
    title: "Mindful Breaks",
    description: "Take regular breaks throughout the day. Step away from screens and practice being present.",
    color: "bg-serenity text-serenity-foreground",
  },
  {
    icon: Dumbbell,
    title: "Move Your Body",
    description: "Even a 10-minute walk can boost your mood. Find movement that brings you joy.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Leaf,
    title: "Connect with Nature",
    description: "Spend time outdoors when possible. Nature has a calming effect on the mind.",
    color: "bg-hope/20 text-primary",
  },
  {
    icon: Wind,
    title: "Breathing Exercises",
    description: "Deep breathing activates your relaxation response. Try our guided breathing exercise below.",
    color: "bg-calm/10 text-calm",
  },
];

const SelfCareSection = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [counter, setCounter] = useState(0);

  const startBreathingExercise = () => {
    setIsBreathing(true);
    setBreathPhase("inhale");
    setCounter(breathingExercise.inhale);

    let phase: "inhale" | "hold" | "exhale" = "inhale";
    let count = breathingExercise.inhale;

    const interval = setInterval(() => {
      count--;
      setCounter(count);

      if (count === 0) {
        if (phase === "inhale") {
          phase = "hold";
          count = breathingExercise.hold;
          setBreathPhase("hold");
        } else if (phase === "hold") {
          phase = "exhale";
          count = breathingExercise.exhale;
          setBreathPhase("exhale");
        } else {
          clearInterval(interval);
          setIsBreathing(false);
          setBreathPhase("inhale");
          setCounter(0);
        }
        setCounter(count);
      }
    }, 1000);
  };

  return (
    <section id="self-care" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Self-Care Practices
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Small daily practices can make a big difference in your mental well-being.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {selfCareTips.map((tip, index) => (
            <ScrollReveal key={tip.title} delay={index * 80} variant="up">
            <Card
              className="bg-card border-border/50 hover:shadow-card transition-all duration-300 h-full"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${tip.color} flex items-center justify-center mb-4`}>
                  <tip.icon className="w-6 h-6" />
                </div>
                <CardTitle className="font-serif text-xl">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{tip.description}</CardDescription>
              </CardContent>
            </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Breathing Exercise */}
        <ScrollReveal variant="scale">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 to-serenity/20 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl">4-7-8 Breathing Exercise</CardTitle>
              <CardDescription className="text-base">
                This technique can help reduce anxiety and promote relaxation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-8">
                <div
                  className={`absolute inset-0 rounded-full gradient-calm transition-all duration-1000 ${
                    isBreathing
                      ? breathPhase === "inhale"
                        ? "scale-100 opacity-100"
                        : breathPhase === "hold"
                        ? "scale-100 opacity-80"
                        : "scale-75 opacity-60"
                      : "scale-75 opacity-40"
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    {isBreathing ? (
                      <>
                        <div className="text-4xl font-serif font-bold text-primary-foreground mb-2">
                          {counter}
                        </div>
                        <div className="text-sm font-medium text-primary-foreground/80 capitalize">
                          {breathPhase}
                        </div>
                      </>
                    ) : (
                      <Wind className="w-12 h-12 text-primary-foreground/60" />
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-muted-foreground mb-4">
                  <strong>Inhale</strong> for 4 seconds, <strong>hold</strong> for 7 seconds,{" "}
                  <strong>exhale</strong> for 8 seconds.
                </p>
              </div>

              <Button
                onClick={startBreathingExercise}
                disabled={isBreathing}
                size="lg"
                className="gradient-calm text-primary-foreground hover:opacity-90"
              >
                {isBreathing ? "Breathing..." : "Start Exercise"}
              </Button>
            </CardContent>
          </Card>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SelfCareSection;
