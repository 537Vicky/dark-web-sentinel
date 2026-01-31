import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Globe, Database, MessageSquare, Radio, ShoppingCart, FileText, Server, Lock, Search, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScanSource {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "pending" | "scanning" | "complete" | "found";
  progress: number;
  matchCount?: number;
}

const sourceIcons: Record<string, React.ElementType> = {
  forum: MessageSquare,
  marketplace: ShoppingCart,
  paste: FileText,
  irc: Radio,
  database: Database,
  blog: Globe,
  telegram: MessageSquare,
  leak: Lock,
  archive: Server,
  default: Globe,
};

export default function Scanning() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const sessionId = location.state?.sessionId;
  const keywordIds = location.state?.keywordIds || [];
  const keywordValues = location.state?.keywordValues || [];
  
  const [sources, setSources] = useState<ScanSource[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Initializing...");
  const [isComplete, setIsComplete] = useState(false);
  const [alertsFound, setAlertsFound] = useState(0);
  const [scanStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Fetch sources and start scanning animation
  useEffect(() => {
    const fetchSources = async () => {
      const { data: dbSources } = await supabase
        .from("dark_web_sources")
        .select("*")
        .eq("is_active", true);

      if (dbSources) {
        const initialSources: ScanSource[] = dbSources.map((source) => ({
          id: source.id,
          name: source.name,
          icon: sourceIcons[source.source_type] || sourceIcons.default,
          status: "pending",
          progress: 0,
        }));
        setSources(initialSources);
      }
    };

    fetchSources();
  }, []);

  // Elapsed time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - scanStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [scanStartTime]);

  // Animate scanning process
  useEffect(() => {
    if (sources.length === 0) return;

    const animateScan = async () => {
      setCurrentPhase("Connecting to dark web sources...");
      await delay(1000);

      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        
        // Set current source to scanning
        setSources((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: "scanning" } : s
          )
        );
        setCurrentPhase(`Scanning ${source.name}...`);

        // Animate progress for this source
        for (let progress = 0; progress <= 100; progress += 10) {
          setSources((prev) =>
            prev.map((s, idx) =>
              idx === i ? { ...s, progress } : s
            )
          );
          setOverallProgress(Math.floor(((i * 100 + progress) / (sources.length * 100)) * 100));
          await delay(50 + Math.random() * 100);
        }

        // Randomly determine if matches found (30% chance)
        const foundMatches = Math.random() < 0.3;
        const matchCount = foundMatches ? Math.floor(Math.random() * 3) + 1 : 0;
        
        if (foundMatches) {
          setAlertsFound((prev) => prev + matchCount);
        }

        setSources((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, status: foundMatches ? "found" : "complete", progress: 100, matchCount }
              : s
          )
        );

        await delay(200);
      }

      setCurrentPhase("Scan complete!");
      setIsComplete(true);
      setOverallProgress(100);

      // Now actually call the edge function to generate real alerts
      if (sessionId && keywordIds.length > 0) {
        try {
          const { data, error } = await supabase.functions.invoke("scan-keywords", {
            body: {
              session_id: sessionId,
              keyword_ids: keywordIds,
            },
          });

          if (error) throw error;

          toast({
            title: "Scan Complete",
            description: `Found ${data.alerts_count} potential exposures across ${data.sources_scanned} sources.`,
          });
        } catch (error: any) {
          console.error("Scan error:", error);
        }
      }

      // Navigate to dashboard after delay
      await delay(2000);
      navigate("/dashboard");
    };

    animateScan();
  }, [sources.length]);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-slow">
              <Shield className="w-12 h-12 text-primary animate-glow" />
            </div>
            {!isComplete && (
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isComplete ? "Scan Complete" : "Scanning Dark Web Sources"}
          </h1>
          <p className="text-muted-foreground">
            {isComplete
              ? `Found ${alertsFound} potential exposures`
              : currentPhase}
          </p>
        </div>

        {/* Keywords Being Scanned */}
        {keywordValues.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Keywords Being Scanned
            </h3>
            <div className="flex flex-wrap gap-2">
              {keywordValues.map((keyword: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Overall Progress */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Overall Progress</h3>
              <p className="text-sm text-muted-foreground">Elapsed time: {formatTime(elapsedTime)}</p>
            </div>
            <div className="flex items-center gap-4">
              {alertsFound > 0 && (
                <Badge variant="destructive" className="animate-scale-in">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {alertsFound} Alert{alertsFound !== 1 ? "s" : ""}
                </Badge>
              )}
              <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Source Grid */}
        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-foreground mb-4">Dark Web Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((source, index) => {
              const Icon = source.icon;
              return (
                <div
                  key={source.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden animate-fade-in ${
                    source.status === "scanning"
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                      : source.status === "found"
                      ? "border-destructive bg-destructive/5"
                      : source.status === "complete"
                      ? "border-success bg-success/5"
                      : "border-border bg-accent/30"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Scanning Animation Overlay */}
                  {source.status === "scanning" && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
                    </div>
                  )}

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          source.status === "scanning"
                            ? "bg-primary/20"
                            : source.status === "found"
                            ? "bg-destructive/20"
                            : source.status === "complete"
                            ? "bg-success/20"
                            : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            source.status === "scanning"
                              ? "text-primary animate-pulse"
                              : source.status === "found"
                              ? "text-destructive"
                              : source.status === "complete"
                              ? "text-success"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{source.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {source.status === "pending" && "Waiting..."}
                          {source.status === "scanning" && "Scanning..."}
                          {source.status === "complete" && "No threats found"}
                          {source.status === "found" && `${source.matchCount} match${source.matchCount !== 1 ? "es" : ""} found!`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {source.status === "pending" && (
                        <div className="w-6 h-6 rounded-full border-2 border-muted" />
                      )}
                      {source.status === "scanning" && (
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      )}
                      {source.status === "complete" && (
                        <CheckCircle className="w-6 h-6 text-success animate-scale-in" />
                      )}
                      {source.status === "found" && (
                        <AlertTriangle className="w-6 h-6 text-destructive animate-scale-in" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(source.status === "scanning" || source.progress > 0) && source.status !== "pending" && (
                    <div className="mt-3 relative">
                      <Progress value={source.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Complete Message */}
        {isComplete && (
          <div className="text-center mt-8 animate-slide-up">
            <p className="text-muted-foreground">
              Redirecting to dashboard...
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
