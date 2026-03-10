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

const Index = () => {
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
