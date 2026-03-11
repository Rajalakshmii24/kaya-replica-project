import { useState } from "react";
import {
  Users, Shield, UserPlus, Key, Image, Plug, Upload, Activity, Settings, MapPin,
  Plus, Edit, Trash2, Search, Eye, EyeOff, ChevronRight, Check, X,
} from "lucide-react";

type AdminTab = "staff" | "permissions" | "teams" | "roles" | "watermark" | "integrations" | "data-import" | "activity-log" | "customized-fields" | "locations";

interface AdminViewProps {
  initialTab?: AdminTab;
}

const mockStaff = [
  { id: 1, name: "Admin User", email: "admin@kaya.ae", phone: "+971 4 252 7575", status: "Active", role: "Super Admin" },
  { id: 2, name: "Sarah Johnson", email: "sarah@kaya.ae", phone: "+971 50 234 5678", status: "Active", role: "Manager" },
  { id: 3, name: "Rajalakshmi", email: "raja@kaya.ae", phone: "+971 50 345 6789", status: "Active", role: "Agent" },
  { id: 4, name: "Nazim Ahmed", email: "nazim@kaya.ae", phone: "+971 50 456 7890", status: "Active", role: "Agent" },
  { id: 5, name: "Lisa Ahmed", email: "lisa@kaya.ae", phone: "+971 50 567 8901", status: "Inactive", role: "Agent" },
];

const mockTeams = [
  { id: 1, name: "Team 1", members: ["Sarah Johnson", "Rajalakshmi"], leader: "Sarah Johnson" },
  { id: 2, name: "Sales Team A", members: ["Nazim Ahmed"], leader: "Nazim Ahmed" },
];

const mockRoles = [
  { id: 1, name: "Super Admin", permissions: ["All Modules", "User Management", "Settings", "Delete Records", "Export Data"], color: "bg-purple-100 text-purple-800" },
  { id: 2, name: "Manager", permissions: ["All Modules", "Lead Assignment", "Reports", "Export Data"], color: "bg-blue-100 text-blue-800" },
  { id: 3, name: "Agent", permissions: ["Assigned Leads", "Assigned Properties", "Personal Reports"], color: "bg-green-100 text-green-800" },
];

const mockActivityLog = [
  { id: 1, user: "Admin User", action: "Created new listing", module: "Sell Listings", timestamp: "2026-03-11 10:30 AM" },
  { id: 2, user: "Sarah Johnson", action: "Updated lead status to DEAL", module: "Leads", timestamp: "2026-03-11 09:15 AM" },
  { id: 3, user: "Rajalakshmi", action: "Added new project", module: "New Projects", timestamp: "2026-03-10 04:45 PM" },
  { id: 4, user: "Nazim Ahmed", action: "Uploaded property images", module: "Sell Listings", timestamp: "2026-03-10 03:20 PM" },
  { id: 5, user: "Admin User", action: "Changed user role", module: "Admin", timestamp: "2026-03-10 02:00 PM" },
  { id: 6, user: "Sarah Johnson", action: "Exported leads report", module: "KPI Reports", timestamp: "2026-03-10 11:30 AM" },
  { id: 7, user: "Admin User", action: "Added new area: Palm Jebel Ali", module: "Locations", timestamp: "2026-03-09 09:00 AM" },
];

const crmModules = [
  "Dashboard", "Areas", "Developers", "New Projects", "Sell Listings", "Rent Listings",
  "Owners", "Leads", "Database", "Transactions", "KPI Reports", "Calendar", "Admin",
];

const permMatrix: Record<string, Record<string, boolean>> = {
  "Super Admin": Object.fromEntries(crmModules.map((m) => [m, true])),
  Manager: Object.fromEntries(crmModules.map((m) => [m, m !== "Admin"])),
  Agent: Object.fromEntries(crmModules.map((m) => [m, !["Admin", "KPI Reports", "Transactions"].includes(m)])),
};

const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
  { key: "staff", label: "Staff", icon: <Users size={16} /> },
  { key: "permissions", label: "Permissions", icon: <Shield size={16} /> },
  { key: "teams", label: "Teams", icon: <UserPlus size={16} /> },
  { key: "roles", label: "Roles", icon: <Key size={16} /> },
  { key: "watermark", label: "Watermark", icon: <Image size={16} /> },
  { key: "integrations", label: "Integrations", icon: <Plug size={16} /> },
  { key: "data-import", label: "Data Import", icon: <Upload size={16} /> },
  { key: "activity-log", label: "Activity Log", icon: <Activity size={16} /> },
  { key: "customized-fields", label: "Customized Fields", icon: <Settings size={16} /> },
  { key: "locations", label: "Locations", icon: <MapPin size={16} /> },
];

