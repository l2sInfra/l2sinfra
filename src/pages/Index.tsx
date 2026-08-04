import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { IntroSection } from "@/components/landing/IntroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { MarketsSection } from "@/components/landing/MarketsSection";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { FeaturedPropertiesSection } from "@/components/landing/FeaturedPropertiesSection";
import { WhyChooseSection } from "@/components/landing/WhyChooseSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { SellerSection } from "@/components/landing/SellerSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { InsightsSection } from "@/components/landing/InsightsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { useEffect } from "react";
import { applySEO } from "@/lib/seo";
import { ROUTE_META } from "@/lib/route-meta";

const Index = () => {
  useEffect(() => {
    applySEO(ROUTE_META["/"]);
  }, []);

  return (
    <>
      <Navbar />
      <main id="main">
        <HeroSection />
        <IntroSection />
        <ServicesSection />
        <MarketsSection />
        <PortfolioSection />
        <FeaturedPropertiesSection />
        <WhyChooseSection />
        <PartnersSection />
        <SellerSection />
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
