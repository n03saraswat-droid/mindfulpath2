import { Heart, LayoutDashboard, BarChart3, Brain, Music, Trophy, MessageCircle, Users, BookOpen, Bookmark, Sun, Moon, Sparkles, LogOut, LogIn, ChevronLeft, ChevronRight, Wind, Leaf, Medal } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { id: "mood", label: "Mood Tracker", icon: BarChart3, group: "main" },
  { id: "emotion-engine", label: "Emotion Engine", icon: Brain, group: "main" },
  { id: "analytics", label: "Mood Analytics", icon: Sparkles, group: "main" },
  { id: "chat", label: "AI Chat", icon: MessageCircle, group: "engage" },
  { id: "audio", label: "Audio Library", icon: Music, group: "engage" },
  { id: "xp", label: "XP & Medals", icon: Trophy, group: "engage" },
  { id: "community", label: "Community", icon: Users, group: "engage" },
  { id: "courses", label: "Courses", icon: BookOpen, group: "learn" },
  { id: "resources", label: "Resources", icon: Bookmark, group: "learn" },
  { id: "self-care", label: "Self Care", icon: Leaf, group: "learn" },
  { id: "meditation", label: "Meditation", icon: Wind, group: "learn" },
  { id: "gratitude", label: "Gratitude", icon: Sun, group: "learn" },
];

const groups = [
  { id: "main", label: "Core" },
  { id: "engage", label: "Engage" },
  { id: "learn", label: "Learn" },
];

const AppSidebar = ({ activeSection, onSectionChange, collapsed, onToggleCollapse }: AppSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r border-white/10"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(24px) saturate(1.8)",
        WebkitBackdropFilter: "blur(24px) saturate(1.8)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 4px 0 30px rgba(0,0,0,0.08)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl gradient-calm flex items-center justify-center flex-shrink-0 shadow-glow">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-serif text-lg font-semibold text-foreground whitespace-nowrap"
            >
              Mindful Path
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-thin">
        {groups.map((group) => (
          <div key={group.id}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-3 mb-2"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {navItems
                .filter((item) => item.group === group.id)
                .map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-xl gradient-calm shadow-soft"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <item.icon className={cn("w-5 h-5 flex-shrink-0 relative z-10", isActive && "drop-shadow-sm")} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            className="relative z-10 whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {user ? (
          <button
            onClick={() => { signOut(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary hover:bg-primary/10 transition-colors"
          >
            <LogIn className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sign In</span>}
          </button>
        )}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
