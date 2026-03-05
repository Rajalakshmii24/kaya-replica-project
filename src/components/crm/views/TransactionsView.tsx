import { useState } from "react";
import { Receipt, Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react";

const mockTransactions = [
  { id: 1, property: "Downtown Penthouse 3BR", client: "Ahmed Al Maktoum", agent: "Sarah Johnson", amount: 4500000, type: "Sale", status: "Completed", date: "2026-02-28" },
  { id: 2, property: "Marina View Studio", client: "Sara Hassan", agent: "Mike Chen", amount: 85000, type: "Rent", status: "In Progress", date: "2026-03-01" },
  { id: 3, property: "Palm Villa 5BR", client: "Mohammed Ali", agent: "Sarah Johnson", amount: 12000000, type: "Sale", status: "Pending", date: "2026-03-03" },
  { id: 4, property: "JVC 2BR Apartment", client: "Fatima Rashid", agent: "Mike Chen", amount: 65000, type: "Rent", status: "Completed", date: "2026-02-25" },
  { id: 5, property: "Business Bay Office", client: "Omar Khalil", agent: "Sarah Johnson", amount: 2800000, type: "Sale", status: "In Progress", date: "2026-03-04" },
];

const formatPrice = (n: number) => "AED " + n.toLocaleString("en-US");

interface TransactionsViewProps {
  showAdd?: boolean;
}

const TransactionsView = ({ showAdd: initialShowAdd = false }: TransactionsViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "Sale" | "Rent">("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAdd, setShowAdd] = useState(initialShowAdd);

  const filtered = mockTransactions.filter((t) => {
    const matchSearch = !searchQuery || t.property.toLowerCase().includes(searchQuery.toLowerCase()) || t.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !typeFilter || t.type === typeFilter;
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Transactions</h1>
          <p className="font-raleway text-sm text-muted-foreground">{mockTransactions.length} transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs font-raleway text-muted-foreground hover:text-foreground"><Download size={14} /> Export</button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90"><Plus size={14} /> Add Transaction</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
        </div>
        <div className="flex gap-1">
          {(["", "Sale", "Rent"] as const).map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-raleway rounded-md transition-colors ${typeFilter === t ? "bg-kaya-olive text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {t || "All"}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-raleway focus:outline-none">
          <option value="">All Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Property</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Client</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Agent</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Amount</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Type</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Status</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Date</th>
                <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-raleway text-sm font-medium text-foreground">{tx.property}</td>
                  <td className="px-5 py-3 hidden md:table-cell font-raleway text-xs text-muted-foreground">{tx.client}</td>
                  <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{tx.agent}</td>
                  <td className="px-5 py-3 font-raleway text-sm font-medium text-foreground">{formatPrice(tx.amount)}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${tx.type === "Sale" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>{tx.type}</span></td>
                  <td className="px-5 py-3"><span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${tx.status === "Completed" ? "bg-green-100 text-green-800" : tx.status === "In Progress" ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"}`}>{tx.status}</span></td>
                  <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{tx.date}</td>
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
        {filtered.length === 0 && <div className="px-5 py-12 text-center"><Receipt size={32} className="mx-auto text-muted-foreground mb-2" /><p className="font-raleway text-sm text-muted-foreground">No transactions found</p></div>}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-raleway text-lg font-medium text-foreground mb-4">Add Transaction</h2>
            <div className="space-y-4">
              {["Property Title", "Client Name", "Agent Name", "Amount (AED)", "Date"].map((label) => (
                <div key={label}>
                  <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</label>
                  <input className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
                </div>
              ))}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Type</label>
                <select className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none">
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</label>
                <select className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 font-raleway text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-sm font-medium hover:bg-kaya-olive/90">Save Transaction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsView;
