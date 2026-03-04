import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { properties } from "@/data/properties";
import { Link } from "react-router-dom";
import { Bed, Bath, Maximize, ChevronDown, Search, LayoutGrid, List, SlidersHorizontal, Phone, Sofa, FileText } from "lucide-react";

const LOCATIONS = ["All Locations", "Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "Business Bay", "Jumeirah Village Circle", "JBR", "Dubai Hills"];
const TYPES = ["All Types", "Apartment", "Villa", "Townhouse", "Penthouse"];
const BEDROOMS = ["Any", "Studio", "1", "2", "3", "4+"];
const FURNISHED_OPTIONS = ["Any", "Furnished", "Semi-Furnished", "Unfurnished"];
const CHEQUES_OPTIONS = ["Any", "1", "2", "4", "6", "12"];
const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low"];

const parsePrice = (p: string) => parseInt(p.replace(/[^0-9]/g, "")) || 0;

const Rent = () => {
  const allRent = properties.filter((p) => p.status === "rent");

  const [location, setLocation] = useState("All Locations");
  const [type, setType] = useState("All Types");
  const [bedrooms, setBedrooms] = useState("Any");
  const [furnished, setFurnished] = useState("Any");
  const [cheques, setCheques] = useState("Any");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [priceMode, setPriceMode] = useState<"yearly" | "monthly">("yearly");

  const filtered = useMemo(() => {
    let result = [...allRent];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }
    if (location !== "All Locations") result = result.filter((p) => p.location === location);
    if (type !== "All Types") result = result.filter((p) => p.type === type);
    if (furnished !== "Any") result = result.filter((p) => p.furnished === furnished);
    if (cheques !== "Any") result = result.filter((p) => p.cheques === parseInt(cheques));
    if (bedrooms !== "Any") {
      if (bedrooms === "Studio") result = result.filter((p) => p.beds === 0);
      else if (bedrooms === "4+") result = result.filter((p) => p.beds >= 4);
      else result = result.filter((p) => p.beds === parseInt(bedrooms));
    }
    if (priceMin) result = result.filter((p) => parsePrice(p.price) >= parseInt(priceMin));
    if (priceMax) result = result.filter((p) => parsePrice(p.price) <= parseInt(priceMax));

    switch (sortBy) {
      case "Price: Low to High": result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
      case "Price: High to Low": result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
    }
    return result;
  }, [allRent, location, type, bedrooms, furnished, cheques, priceMin, priceMax, sortBy, searchQuery]);

  const resetFilters = () => {
    setLocation("All Locations"); setType("All Types"); setBedrooms("Any");
    setFurnished("Any"); setCheques("Any"); setPriceMin(""); setPriceMax(""); setSearchQuery("");
  };

  const displayPrice = (p: typeof allRent[0]) => priceMode === "monthly" && p.priceMonthly ? p.priceMonthly + " /mo" : p.price + " /yr";

  const SelectFilter = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div>
      <label className="block font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none bg-background border border-border px-4 py-3 font-raleway font-light text-sm text-foreground focus:outline-none focus:border-accent pr-10">
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      <PageHero title="Rent Properties" subtitle="Find Your Perfect Rental in Dubai" image="/images/luxury-apartments.jpg" />

      <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 lg:py-20">
        {/* Search & Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search rental properties..."
              className="w-full pl-11 pr-4 py-3 border border-border bg-background font-raleway font-light text-sm focus:outline-none focus:border-accent" />
          </div>
          <div className="flex items-center gap-3">
            {/* Price Toggle */}
            <div className="flex border border-border">
              <button onClick={() => setPriceMode("yearly")} className={`px-4 py-3 font-raleway font-light text-xs tracking-[0.1em] uppercase ${priceMode === "yearly" ? "bg-accent text-accent-foreground" : "hover:bg-secondary"} transition-colors`}>Yearly</button>
              <button onClick={() => setPriceMode("monthly")} className={`px-4 py-3 font-raleway font-light text-xs tracking-[0.1em] uppercase ${priceMode === "monthly" ? "bg-accent text-accent-foreground" : "hover:bg-secondary"} transition-colors`}>Monthly</button>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-3 border border-border font-raleway font-light text-xs tracking-[0.1em] uppercase hover:bg-secondary transition-colors">
              <SlidersHorizontal size={14} /> Filters
            </button>
            <div className="flex border border-border">
              <button onClick={() => setViewMode("grid")} className={`p-3 ${viewMode === "grid" ? "bg-accent text-accent-foreground" : "hover:bg-secondary"} transition-colors`}><LayoutGrid size={16} /></button>
              <button onClick={() => setViewMode("list")} className={`p-3 ${viewMode === "list" ? "bg-accent text-accent-foreground" : "hover:bg-secondary"} transition-colors`}><List size={16} /></button>
            </div>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-background border border-border px-4 py-3 pr-10 font-raleway font-light text-xs tracking-[0.1em] uppercase focus:outline-none">
                {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="border border-border p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <SelectFilter label="Location" value={location} onChange={setLocation} options={LOCATIONS} />
              <SelectFilter label="Property Type" value={type} onChange={setType} options={TYPES} />
              <SelectFilter label="Bedrooms" value={bedrooms} onChange={setBedrooms} options={BEDROOMS} />
              <SelectFilter label="Furnished" value={furnished} onChange={setFurnished} options={FURNISHED_OPTIONS} />
              <SelectFilter label="Cheques" value={cheques} onChange={setCheques} options={CHEQUES_OPTIONS} />
              <div>
                <label className="block font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Min Price (AED)</label>
                <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="Min" className="w-full bg-background border border-border px-4 py-3 font-raleway font-light text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Max Price (AED)</label>
                <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="Max" className="w-full bg-background border border-border px-4 py-3 font-raleway font-light text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>
            <button onClick={resetFilters} className="font-raleway font-light text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors underline">
              Reset All Filters
            </button>
          </div>
        )}

        <p className="font-raleway font-light text-sm text-muted-foreground mb-6">
          Showing <span className="text-foreground font-medium">{filtered.length}</span> rental {filtered.length === 1 ? "property" : "properties"}
        </p>

        {/* Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <div key={p.id} className="group border border-border hover:border-accent transition-colors">
                <Link to={`/property/${p.id}`} className="block">
                  <div className="relative overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {p.furnished && (
                        <span className="bg-accent text-accent-foreground px-3 py-1 font-raleway font-medium text-xs tracking-[0.1em] uppercase flex items-center gap-1">
                          <Sofa size={11} /> {p.furnished}
                        </span>
                      )}
                    </div>
                    {p.cheques && (
                      <span className="absolute top-4 right-4 bg-foreground text-background px-3 py-1 font-raleway font-medium text-xs tracking-[0.1em] uppercase flex items-center gap-1">
                        <FileText size={11} /> {p.cheques} Cheques
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="font-raleway font-light text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">{p.location}</p>
                    <h3 className="font-raleway font-light tracking-[0.1em] text-foreground text-base mb-2">{p.title}</h3>
                    <p className="font-raleway font-medium text-foreground text-lg mb-4">{displayPrice(p)}</p>
                    <div className="flex gap-4 text-muted-foreground border-t border-border pt-4">
                      <span className="flex items-center gap-1 text-xs font-raleway"><Bed size={13} /> {p.beds === 0 ? "Studio" : `${p.beds} BR`}</span>
                      <span className="flex items-center gap-1 text-xs font-raleway"><Bath size={13} /> {p.baths} Baths</span>
                      <span className="flex items-center gap-1 text-xs font-raleway"><Maximize size={13} /> {p.sqft} sqft</span>
                    </div>
                  </div>
                </Link>
                <div className="px-5 pb-5">
                  <a href="tel:+971000000000" className="flex items-center justify-center gap-2 w-full py-3 border border-border font-raleway font-light text-xs tracking-[0.1em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Phone size={13} /> Contact Agent
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="group flex flex-col md:flex-row border border-border hover:border-accent transition-colors">
                <Link to={`/property/${p.id}`} className="flex flex-col md:flex-row flex-1">
                  <div className="relative overflow-hidden md:w-72 flex-shrink-0">
                    <img src={p.image} alt={p.title} className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    {p.furnished && (
                      <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 font-raleway font-medium text-xs tracking-[0.1em] uppercase">{p.furnished}</span>
                    )}
                  </div>
                  <div className="p-5 flex-1">
                    <p className="font-raleway font-light text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">{p.location}</p>
                    <h3 className="font-raleway font-light tracking-[0.1em] text-foreground text-lg mb-2">{p.title}</h3>
                    <p className="font-raleway font-medium text-foreground text-lg mb-3">{displayPrice(p)}</p>
                    <div className="flex flex-wrap gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1 text-xs font-raleway"><Bed size={13} /> {p.beds === 0 ? "Studio" : `${p.beds} BR`}</span>
                      <span className="flex items-center gap-1 text-xs font-raleway"><Bath size={13} /> {p.baths} Baths</span>
                      <span className="flex items-center gap-1 text-xs font-raleway"><Maximize size={13} /> {p.sqft} sqft</span>
                      {p.cheques && <span className="flex items-center gap-1 text-xs font-raleway"><FileText size={13} /> {p.cheques} Cheques</span>}
                    </div>
                  </div>
                </Link>
                <div className="p-5 flex items-end md:items-center">
                  <a href="tel:+971000000000" className="flex items-center gap-2 px-6 py-3 border border-border font-raleway font-light text-xs tracking-[0.1em] uppercase hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap">
                    <Phone size={13} /> Contact Agent
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="text-center font-raleway font-light text-muted-foreground py-16">
            No rental properties match your filters.
          </p>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Rent;
