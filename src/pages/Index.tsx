import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ResourcesSection from "@/components/ResourcesSection";
import SelfCareSection from "@/components/SelfCareSection";
import ChatSection from "@/components/ChatSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ResourcesSection />
        <SelfCareSection />
        <ChatSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
