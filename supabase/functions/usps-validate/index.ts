import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeXml(str: string) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}>\\s*([^<]*)\\s*</${tag}>`, "i");
  const m = xml.match(re);
  return (m?.[1] || "").trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const userId = Deno.env.get("USPS_USER_ID");
    if (!userId) {
      return new Response(JSON.stringify({ error: "USPS_USER_ID not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const addressLine1 = (body.addressLine1 || "").toString().slice(0, 100);
    const addressLine2 = (body.addressLine2 || "").toString().slice(0, 100);
    const city = (body.city || "").toString().slice(0, 60);
    const state = (body.state || "").toString().slice(0, 2).toUpperCase();
    const zipRaw = (body.zipCode || "").toString().slice(0, 10);

    if (!addressLine1 || !city || !state || !zipRaw) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const zipStr = zipRaw.replace(/[^0-9]/g, "");
    const zip5 = zipStr.slice(0, 5);
    const zip4 = zipStr.length > 5 ? zipStr.slice(5, 9) : "";

    const xml =
      `<AddressValidateRequest USERID="${userId}">` +
      `<Revision>1</Revision>` +
      `<Address ID="0">` +
      `<Address1>${escapeXml(addressLine2)}</Address1>` +
      `<Address2>${escapeXml(addressLine1)}</Address2>` +
      `<City>${escapeXml(city)}</City>` +
      `<State>${escapeXml(state)}</State>` +
      `<Zip5>${escapeXml(zip5)}</Zip5>` +
      `<Zip4>${escapeXml(zip4)}</Zip4>` +
      `</Address>` +
      `</AddressValidateRequest>`;

    const url = `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=${encodeURIComponent(xml)}`;
    const uspsRes = await fetch(url, { method: "GET" });
    const text = await uspsRes.text();

    const hasError = /<Error>/i.test(text);
    if (hasError) {
      console.error("USPS validation error:", text);
      return new Response(
        JSON.stringify({ deliverable: false, suggestedAddress: null, raw: text }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    const suggested = {
      addressLine1: extractTag(text, "Address2"),
      addressLine2: extractTag(text, "Address1"),
      city: extractTag(text, "City"),
      state: extractTag(text, "State"),
      zipCode: (() => {
        const z5 = extractTag(text, "Zip5");
        const z4 = extractTag(text, "Zip4");
        return z4 ? `${z5}-${z4}` : z5;
      })(),
    };

    return new Response(
      JSON.stringify({ deliverable: true, suggestedAddress: suggested }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in usps-validate:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});