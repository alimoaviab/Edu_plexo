import { NavbarPremium } from "../components/landing/NavbarPremium";
import { Hero3D } from "../components/landing/Hero3D";
import { StatsSection } from "../components/landing/StatsSection";
import { FeaturesEcosystem } from "../components/landing/FeaturesEcosystem";
import { RoleBasedShowcase } from "../components/landing/RoleBasedShowcase";
import { AISection } from "../components/landing/AISection";
import { DashboardShowcase } from "../components/landing/DashboardShowcase";
import { PricingSection } from "../components/landing/PricingSection";
import { TestimonialSection } from "../components/landing/TestimonialSection";
import { FAQSection } from "../components/landing/FAQSection";
import { FinalCTA } from "../components/landing/FinalCTA";
import { FooterPremium } from "../components/landing/FooterPremium";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NavbarPremium />
      <main>
        <Hero3D />
        <StatsSection />
        <section id="features">
          <FeaturesEcosystem />
        </section>
        <section id="platform">
          <RoleBasedShowcase />
        </section>
        <AISection />
        <DashboardShowcase />
        <section id="pricing">
          <PricingSection />
        </section>
        <TestimonialSection />
        <section id="faq">
          <FAQSection />
        </section>
        <section id="demo">
          <FinalCTA />
        </section>
      </main>
      <FooterPremium />
    </div>
  );
}
