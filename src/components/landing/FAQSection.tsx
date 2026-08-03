import { motion } from "framer-motion";
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
    q: "What makes an advisor different from a broker?",
    a: "A broker is paid to close the transaction in front of them. Our value is in the recommendation, which includes telling you not to buy — so every shortlist comes with the corridor comparables, the developer's delivery record and the downside case written down, and you are free to disagree with it.",
  },
  {
    q: "Do you work with NRI buyers?",
    a: "Yes, and it is a large part of what we do. Video walkthroughs of the specific unit rather than the show flat, FEMA and repatriation questions settled before you commit, power-of-attorney set up correctly, and construction progress reported to you directly instead of through a relative doing you a favour.",
  },
  {
    q: "What does an engagement look like?",
    a: "A first conversation about what you are trying to achieve and over what horizon. Then a written corridor view and a shortlist, usually within a fortnight. Then site visits, due diligence on anything you are serious about, negotiation, and documentation through to registry. You can stop at any stage.",
  },
  {
    q: "How do you get paid?",
    a: "Ask us directly and we will set it out in writing before you engage us — including anything we receive from a developer on a transaction. You should know how any advisor is paid before you take their advice, from us or from anyone else.",
  },
  {
    q: "Is now a good time to buy in Gurgaon?",
    a: "It depends entirely on the corridor and the horizon, which is an unsatisfying answer but the true one. An established Golf Course Road resale and a New Gurgaon pre-launch are not the same investment and do not respond to the same conditions. We publish our corridor research so you can see the reasoning rather than take a view on faith.",
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
            Questions
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
