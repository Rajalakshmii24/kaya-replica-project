import { motion } from "framer-motion";

const ScheduleSection = () => {
  return (
    <section className="w-full">
      <div className="flex flex-col lg:flex-row">
        {/* Left - empty with background image */}
        <div
          className="hidden lg:block lg:w-1/2 min-h-[500px] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-1.webp')" }}
        />

        {/* Right - schedule info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 bg-kaya-olive text-primary-foreground px-8 md:px-16 lg:px-20 py-20 flex flex-col justify-center"
        >
          <h2 className="kaya-heading text-2xl md:text-3xl mb-12">
            Schedule A Visit
          </h2>

          <div className="space-y-8 mb-12">
            <div className="flex flex-col sm:flex-row sm:gap-12">
              <span className="font-raleway font-light tracking-[0.1em] text-sm opacity-80">
                Monday - Friday
              </span>
              <span className="font-raleway font-light tracking-[0.1em] text-sm">
                9:00am - 4:30pm
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-12">
              <span className="font-raleway font-light tracking-[0.1em] text-sm opacity-80">
                Saturday
              </span>
              <span className="font-raleway font-light tracking-[0.1em] text-sm">
                9:00am - 1:30pm
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-12">
              <span className="font-raleway font-light tracking-[0.1em] text-sm opacity-80">
                Sunday
              </span>
              <span className="font-raleway font-light tracking-[0.1em] text-sm">
                Closed
              </span>
            </div>
          </div>

          <a href="#contact" className="kaya-btn self-start bg-primary-foreground text-kaya-olive hover:bg-primary-foreground/90">
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ScheduleSection;
