import { useState } from "react";
import { Settings, User, Bell, Shield, Database, Palette, Key, Mail, Phone, Globe, Plus, Edit, Trash2, Users, Eye, EyeOff } from "lucide-react";

const mockUsers = [
  { id: 1, name: "Admin User", email: "admin@kaya.ae", role: "Admin", status: "Active", lastLogin: "2026-03-05" },
  { id: 2, name: "Sarah Johnson", email: "sarah@kaya.ae", role: "Sales Agent", status: "Active", lastLogin: "2026-03-04" },
  { id: 3, name: "Mike Chen", email: "mike@kaya.ae", role: "Sales Agent", status: "Active", lastLogin: "2026-03-03" },
  { id: 4, name: "Lisa Ahmed", email: "lisa@kaya.ae", role: "Sales Agent", status: "Inactive", lastLogin: "2026-02-20" },
];

const adminPermissions = [
  "Access all CRM sections",
  "Manage all leads and properties",
  "View all agents data",
  "Assign leads and properties",
  "Manage users and roles",
  "Access reports and system settings",
  "Delete records",
  "Export data",
];

const agentPermissions = [
  "Access assigned leads only",
  "Access assigned properties only",
  "Update own leads",
  "View personal performance data",
  "Limited access to reports",
];

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState<number | null>(null);

  const tabs = [
    { key: "users", label: "User Management", icon: <Users size={16} /> },
    { key: "roles", label: "Roles & Permissions", icon: <Shield size={16} /> },
    { key: "profile", label: "Profile", icon: <User size={16} /> },
    { key: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { key: "security", label: "Security", icon: <Key size={16} /> },
    { key: "integrations", label: "Integrations", icon: <Database size={16} /> },
    { key: "appearance", label: "Appearance", icon: <Palette size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-raleway text-xl font-medium text-foreground">Settings</h1>
        <p className="font-raleway text-sm text-muted-foreground">CRM configuration & admin management</p>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <div className="w-52 flex-shrink-0 hidden md:block">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-raleway text-xs transition-colors ${
                  activeTab === tab.key ? "bg-kaya-olive/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden w-full">
          <div className="flex gap-1 overflow-x-auto pb-3">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-md font-raleway text-xs ${activeTab === tab.key ? "bg-kaya-olive text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* User Management */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-raleway text-sm font-medium text-foreground">User Management</h3>
                <button onClick={() => setShowAddUser(true)} className="flex items-center gap-2 px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg text-xs font-raleway font-medium hover:bg-kaya-olive/90">
                  <Plus size={14} /> Add New User
                </button>
              </div>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">User</th>
                      <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden md:table-cell">Email</th>
                      <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Role</th>
                      <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground">Status</th>
                      <th className="text-left px-5 py-3 font-raleway text-xs font-medium text-foreground hidden lg:table-cell">Last Login</th>
                      <th className="text-right px-5 py-3 font-raleway text-xs font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-kaya-olive/10 rounded-full flex items-center justify-center"><User size={14} className="text-kaya-olive" /></div>
                            <span className="font-raleway text-sm font-medium text-foreground">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell font-raleway text-xs text-muted-foreground">{user.email}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${user.role === "Admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>{user.role}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>{user.status}</span>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell font-raleway text-xs text-muted-foreground">{user.lastLogin}</td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setShowEditUser(user.id)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Roles & Permissions */}
          {activeTab === "roles" && (
            <div className="space-y-6">
              <h3 className="font-raleway text-sm font-medium text-foreground">Roles & Permissions</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg">
                  <div className="p-5 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-purple-600" />
                        <h4 className="font-raleway text-sm font-medium text-foreground">Admin</h4>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-purple-100 text-purple-800">Full Control</span>
                    </div>
                    <p className="font-raleway text-xs text-muted-foreground mt-1">Complete access to all CRM features and management</p>
                  </div>
                  <div className="p-5 space-y-2">
                    {adminPermissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center"><span className="text-green-600 text-[10px]">✓</span></div>
                        <span className="font-raleway text-xs text-foreground">{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg">
                  <div className="p-5 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-600" />
                        <h4 className="font-raleway text-sm font-medium text-foreground">Sales Agent</h4>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-raleway rounded bg-blue-100 text-blue-800">Limited Access</span>
                    </div>
                    <p className="font-raleway text-xs text-muted-foreground mt-1">Restricted to own data and assigned items</p>
                  </div>
                  <div className="p-5 space-y-2">
                    {agentPermissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center"><span className="text-blue-600 text-[10px]">✓</span></div>
                        <span className="font-raleway text-xs text-foreground">{perm}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-3">
                      <p className="font-raleway text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Restricted</p>
                      {["Cannot manage users", "Cannot delete records", "Cannot export data", "Cannot access system settings"].map((perm) => (
                        <div key={perm} className="flex items-center gap-2 mt-1">
                          <div className="w-4 h-4 bg-destructive/10 rounded flex items-center justify-center"><span className="text-destructive text-[10px]">✕</span></div>
                          <span className="font-raleway text-xs text-muted-foreground">{perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-5 border-b border-border">
                <h3 className="font-raleway text-sm font-medium text-foreground">Profile Settings</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-kaya-olive rounded-full flex items-center justify-center"><User size={28} className="text-primary-foreground" /></div>
                  <button className="px-4 py-1.5 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs hover:bg-kaya-olive/90">Change Avatar</button>
                </div>
                {[
                  { label: "Display Name", value: "Admin", icon: <User size={14} /> },
                  { label: "Email", value: "admin@kaya.ae", icon: <Mail size={14} /> },
                  { label: "Phone", value: "+971 4 252 7575", icon: <Phone size={14} /> },
                  { label: "Role", value: "Administrator", icon: <Key size={14} /> },
                  { label: "Language", value: "English", icon: <Globe size={14} /> },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3"><span className="text-muted-foreground">{field.icon}</span><span className="font-raleway text-sm text-foreground">{field.label}</span></div>
                    <div className="flex items-center gap-3"><span className="font-raleway text-sm text-muted-foreground">{field.value}</span><button className="font-raleway text-[10px] text-kaya-olive hover:underline">Edit</button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-5 border-b border-border"><h3 className="font-raleway text-sm font-medium text-foreground">Notification Preferences</h3></div>
              <div className="divide-y divide-border">
                {[
                  { label: "Email Notifications", desc: "Receive email for new leads and updates", enabled: true },
                  { label: "Lead Alerts", desc: "Get notified when new leads are assigned", enabled: true },
                  { label: "Daily Reports", desc: "Receive daily summary reports", enabled: false },
                  { label: "Property Updates", desc: "Notifications for property status changes", enabled: true },
                  { label: "Task Reminders", desc: "Reminders for upcoming tasks and deadlines", enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4">
                    <div><p className="font-raleway text-sm text-foreground">{item.label}</p><p className="font-raleway text-xs text-muted-foreground mt-0.5">{item.desc}</p></div>
                    <div className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${item.enabled ? "bg-kaya-olive justify-end" : "bg-muted justify-start"}`}><div className="w-4 h-4 bg-card rounded-full mx-0.5 shadow-sm" /></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-5 border-b border-border"><h3 className="font-raleway text-sm font-medium text-foreground">Security Settings</h3></div>
              <div className="divide-y divide-border">
                {[
                  { label: "Two-Factor Auth", value: "Disabled", action: "Enable" },
                  { label: "Session Timeout", value: "30 minutes", action: "Change" },
                  { label: "Password", value: "Last changed 30 days ago", action: "Change" },
                  { label: "Active Sessions", value: "2 devices", action: "Manage" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4">
                    <div><p className="font-raleway text-sm text-foreground">{item.label}</p><p className="font-raleway text-xs text-muted-foreground mt-0.5">{item.value}</p></div>
                    <button className="px-3 py-1.5 bg-muted text-foreground rounded-md font-raleway text-xs hover:bg-muted/80">{item.action}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === "integrations" && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-5 border-b border-border"><h3 className="font-raleway text-sm font-medium text-foreground">Integrations</h3></div>
              <div className="divide-y divide-border">
                {[
                  { label: "Pixxi CRM API", status: "Connected", color: "bg-green-100 text-green-800" },
                  { label: "Google Calendar", status: "Not Connected", color: "bg-muted text-muted-foreground" },
                  { label: "WhatsApp Business", status: "Not Connected", color: "bg-muted text-muted-foreground" },
                  { label: "Email Marketing", status: "Not Connected", color: "bg-muted text-muted-foreground" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3"><Database size={16} className="text-muted-foreground" /><span className="font-raleway text-sm text-foreground">{item.label}</span></div>
                    <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-5 border-b border-border"><h3 className="font-raleway text-sm font-medium text-foreground">Appearance</h3></div>
              <div className="divide-y divide-border">
                {[{ label: "Theme", value: "Light" }, { label: "Sidebar", value: "Expanded" }, { label: "Density", value: "Comfortable" }, { label: "Date Format", value: "DD/MM/YYYY" }, { label: "Currency", value: "AED" }].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4">
                    <span className="font-raleway text-sm text-foreground">{item.label}</span>
                    <span className="font-raleway text-sm text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card border border-border rounded-xl w-full max-w-md mx-4 p-6 shadow-xl">
            <h2 className="font-raleway text-lg font-medium text-foreground mb-4">Add New User</h2>
            <div className="space-y-4">
              {["Full Name", "Email Address", "Phone Number"].map((label) => (
                <div key={label}>
                  <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</label>
                  <input className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
                </div>
              ))}
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Password</label>
                <input type="password" className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" />
              </div>
              <div>
                <label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Role</label>
                <select className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none">
                  <option value="admin">Admin</option>
                  <option value="agent">Sales Agent</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowAddUser(false)} className="px-4 py-2 font-raleway text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={() => setShowAddUser(false)} className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-sm font-medium hover:bg-kaya-olive/90">Create User</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card border border-border rounded-xl w-full max-w-md mx-4 p-6 shadow-xl">
            <h2 className="font-raleway text-lg font-medium text-foreground mb-4">Edit User</h2>
            <div className="space-y-4">
              {(() => { const user = mockUsers.find(u => u.id === showEditUser); return user ? (
                <>
                  <div><label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Full Name</label><input defaultValue={user.name} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" /></div>
                  <div><label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Email</label><input defaultValue={user.email} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-kaya-olive/50" /></div>
                  <div><label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Role</label>
                    <select defaultValue={user.role === "Admin" ? "admin" : "agent"} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none">
                      <option value="admin">Admin</option><option value="agent">Sales Agent</option>
                    </select>
                  </div>
                  <div><label className="block font-raleway text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</label>
                    <select defaultValue={user.status} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-raleway text-sm focus:outline-none">
                      <option value="Active">Active</option><option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </>
              ) : null; })()}
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowEditUser(null)} className="px-4 py-2 font-raleway text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={() => setShowEditUser(null)} className="px-4 py-2 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-sm font-medium hover:bg-kaya-olive/90">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
