import { Link } from "@tanstack/react-router";
import { Crown, Menu, Heart, MessageCircle, MapPin, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme";
import { useBusinessInformation, WhatsAppButton } from "./business-information";
import { houseCallDescription } from "@/lib/business-settings";
export function Brand() {
  const { name } = useBusinessInformation();
  return (
    <span className="flex items-center gap-2">
      <Crown className="size-6 text-rose" />
      <span className="script text-3xl">
        {name}<span className="text-rose"> ♡</span>
      </span>
    </span>
  );
}
export function PublicHeader() {
  const { name } = useBusinessInformation();
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b bg-background">
      <div className="wrap flex h-22 items-center justify-between gap-3">
        <Link to="/" aria-label={`${name} home`}>
          <Brand />
        </Link>
        <nav className="desktop-nav flex items-center gap-8 text-sm">
          <Link
            to="/"
            activeProps={{ className: "text-primary font-semibold" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link to="/services">Styles & Prices</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/dashboard">
            My Business <ArrowUpRight className="inline size-3" />
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="desktop-nav">
            <Link to="/book">
              Book Appointment <Heart />
            </Link>
          </Button>
          <Button
            className="mobile-nav"
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            onClick={() => setOpen(!open)}
          >
            <Menu />
          </Button>
        </div>
      </div>
      {open && (
        <nav className="wrap flex flex-col gap-4 pb-5">
          <Link to="/">Home</Link>
          <Link to="/services">Styles & Prices</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/dashboard">My Business</Link>
          <Link to="/book">Book Appointment</Link>
        </nav>
      )}
    </header>
  );
}
export function Footer() {
  const { details, name } = useBusinessInformation();
  return (
    <footer className="border-t bg-muted py-10">
      <div className="wrap grid gap-8 md:grid-cols-3">
        <div>
          <Brand />
          <p className="mt-3 text-sm text-muted-foreground">
            Clean • Neat • Stylish
            <br />
            Your hair, my passion.
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <Link to="/">Home</Link>
          <Link to="/services">Styles & Prices</Link>
          <Link to="/book">Book</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="text-sm space-y-3">
          <WhatsAppButton message={`Hi ${details.business_name || "there"}! I would like to enquire about braiding.`} variant="outline">{details.whatsapp_number || "Chat on WhatsApp"}</WhatsAppButton>
          {details.phone ? <a className="block" href={`tel:${details.phone.replace(/[^+\d]/g, "")}`}>{details.phone}</a> : <p>Phone number to be provided.</p>}
          {details.email && <a className="block break-words" href={`mailto:${details.email}`}>{details.email}</a>}
          {details.owner_name && <p>{details.owner_name}</p>}
          <p className="flex gap-2">
            <MapPin className="size-4" />
            {details.location || "Location to be provided."}
          </p>
          <p>{houseCallDescription(details)}</p>
          {details.business_hours && <p className="whitespace-pre-line">{details.business_hours}</p>}
          <div className="flex gap-4">{details.instagram_url && <a href={details.instagram_url} target="_blank" rel="noreferrer">Instagram</a>}{details.facebook_url && <a href={details.facebook_url} target="_blank" rel="noreferrer">Facebook</a>}</div>
        </div>
      </div>
      <div className="wrap mt-8 border-t pt-5 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {name}. Made with care.{" "}
        <Link to="/dashboard" className="float-right">
          Owner dashboard
        </Link>
      </div>
    </footer>
  );
}
