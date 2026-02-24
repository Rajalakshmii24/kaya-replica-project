import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, ArrowUpDown, Building2, Home as HomeIcon,
  MapPin, Calendar, X, RotateCcw
} from "lucide-react";
import {
  popularAreas, saleTransactions, rentalTransactions,
  marketStats, developers, type Transaction, type RentalTransaction
} from "@/data/marketData";

const formatPrice = (n: number) =>
  "AED " + n.toLocaleString("en-US");

const timePeriods = ["YTD", "7D", "1M", "3M", "6M", "1Y"];
const propertyTypes = ["All", "Apartment", "Villa", "Plot", "Commercial"];
const bedOptions = ["All", "Studio", "1 Bed", "2 Beds", "3 Beds", "4 Beds", "5+ Beds"];
const statusOptions = ["All", "Ready", "Off-plan"];
const soldByOptions = ["All", "Developer", "Resale"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "High price", value: "high" },
  { label: "Low price", value: "low" },
];

const CurrentMarket = () => {
  const [activeTab, setActiveTab] = useState<"sales" | "rental">("sales");
  const [timePeriod, setTimePeriod] = useState("7D");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState("All");
  const [filterBeds, setFilterBeds] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSoldBy, setFilterSoldBy] = useState("All");

  const resetFilters = () => {
    setFilterType("All");
    setFilterBeds("All");
    setFilterStatus("All");
    setFilterSoldBy("All");
    setSearchQuery("");
  };

  const filteredSales = useMemo(() => {
    let data = [...saleTransactions];
    if (searchQuery) data = data.filter(t => t.location.toLowerCase().includes(searchQuery.toLowerCase()) || t.area.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterType !== "All") data = data.filter(t => t.type === filterType);
    if (filterBeds !== "All") data = data.filter(t => t.beds === filterBeds);
    if (filterStatus !== "All") data = data.filter(t => t.status === filterStatus);
    if (filterSoldBy !== "All") data = data.filter(t => t.soldBy === filterSoldBy);
    if (sortBy === "newest") data.sort((a, b) => b.id - a.id);
    if (sortBy === "oldest") data.sort((a, b) => a.id - b.id);
    if (sortBy === "high") data.sort((a, b) => b.price - a.price);
    if (sortBy === "low") data.sort((a, b) => a.price - b.price);
    return data;
  }, [searchQuery, filterType, filterBeds, filterStatus, filterSoldBy, sortBy]);

  const filteredRentals = useMemo(() => {
    let data = [...rentalTransactions];
    if (searchQuery) data = data.filter(t => t.location.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterType !== "All") data = data.filter(t => t.type === filterType);
    if (filterBeds !== "All") data = data.filter(t => t.beds === filterBeds);
    return data;
  }, [searchQuery, filterType, filterBeds]);

  const ITEMS_PER_PAGE = 10;
  const currentSales = filteredSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const currentRentals = filteredRentals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil((activeTab === "sales" ? filteredSales.length : filteredRentals.length) / ITEMS_PER_PAGE);

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />

      {/* Hero / Search Bar */}
      <section className="pt-24 pb-6 bg-kaya-olive">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="font-raleway font-light text-primary-foreground text-2xl md:text-3xl tracking-[0.1em] mb-6">
            Dubai Real Estate Market
          </h1>

          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search by area, community or project..."
                className="w-full pl-11 pr-4 py-3 bg-background text-foreground font-raleway text-sm rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-kaya-gold"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-background text-foreground font-raleway text-sm rounded-md border border-border hover:bg-muted transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <button className="px-6 py-3 bg-kaya-gold text-kaya-olive font-raleway font-medium text-sm rounded-md hover:bg-kaya-gold/90 transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <motion.section
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-card border-b border-border"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-raleway font-medium text-foreground text-sm tracking-wide">Filters</h3>
              <div className="flex gap-3">
                <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-raleway">
                  <RotateCcw size={12} /> Reset
                </button>
                <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Property Type */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground mb-1.5 tracking-wide uppercase">Property Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {propertyTypes.map(t => (
                    <button key={t} onClick={() => { setFilterType(t); setCurrentPage(1); }}
                      className={`px-3 py-1.5 text-xs font-raleway rounded-md border transition-colors ${filterType === t ? "bg-kaya-olive text-primary-foreground border-kaya-olive" : "bg-background text-foreground border-border hover:bg-muted"}`}
                    >{t}</button>
                  ))}
                </div>
              </div>
              {/* Beds */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground mb-1.5 tracking-wide uppercase">Beds</label>
                <div className="flex flex-wrap gap-1.5">
                  {bedOptions.map(b => (
                    <button key={b} onClick={() => { setFilterBeds(b); setCurrentPage(1); }}
                      className={`px-3 py-1.5 text-xs font-raleway rounded-md border transition-colors ${filterBeds === b ? "bg-kaya-olive text-primary-foreground border-kaya-olive" : "bg-background text-foreground border-border hover:bg-muted"}`}
                    >{b}</button>
                  ))}
                </div>
              </div>
              {/* Status */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground mb-1.5 tracking-wide uppercase">Status</label>
                <div className="flex flex-wrap gap-1.5">
                  {statusOptions.map(s => (
                    <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                      className={`px-3 py-1.5 text-xs font-raleway rounded-md border transition-colors ${filterStatus === s ? "bg-kaya-olive text-primary-foreground border-kaya-olive" : "bg-background text-foreground border-border hover:bg-muted"}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
              {/* Sold By */}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground mb-1.5 tracking-wide uppercase">Sold By</label>
                <div className="flex flex-wrap gap-1.5">
                  {soldByOptions.map(s => (
                    <button key={s} onClick={() => { setFilterSoldBy(s); setCurrentPage(1); }}
                      className={`px-3 py-1.5 text-xs font-raleway rounded-md border transition-colors ${filterSoldBy === s ? "bg-kaya-olive text-primary-foreground border-kaya-olive" : "bg-background text-foreground border-border hover:bg-muted"}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Area Tabs - Horizontal scrollable */}
      <section className="border-b border-border bg-card overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-1 py-2">
          <button className="flex items-center text-muted-foreground hover:text-foreground p-1"><ChevronLeft size={16} /></button>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {popularAreas.slice(0, 10).map(area => (
              <button
                key={area.slug}
                onClick={() => { setSearchQuery(area.name); setCurrentPage(1); }}
                className="whitespace-nowrap px-3 py-2 text-xs font-raleway text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {area.name} ({area.transactions.toLocaleString()})
              </button>
            ))}
          </div>
          <button className="flex items-center text-muted-foreground hover:text-foreground p-1"><ChevronRight size={16} /></button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Time Period + Stats */}
        <div className="mb-8">
          {/* Time period selector */}
          <div className="flex items-center gap-1 mb-2">
            {timePeriods.map(p => (
              <button key={p} onClick={() => setTimePeriod(p)}
                className={`px-3 py-1.5 text-xs font-raleway rounded-md transition-colors ${timePeriod === p ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >{p}</button>
            ))}
          </div>
          <p className="font-raleway text-xs text-muted-foreground mb-6">(18 Feb, 2026 to 24 Feb, 2026)</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-5 text-center">
              <p className="font-raleway text-xs text-muted-foreground tracking-wide uppercase mb-2">Median Price</p>
              <p className="font-raleway font-medium text-foreground text-xl md:text-2xl">{formatPrice(marketStats.medianPrice)}</p>
              <span className={`inline-flex items-center gap-1 mt-2 text-xs font-raleway font-medium ${marketStats.medianPriceChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                {marketStats.medianPriceChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {marketStats.medianPriceChange >= 0 ? "+" : ""}{marketStats.medianPriceChange}%
              </span>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 text-center">
              <p className="font-raleway text-xs text-muted-foreground tracking-wide uppercase mb-2">Median Price /sqft</p>
              <p className="font-raleway font-medium text-foreground text-xl md:text-2xl">AED {marketStats.medianPriceSqft.toLocaleString()}</p>
              <span className={`inline-flex items-center gap-1 mt-2 text-xs font-raleway font-medium ${marketStats.medianPriceSqftChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                {marketStats.medianPriceSqftChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {marketStats.medianPriceSqftChange}%
              </span>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 text-center">
              <p className="font-raleway text-xs text-muted-foreground tracking-wide uppercase mb-2">Transactions</p>
              <p className="font-raleway font-medium text-foreground text-xl md:text-2xl">{marketStats.totalTransactions.toLocaleString()}</p>
              <span className={`inline-flex items-center gap-1 mt-2 text-xs font-raleway font-medium ${marketStats.transactionsChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                {marketStats.transactionsChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {marketStats.transactionsChange}%
              </span>
            </div>
          </div>
        </div>

        {/* Sales / Rental Tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            <button onClick={() => { setActiveTab("sales"); setCurrentPage(1); }}
              className={`px-5 py-2 font-raleway text-sm rounded-md transition-colors ${activeTab === "sales" ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >Sales</button>
            <button onClick={() => { setActiveTab("rental"); setCurrentPage(1); }}
              className={`px-5 py-2 font-raleway text-sm rounded-md transition-colors ${activeTab === "rental" ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >Rental</button>
          </div>

          {/* Sort */}
          <div className="relative">
            <button onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-raleway text-muted-foreground hover:text-foreground border border-border rounded-md"
            >
              <ArrowUpDown size={14} />
              {sortOptions.find(s => s.value === sortBy)?.label}
              <ChevronDown size={12} />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg z-10 min-w-[140px]">
                {sortOptions.map(opt => (
                  <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                    className={`block w-full text-left px-4 py-2 text-xs font-raleway hover:bg-muted transition-colors ${sortBy === opt.value ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >{opt.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sales Table */}
        {activeTab === "sales" && (
          <div className="border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-muted/50 border-b border-border">
              <div>
                <p className="font-raleway text-xs font-medium text-foreground">Location</p>
                <p className="font-raleway text-[10px] text-muted-foreground">Status</p>
              </div>
              <div className="text-center">
                <p className="font-raleway text-xs font-medium text-foreground">Price</p>
              </div>
              <div className="text-center">
                <p className="font-raleway text-xs font-medium text-foreground">Specs</p>
              </div>
              <div className="text-center">
                <p className="font-raleway text-xs font-medium text-foreground">Date</p>
                <p className="font-raleway text-[10px] text-muted-foreground">Sold by</p>
              </div>
            </div>
            {/* Table Rows */}
            {currentSales.length === 0 && (
              <div className="px-5 py-12 text-center">
                <p className="font-raleway text-sm text-muted-foreground">No transactions match your filters.</p>
              </div>
            )}
            {currentSales.map((t) => (
              <div key={t.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-2 md:gap-4 px-5 py-4 border-b border-border hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-raleway text-sm text-foreground font-medium">{t.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-raleway rounded ${t.status === "Off-plan" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                      {t.status}
                    </span>
                    <span className="text-[10px] font-raleway text-muted-foreground">{t.type}</span>
                    {t.isNew && <span className="inline-block px-1.5 py-0.5 text-[10px] font-raleway bg-blue-100 text-blue-800 rounded">New</span>}
                  </div>
                </div>
                <div className="text-left md:text-center">
                  <p className="font-raleway text-sm font-medium text-foreground">{formatPrice(t.price)}</p>
                  <p className="font-raleway text-[10px] text-muted-foreground">AED {t.pricePerSqft.toLocaleString()} /sqft</p>
                </div>
                <div className="text-left md:text-center">
                  <p className="font-raleway text-sm text-foreground">{t.sqft.toLocaleString()} sqft</p>
                  <p className="font-raleway text-[10px] text-muted-foreground">{t.beds}</p>
                </div>
                <div className="text-left md:text-center">
                  <p className="font-raleway text-sm text-foreground">{t.date}</p>
                  <p className="font-raleway text-[10px] text-muted-foreground">{t.soldBy}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rental Table */}
        {activeTab === "rental" && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-muted/50 border-b border-border">
              <div><p className="font-raleway text-xs font-medium text-foreground">Location</p></div>
              <div className="text-center"><p className="font-raleway text-xs font-medium text-foreground">Specs</p></div>
              <div className="text-center">
                <p className="font-raleway text-xs font-medium text-foreground">Rental (AED)</p>
                <p className="font-raleway text-[10px] text-muted-foreground">Yield</p>
              </div>
              <div className="text-center"><p className="font-raleway text-xs font-medium text-foreground">Duration</p></div>
            </div>
            {currentRentals.length === 0 && (
              <div className="px-5 py-12 text-center">
                <p className="font-raleway text-sm text-muted-foreground">No rentals match your filters.</p>
              </div>
            )}
            {currentRentals.map((t) => (
              <div key={t.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-2 md:gap-4 px-5 py-4 border-b border-border hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-raleway text-sm text-foreground font-medium">{t.location}</p>
                  <p className="text-[10px] font-raleway text-muted-foreground">{t.type}</p>
                </div>
                <div className="text-left md:text-center">
                  <p className="font-raleway text-sm text-foreground">{t.beds}</p>
                  <p className="font-raleway text-[10px] text-muted-foreground">{t.sqft.toLocaleString()} sqft</p>
                </div>
                <div className="text-left md:text-center">
                  <p className="font-raleway text-sm font-medium text-foreground">{t.rental.toLocaleString()}</p>
                  {t.rentalYield && (
                    <span className="text-[10px] font-raleway text-green-600 font-medium">+{t.rentalYield}%</span>
                  )}
                </div>
                <div className="text-left md:text-center">
                  <p className="font-raleway text-xs text-foreground">{t.startDate} – {t.endDate}</p>
                  <p className="font-raleway text-[10px] text-muted-foreground">{t.duration}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 text-xs font-raleway rounded-md transition-colors ${currentPage === p ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >{p}</button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
              className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Popular Searches */}
        <section className="mt-16 mb-12">
          <h2 className="font-raleway font-light text-foreground text-xl tracking-[0.1em] mb-6">
            Popular Searches in 2025
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularAreas.map(area => (
              <button key={area.slug}
                onClick={() => { setSearchQuery(area.name); setCurrentPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={14} className="text-muted-foreground group-hover:text-kaya-gold transition-colors" />
                  <span className="font-raleway text-sm text-foreground">{area.name}</span>
                </div>
                <span className="font-raleway text-xs text-muted-foreground">{area.transactions.toLocaleString()} Sales</span>
              </button>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-kaya-olive rounded-lg p-8 md:p-12 text-center mb-12">
          <h2 className="font-raleway font-light text-primary-foreground text-xl md:text-2xl tracking-[0.1em] mb-3">
            Ready to make your move?
          </h2>
          <p className="font-raleway font-light text-primary-foreground/70 text-sm mb-6">
            You've seen the numbers for Dubai. Let's turn insights into action.
          </p>
          <a href="/contact" className="kaya-btn-outline inline-block">
            Get in Touch
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CurrentMarket;
