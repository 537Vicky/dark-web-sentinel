import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScanRequest {
  session_id: string;
  keyword_ids: string[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify JWT and get user
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    // Parse request body
    const { session_id, keyword_ids }: ScanRequest = await req.json();

    if (!session_id || !keyword_ids?.length) {
      return new Response(
        JSON.stringify({ error: "Missing session_id or keyword_ids" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch keywords
    const { data: keywords, error: keywordsError } = await supabase
      .from("keywords")
      .select("*")
      .in("id", keyword_ids);

    if (keywordsError) throw keywordsError;

    // Fetch dark web sources
    const { data: sources, error: sourcesError } = await supabase
      .from("dark_web_sources")
      .select("*")
      .eq("is_active", true);

    if (sourcesError) throw sourcesError;

    // Simulate scanning with realistic delays
    const alerts: any[] = [];
    const severities = ["low", "medium", "high", "critical"];
    const messages = {
      password: [
        "Password hash found in credential dump",
        "Plain text password detected in paste",
        "Credential pair exposed in forum post",
      ],
      email: [
        "Email found in phishing target list",
        "Email address in data breach compilation",
        "Corporate email detected in leak database",
      ],
      phone: [
        "Phone number in SMS phishing list",
        "Contact information exposed in breach",
        "Number found in social engineering database",
      ],
      credit_card: [
        "Card number detected in carding forum",
        "Payment data found in underground market",
        "Credit card info in financial breach dump",
      ],
      general: [
        "Keyword match found in dark web paste",
        "Data detected in underground forum",
        "Information exposed in breach archive",
      ],
    };

    // Simulate scanning each keyword against sources
    for (const keyword of keywords || []) {
      // Random probability of finding matches (30% chance per source)
      for (const source of sources || []) {
        const matchProbability = source.risk_level === "critical" ? 0.4 : 
                                  source.risk_level === "high" ? 0.3 : 
                                  source.risk_level === "medium" ? 0.2 : 0.1;

        if (Math.random() < matchProbability) {
          const type = keyword.keyword_type as keyof typeof messages;
          const messageList = messages[type] || messages.general;
          
          alerts.push({
            user_id: userId,
            session_id,
            keyword_id: keyword.id,
            source_id: source.id,
            keyword_text: keyword.keyword,
            source_name: source.name,
            severity: source.risk_level === "critical" ? "critical" :
                     source.risk_level === "high" ? "high" :
                     severities[Math.floor(Math.random() * 3)],
            message: messageList[Math.floor(Math.random() * messageList.length)],
            matched_content: `[REDACTED] ...${keyword.keyword.substring(0, 3)}*** detected...`,
          });
        }
      }
    }

    // Insert alerts if any found
    if (alerts.length > 0) {
      const { error: alertsError } = await supabase
        .from("alerts")
        .insert(alerts);

      if (alertsError) throw alertsError;
    }

    // Update monitoring session
    const { error: updateError } = await supabase
      .from("monitoring_sessions")
      .update({
        status: "completed",
        sources_scanned: sources?.length || 0,
        alerts_generated: alerts.length,
        completed_at: new Date().toISOString(),
      })
      .eq("id", session_id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        alerts_count: alerts.length,
        sources_scanned: sources?.length || 0,
        keywords_processed: keywords?.length || 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Scan error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
