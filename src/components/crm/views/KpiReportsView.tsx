import { useEffect, useState, useCallback } from "react";
import { BarChart3, Loader2, Users, Eye, TrendingUp, Phone, Calendar } from "lucide-react";
import { fetchLeads, fetchListings } from "@/lib/pixxi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ["hsl(68, 63%, 12%)", "hsl(68, 63%, 25%)", "hsl(200, 60%, 50%)", "hsl(40, 70%, 50%)", "hsl(0, 60%, 50%)"];

interface KpiReportsViewProps {
  initialTab?: "contacts" | "viewings" | "insight";
}

const KpiReportsView = ({ initialTab = "contacts" }: KpiReportsViewProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sellCount: 0, rentCount: 0, newCount: 0, activeLeads: 0, inactiveLeads: 0, dealLeads: 0, totalLeads: 0 });

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const [sell, rent, newP, active, inactive, deals] = await Promise.all([
        fetchListings({ listingType: "SELL", page: 1, size: 1 }),
        fetchListings({ listingType: "RENT", page: 1, size: 1 }),
        fetchListings({ listingType: "NEW", page: 1, size: 1 }),
        fetchLeads({ page: 1, size: 1, status: "ACTIVE" }),
        fetchLeads({ page: 1, size: 1, status: "INACTIVE" }),
        fetchLeads({ page: 1, size: 1, status: "DEAL" }),
      ]);
      const a = active?.data?.total || 0;
      const i = inactive?.data?.total || 0;
      const d = deals?.data?.total || 0;
      setStats({
        sellCount: sell?.data?.totalSize || 0,
        rentCount: rent?.data?.totalSize || 0,
        newCount: newP?.data?.totalSize || 0,
        activeLeads: a, inactiveLeads: i, dealLeads: d, totalLeads: a + i + d,
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const tabs = [
    { key: "contacts" as const, label: "Contacts", icon: <Users size={14} /> },
    { key: "viewings" as const, label: "Viewings", icon: <Eye size={14} /> },
    { key: "insight" as const, label: "Insight Board", icon: <TrendingUp size={14} /> },
  ];

  const leadPieData = [
    { name: "Active", value: stats.activeLeads },
    { name: "Inactive", value: stats.inactiveLeads },
    { name: "Deals", value: stats.dealLeads },
  ];

  const propertyBarData = [
    { name: "For Sale", value: stats.sellCount },
    { name: "For Rent", value: stats.rentCount },
    { name: "Off Plan", value: stats.newCount },
  ];

  const monthlyData = [
    { month: "Jan", contacts: 45, viewings: 23 },
    { month: "Feb", contacts: 62, viewings: 34 },
    { month: "Mar", contacts: 58, viewings: 41 },
    { month: "Apr", contacts: 71, viewings: 29 },
    { month: "May", contacts: 89, viewings: 52 },
    { month: "Jun", contacts: 95, viewings: 48 },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-raleway text-xl font-medium text-foreground">KPI Reports</h1>
        <p className="font-raleway text-sm text-muted-foreground">Performance analytics and insights</p>
      </div>

      <div className="flex gap-1 bg-card border border-border rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-raleway text-xs transition-colors ${
              activeTab === tab.key ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {activeTab === "contacts" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Contacts", value: stats.totalLeads, color: "bg-blue-500/10 text-blue-600" },
              { label: "Active", value: stats.activeLeads, color: "bg-green-500/10 text-green-600" },
              { label: "Inactive", value: stats.inactiveLeads, color: "bg-muted text-muted-foreground" },
              { label: "Converted", value: stats.dealLeads, color: "bg-amber-500/10 text-amber-600" },
            ].map((card) => (
              <div key={card.label} className="bg-card border border-border rounded-lg p-4">
                <p className="font-raleway text-xs text-muted-foreground uppercase tracking-wide">{card.label}</p>
                <p className="font-raleway text-2xl font-semibold text-foreground mt-1">{card.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-raleway text-sm font-medium text-foreground mb-4">Contact Status Distribution</h3>
              <div className="flex items-center">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart><Pie data={leadPieData} cx="50%" cy="50%" outerRadius={70} dataKey="value">{leadPieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip contentStyle={{ fontFamily: "Raleway", fontSize: 12 }} /></PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {leadPieData.map((entry, i) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} /><span className="font-raleway text-xs text-muted-foreground">{entry.name}</span></div>
                      <span className="font-raleway text-sm font-medium text-foreground">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-raleway text-sm font-medium text-foreground mb-4">Monthly Contacts Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}><XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Raleway" }} /><YAxis tick={{ fontSize: 11, fontFamily: "Raleway" }} /><Tooltip contentStyle={{ fontFamily: "Raleway", fontSize: 12 }} /><Line type="monotone" dataKey="contacts" stroke="hsl(68, 63%, 12%)" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "viewings" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Viewings", value: 227 },
              { label: "This Month", value: 48 },
              { label: "Confirmed", value: 34 },
              { label: "Conversion Rate", value: "14.5%" },
            ].map((card) => (
              <div key={card.label} className="bg-card border border-border rounded-lg p-4">
                <p className="font-raleway text-xs text-muted-foreground uppercase tracking-wide">{card.label}</p>
                <p className="font-raleway text-2xl font-semibold text-foreground mt-1">{card.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-raleway text-sm font-medium text-foreground mb-4">Monthly Viewings</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}><XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Raleway" }} /><YAxis tick={{ fontSize: 11, fontFamily: "Raleway" }} /><Tooltip contentStyle={{ fontFamily: "Raleway", fontSize: 12 }} /><Bar dataKey="viewings" fill="hsl(68, 63%, 12%)" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "insight" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Properties for Sale", value: stats.sellCount, icon: <BarChart3 size={20} />, color: "bg-blue-500/10 text-blue-600" },
              { label: "Properties for Rent", value: stats.rentCount, icon: <BarChart3 size={20} />, color: "bg-green-500/10 text-green-600" },
              { label: "Off-Plan Projects", value: stats.newCount, icon: <BarChart3 size={20} />, color: "bg-purple-500/10 text-purple-600" },
              { label: "Active Leads", value: stats.activeLeads, icon: <Users size={20} />, color: "bg-amber-500/10 text-amber-600" },
              { label: "Closed Deals", value: stats.dealLeads, icon: <TrendingUp size={20} />, color: "bg-green-500/10 text-green-600" },
              { label: "Total Portfolio", value: stats.sellCount + stats.rentCount + stats.newCount, icon: <BarChart3 size={20} />, color: "bg-rose-500/10 text-rose-600" },
            ].map((card, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>{card.icon}</div>
                <p className="font-raleway text-xs text-muted-foreground uppercase tracking-wide">{card.label}</p>
                <p className="font-raleway text-2xl font-semibold text-foreground mt-1">{card.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-raleway text-sm font-medium text-foreground mb-4">Property Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={propertyBarData}><XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Raleway" }} /><YAxis tick={{ fontSize: 11, fontFamily: "Raleway" }} /><Tooltip contentStyle={{ fontFamily: "Raleway", fontSize: 12 }} /><Bar dataKey="value" fill="hsl(68, 63%, 12%)" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default KpiReportsView;
