import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Key, Mail, Phone, CreditCard, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const keywordTypes = [
  { id: "password", label: "Password", icon: Key, placeholder: "e.g., mypassword123" },
  { id: "email", label: "Email", icon: Mail, placeholder: "e.g., user@example.com" },
  { id: "phone", label: "Phone Number", icon: Phone, placeholder: "e.g., +1234567890" },
  { id: "credit_card", label: "Credit Card", icon: CreditCard, placeholder: "e.g., 4111111111111111" },
];

interface KeywordEntry {
  id: string;
  value: string;
  type: string;
}

export default function Home() {
  const [keywords, setKeywords] = useState<KeywordEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedType, setSelectedType] = useState("general");
  const [isScanning, setIsScanning] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const addKeyword = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    
    // Split by comma and add multiple keywords
    const newKeywords = trimmed.split(",").map((k) => k.trim()).filter(Boolean);
    
    const entries: KeywordEntry[] = newKeywords.map((kw) => ({
      id: crypto.randomUUID(),
      value: kw,
      type: selectedType,
    }));
    
    setKeywords([...keywords, ...entries]);
    setInputValue("");
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter((k) => k.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  const startMonitoring = async () => {
    if (keywords.length === 0) {
      toast({
        title: "No keywords",
        description: "Please add at least one keyword to monitor.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);

    try {
      // Insert keywords into database
      const keywordInserts = keywords.map((k) => ({
        user_id: user!.id,
        keyword: k.value,
        keyword_type: k.type,
      }));

      const { data: insertedKeywords, error: keywordsError } = await supabase
        .from("keywords")
        .insert(keywordInserts)
        .select();

      if (keywordsError) throw keywordsError;

      // Create monitoring session
      const { data: session, error: sessionError } = await supabase
        .from("monitoring_sessions")
        .insert({
          user_id: user!.id,
          keywords_count: keywords.length,
          status: "scanning",
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Navigate to scanning page with session info
      navigate("/scanning", {
        state: {
          sessionId: session.id,
          keywordIds: insertedKeywords.map((k) => k.id),
          keywordValues: keywords.map((k) => k.value),
        },
      });
    } catch (error: any) {
      console.error("Scanning error:", error);
      toast({
        title: "Scan Failed",
        description: error.message || "An error occurred during scanning.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Search className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Keyword Monitoring</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Start Monitoring Your Data
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter keywords to monitor across dark web sources. We'll alert you immediately if any matches are found.
          </p>
        </div>

        {/* Keyword Type Selection */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="font-semibold text-foreground mb-4">Select Keyword Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {keywordTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                    selectedType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${selectedType === type.id ? "text-primary" : "text-foreground"}`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Keyword Input */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-foreground mb-4">Enter Keywords</h3>
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Enter keyword(s), separated by commas..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              disabled={isScanning}
            />
            <Button onClick={addKeyword} disabled={!inputValue.trim() || isScanning}>
              Add
            </Button>
          </div>

          {/* Keywords Display */}
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword.id}
                  variant="secondary"
                  className="px-3 py-1.5 gap-2 text-sm"
                >
                  <span className="capitalize text-xs text-muted-foreground">{keyword.type}:</span>
                  {keyword.value}
                  <button
                    onClick={() => removeKeyword(keyword.id)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No keywords added yet. Start typing above to add keywords to monitor.</p>
            </div>
          )}
        </div>

        {/* Start Monitoring Button */}
        <div className="text-center animate-slide-up" style={{ animationDelay: "300ms" }}>
          <Button
            size="lg"
            onClick={startMonitoring}
            disabled={keywords.length === 0 || isScanning}
            className="gap-2 px-8 py-6 text-lg"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning Dark Web Sources...
              </>
            ) : (
              <>
                Start Monitoring
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            {keywords.length} keyword{keywords.length !== 1 ? "s" : ""} will be monitored across 10+ dark web sources
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
