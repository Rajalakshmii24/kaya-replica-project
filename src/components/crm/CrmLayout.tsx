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
import CalendarView from "./views/CalendarView";
import AdminView from "./views/AdminView";

interface CrmLayoutProps {
  onLogout: () => void;
  userEmail?: string;
}

const CrmLayout = ({ onLogout, userEmail }: CrmLayoutProps) => {
  const [activeModule, setActiveModule] = useState<CrmModule>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterContext, setFilterContext] = useState<{ type: "area" | "developer"; value: string } | null>(null);

  const navigateWithFilter = (module: CrmModule, filter?: { type: "area" | "developer"; value: string }) => {
    if (filter) setFilterContext(filter);
    else setFilterContext(null);
    setActiveModule(module);
  };

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard": return <DashboardView onNavigate={setActiveModule} />;
      case "areas":
      case "areas-list": return <AreasView onNavigate={navigateWithFilter} />;
      case "developers":
      case "developers-list": return <DevelopersView onNavigate={navigateWithFilter} />;
      case "new-projects": return <NewProjectsView onNavigate={setActiveModule} filterContext={filterContext} />;
      case "new-projects-add": return <AddNewProjectForm onSave={() => setActiveModule("new-projects")} onCancel={() => setActiveModule("new-projects")} />;
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
      case "calendar": return <CalendarView />;
      case "admin":
      case "admin-staff": return <AdminView initialTab="staff" />;
      case "admin-permissions": return <AdminView initialTab="permissions" />;
      case "admin-teams": return <AdminView initialTab="teams" />;
      case "admin-roles": return <AdminView initialTab="roles" />;
      case "admin-watermark": return <AdminView initialTab="watermark" />;
      case "admin-integrations": return <AdminView initialTab="integrations" />;
      case "admin-data-import": return <AdminView initialTab="data-import" />;
      case "admin-activity-log": return <AdminView initialTab="activity-log" />;
      case "admin-customized-fields": return <AdminView initialTab="customized-fields" />;
      case "admin-locations": return <AdminView initialTab="locations" />;
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
