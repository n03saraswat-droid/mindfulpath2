import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OnboardingQuestionnaire from "@/components/OnboardingQuestionnaire";

const Onboarding = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  const { data: prefs, isLoading } = useQuery({
    queryKey: ["user-preferences", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_preferences").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (prefs) navigate("/app?section=recommendations", { replace: true });
  }, [prefs, navigate]);

  if (loading || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden flex items-center justify-center p-4 py-10">
      <div className="pointer-events-none absolute top-10 -left-24 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-10 -right-24 w-[28rem] h-[28rem] bg-accent/25 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      <div className="relative z-10 w-full">
        <OnboardingQuestionnaire
          title="Welcome to Mindful Path"
          submitLabel="Create my plan"
          onComplete={() => navigate("/app?section=recommendations", { replace: true })}
        />
      </div>
    </div>
  );
};

export default Onboarding;
