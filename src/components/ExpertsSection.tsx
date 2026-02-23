import { motion } from "framer-motion";

const ExpertsSection = () => {
  return (
    <section className="w-full bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex items-center px-8 md:px-16 lg:px-24 py-20 lg:py-32"
        >
          <div className="max-w-lg">
            <h2 className="kaya-heading text-2xl md:text-3xl text-foreground mb-8">
              Real Estate Experts
            </h2>
            <p className="kaya-body text-sm md:text-base">
              We understand that modern people value maximum comfort.
            </p>
            <p className="kaya-body text-sm md:text-base mt-4">
              They seek a harmonious environment, meaningful communication with
              professionals, accurate and timely information, genuine commitment,
              and reliable, convenient technologies that save their most important
              resources.
            </p>
            <p className="kaya-body text-sm md:text-base mt-4">
              At Kaya Real Estate, we've brought all of this together—creating a
              seamless experience designed around what truly matters to you.
            </p>
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
            src="/images/design-art.jpg"
            alt="Kaya Real Estate design"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertsSection;
