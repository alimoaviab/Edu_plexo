import { Navbar } from "../components/landing/Navbar";
import { HeroSection } from "../components/landing/HeroSection";
import { TrustSection } from "../components/landing/TrustSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { DashboardShowcase } from "../components/landing/DashboardShowcase";
import { WhyChooseUsSection } from "../components/landing/WhyChooseUsSection";
import { TestimonialSection } from "../components/landing/TestimonialSection";
import { MobileExperienceSection } from "../components/landing/MobileExperienceSection";
import { CtaSection } from "../components/landing/CtaSection";
import { Footer } from "../components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <DashboardShowcase />
        <WhyChooseUsSection />
        <TestimonialSection />
        <MobileExperienceSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
