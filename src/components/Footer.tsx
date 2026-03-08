import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full gradient-calm flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">MindfulPath</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your companion on the journey to mental wellness. We're here to support, educate, and empower you with AI-powered resources and guidance.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Remember: MindfulAI is not a replacement for professional mental health care. If you're in crisis, please seek professional help.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#courses" className="text-muted-foreground hover:text-foreground transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="#resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MindfulPath. Supporting mental health awareness.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
