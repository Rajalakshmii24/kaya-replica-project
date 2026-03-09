import { useState } from "react";
import CrmSidebar, { CrmModule } from "./CrmSidebar";
import CrmTopNav from "./CrmTopNav";
import DashboardView from "./views/DashboardView";
import AreasView from "./views/AreasView";
import DevelopersView from "./views/DevelopersView";
import NewProjectsView from "./views/NewProjectsView";
import AddNewProjectForm from "./views/AddNewProjectForm";
import SellListingsView from "./views/SellListingsView";
import RentListingsView from "./views/RentListingsView";
import AddListingForm from "./views/AddListingForm";
import OwnersView from "./views/OwnersView";
import LeadsView from "./views/LeadsView";
import DatabaseView from "./views/DatabaseView";
import TransactionsView from "./views/TransactionsView";
import KpiReportsView from "./views/KpiReportsView";
import AgentsView from "./views/AgentsView";
import CalendarView from "./views/CalendarView";
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
      case "areas": return <AreasView />;
      case "developers": return <DevelopersView />;
      case "new-projects": return <NewProjectsView />;
      case "sell-listings": return <SellListingsView onNavigate={setActiveModule} />;
      case "sell-listings-add": return <AddListingForm type="SELL" onSave={() => setActiveModule("sell-listings")} onCancel={() => setActiveModule("sell-listings")} />;
      case "rent-listings": return <RentListingsView onNavigate={setActiveModule} />;
      case "rent-listings-add": return <AddListingForm type="RENT" onSave={() => setActiveModule("rent-listings")} onCancel={() => setActiveModule("rent-listings")} />;
      case "owners": return <OwnersView />;
      case "leads":
      case "leads-buy": return <LeadsView initialTab="buy" />;
      case "leads-rent": return <LeadsView initialTab="rent" />;
      case "leads-portals": return <LeadsView initialTab="portals" />;
      case "leads-add": return <LeadsView initialTab="add" />;
      case "database": return <DatabaseView />;
      case "transactions":
      case "transactions-add": return <TransactionsView showAdd={activeModule === "transactions-add"} />;
      case "kpi-contacts": return <KpiReportsView initialTab="contacts" />;
      case "kpi-viewings": return <KpiReportsView initialTab="viewings" />;
      case "kpi-insight": return <KpiReportsView initialTab="insight" />;
      case "agents": return <AgentsView />;
      case "calendar": return <CalendarView />;
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
