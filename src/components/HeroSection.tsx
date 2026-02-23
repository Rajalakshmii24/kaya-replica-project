const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Slideshow backgrounds */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center hero-slide-1"
          style={{ backgroundImage: "url('/images/hero-1.webp')" }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center hero-slide-2"
          style={{ backgroundImage: "url('/images/hero-2.webp')" }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <h1 className="text-primary-foreground kaya-heading-lg text-center">
          Your Trusted Real Estate Partner
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
