import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useSiteContact, whatsappLink } from "@/lib/site-contact";

const CORRIDORS = [
  "Golf Course Road",
  "Golf Course Extension Road",
  "Dwarka Expressway",
  "Sohna Road / South Gurgaon",
  "New Gurgaon",
  "Delhi",
  "Somewhere else in NCR",
];

const TIMELINES = [
  "As soon as I can get the right price",
  "Within 3 months",
  "Within 6–12 months",
  "Just want to know what it's worth",
];

interface SellerFormData {
  full_name: string;
  email: string;
  phone: string;
  corridor: string;
  project: string;
  configuration: string;
  timeline: string;
  message: string;
}

const empty: SellerFormData = {
  full_name: "",
  email: "",
  phone: "",
  corridor: "",
  project: "",
  configuration: "",
  timeline: "",
  message: "",
};

/**
 * A seller has a property, not a budget.
 *
 * The buyer form gates on budget disclosure, which a seller cannot answer and
 * which screened out half the business. Three fields are required here — name,
 * phone, corridor — and everything else is optional, because the point is to
 * start a conversation, not to qualify someone before they've spoken to us.
 */
export function SellerForm() {
  const contact = useSiteContact();
  const [form, setForm] = useState<SellerFormData>(empty);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  // Honeypot — hidden from people, filled by bots.
  const [company, setCompany] = useState("");

  const set = (field: keyof SellerFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please tick the consent box so we're allowed to contact you.");
      return;
    }
    if (!form.corridor) {
      toast.error("Please tell us roughly where the property is.");
      return;
    }
    setLoading(true);

    const details = [
      form.project && `Project/society: ${form.project}`,
      form.configuration && `Configuration: ${form.configuration}`,
      form.timeline && `Timeline: ${form.timeline}`,
      form.message && `Notes: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    const { error } = await supabase.from("leads").insert({
      full_name: form.full_name,
      // Email is optional on this form; an untouched input gives "", which is
      // not the same as absent. Send null so the column and the row-level
      // policy both read it as "not provided".
      email: form.email.trim() || null,
      phone: form.phone,
      property_interest: `Selling — ${form.corridor}`,
      // Deliberately null. See migration 0002.
      budget_range: null,
      preferred_location: form.corridor,
      message: details || null,
      enquiry_type: "sell",
      status: "new",
      source: "website",
    });

    if (error) {
      console.error("Seller lead insert failed:", error);
      setLoading(false);
      toast.error(
        `We couldn't send that just now. Please call or WhatsApp us on ${contact.phoneDisplay} and we'll pick it up straight away.`,
        { duration: 10000 },
      );
      return;
    }

    supabase.functions
      .invoke("send-lead-email", {
        body: {
          full_name: form.full_name,
          email: form.email.trim() || "Not provided",
          phone: form.phone,
          property_interest: `SELLER — ${form.corridor}`,
          budget_range: "n/a (seller)",
          preferred_location: form.corridor,
          message: details,
          company,
        },
      })
      .catch((err) => console.error("Email function error:", err));

    toast.success("Thank you — we'll come back to you with comparables for your sector.");
    setForm(empty);
    setAgreed(false);
    setLoading(false);
  };

  const inp =
    "w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1";
  const lbl = "block text-sm font-medium text-foreground mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="s-name" className={lbl}>
            Your name <span className="text-gold-ink">*</span>
          </label>
          <input
            id="s-name"
            type="text"
            required
            autoComplete="name"
            maxLength={100}
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            className={inp}
          />
        </div>
        <div>
          <label htmlFor="s-phone" className={lbl}>
            Phone or WhatsApp <span className="text-gold-ink">*</span>
          </label>
          <input
            id="s-phone"
            type="tel"
            required
            autoComplete="tel"
            maxLength={20}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inp}
          />
        </div>
      </div>

      <div>
        <label htmlFor="s-corridor" className={lbl}>
          Where is the property? <span className="text-gold-ink">*</span>
        </label>
        <select
          id="s-corridor"
          required
          value={form.corridor}
          onChange={(e) => set("corridor", e.target.value)}
          className={inp}
        >
          <option value="">Choose a corridor</option>
          {CORRIDORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="text-muted-foreground text-sm pt-2">
        Everything below is optional — it just means our first call is more useful.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="s-project" className={lbl}>
            Project or society
          </label>
          <input
            id="s-project"
            type="text"
            maxLength={120}
            placeholder="e.g. DLF The Arbour"
            value={form.project}
            onChange={(e) => set("project", e.target.value)}
            className={inp}
          />
        </div>
        <div>
          <label htmlFor="s-config" className={lbl}>
            Configuration and size
          </label>
          <input
            id="s-config"
            type="text"
            maxLength={80}
            placeholder="e.g. 4 BHK, 3,200 sq ft"
            value={form.configuration}
            onChange={(e) => set("configuration", e.target.value)}
            className={inp}
          />
        </div>
      </div>

      <div>
        <label htmlFor="s-email" className={lbl}>
          Email
        </label>
        <input
          id="s-email"
          type="email"
          autoComplete="email"
          maxLength={255}
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          className={inp}
        />
      </div>

      <div>
        <label htmlFor="s-timeline" className={lbl}>
          When are you looking to sell?
        </label>
        <select
          id="s-timeline"
          value={form.timeline}
          onChange={(e) => set("timeline", e.target.value)}
          className={inp}
        >
          <option value="">No particular timeline</option>
          {TIMELINES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="s-message" className={lbl}>
          Anything we should know
        </label>
        <textarea
          id="s-message"
          rows={3}
          maxLength={1000}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className={`${inp} resize-none`}
        />
      </div>

      {/* Honeypot. Hidden from assistive tech and from sighted users. */}
      <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
        <label htmlFor="s-company">Company (leave blank)</label>
        <input
          id="s-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <input
          id="s-consent"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 accent-primary w-4 h-4"
        />
        <label htmlFor="s-consent" className="cursor-pointer">
          I'd like L2S Infra to contact me about selling this property. We don't
          sell or share your details.
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

      <div className="bg-muted border border-border rounded-lg p-5">
        <p className="text-foreground text-sm font-medium mb-1">What happens next</p>
        <p className="text-muted-foreground text-sm">
          One of us calls you — not a call centre. Then we send you what
          comparable units in your sector actually transacted for, so you can see
          the number before you decide anything. No fee for that conversation.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 min-h-[44px]"
      >
        {loading ? "Sending…" : "Get my sector comparables"}
      </button>

      <p className="text-muted-foreground text-sm text-center">
        Or{" "}
        <a
          href={whatsappLink(
            "Hi — I'm looking to sell a property. Project/sector: ",
            contact.whatsapp,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold-ink hover:underline"
        >
          message us on WhatsApp
        </a>{" "}
        or call {contact.phoneDisplay}.
      </p>
    </form>
  );
}
