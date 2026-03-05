import { useEffect, useState, useCallback } from "react";
import {
  Building2, Users, User, CalendarDays, TrendingUp, TrendingDown,
  RefreshCw, ArrowRight, DollarSign, Loader2, Briefcase,
  Clock, Phone, Target, Activity, Eye, ChevronRight,
} from "lucide-react";
import { fetchListings, fetchLeads, fetchAgents, fetchReminders } from "@/lib/pixxi";
import { CrmModule } from "../CrmSidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const formatPrice = (n: number) => "AED " + n.toLocaleString("en-US");

const COLORS = ["hsl(68, 63%, 12%)", "hsl(68, 63%, 25%)", "hsl(200, 60%, 50%)", "hsl(40, 70%, 50%)"];

interface DashboardViewProps {
  onNavigate: (m: CrmModule) => void;
}

const DashboardView = ({ onNavigate }: DashboardViewProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    listings: null, leads: null, agents: null, reminders: null,
    sellCount: 0, rentCount: 0, newCount: 0,
    activeLeads: 0, inactiveLeads: 0, dealLeads: 0,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [listingsRes, leadsRes, agentsRes, remindersRes, sell, rent, newP, leadsActive, leadsInactive, leadsDeals] = await Promise.all([
        fetchListings({ listingType: "SELL", page: 1, size: 5 }),
        fetchLeads({ page: 1, size: 10 }),
        fetchAgents(),
        fetchReminders({ page: 1, size: 5 }),
        fetchListings({ listingType: "SELL", page: 1, size: 1 }),
        fetchListings({ listingType: "RENT", page: 1, size: 1 }),
        fetchListings({ listingType: "NEW", page: 1, size: 1 }),
        fetchLeads({ page: 1, size: 1, status: "ACTIVE" }),
        fetchLeads({ page: 1, size: 1, status: "INACTIVE" }),
        fetchLeads({ page: 1, size: 1, status: "DEAL" }),
      ]);
      setData({
        listings: listingsRes, leads: leadsRes, agents: agentsRes, reminders: remindersRes,
        sellCount: sell?.data?.totalSize || 0,
        rentCount: rent?.data?.totalSize || 0,
        newCount: newP?.data?.totalSize || 0,
        activeLeads: leadsActive?.data?.total || 0,
        inactiveLeads: leadsInactive?.data?.total || 0,
        dealLeads: leadsDeals?.data?.total || 0,
      });
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

  const totalProperties = data.sellCount + data.rentCount + data.newCount;

  const kpis = [
    { icon: <Building2 size={20} />, label: "Total Properties", value: totalProperties.toLocaleString(), trend: "+12%", up: true, color: "bg-blue-500/10 text-blue-600" },
    { icon: <Users size={20} />, label: "Total Leads", value: leadsTotal.toLocaleString(), trend: "+8%", up: true, color: "bg-green-500/10 text-green-600" },
    { icon: <User size={20} />, label: "Active Agents", value: agentsData.length.toString(), trend: "0%", up: true, color: "bg-purple-500/10 text-purple-600" },
    { icon: <Briefcase size={20} />, label: "Closed Deals", value: data.dealLeads.toLocaleString(), trend: "+15%", up: true, color: "bg-amber-500/10 text-amber-600" },
    { icon: <Target size={20} />, label: "Active Leads", value: data.activeLeads.toLocaleString(), trend: "+5%", up: true, color: "bg-teal-500/10 text-teal-600" },
    { icon: <DollarSign size={20} />, label: "For Sale", value: data.sellCount.toLocaleString(), trend: "+3%", up: true, color: "bg-rose-500/10 text-rose-600" },
  ];

  const propertyChartData = [
    { name: "For Sale", value: data.sellCount },
    { name: "For Rent", value: data.rentCount },
    { name: "Off Plan", value: data.newCount },
  ];

  const leadPieData = [
    { name: "Active", value: data.activeLeads },
    { name: "Inactive", value: data.inactiveLeads },
    { name: "Deals", value: data.dealLeads },
  ];

  const quickActions = [
    { icon: <Users size={16} />, label: "Add Lead", module: "leads-add" as CrmModule },
    { icon: <Building2 size={16} />, label: "Add Property", module: "sell-listings" as CrmModule },
    { icon: <Phone size={16} />, label: "Log Call", module: "leads-buy" as CrmModule },
    { icon: <CalendarDays size={16} />, label: "Schedule", module: "calendar" as CrmModule },
    { icon: <Eye size={16} />, label: "KPI Reports", module: "kpi-insight" as CrmModule },
    { icon: <Activity size={16} />, label: "Transactions", module: "transactions" as CrmModule },
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                {kpi.icon}
              </div>
              {kpi.trend && (
                <span className={`flex items-center gap-0.5 text-[10px] font-raleway ${kpi.up ? "text-green-600" : "text-destructive"}`}>
                  {kpi.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {kpi.trend}
                </span>
              )}
            </div>
            <p className="font-raleway text-[10px] text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
            <p className="font-raleway text-xl font-semibold text-foreground mt-0.5">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-raleway text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.module)}
              className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-lg font-raleway text-xs text-foreground transition-colors"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Distribution */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-raleway text-sm font-medium text-foreground mb-4">Property Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={propertyChartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Raleway" }} />
              <YAxis tick={{ fontSize: 11, fontFamily: "Raleway" }} />
              <Tooltip contentStyle={{ fontFamily: "Raleway", fontSize: 12 }} />
              <Bar dataKey="value" fill="hsl(68, 63%, 12%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Status */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-raleway text-sm font-medium text-foreground mb-4">Lead Status Breakdown</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={leadPieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={false}>
                  {leadPieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: "Raleway", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {leadPieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="font-raleway text-xs text-muted-foreground">{entry.name}</span>
                  </div>
                  <span className="font-raleway text-sm font-medium text-foreground">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-raleway text-sm font-medium text-foreground">Recent Leads</h3>
            <button onClick={() => onNavigate("leads-buy")} className="flex items-center gap-1 text-[10px] font-raleway text-kaya-olive hover:underline">
              View All <ArrowRight size={10} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {leadsData.slice(0, 5).map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center">
                    <User size={12} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-raleway text-xs text-foreground">{lead.name || "Unknown"}</p>
                    <p className="font-raleway text-[10px] text-muted-foreground">{lead.email || lead.phone || "No contact"}</p>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 text-[9px] font-raleway rounded ${
                  lead.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                  lead.status === "DEAL" ? "bg-blue-100 text-blue-800" :
                  "bg-muted text-muted-foreground"
                }`}>{lead.status}</span>
              </div>
            ))}
            {leadsData.length === 0 && (
              <p className="px-4 py-6 text-center font-raleway text-xs text-muted-foreground">No leads found</p>
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-raleway text-sm font-medium text-foreground">Recent Properties</h3>
            <button onClick={() => onNavigate("sell-listings")} className="flex items-center gap-1 text-[10px] font-raleway text-kaya-olive hover:underline">
              View All <ArrowRight size={10} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {listingsData.slice(0, 5).map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                {item.photos?.[0] ? (
                  <img src={item.photos[0]} alt={item.title} className="w-12 h-8 object-cover rounded" />
                ) : (
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                    <Building2 size={14} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-raleway text-xs text-foreground truncate">{item.title}</p>
                  <p className="font-raleway text-[10px] text-muted-foreground">{item.region}</p>
                </div>
                <p className="font-raleway text-xs font-medium text-foreground">{formatPrice(item.price)}</p>
              </div>
            ))}
            {listingsData.length === 0 && (
              <p className="px-4 py-6 text-center font-raleway text-xs text-muted-foreground">No properties found</p>
            )}
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-raleway text-sm font-medium text-foreground">Upcoming</h3>
            <button onClick={() => onNavigate("calendar")} className="flex items-center gap-1 text-[10px] font-raleway text-kaya-olive hover:underline">
              View All <ArrowRight size={10} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {(Array.isArray(remindersData) ? remindersData : []).slice(0, 5).map((item: any, idx: number) => (
              <div key={item.id || idx} className="flex items-center gap-2 px-4 py-2.5">
                <CalendarDays size={14} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-raleway text-xs text-foreground truncate">{item.title || "Untitled"}</p>
                  <p className="font-raleway text-[10px] text-muted-foreground">{item.reminder_start_time || ""}</p>
                </div>
                {item.status && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-raleway rounded ${
                    item.status === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                  }`}>{item.status}</span>
                )}
              </div>
            ))}
            {(!Array.isArray(remindersData) || remindersData.length === 0) && (
              <p className="px-4 py-6 text-center font-raleway text-xs text-muted-foreground">No upcoming reminders</p>
            )}
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-raleway text-sm font-medium text-foreground">Agent Overview</h3>
          <button onClick={() => onNavigate("agents" as CrmModule)} className="flex items-center gap-1 text-xs font-raleway text-kaya-olive hover:underline">
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Agent</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Email</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Phone</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">BRN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agentsData.slice(0, 5).map((agent: any, idx: number) => (
                <tr key={agent.id || idx} className="hover:bg-muted/20">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {agent.avatar ? (
                        <img src={agent.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 bg-kaya-olive/10 rounded-full flex items-center justify-center">
                          <User size={12} className="text-kaya-olive" />
                        </div>
                      )}
                      <span className="font-raleway text-xs text-foreground">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell font-raleway text-xs text-muted-foreground">{agent.email || "—"}</td>
                  <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{agent.phone || "—"}</td>
                  <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{agent.brn || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
