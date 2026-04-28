import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import IntegratedDashboard from "@/components/IntegratedDashboard";
import IntegratedMoodTracker from "@/components/IntegratedMoodTracker";
import IntegratedChat from "@/components/IntegratedChat";
import EmotionEngine from "@/components/EmotionEngine";
import RealMoodAnalytics from "@/components/RealMoodAnalytics";
import AudioLibrary from "@/components/AudioLibrary";
import XPSystem from "@/components/XPSystem";
import CommunityForum from "@/components/CommunityForum";
import ResourcesSection from "@/components/ResourcesSection";
import SelfCareSection from "@/components/SelfCareSection";
import MeditationSection from "@/components/MeditationSection";
import { motion, AnimatePresence } from "framer-motion";

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => { window.scrollTo(0, 0); }, [activeSection]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

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
      case "self-care": return <SelfCareSection />;
      case "meditation": return <MeditationSection />;
      case "gratitude": return (
        <Suspense fallback={<LoadingSpinner />}>
          <IntegratedGratitude />
        </Suspense>
      );
      default: return <IntegratedDashboard />;
    }
  };

  return (
    <div className="min-h-screen relative gradient-hero overflow-hidden">
      {/* Decorative ambient blurs — same language as the landing hero */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-10 -left-24 w-[26rem] h-[26rem] bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-24 w-[30rem] h-[30rem] bg-accent/25 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute bottom-10 left-1/4 w-[24rem] h-[24rem] bg-primary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[22rem] bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "2s" }} />
      </div>

      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <AppSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile bottom nav — hidden on desktop */}
      <MobileBottomNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <motion.main
        initial={false}
        animate={{ marginLeft: typeof window !== "undefined" && window.innerWidth >= 768 ? (sidebarCollapsed ? 72 : 260) : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="min-h-screen pb-20 md:pb-0 relative z-10"
      >
        <div className="container mx-auto px-4 md:px-8 py-6 md:py-8 max-w-6xl">
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
