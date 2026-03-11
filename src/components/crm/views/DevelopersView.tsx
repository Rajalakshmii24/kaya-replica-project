import { useEffect, useState, useCallback } from "react";
import { Building, Search, Loader2, ChevronLeft, ChevronRight, FolderPlus, Tag, Home } from "lucide-react";
import { fetchDevelopers } from "@/lib/pixxi";
import { CrmModule } from "../CrmSidebar";

interface DevelopersViewProps {
  onNavigate: (module: CrmModule, filter?: { type: "area" | "developer"; value: string }) => void;
}

const DevelopersView = ({ onNavigate }: DevelopersViewProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");
  const pageSize = 8;

  const loadDevelopers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDevelopers({ name: searchQuery || undefined, page: 1, size: 200 });
      const list = res?.data?.list || res?.data || [];
      setData(Array.isArray(list) ? list : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [searchQuery]);

  useEffect(() => { loadDevelopers(); }, [loadDevelopers]);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  const handleCardClick = (devName: string) => {
    onNavigate("new-projects", { type: "developer", value: devName });
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
        <span>Developers</span>
        <ChevronRight size={12} />
        <span className="text-foreground font-medium">Developers List</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Developers List</h1>
          <p className="font-raleway text-sm text-muted-foreground">{data.length} developers</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-xl p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            onKeyDown={(e) => e.key === "Enter" && loadDevelopers()}
            placeholder="Search developers..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : (
        <>
          {/* Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginated.map((dev: any, idx: number) => {
              const name = dev.name || dev.developerName || "Unknown";
              return (
                <div key={dev.id || idx} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                  <div
                    className="relative h-36 cursor-pointer overflow-hidden bg-muted/50 flex items-center justify-center"
                    onClick={() => handleCardClick(name)}
                  >
                    {dev.logo ? (
                      <img src={dev.logo} alt={name} className="max-h-24 max-w-[80%] object-contain group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-20 h-20 bg-kaya-olive/10 rounded-xl flex items-center justify-center">
                        <Building size={32} className="text-kaya-olive" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-border">
                    <h3 className="font-raleway text-sm font-semibold text-foreground truncate mb-2">{name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCardClick(name)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-kaya-olive/10 text-kaya-olive hover:bg-kaya-olive/20 font-raleway text-[11px] font-medium transition-colors"
                      >
                        <FolderPlus size={12} /> New
                      </button>
                      <button
                        onClick={() => onNavigate("sell-listings")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 font-raleway text-[11px] font-medium transition-colors"
                      >
                        <Tag size={12} /> Sell
                      </button>
                      <button
                        onClick={() => onNavigate("rent-listings")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 font-raleway text-[11px] font-medium transition-colors"
                      >
                        <Home size={12} /> Rent
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {paginated.length === 0 && (
            <div className="text-center py-12">
              <Building size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-raleway text-sm text-muted-foreground">No developers found</p>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border rounded-xl p-3">
          <span className="font-raleway text-xs text-muted-foreground">Total {data.length} ({totalPages} pages)</span>
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

export default DevelopersView;
