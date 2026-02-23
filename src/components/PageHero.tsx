interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
}

const PageHero = ({ title, subtitle, image = "/images/hero-1.webp" }: PageHeroProps) => {
  return (
    <section
      className="relative w-full h-[50vh] min-h-[350px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center px-6">
        <h1 className="kaya-heading-lg text-primary-foreground">{title}</h1>
        {subtitle && (
          <p className="font-raleway font-light text-primary-foreground/80 text-sm tracking-[0.15em] mt-4 uppercase">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