const AdminView = ({ initialTab = "staff" }: AdminViewProps) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [staffSearch, setStaffSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");

  const filteredStaff = staffSearch
    ? mockStaff.filter((s) => s.name.toLowerCase().includes(staffSearch.toLowerCase()) || s.email.toLowerCase().includes(staffSearch.toLowerCase()))
    : mockStaff;

  const filteredLog = logSearch
    ? mockActivityLog.filter((l) => l.user.toLowerCase().includes(logSearch.toLowerCase()) || l.action.toLowerCase().includes(logSearch.toLowerCase()))
    : mockActivityLog;

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 font-raleway text-xs text-muted-foreground">
        <span>Home</span><ChevronRight size={12} /><span>Admin</span><ChevronRight size={12} />
        <span className="text-foreground font-medium">{tabs.find((t) => t.key === activeTab)?.label}</span>
      </div>

      <div>
        <h1 className="font-raleway text-xl font-medium text-foreground">Admin</h1>
        <p className="font-raleway text-sm text-muted-foreground">System administration & configuration</p>
      </div>

      {/* Tab Bar - scrollable on mobile */}
      <div className="flex gap-1 overflow-x-auto pb-1 bg-card border border-border rounded-xl p-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg font-raleway text-xs font-medium transition-colors ${
              activeTab === tab.key ? "bg-kaya-olive text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}>
            {tab.icon}<span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* STAFF */}
      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={staffSearch} onChange={(e) => setStaffSearch(e.target.value)} placeholder="Search staff..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90"><Plus size={14} /> Add Staff</button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Name</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Email</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Phone</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Role</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Status</th>
                <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {filteredStaff.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3 font-raleway text-sm font-medium text-foreground">{s.name}</td>
                    <td className="px-5 py-3 hidden md:table-cell font-raleway text-xs text-muted-foreground">{s.email}</td>
                    <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{s.phone}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${s.role === "Super Admin" ? "bg-purple-100 text-purple-800" : s.role === "Manager" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{s.role}</span></td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${s.status === "Active" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>{s.status}</span></td>
                    <td className="px-5 py-3 text-right"><div className="flex items-center justify-end gap-1"><button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit size={14} /></button><button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PERMISSIONS */}
      {activeTab === "permissions" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Module</th>
                {Object.keys(permMatrix).map((role) => (
                  <th key={role} className="text-center px-4 py-3 font-raleway text-xs font-medium text-foreground">{role}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-border">
                {crmModules.map((mod) => (
                  <tr key={mod} className="hover:bg-muted/30">
                    <td className="px-5 py-3 font-raleway text-sm text-foreground">{mod}</td>
                    {Object.keys(permMatrix).map((role) => (
                      <td key={role} className="text-center px-4 py-3">
                        <div className={`w-5 h-5 rounded mx-auto flex items-center justify-center ${permMatrix[role][mod] ? "bg-green-100" : "bg-destructive/10"}`}>
                          {permMatrix[role][mod] ? <Check size={12} className="text-green-600" /> : <X size={12} className="text-destructive" />}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEAMS */}
      {activeTab === "teams" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90"><Plus size={14} /> Add Team</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTeams.map((team) => (
              <div key={team.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-raleway text-sm font-semibold text-foreground">{team.name}</h3>
                  <div className="flex gap-1"><button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Edit size={14} /></button><button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button></div>
                </div>
                <p className="font-raleway text-xs text-muted-foreground mb-2">Team Leader: <span className="text-foreground">{team.leader}</span></p>
                <div className="flex flex-wrap gap-1.5">
                  {team.members.map((m) => (
                    <span key={m} className="px-2 py-1 bg-kaya-olive/10 text-kaya-olive rounded-full font-raleway text-[10px]">{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROLES */}
      {activeTab === "roles" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90"><Plus size={14} /> Add Role</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockRoles.map((role) => (
              <div key={role.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 text-xs font-raleway font-medium rounded-full ${role.color}`}>{role.name}</span>
                  <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Edit size={14} /></button>
                </div>
                <div className="space-y-1.5">
                  {role.permissions.map((p) => (
                    <div key={p} className="flex items-center gap-2">
                      <Check size={12} className="text-green-600" />
                      <span className="font-raleway text-xs text-foreground">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WATERMARK */}
      {activeTab === "watermark" && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-raleway text-sm font-medium text-foreground mb-4">Property Photo Watermark</h3>
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-kaya-olive/50 hover:bg-kaya-olive/5 transition-colors">
            <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="font-raleway text-sm text-muted-foreground">Click to upload watermark image</p>
            <p className="font-raleway text-[10px] text-muted-foreground mt-1">PNG with transparency recommended</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div><label className="block font-raleway text-xs text-muted-foreground uppercase mb-1">Position</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-lg font-raleway text-xs"><option>Bottom Right</option><option>Bottom Left</option><option>Center</option><option>Top Right</option></select>
            </div>
            <div><label className="block font-raleway text-xs text-muted-foreground uppercase mb-1">Opacity</label>
              <input type="range" min="10" max="100" defaultValue="50" className="w-full" />
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs hover:bg-kaya-olive/90">Save Watermark Settings</button>
        </div>
      )}

      {/* INTEGRATIONS */}
      {activeTab === "integrations" && (
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {[
            { name: "Pixxi CRM API", status: "Connected", desc: "Main CRM data provider" },
            { name: "Property Finder", status: "Connected", desc: "Portal listing sync" },
            { name: "Bayut / Dubizzle", status: "Connected", desc: "Portal listing sync" },
            { name: "Google Calendar", status: "Not Connected", desc: "Calendar sync" },
            { name: "WhatsApp Business", status: "Not Connected", desc: "Lead communication" },
            { name: "Mailchimp", status: "Not Connected", desc: "Email marketing" },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Plug size={16} className="text-muted-foreground" />
                <div>
                  <p className="font-raleway text-sm text-foreground">{item.name}</p>
                  <p className="font-raleway text-[10px] text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${item.status === "Connected" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>{item.status}</span>
                <button className="px-3 py-1.5 border border-border rounded-lg font-raleway text-xs hover:bg-muted/30">{item.status === "Connected" ? "Configure" : "Connect"}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DATA IMPORT */}
      {activeTab === "data-import" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Leads Import", "Listings Import", "Owners Import"].map((importType) => (
              <div key={importType} className="bg-card border border-border rounded-xl p-5 text-center">
                <Upload size={28} className="mx-auto text-muted-foreground mb-3" />
                <h3 className="font-raleway text-sm font-medium text-foreground mb-1">{importType}</h3>
                <p className="font-raleway text-[10px] text-muted-foreground mb-3">Upload CSV or Excel file</p>
                <button className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs hover:bg-kaya-olive/90">Choose File</button>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-raleway text-sm font-medium text-foreground mb-2">Import History</h3>
            <p className="font-raleway text-xs text-muted-foreground text-center py-8">No import history available</p>
          </div>
        </div>
      )}

      {/* ACTIVITY LOG */}
      {activeTab === "activity-log" && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={logSearch} onChange={(e) => setLogSearch(e.target.value)} placeholder="Search activity..." className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">User</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Action</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Module</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Timestamp</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {filteredLog.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3 font-raleway text-sm text-foreground">{log.user}</td>
                    <td className="px-5 py-3 font-raleway text-xs text-muted-foreground">{log.action}</td>
                    <td className="px-5 py-3 hidden md:table-cell"><span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-muted text-muted-foreground">{log.module}</span></td>
                    <td className="px-5 py-3 font-raleway text-xs text-muted-foreground">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOMIZED FIELDS */}
      {activeTab === "customized-fields" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["Buy Leads", "Rent Leads", "Client Leads", "Sell Listings", "Rent Listings", "New Projects"].map((cat) => (
              <button key={cat} className="flex-shrink-0 px-3 py-1.5 rounded-lg font-raleway text-xs border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50">{cat}</button>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-raleway text-sm font-medium text-foreground">Field Configuration</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90"><Plus size={14} /> Add Field</button>
            </div>
            <div className="space-y-3">
              {["Preferred Property Type", "Preferred Developers", "Payment Method", "Source of Lead", "Birth Date", "Buyer Type", "Preferred Size"].map((field) => (
                <div key={field} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <div>
                    <p className="font-raleway text-sm text-foreground">{field}</p>
                    <p className="font-raleway text-[10px] text-muted-foreground">Identifier: {field.toLowerCase().replace(/ /g, "_")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-green-100 text-green-800">Required</span>
                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Edit size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LOCATIONS */}
      {activeTab === "locations" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["Country", "City", "Area", "Community"].map((level) => (
              <button key={level} className="flex-shrink-0 px-3 py-1.5 rounded-lg font-raleway text-xs border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50">{level}</button>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-raleway text-sm font-medium text-foreground">Locations Management</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90"><Plus size={14} /> Add</button>
            </div>
            <table className="w-full">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Name</th>
                <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Parent</th>
                <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {["UAE", "Saudi Arabia", "Oman", "Bahrain"].map((loc) => (
                  <tr key={loc} className="hover:bg-muted/30">
                    <td className="px-5 py-3 font-raleway text-sm text-foreground">{loc}</td>
                    <td className="px-5 py-3 font-raleway text-xs text-muted-foreground">—</td>
                    <td className="px-5 py-3 text-right"><div className="flex items-center justify-end gap-1"><button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Edit size={14} /></button><button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
