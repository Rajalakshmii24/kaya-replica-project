import { useEffect, useState, useCallback } from "react";
import { FileText, Loader2, Building2, Users, Briefcase, TrendingUp } from "lucide-react";
import { fetchListings, fetchLeads } from "@/lib/pixxi";

const ReportsView = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sellCount: 0, rentCount: 0, newCount: 0, leadsActive: 0, leadsInactive: 0, leadsDeals: 0 });

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const [sell, rent, newP, leadsActive, leadsInactive, leadsDeals] = await Promise.all([
        fetchListings({ listingType: "SELL", page: 1, size: 1 }),
        fetchListings({ listingType: "RENT", page: 1, size: 1 }),
        fetchListings({ listingType: "NEW", page: 1, size: 1 }),
        fetchLeads({ page: 1, size: 1, status: "ACTIVE" }),
        fetchLeads({ page: 1, size: 1, status: "INACTIVE" }),
        fetchLeads({ page: 1, size: 1, status: "DEAL" }),
      ]);
      setStats({
        sellCount: sell?.data?.totalSize || 0,
        rentCount: rent?.data?.totalSize || 0,
        newCount: newP?.data?.totalSize || 0,
        leadsActive: leadsActive?.data?.total || 0,
        leadsInactive: leadsInactive?.data?.total || 0,
        leadsDeals: leadsDeals?.data?.total || 0,
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadReports(); }, [loadReports]);

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>;
  }

  const reportCards = [
    { title: "Properties for Sale", value: stats.sellCount, icon: <Building2 size={20} />, color: "bg-blue-500/10 text-blue-600" },
    { title: "Properties for Rent", value: stats.rentCount, icon: <Building2 size={20} />, color: "bg-green-500/10 text-green-600" },
    { title: "Off-Plan Projects", value: stats.newCount, icon: <Building2 size={20} />, color: "bg-purple-500/10 text-purple-600" },
    { title: "Active Leads", value: stats.leadsActive, icon: <Users size={20} />, color: "bg-amber-500/10 text-amber-600" },
    { title: "Inactive Leads", value: stats.leadsInactive, icon: <Users size={20} />, color: "bg-muted text-muted-foreground" },
    { title: "Closed Deals", value: stats.leadsDeals, icon: <Briefcase size={20} />, color: "bg-green-500/10 text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-raleway text-xl font-medium text-foreground">Reports</h1>
        <p className="font-raleway text-sm text-muted-foreground">CRM performance summary</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((card, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <p className="font-raleway text-xs text-muted-foreground uppercase tracking-wide">{card.title}</p>
            <p className="font-raleway text-2xl font-semibold text-foreground mt-1">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Summary Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-raleway text-sm font-medium text-foreground">Property Distribution</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Category</th>
              <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Count</th>
              <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { label: "For Sale", count: stats.sellCount },
              { label: "For Rent", count: stats.rentCount },
              { label: "Off Plan", count: stats.newCount },
            ].map((row) => {
              const totalProps = stats.sellCount + stats.rentCount + stats.newCount;
              const pct = totalProps > 0 ? ((row.count / totalProps) * 100).toFixed(1) : "0";
              return (
                <tr key={row.label} className="hover:bg-muted/30">
                  <td className="px-5 py-3 font-raleway text-sm text-foreground">{row.label}</td>
                  <td className="px-5 py-3 text-right font-raleway text-sm text-foreground">{row.count.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-kaya-olive rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="font-raleway text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsView;
