import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const budgetRanges = [
  "₹2 - 5 Cr",
  "₹5 - 10 Cr",
  "₹10 - 25 Cr",
  "₹25 - 50 Cr",
  "₹50 Cr+",
];

const propertyInterests = [
  "Luxury Residential",
  "Premium Commercial",
  "Lands & Plots",
  "Farm Houses",
  "Investment Portfolio",
];

const locations = [
  "Mumbai",
  "Delhi NCR",
  "Bangalore",
  "Pune",
  "Hyderabad",
  "Goa",
];

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the privacy policy.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you! Our team will contact you within 24 hours.");
      (e.target as HTMLFormElement).reset();
      setAgreed(false);
    }, 1500);
  };

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
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Contact Us
          </p>
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
              <input
                type="text"
                placeholder="Full Name *"
                required
                maxLength={100}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                maxLength={255}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <input
              type="tel"
              placeholder="Phone (with country code) *"
              required
              maxLength={20}
              className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                required
                className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Property Interest *</option>
                {propertyInterests.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                required
                className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Budget Range *</option>
                {budgetRanges.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <select
              className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Preferred Location</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <textarea
              placeholder="Tell us about your requirements..."
              rows={4}
              maxLength={1000}
              className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 accent-primary"
              />
              I agree to the privacy policy and consent to being contacted regarding my inquiry.
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
                  <a href="tel:+919205505600" className="text-muted-foreground text-sm hover:text-primary transition-colors">+91-9205505600</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle size={20} className="text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">WhatsApp</p>
                  <a
                    href="https://wa.me/919205505600"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    +91-9205505600
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

            {/* Map */}
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
