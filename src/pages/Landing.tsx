import { Link } from "react-router-dom";
import { Shield, ArrowRight, CheckCircle, Zap, Eye, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    description: "24/7 surveillance of dark web sources for your sensitive data.",
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Immediate notifications when your data is detected in breaches.",
  },
  {
    icon: Lock,
    title: "Comprehensive Coverage",
    description: "Monitor passwords, emails, phone numbers, and credit cards.",
  },
  {
    icon: Globe,
    title: "Global Intelligence",
    description: "Access to worldwide dark web intelligence networks.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        
        {/* Animated circles */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center animate-glow">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">DataBreach Monitor</h1>
                <p className="text-xs text-muted-foreground">Real-Time Protection</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/dashboard">
                <Button className="gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-24 text-center">
          {/* Live status indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-8 animate-slide-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-sm font-medium text-success">System Live — Monitoring Active</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Real-Time Dark Web
            <br />
            <span className="text-primary">Breach Monitoring</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "200ms" }}>
            Protect your organization with enterprise-grade dark web intelligence. 
            Detect compromised credentials before they're exploited.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 animate-glow">
                Start Monitoring
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/analytics">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Analytics
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-slide-up" style={{ animationDelay: "400ms" }}>
            {[
              { value: "2.8M+", label: "Threats Detected" },
              { value: "99.9%", label: "Uptime" },
              { value: "< 1min", label: "Alert Speed" },
              { value: "10K+", label: "Sources Monitored" },
            ].map((stat, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-accent/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Enterprise-Grade Protection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive monitoring solutions designed for modern security teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card-strong rounded-2xl p-6 hover:scale-105 transition-transform duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="glass-card-strong rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Secure Your Data?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of organizations protecting their sensitive information with real-time dark web monitoring.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {["Instant Setup", "24/7 Monitoring", "Detailed Reports"].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-success" />
                  {item}
                </div>
              ))}
            </div>
            <Link to="/dashboard" className="inline-block mt-8">
              <Button size="lg" className="gap-2">
                Access Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 DataBreach Monitor. Enterprise Security Solutions.</p>
        </div>
      </footer>
    </div>
  );
}
