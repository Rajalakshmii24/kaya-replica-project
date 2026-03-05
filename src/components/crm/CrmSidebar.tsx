import {
  LayoutDashboard, MapPin, Building, FolderPlus, Tag, Home,
  Users, UserPlus, Database, Receipt, BarChart3, User,
  CalendarDays, Settings, ChevronDown, ChevronRight, HelpCircle, Plus,
} from "lucide-react";
import { useState } from "react";

export type CrmModule =
  | "dashboard" | "areas" | "developers" | "new-projects"
  | "sell-listings" | "rent-listings" | "owners"
  | "leads" | "leads-buy" | "leads-rent" | "leads-portals" | "leads-add"
  | "database" | "transactions" | "transactions-add"
  | "kpi-contacts" | "kpi-viewings" | "kpi-insight"
  | "agents" | "calendar" | "settings";

interface SidebarItem {
  key: CrmModule;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  children?: { key: CrmModule; label: string; badge?: string }[];
}

const sidebarItems: SidebarItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { key: "areas", label: "Areas", icon: <MapPin size={18} /> },
  { key: "developers", label: "Developers", icon: <Building size={18} /> },
  { key: "new-projects", label: "New Projects", icon: <FolderPlus size={18} /> },
  {
    key: "sell-listings", label: "Sell Listings", icon: <Tag size={18} />,
    children: [
      { key: "sell-listings", label: "Sell List" },
    ],
  },
  {
    key: "rent-listings", label: "Rent Listings", icon: <Home size={18} />,
    children: [
      { key: "rent-listings", label: "Rent List" },
    ],
  },
  {
    key: "owners", label: "Owners", icon: <UserPlus size={18} />,
    children: [
      { key: "owners", label: "Owner List" },
    ],
  },
  {
    key: "leads", label: "Leads", icon: <Users size={18} />, badge: "New",
    children: [
      { key: "leads-buy", label: "Buy Leads" },
      { key: "leads-rent", label: "Rent Leads" },
      { key: "leads-portals", label: "Portals Leads" },
      { key: "leads-add", label: "Add Lead" },
    ],
  },
  { key: "database", label: "Database", icon: <Database size={18} /> },
  {
    key: "transactions", label: "Transactions", icon: <Receipt size={18} />,
    children: [
      { key: "transactions", label: "Transaction List" },
      { key: "transactions-add", label: "Add Transaction" },
    ],
  },
  {
    key: "kpi-contacts", label: "KPI Reports", icon: <BarChart3 size={18} />,
    children: [
      { key: "kpi-contacts", label: "Contacts" },
      { key: "kpi-viewings", label: "Viewings" },
      { key: "kpi-insight", label: "Insight Board" },
    ],
  },
  { key: "agents", label: "Agents", icon: <User size={18} /> },
  { key: "calendar", label: "Calendar", icon: <CalendarDays size={18} /> },
  { key: "settings", label: "Settings", icon: <Settings size={18} /> },
];

interface CrmSidebarProps {
  activeModule: CrmModule;
  onModuleChange: (m: CrmModule) => void;
  collapsed: boolean;
}

const CrmSidebar = ({ activeModule, onModuleChange, collapsed }: CrmSidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["leads", "kpi-contacts"]);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isActive = (key: CrmModule) => activeModule === key;

  return (
    <aside
      className={`bg-card border-r border-border h-full flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        {!collapsed ? (
          <span className="font-raleway font-medium text-sm text-foreground tracking-widest uppercase">
            Kaya CRM
          </span>
        ) : (
          <span className="font-raleway font-bold text-lg text-foreground mx-auto">K</span>
        )}
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-border space-y-1.5">
          <button
            onClick={() => onModuleChange("leads-add")}
            className="w-full flex items-center gap-2 px-3 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs font-medium hover:bg-kaya-olive/90 transition-colors"
          >
            <Plus size={14} />
            New Lead
          </button>
          <div className="flex gap-1.5">
            <button
              onClick={() => onModuleChange("sell-listings")}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-muted text-muted-foreground rounded-md font-raleway text-[10px] font-medium hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Tag size={12} />
              Sell
            </button>
            <button
              onClick={() => onModuleChange("rent-listings")}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-muted text-muted-foreground rounded-md font-raleway text-[10px] font-medium hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Home size={12} />
              Rent
            </button>
            <button
              onClick={() => onModuleChange("new-projects")}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-muted text-muted-foreground rounded-md font-raleway text-[10px] font-medium hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <FolderPlus size={12} />
              Project
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {sidebarItems.map((item) => (
          <div key={item.key + item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => {
                    if (collapsed) {
                      onModuleChange(item.children![0].key);
                    } else {
                      toggleGroup(item.key);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 font-raleway text-xs transition-colors ${
                    item.children.some((c) => isActive(c.key))
                      ? "text-foreground bg-muted/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] bg-kaya-olive text-primary-foreground rounded-full mr-1">
                          {item.badge}
                        </span>
                      )}
                      {expandedGroups.includes(item.key) ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </>
                  )}
                </button>
                {!collapsed && expandedGroups.includes(item.key) && (
                  <div className="ml-4 border-l border-border">
                    {item.children.map((child) => (
                      <button
                        key={child.key + child.label}
                        onClick={() => onModuleChange(child.key)}
                        className={`w-full flex items-center gap-3 pl-6 pr-4 py-2 font-raleway text-xs transition-colors ${
                          isActive(child.key)
                            ? "text-foreground bg-kaya-olive/10 border-r-2 border-kaya-olive"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                      >
                        <span className="flex-1 text-left">{child.label}</span>
                        {child.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-destructive text-destructive-foreground rounded-full">
                            {child.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => onModuleChange(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 font-raleway text-xs transition-colors ${
                  isActive(item.key)
                    ? "text-foreground bg-kaya-olive/10 border-r-2 border-kaya-olive"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30">
            <HelpCircle size={14} className="text-muted-foreground" />
            <div>
              <p className="font-raleway text-[10px] font-medium text-foreground">Need Help?</p>
              <p className="font-raleway text-[9px] text-muted-foreground">support@kayarealestate.ae</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default CrmSidebar;
