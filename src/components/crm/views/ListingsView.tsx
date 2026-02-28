import { useEffect, useState, useCallback } from "react";
import {
  Building2, Search, ChevronLeft, ChevronRight, RefreshCw, Plus,
  Loader2, Eye, Edit, Trash2, Grid3X3, List, Filter,
} from "lucide-react";
import { fetchListings } from "@/lib/pixxi";

const formatPrice = (n: number) => "AED " + n.toLocaleString("en-US");

const ListingsView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [listingType, setListingType] = useState<"SELL" | "RENT" | "NEW">("SELL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortType, setSortType] = useState<"ASC" | "DESC">("DESC");

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchListings({
        listingType, page, size: 20, name: searchQuery || undefined, sortType,
      });
      setData(res);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [listingType, page, searchQuery, sortType]);

  useEffect(() => { loadListings(); }, [loadListings]);

  const listings = data?.data?.list || [];
  const total = data?.data?.totalSize || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Properties</h1>
          <p className="font-raleway text-sm text-muted-foreground">{total} total listings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90">
          <Plus size={14} /> Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadListings()}
            placeholder="Search properties..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
        </div>
        <div className="flex gap-1">
          {([
            { label: "For Sale", value: "SELL" as const },
            { label: "For Rent", value: "RENT" as const },
            { label: "Off Plan", value: "NEW" as const },
          ]).map((t) => (
            <button key={t.value}
              onClick={() => { setListingType(t.value); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-raleway rounded-md transition-colors ${
                listingType === t.value ? "bg-kaya-olive text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <select value={sortType} onChange={(e) => setSortType(e.target.value as "ASC" | "DESC")}
          className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-raleway focus:outline-none">
          <option value="DESC">Newest</option>
          <option value="ASC">Oldest</option>
        </select>
        <div className="flex gap-1 border border-border rounded-lg overflow-hidden">
          <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Grid3X3 size={16} />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((item: any) => (
            <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-44">
                {item.photos?.[0] ? (
                  <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Building2 size={32} className="text-muted-foreground" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-raleway font-medium bg-kaya-olive text-primary-foreground rounded">
                  {item.listingType}
                </span>
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-card/90 rounded hover:bg-card"><Eye size={12} /></button>
                  <button className="p-1.5 bg-card/90 rounded hover:bg-card"><Edit size={12} /></button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-raleway text-sm font-medium text-foreground truncate">{item.title}</h3>
                <p className="font-raleway text-xs text-muted-foreground mt-1">{item.region}, {item.cityName}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="font-raleway text-sm font-semibold text-foreground">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-raleway">
                    {item.bedRooms > 0 && <span>{item.bedRooms} BR</span>}
                    {item.size > 0 && <span>{item.size.toLocaleString()} sqft</span>}
                  </div>
                </div>
                {item.agent && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    {item.agent.avatar && <img src={item.agent.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />}
                    <span className="font-raleway text-xs text-muted-foreground">{item.agent.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Property</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Location</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Price</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Type</th>
                <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map((item: any) => (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {item.photos?.[0] ? (
                        <img src={item.photos[0]} alt="" className="w-12 h-8 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center"><Building2 size={14} className="text-muted-foreground" /></div>
                      )}
                      <span className="font-raleway text-sm text-foreground truncate max-w-[200px]">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell font-raleway text-xs text-muted-foreground">{item.region}</td>
                  <td className="px-5 py-3 font-raleway text-sm font-medium text-foreground">{formatPrice(item.price)}</td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-kaya-olive/10 text-kaya-olive">{item.listingType}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {listings.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="font-raleway text-sm text-muted-foreground">No listings found</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="font-raleway text-xs text-muted-foreground">
            Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40"><ChevronLeft size={16} /></button>
            <span className="font-raleway text-sm text-muted-foreground">Page {page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsView;
