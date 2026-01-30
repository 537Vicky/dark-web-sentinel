import { useState, useEffect } from "react";
import { AlertTriangle, Key, Mail, Phone, CreditCard, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Alert {
  id: string;
  keyword_text: string;
  source_name: string;
  severity: string;
  message: string;
  is_reviewed: boolean;
  created_at: string;
}

const alertIcons: Record<string, typeof Key> = {
  password: Key,
  email: Mail,
  phone: Phone,
  credit_card: CreditCard,
};

const severityColors: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-info text-info-foreground",
  low: "bg-muted text-muted-foreground",
};

export function RealAlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Fetch initial alerts
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setAlerts(data);
      }
      setLoading(false);
    };

    fetchAlerts();

    // Subscribe to real-time alerts
    const channel = supabase
      .channel("alerts-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "alerts",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setAlerts((prev) => [payload.new as Alert, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const markAsReviewed = async (alertId: string) => {
    await supabase
      .from("alerts")
      .update({ is_reviewed: true })
      .eq("id", alertId);

    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, is_reviewed: true } : a))
    );
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-center h-48">
          <div className="animate-pulse text-muted-foreground">Loading alerts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Live Alert Feed
        </h3>
        {alerts.length > 0 && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success opacity-50" />
          <p className="text-lg font-medium">No Exposures Found</p>
          <p className="text-sm mt-1">Your monitored keywords are safe</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {alerts.map((alert, index) => {
            const Icon = alertIcons[alert.keyword_text?.includes("@") ? "email" : "password"] || AlertTriangle;
            return (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-xl bg-accent/50 border border-border hover:bg-accent transition-all duration-200",
                  index === 0 && "animate-slide-up",
                  alert.is_reviewed && "opacity-60"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", severityColors[alert.severity] || severityColors.medium)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground truncate">
                        {alert.message}
                      </span>
                      <Badge variant="outline" className={cn("text-xs flex-shrink-0", 
                        alert.severity === "critical" && "border-destructive text-destructive",
                        alert.severity === "high" && "border-warning text-warning"
                      )}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      Keyword: <span className="font-medium">{alert.keyword_text}</span> • Source: {alert.source_name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatTime(alert.created_at)}
                    </div>
                    {!alert.is_reviewed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsReviewed(alert.id)}
                        className="text-xs h-6 px-2"
                      >
                        Mark Reviewed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
