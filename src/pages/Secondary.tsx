import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";

const Secondary = () => {
  const secondaryProperties = properties.filter((p) => p.status === "secondary");

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="Secondary Market" subtitle="Ready to Move Properties" image="/images/marine-living.webp" />

      <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
        <div className="max-w-2xl mb-12">
          <h2 className="kaya-heading text-2xl text-foreground mb-6">Resale Properties</h2>
          <p className="kaya-body text-sm">
            Browse our curated selection of secondary market properties in Dubai. Ready-to-move homes
            with established communities and proven track records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {secondaryProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        {secondaryProperties.length === 0 && (
          <p className="text-center font-raleway font-light text-muted-foreground py-16">
            No secondary market properties available at the moment.
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Secondary;
