import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

const PROPERTY_TYPES = ["Apartment", "Villa", "Townhouse", "Penthouse", "Land", "Commercial"];
const LOCATIONS = [
  "Downtown Dubai", "Dubai Marina", "Palm Jumeirah", "Business Bay", "JBR",
  "Dubai Hills", "Arabian Ranches", "DIFC", "Creek Harbour", "MBR City",
  "Jumeirah Village Circle", "Damac Hills", "Town Square", "Other"
];

const Sell = () => {
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", propertyType: "", propertyLocation: "", estimatedPrice: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.email || !form.propertyType || !form.propertyLocation) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success("Your inquiry has been submitted successfully!");
  };

  const benefits = [
    "Free professional property evaluation",
    "Expert market analysis & pricing strategy",
    "Premium listing exposure on major portals",
    "Professional photography & videography",
    "Dedicated agent throughout the process",
    "Legal documentation & transaction support",
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img src="/images/luxury-apartments.jpg" alt="Sell your property" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="kaya-heading-lg text-white mb-6">
            Let's Sell Your Property Profitably
          </h1>
          <p className="font-raleway font-light text-white/80 text-lg leading-relaxed">
            Entire process is on us, from evaluation to a deal
          </p>
        </div>
      </section>

      {/* Benefits + Form */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Benefits */}
          <div>
            <h2 className="kaya-heading text-xl text-foreground mb-8">Why Sell With KAYA</h2>
            <div className="space-y-5 mb-12">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <p className="font-raleway font-light text-sm text-foreground leading-relaxed">{b}</p>
                </div>
              ))}
            </div>

            <div className="border border-border p-8">
              <h3 className="kaya-heading text-sm text-foreground mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <a href="tel:+971000000000" className="flex items-center gap-3 font-raleway font-light text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone size={16} /> +971 00 000 0000
                </a>
                <a href="mailto:sell@kayarealestate.ae" className="flex items-center gap-3 font-raleway font-light text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail size={16} /> sell@kayarealestate.ae
                </a>
                <p className="flex items-start gap-3 font-raleway font-light text-sm text-muted-foreground">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" /> 1607, Silver Building, Business Bay, Dubai, UAE
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div className="border border-border p-12 text-center">
                <CheckCircle size={48} className="text-accent mx-auto mb-6" />
                <h3 className="kaya-heading text-lg text-foreground mb-4">Thank You!</h3>
                <p className="kaya-body text-sm mb-8">
                  Our property specialist will contact you within 24 hours to discuss your property.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ fullName: "", phone: "", email: "", propertyType: "", propertyLocation: "", estimatedPrice: "", message: "" }); }} className="kaya-btn">
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-border p-8">
                <h3 className="kaya-heading text-sm text-foreground mb-8">Property Inquiry Form</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Full Name *</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} required
                      className="kaya-input" placeholder="Enter your full name" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Phone *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} required type="tel"
                        className="kaya-input" placeholder="+971 ..." />
                    </div>
                    <div>
                      <label className="block font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Email *</label>
                      <input name="email" value={form.email} onChange={handleChange} required type="email"
                        className="kaya-input" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Property Type *</label>
                      <select name="propertyType" value={form.propertyType} onChange={handleChange} required
                        className="kaya-input appearance-none">
                        <option value="">Select type</option>
                        {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Property Location *</label>
                      <select name="propertyLocation" value={form.propertyLocation} onChange={handleChange} required
                        className="kaya-input appearance-none">
                        <option value="">Select area</option>
                        {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Estimated Price (AED)</label>
                    <input name="estimatedPrice" value={form.estimatedPrice} onChange={handleChange}
                      className="kaya-input" placeholder="e.g. 2,500,000" />
                  </div>
                  <div>
                    <label className="block font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                      className="kaya-input min-h-[100px] resize-none" placeholder="Additional details about your property..." />
                  </div>
                  <button type="submit" disabled={loading} className="kaya-btn w-full justify-center">
                    {loading ? "Submitting..." : "Submit Inquiry"} {!loading && <ArrowRight size={16} />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sell;
