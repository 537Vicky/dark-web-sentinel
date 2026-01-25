import { useState, useEffect } from "react";
import { Key, Mail, Phone, CreditCard, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface KeywordStat {
  label: string;
  icon: typeof Key;
  count: number;
  trend: number;
  color: string;
}

const initialStats: KeywordStat[] = [
  { label: "Passwords", icon: Key, count: 1247, trend: 12, color: "text-destructive" },
  { label: "Emails", icon: Mail, count: 3891, trend: 8, color: "text-warning" },
  { label: "Phone Numbers", icon: Phone, count: 892, trend: -3, color: "text-info" },
  { label: "Credit Cards", icon: CreditCard, count: 456, trend: 23, color: "text-success" },
];

export function MonitorPanel() {
  const [stats, setStats] = useState(initialStats);
  const [totalScanned, setTotalScanned] = useState(2847291);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) =>
        prev.map((stat) => ({
          ...stat,
          count: stat.count + Math.floor(Math.random() * 5),
          trend: stat.trend + (Math.random() > 0.5 ? 1 : -1),
        }))
      );
      setTotalScanned((prev) => prev + Math.floor(Math.random() * 100));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const maxCount = Math.max(...stats.map((s) => s.count));

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Keyword Monitor</h3>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total Scanned</p>
          <p className="text-lg font-bold text-primary">{totalScanned.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const percentage = (stat.count / maxCount) * 100;

          return (
            <div
              key={stat.label}
              className="animate-fade-in opacity-0"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-accent", stat.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm text-foreground">{stat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{stat.count.toLocaleString()}</span>
                  <div
                    className={cn(
                      "flex items-center gap-0.5 text-xs",
                      stat.trend >= 0 ? "text-destructive" : "text-success"
                    )}
                  >
                    <TrendingUp
                      className={cn("w-3 h-3", stat.trend < 0 && "rotate-180")}
                    />
                    {Math.abs(stat.trend)}%
                  </div>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last scan</span>
          <span className="text-foreground font-medium">Just now</span>
        </div>
      </div>
    </div>
  );
}
