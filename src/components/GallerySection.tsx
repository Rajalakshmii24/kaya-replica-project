import { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = Array.from({ length: 16 }, (_, i) => ({
  thumb: `/images/gallery/${i + 1}.webp`,
  full: `/images/gallery/${i + 1}.webp`,
}));

const GallerySection = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null
    );
  const next = () =>
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % galleryImages.length : null
    );

  return (
    <>
      <section className="w-full bg-kaya-light py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-8"
        >
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left text */}
            <div className="lg:w-2/5 flex flex-col justify-center">
              <h2 className="kaya-heading text-2xl md:text-3xl text-foreground mb-6">
                Project Gallery
              </h2>
              <p className="kaya-body text-sm md:text-base mb-8">
                Explore our Project Gallery to discover a curated showcase of our
                finest real estate developments. From luxurious interiors to modern
                architectural designs, each project reflects our commitment to
                quality, innovation, and timeless style.
              </p>
              <a href="/properties" className="kaya-btn inline-flex self-start items-center gap-3">
                <span>View 52 Photos</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 25 22"
                  className="w-5 h-4 fill-current"
                >
                  <g>
                    <path d="M0,9.9l13.7,0.1l0,1.3L0,11.2L0,9.9z M13.5,21l9.6-10.3L12.9,1l0.9-1L25,10.7L14.5,22L13.5,21z" />
                  </g>
                </svg>
              </a>
            </div>

            {/* Right grid */}
            <div className="lg:w-3/5">
              <div className="gallery-grid">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => openLightbox(i)}
                    className="aspect-square overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={img.thumb}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-6 right-6 text-primary-foreground z-10"
          >
            <X size={32} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 text-primary-foreground z-10"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 text-primary-foreground z-10"
          >
            <ChevronRight size={40} />
          </button>
          <img
            src={galleryImages[lightboxIndex].full}
            alt={`Gallery ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default GallerySection;
