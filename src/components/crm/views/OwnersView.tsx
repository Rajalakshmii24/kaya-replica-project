import { useState } from "react";
import { UserPlus, Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";

const mockOwners = [
  { id: 1, name: "Ahmed Al Maktoum", email: "ahmed@example.com", phone: "+971 50 123 4567", properties: 3, status: "Active" },
  { id: 2, name: "Sara Hassan", email: "sara@example.com", phone: "+971 55 234 5678", properties: 1, status: "Active" },
  { id: 3, name: "Mohammed Ali", email: "mohammed@example.com", phone: "+971 52 345 6789", properties: 5, status: "Active" },
  { id: 4, name: "Fatima Rashid", email: "fatima@example.com", phone: "+971 56 456 7890", properties: 2, status: "Potential" },
  { id: 5, name: "Omar Khalil", email: "omar@example.com", phone: "+971 54 567 8901", properties: 0, status: "Potential" },
  { id: 6, name: "Layla Nasser", email: "layla@example.com", phone: "+971 58 678 9012", properties: 4, status: "Active" },
];

const OwnersView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Potential">("");
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = mockOwners.filter((o) => {
    const matchSearch = !searchQuery || o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Owners</h1>
          <p className="font-raleway text-sm text-muted-foreground">{mockOwners.length} owners</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90">
          <Plus size={14} /> Add Potential Owner
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search owners..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
        </div>
        <div className="flex gap-1">
          {(["", "Active", "Potential"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-raleway rounded-md transition-colors ${statusFilter === s ? "bg-kaya-olive text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Owner</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Contact</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Properties</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Status</th>
                <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((owner) => (
                <tr key={owner.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-raleway text-sm font-medium text-foreground">{owner.name}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <div className="space-y-0.5">
                      <p className="font-raleway text-xs text-muted-foreground flex items-center gap-1"><Mail size={10} /> {owner.email}</p>
                      <p className="font-raleway text-xs text-muted-foreground flex items-center gap-1"><Phone size={10} /> {owner.phone}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-raleway text-sm text-foreground">{owner.properties}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${owner.status === "Active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{owner.status}</span>
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
        {filtered.length === 0 && <div className="px-5 py-12 text-center"><UserPlus size={32} className="mx-auto text-muted-foreground mb-2" /><p className="font-raleway text-sm text-muted-foreground">No owners found</p></div>}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card border border-border rounded-xl w-full max-w-md mx-4 p-6 shadow-xl">
            <h2 className="font-raleway text-lg font-medium text-foreground mb-4">Add Potential Owner</h2>
            <div className="space-y-4">
              {["Full Name", "Email", "Phone", "Number of Properties"].map((label) => (
                <div key={label}>
                  <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</label>
                  <input className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 font-raleway text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-sm font-medium hover:bg-kaya-olive/90">Save Owner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersView;
