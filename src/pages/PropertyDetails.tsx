import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { Bed, Bath, Maximize, ChevronLeft, ChevronRight, MapPin, Phone, Mail } from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === Number(id));
  const [currentImage, setCurrentImage] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!property) {
    return (
      <div className="w-full min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 px-8">
          <h1 className="kaya-heading text-2xl text-foreground mb-6">Property Not Found</h1>
          <Link to="/properties" className="kaya-btn">Browse Properties</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const gallery = [
    property.image,
    "/images/gallery/2.webp",
    "/images/gallery/3.webp",
    "/images/gallery/4.webp",
  ];

  const similar = properties.filter((p) => p.id !== property.id && p.type === property.type).slice(0, 3);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Thank you for your inquiry! We will get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />

      {/* Gallery Slider */}
      <section className="relative w-full h-[60vh] min-h-[400px] mt-20">
        <img src={gallery[currentImage]} alt={property.title} className="w-full h-full object-cover" />
        <button
          onClick={() => setCurrentImage((i) => (i - 1 + gallery.length) % gallery.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-primary-foreground p-2"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentImage((i) => (i + 1) % gallery.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-primary-foreground p-2"
        >
          <ChevronRight size={24} />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {gallery.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === currentImage ? "bg-primary-foreground" : "bg-primary-foreground/40"}`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Details */}
          <div className="flex-1">
            <p className="font-raleway font-light text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
              {property.location}
            </p>
            <h1 className="kaya-heading text-2xl md:text-3xl text-foreground mb-4">{property.title}</h1>
            <p className="font-raleway font-medium text-2xl text-foreground mb-8">{property.price}</p>

            <div className="flex gap-6 mb-10 pb-10 border-b border-border">
              <span className="flex items-center gap-2 font-raleway text-sm text-muted-foreground">
                <Bed size={18} /> {property.beds} Bedrooms
              </span>
              <span className="flex items-center gap-2 font-raleway text-sm text-muted-foreground">
                <Bath size={18} /> {property.baths} Bathrooms
              </span>
              <span className="flex items-center gap-2 font-raleway text-sm text-muted-foreground">
                <Maximize size={18} /> {property.sqft} sqft
              </span>
            </div>

            <h2 className="font-raleway font-light tracking-[0.15em] text-lg text-foreground uppercase mb-4">Description</h2>
            <p className="kaya-body text-sm mb-4">
              This stunning {property.type.toLowerCase()} in {property.location} offers a premium living experience
              with world-class amenities, breathtaking views, and meticulous attention to detail.
            </p>
            <p className="kaya-body text-sm mb-10">
              Featuring {property.beds} spacious bedrooms, {property.baths} beautifully appointed bathrooms,
              and {property.sqft} sqft of carefully designed living space. Located in one of Dubai's most
              sought-after neighborhoods.
            </p>

            {/* Map */}
            <h2 className="font-raleway font-light tracking-[0.15em] text-lg text-foreground uppercase mb-4">Location</h2>
            <div className="w-full h-64 mb-4 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57809.0!2d55.14!3d25.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai!5e0!3m2!1sen!2sae!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Property Location"
              />
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:w-[380px] shrink-0">
            <div className="bg-kaya-light p-8 sticky top-28">
              <h3 className="font-raleway font-light tracking-[0.15em] text-lg text-foreground uppercase mb-6">
                Inquire About This Property
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                <textarea
                  placeholder="Message (optional)"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="kaya-input !h-auto resize-none"
                />
                <button type="submit" className="kaya-btn w-full justify-center">Send Inquiry</button>
              </form>

              <div className="mt-8 pt-6 border-t border-border">
                <a href="tel:+97142527575" className="flex items-center gap-2 font-raleway font-light text-sm text-foreground mb-3">
                  <Phone size={14} /> +971 4 252 7575
                </a>
                <a href="mailto:info@kayarealestate.ae" className="flex items-center gap-2 font-raleway font-light text-sm text-foreground">
                  <Mail size={14} /> info@kayarealestate.ae
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similar.length > 0 && (
        <section className="bg-kaya-light py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="kaya-heading text-2xl text-foreground text-center mb-12">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetails;
