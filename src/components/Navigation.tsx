import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Heart, LayoutDashboard, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = useCallback((id: string) => {
    setIsOpen(false);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  }, [location.pathname, navigate]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-calm flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">Mindful Path</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("home")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("courses")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection("resources")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Resources
            </button>
            <button
              onClick={() => scrollToSection("demos")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Demos
            </button>
            <button
              onClick={() => navigate("/team")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Our Team
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <Button
                onClick={() => navigate("/app")}
                size="sm"
                className="gradient-calm text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                size="sm"
                className="gradient-calm text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Get Started
              </Button>
            )}
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
                onClick={() => scrollToSection("courses")}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Courses
              </button>
              <button
                onClick={() => scrollToSection("resources")}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Resources
              </button>
              <button
                onClick={() => scrollToSection("demos")}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Demos
              </button>
              <button
                onClick={() => { navigate("/team"); setIsOpen(false); }}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Our Team
              </button>
              {user ? (
                <Button
                  onClick={() => { navigate("/app"); setIsOpen(false); }}
                  className="gradient-calm text-primary-foreground w-full"
                >
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => { navigate("/auth"); setIsOpen(false); }}
                  className="gradient-calm text-primary-foreground w-full"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
