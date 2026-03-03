import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Download, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const catalogs = [
  {
    id: 1,
    month: "March 2025",
    title: "10 Curated Projects in Dubai",
    description:
      "Discover premium properties with prices from $127,000: 1% monthly payments, private pools and artificial beaches, household appliances and furniture included.",
    image: "/images/downtown-living.webp",
    highlights: ["1% Monthly Payments", "Private Pools", "Fully Furnished"],
  },
  {
    id: 2,
    month: "February 2025",
    title: "High ROI Investment Opportunities",
    description:
      "Explore 10 handpicked projects with post-handover up to 6 years, residences on Palm Jumeirah, branded hotel apartments with 5-star service.",
    image: "/images/marine-living.webp",
    highlights: ["Post-Handover 6 Years", "Palm Jumeirah", "Branded Residences"],
  },
  {
    id: 3,
    month: "January 2025",
    title: "Luxury Living Collection",
    description:
      "Convertible apartments, appliances, furniture, post-handover up to 6.5 years, and 1% monthly payments across Dubai's most sought-after communities.",
    image: "/images/luxury-apartments.jpg",
    highlights: ["Convertible Layouts", "6.5 Year Plans", "Premium Communities"],
  },
  {
    id: 4,
    month: "December 2024",
    title: "Year-End Exclusive Portfolio",
    description:
      "Special year-end collection featuring waterfront residences, golf course villas, and downtown penthouses with exclusive payment plans.",
    image: "/images/residential-community.webp",
    highlights: ["Waterfront Living", "Golf Villas", "Downtown Penthouses"],
  },
];

const expertSections = [
  {
    title: "KAYA Insights",
    description:
      "Listen to expert insights from our real estate consultants and stay up to date on the Dubai property market: latest news, expert advice, and investment strategies.",
    image: "/images/hero-1.webp",
    linkText: "View All Insights",
    linkTo: "/contact",
  },
  {
    title: "KAYA Market Reports",
    description:
      "In-depth analysis of Dubai's real estate market with data-driven reports covering price trends, rental yields, and emerging investment hotspots.",
    image: "/images/hero-2.webp",
    linkText: "View Reports",
    linkTo: "/contact",
  },
];

const Catalogs = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero
        title="Catalogs"
        subtitle="Best Projects of the Month"
        image="/images/design-art.jpg"
      />

      {/* Catalogs Grid */}
      <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="kaya-heading text-2xl md:text-3xl text-foreground mb-4">
            Monthly Property Catalogs
          </h2>
          <p className="kaya-body text-sm max-w-2xl mx-auto">
            Explore our curated monthly catalogs featuring the best investment opportunities
            in Dubai's real estate market, handpicked by KAYA Real Estate experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {catalogs.map((catalog) => (
            <div key={catalog.id} className="group">
              <div className="overflow-hidden mb-5 relative">
                <img
                  src={catalog.image}
                  alt={catalog.title}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-card/95 text-foreground font-raleway text-xs tracking-[0.1em] uppercase hover:bg-card transition-colors">
                      <Download size={14} />
                      Download
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-card/95 text-foreground font-raleway text-xs tracking-[0.1em] uppercase hover:bg-card transition-colors">
                      <Eye size={14} />
                      Preview
                    </button>
                  </div>
                </div>
              </div>
              <p className="font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">
                {catalog.month}
              </p>
              <h3 className="font-raleway font-light tracking-[0.1em] text-lg text-foreground mb-2">
                {catalog.title}
              </h3>
              <p className="kaya-body text-sm mb-4">{catalog.description}</p>
              <div className="flex flex-wrap gap-2">
                {catalog.highlights.map((h) => (
                  <span
                    key={h}
                    className="px-3 py-1 border border-border font-raleway text-[10px] tracking-[0.1em] uppercase text-muted-foreground"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expert Insights Section */}
      <section className="w-full bg-kaya-olive py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="font-raleway font-light tracking-[0.2em] text-xl md:text-2xl text-primary-foreground uppercase mb-4">
              Expert Real Estate Insights
            </h2>
            <p className="font-raleway font-light text-sm text-primary-foreground/80 max-w-2xl mx-auto">
              Discover the insider knowledge of Dubai real estate from KAYA Real Estate:
              expert analysis and in-depth information on the city and its property market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {expertSections.map((section) => (
              <div key={section.title} className="group">
                <div className="overflow-hidden mb-5">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-raleway font-light tracking-[0.15em] text-lg text-primary-foreground uppercase mb-2">
                  {section.title}
                </h3>
                <p className="font-raleway font-light text-sm text-primary-foreground/80 mb-4 leading-relaxed">
                  {section.description}
                </p>
                <Link
                  to={section.linkTo}
                  className="inline-flex items-center gap-2 font-raleway font-light text-xs tracking-[0.1em] uppercase text-primary-foreground border-b border-primary-foreground/40 pb-1 hover:border-primary-foreground transition-colors"
                >
                  {section.linkText}
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-8 py-16 lg:py-24 text-center">
        <h2 className="kaya-heading text-xl md:text-2xl text-foreground mb-4">
          Request a Custom Catalog
        </h2>
        <p className="kaya-body text-sm max-w-xl mx-auto mb-8">
          Looking for specific property types or investment criteria? Our team at KAYA Real Estate
          can prepare a personalized catalog tailored to your requirements.
        </p>
        <Link to="/contact" className="kaya-btn">
          Contact Us
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Catalogs;
