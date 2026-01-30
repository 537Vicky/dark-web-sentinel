import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RealAlertFeed } from "@/components/dashboard/RealAlertFeed";
import { KeywordStatus } from "@/components/dashboard/KeywordStatus";
import { ThreatMap } from "@/components/dashboard/ThreatMap";
import { Shield, AlertTriangle, Eye, Clock, Key, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeThreats: 0,
    keywords: 0,
    sourcesScanned: 0,
    lastScan: "Never",
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      // Get alert count
      const { count: alertCount } = await supabase
        .from("alerts")
        .select("*", { count: "exact", head: true })
        .eq("is_reviewed", false);

      // Get keyword count
      const { count: keywordCount } = await supabase
        .from("keywords")
        .select("*", { count: "exact", head: true });

      // Get sources count
      const { count: sourceCount } = await supabase
        .from("dark_web_sources")
        .select("*", { count: "exact", head: true });

      // Get last session
      const { data: lastSession } = await supabase
        .from("monitoring_sessions")
        .select("completed_at")
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setStats({
        activeThreats: alertCount || 0,
        keywords: keywordCount || 0,
        sourcesScanned: sourceCount || 0,
        lastScan: lastSession?.completed_at
          ? new Date(lastSession.completed_at).toLocaleString()
          : "Never",
      });
    };

    fetchStats();

    // Subscribe to real-time alert updates for stats
    const channel = supabase
      .channel("alerts-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alerts",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time breach monitoring overview</p>
          </div>
          <Link to="/home">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Keywords
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Threats"
            value={stats.activeThreats.toString()}
            change={stats.activeThreats > 0 ? "Requires attention" : "All clear"}
            changeType={stats.activeThreats > 0 ? "negative" : "positive"}
            icon={AlertTriangle}
            iconColor="text-destructive"
            delay={0}
          />
          <StatsCard
            title="Keywords Monitored"
            value={stats.keywords.toString()}
            change="Active monitoring"
            changeType="neutral"
            icon={Key}
            iconColor="text-primary"
            delay={100}
          />
          <StatsCard
            title="Sources Scanned"
            value={stats.sourcesScanned.toString()}
            change="Dark web sources"
            changeType="neutral"
            icon={Eye}
            iconColor="text-info"
            delay={200}
          />
          <StatsCard
            title="Last Scan"
            value={stats.lastScan === "Never" ? "—" : "Complete"}
            change={stats.lastScan}
            changeType="positive"
            icon={Clock}
            iconColor="text-success"
            delay={300}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <RealAlertFeed />
          <KeywordStatus />
        </div>

        {/* Threat Map */}
        <ThreatMap />
      </div>
    </DashboardLayout>
  );
}
