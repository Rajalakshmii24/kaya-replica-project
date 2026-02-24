import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const images = Array.from({ length: 16 }, (_, i) => `/images/gallery/${i + 1}.webp`);

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const prev = () => setLightboxIndex((i) => i !== null ? (i - 1 + images.length) % images.length : null);
  const next = () => setLightboxIndex((i) => i !== null ? (i + 1) % images.length : null);

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="Gallery" subtitle="View All 52 Photos" image="/images/design-art.jpg" />

      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setLightboxIndex(i)}
              className="aspect-square overflow-hidden group cursor-pointer"
            >
              <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
            </motion.button>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }} className="absolute top-6 right-6 text-primary-foreground z-10"><X size={32} /></button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-primary-foreground z-10"><ChevronLeft size={40} /></button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-primary-foreground z-10"><ChevronRight size={40} /></button>
          <img src={images[lightboxIndex]} alt={`Photo ${lightboxIndex + 1}`} className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
