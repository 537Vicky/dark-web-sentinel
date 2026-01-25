import { useState, useEffect } from "react";
import { Globe, MapPin } from "lucide-react";

interface ThreatLocation {
  id: string;
  region: string;
  count: number;
  x: number;
  y: number;
}

const mockLocations: ThreatLocation[] = [
  { id: "1", region: "North America", count: 342, x: 22, y: 35 },
  { id: "2", region: "Europe", count: 521, x: 48, y: 30 },
  { id: "3", region: "Asia", count: 789, x: 72, y: 40 },
  { id: "4", region: "South America", count: 156, x: 28, y: 65 },
  { id: "5", region: "Africa", count: 234, x: 50, y: 55 },
  { id: "6", region: "Oceania", count: 98, x: 82, y: 70 },
];

export function ThreatMap() {
  const [locations, setLocations] = useState(mockLocations);
  const [activePin, setActivePin] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocations((prev) =>
        prev.map((loc) => ({
          ...loc,
          count: loc.count + Math.floor(Math.random() * 10),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Global Threat Distribution
        </h3>
      </div>

      <div className="relative w-full h-64 bg-accent/30 rounded-xl overflow-hidden">
        {/* Simplified world map background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <ellipse cx="50" cy="30" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground" />
            <ellipse cx="50" cy="30" rx="30" ry="17" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-muted-foreground" />
            <ellipse cx="50" cy="30" rx="15" ry="8" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-muted-foreground" />
            <line x1="5" y1="30" x2="95" y2="30" stroke="currentColor" strokeWidth="0.2" className="text-muted-foreground" />
            <line x1="50" y1="5" x2="50" y2="55" stroke="currentColor" strokeWidth="0.2" className="text-muted-foreground" />
          </svg>
        </div>

        {/* Threat pins */}
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            onMouseEnter={() => setActivePin(loc.id)}
            onMouseLeave={() => setActivePin(null)}
          >
            <div className="relative">
              <span className="absolute flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-40"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive items-center justify-center">
                  <MapPin className="w-2 h-2 text-destructive-foreground" />
                </span>
              </span>
              
              {activePin === loc.id && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-2 shadow-lg z-10 whitespace-nowrap animate-scale-in">
                  <p className="text-xs font-medium text-foreground">{loc.region}</p>
                  <p className="text-xs text-muted-foreground">{loc.count} threats</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {locations.slice(0, 3).map((loc) => (
          <div key={loc.id} className="text-center p-2 rounded-lg bg-accent/50">
            <p className="text-xs text-muted-foreground">{loc.region}</p>
            <p className="text-sm font-bold text-foreground">{loc.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
