import { useState } from "react";
import { Menu, X, Heart, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-calm flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">MindfulPath</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("resources")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Resources
            </button>
            <button
              onClick={() => scrollToSection("self-care")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Self-Care
            </button>
            <button
              onClick={() => scrollToSection("chat")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              AI Support
            </button>
            <Button
              onClick={() => scrollToSection("chat")}
              className="gradient-calm text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Talk to MindfulAI
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("resources")}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Resources
              </button>
              <button
                onClick={() => scrollToSection("self-care")}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Self-Care
              </button>
              <button
                onClick={() => scrollToSection("chat")}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                AI Support
              </button>
              <Button
                onClick={() => scrollToSection("chat")}
                className="gradient-calm text-primary-foreground w-full"
              >
                Talk to MindfulAI
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
