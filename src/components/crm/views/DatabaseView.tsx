import { useEffect, useState, useCallback } from "react";
import { Database, Search, Loader2, Eye, Download, ChevronLeft, ChevronRight, Users, Building2, Receipt } from "lucide-react";
import { fetchLeads, fetchListings } from "@/lib/pixxi";

const DatabaseView = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"leads" | "properties" | "transactions">("leads");
  const [leads, setLeads] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totals, setTotals] = useState({ leads: 0, properties: 0 });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, propsRes] = await Promise.all([
        fetchLeads({ page, size: 20 }),
        fetchListings({ page, size: 20 }),
      ]);
      setLeads(leadsRes?.data?.list || []);
      setProperties(propsRes?.data?.list || []);
      setTotals({ leads: leadsRes?.data?.total || 0, properties: propsRes?.data?.totalSize || 0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { loadData(); }, [loadData]);

  const tabs = [
    { key: "leads" as const, label: "Leads", icon: <Users size={14} />, count: totals.leads },
    { key: "properties" as const, label: "Properties", icon: <Building2 size={14} />, count: totals.properties },
    { key: "transactions" as const, label: "Transactions", icon: <Receipt size={14} />, count: 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Database</h1>
          <p className="font-raleway text-sm text-muted-foreground">Complete CRM database overview</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs font-raleway text-muted-foreground hover:text-foreground"><Download size={14} /> Export All</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`bg-card border rounded-lg p-4 text-left transition-colors ${activeTab === t.key ? "border-kaya-olive bg-kaya-olive/5" : "border-border hover:bg-muted/30"}`}>
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">{t.icon}<span className="font-raleway text-xs">{t.label}</span></div>
            <p className="font-raleway text-2xl font-semibold text-foreground">{t.count.toLocaleString()}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`} className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : activeTab === "leads" ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Name</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Phone</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Type</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Status</th>
                  <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.filter((l: any) => !searchQuery || (l.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3 font-raleway text-sm text-foreground">{lead.name || "—"}</td>
                    <td className="px-5 py-3 hidden md:table-cell font-raleway text-xs text-muted-foreground">{lead.email || "—"}</td>
                    <td className="px-5 py-3 hidden md:table-cell font-raleway text-xs text-muted-foreground">{lead.phone || "—"}</td>
                    <td className="px-5 py-3 font-raleway text-xs text-foreground">{lead.clientType || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${lead.status === "ACTIVE" ? "bg-green-100 text-green-800" : lead.status === "DEAL" ? "bg-blue-100 text-blue-800" : "bg-muted text-muted-foreground"}`}>{lead.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right"><button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "properties" ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Property</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Location</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Price</th>
                  <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Type</th>
                  <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {properties.filter((p: any) => !searchQuery || (p.title || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item: any) => (
                  <tr key={item.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3 font-raleway text-sm text-foreground truncate max-w-[200px]">{item.title}</td>
                    <td className="px-5 py-3 hidden md:table-cell font-raleway text-xs text-muted-foreground">{item.region}</td>
                    <td className="px-5 py-3 font-raleway text-sm font-medium text-foreground">AED {item.price?.toLocaleString()}</td>
                    <td className="px-5 py-3"><span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-kaya-olive/10 text-kaya-olive">{item.listingType}</span></td>
                    <td className="px-5 py-3 text-right"><button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg px-5 py-12 text-center">
          <Receipt size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="font-raleway text-sm text-muted-foreground">Transaction data will appear here when connected to the API</p>
        </div>
      )}
    </div>
  );
};

export default DatabaseView;
