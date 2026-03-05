import { useEffect, useState, useCallback } from "react";
import { Building, Search, Plus, Loader2, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchDevelopers } from "@/lib/pixxi";

const DevelopersView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const loadDevelopers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDevelopers({ name: searchQuery || undefined, page, size: pageSize });
      const list = res?.data?.list || res?.data || [];
      setData(Array.isArray(list) ? list : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [searchQuery, page]);

  useEffect(() => { loadDevelopers(); }, [loadDevelopers]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Developers</h1>
          <p className="font-raleway text-sm text-muted-foreground">{data.length} developers</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90">
          <Plus size={14} /> Add Developer
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadDevelopers()}
            placeholder="Search developers..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">#</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Developer</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Logo</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Status</th>
                  <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((dev: any, idx: number) => (
                  <tr key={dev.id || idx} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-raleway text-sm text-muted-foreground">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Building size={14} className="text-kaya-olive" />
                        <span className="font-raleway text-sm font-medium text-foreground">{dev.name || dev.developerName || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      {dev.logo ? (
                        <img src={dev.logo} alt="" className="w-8 h-8 object-contain rounded" />
                      ) : (
                        <span className="font-raleway text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-green-100 text-green-800">Active</span>
                    </td>
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
          {data.length === 0 && (
            <div className="px-5 py-12 text-center">
              <Building size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-raleway text-sm text-muted-foreground">No developers found</p>
            </div>
          )}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card border border-border rounded-xl w-full max-w-md mx-4 p-6 shadow-xl">
            <h2 className="font-raleway text-lg font-medium text-foreground mb-4">Add Developer</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Developer Name</label>
                <input className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" placeholder="e.g. Emaar Properties" />
              </div>
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Logo URL</label>
                <input className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" placeholder="https://..." />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 font-raleway text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-sm font-medium hover:bg-kaya-olive/90">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevelopersView;
