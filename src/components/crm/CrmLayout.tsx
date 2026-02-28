import { useState } from "react";
import CrmSidebar, { CrmModule } from "./CrmSidebar";
import CrmTopNav from "./CrmTopNav";
import DashboardView from "./views/DashboardView";
import LeadsView from "./views/LeadsView";
import ContactsView from "./views/ContactsView";
import DealsView from "./views/DealsView";
import ListingsView from "./views/ListingsView";
import AgentsView from "./views/AgentsView";
import ActivitiesView from "./views/ActivitiesView";
import TasksView from "./views/TasksView";
import ReportsView from "./views/ReportsView";
import AnalyticsView from "./views/AnalyticsView";
import CalendarView from "./views/CalendarView";
import RemindersView from "./views/RemindersView";
import MapView from "./views/MapView";
import SettingsView from "./views/SettingsView";

interface CrmLayoutProps {
  onLogout: () => void;
  userEmail?: string;
}

const CrmLayout = ({ onLogout, userEmail }: CrmLayoutProps) => {
  const [activeModule, setActiveModule] = useState<CrmModule>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard": return <DashboardView onNavigate={setActiveModule} />;
      case "leads": return <LeadsView />;
      case "contacts": return <ContactsView />;
      case "deals": return <DealsView />;
      case "listings": return <ListingsView />;
      case "agents": return <AgentsView />;
      case "activities": return <ActivitiesView />;
      case "tasks": return <TasksView />;
      case "reports": return <ReportsView />;
      case "analytics": return <AnalyticsView />;
      case "calendar": return <CalendarView />;
      case "reminders": return <RemindersView />;
      case "map": return <MapView />;
      case "settings": return <SettingsView />;
      default: return <DashboardView onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <CrmSidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        collapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <CrmTopNav
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          userEmail={userEmail}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default CrmLayout;
