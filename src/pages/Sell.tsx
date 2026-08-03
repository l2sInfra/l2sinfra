import { useEffect } from "react";
import { m } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { SellerForm } from "@/components/landing/SellerForm";
import { applySEO } from "@/lib/seo";
import { ROUTE_META } from "@/lib/route-meta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    title: "We price it against what actually sold",
    body: "Not the asking price of the flat down the corridor — the transacted price of comparable units in your sector over the last six months. You see the comparables, so you can argue with the number rather than take it on trust.",
  },
  {
    title: "We prepare it properly",
    body: "Photography that shows the unit as it is, a listing written for a buyer who knows the corridor, and the paperwork checked before a buyer's lawyer finds a problem in it.",
  },
  {
    title: "We bring buyers, not footfall",
    body: "Qualified viewings from people who can actually transact at your price, arranged around you. You are not fielding calls from fifteen brokers and a dozen tyre-kickers.",
  },
  {
    title: "We run the negotiation",
    body: "Price, payment schedule, and the conditions that decide whether a deal closes or drags. One point of contact, through to registry.",
  },
];

const faqs = [
  {
    q: "What does it cost me?",
    a: "We are paid on completion, at a rate agreed in writing before we start work. Nothing is deducted or charged along the way, and you will know the figure before you commit to anything.",
  },
  {
    q: "How long does a sale usually take?",
    a: "It depends far more on the corridor and the price than on the effort behind it. An honestly priced unit on an established address moves quickly; an optimistically priced one on a corridor still filling up can sit for a long time. We will tell you which of those you have before you list.",
  },
  {
    q: "I'm an NRI. Can I sell without coming to India?",
    a: "In most cases, yes — through a properly executed power of attorney. The part that catches NRI sellers out is TDS: a buyer is obliged to withhold tax on the gross consideration, not on your gain, which can lock up a substantial sum for a year unless a lower-deduction certificate is obtained under section 197 beforehand. We will flag it early, because it is much harder to fix afterwards.",
  },
  {
    q: "Will you tell me if now is a bad time to sell?",
    a: "Yes. If the comparables say you would be selling into a soft patch on your corridor and you are not under pressure, that is what the note will say. We would rather advise you to wait than take an instruction we cannot deliver on.",
  },
  {
    q: "Do you handle rentals and leasing too?",
    a: "For commercial space, yes. For residential we take letting instructions selectively — ask us and we will tell you honestly whether we are the right people for it.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function Sell() {
  useEffect(() => {
    applySEO(ROUTE_META["/sell"]);
  }, []);

  return (
    <>
      {/* JSON.stringify does not escape </script>; these FAQs are a module
          constant, but escape anyway so a future CMS-backed version is safe. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />

      <main id="main" className="min-h-screen bg-background pt-24">
        {/* The seller's problem, stated plainly */}
        <section className="section-padding pb-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold-ink text-sm font-semibold tracking-[0.3em] uppercase mb-4">
              Selling in Gurgaon &amp; Delhi
            </p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              The number your neighbour quotes you{" "}
              <span className="text-gradient-gold">is not evidence.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Most Gurgaon flats are listed at the price of the most optimistic
              unit in the tower, sit for months, and eventually sell at a discount
              to what they were always worth. We price yours against what
              comparable units in your sector actually transacted for — and then
              we run the sale, so you are not fielding calls from fifteen brokers.
            </p>
          </div>
        </section>

        {/* How the work goes */}
        <section className="section-padding pt-0">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((step, i) => (
                <m.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-card border border-border rounded-2xl p-8"
                >
                  <span className="font-heading text-2xl font-bold text-gold-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-heading text-xl font-bold text-foreground mt-3 mb-3">
                    {step.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.body}</p>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why the corridor decides the price */}
        <section className="section-padding bg-secondary text-secondary-foreground">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl md:text-4xl font-bold mb-6">
              Two identical flats, a kilometre apart, are not worth the same
            </h2>
            <div className="space-y-4 text-secondary-foreground/80 leading-relaxed">
              <p>
                What a unit fetches on Golf Course Road is set by a finished
                market with a long resale record. On Dwarka Expressway it is set
                by how full the surrounding towers actually are. On Sohna Road it
                is set, more than anywhere, by which developer built it.
              </p>
              <p>
                A valuation that ignores which of those you are in is a guess with
                a decimal point. We work in these corridors and nowhere else,
                which is the entire reason we can price a unit in one of them.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section id="seller-enquiry" className="section-padding">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-4">
                Start with the number
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Tell us where the property is and we will send you what comparable
                units in that sector actually transacted for. No fee, no
                obligation, and no one will chase you afterwards if you decide the
                timing is wrong.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If the comparables say you should wait, we will say so. We would
                rather tell you that now than take an instruction we cannot
                deliver on.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <SellerForm />
            </div>
          </div>
        </section>

        {/* Objections */}
        <section className="section-padding bg-cream pt-0">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Questions sellers ask us
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`sell-faq-${i}`}
                  className="bg-card border border-border rounded-xl px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
