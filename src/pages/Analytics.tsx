import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const threatTrendData = [
  { name: "Jan", passwords: 400, emails: 240, phones: 180, cards: 120 },
  { name: "Feb", passwords: 300, emails: 139, phones: 221, cards: 95 },
  { name: "Mar", passwords: 520, emails: 980, phones: 290, cards: 180 },
  { name: "Apr", passwords: 278, emails: 390, phones: 200, cards: 108 },
  { name: "May", passwords: 890, emails: 480, phones: 418, cards: 220 },
  { name: "Jun", passwords: 390, emails: 380, phones: 250, cards: 150 },
  { name: "Jul", passwords: 490, emails: 430, phones: 310, cards: 210 },
];

const severityData = [
  { name: "Critical", value: 35, color: "hsl(0, 84%, 60%)" },
  { name: "High", value: 28, color: "hsl(38, 92%, 50%)" },
  { name: "Medium", value: 22, color: "hsl(199, 89%, 48%)" },
  { name: "Low", value: 15, color: "hsl(210, 40%, 70%)" },
];

const sourceData = [
  { name: "Forums", threats: 1240 },
  { name: "Paste Sites", threats: 890 },
  { name: "Markets", threats: 650 },
  { name: "Telegram", threats: 420 },
  { name: "IRC", threats: 180 },
];

const dailyData = [
  { day: "Mon", alerts: 45, resolved: 42 },
  { day: "Tue", alerts: 52, resolved: 48 },
  { day: "Wed", alerts: 38, resolved: 35 },
  { day: "Thu", alerts: 67, resolved: 60 },
  { day: "Fri", alerts: 41, resolved: 39 },
  { day: "Sat", alerts: 29, resolved: 28 },
  { day: "Sun", alerts: 23, resolved: 22 },
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">Threat intelligence and trend analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Last 7 Days
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 animate-scale-in">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Threats</span>
              <Badge className="bg-destructive/10 text-destructive">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-2 text-foreground">3,847</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </div>
          <div className="glass-card rounded-2xl p-6 animate-scale-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resolved</span>
              <Badge className="bg-success/10 text-success">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8%
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-2 text-foreground">3,612</p>
            <p className="text-xs text-muted-foreground mt-1">93.9% resolution rate</p>
          </div>
          <div className="glass-card rounded-2xl p-6 animate-scale-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Response</span>
              <Badge className="bg-success/10 text-success">
                <TrendingDown className="w-3 h-3 mr-1" />
                -15%
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-2 text-foreground">28s</p>
            <p className="text-xs text-muted-foreground mt-1">Faster than last month</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Threat Trends */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up">
            <h3 className="font-semibold text-foreground mb-6">Threat Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={threatTrendData}>
                <defs>
                  <linearGradient id="colorPasswords" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="name" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(214, 32%, 91%)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="passwords"
                  stroke="hsl(0, 84%, 60%)"
                  fill="url(#colorPasswords)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="emails"
                  stroke="hsl(38, 92%, 50%)"
                  fill="url(#colorEmails)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Severity Distribution */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h3 className="font-semibold text-foreground mb-6">Severity Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Source Analysis */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <h3 className="font-semibold text-foreground mb-6">Threats by Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis type="number" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(215, 16%, 47%)" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(214, 32%, 91%)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="threats" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Activity */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <h3 className="font-semibold text-foreground mb-6">Daily Alert Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="day" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(214, 32%, 91%)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="alerts"
                  stroke="hsl(0, 84%, 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(0, 84%, 60%)", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
