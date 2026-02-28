import { useEffect, useState, useCallback } from "react";
import { User, Search, Loader2, Phone, Mail, RefreshCw } from "lucide-react";
import { fetchAgents } from "@/lib/pixxi";

const AgentsView = () => {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAgents();
      setAgents(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAgents(); }, [loadAgents]);

  const filtered = searchQuery
    ? agents.filter((a) => (a.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
    : agents;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Agents</h1>
          <p className="font-raleway text-sm text-muted-foreground">{agents.length} agents</p>
        </div>
        <button onClick={loadAgents} className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs font-raleway text-muted-foreground hover:text-foreground">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search agents..."
          className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((agent: any, idx: number) => (
            <div key={agent.id || idx} className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              {agent.avatar ? (
                <img src={agent.avatar} alt={agent.name} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 bg-kaya-olive/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={24} className="text-kaya-olive" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-raleway text-sm font-medium text-foreground">{agent.name}</p>
                {agent.email && (
                  <p className="font-raleway text-xs text-muted-foreground truncate flex items-center gap-1 mt-1">
                    <Mail size={10} /> {agent.email}
                  </p>
                )}
                {agent.phone && (
                  <p className="font-raleway text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone size={10} /> {agent.phone}
                  </p>
                )}
                {agent.brn && (
                  <p className="font-raleway text-[10px] text-muted-foreground mt-2">BRN: {agent.brn}</p>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <User size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-raleway text-sm text-muted-foreground">No agents found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentsView;
