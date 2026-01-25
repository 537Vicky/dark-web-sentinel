import { useState, useEffect } from "react";
import { AlertTriangle, Key, Mail, Phone, CreditCard, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Alert {
  id: string;
  type: "password" | "email" | "phone" | "credit_card";
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  source: string;
  timestamp: Date;
}

const alertIcons = {
  password: Key,
  email: Mail,
  phone: Phone,
  credit_card: CreditCard,
};

const severityColors = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-info text-info-foreground",
  low: "bg-muted text-muted-foreground",
};

const mockAlerts: Alert[] = [
  { id: "1", type: "password", severity: "critical", message: "Credential dump detected", source: "darkweb-forum.onion", timestamp: new Date() },
  { id: "2", type: "email", severity: "high", message: "Corporate email exposure", source: "paste-bin.xyz", timestamp: new Date(Date.now() - 120000) },
  { id: "3", type: "credit_card", severity: "critical", message: "Payment data leak", source: "card-market.onion", timestamp: new Date(Date.now() - 300000) },
  { id: "4", type: "phone", severity: "medium", message: "Phone number database", source: "leak-archive.io", timestamp: new Date(Date.now() - 600000) },
  { id: "5", type: "password", severity: "high", message: "Hash dump identified", source: "breach-db.net", timestamp: new Date(Date.now() - 900000) },
];

export function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  useEffect(() => {
    const interval = setInterval(() => {
      const types: Alert["type"][] = ["password", "email", "phone", "credit_card"];
      const severities: Alert["severity"][] = ["critical", "high", "medium", "low"];
      const messages = {
        password: ["Credential dump detected", "Hash leak identified", "Password database exposed"],
        email: ["Corporate email exposure", "Email list detected", "Phishing target list found"],
        phone: ["Phone number database", "SMS leak detected", "Contact list exposed"],
        credit_card: ["Payment data leak", "Card dump detected", "Financial data exposure"],
      };
      const sources = ["darkweb-forum.onion", "paste-bin.xyz", "leak-archive.io", "breach-db.net", "card-market.onion"];

      const type = types[Math.floor(Math.random() * types.length)];
      const newAlert: Alert = {
        id: Date.now().toString(),
        type,
        severity: severities[Math.floor(Math.random() * severities.length)],
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        timestamp: new Date(),
      };

      setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Live Alert Feed
        </h3>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {alerts.map((alert, index) => {
          const Icon = alertIcons[alert.type];
          return (
            <div
              key={alert.id}
              className={cn(
                "p-4 rounded-xl bg-accent/50 border border-border hover:bg-accent transition-all duration-200 cursor-pointer",
                index === 0 && "animate-slide-up"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", severityColors[alert.severity])}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground truncate">
                      {alert.message}
                    </span>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Source: {alert.source}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {formatTime(alert.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
