import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PortfolioSection />
        <ServicesSection />
        <PartnersSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
