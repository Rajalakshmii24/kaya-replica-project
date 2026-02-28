import { useEffect, useState, useCallback } from "react";
import { CalendarDays, Loader2, RefreshCw, Plus, Clock, Bell } from "lucide-react";
import { fetchReminders } from "@/lib/pixxi";

const RemindersView = () => {
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<any[]>([]);

  const loadReminders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchReminders({ page: 1, size: 50 });
      const list = res?.data?.list || res?.data || [];
      setReminders(Array.isArray(list) ? list : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadReminders(); }, [loadReminders]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Reminders</h1>
          <p className="font-raleway text-sm text-muted-foreground">{reminders.length} reminders</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadReminders} className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs font-raleway text-muted-foreground hover:text-foreground">
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90">
            <Plus size={14} /> Add Reminder
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : (
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {reminders.map((item: any, idx: number) => (
            <div key={item.id || idx} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-kaya-olive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bell size={14} className="text-kaya-olive" />
                </div>
                <div>
                  <p className="font-raleway text-sm font-medium text-foreground">{item.title || "Untitled"}</p>
                  {item.description && (
                    <p className="font-raleway text-xs text-muted-foreground mt-1">{item.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {item.reminderType && (
                      <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${
                        item.reminderType === "TASK" ? "bg-amber-100 text-amber-800" :
                        item.reminderType === "EVENT" ? "bg-purple-100 text-purple-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>{item.reminderType}</span>
                    )}
                    {item.reminder_start_time && (
                      <span className="flex items-center gap-1 font-raleway text-[10px] text-muted-foreground">
                        <Clock size={10} /> {item.reminder_start_time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {item.status && (
                <span className={`px-2 py-1 text-[10px] font-raleway rounded flex-shrink-0 ${
                  item.status === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                }`}>{item.status}</span>
              )}
            </div>
          ))}
          {reminders.length === 0 && (
            <div className="px-5 py-12 text-center">
              <CalendarDays size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-raleway text-sm text-muted-foreground">No reminders found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RemindersView;
