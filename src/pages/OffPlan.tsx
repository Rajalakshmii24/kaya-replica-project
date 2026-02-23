import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";

const OffPlan = () => {
  const offplanProperties = properties.filter((p) => p.status === "offplan");

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="Off Plan Projects" subtitle="Invest in Dubai's Future" image="/images/downtown-living.webp" />

      <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
        <div className="max-w-2xl mb-12">
          <h2 className="kaya-heading text-2xl text-foreground mb-6">New Developments</h2>
          <p className="kaya-body text-sm">
            Discover exclusive off-plan projects from Dubai's top developers. Benefit from attractive payment plans,
            early-bird pricing, and high capital appreciation potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offplanProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        {offplanProperties.length === 0 && (
          <p className="text-center font-raleway font-light text-muted-foreground py-16">
            No off-plan properties available at the moment.
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default OffPlan;
