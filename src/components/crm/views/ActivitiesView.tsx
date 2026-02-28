import { useEffect, useState, useCallback } from "react";
import { Activity, Loader2, Clock, User, Building2, Phone, Mail, FileText } from "lucide-react";
import { fetchLeads } from "@/lib/pixxi";

const ActivitiesView = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      // Using leads as activity source since API doesn't have dedicated activity endpoint
      const res = await fetchLeads({ page: 1, size: 20, sortType: "DESC" });
      setActivities(res?.data?.list || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadActivities(); }, [loadActivities]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "BUY": return <Building2 size={14} />;
      case "RENT": return <FileText size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-raleway text-xl font-medium text-foreground">Activity Log</h1>
        <p className="font-raleway text-sm text-muted-foreground">Recent CRM activity</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : (
        <div className="bg-card border border-border rounded-lg">
          <div className="divide-y divide-border">
            {activities.map((item: any) => (
              <div key={item.id} className="flex items-start gap-4 px-5 py-4">
                <div className="w-8 h-8 bg-kaya-olive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-kaya-olive">
                  {getActivityIcon(item.clientType)}
                </div>
                <div className="flex-1">
                  <p className="font-raleway text-sm text-foreground">
                    <span className="font-medium">{item.name || "Unknown"}</span>
                    {" "}was added as a{" "}
                    <span className="text-kaya-olive">{item.clientType?.toLowerCase()}</span> lead
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {item.agentInfo?.name && (
                      <span className="flex items-center gap-1 font-raleway text-xs text-muted-foreground">
                        <User size={10} /> {item.agentInfo.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-raleway text-xs text-muted-foreground">
                      <Clock size={10} /> {item.createTime || "—"}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-raleway rounded flex-shrink-0 ${
                  item.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                  item.status === "DEAL" ? "bg-blue-100 text-blue-800" :
                  "bg-muted text-muted-foreground"
                }`}>{item.status}</span>
              </div>
            ))}
          </div>
          {activities.length === 0 && (
            <div className="px-5 py-12 text-center">
              <Activity size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-raleway text-sm text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivitiesView;
