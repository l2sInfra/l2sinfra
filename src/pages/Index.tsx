import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { IntroSection } from "@/components/landing/IntroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { MarketsSection } from "@/components/landing/MarketsSection";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { FeaturedPropertiesSection } from "@/components/landing/FeaturedPropertiesSection";
import { WhyChooseSection } from "@/components/landing/WhyChooseSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { InsightsSection } from "@/components/landing/InsightsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { useEffect } from "react";
import { applySEO } from "@/lib/seo";

const Index = () => {
  useEffect(() => {
    applySEO({
      title: "L2S Infra - Luxury Real Estate Advisory in India | Premium Properties Gurgaon, Mumbai, Delhi",
      description:
        "India's premier luxury real estate advisory. L2S Infra curates premium residential, commercial, and farmhouse properties in Gurgaon, Mumbai, Delhi NCR, Bangalore for HNI investors and NRIs.",
      path: "/",
    });
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <ServicesSection />
        <MarketsSection />
        <PortfolioSection />
        <FeaturedPropertiesSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <HowItWorksSection />
        <InsightsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
