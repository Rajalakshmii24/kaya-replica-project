import {
  LayoutDashboard, Users, Building2, User, CalendarDays,
  Briefcase, ListChecks, BarChart3, PieChart, Activity,
  FileText, MapPin, ChevronDown, ChevronRight, Settings,
  Plus, Phone,
} from "lucide-react";
import { useState } from "react";

export type CrmModule =
  | "dashboard" | "leads" | "contacts" | "deals"
  | "listings" | "agents" | "activities" | "tasks"
  | "reports" | "analytics" | "calendar" | "reminders"
  | "map" | "settings";

interface SidebarItem {
  key: CrmModule;
  label: string;
  icon: React.ReactNode;
  children?: { key: CrmModule; label: string }[];
}

const sidebarItems: SidebarItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  {
    key: "leads", label: "Leads", icon: <Users size={18} />,
    children: [
      { key: "leads", label: "All Leads" },
      { key: "contacts", label: "Contacts" },
    ],
  },
  {
    key: "deals", label: "Deals", icon: <Briefcase size={18} />,
  },
  {
    key: "listings", label: "Properties", icon: <Building2 size={18} />,
  },
  { key: "agents", label: "Agents", icon: <User size={18} /> },
  {
    key: "activities", label: "Activities", icon: <Activity size={18} />,
    children: [
      { key: "activities", label: "Activity Log" },
      { key: "tasks", label: "Tasks" },
      { key: "calendar", label: "Calendar" },
      { key: "reminders", label: "Reminders" },
    ],
  },
  {
    key: "reports", label: "Reports", icon: <FileText size={18} />,
    children: [
      { key: "reports", label: "Reports" },
      { key: "analytics", label: "Analytics" },
    ],
  },
  { key: "map", label: "Map", icon: <MapPin size={18} /> },
  { key: "settings", label: "Settings", icon: <Settings size={18} /> },
];

interface CrmSidebarProps {
  activeModule: CrmModule;
  onModuleChange: (m: CrmModule) => void;
  collapsed: boolean;
}

const CrmSidebar = ({ activeModule, onModuleChange, collapsed }: CrmSidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["leads", "activities", "reports"]);

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
      {/* Logo area */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        {!collapsed && (
          <span className="font-raleway font-medium text-sm text-foreground tracking-widest uppercase">
            Kaya CRM
          </span>
        )}
        {collapsed && (
          <span className="font-raleway font-bold text-lg text-foreground mx-auto">K</span>
        )}
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-border">
          <button
            onClick={() => onModuleChange("leads")}
            className="w-full flex items-center gap-2 px-3 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs font-medium hover:bg-kaya-olive/90 transition-colors"
          >
            <Plus size={14} />
            New Lead
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {sidebarItems.map((item) => (
          <div key={item.key}>
            {item.children ? (
              <>
                <button
                  onClick={() => {
                    if (collapsed) {
                      onModuleChange(item.key);
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
                        key={child.key}
                        onClick={() => onModuleChange(child.key)}
                        className={`w-full flex items-center gap-3 pl-6 pr-4 py-2 font-raleway text-xs transition-colors ${
                          isActive(child.key)
                            ? "text-foreground bg-kaya-olive/10 border-r-2 border-kaya-olive"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                      >
                        {child.label}
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
    </aside>
  );
};

export default CrmSidebar;
