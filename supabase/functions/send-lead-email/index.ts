import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { full_name, email, phone, property_interest, budget_range, preferred_location, message } = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "L2S Infra Website <connect@l2sinfra.com>",
        to: ["connect@l2sinfra.com"],
        subject: `New Lead: ${full_name} — ${property_interest}`,
        html: `
          <h2>New Enquiry from L2S Infra Website</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${full_name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${phone}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Property Interest</td><td style="padding:8px;border:1px solid #ddd">${property_interest}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Budget</td><td style="padding:8px;border:1px solid #ddd">${budget_range}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Preferred Location</td><td style="padding:8px;border:1px solid #ddd">${preferred_location || "Not specified"}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${message || "No message"}</td></tr>
          </table>
          <p style="margin-top:16px">
            <a href="https://www.l2sinfra.com/admin" style="background:#b8963e;color:white;padding:10px 20px;text-decoration:none;border-radius:6px">View in Admin Panel</a>
          </p>
        `,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: res.ok ? 200 : 400,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
