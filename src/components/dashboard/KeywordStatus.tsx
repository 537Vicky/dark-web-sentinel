import { useState, useEffect } from "react";
import { Key, Mail, Phone, CreditCard, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Keyword {
  id: string;
  keyword: string;
  keyword_type: string;
  is_active: boolean;
  created_at: string;
  alert_count?: number;
}

const typeIcons: Record<string, typeof Key> = {
  password: Key,
  email: Mail,
  phone: Phone,
  credit_card: CreditCard,
};

export function KeywordStatus() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchKeywords = async () => {
      // Fetch keywords
      const { data: keywordsData, error: keywordsError } = await supabase
        .from("keywords")
        .select("*")
        .order("created_at", { ascending: false });

      if (keywordsError) {
        console.error("Error fetching keywords:", keywordsError);
        setLoading(false);
        return;
      }

      // Fetch alert counts per keyword
      const { data: alertsData, error: alertsError } = await supabase
        .from("alerts")
        .select("keyword_id");

      if (!alertsError && alertsData) {
        const alertCounts: Record<string, number> = {};
        alertsData.forEach((alert) => {
          alertCounts[alert.keyword_id] = (alertCounts[alert.keyword_id] || 0) + 1;
        });

        const keywordsWithCounts = (keywordsData || []).map((kw) => ({
          ...kw,
          alert_count: alertCounts[kw.id] || 0,
        }));

        setKeywords(keywordsWithCounts);
      } else {
        setKeywords(keywordsData || []);
      }

      setLoading(false);
    };

    fetchKeywords();
  }, [user]);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Keyword Status</h3>
        <Badge variant="secondary">{keywords.length} monitored</Badge>
      </div>

      {keywords.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Key className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No keywords monitored yet</p>
          <p className="text-sm mt-1">Add keywords from the Home page</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {keywords.map((keyword, index) => {
            const Icon = typeIcons[keyword.keyword_type] || Key;
            const hasAlerts = (keyword.alert_count || 0) > 0;

            return (
              <div
                key={keyword.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all duration-200",
                  hasAlerts
                    ? "bg-destructive/10 border-destructive/30"
                    : "bg-success/10 border-success/30"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    hasAlerts ? "bg-destructive/20" : "bg-success/20"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      hasAlerts ? "text-destructive" : "text-success"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground truncate max-w-[150px]">
                      {keyword.keyword}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {keyword.keyword_type.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasAlerts ? (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="w-3 h-3" />
                      {keyword.alert_count} exposure{keyword.alert_count !== 1 ? "s" : ""}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1 bg-success/20 text-success border-success/30">
                      <CheckCircle className="w-3 h-3" />
                      Safe
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
