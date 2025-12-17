import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ResourcesSection from "@/components/ResourcesSection";
import SelfCareSection from "@/components/SelfCareSection";
import MeditationSection from "@/components/MeditationSection";
import ChatSection from "@/components/ChatSection";
import CoursesSection from "@/components/CoursesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <CoursesSection />
        <ResourcesSection />
        <SelfCareSection />
        <MeditationSection />
        <ChatSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
