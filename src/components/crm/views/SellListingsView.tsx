import { useEffect, useState, useCallback } from "react";
import { Tag, Search, Plus, Loader2, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Building2, Download, LayoutGrid, List, FileText, Filter, X } from "lucide-react";
import { fetchListings } from "@/lib/pixxi";
import { CrmModule } from "../CrmSidebar";

const formatPrice = (n: number) => "AED " + n.toLocaleString("en-US");

const statusTabs = ["Active", "Inactive", "Sold", "My"] as const;
const subFilters = ["Available", "District Deal", "Exclusive", "Covered by Owner", "Cash Buyer Only", "External Inventory", "Under Offer"] as const;

type ViewMode = "grid" | "list" | "detailed";

interface SellListingsViewProps {
  onNavigate: (module: CrmModule) => void;
}

const SellListingsView = ({ onNavigate }: SellListingsViewProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<"ASC" | "DESC">("DESC");
  const [activeTab, setActiveTab] = useState<typeof statusTabs[number]>("Active");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterBeds, setFilterBeds] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { listingType: "SELL", page, size: 20, name: searchQuery || undefined, sortType };
      if (filterType) params.propertyType = [filterType];
      if (filterBeds) params.bedRoomNum = [parseInt(filterBeds)];
      if (filterPriceMin) params.startPrice = parseInt(filterPriceMin);
      if (filterPriceMax) params.endPrice = parseInt(filterPriceMax);
      const res = await fetchListings(params);
      setData(res);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, searchQuery, sortType, filterType, filterBeds, filterPriceMin, filterPriceMax]);

  useEffect(() => { load(); }, [load]);

  const listings = data?.data?.list || [];
  const total = data?.data?.totalSize || 0;
  const totalPages = Math.ceil(total / 20);

  const clearFilters = () => {
    setFilterType(""); setFilterBeds(""); setFilterPriceMin(""); setFilterPriceMax(""); setShowFilters(false);
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 font-raleway text-xs text-muted-foreground">
        <span>Home</span><ChevronRight size={12} /><span>Sell Listings</span><ChevronRight size={12} />
        <span className="text-foreground font-medium">Sell List</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Sell Listings</h1>
          <p className="font-raleway text-sm text-muted-foreground">{total} properties for sale</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs font-raleway text-muted-foreground hover:text-foreground"><Download size={14} /> Export</button>
          <button onClick={() => onNavigate("sell-listings-add")} className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90"><Plus size={14} /> Add Sell</button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
        {statusTabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-raleway text-xs font-medium transition-colors ${
              activeTab === tab ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sub-Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {subFilters.map((f) => (
          <span key={f} className="px-3 py-1.5 rounded-full font-raleway text-[11px] border border-border text-muted-foreground">{f}</span>
        ))}
      </div>

      {/* Search + Filters + View Toggle */}
      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search sell listings..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
        </div>
        <select value={sortType} onChange={(e) => setSortType(e.target.value as any)} className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-raleway focus:outline-none">
          <option value="DESC">Newest</option>
          <option value="ASC">Oldest</option>
        </select>
        <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg font-raleway text-xs transition-colors ${showFilters ? "border-kaya-olive bg-kaya-olive/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
          <Filter size={14} /> More Filters
        </button>
        <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-0.5">
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}><LayoutGrid size={14} /></button>
          <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}><List size={14} /></button>
          <button onClick={() => setViewMode("detailed")} className={`p-2 rounded-md transition-colors ${viewMode === "detailed" ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}><FileText size={14} /></button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-end gap-4">
          <div>
            <label className="block font-raleway text-[10px] text-muted-foreground uppercase mb-1">Property Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-raleway">
              <option value="">All Types</option>
              <option value="APARTMENT">Apartment</option><option value="VILLA">Villa</option><option value="TOWNHOUSE">Townhouse</option><option value="PENTHOUSE">Penthouse</option>
            </select>
          </div>
          <div>
            <label className="block font-raleway text-[10px] text-muted-foreground uppercase mb-1">Bedrooms</label>
            <select value={filterBeds} onChange={(e) => setFilterBeds(e.target.value)} className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-raleway">
              <option value="">Any</option><option value="0">Studio</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5+</option>
            </select>
          </div>
          <div>
            <label className="block font-raleway text-[10px] text-muted-foreground uppercase mb-1">Price Min</label>
            <input type="number" value={filterPriceMin} onChange={(e) => setFilterPriceMin(e.target.value)} placeholder="0" className="w-28 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-raleway" />
          </div>
          <div>
            <label className="block font-raleway text-[10px] text-muted-foreground uppercase mb-1">Price Max</label>
            <input type="number" value={filterPriceMax} onChange={(e) => setFilterPriceMax(e.target.value)} placeholder="0" className="w-28 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-raleway" />
          </div>
          <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 text-xs font-raleway text-muted-foreground hover:text-foreground"><X size={12} /> Reset</button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((item: any) => (
            <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 overflow-hidden">
                {item.photos?.[0] ? <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted flex items-center justify-center"><Building2 size={32} className="text-muted-foreground" /></div>}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-green-100 text-green-800">{item.propertyType || "Apartment"}</span>
                  <span className="font-raleway text-sm font-bold text-foreground">{formatPrice(item.price)}</span>
                </div>
                <h3 className="font-raleway text-sm font-medium text-foreground truncate">{item.title}</h3>
                <p className="font-raleway text-[11px] text-muted-foreground mt-0.5">{item.region}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-raleway">
                  <span>{item.bedRooms > 0 ? `${item.bedRooms} BR` : "—"}</span>
                  <span>{item.size > 0 ? `${item.size} sqft` : "—"}</span>
                  <span>{item.agent?.name || "N/A"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "detailed" ? (
        <div className="space-y-4">
          {listings.map((item: any) => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                {item.photos?.[0] ? <img src={item.photos[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted flex items-center justify-center"><Building2 size={24} className="text-muted-foreground" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-raleway text-sm font-semibold text-foreground truncate">{item.title}</h3>
                <p className="font-raleway text-xs text-muted-foreground mb-2">{item.region}</p>
                <span className="font-raleway text-sm font-bold text-foreground">{formatPrice(item.price)}</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-[11px] font-raleway">
                  <div><span className="text-muted-foreground">Beds:</span> <span className="text-foreground">{item.bedRooms > 0 ? item.bedRooms : "—"}</span></div>
                  <div><span className="text-muted-foreground">Size:</span> <span className="text-foreground">{item.size > 0 ? `${item.size} sqft` : "—"}</span></div>
                  <div><span className="text-muted-foreground">Agent:</span> <span className="text-foreground">{item.agent?.name || "N/A"}</span></div>
                  <div><span className="text-muted-foreground">Permit:</span> <span className="text-foreground">{item.permitNumber || "N/A"}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Name</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Stage</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Price</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Rooms</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Size</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Property Type</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Location</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden xl:table-cell">Agent</th>
                  <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings.map((item: any) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.photos?.[0] ? <img src={item.photos[0]} alt="" className="w-12 h-8 object-cover rounded" /> : <div className="w-12 h-8 bg-muted rounded flex items-center justify-center"><Building2 size={14} className="text-muted-foreground" /></div>}
                        <span className="font-raleway text-sm font-medium text-foreground truncate max-w-[180px]">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-green-100 text-green-800">Available</span></td>
                    <td className="px-5 py-3 font-raleway text-sm font-medium text-foreground">{formatPrice(item.price)}</td>
                    <td className="px-5 py-3 hidden md:table-cell font-raleway text-xs text-muted-foreground">{item.bedRooms > 0 ? `${item.bedRooms}` : "—"}</td>
                    <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{item.size > 0 ? `${item.size.toLocaleString()} sqft` : "—"}</td>
                    <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{item.propertyType || "Apartment"}</td>
                    <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{item.region}</td>
                    <td className="px-5 py-3 hidden xl:table-cell font-raleway text-xs text-muted-foreground">{item.agent?.name || "—"}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {listings.length === 0 && <div className="px-5 py-12 text-center"><Tag size={32} className="mx-auto text-muted-foreground mb-2" /><p className="font-raleway text-sm text-muted-foreground">No sell listings found</p></div>}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="font-raleway text-xs text-muted-foreground">Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, total)} of {total}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40"><ChevronLeft size={16} /></button>
            <span className="font-raleway text-sm text-muted-foreground">Page {page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellListingsView;
