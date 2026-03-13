import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useEffect } from "react";

export default function Terms() {
  useEffect(() => { document.title = "Terms of Service | L2S Infra"; }, []);
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: March 2026</p>
          <div className="prose prose-sm prose-invert max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using the L2S Infra website (l2sinfra.com), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
            <h2>2. Services</h2>
            <p>L2S Infra provides real estate advisory services for luxury residential, commercial, and land properties across India. Information on this website is for general guidance only and does not constitute a binding offer or agreement.</p>
            <h2>3. Property Information</h2>
            <p>While we strive to maintain accurate and up-to-date property listings, information including pricing, availability, and specifications is subject to change without notice. All transactions are subject to formal agreement and documentation.</p>
            <h2>4. No Professional Advice</h2>
            <p>Information provided on this website does not constitute legal, financial, or investment advice. We recommend consulting with qualified legal and financial professionals before making any property investment decisions.</p>
            <h2>5. Intellectual Property</h2>
            <p>All content on this website, including text, images, and design, is the property of L2S Infra or its content suppliers and is protected by applicable intellectual property laws.</p>
            <h2>6. Limitation of Liability</h2>
            <p>L2S Infra shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or reliance on information provided herein.</p>
            <h2>7. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Gurgaon, Haryana.</p>
            <h2>8. Contact</h2>
            <p>For queries regarding these terms, contact us at connect@l2sinfra.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
