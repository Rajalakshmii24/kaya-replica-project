import { useState, useRef, useEffect } from "react";
import {
  Search, Bell, User, Settings, LogOut, Menu,
  ChevronDown, X,
} from "lucide-react";

interface CrmTopNavProps {
  onLogout: () => void;
  onToggleSidebar: () => void;
  userEmail?: string;
}

const CrmTopNav = ({ onLogout, onToggleSidebar, userEmail }: CrmTopNavProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

      <div className="flex items-center gap-2">
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
            <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-border">
                <h3 className="font-raleway text-sm font-medium text-foreground">Notifications</h3>
              </div>
              <div className="p-4 text-center">
                <p className="font-raleway text-xs text-muted-foreground">No new notifications</p>
              </div>
            </div>
          )}
        </div>

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
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 font-raleway text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <User size={16} />
                  My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 font-raleway text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Settings size={16} />
                  Settings
                </button>
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
