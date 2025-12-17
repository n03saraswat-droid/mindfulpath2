import { useNavigate } from "react-router-dom";
import { ArrowDown, Sparkles, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToChat = () => {
    document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen gradient-hero flex items-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-serenity/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hope/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Mental Health Support</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-up text-balance" style={{ animationDelay: "0.1s" }}>
            Your Journey to{" "}
            <span className="text-primary">Mental Wellness</span>{" "}
            Starts Here
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up text-balance" style={{ animationDelay: "0.2s" }}>
            A safe, supportive space to explore mental health resources, practice self-care, and connect with our compassionate AI companion for guidance and support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button
              onClick={scrollToChat}
              size="lg"
              className="gradient-calm text-primary-foreground hover:opacity-90 transition-all shadow-soft px-8 py-6 text-lg"
            >
              Start a Conversation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 text-foreground hover:bg-primary/5 px-8 py-6 text-lg"
              onClick={() => document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Resources
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="bg-card/60 backdrop-blur-sm p-6 rounded-2xl shadow-card border border-border/50">
              <div className="text-4xl font-serif font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">AI Support Available</p>
            </div>
            <div className="bg-card/60 backdrop-blur-sm p-6 rounded-2xl shadow-card border border-border/50">
              <div className="text-4xl font-serif font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Private & Confidential</p>
            </div>
            <div className="bg-card/60 backdrop-blur-sm p-6 rounded-2xl shadow-card border border-border/50">
              <div className="text-4xl font-serif font-bold text-primary mb-2">∞</div>
              <p className="text-muted-foreground">Resources to Explore</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
