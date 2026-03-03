import { useState, useRef, useEffect } from "react";
import {
  Search, Bell, User, Settings, LogOut, Menu,
  ChevronDown, X, Plus, Building2, Users, ListChecks,
  Mail, Phone, HelpCircle, Moon, Sun, Globe,
} from "lucide-react";

interface CrmTopNavProps {
  onLogout: () => void;
  onToggleSidebar: () => void;
  userEmail?: string;
  onQuickAction?: (action: string) => void;
}

const CrmTopNav = ({ onLogout, onToggleSidebar, userEmail, onQuickAction }: CrmTopNavProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotificationsOpen(false);
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) setQuickAddOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notifications = [
    { id: 1, title: "New lead assigned", message: "A new lead has been assigned to you", time: "2 min ago", unread: true },
    { id: 2, title: "Property viewed", message: "Downtown Penthouse was viewed 5 times today", time: "1 hr ago", unread: true },
    { id: 3, title: "Reminder", message: "Follow-up call with Ahmed scheduled", time: "3 hrs ago", unread: false },
  ];

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-4 sticky top-0 z-30">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search leads, properties, contacts..."
          className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg font-raleway text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-kaya-olive/50 placeholder:text-muted-foreground"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Quick Add */}
        <div ref={quickAddRef} className="relative">
          <button
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Quick Add"
          >
            <Plus size={18} />
          </button>
          {quickAddOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
              <div className="py-1">
                {[
                  { icon: <Users size={14} />, label: "New Lead" },
                  { icon: <Building2 size={14} />, label: "New Property" },
                  { icon: <ListChecks size={14} />, label: "New Task" },
                  { icon: <Phone size={14} />, label: "Log Call" },
                  { icon: <Mail size={14} />, label: "Send Email" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setQuickAddOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 font-raleway text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h3 className="font-raleway text-sm font-medium text-foreground">Notifications</h3>
                <button className="font-raleway text-[10px] text-kaya-olive hover:underline">Mark all read</button>
              </div>
              <div className="divide-y divide-border max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-muted/30 cursor-pointer ${n.unread ? "bg-kaya-olive/5" : ""}`}>
                    <div className="flex items-start gap-2">
                      {n.unread && <div className="w-1.5 h-1.5 bg-kaya-olive rounded-full mt-1.5 flex-shrink-0" />}
                      <div>
                        <p className="font-raleway text-xs font-medium text-foreground">{n.title}</p>
                        <p className="font-raleway text-[10px] text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="font-raleway text-[9px] text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-border">
                <button className="w-full py-1.5 font-raleway text-xs text-kaya-olive hover:bg-muted rounded-md transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle size={18} />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Settings size={18} />
        </button>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 bg-kaya-olive rounded-full flex items-center justify-center">
              <User size={16} className="text-primary-foreground" />
            </div>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-border">
                <p className="font-raleway text-sm font-medium text-foreground">Admin</p>
                <p className="font-raleway text-xs text-muted-foreground truncate">{userEmail || "admin@kaya.ae"}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[9px] bg-kaya-olive/10 text-kaya-olive font-raleway rounded">Administrator</span>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 font-raleway text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <User size={16} />
                  My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 font-raleway text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Settings size={16} />
                  Account Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 font-raleway text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Globe size={16} />
                  Go to Website
                </button>
              </div>
              <div className="border-t border-border py-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 font-raleway text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CrmTopNav;
