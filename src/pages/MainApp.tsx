import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppSidebar from "@/components/AppSidebar";
import IntegratedDashboard from "@/components/IntegratedDashboard";
import IntegratedMoodTracker from "@/components/IntegratedMoodTracker";
import IntegratedChat from "@/components/IntegratedChat";
import EmotionEngine from "@/components/EmotionEngine";
import RealMoodAnalytics from "@/components/RealMoodAnalytics";
import AudioLibrary from "@/components/AudioLibrary";
import XPSystem from "@/components/XPSystem";
import CommunityForum from "@/components/CommunityForum";
import CoursesSection from "@/components/CoursesSection";
import ResourcesSection from "@/components/ResourcesSection";
import SelfCareSection from "@/components/SelfCareSection";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Lazy-load heavy pages
import { lazy, Suspense } from "react";
const IntegratedGratitude = lazy(() => import("@/components/IntegratedGratitude"));
const IntegratedCourses = lazy(() => import("@/components/IntegratedCourses"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
  </div>
);

const MainApp = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <IntegratedDashboard />;
      case "mood": return <IntegratedMoodTracker />;
      case "emotion-engine": return <EmotionEngine />;
      case "analytics": return <RealMoodAnalytics />;
      case "chat": return <IntegratedChat />;
      case "audio": return <AudioLibrary />;
      case "xp": return <XPSystem />;
      case "community": return <CommunityForum />;
      case "courses": return (
        <Suspense fallback={<LoadingSpinner />}>
          <IntegratedCourses />
        </Suspense>
      );
      case "resources": return <ResourcesSection />;
      case "gratitude": return (
        <Suspense fallback={<LoadingSpinner />}>
          <IntegratedGratitude />
        </Suspense>
      );
      default: return <IntegratedDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="min-h-screen"
      >
        <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default MainApp;
