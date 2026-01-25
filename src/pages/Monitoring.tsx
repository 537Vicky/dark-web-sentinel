import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MonitorPanel } from "@/components/dashboard/MonitorPanel";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { Play, Pause, RefreshCw, Search, Filter, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const scanSources = [
  { name: "Dark Web Forums", status: "active", count: 2341 },
  { name: "Paste Sites", status: "active", count: 1823 },
  { name: "Telegram Channels", status: "active", count: 892 },
  { name: "IRC Networks", status: "paused", count: 456 },
  { name: "Market Places", status: "active", count: 1234 },
];

export default function Monitoring() {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Live Monitoring</h1>
            <p className="text-muted-foreground mt-1">Real-time threat detection and analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={isScanning ? "destructive" : "default"}
              onClick={() => setIsScanning(!isScanning)}
              className="gap-2"
            >
              {isScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isScanning ? "Pause Scan" : "Resume Scan"}
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Scan Progress */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Scan Progress</h3>
            <Badge variant={isScanning ? "default" : "secondary"}>
              {isScanning ? "Scanning..." : "Paused"}
            </Badge>
          </div>
          <div className="relative h-3 bg-accent rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${scanProgress}%` }}
            />
            {isScanning && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{scanProgress}% Complete</span>
            <span>Est. 2min remaining</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up" style={{ animationDelay: "150ms" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search keywords, domains, or sources..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Configure
          </Button>
        </div>

        {/* Sources Grid */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-foreground mb-4">Active Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scanSources.map((source, index) => (
              <div
                key={source.name}
                className="p-4 rounded-xl bg-accent/50 border border-border hover:bg-accent transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-foreground">{source.name}</span>
                  <span className="relative flex h-2 w-2">
                    {source.status === "active" ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground"></span>
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {source.count.toLocaleString()} entries scanned
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Feeds */}
        <div className="grid lg:grid-cols-2 gap-6">
          <AlertFeed />
          <MonitorPanel />
        </div>
      </div>
    </DashboardLayout>
  );
}
