import { useState } from "react";
import { motion } from "framer-motion";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! We will contact you shortly.");
    setForm({ name: "", email: "", mobile: "" });
  };

  return (
    <section id="contact" className="w-full bg-background py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-8"
      >
        <h2 className="kaya-heading text-xl md:text-2xl text-foreground text-center mb-16">
          Now Open For Sale Appointments
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          <div>
            <input
              type="text"
              placeholder="Name*"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="kaya-input"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Mail ID*"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="kaya-input"
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Mobile No*"
              required
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="kaya-input"
            />
          </div>
          <div className="md:col-span-3 flex justify-center mt-4">
            <button type="submit" className="kaya-btn">
              Send Message
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default ContactSection;
