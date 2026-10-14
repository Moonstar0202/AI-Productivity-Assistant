import { Link } from "@tanstack/react-router";
import { Crown, Menu, Heart, MessageCircle, MapPin, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme";
import { whatsapp } from "@/lib/business";
export function Brand() {
  return (
    <span className="flex items-center gap-2">
      <Crown className="size-6 text-rose" />
      <span className="script text-3xl">
        Braiding By Me<span className="text-rose"> ♡</span>
      </span>
    </span>
  );
}
export function PublicHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b bg-background">
      <div className="wrap flex h-22 items-center justify-between gap-3">
        <Link to="/" aria-label="Braiding By Me home">
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
          <a
            className="flex items-center gap-2"
            href={whatsapp("Hi! I would like to enquire about braiding.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="size-4" />
            074 760 2949
          </a>
          <p className="flex gap-2">
            <MapPin className="size-4" />
            CPUT Bellville Campus, Cape Town
          </p>
        </div>
      </div>
      <div className="wrap mt-8 border-t pt-5 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Braiding By Me. Made with care.{" "}
        <Link to="/dashboard" className="float-right">
          Owner dashboard
        </Link>
      </div>
    </footer>
  );
}
