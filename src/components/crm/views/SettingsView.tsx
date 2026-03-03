import { useState } from "react";
import { Settings, User, Bell, Shield, Palette, Globe, Database, Key, Mail, Phone } from "lucide-react";

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { key: "profile", label: "Profile", icon: <User size={16} /> },
    { key: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { key: "security", label: "Security", icon: <Shield size={16} /> },
    { key: "integrations", label: "Integrations", icon: <Database size={16} /> },
    { key: "appearance", label: "Appearance", icon: <Palette size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-raleway text-xl font-medium text-foreground">Settings</h1>
        <p className="font-raleway text-sm text-muted-foreground">CRM configuration & preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-48 flex-shrink-0 hidden md:block">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-raleway text-xs transition-colors ${
                  activeTab === tab.key
                    ? "bg-kaya-olive/10 text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden w-full">
          <div className="flex gap-1 overflow-x-auto pb-3 mb-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-md font-raleway text-xs ${
                  activeTab === tab.key
                    ? "bg-kaya-olive text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 hidden md:block">
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-5 border-b border-border">
                <h3 className="font-raleway text-sm font-medium text-foreground">Profile Settings</h3>
                <p className="font-raleway text-xs text-muted-foreground mt-1">Manage your account information</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-kaya-olive rounded-full flex items-center justify-center">
                    <User size={28} className="text-primary-foreground" />
                  </div>
                  <div>
                    <button className="px-4 py-1.5 bg-kaya-olive text-primary-foreground rounded-lg font-raleway text-xs hover:bg-kaya-olive/90">
                      Change Avatar
                    </button>
                  </div>
                </div>
                {[
                  { label: "Display Name", value: "Admin", icon: <User size={14} /> },
                  { label: "Email", value: "admin@kaya.ae", icon: <Mail size={14} /> },
                  { label: "Phone", value: "+971 4 252 7575", icon: <Phone size={14} /> },
                  { label: "Role", value: "Administrator", icon: <Key size={14} /> },
                  { label: "Language", value: "English", icon: <Globe size={14} /> },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{field.icon}</span>
                      <span className="font-raleway text-sm text-foreground">{field.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-raleway text-sm text-muted-foreground">{field.value}</span>
                      <button className="font-raleway text-[10px] text-kaya-olive hover:underline">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-5 border-b border-border">
                <h3 className="font-raleway text-sm font-medium text-foreground">Notification Preferences</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { label: "Email Notifications", desc: "Receive email for new leads and updates", enabled: true },
                  { label: "Lead Alerts", desc: "Get notified when new leads are assigned", enabled: true },
                  { label: "Daily Reports", desc: "Receive daily summary reports", enabled: false },
                  { label: "Property Updates", desc: "Notifications for property status changes", enabled: true },
                  { label: "Task Reminders", desc: "Reminders for upcoming tasks and deadlines", enabled: true },
                  { label: "SMS Notifications", desc: "Receive SMS for urgent updates", enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-raleway text-sm text-foreground">{item.label}</p>
                      <p className="font-raleway text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${
                      item.enabled ? "bg-kaya-olive justify-end" : "bg-muted justify-start"
                    }`}>
                      <div className="w-4 h-4 bg-card rounded-full mx-0.5 shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-5 border-b border-border">
                <h3 className="font-raleway text-sm font-medium text-foreground">Security Settings</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { label: "Two-Factor Auth", value: "Disabled", action: "Enable" },
                  { label: "Session Timeout", value: "30 minutes", action: "Change" },
                  { label: "Password", value: "Last changed 30 days ago", action: "Change" },
                  { label: "Active Sessions", value: "2 devices", action: "Manage" },
                  { label: "Login History", value: "View recent logins", action: "View" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-raleway text-sm text-foreground">{item.label}</p>
                      <p className="font-raleway text-xs text-muted-foreground mt-0.5">{item.value}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-muted text-foreground rounded-md font-raleway text-xs hover:bg-muted/80">
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-5 border-b border-border">
                <h3 className="font-raleway text-sm font-medium text-foreground">Integrations</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { label: "Pixxi CRM API", status: "Connected", statusColor: "bg-green-100 text-green-800" },
                  { label: "Google Calendar", status: "Not Connected", statusColor: "bg-muted text-muted-foreground" },
                  { label: "WhatsApp Business", status: "Not Connected", statusColor: "bg-muted text-muted-foreground" },
                  { label: "Email Marketing", status: "Not Connected", statusColor: "bg-muted text-muted-foreground" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Database size={16} className="text-muted-foreground" />
                      <span className="font-raleway text-sm text-foreground">{item.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-raleway rounded ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-5 border-b border-border">
                <h3 className="font-raleway text-sm font-medium text-foreground">Appearance</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { label: "Theme", value: "Light" },
                  { label: "Sidebar", value: "Expanded" },
                  { label: "Density", value: "Comfortable" },
                  { label: "Date Format", value: "DD/MM/YYYY" },
                  { label: "Currency", value: "AED" },
                ].map((item) => (
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

      {/* Mobile content */}
      <div className="md:hidden">
        {/* Same content rendered for mobile - simplified */}
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="font-raleway text-sm text-muted-foreground">Select a tab above to view settings.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
