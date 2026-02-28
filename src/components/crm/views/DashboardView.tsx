import { useEffect, useState, useCallback } from "react";
import {
  Building2, Users, User, CalendarDays, TrendingUp, TrendingDown,
  RefreshCw, ArrowRight, DollarSign, Loader2, Briefcase,
} from "lucide-react";
import { fetchListings, fetchLeads, fetchAgents, fetchReminders } from "@/lib/pixxi";
import { CrmModule } from "../CrmSidebar";

const formatPrice = (n: number) => "AED " + n.toLocaleString("en-US");

interface DashboardViewProps {
  onNavigate: (m: CrmModule) => void;
}

const DashboardView = ({ onNavigate }: DashboardViewProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    listings: null, leads: null, agents: null, reminders: null,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [listingsRes, leadsRes, agentsRes, remindersRes] = await Promise.all([
        fetchListings({ listingType: "SELL", page: 1, size: 5 }),
        fetchLeads({ page: 1, size: 10 }),
        fetchAgents(),
        fetchReminders({ page: 1, size: 5 }),
      ]);
      setData({ listings: listingsRes, leads: leadsRes, agents: agentsRes, reminders: remindersRes });
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-kaya-olive" size={32} />
        <span className="ml-3 font-raleway text-muted-foreground">Loading dashboard...</span>
      </div>
    );
  }

  const listingsData = data.listings?.data?.list || [];
  const listingsTotal = data.listings?.data?.totalSize || 0;
  const leadsData = data.leads?.data?.list || [];
  const leadsTotal = data.leads?.data?.total || 0;
  const agentsData = Array.isArray(data.agents?.data) ? data.agents.data : (Array.isArray(data.agents) ? data.agents : []);
  const remindersData = data.reminders?.data?.list || data.reminders?.data || [];

  const kpis = [
    { icon: <Building2 size={20} />, label: "Properties", value: listingsTotal.toLocaleString(), trend: "+12%", up: true, color: "bg-blue-500/10 text-blue-600" },
    { icon: <Users size={20} />, label: "Total Leads", value: leadsTotal.toLocaleString(), trend: "+8%", up: true, color: "bg-green-500/10 text-green-600" },
    { icon: <User size={20} />, label: "Agents", value: agentsData.length.toString(), trend: "0%", up: true, color: "bg-purple-500/10 text-purple-600" },
    { icon: <Briefcase size={20} />, label: "Active Deals", value: "—", trend: "", up: true, color: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Dashboard</h1>
          <p className="font-raleway text-sm text-muted-foreground mt-1">Welcome back. Here's your CRM overview.</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-raleway text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                {kpi.icon}
              </div>
              {kpi.trend && (
                <span className={`flex items-center gap-1 text-xs font-raleway ${kpi.up ? "text-green-600" : "text-destructive"}`}>
                  {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.trend}
                </span>
              )}
            </div>
            <p className="font-raleway text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
            <p className="font-raleway text-2xl font-semibold text-foreground mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-raleway text-sm font-medium text-foreground">Recent Leads</h3>
            <button onClick={() => onNavigate("leads")} className="flex items-center gap-1 text-xs font-raleway text-kaya-olive hover:underline">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {leadsData.slice(0, 5).map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <User size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-raleway text-sm text-foreground">{lead.name || "Unknown"}</p>
                    <p className="font-raleway text-xs text-muted-foreground">{lead.email || lead.phone || "No contact"}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${
                  lead.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                  lead.status === "DEAL" ? "bg-blue-100 text-blue-800" :
                  "bg-muted text-muted-foreground"
                }`}>{lead.status}</span>
              </div>
            ))}
            {leadsData.length === 0 && (
              <p className="px-5 py-8 text-center font-raleway text-xs text-muted-foreground">No leads found</p>
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-raleway text-sm font-medium text-foreground">Recent Properties</h3>
            <button onClick={() => onNavigate("listings")} className="flex items-center gap-1 text-xs font-raleway text-kaya-olive hover:underline">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {listingsData.slice(0, 5).map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                {item.photos?.[0] ? (
                  <img src={item.photos[0]} alt={item.title} className="w-14 h-10 object-cover rounded" />
                ) : (
                  <div className="w-14 h-10 bg-muted rounded flex items-center justify-center">
                    <Building2 size={16} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-raleway text-sm text-foreground truncate">{item.title}</p>
                  <p className="font-raleway text-xs text-muted-foreground">{item.region}</p>
                </div>
                <p className="font-raleway text-sm font-medium text-foreground">{formatPrice(item.price)}</p>
              </div>
            ))}
            {listingsData.length === 0 && (
              <p className="px-5 py-8 text-center font-raleway text-xs text-muted-foreground">No properties found</p>
            )}
          </div>
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-raleway text-sm font-medium text-foreground">Upcoming Reminders</h3>
          <button onClick={() => onNavigate("reminders")} className="flex items-center gap-1 text-xs font-raleway text-kaya-olive hover:underline">
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-border">
          {(Array.isArray(remindersData) ? remindersData : []).slice(0, 3).map((item: any, idx: number) => (
            <div key={item.id || idx} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-muted-foreground" />
                <div>
                  <p className="font-raleway text-sm text-foreground">{item.title || "Untitled"}</p>
                  <p className="font-raleway text-xs text-muted-foreground">{item.reminder_start_time || ""}</p>
                </div>
              </div>
              {item.status && (
                <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${
                  item.status === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                }`}>{item.status}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
