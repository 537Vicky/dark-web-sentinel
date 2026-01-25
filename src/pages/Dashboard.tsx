import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { MonitorPanel } from "@/components/dashboard/MonitorPanel";
import { ThreatMap } from "@/components/dashboard/ThreatMap";
import { Shield, AlertTriangle, Eye, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time breach monitoring overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Threats"
            value="247"
            change="+12% from last hour"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="text-destructive"
            delay={0}
          />
          <StatsCard
            title="Protected Assets"
            value="1,892"
            change="All monitored"
            changeType="positive"
            icon={Shield}
            iconColor="text-success"
            delay={100}
          />
          <StatsCard
            title="Sources Scanned"
            value="10.4K"
            change="+342 new sources"
            changeType="neutral"
            icon={Eye}
            iconColor="text-info"
            delay={200}
          />
          <StatsCard
            title="Avg Response Time"
            value="< 30s"
            change="99.9% SLA"
            changeType="positive"
            icon={Clock}
            iconColor="text-primary"
            delay={300}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <AlertFeed />
          <MonitorPanel />
        </div>

        {/* Threat Map */}
        <ThreatMap />
      </div>
    </DashboardLayout>
  );
}
