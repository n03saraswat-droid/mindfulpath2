import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full gradient-calm flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold">MindfulPath</span>
            </div>
            <p className="text-background/70 mb-6 max-w-md">
              Your companion on the journey to mental wellness. We're here to support, educate, and empower you with AI-powered resources and guidance.
            </p>
            <p className="text-sm text-background/50">
              Remember: MindfulAI is not a replacement for professional mental health care. If you're in crisis, please seek professional help.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-background/70 hover:text-background transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#courses" className="text-background/70 hover:text-background transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="#resources" className="text-background/70 hover:text-background transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="/auth" className="text-background/70 hover:text-background transition-colors">
                  Sign In
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/50">
              © {new Date().getFullYear()} MindfulPath. Supporting mental health awareness.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-background/50 hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-background/50 hover:text-background transition-colors">
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
