import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Building, TrendingUp, FileText, Handshake, Key } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Property Sales",
    desc: "Expert guidance for buying and selling residential and commercial properties across Dubai.",
  },
  {
    icon: Building,
    title: "Off Plan Investments",
    desc: "Access exclusive off-plan projects with attractive payment plans from top developers.",
  },
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    desc: "Strategic investment advice to maximize your returns in the Dubai real estate market.",
  },
  {
    icon: FileText,
    title: "Property Management",
    desc: "Comprehensive property management services to protect and enhance your asset value.",
  },
  {
    icon: Handshake,
    title: "Mortgage Assistance",
    desc: "We connect you with the best mortgage providers to secure optimal financing solutions.",
  },
  {
    icon: Key,
    title: "Rental Services",
    desc: "Find the perfect rental property or list your property with our professional leasing team.",
  },
];

const Services = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="Our Services" subtitle="Complete Real Estate Solutions" image="/images/about-1.jpg" />

      <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center px-4 py-8"
            >
              <s.icon size={40} className="mx-auto mb-6 text-kaya-olive" strokeWidth={1} />
              <h3 className="font-raleway font-light tracking-[0.15em] text-lg text-foreground uppercase mb-4">
                {s.title}
              </h3>
              <p className="kaya-body text-sm mb-6">{s.desc}</p>
              <Link to="/contact" className="font-raleway font-light text-sm tracking-[0.1em] text-kaya-olive uppercase hover:opacity-70 transition-opacity">
                Learn More →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
