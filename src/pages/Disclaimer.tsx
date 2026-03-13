import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useEffect } from "react";

export default function Disclaimer() {
  useEffect(() => { document.title = "Disclaimer | L2S Infra"; }, []);
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Disclaimer</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: March 2026</p>
          <div className="prose prose-sm prose-invert max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            <h2>General Disclaimer</h2>
            <p>The information contained on this website is for general informational purposes only. L2S Infra makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information, properties, services, or related graphics for any purpose.</p>
            <h2>Property Listings</h2>
            <p>Property details, prices, availability, and specifications listed on this website are indicative and subject to change without notice. All transactions are subject to formal agreement, site visits, and complete due diligence. Prices are exclusive of applicable taxes, registration charges, and other statutory levies unless stated otherwise.</p>
            <h2>Investment Returns</h2>
            <p>Any mention of potential investment returns, price appreciation, or rental yields on this website is based on historical data and market research. Past performance does not guarantee future results. Real estate investments carry inherent risks, and prospective investors should conduct independent due diligence.</p>
            <h2>Third-Party Links</h2>
            <p>This website may contain links to third-party websites. L2S Infra has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.</p>
            <h2>NRI Advisory</h2>
            <p>Information regarding NRI investments, FEMA regulations, and taxation is provided for general guidance. Regulations are subject to change. NRIs should consult qualified legal and financial advisors for personalised advice.</p>
            <h2>Contact</h2>
            <p>If you have any questions about this disclaimer, please contact us at connect@l2sinfra.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
