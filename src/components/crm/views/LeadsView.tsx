import { useEffect, useState, useCallback } from "react";
import {
  Users, Search, ChevronLeft, ChevronRight, RefreshCw, Plus,
  Phone, Mail, Filter, Loader2, MoreHorizontal, Download, Eye, Edit, Trash2,
} from "lucide-react";
import { fetchLeads } from "@/lib/pixxi";

const LeadsView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"" | "ACTIVE" | "INACTIVE" | "DEAL">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<"ASC" | "DESC">("DESC");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchLeads({ page, size: 20, status: status || undefined, sortType });
      setData(res);
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setLoading(false);
    }
  }, [page, status, sortType]);

  useEffect(() => { loadLeads(); }, [loadLeads]);

  const leadsData = data?.data?.list || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  // Client-side search filter
  const filtered = searchQuery
    ? leadsData.filter((l: any) =>
        (l.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.phone || "").includes(searchQuery)
      )
    : leadsData;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Leads</h1>
          <p className="font-raleway text-sm text-muted-foreground">{total} total leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs font-raleway text-muted-foreground hover:text-foreground">
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90"
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50"
          />
        </div>
        <div className="flex gap-1">
          {[
            { label: "All", value: "" as const },
            { label: "Active", value: "ACTIVE" as const },
            { label: "Inactive", value: "INACTIVE" as const },
            { label: "Deal", value: "DEAL" as const },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => { setStatus(s.value); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-raleway rounded-md transition-colors ${
                status === s.value ? "bg-kaya-olive text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as "ASC" | "DESC")}
          className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-raleway text-foreground focus:outline-none"
        >
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-kaya-olive" size={28} />
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Name</th>
                    <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Contact</th>
                    <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Type</th>
                    <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Status</th>
                    <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Agent</th>
                    <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Date</th>
                    <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-raleway text-sm font-medium text-foreground">{lead.name || "—"}</p>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {lead.email && <span className="font-raleway text-xs text-muted-foreground">{lead.email}</span>}
                          {lead.phone && (
                            <span className="flex items-center gap-1 font-raleway text-xs text-muted-foreground">
                              <Phone size={10} /> {lead.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-raleway text-xs text-foreground">{lead.clientType || "—"}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${
                          lead.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                          lead.status === "DEAL" ? "bg-blue-100 text-blue-800" :
                          "bg-muted text-muted-foreground"
                        }`}>{lead.status}</span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="font-raleway text-xs text-muted-foreground">{lead.agentInfo?.name || "—"}</span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="font-raleway text-xs text-muted-foreground">{lead.createTime?.split(" ")[0] || "—"}</span>
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
            {filtered.length === 0 && (
              <div className="px-5 py-12 text-center">
                <Users size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="font-raleway text-sm text-muted-foreground">No leads found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="font-raleway text-xs text-muted-foreground">
                Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, total)} of {total}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                <span className="font-raleway text-sm text-muted-foreground">Page {page} / {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                  className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Lead Modal */}
      {showCreateModal && (
        <CreateLeadModal onClose={() => setShowCreateModal(false)} onCreated={loadLeads} />
      )}
    </div>
  );
};

function CreateLeadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", clientType: "BUY" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
      <div className="bg-card border border-border rounded-xl w-full max-w-md mx-4 p-6 shadow-xl">
        <h2 className="font-raleway text-lg font-medium text-foreground mb-4">Add New Lead</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50"
              placeholder="Full name" />
          </div>
          <div>
            <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50"
              placeholder="email@example.com" type="email" />
          </div>
          <div>
            <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50"
              placeholder="+971 XX XXX XXXX" />
          </div>
          <div>
            <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Type</label>
            <select value={form.clientType} onChange={(e) => setForm({ ...form, clientType: e.target.value })}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none">
              <option value="BUY">Buy</option>
              <option value="RENT">Rent</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 font-raleway text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-sm font-medium hover:bg-kaya-olive/90">
            Create Lead
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeadsView;
