import { useEffect, useState, useCallback } from "react";
import { Tag, Search, Plus, Loader2, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Building2, Download } from "lucide-react";
import { fetchListings } from "@/lib/pixxi";

const formatPrice = (n: number) => "AED " + n.toLocaleString("en-US");

const SellListingsView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<"ASC" | "DESC">("DESC");
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchListings({ listingType: "SELL", page, size: 20, name: searchQuery || undefined, sortType });
      setData(res);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, searchQuery, sortType]);

  useEffect(() => { load(); }, [load]);

  const listings = data?.data?.list || [];
  const total = data?.data?.totalSize || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Sell Listings</h1>
          <p className="font-raleway text-sm text-muted-foreground">{total} properties for sale</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs font-raleway text-muted-foreground hover:text-foreground"><Download size={14} /> Export</button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90"><Plus size={14} /> Add Sell</button>
        </div>
      </div>

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
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Property</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Location</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Price</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Beds</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Size</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Agent</th>
                  <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings.map((item: any) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.photos?.[0] ? <img src={item.photos[0]} alt="" className="w-12 h-8 object-cover rounded" /> : <div className="w-12 h-8 bg-muted rounded flex items-center justify-center"><Building2 size={14} className="text-muted-foreground" /></div>}
                        <span className="font-raleway text-sm font-medium text-foreground truncate max-w-[200px]">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell font-raleway text-xs text-muted-foreground">{item.region}</td>
                    <td className="px-5 py-3 font-raleway text-sm font-medium text-foreground">{formatPrice(item.price)}</td>
                    <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{item.bedRooms > 0 ? `${item.bedRooms} BR` : "—"}</td>
                    <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{item.size > 0 ? `${item.size.toLocaleString()} sqft` : "—"}</td>
                    <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{item.agent?.name || "—"}</td>
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

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-raleway text-lg font-medium text-foreground mb-4">Add Sell Listing</h2>
            <div className="space-y-4">
              {["Property Title", "Location / Area", "Price (AED)", "Bedrooms", "Bathrooms", "Size (sqft)", "Property Type", "Reference Number"].map((label) => (
                <div key={label}>
                  <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</label>
                  <input className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
                </div>
              ))}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Description</label>
                <textarea className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50 h-24 resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 font-raleway text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-sm font-medium hover:bg-kaya-olive/90">Save Listing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellListingsView;
