import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, MapPin, ArrowRight, ShieldCheck, MessageCircle } from "lucide-react";
import hero from "@/assets/braids-hero.jpg";
import { PublicHeader, Footer } from "@/components/brand/public-shell";
import { ServiceCards } from "@/components/brand/services";
import { Button } from "@/components/ui/button";
import { meta, whatsapp } from "@/lib/business";
export const Route = createFileRoute("/")({
  head: () =>
    meta(
      "Beautiful braids, made for you",
      "Knotless braids, twists and goddess braids at CPUT Bellville Campus. View prices and request your appointment.",
    ),
  component: Home,
});
function Home() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="hero">
          <img
            src={hero}
            alt="Beautiful knotless braids with soft curly ends"
            width={1600}
            height={1008}
          />
          <div className="wrap">
            <div className="hero-content">
              <div className="eyebrow flex gap-2 items-center">
                <span className="h-px w-7 bg-rose" /> A little self-care. A lot of confidence.
              </div>
              <h1>
                Braiding<span>By Me ♡</span>
              </h1>
              <div className="eyebrow mb-5">Clean • Neat • Stylish</div>
              <p>
                Good hair, good mood. Beautiful braids, a gentle touch, and a style that feels like
                you.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Button asChild size="lg">
                  <Link to="/book">
                    Book an Appointment <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/services">View Price List</Link>
                </Button>
              </div>
              <div className="mt-7 text-xs flex items-center gap-2">
                <MapPin className="size-4" />
                CPUT Bellville Campus, Cape Town
              </div>
            </div>
          </div>
          <div className="hero-note flex items-center gap-3">
            <Heart className="text-rose size-6" />
            <div className="script text-2xl">Your hair, my passion.</div>
          </div>
        </section>
        <section className="border-b bg-card">
          <div className="wrap grid grid-cols-3 py-6 gap-3">
            {(
              [
                [ShieldCheck, "Quality braids", "Neat work. Beautiful detail."],
                [Heart, "Made with care", "Your comfort comes first."],
                [Sparkles, "Effortlessly you", "Styles that speak for you."],
              ] as const
            ).map(([Icon, title, sub]) => (
              <div key={String(title)} className="flex justify-center items-center gap-3">
                <Icon className="text-rose size-6 shrink-0" />
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold mb-1">{String(title)}</h3>
                  <p className="hidden sm:block text-xs text-muted-foreground mb-0">
                    {String(sub)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="section wrap">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="eyebrow text-rose mb-3">Find your next look</div>
              <h2 className="script section-title">A style for every mood</h2>
              <p className="text-sm text-muted-foreground mb-0">
                Beautifully braided. Thoughtfully priced. Always you.
              </p>
            </div>
            <Button asChild variant="link" className="hidden sm:inline-flex">
              <Link to="/services">
                Explore all styles <ArrowRight />
              </Link>
            </Button>
          </div>
          <ServiceCards featured />
          <p className="text-xs text-muted-foreground mt-5">
            Extra lengths may incur additional charges. Hairstyle images are illustrative.
          </p>
        </section>
        <section className="section bg-secondary">
          <div className="wrap grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="eyebrow text-rose mb-3">More than a hairstyle</div>
              <h2 className="script section-title">Good hair. Good mood.</h2>
              <p className="text-sm leading-7 max-w-md">
                Welcome to Braiding By Me — a little space for beautiful hair and a fresh dose of
                confidence. From classic knotless braids to soft goddess curls, every style is made
                with care and attention to detail.
              </p>
            </div>
            <div className="md:pl-14">
              <h3 className="script text-4xl mb-3">Let's make it a good hair day ♡</h3>
              <p className="text-sm text-muted-foreground">
                Based at CPUT Bellville Campus, Cape Town.
                <br />
                House calls available at an additional charge.
              </p>
              <Button asChild>
                <a
                  href={whatsapp("Hi! I would love to book a braiding appointment.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle />
                  Let's chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
