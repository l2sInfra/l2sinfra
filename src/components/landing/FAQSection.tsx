import { m } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Which areas do you cover?",
    a: "Gurgaon and Delhi. Within Gurgaon that means Golf Course Road, Golf Course Extension, Dwarka Expressway, Sohna Road and South Gurgaon, and New Gurgaon; in Delhi, chiefly South Delhi and Lutyens. We do not operate in other cities, and we will say so rather than take the mandate.",
  },
  {
    q: "Do you handle selling as well as buying?",
    a: "Yes — it is half the business. We price your unit against what comparable flats in your sector actually transacted for, handle photography and listing, bring qualified buyers rather than curious ones, and run the negotiation and paperwork through to registry.",
  },
  {
    q: "What do your builder partnerships get me?",
    a: "Direct relationships with the premium developers building these corridors mean our buyers see pre-launch allocations and held-back inventory before it is advertised, usually at launch pricing rather than the resale premium that follows. It also means we can tell you how a developer's last three projects actually performed on delivery.",
  },
  {
    q: "Do you work with NRI clients?",
    a: "Yes, and it is a large part of what we do — buying and selling. Video walkthroughs of the specific unit rather than the show flat, FEMA and repatriation questions settled before you commit, power-of-attorney set up correctly, and progress reported to you directly instead of through a relative doing you a favour.",
  },
  {
    q: "What does working with you look like?",
    a: "A first conversation about what you are trying to achieve and over what horizon. Then a written view on the corridors that fit and a shortlist — or, if you are selling, a price and a plan. Then viewings, due diligence, negotiation and documentation through to registry.",
  },
  {
    q: "Is now a good time to buy in Gurgaon?",
    a: "It depends on the corridor and the horizon, which is unsatisfying but true. An established Golf Course Road resale and a New Gurgaon pre-launch are not the same purchase and do not respond to the same conditions. We publish our corridor research so you can see the reasoning rather than take a view on faith.",
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
    <section id="faq" className="section-padding bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold-ink text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Questions
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground">
            Your Questions, <span className="text-gradient-gold">Answered</span>
          </h2>
        </m.div>

        <m.div
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
                <AccordionTrigger className="text-left font-heading text-lg font-semibold text-card-foreground hover:text-gold-ink transition-colors py-6 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </m.div>
      </div>
    </section>
  );
}
