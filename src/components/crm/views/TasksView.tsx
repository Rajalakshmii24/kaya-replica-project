import { useEffect, useState, useCallback } from "react";
import { ListChecks, Loader2, Plus, CheckCircle2, Circle, Clock } from "lucide-react";
import { fetchReminders } from "@/lib/pixxi";

const TasksView = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchReminders({ page: 1, size: 50 });
      const list = res?.data?.list || res?.data || [];
      setTasks(Array.isArray(list) ? list.filter((t: any) => t.reminderType === "TASK" || true) : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const filtered = filter === "all" ? tasks
    : filter === "completed" ? tasks.filter((t) => t.status === "COMPLETED")
    : tasks.filter((t) => t.status !== "COMPLETED");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-raleway text-xl font-medium text-foreground">Tasks</h1>
          <p className="font-raleway text-sm text-muted-foreground">{tasks.length} tasks</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90">
          <Plus size={14} /> Add Task
        </button>
      </div>

      <div className="flex gap-1">
        {[
          { label: "All", value: "all" as const },
          { label: "Pending", value: "pending" as const },
          { label: "Completed", value: "completed" as const },
        ].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-xs font-raleway rounded-md transition-colors ${
              filter === f.value ? "bg-kaya-olive text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : (
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {filtered.map((task: any, idx: number) => (
            <div key={task.id || idx} className="flex items-start gap-3 px-5 py-4">
              {task.status === "COMPLETED" ? (
                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle size={18} className="text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-raleway text-sm ${task.status === "COMPLETED" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.title || "Untitled Task"}
                </p>
                {task.description && (
                  <p className="font-raleway text-xs text-muted-foreground mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  {task.reminderType && (
                    <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${
                      task.reminderType === "TASK" ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"
                    }`}>{task.reminderType}</span>
                  )}
                  {task.reminder_start_time && (
                    <span className="flex items-center gap-1 font-raleway text-[10px] text-muted-foreground">
                      <Clock size={10} /> {task.reminder_start_time}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center">
              <ListChecks size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-raleway text-sm text-muted-foreground">No tasks found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksView;
