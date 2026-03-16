import { useNavigate } from "react-router-dom";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import heroMeditation from "@/assets/hero-meditation.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section id="home" className="min-h-screen relative flex items-center overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src={heroMeditation}
          alt="Serene meditation in nature"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40 dark:from-background/98 dark:via-background/80 dark:to-background/50" />
      </div>

      {/* Decorative blurs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm text-primary px-4 py-2 rounded-full mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Mental Health Support</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-up text-balance" style={{ animationDelay: "0.1s" }}>
            Your Journey to{" "}
            <span className="text-primary">Mental Wellness</span>{" "}
            Starts Here
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl animate-fade-up text-balance" style={{ animationDelay: "0.2s" }}>
            A safe, supportive space to explore mental health resources, practice self-care, and connect with our compassionate AI companion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button
              onClick={() => navigate(user ? "/app" : "/auth")}
              size="lg"
              className="gradient-calm text-primary-foreground hover:opacity-90 transition-all shadow-soft px-8 py-6 text-lg"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 text-foreground hover:bg-primary/5 px-8 py-6 text-lg backdrop-blur-sm"
              onClick={() => document.getElementById("demos")?.scrollIntoView({ behavior: "smooth" })}
            >
              Watch Demos
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-16 flex flex-wrap gap-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "24/7", label: "AI Support" },
              { value: "100%", label: "Private & Safe" },
              { value: "∞", label: "Free Resources" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-serif font-bold text-primary">{stat.value}</div>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default HeroSection;
