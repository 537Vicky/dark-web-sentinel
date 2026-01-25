import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Download, Calendar, Filter, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Report {
  id: string;
  title: string;
  date: string;
  type: "daily" | "weekly" | "monthly" | "incident";
  severity: "critical" | "high" | "medium" | "low";
  status: "ready" | "pending" | "generating";
  threats: number;
}

const reports: Report[] = [
  { id: "1", title: "Weekly Threat Summary", date: "Jan 25, 2024", type: "weekly", severity: "high", status: "ready", threats: 156 },
  { id: "2", title: "Critical Incident Report", date: "Jan 24, 2024", type: "incident", severity: "critical", status: "ready", threats: 23 },
  { id: "3", title: "Daily Monitoring Report", date: "Jan 24, 2024", type: "daily", severity: "medium", status: "ready", threats: 45 },
  { id: "4", title: "Monthly Analytics", date: "Jan 23, 2024", type: "monthly", severity: "low", status: "generating", threats: 892 },
  { id: "5", title: "Credential Exposure Alert", date: "Jan 22, 2024", type: "incident", severity: "critical", status: "ready", threats: 12 },
  { id: "6", title: "Weekly Threat Summary", date: "Jan 18, 2024", type: "weekly", severity: "medium", status: "ready", threats: 134 },
];

const severityColors = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-info/10 text-info border-info/20",
  low: "bg-muted text-muted-foreground border-muted",
};

const typeColors = {
  daily: "bg-primary/10 text-primary",
  weekly: "bg-success/10 text-success",
  monthly: "bg-info/10 text-info",
  incident: "bg-destructive/10 text-destructive",
};

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">Security reports and threat summaries</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2">
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Reports", value: "247", icon: FileText, color: "text-primary" },
            { label: "Critical Alerts", value: "35", icon: AlertTriangle, color: "text-destructive" },
            { label: "Resolved", value: "212", icon: CheckCircle, color: "text-success" },
            { label: "Pending", value: "12", icon: Clock, color: "text-warning" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-4 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-accent", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reports List */}
        <div className="glass-card rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-foreground">Recent Reports</h3>
          </div>
          <div className="divide-y divide-border">
            {reports.map((report, index) => (
              <div
                key={report.id}
                className="p-6 hover:bg-accent/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${(index + 4) * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-accent">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{report.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-muted-foreground">{report.date}</span>
                        <Badge variant="outline" className={typeColors[report.type]}>
                          {report.type}
                        </Badge>
                        <Badge variant="outline" className={severityColors[report.severity]}>
                          {report.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{report.threats} threats</p>
                      <p className="text-xs text-muted-foreground">
                        {report.status === "ready" ? "Ready to download" : 
                         report.status === "generating" ? "Generating..." : "Pending"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={report.status !== "ready"}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Preview */}
        <div className="mt-8 glass-card rounded-2xl p-8 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Report Preview</h3>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
          
          <div className="bg-accent/30 rounded-xl p-8 border-2 border-dashed border-border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Weekly Threat Summary Report</h2>
              <p className="text-muted-foreground mt-2">January 19 - January 25, 2024</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Total Threats Detected", value: "156", severity: "critical" },
                { label: "Credentials Exposed", value: "89", severity: "high" },
                { label: "Resolved Issues", value: "142", severity: "low" },
              ].map((item) => (
                <div key={item.label} className="bg-card rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{item.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Executive Summary</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This week's monitoring activities identified 156 potential threats across monitored dark web sources. 
                The majority of detections (57%) were related to credential exposures, with 23 critical-severity 
                incidents requiring immediate attention. Our response team successfully resolved 142 issues within 
                the SLA timeframe, maintaining a 91% resolution rate.
              </p>
              <h4 className="font-semibold text-foreground mt-6">Key Findings</h4>
              <ul className="text-muted-foreground text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2"></span>
                  23 critical credential dumps detected on dark web forums
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2"></span>
                  45 corporate email addresses found in new paste sites
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-info mt-2"></span>
                  12 phone number exposures linked to phishing campaigns
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
