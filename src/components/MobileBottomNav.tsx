import { LayoutDashboard, BarChart3, MessageCircle, Music, BookOpen, MoreHorizontal, X, Brain, Sparkles, Trophy, Users, Bookmark, Leaf, Wind, Sun, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface MobileBottomNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const primaryTabs = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "mood", label: "Mood", icon: BarChart3 },
  { id: "chat", label: "AI Chat", icon: MessageCircle },
  { id: "audio", label: "Audio", icon: Music },
  { id: "more", label: "More", icon: MoreHorizontal },
];

const moreItems = [
  { id: "emotion-engine", label: "Emotion Engine", icon: Brain },
  { id: "analytics", label: "Analytics", icon: Sparkles },
  { id: "xp", label: "XP & Medals", icon: Trophy },
  { id: "community", label: "Community", icon: Users },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "resources", label: "Resources", icon: Bookmark },
  { id: "self-care", label: "Self Care", icon: Leaf },
  { id: "meditation", label: "Meditation", icon: Wind },
  { id: "gratitude", label: "Gratitude", icon: Sun },
];

const MobileBottomNav = ({ activeSection, onSectionChange }: MobileBottomNavProps) => {
  const [showMore, setShowMore] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const isMoreActive = moreItems.some((item) => item.id === activeSection);

  const handleTabClick = (id: string) => {
    if (id === "more") {
      setShowMore((prev) => !prev);
    } else {
      setShowMore(false);
      onSectionChange(id);
    }
  };

  return (
    <>
      {/* More menu overlay */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-16 left-0 right-0 z-50 md:hidden rounded-t-2xl border-t border-border bg-card/95 backdrop-blur-xl p-4 pb-2 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-sm font-semibold text-foreground">More Features</span>
                <button onClick={() => setShowMore(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {moreItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium transition-all",
                        isActive
                          ? "gradient-calm text-primary-foreground shadow-soft"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="truncate w-full text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card/90 backdrop-blur-xl safe-bottom">
        <div className="flex items-center justify-around h-16 px-1">
          {primaryTabs.map((tab) => {
            const isActive = tab.id === "more" ? (isMoreActive || showMore) : activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium transition-colors relative",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isActive && tab.id !== "more" && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
