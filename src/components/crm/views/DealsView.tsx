import { useEffect, useState, useCallback } from "react";
import { Briefcase, Loader2, DollarSign, User, ArrowRight } from "lucide-react";
import { fetchLeads } from "@/lib/pixxi";

const DealsView = () => {
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<any[]>([]);

  const loadDeals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchLeads({ page: 1, size: 50, status: "DEAL" });
      setDeals(res?.data?.list || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadDeals(); }, [loadDeals]);

  const stages = ["New", "Negotiation", "Proposal", "Closing", "Won"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Deals Pipeline</h1>
          <p className="font-raleway text-sm text-muted-foreground">{deals.length} active deals</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : (
        <>
          {/* Pipeline stages */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {stages.map((stage) => (
              <div key={stage} className="flex-shrink-0 px-4 py-2 bg-card border border-border rounded-lg font-raleway text-xs text-muted-foreground">
                {stage}
              </div>
            ))}
          </div>

          {/* Kanban-style cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.map((deal: any) => (
              <div key={deal.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-kaya-olive" />
                    <span className="font-raleway text-xs text-muted-foreground uppercase">{deal.clientType}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-blue-100 text-blue-800">DEAL</span>
                </div>
                <p className="font-raleway text-sm font-medium text-foreground">{deal.name || "Unnamed Deal"}</p>
                {deal.email && <p className="font-raleway text-xs text-muted-foreground mt-1">{deal.email}</p>}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-muted-foreground" />
                    <span className="font-raleway text-xs text-muted-foreground">{deal.agentInfo?.name || "Unassigned"}</span>
                  </div>
                  <span className="font-raleway text-xs text-muted-foreground">{deal.createTime?.split(" ")[0]}</span>
                </div>
              </div>
            ))}
          </div>

          {deals.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <Briefcase size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-raleway text-sm text-muted-foreground">No deals found</p>
              <p className="font-raleway text-xs text-muted-foreground mt-1">Leads with "DEAL" status will appear here</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DealsView;
