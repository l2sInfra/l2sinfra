import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What makes AetherEstate different from other real estate agencies?",
    a: "We focus exclusively on premium and ultra-luxury segments with direct Tier-1 developer partnerships. Our white-glove service covers everything from property discovery to post-purchase management, ensuring a frictionless experience.",
  },
  {
    q: "Do you assist NRI clients with property purchases in India?",
    a: "Absolutely. Our dedicated NRI Desk handles virtual site tours, legal documentation, power-of-attorney processes, FEMA compliance, and seamless cross-border transactions. We've served 50+ NRI clients across 12 countries.",
  },
  {
    q: "What is the minimum investment range for your properties?",
    a: "Our residential portfolio starts at ₹2 Crore, with ultra-luxury options going up to ₹100 Crore+. Commercial assets start at ₹5 Crore. We also offer fractional investment opportunities starting at ₹25 Lakhs.",
  },
  {
    q: "Which cities do you operate in?",
    a: "We have a strong presence in Mumbai, Delhi NCR, Bangalore, Hyderabad, Pune, and Goa. We're expanding to Chennai and Ahmedabad — emerging high-growth corridors.",
  },
  {
    q: "How do you ensure the best pricing for clients?",
    a: "Our direct developer relationships and volume-based partnerships allow us to negotiate exclusive pricing, pre-launch access, and preferential payment plans that aren't available through other channels.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export function FAQSection() {
  return (
    <section id="insights" className="section-padding bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Frequently Asked
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground">
            Your Questions, <span className="text-gradient-gold">Answered</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left font-heading text-lg font-semibold text-card-foreground hover:text-primary transition-colors py-6 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
