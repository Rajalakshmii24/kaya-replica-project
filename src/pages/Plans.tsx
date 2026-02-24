import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { motion } from "framer-motion";

const plans = [
  { name: "Basic Listing", price: "Free", features: ["1 Property Listing", "Standard Photos", "30-Day Duration", "Email Support"] },
  { name: "Premium Listing", price: "AED 500/mo", features: ["10 Property Listings", "HD Photos & Video", "Featured Badge", "Priority Support", "60-Day Duration"] },
  { name: "Professional", price: "AED 1,500/mo", features: ["Unlimited Listings", "Professional Photography", "Virtual Tours", "Top Placement", "Dedicated Account Manager", "Analytics Dashboard"] },
  { name: "Enterprise", price: "Custom", features: ["All Professional Features", "Custom Branding", "API Access", "White-Label Options", "Bulk Upload", "Priority Placement"] },
];

const Plans = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="Our Plans" subtitle="Property Posting Plans" image="/images/about-1.jpg" />

      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-border p-8 flex flex-col"
            >
              <h3 className="font-raleway text-lg tracking-wide text-foreground">{plan.name}</h3>
              <p className="text-2xl font-raleway font-light text-foreground mt-3 mb-6">{plan.price}</p>
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground font-raleway flex items-start gap-2">
                    <span className="text-foreground mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/contact" className="kaya-btn text-center text-xs">Get Started</a>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Plans;
