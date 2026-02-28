import { useEffect, useState, useCallback } from "react";
import { CalendarDays, Loader2, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { fetchReminders } from "@/lib/pixxi";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CalendarView = () => {
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const loadReminders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchReminders({ page: 1, size: 100 });
      const list = res?.data?.list || res?.data || [];
      setReminders(Array.isArray(list) ? list : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadReminders(); }, [loadReminders]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-raleway text-xl font-medium text-foreground">Calendar</h1>
        <p className="font-raleway text-sm text-muted-foreground">Schedule and reminders</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-kaya-olive" size={28} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted"><ChevronLeft size={18} /></button>
              <h3 className="font-raleway text-sm font-medium text-foreground">
                {MONTHS[month]} {year}
              </h3>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted"><ChevronRight size={18} /></button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center py-2 font-raleway text-xs text-muted-foreground font-medium">{d}</div>
              ))}
              {cells.map((day, i) => (
                <div
                  key={i}
                  className={`text-center py-3 rounded-lg font-raleway text-sm transition-colors ${
                    day === null ? "" :
                    isToday(day) ? "bg-kaya-olive text-primary-foreground font-medium" :
                    "hover:bg-muted cursor-pointer text-foreground"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h3 className="font-raleway text-sm font-medium text-foreground">Upcoming</h3>
            </div>
            <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
              {reminders.slice(0, 10).map((item: any, idx: number) => (
                <div key={item.id || idx} className="px-4 py-3">
                  <p className="font-raleway text-sm text-foreground">{item.title || "Untitled"}</p>
                  {item.reminder_start_time && (
                    <p className="font-raleway text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock size={10} /> {item.reminder_start_time}
                    </p>
                  )}
                </div>
              ))}
              {reminders.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <CalendarDays size={24} className="mx-auto text-muted-foreground mb-2" />
                  <p className="font-raleway text-xs text-muted-foreground">No upcoming events</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
