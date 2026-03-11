import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ResourcesSection from "@/components/ResourcesSection";
import SelfCareSection from "@/components/SelfCareSection";
import MeditationSection from "@/components/MeditationSection";
import ChatSection from "@/components/ChatSection";
import CoursesSection from "@/components/CoursesSection";
import ShlokasSection from "@/components/ShlokasSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/app", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <CoursesSection />
        <ShlokasSection />
        <ResourcesSection />
        <SelfCareSection />
        <MeditationSection />
        <ChatSection />
        <ReviewsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
