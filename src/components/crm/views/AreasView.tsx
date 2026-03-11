import { useState, useEffect, useCallback } from "react";
import { MapPin, Search, Plus, Loader2, ChevronLeft, ChevronRight, FolderPlus, Tag, Home } from "lucide-react";
import { searchAreas } from "@/lib/pixxi";
import { CrmModule } from "../CrmSidebar";

const AREA_IMAGES = [
  "/images/hero-1.webp", "/images/hero-2.webp", "/images/downtown-living.webp",
  "/images/marine-living.webp", "/images/residential-community.webp",
  "/images/luxury-apartments.jpg", "/images/design-art.jpg", "/images/about-1.jpg",
];

const defaultAreas = [
  { id: 1, name: "Jumeirah Village Circle (JVC)", newCount: 84, sellCount: 7, rentCount: 1 },
  { id: 2, name: "Dubai Islands", newCount: 61, sellCount: 3, rentCount: 0 },
  { id: 3, name: "Al Marjan Island", newCount: 49, sellCount: 0, rentCount: 0 },
  { id: 4, name: "Dubailand", newCount: 43, sellCount: 1, rentCount: 0 },
  { id: 5, name: "Business Bay", newCount: 34, sellCount: 0, rentCount: 0 },
  { id: 6, name: "Dubai Land Residence Complex", newCount: 28, sellCount: 4, rentCount: 0 },
  { id: 7, name: "Jumeirah Village Triangle (JVT)", newCount: 24, sellCount: 1, rentCount: 0 },
  { id: 8, name: "Dubai Hills Estate", newCount: 25, sellCount: 0, rentCount: 0 },
  { id: 9, name: "Town Square", newCount: 21, sellCount: 2, rentCount: 0 },
  { id: 10, name: "Dubai South", newCount: 20, sellCount: 3, rentCount: 0 },
  { id: 11, name: "Dubai Creek Harbour", newCount: 20, sellCount: 1, rentCount: 0 },
  { id: 12, name: "Al Furjan", newCount: 18, sellCount: 3, rentCount: 0 },
  { id: 13, name: "Downtown Dubai", newCount: 15, sellCount: 2, rentCount: 1 },
  { id: 14, name: "Palm Jumeirah", newCount: 12, sellCount: 5, rentCount: 2 },
  { id: 15, name: "Dubai Marina", newCount: 10, sellCount: 4, rentCount: 3 },
  { id: 16, name: "DAMAC Hills", newCount: 14, sellCount: 1, rentCount: 0 },
];

interface AreasViewProps {
  onNavigate: (module: CrmModule, filter?: { type: "area" | "developer"; value: string }) => void;
}

const AreasView = ({ onNavigate }: AreasViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");
  const pageSize = 8;

  const filtered = searchQuery
    ? defaultAreas.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : defaultAreas;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalItems = filtered.length;

  const handleCardClick = (areaName: string) => {
    onNavigate("new-projects", { type: "area", value: areaName });
  };

  const handleGoToPage = () => {
    const p = parseInt(goToPage);
    if (p >= 1 && p <= totalPages) setPage(p);
    setGoToPage("");
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 font-raleway text-xs text-muted-foreground">
        <span>Home</span>
        <ChevronRight size={12} />
        <span>Areas</span>
        <ChevronRight size={12} />
        <span className="text-foreground font-medium">Areas List</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Areas List</h1>
          <p className="font-raleway text-sm text-muted-foreground">{totalItems} areas</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-xl p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search areas..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {paginated.map((area, idx) => (
          <div key={area.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
            <div
              className="relative h-40 cursor-pointer overflow-hidden"
              onClick={() => handleCardClick(area.name)}
            >
              <img
                src={AREA_IMAGES[idx % AREA_IMAGES.length]}
                alt={area.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-raleway text-sm font-semibold text-white truncate">{area.name}</h3>
              </div>
            </div>
            <div className="p-3 flex items-center gap-2">
              <button
                onClick={() => handleCardClick(area.name)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-kaya-olive/10 text-kaya-olive hover:bg-kaya-olive/20 font-raleway text-[11px] font-medium transition-colors"
              >
                <FolderPlus size={12} /> New <span className="font-bold">{area.newCount}</span>
              </button>
              <button
                onClick={() => onNavigate("sell-listings")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 font-raleway text-[11px] font-medium transition-colors"
              >
                <Tag size={12} /> Sell <span className="font-bold">{area.sellCount}</span>
              </button>
              <button
                onClick={() => onNavigate("rent-listings")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 font-raleway text-[11px] font-medium transition-colors"
              >
                <Home size={12} /> Rent <span className="font-bold">{area.rentCount}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {paginated.length === 0 && (
        <div className="text-center py-12">
          <MapPin size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="font-raleway text-sm text-muted-foreground">No areas found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border rounded-xl p-3">
          <span className="font-raleway text-xs text-muted-foreground">Total {totalItems} ({totalPages} pages)</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = i + 1;
              return (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-md font-raleway text-xs ${page === p ? "bg-kaya-olive text-primary-foreground" : "border border-border hover:bg-muted text-muted-foreground"}`}>{p}</button>
              );
            })}
            {totalPages > 5 && <span className="text-muted-foreground text-xs">...</span>}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40"><ChevronRight size={16} /></button>
            <div className="flex items-center gap-1 ml-2">
              <span className="font-raleway text-xs text-muted-foreground">Go to</span>
              <input
                type="number"
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGoToPage()}
                className="w-12 px-2 py-1 border border-border rounded-md font-raleway text-xs text-center focus:outline-none focus:ring-1 focus:ring-kaya-olive/50"
                min={1}
                max={totalPages}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreasView;
