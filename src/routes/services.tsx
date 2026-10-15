import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader, Footer } from "@/components/brand/public-shell";
import { ServiceCards } from "@/components/brand/services";
import { meta } from "@/lib/business";
import { useBusinessInformation } from "@/components/brand/business-information";
import { houseCallDescription } from "@/lib/business-settings";
export const Route = createFileRoute("/services")({
  head: () =>
    meta("Styles & Prices", "Explore all seven braiding styles and prices in South African rand."),
  component: Services,
});
function Services() {
  const { details } = useBusinessInformation();
  return (
    <>
      <PublicHeader />
      <main className="wrap section">
        <div className="eyebrow text-rose mb-3">Clean • Neat • Stylish</div>
        <h1 className="script section-title">Styles & Prices</h1>
        <p className="text-muted-foreground mb-8">
          Find the look you love. All prices in South African rand.
        </p>
        <ServiceCards />
        <p className="notice mt-8">
          Extra lengths may incur additional charges. {houseCallDescription(details)} Images are hairstyle references, not a portfolio of client work.
        </p>
      </main>
      <Footer />
    </>
  );
}
