import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Settings as SettingsIcon, Bell, Shield, Key, Mail, Globe, User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your monitoring preferences</p>
        </div>

        {/* Profile Section */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Profile Settings</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input id="name" defaultValue="Acme Corporation" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Primary Email</Label>
              <Input id="email" type="email" defaultValue="security@acme.com" />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Notification Preferences</h3>
          </div>
          <div className="space-y-6">
            {[
              { label: "Critical Alerts", description: "Immediate notification for critical threats", enabled: true },
              { label: "Daily Summary", description: "Receive daily threat summary emails", enabled: true },
              { label: "Weekly Reports", description: "Automated weekly security reports", enabled: true },
              { label: "Real-time Updates", description: "Push notifications for new detections", enabled: false },
            ].map((item, index) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch defaultChecked={item.enabled} />
              </div>
            ))}
          </div>
        </div>

        {/* Monitoring Keywords */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Monitored Keywords</h3>
          </div>
          <div className="space-y-4">
            {[
              { type: "Passwords", icon: Key, count: 12 },
              { type: "Emails", icon: Mail, count: 45 },
              { type: "Domains", icon: Globe, count: 8 },
            ].map((item) => (
              <div key={item.type} className="flex items-center justify-between p-4 rounded-xl bg-accent/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.type}</p>
                    <p className="text-sm text-muted-foreground">{item.count} keywords configured</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full gap-2">
              <Key className="w-4 h-4" />
              Add New Keyword Group
            </Button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Security Settings</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">API Access</p>
                <p className="text-sm text-muted-foreground">Enable API access for integrations</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Session Timeout</p>
                <p className="text-sm text-muted-foreground">Automatically logout after inactivity</p>
              </div>
              <Input type="number" defaultValue="30" className="w-20 text-center" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end animate-slide-up" style={{ animationDelay: "500ms" }}>
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
