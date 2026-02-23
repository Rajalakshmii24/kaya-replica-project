import { motion } from "framer-motion";

const PlansSection = () => {
  return (
    <section className="w-full bg-background">
      <div className="flex flex-col lg:flex-row items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 min-h-[350px] lg:min-h-[500px]"
        >
          <img
            src="/images/about-1.jpg"
            alt="Our Plans"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex items-center px-8 md:px-16 lg:px-24 py-16 lg:py-0"
        >
          <div>
            <h2 className="kaya-heading text-2xl md:text-3xl text-foreground mb-4">
              Our Plans
            </h2>
            <p className="kaya-body text-sm uppercase tracking-[0.15em] mb-8">
              For Property Posting
            </p>
            <a href="/properties" className="kaya-btn">
              More Plans
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlansSection;
