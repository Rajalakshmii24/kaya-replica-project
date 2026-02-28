import { useEffect, useState, useCallback } from "react";
import { PieChart, Loader2, TrendingUp, BarChart3 } from "lucide-react";
import { fetchListings, fetchLeads } from "@/lib/pixxi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(68, 63%, 12%)", "hsl(68, 63%, 25%)", "hsl(68, 63%, 40%)", "hsl(200, 60%, 50%)", "hsl(40, 70%, 50%)"];

const AnalyticsView = () => {
  const [loading, setLoading] = useState(true);
  const [propertyData, setPropertyData] = useState<any[]>([]);
  const [leadData, setLeadData] = useState<any[]>([]);

  const loadAnalytics = useCallback(async () => {
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
      setPropertyData([
        { name: "For Sale", value: sell?.data?.totalSize || 0 },
        { name: "For Rent", value: rent?.data?.totalSize || 0 },
        { name: "Off Plan", value: newP?.data?.totalSize || 0 },
      ]);
      setLeadData([
        { name: "Active", value: leadsActive?.data?.total || 0 },
        { name: "Inactive", value: leadsInactive?.data?.total || 0 },
        { name: "Deals", value: leadsDeals?.data?.total || 0 },
      ]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-raleway text-xl font-medium text-foreground">Analytics</h1>
        <p className="font-raleway text-sm text-muted-foreground">Visual insights into your CRM data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Distribution Bar Chart */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-raleway text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-kaya-olive" />
            Property Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={propertyData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "Raleway" }} />
              <YAxis tick={{ fontSize: 12, fontFamily: "Raleway" }} />
              <Tooltip contentStyle={{ fontFamily: "Raleway", fontSize: 12 }} />
              <Bar dataKey="value" fill="hsl(68, 63%, 12%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Status Pie Chart */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-raleway text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <PieChart size={16} className="text-kaya-olive" />
            Lead Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RPieChart>
              <Pie
                data={leadData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {leadData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: "Raleway", fontSize: 12 }} />
            </RPieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            {leadData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="font-raleway text-xs text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
