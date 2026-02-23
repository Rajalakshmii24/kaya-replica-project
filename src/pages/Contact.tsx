import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="Contact Us" subtitle="Get In Touch" image="/images/hero-2.webp" />

      <section className="max-w-6xl mx-auto px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Contact Info */}
          <div className="lg:w-2/5">
            <h2 className="kaya-heading text-2xl text-foreground mb-8">Get In Touch</h2>
            <div className="flex flex-col gap-6 mb-10">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-kaya-olive shrink-0 mt-1" />
                <div>
                  <p className="font-raleway font-medium text-sm text-foreground mb-1">Office Address</p>
                  <p className="kaya-body text-sm">
                    Office 1404, Aspect Tower,<br />
                    Business Bay, Dubai,<br />
                    United Arab Emirates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={20} className="text-kaya-olive shrink-0 mt-1" />
                <div>
                  <p className="font-raleway font-medium text-sm text-foreground mb-1">Phone</p>
                  <a href="tel:+97142527575" className="kaya-body text-sm hover:text-kaya-olive transition-colors">
                    +971 4 252 7575
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={20} className="text-kaya-olive shrink-0 mt-1" />
                <div>
                  <p className="font-raleway font-medium text-sm text-foreground mb-1">Email</p>
                  <a href="mailto:info@kayarealestate.ae" className="kaya-body text-sm hover:text-kaya-olive transition-colors">
                    info@kayarealestate.ae
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={20} className="text-kaya-olive shrink-0 mt-1" />
                <div>
                  <p className="font-raleway font-medium text-sm text-foreground mb-1">Working Hours</p>
                  <p className="kaya-body text-sm">
                    Mon - Fri: 9:00 AM - 4:30 PM<br />
                    Saturday: 9:00 AM - 1:30 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="w-full h-64 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.168!2d55.2644!3d25.1865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzExLjQiTiA1NcKwMTUnNTEuOCJF!5e0!3m2!1sen!2sae!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Kaya Office Location"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-1">
            <h2 className="kaya-heading text-2xl text-foreground mb-8">Send Us A Message</h2>

            {submitted && (
              <div className="bg-kaya-olive/10 border border-kaya-olive/30 p-4 mb-8">
                <p className="font-raleway text-sm text-kaya-olive">
                  Thank you! Your message has been sent. We will contact you shortly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="kaya-input"
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1 font-raleway">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="kaya-input"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1 font-raleway">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="kaya-input"
                  />
                  {errors.phone && <p className="text-destructive text-xs mt-1 font-raleway">{errors.phone}</p>}
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="kaya-input"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message *"
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="kaya-input !h-auto resize-none"
                />
                {errors.message && <p className="text-destructive text-xs mt-1 font-raleway">{errors.message}</p>}
              </div>
              <button type="submit" className="kaya-btn self-start">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
