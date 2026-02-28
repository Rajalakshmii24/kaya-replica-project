import { Settings, User, Bell, Shield, Palette } from "lucide-react";

const SettingsView = () => {
  const sections = [
    {
      title: "Profile Settings",
      icon: <User size={18} />,
      items: [
        { label: "Display Name", value: "Admin" },
        { label: "Email", value: "admin@kaya.ae" },
        { label: "Role", value: "Administrator" },
      ],
    },
    {
      title: "Notification Preferences",
      icon: <Bell size={18} />,
      items: [
        { label: "Email Notifications", value: "Enabled" },
        { label: "Lead Alerts", value: "Enabled" },
        { label: "Daily Reports", value: "Disabled" },
      ],
    },
    {
      title: "Security",
      icon: <Shield size={18} />,
      items: [
        { label: "Two-Factor Auth", value: "Disabled" },
        { label: "Session Timeout", value: "30 minutes" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-raleway text-xl font-medium text-foreground">Settings</h1>
        <p className="font-raleway text-sm text-muted-foreground">CRM configuration</p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 p-5 border-b border-border">
            <div className="text-kaya-olive">{section.icon}</div>
            <h3 className="font-raleway text-sm font-medium text-foreground">{section.title}</h3>
          </div>
          <div className="divide-y divide-border">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-4">
                <span className="font-raleway text-sm text-foreground">{item.label}</span>
                <span className="font-raleway text-sm text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SettingsView;
