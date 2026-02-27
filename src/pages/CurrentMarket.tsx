import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search, Users, Building2, BarChart3, CalendarDays, LayoutDashboard,
  ChevronLeft, ChevronRight, Eye, Phone, Mail, RefreshCw,
  TrendingUp, Loader2, Lock, LogOut, User, Home as HomeIcon,
  Filter, X
} from "lucide-react";
import {
  fetchListings, fetchLeads, fetchAgents, fetchDevelopers, fetchReminders,
} from "@/lib/pixxi";

const CRM_PASSWORD = "kaya2024";

type CrmTab = "dashboard" | "leads" | "listings" | "agents" | "reminders";

const formatPrice = (n: number) => "AED " + n.toLocaleString("en-US");

const CurrentMarket = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // CRM State
  const [activeTab, setActiveTab] = useState<CrmTab>("dashboard");
  const [loading, setLoading] = useState(false);

  // Data
  const [listings, setListings] = useState<any>(null);
  const [leads, setLeads] = useState<any>(null);
  const [agents, setAgents] = useState<any>(null);
  const [reminders, setReminders] = useState<any>(null);

  // Filters
  const [listingType, setListingType] = useState<"NEW" | "SELL" | "RENT">("SELL");
  const [listingPage, setListingPage] = useState(1);
  const [leadPage, setLeadPage] = useState(1);
  const [leadStatus, setLeadStatus] = useState<"" | "ACTIVE" | "INACTIVE" | "DEAL">("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CRM_PASSWORD) {
      setAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Invalid password. Please try again.");
    }
  };

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [listingsRes, leadsRes, agentsRes, remindersRes] = await Promise.all([
        fetchListings({ listingType: "SELL", page: 1, size: 5 }),
        fetchLeads({ page: 1, size: 5 }),
        fetchAgents(),
        fetchReminders({ page: 1, size: 5 }),
      ]);
      setListings(listingsRes);
      setLeads(leadsRes);
      setAgents(agentsRes);
      setReminders(remindersRes);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchListings({
        listingType,
        page: listingPage,
        size: 20,
        name: searchQuery || undefined,
      });
      setListings(res);
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      setLoading(false);
    }
  }, [listingType, listingPage, searchQuery]);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchLeads({
        page: leadPage,
        size: 20,
        status: leadStatus || undefined,
      });
      setLeads(res);
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setLoading(false);
    }
  }, [leadPage, leadStatus]);

  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAgents();
      setAgents(res);
    } catch (err) {
      console.error("Failed to load agents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReminders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchReminders({ page: 1, size: 50 });
      setReminders(res);
    } catch (err) {
      console.error("Failed to load reminders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    if (activeTab === "dashboard") loadDashboardData();
    else if (activeTab === "listings") loadListings();
    else if (activeTab === "leads") loadLeads();
    else if (activeTab === "agents") loadAgents();
    else if (activeTab === "reminders") loadReminders();
  }, [authenticated, activeTab, loadDashboardData, loadListings, loadLeads, loadAgents, loadReminders]);

  // LOGIN GATE
  if (!authenticated) {
    return (
      <div className="w-full min-h-screen bg-background">
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-4"
          >
            <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-kaya-olive rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={28} className="text-primary-foreground" />
                </div>
                <h1 className="font-raleway text-2xl font-light text-foreground tracking-wide">CRM Access</h1>
                <p className="font-raleway text-sm text-muted-foreground mt-2">Enter your password to access the CRM dashboard</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter CRM password"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg font-raleway text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-kaya-gold"
                    required
                  />
                </div>
                {passwordError && (
                  <p className="font-raleway text-xs text-red-500">{passwordError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 bg-kaya-olive text-primary-foreground font-raleway font-medium text-sm rounded-lg hover:bg-kaya-olive/90 transition-colors tracking-wide"
                >
                  Access CRM
                </button>
              </form>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const listingsData = listings?.data?.list || [];
  const listingsTotal = listings?.data?.totalSize || 0;
  const leadsData = leads?.data?.list || [];
  const leadsTotal = leads?.data?.total || 0;
  const agentsData = agents?.data || agents || [];
  const remindersData = reminders?.data?.list || reminders?.data || [];

  const tabs: { key: CrmTab; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "leads", label: "Leads", icon: <Users size={18} /> },
    { key: "listings", label: "Listings", icon: <Building2 size={18} /> },
    { key: "agents", label: "Agents", icon: <User size={18} /> },
    { key: "reminders", label: "Reminders", icon: <CalendarDays size={18} /> },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />

      {/* Top Bar */}
      <section className="pt-20 bg-kaya-olive">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="font-raleway font-light text-primary-foreground text-xl md:text-2xl tracking-[0.1em]">
            Kaya CRM Dashboard
          </h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground font-raleway text-sm transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 font-raleway text-sm whitespace-nowrap transition-colors rounded-t-lg ${
                  activeTab === tab.key
                    ? "bg-background text-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-kaya-olive" size={32} />
            <span className="ml-3 font-raleway text-muted-foreground">Loading data...</span>
          </div>
        )}

        {!loading && activeTab === "dashboard" && (
          <DashboardView
            listings={listingsData}
            listingsTotal={listingsTotal}
            leads={leadsData}
            leadsTotal={leadsTotal}
            agents={agentsData}
            reminders={remindersData}
            onRefresh={loadDashboardData}
          />
        )}

        {!loading && activeTab === "listings" && (
          <ListingsView
            data={listingsData}
            total={listingsTotal}
            page={listingPage}
            setPage={setListingPage}
            listingType={listingType}
            setListingType={setListingType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onRefresh={loadListings}
          />
        )}

        {!loading && activeTab === "leads" && (
          <LeadsView
            data={leadsData}
            total={leadsTotal}
            page={leadPage}
            setPage={setLeadPage}
            status={leadStatus}
            setStatus={setLeadStatus}
            onRefresh={loadLeads}
          />
        )}

        {!loading && activeTab === "agents" && (
          <AgentsView data={agentsData} onRefresh={loadAgents} />
        )}

        {!loading && activeTab === "reminders" && (
          <RemindersView data={remindersData} onRefresh={loadReminders} />
        )}
      </main>

      <Footer />
    </div>
  );
};

// ========== DASHBOARD VIEW ==========
function DashboardView({ listings, listingsTotal, leads, leadsTotal, agents, reminders, onRefresh }: any) {
  const agentCount = Array.isArray(agents) ? agents.length : 0;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-raleway text-lg font-medium text-foreground">Overview</h2>
        <button onClick={onRefresh} className="flex items-center gap-2 text-sm font-raleway text-muted-foreground hover:text-foreground">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={<Building2 size={20} />} label="Total Listings" value={listingsTotal.toLocaleString()} />
        <KpiCard icon={<Users size={20} />} label="Total Leads" value={leadsTotal.toLocaleString()} />
        <KpiCard icon={<User size={20} />} label="Agents" value={agentCount.toString()} />
        <KpiCard icon={<CalendarDays size={20} />} label="Reminders" value={Array.isArray(reminders) ? reminders.length.toString() : "0"} />
      </div>

      {/* Recent Listings */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="font-raleway text-sm font-medium text-foreground mb-4">Recent Listings</h3>
        <div className="space-y-3">
          {listings.slice(0, 5).map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
              {item.photos?.[0] && (
                <img src={item.photos[0]} alt={item.title} className="w-16 h-12 object-cover rounded" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-raleway text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="font-raleway text-xs text-muted-foreground">{item.region} · {item.cityName}</p>
              </div>
              <p className="font-raleway text-sm font-medium text-foreground">{formatPrice(item.price)}</p>
            </div>
          ))}
          {listings.length === 0 && <p className="font-raleway text-sm text-muted-foreground">No listings found.</p>}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="font-raleway text-sm font-medium text-foreground mb-4">Recent Leads</h3>
        <div className="space-y-3">
          {leads.slice(0, 5).map((lead: any) => (
            <div key={lead.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-raleway text-sm font-medium text-foreground">{lead.name || "Unknown"}</p>
                <p className="font-raleway text-xs text-muted-foreground">{lead.clientType} · {lead.status}</p>
              </div>
              <div className="flex items-center gap-2">
                {lead.phone && <Phone size={14} className="text-muted-foreground" />}
                {lead.email && <Mail size={14} className="text-muted-foreground" />}
                <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${
                  lead.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                  lead.status === "DEAL" ? "bg-blue-100 text-blue-800" :
                  "bg-gray-100 text-gray-600"
                }`}>{lead.status}</span>
              </div>
            </div>
          ))}
          {leads.length === 0 && <p className="font-raleway text-sm text-muted-foreground">No leads found.</p>}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-kaya-olive/10 rounded-lg flex items-center justify-center text-kaya-olive">{icon}</div>
      </div>
      <p className="font-raleway text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-raleway text-2xl font-medium text-foreground mt-1">{value}</p>
    </div>
  );
}

// ========== LISTINGS VIEW ==========
function ListingsView({ data, total, page, setPage, listingType, setListingType, searchQuery, setSearchQuery, onRefresh }: any) {
  const totalPages = Math.ceil(total / 20);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-raleway text-lg font-medium text-foreground">
          Property Listings <span className="text-muted-foreground text-sm">({total})</span>
        </h2>
        <button onClick={onRefresh} className="flex items-center gap-2 text-sm font-raleway text-muted-foreground hover:text-foreground">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {(["SELL", "RENT", "NEW"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setListingType(t); setPage(1); }}
              className={`px-4 py-2 text-xs font-raleway rounded-md transition-colors ${
                listingType === t ? "bg-kaya-olive text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "NEW" ? "Off Plan" : t === "SELL" ? "For Sale" : "For Rent"}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onRefresh()}
            placeholder="Search listings..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-gold"
          />
        </div>
      </div>

      {/* Listing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item: any) => (
          <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-44">
              {item.photos?.[0] ? (
                <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Building2 size={32} className="text-muted-foreground" />
                </div>
              )}
              <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-raleway font-medium bg-kaya-olive text-primary-foreground rounded">
                {item.listingType}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-raleway text-sm font-medium text-foreground truncate">{item.title}</h3>
              <p className="font-raleway text-xs text-muted-foreground mt-1">{item.region}, {item.cityName}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="font-raleway text-sm font-semibold text-foreground">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-raleway">
                  {item.bedRooms > 0 && <span>{item.bedRooms} BR</span>}
                  {item.size > 0 && <span>{item.size.toLocaleString()} sqft</span>}
                </div>
              </div>
              {item.agent && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  {item.agent.avatar && (
                    <img src={item.agent.avatar} alt={item.agent.name} className="w-6 h-6 rounded-full object-cover" />
                  )}
                  <span className="font-raleway text-xs text-muted-foreground">{item.agent.name}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="font-raleway text-sm text-muted-foreground">No listings found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
            className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40">
            <ChevronLeft size={16} />
          </button>
          <span className="font-raleway text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
            className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// ========== LEADS VIEW ==========
function LeadsView({ data, total, page, setPage, status, setStatus, onRefresh }: any) {
  const totalPages = Math.ceil(total / 20);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-raleway text-lg font-medium text-foreground">
          Leads <span className="text-muted-foreground text-sm">({total})</span>
        </h2>
        <button onClick={onRefresh} className="flex items-center gap-2 text-sm font-raleway text-muted-foreground hover:text-foreground">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Status filters */}
      <div className="flex gap-1">
        {[{ label: "All", value: "" }, { label: "Active", value: "ACTIVE" }, { label: "Inactive", value: "INACTIVE" }, { label: "Deal", value: "DEAL" }].map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatus(s.value); setPage(1); }}
            className={`px-4 py-2 text-xs font-raleway rounded-md transition-colors ${
              status === s.value ? "bg-kaya-olive text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-5 py-3 bg-muted/50 border-b border-border">
          <p className="font-raleway text-xs font-medium text-foreground">Name</p>
          <p className="font-raleway text-xs font-medium text-foreground">Type</p>
          <p className="font-raleway text-xs font-medium text-foreground">Status</p>
          <p className="font-raleway text-xs font-medium text-foreground">Agent</p>
          <p className="font-raleway text-xs font-medium text-foreground">Date</p>
        </div>
        {data.map((lead: any) => (
          <div key={lead.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-5 py-4 border-b border-border hover:bg-muted/30">
            <div>
              <p className="font-raleway text-sm font-medium text-foreground">{lead.name || "—"}</p>
              <p className="font-raleway text-xs text-muted-foreground">{lead.email || lead.phone || "No contact"}</p>
            </div>
            <p className="font-raleway text-sm text-foreground">{lead.clientType || "—"}</p>
            <div>
              <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${
                lead.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                lead.status === "DEAL" ? "bg-blue-100 text-blue-800" :
                "bg-gray-100 text-gray-600"
              }`}>{lead.status}</span>
            </div>
            <p className="font-raleway text-xs text-muted-foreground">{lead.agentInfo?.name || "—"}</p>
            <p className="font-raleway text-xs text-muted-foreground">{lead.createTime?.split(" ")[0] || "—"}</p>
          </div>
        ))}
        {data.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="font-raleway text-sm text-muted-foreground">No leads found.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
            className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40">
            <ChevronLeft size={16} />
          </button>
          <span className="font-raleway text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
            className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-40">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// ========== AGENTS VIEW ==========
function AgentsView({ data, onRefresh }: any) {
  const agentsList = Array.isArray(data) ? data : [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-raleway text-lg font-medium text-foreground">
          Agents <span className="text-muted-foreground text-sm">({agentsList.length})</span>
        </h2>
        <button onClick={onRefresh} className="flex items-center gap-2 text-sm font-raleway text-muted-foreground hover:text-foreground">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentsList.map((agent: any, idx: number) => (
          <div key={agent.id || idx} className="bg-card border border-border rounded-lg p-5 flex items-start gap-4">
            {agent.avatar ? (
              <img src={agent.avatar} alt={agent.name} className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 bg-kaya-olive/10 rounded-full flex items-center justify-center">
                <User size={24} className="text-kaya-olive" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-raleway text-sm font-medium text-foreground">{agent.name}</p>
              {agent.email && <p className="font-raleway text-xs text-muted-foreground truncate">{agent.email}</p>}
              {agent.phone && <p className="font-raleway text-xs text-muted-foreground">{agent.phone}</p>}
              {agent.brn && <p className="font-raleway text-[10px] text-muted-foreground mt-1">BRN: {agent.brn}</p>}
            </div>
          </div>
        ))}
      </div>

      {agentsList.length === 0 && (
        <div className="text-center py-12">
          <User size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="font-raleway text-sm text-muted-foreground">No agents found.</p>
        </div>
      )}
    </div>
  );
}

// ========== REMINDERS VIEW ==========
function RemindersView({ data, onRefresh }: any) {
  const remindersList = Array.isArray(data) ? data : [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-raleway text-lg font-medium text-foreground">
          Reminders <span className="text-muted-foreground text-sm">({remindersList.length})</span>
        </h2>
        <button onClick={onRefresh} className="flex items-center gap-2 text-sm font-raleway text-muted-foreground hover:text-foreground">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="space-y-3">
        {remindersList.map((item: any, idx: number) => (
          <div key={item.id || idx} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-raleway text-sm font-medium text-foreground">{item.title || "Untitled"}</p>
              {item.description && <p className="font-raleway text-xs text-muted-foreground mt-1">{item.description}</p>}
              <div className="flex items-center gap-3 mt-2">
                {item.reminderType && (
                  <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${
                    item.reminderType === "TASK" ? "bg-amber-100 text-amber-800" :
                    item.reminderType === "EVENT" ? "bg-purple-100 text-purple-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>{item.reminderType}</span>
                )}
                {item.reminder_start_time && (
                  <span className="font-raleway text-[10px] text-muted-foreground">{item.reminder_start_time}</span>
                )}
              </div>
            </div>
            {item.status && (
              <span className={`px-2 py-1 text-[10px] font-raleway rounded ${
                item.status === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
              }`}>{item.status}</span>
            )}
          </div>
        ))}
      </div>

      {remindersList.length === 0 && (
        <div className="text-center py-12">
          <CalendarDays size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="font-raleway text-sm text-muted-foreground">No reminders found.</p>
        </div>
      )}
    </div>
  );
}

export default CurrentMarket;
