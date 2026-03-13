import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import emailjs, { init } from "@emailjs/browser";

const budgetRanges = ["₹2 – 5 Cr", "₹5 – 10 Cr", "₹10 – 25 Cr", "₹25 – 50 Cr", "₹50 Cr+"];
const propertyInterests = ["Luxury Residential", "Premium Commercial", "Lands & Plots", "Farm Houses", "Investment Portfolio"];
const locations = ["Mumbai", "Delhi NCR", "Bangalore", "Pune", "Hyderabad", "Goa", "Gurgaon"];

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
  const [form, setForm] = useState<FormData>(empty);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error("Please agree to the privacy policy."); return; }
    if (!form.property_interest || !form.budget_range) { toast.error("Please select property interest and budget range."); return; }
    setLoading(true);

    try {
      // 1. Save to Supabase (admin panel + CRM)
      const { error } = await supabase.from("leads").insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        property_interest: form.property_interest,
        budget_range: form.budget_range,
        preferred_location: form.preferred_location || null,
        message: form.message || null,
        status: "new",
        source: "website",
      });

      if (error) {
        console.error("Supabase error:", error);
      }

      // 2. Send email notification via EmailJS
      try {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (serviceId && templateId && publicKey) {
          init(publicKey);
          await emailjs.send(serviceId, templateId, {
            from_name: form.full_name,
            from_email: form.email,
            phone: form.phone,
            property_interest: form.property_interest,
            budget_range: form.budget_range,
            preferred_location: form.preferred_location || "Not specified",
            message: form.message || "No message provided",
          });
        }
      } catch (emailErr) {
        console.error("EmailJS error:", emailErr);
      }

      toast.success("Thank you! Our advisory team will contact you within 24 hours.");
      setForm(empty);
      setAgreed(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please call us directly at +91-9773740037.");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">Contact Us</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Begin Your Luxury{" "}
            <span className="text-gradient-gold">Property Journey</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name *" required maxLength={100} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} className={inp} />
              <input type="email" placeholder="Email Address *" required maxLength={255} value={form.email} onChange={(e) => set("email", e.target.value)} className={inp} />
            </div>
            <input type="tel" placeholder="Phone (with country code) *" required maxLength={20} value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inp} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select required value={form.property_interest} onChange={(e) => set("property_interest", e.target.value)} className={inp}>
                <option value="">Property Interest *</option>
                {propertyInterests.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select required value={form.budget_range} onChange={(e) => set("budget_range", e.target.value)} className={inp}>
                <option value="">Budget Range *</option>
                {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <select value={form.preferred_location} onChange={(e) => set("preferred_location", e.target.value)} className={inp}>
              <option value="">Preferred Location</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <textarea
              placeholder="Tell us about your requirements..."
              rows={4}
              maxLength={1000}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              className={`${inp} resize-none`}
            />
            <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 accent-primary" />
              I agree to the{" "}
              <a href="/privacy-policy" target="_blank" className="text-primary hover:underline">privacy policy</a>
              {" "}and consent to being contacted regarding my inquiry.
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-sm hover:bg-gold-dark transition-colors disabled:opacity-50 min-h-[44px]"
            >
              {loading ? "Submitting..." : "Schedule Consultation"}
            </button>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Office Address</p>
                  <p className="text-muted-foreground text-sm">Bani City Centre, Sector 63, Gurgaon, Haryana, India</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={20} className="text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Phone</p>
                  <a href="tel:+919773740037" className="text-muted-foreground text-sm hover:text-primary transition-colors">+91-9773740037</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle size={20} className="text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">WhatsApp</p>
                  <a href="https://wa.me/919773740037" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    +91-9773740037
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={20} className="text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <a href="mailto:connect@l2sinfra.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">connect@l2sinfra.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={20} className="text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Business Hours</p>
                  <p className="text-muted-foreground text-sm">Mon – Sat: 10:00 AM – 7:00 PM</p>
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
