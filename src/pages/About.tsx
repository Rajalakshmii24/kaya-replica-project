import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="About Us" subtitle="Discover Kaya Real Estate" image="/images/hero-2.webp" />

      <section className="max-w-6xl mx-auto px-8 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <img src="/images/design-art.jpg" alt="About Kaya" className="w-full h-auto object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="kaya-heading text-2xl md:text-3xl text-foreground mb-8">Who We Are</h2>
            <p className="kaya-body text-sm md:text-base mb-4">
              Kaya Real Estate is a premier real estate brokerage firm based in Dubai, UAE. With years of experience
              in the industry, we specialize in helping clients find their perfect property—whether it's a luxury
              apartment, a family villa, or a smart investment opportunity.
            </p>
            <p className="kaya-body text-sm md:text-base mb-4">
              Our team of dedicated professionals combines deep market knowledge with a personalized approach,
              ensuring every client receives tailored guidance throughout their real estate journey.
            </p>
            <p className="kaya-body text-sm md:text-base">
              From off-plan projects to secondary market listings, we cover every facet of the Dubai property
              landscape with integrity, transparency, and unmatched expertise.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-kaya-light py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="kaya-heading text-2xl md:text-3xl text-foreground text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Trust", desc: "We build lasting relationships through honesty and transparency in every transaction." },
              { title: "Excellence", desc: "We deliver premium service and deep market expertise to every client." },
              { title: "Innovation", desc: "We leverage the latest technologies and market insights to stay ahead." },
            ].map((v) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="font-raleway font-light tracking-[0.2em] text-lg text-foreground uppercase mb-4">{v.title}</h3>
                <p className="kaya-body text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
