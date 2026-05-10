import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DestinationsSection from "@/components/DestinationsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DestinationsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
