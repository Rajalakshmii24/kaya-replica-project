import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const buildings = [
  { name: "Marina Heights", location: "Dubai Marina", units: 120, image: "/images/marine-living.webp", status: "Ready" },
  { name: "Downtown Residence", location: "Downtown Dubai", units: 85, image: "/images/downtown-living.webp", status: "Ready" },
  { name: "Palm View Tower", location: "Palm Jumeirah", units: 64, image: "/images/luxury-apartments.jpg", status: "Off Plan" },
  { name: "Creek Side Living", location: "Dubai Creek Harbour", units: 200, image: "/images/residential-community.webp", status: "Off Plan" },
  { name: "Business Bay Towers", location: "Business Bay", units: 150, image: "/images/hero-1.webp", status: "Ready" },
  { name: "JBR Waterfront", location: "Jumeirah Beach Residence", units: 96, image: "/images/hero-2.webp", status: "Ready" },
];

const Buildings = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="Buildings" subtitle="Explore Our Featured Buildings" image="/images/luxury-apartments.jpg" />

      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buildings.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={b.image} alt={b.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="py-5">
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-raleway">{b.status}</span>
                <h3 className="font-raleway text-lg tracking-wide text-foreground mt-1">{b.name}</h3>
                <p className="text-sm text-muted-foreground font-raleway mt-1">{b.location} · {b.units} Units</p>
                <Link to="/properties" className="kaya-btn mt-4 inline-block text-xs">View Properties</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Buildings;
