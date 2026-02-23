const lifestyleCards = [
  { image: "/images/downtown-living.webp", label: "Downtown Living" },
  { image: "/images/marine-living.webp", label: "Marine Living" },
  { image: "/images/residential-community.webp", label: "Residential Community" },
];

const LifestyleSection = () => {
  return (
    <section className="w-full bg-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lifestyleCards.map((card) => (
            <div key={card.label} className="group overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={card.image}
                  alt={card.label}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="mt-4 text-center font-raleway font-light tracking-[0.15em] text-sm text-foreground">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
