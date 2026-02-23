import { motion } from "framer-motion";

const LuxurySection = () => {
  return (
    <section className="w-full bg-background">
      <div className="flex flex-col-reverse lg:flex-row items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 px-8 md:px-16 lg:px-24 py-16 lg:py-0"
        >
          <div className="max-w-lg">
            <h2 className="kaya-heading text-2xl md:text-3xl text-foreground mb-6">
              Luxury Apartments
            </h2>
            <p className="kaya-body text-sm md:text-base mb-8">
              A harmonious fusion of comfort and sophistication, showcasing
              spacious layouts, exquisite finishes, and contemporary design
              elements for an elevated living experience.
            </p>
            <a href="#" className="kaya-btn mb-8 inline-flex">
              More Plans
            </a>
            <div className="mt-6">
              <img
                src="/images/group-icon.png"
                alt="Kaya icon"
                className="w-40 opacity-60"
              />
            </div>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 min-h-[400px] lg:min-h-[600px]"
        >
          <img
            src="/images/luxury-apartments.jpg"
            alt="Luxury Apartments"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default LuxurySection;
