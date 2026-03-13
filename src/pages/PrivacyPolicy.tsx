import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => { document.title = "Privacy Policy | L2S Infra"; }, []);
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: March 2026</p>
          <div className="prose prose-sm prose-invert max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            <h2>1. Information We Collect</h2>
            <p>When you contact us through our website, we collect personal information including your name, email address, phone number, and details about your property requirements. We also collect non-personal information such as browser type, IP address, and pages visited.</p>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information you provide to:</p>
            <ul>
              <li>Respond to your enquiries and schedule consultations</li>
              <li>Share relevant property listings that match your requirements</li>
              <li>Send market updates and research reports (only if you opt in)</li>
              <li>Improve our website and services</li>
            </ul>
            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted partners (such as developers whose properties you express interest in) only with your explicit consent. We may disclose information if required by law.</p>
            <h2>4. Data Security</h2>
            <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. All data is stored on secure, encrypted servers.</p>
            <h2>5. Cookies</h2>
            <p>Our website may use cookies to enhance your experience. You can choose to disable cookies through your browser settings, though this may affect certain features of our website.</p>
            <h2>6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information held by us. To exercise these rights, please contact us at connect@l2sinfra.com.</p>
            <h2>7. Contact</h2>
            <p>For privacy-related queries, contact us at connect@l2sinfra.com or +91-9773740037.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
