import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader, Footer } from "@/components/brand/public-shell";
import { meta } from "@/lib/business";
import { useBusinessInformation, WhatsAppButton } from "@/components/brand/business-information";
import { houseCallDescription } from "@/lib/business-settings";
import { Button } from "@/components/ui/button";
import { MapPin, MessageCircle, Phone, Home } from "lucide-react";
export const Route = createFileRoute("/contact")({
  head: () =>
    meta(
      "Contact & Location",
      "Business contact information, location and appointment enquiries.",
    ),
  component: Contact,
});
function Contact() {
  const { details } = useBusinessInformation();
  return (
    <>
      <PublicHeader />
      <main className="wrap section min-h-[65vh]">
        <div className="eyebrow text-rose">We'd love to hear from you</div>
        <h1 className="script section-title mt-4">Let's talk hair ♡</h1>
        <div className="grid md:grid-cols-2 gap-10 mt-10">
          <div className="space-y-6">
            <p className="flex gap-3">
              <MapPin />
              {details.location || "Location to be provided."}
            </p>
            {details.phone ? <a className="flex gap-3" href={`tel:${details.phone.replace(/[^+\d]/g, "")}`}>
              <Phone />
              {details.phone}
            </a> : <p className="flex gap-3"><Phone />Phone number to be provided.</p>}
            {details.owner_name && <p>Owner: {details.owner_name}</p>}
            {details.email ? <a className="block break-words" href={`mailto:${details.email}`}>{details.email}</a> : <p>Email to be provided.</p>}
            <p className="whitespace-pre-line">{details.business_hours || "Business hours to be provided."}</p>
            <div className="flex gap-4">{details.instagram_url && <a href={details.instagram_url} target="_blank" rel="noreferrer">Instagram</a>}{details.facebook_url && <a href={details.facebook_url} target="_blank" rel="noreferrer">Facebook</a>}</div>
            <p className="flex gap-3">
              <Home />
              {houseCallDescription(details)}
            </p>
            <WhatsAppButton message={`Hi ${details.business_name || "there"}! I have a question about your braiding services.`}>Chat on WhatsApp</WhatsAppButton>
          </div>
          <div className="bg-secondary p-8 rounded-lg">
            <h2 className="script text-4xl">Your hair, my passion.</h2>
            <p className="leading-7">
              Tell us the style you have in mind and your preferred date. We'll discuss availability
              and any additional charges with you.
            </p>
            {details.location ? <Button asChild variant="outline">
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.location)}`}
              >
                Open location in Maps <MapPin />
              </a>
            </Button> : <Button disabled variant="outline">Location unavailable <MapPin /></Button>}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
