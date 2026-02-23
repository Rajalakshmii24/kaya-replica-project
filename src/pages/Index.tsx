import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ExpertsSection from "@/components/ExpertsSection";
import PlansSection from "@/components/PlansSection";
import LuxurySection from "@/components/LuxurySection";
import GallerySection from "@/components/GallerySection";
import LifestyleSection from "@/components/LifestyleSection";
import ScheduleSection from "@/components/ScheduleSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ExpertsSection />
      <PlansSection />
      <LuxurySection />
      <GallerySection />
      <LifestyleSection />
      <ScheduleSection />
      <ContactSection />
    </div>
  );
};

export default Index;
