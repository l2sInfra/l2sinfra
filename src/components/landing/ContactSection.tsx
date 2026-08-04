import { m } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useSiteContact, whatsappLink } from "@/lib/site-contact";

const budgetRanges = ["₹2 – 5 Cr", "₹5 – 10 Cr", "₹10 – 25 Cr", "₹25 – 50 Cr", "₹50 Cr+"];
const propertyInterests = ["Luxury Residential", "Premium Commercial", "Lands & Plots", "Farm Houses", "Investment Portfolio"];
const locations = [
  "Gurgaon — Golf Course Road",
  "Gurgaon — Golf Course Extension",
  "Gurgaon — Dwarka Expressway",
  "Gurgaon — Sohna Road",
  "Gurgaon — New Gurgaon",
  "Delhi",
];

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  property_interest: string;
  budget_range: string;
  preferred_location: string;
  message: string;
}

const empty: FormData = {
  full_name: "", email: "", phone: "",
  property_interest: "", budget_range: "",
  preferred_location: "", message: "",
};

export function ContactSection() {
  const contact = useSiteContact();
  // Property pages link here with ?property=<title>, so an enquiry records the
  // listing that prompted it instead of arriving as an anonymous form fill.
  const [searchParams] = useSearchParams();
  const aboutProperty = searchParams.get("property")?.slice(0, 120) || "";
  const [form, setForm] = useState<FormData>(empty);
  const [agreed, setAgreed] = useState(false);
  // Honeypot — hidden from people, filled by bots. See send-lead-email.
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    if (aboutProperty) setForm((prev) => ({ ...prev, property_interest: "Specific listing" }));
  }, [aboutProperty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error("Please agree to the privacy policy."); return; }
    if (!form.property_interest || !form.budget_range) { toast.error("Please select property interest and budget range."); return; }
    setLoading(true);

    // 1. Save to Supabase
    const { error: supabaseError } = await supabase.from("leads").insert({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      property_interest: aboutProperty
        ? `Enquiry — ${aboutProperty}`
        : form.property_interest,
      budget_range: form.budget_range,
      preferred_location: form.preferred_location || null,
      message: form.message || null,
      // Explicit rather than relying on the column default, so the CRM never
      // has to infer which side of the deal an enquiry came from.
      enquiry_type: "buy",
      status: "new",
      source: "website",
    });

    // The saved row is the record of truth. If it didn't save, say so and keep
    // what they typed — never tell someone we'll be in touch when we have
    // nothing to be in touch with.
    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      setLoading(false);
      toast.error(
        `We couldn't send that just now. Please call or WhatsApp us on ${contact.phoneDisplay} and we'll pick it up straight away.`,
        { duration: 10000 },
      );
      return;
    }

    // 2. Send email via Supabase Edge Function + Resend.
    // Fire-and-forget on purpose: the lead is already saved, so a failed
    // notification must not read as a failed submission.
    supabase.functions.invoke("send-lead-email", {
      body: {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        property_interest: aboutProperty
          ? `Enquiry — ${aboutProperty}`
          : form.property_interest,
        budget_range: form.budget_range,
        preferred_location: form.preferred_location || "",
        message: form.message || "",
        company,
      },
    }).catch((err) => console.error("Email function error:", err));

    toast.success("Thank you — we will be in touch within 24 hours.");
    setForm(empty);
    setAgreed(false);
    setLoading(false);
  };

  const inp = "w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1";
  // Placeholder-as-label fails WCAG 1.3.1 and 3.3.2 — it vanishes the moment
  // someone types, taking the required marker with it. And <select> takes no
  // placeholder at all, so those three had no accessible name whatsoever.
  const req = <span className="text-gold-ink" aria-hidden="true"> *</span>;
  const lbl = "block text-sm font-medium text-foreground mb-2";

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold-ink text-sm font-semibold tracking-[0.3em] uppercase mb-4">Contact Us</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Begin Your Luxury{" "}
            <span className="text-gradient-gold">Property Journey</span>
          </h2>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <m.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            {aboutProperty && (
              <div className="bg-muted border border-border rounded-lg px-4 py-3 text-sm">
                <span className="text-muted-foreground">Enquiring about </span>
                <span className="text-foreground font-medium">{aboutProperty}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="c-name" className={lbl}>Full name{req}</label>
                <input id="c-name" type="text" required autoComplete="name" maxLength={100} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} className={inp} />
              </div>
              <div>
                <label htmlFor="c-email" className={lbl}>Email address{req}</label>
                <input id="c-email" type="email" required autoComplete="email" maxLength={255} value={form.email} onChange={(e) => set("email", e.target.value)} className={inp} />
              </div>
            </div>
            <div>
              <label htmlFor="c-phone" className={lbl}>Phone, with country code{req}</label>
              <input id="c-phone" type="tel" required autoComplete="tel" maxLength={20} value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inp} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="c-interest" className={lbl}>What are you looking for?{req}</label>
                <select id="c-interest" required value={form.property_interest} onChange={(e) => set("property_interest", e.target.value)} className={inp}>
                  <option value="">Please choose</option>
                  {aboutProperty && <option value="Specific listing">This listing</option>}
                  {propertyInterests.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <p className="text-muted-foreground text-xs mt-2">
                  Selling instead?{" "}
                  <Link to="/sell" className="text-gold-ink hover:underline">
                    Use the seller form
                  </Link>{" "}
                  — we won't ask you for a budget.
                </p>
              </div>
              <div>
                <label htmlFor="c-budget" className={lbl}>Budget range{req}</label>
                <select id="c-budget" required value={form.budget_range} onChange={(e) => set("budget_range", e.target.value)} className={inp}>
                  <option value="">Please choose</option>
                  {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="c-location" className={lbl}>Preferred location</label>
              <select id="c-location" value={form.preferred_location} onChange={(e) => set("preferred_location", e.target.value)} className={inp}>
                <option value="">No preference yet</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {/* Honeypot. Hidden from assistive tech and from sighted users. */}
            <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
              <label htmlFor="company">Company (leave blank)</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="c-message" className={lbl}>Anything we should know</label>
              <textarea
                id="c-message"
                rows={4}
                maxLength={1000}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                className={`${inp} resize-none`}
              />
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                id="consent"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 accent-primary w-4 h-4"
              />
              <label htmlFor="consent" className="cursor-pointer">
                I'd like L2S Infra to contact me about this enquiry. We don't sell
                or share your details.
              </label>
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-ink hover:underline shrink-0"
              >
                Privacy policy
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 min-h-[44px]"
            >
              {loading ? "Submitting..." : "Schedule Consultation"}
            </button>
          </m.form>

          {/* Contact Info */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-gold-ink mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Office Address</p>
                  <p className="text-muted-foreground text-sm">{contact.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={20} className="text-gold-ink mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Phone</p>
                  <a href={`tel:${contact.phoneE164}`} className="text-muted-foreground text-sm hover:text-gold-ink transition-colors">{contact.phoneDisplay}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle size={20} className="text-gold-ink mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">WhatsApp</p>
                  <a href={whatsappLink(undefined, contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-gold-ink transition-colors">
                    {contact.phoneDisplay}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={20} className="text-gold-ink mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-muted-foreground text-sm hover:text-gold-ink transition-colors">{contact.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={20} className="text-gold-ink mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Business Hours</p>
                  <p className="text-muted-foreground text-sm">{contact.hours}</p>
                  <p className="text-muted-foreground text-sm">Sunday: By Appointment</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-border h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.2!2d77.07!3d28.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBani+City+Centre+Sector+63+Gurgaon!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="L2S Infra Office Location - Bani City Centre, Sector 63, Gurgaon"
              />
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
